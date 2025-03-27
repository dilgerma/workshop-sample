import {useEffect, useState} from "react";
import {findEventStore, subscribeStream, unsubscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {BBQCancelled, BBQPlanned, RoomAdded} from "@/app/api/Events";
import {isSameDay, normalizeToMidnight} from "@/app/util/dates";
import {Streams} from "@/app/api/Streams";

export type PlanBBQ = Command<'PlanBBQ', {
    date: Date
}>

export type BBQ =  { date: Date, cancelled: boolean }
export const plannedBBQStateViews = (state: BBQ[], events: Event[]): BBQ[] => {
    let bbqs:BBQ[] = state
    events.forEach((event: Event) => {
        switch (event.type) {
            case 'BBQPlanned':
                let bbqPlanned = event as BBQPlanned
                bbqs.push({date: bbqPlanned.data.date, cancelled: false})
                return
            case 'BBQCancelled':
                let bbqCancelled = event as BBQCancelled
                let bbq = bbqs.find(bbq => isSameDay(bbq.date, bbqCancelled.data.date))
                if (bbq) {
                    bbq.cancelled = true
                }
                return
        }
    })
    return bbqs
}

const planBBQCommandHandler = (events: Event[], command: PlanBBQ): Event[] => {

    var plannedBBQs = events.filter(it => it.type == "BBQPlanned").reduce((acc: Date[], event: Event) => {
        acc.push((event as BBQPlanned).data.date);
        return acc; // Return the updated accumulator
    }, []);

    if (!plannedBBQs.some(date => isSameDay(date, command.data.date))) {
        return [{
            type: 'BBQPlanned',
            data: {
                date: command.data.date
            }
        } as BBQPlanned];
    } else {
        throw Error("Cannot plan more than 1 BBQ per day")
    }

}

export default function PlanBBQ() {

    const [date, setDate] = useState<Date | null>()
    const [plannedBBQs, setPlannedBBQs] = useState<BBQ[]>([])

    useEffect(() => {
        let subscription = subscribeStream(Streams.Weather, async (nextExpectedStreamVersion, _:Event[]) => {
            let events = await findEventStore().readStream(Streams.BBQ)
            setPlannedBBQs((state)=>plannedBBQStateViews([],events?.events||[]))
        })
        return ()=>unsubscribeStream(Streams.BBQ, subscription)
    }, []);
    useEffect(() => {
        let subscription = subscribeStream(Streams.BBQ, async (nextExpectedStreamVersion, _:Event[]) => {
            let events = await findEventStore().readStream(Streams.BBQ)
            setPlannedBBQs((state)=>plannedBBQStateViews([],events?.events||[]))
        })
        return ()=>unsubscribeStream(Streams.BBQ, subscription)
    }, []);

    return <div className={"box"}>
        <h3>Plan next BBQ</h3>
        <small>Only one BBQ per day</small>
        <input className={"m-3"} type={"date"} value={date?.toISOString().split("T")[0] || ""}
               onChange={(evt) => setDate(evt.target.valueAsDate!!)}/>
        <div className={"control"}>
            <button onClick={async () => {
                if (date) {
                    let events = await findEventStore().readStream(Streams.BBQ)

                    let resultEvents = planBBQCommandHandler(events?.events || [], {
                        type: 'PlanBBQ', data: {
                            date: date!!
                        }
                    })
                    await findEventStore().appendToStream(Streams.BBQ, resultEvents)
                    setDate(null)
                }

            }} className={"button is-info m-2"}>Plan BBQ
            </button>
        </div>
        {plannedBBQs?.length > 0 ? <div className={"m-2"}>
            <h3>Planned BBQs</h3>
            <ul>
                {plannedBBQs?.map(bbq => {
                    return bbq?.cancelled == true ? <s>
                            <li>{bbq.date?.toDateString()}</li>
                        </s> :
                        <li>{bbq.date.toLocaleDateString()}</li>
                })}
            </ul>
        </div> : <span/>}

    </div>
}