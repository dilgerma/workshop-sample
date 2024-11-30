


## Exercise 6

In this exercise, we will implement a simple Translation Pattern. 

Our Hotel offers BBQs once a week.
BBQs are planned in advance but are strongly affected by the weather conditions.

If there is a bad weather forecast, BBQs are automatically cancelled.

<iframe width="800" height="444" src="https://www.loom.com/embed/45401a9d23ac4976b578534488fd9094?sid=985b98f6-1e57-4473-9da0-0ef7a1826fdd" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

Weather Forecasts have a dedicated eventstream "Weather" in our Eventstore.
Weather forecasts could as well come via an Webhook, API Call or Kafka Record.

### Step 1 - Implement the processor logic

Implement the logic in app/slices/weatherforecast/weatherForecastProcessor.ts

You can use the "isSameDay"-Helper function from "util"
BBQ is cancelled if there is a bad weather forecast for the same day.

```
const forecastGivenEvent = event as WeatherForecastedGiven;
const plannedBBQ = // find all planned BBQs for a given day
if (plannedBBQ && forecastGivenEvent.data.forecast == Forecast.BAD) {
    // execute command
    await findEventStore().appendToStream('Inventory', resultEvents);
}

```

