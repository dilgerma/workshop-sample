import {useEffect, useState} from "react";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import BookRooms from "@/app/slices/bookroom/bookRooms";
import AddRoom from "@/app/slices/addroom/AddRoom";
import {AttendantAdded, AttendantAssigned, InventoryEvents, RoomBooked} from "@/app/slices/Events";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import AddAttendant from "@/app/slices/attendant/AddAttendant";
import {Command, Event} from "@event-driven-io/emmett";
import {isToday, isWithinRange} from "@/app/util/dates";
import {CleaningscheduleUI} from "@/app/slices/cleaningschedule/cleaningschedule";
import PlanBBQ from "@/app/slices/bbq/PlanBBQ";
import WeatherForecast from "@/app/slices/weatherforecast/ForecastWeather";
import {Payment} from "@/app/slices/payment/Payment";
import {
    attendantScheduleProcessor,
    availableAttendantsStateView,
    roomsToCleanStateView
} from "@/app/slices/assignAttendant/assignAttendantProcessor";

const markdown = require('!raw-loader!./exercise.md').default;



export default function Ui() {

    const [roomsToClean, setRoomsToClean] = useState<string[]>()
    const [attendants, setAttendants] = useState<string[]>()

    useEffect(() => {
        const intervalId = setInterval(async () => {
            await attendantScheduleProcessor(new Date())
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        subscribeStream("Inventory", () => {
            findEventStore().readStream("Inventory").then(events => {
                let roomsToClean = roomsToCleanStateView(events?.events as InventoryEvents[] || [])
                setRoomsToClean(roomsToClean)
            })
        })

        subscribeStream("Inventory", () => {
            findEventStore().readStream("Inventory").then(events => {
                let attendants = availableAttendantsStateView(events?.events as InventoryEvents[] || [])
                setAttendants(attendants)
            })
        })

    }, []);

    return <div className={"content"}>
        <div className={"columns"}>
            <div className={"column is-one-third padding control"}>
                <AddAttendant/>
                <AddRoom/>
                <BookRooms/>
            </div>
            <div className={"column is-one-third "}>
                {roomsToClean?.length??0 > 0 ?  <div className={"box"}>
                    <h3>Rooms to clean</h3>
                    <ul>
                        {roomsToClean?.map(room => {
                            return <li>{room}</li>
                        })}
                    </ul>
                </div> : <span/>}
                {attendants?.length??0 > 0 ? <div className={"box"}>
                    <h3>Attendants available today</h3>
                    <ul>
                        {attendants?.map(room => {
                            return <li>{room}</li>
                        })}
                    </ul>
                </div> : <span/>}
                <CleaningscheduleUI/>
                <PlanBBQ/>
                <Payment/>


            </div>
            <div className={"column"}>
                <WeatherForecast/>

            </div>
        </div>

        <details>
            <MarkdownViewer markdown={markdown}/>
        </details>
    </div>
}
