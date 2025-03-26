import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {plannedBBQStateViews} from "@/app/slices/bbq/PlanBBQ";
import {Command, Event} from "@event-driven-io/emmett"
import {BBQCancelled, Forecast, WeatherForecastedGiven} from "@/app/api/Events";
import {isSameDay} from "@/app/util/dates";
import {Streams} from "@/app/api/Streams";

type CancelBBQ = Command<'CancelBBQ', {
    date: Date,
    forecast: Forecast
}>

const cancelBBQCommandHandler = (events: Event[], command: CancelBBQ): Event[] => {

    return [
        {
            type: 'BBQCancelled',
            data: {
                date: command.data.date,
                forecast: command.data.forecast
            }
        } as BBQCancelled
    ]

}

export const weatherForecastProcessor = async () => {

    let bbqResult = await findEventStore().readStream(Streams.BBQ)
    let bbqEvents = bbqResult?.events ?? []

    let weatherResult = await findEventStore().readStream(Streams.Weather)
    let weatherEvents = weatherResult?.events ?? []

    let plannedBBQs = plannedBBQStateViews([],bbqEvents)
    for (const event of weatherResult?.events ?? []) {
        switch (event.type) {
            case 'WeatherForecastedGiven':
                const forecastGivenEvent = event as WeatherForecastedGiven;
                const plannedBBQ = plannedBBQs.find(bbq => isSameDay(bbq.date, forecastGivenEvent.data.date));
                if (plannedBBQ && forecastGivenEvent.data.forecast == Forecast.BAD) {
                    const resultEvents = cancelBBQCommandHandler(weatherEvents, {
                        type: 'CancelBBQ',
                        data: {
                            date: forecastGivenEvent.data.date,
                            forecast: forecastGivenEvent.data.forecast
                        }
                    });
                    await findEventStore().appendToStream(Streams.Inventory, resultEvents);
                }
                break;
        }
    }

}