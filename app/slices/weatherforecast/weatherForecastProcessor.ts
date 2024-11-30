import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {plannedBBQStateViews} from "@/app/slices/bbq/PlanBBQ";
import {Command, Event} from "@event-driven-io/emmett"
import {BBQCancelled, Forecast, WeatherForecastedGiven} from "@/app/slices/Events";
import {isSameDay} from "@/app/util/dates";

type CancelBBQ = Command<'CancelBBQ', {
    date: Date,
    forecast: Forecast
}>

export const weatherForecastProcessor = async (events: Event[]) => {

    let result = await findEventStore().readStream('Inventory')
    let inventoryEvents = result?.events ?? []

    let plannedBBQs = plannedBBQStateViews(inventoryEvents)

    for (const event of events) {
        switch (event.type) {
            case 'WeatherForecastedGiven':
                // STEP 1
                // implement logic
                // a bad weather forecast should execute the cancelBBQ Command
                break;
        }
    }

}

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
