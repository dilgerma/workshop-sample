import {Event} from "@event-driven-io/emmett";
import {AttendantAssigned, InventoryEvents} from "@/app/api/Events";
import {isToday} from "@/app/util/dates";
import {useEffect, useState} from "react";
import {findEventStore, subscribeStream, unsubscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Streams} from "@/app/api/Streams";

const cleaningScheduleStateView = (state:{ roomName: string, attendantName: string }[], events: Event[]): { roomName: string, attendantName: string }[] => {
    let result: { roomName: string, attendantName: string }[] = state || []
    events.forEach((event) => {
        if (event.type === 'AttendantAssigned') {
            let attendantAssigned = event as AttendantAssigned;
            if (isToday(attendantAssigned.data.date)) {
                result.push({
                    roomName: attendantAssigned.data.roomName,
                    attendantName: attendantAssigned.data.attendantName
                });
            }
        }
    });
    return result
}

export const CleaningscheduleUI = () => {

    const [cleaningSchedule, setCleaningSchedule] = useState<{ roomName: string, attendantName: string }[]>([])

    useEffect(() => {
        let subscription = subscribeStream(Streams.Inventory, async (nextExpectedStreamVersion, events:InventoryEvents[]) => {
            setCleaningSchedule((prevState) =>
                cleaningScheduleStateView(prevState, events))
        });
        return () => unsubscribeStream(Streams.Inventory, subscription)
    }, []);

    return <div className={"box"}>
          <div >
            <h3>Cleaning Schedule <br/>({new Date().toLocaleDateString("en")})</h3>
              {cleaningSchedule.length>0 ?<ul>
                {cleaningSchedule.map((value) => {
                    return <li>Room: {value.roomName}, Attendant: {value.attendantName}</li>
                })}
            </ul> : <span/>}
        </div>
    </div>
}