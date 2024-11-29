import {useEffect, useState} from "react";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {BBQCancelled, BBQPlanned, RoomAdded} from "@/app/slices/Events";
import {isSameDay, normalizeToMidnight} from "@/app/util/dates";

export type PlanBBQ = Command<'PlanBBQ', {
    date: Date
}>

export const plannedBBQStateViews = (events: Event[]) => {
    let bbqs: { date: Date, cancelled: boolean }[] = []
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

const planBBQCommandHandler = async (events: Event[], command: PlanBBQ): Promise<Event[]> => {

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
    const [plannedBBQs, setPlannedBBQs] = useState<{ date: Date, cancelled: boolean }[]>([])

    useEffect(() => {
        subscribeStream('Inventory', async () => {
            let result = await findEventStore().readStream('Inventory')
            let events = result?.events ?? []
            setPlannedBBQs(plannedBBQStateViews(events))
        })
    }, []);

    return <div className={"box"}>
        <h3>Plan next BBQ</h3>
        <small>Only one BBQ per day</small>
        <input className={"m-3"} type={"date"} value={date?.toISOString().split("T")[0] || ""}
               onChange={(evt) => setDate(evt.target.valueAsDate!!)}/>
        <div className={"control"}>
            <button onClick={async () => {
                if (date) {
                    let events = await findEventStore().readStream("Inventory")

                    let resultEvents = await planBBQCommandHandler(events?.events || [], {
                        type: 'PlanBBQ', data: {
                            date: date!!
                        }
                    })
                    await findEventStore().appendToStream("Inventory", resultEvents)
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