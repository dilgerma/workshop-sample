import {useState} from "react";
import {Forecast} from "@/app/slices/Events";

export default function WeatherForecast() {

    const [date, setDate] = useState<Date | null>()
    const [forecast, setForecast] = useState<Forecast>()

    return <div className={"content box has-background-warning disabled"}>
        <h3>Weather Forecast</h3>
        <input className={"m-3"} type={"date"} value={date?.toISOString().split("T")[0] || ""}
               onChange={(evt) => setDate(evt.target.valueAsDate!!)}/>
        <select value={forecast} onChange={(evt) => setForecast(evt.target.value as Forecast)}>
            <option>Choose forecast</option>
            <option value={Forecast.BAD}>{Forecast.BAD}</option>
            <option value={Forecast.GOOD}>{Forecast.GOOD}</option>
            <option value={Forecast.NEUTRAL}>{Forecast.NEUTRAL}</option>
        </select>
        <div className={"control"}>
            <button onClick={() => {
            }} className={"button is-info m-2"}>Forecast</button>
        </div>
    </div>
}