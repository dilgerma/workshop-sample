import {Event} from "@event-driven-io/emmett";
import {AttendantAssigned} from "@/app/slices/Events";
import {isToday} from "@/app/util/dates";
import {useEffect, useState} from "react";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";

const cleaningScheduleStateView = (events: Event[]): { roomName: string, attendantName: string }[] => {
    let result: { roomName: string, attendantName: string }[] = [];
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
        subscribeStream('Inventory', async () => {
            var stream = await findEventStore().readStream('Inventory');
            setCleaningSchedule(cleaningScheduleStateView(stream?.events || []))
        });
    }, []);

    return <div className={"box disabled"}>
          <div >
            <h3>Cleaning Schedule <br/>({new Date().toLocaleDateString()})</h3>
              {cleaningSchedule.length>0 ?<ul>
                {cleaningSchedule.map((value) => {
                    return <li>Room: {value.roomName}, Attendant: {value.attendantName}</li>
                })}
            </ul> : <span/>}
        </div>
    </div>
}