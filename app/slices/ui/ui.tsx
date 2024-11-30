import {useState} from "react";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import BookRooms from "@/app/slices/bookroom/bookRooms";
import AddRoom from "@/app/slices/addroom/AddRoom";
import AddAttendant from "@/app/slices/attendant/AddAttendant";
import {CleaningscheduleUI} from "@/app/slices/cleaningschedule/cleaningschedule";
import PlanBBQ from "@/app/slices/bbq/PlanBBQ";
import WeatherForecast from "@/app/slices/weatherforecast/ForecastWeather";
import {Payment} from "@/app/slices/payment/Payment";

const markdown = require('!raw-loader!./exercise.md').default;



export default function Ui() {

    const [roomsToClean, setRoomsToClean] = useState<string[]>()
    const [attendants, setAttendants] = useState<string[]>()

    return <div className={"content"}>
        <details>
            <MarkdownViewer markdown={markdown}/>
        </details>
        <div className={"columns"}>
            <div className={"column is-one-third padding control"}>
                <AddAttendant/>
                <AddRoom/>
                <BookRooms/>
            </div>
            <div className={"column is-one-third "}>
                <CleaningscheduleUI/>
                <PlanBBQ/>
                <Payment/>


            </div>
            <div className={"column"}>
                <WeatherForecast/>
            </div>
        </div>


    </div>
}
