


## Exercise 5

In this exercise, we will implement a first automation. 

Whenever a room is booked **today**, it has to be assigned for an Attendant to clean.
The automation builds a cleaning schedule for the day by assigning attendants in the background on the data provided.

<iframe width="800" height="444" src="https://www.loom.com/embed/942a144c42ea45a88f8c6608f6aa2416?sid=4d33dc05-db71-4a0d-a0fb-f1b97cefb20b" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### Implemenet the processor

In "app/slices/assignAttendant/assignAttendantProcessor.tsx", you´ll need to implement the 
processor logic based on the state views already configured.

```
for (const room of roomsToClean) {

        if (availableAttendants.length > 0) {
            // Call commandHandler for each room and assign the current attendant
            // execute assign attendant command
        }

    }
```

This is an implementation of a simple Polling processor, that continuously runs every day ( or in our case every 10 seconds ).

The processor is registered in **app/slices/ui/ui.tsx**

```
useEffect(() => {
    const intervalId = setInterval(async () => {
        await attendantScheduleProcessor(new Date())
    }, 10000);

    return () => clearInterval(intervalId);
}, []);
```