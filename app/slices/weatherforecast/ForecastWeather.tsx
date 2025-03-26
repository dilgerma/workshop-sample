import {useEffect, useState} from "react";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Command, Event} from "@event-driven-io/emmett";
import {Forecast, WeatherForecastedGiven} from "@/app/api/Events";
import {weatherForecastProcessor} from "@/app/slices/weatherforecastprocessor/weatherForecastProcessor";
import {Streams} from "@/app/api/Streams";


export type ForecastWeather = Command<'ForecastWeather', {
    date: Date,
    forecast: Forecast
}>

const weatherForeastCommandHandler = (events: Event[], command: ForecastWeather): Event[] => {
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
        subscribeStream(Streams.Weather, async (_, events)=>{
            await weatherForecastProcessor()
        })
    }, []);

    return <div className={"content box has-background-warning"}>
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
                   let resultEvents = weatherForeastCommandHandler([], {
                        type: "ForecastWeather",
                        data: {
                            date: date,
                            forecast: forecast
                        }
                    });
                    await findEventStore().appendToStream(Streams.Weather,resultEvents)
                }

            }} className={"button is-info m-2"}>Forecast</button>
        </div>
    </div>
}