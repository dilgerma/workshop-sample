import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {plannedBBQStateViews} from "@/app/slices/bbq/PlanBBQ";
import {Command, Event} from "@event-driven-io/emmett"
import {BBQCancelled, Forecast, WeatherForecastedGiven} from "@/app/slices/Events";
import {isSameDay} from "@/app/util/dates";

type CancelBBQ = Command<'CancelBBQ', {
    date: Date,
    forecast: Forecast
}>

const cancelBBQCommandHandler = async (events: Event[], command: CancelBBQ): Promise<Event[]> => {

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

export const weatherForecastProcessor = async (events: Event[]) => {

    let result = await findEventStore().readStream('Inventory')
    let inventoryEvents = result?.events ?? []

    let plannedBBQs = plannedBBQStateViews(inventoryEvents)
    for (const event of events) {
        switch (event.type) {
            case 'WeatherForecastedGiven':
                const forecastGivenEvent = event as WeatherForecastedGiven;
                const plannedBBQ = plannedBBQs.find(bbq => isSameDay(bbq.date, forecastGivenEvent.data.date));
                if (plannedBBQ && forecastGivenEvent.data.forecast == Forecast.BAD) {
                    const resultEvents = await cancelBBQCommandHandler(inventoryEvents, {
                        type: 'CancelBBQ',
                        data: {
                            date: forecastGivenEvent.data.date,
                            forecast: forecastGivenEvent.data.forecast
                        }
                    });
                    await findEventStore().appendToStream('Inventory', resultEvents);
                }
                break;
        }
    }

}