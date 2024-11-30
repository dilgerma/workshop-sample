import {useEffect, useState} from "react";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {BBQCancelled, BBQPlanned, Forecast, RoomAdded, WeatherForecastedGiven} from "@/app/slices/Events";
import {normalizeToMidnight} from "@/app/util/dates";
import {weatherForecastProcessor} from "@/app/slices/weatherforecastprocessor/weatherForecastProcessor";


export type ForecastWeather = Command<'ForecastWeather', {
    date: Date,
    forecast: Forecast
}>

const weatherForeastCommandHandler = async (events: Event[], command: ForecastWeather): Promise<Event[]> => {
    return [{
        type: 'WeatherForecastedGiven',
        data: {
            date: command.data.date,
            forecast: command.data.forecast
        }
    } as WeatherForecastedGiven]

}

export default function WeatherForecast() {

    const [date, setDate] = useState<Date | null>()
    const [forecast, setForecast] = useState<Forecast>()

    useEffect(() => {
        subscribeStream('Weather', async (_, events)=>{
            await weatherForecastProcessor(events)
        })
    }, []);

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
            <button onClick={async () => {
                if (date && forecast) {
                   let resultEvents = await weatherForeastCommandHandler([], {
                        type: "ForecastWeather",
                        data: {
                            date: date,
                            forecast: forecast
                        }
                    });
                    await findEventStore().appendToStream('Weather',resultEvents)
                }

            }} className={"button is-info m-2"}>Forecast</button>
        </div>
    </div>
}