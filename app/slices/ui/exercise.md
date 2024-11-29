


## Ui

In this exercise, you will again build a set of test cases, but this time for a state change slice.

Instead of "Given / When" in the last exercise, testing state changes requires "Given / When / Then"

Given a set of Events

When a command gets executed

Then we expect the system to be in a new state

### Step 1 - Implement the state history

In TestRunner.tsx - provide sample history of events.
This should be all the events that make up the history for this slice.

```
 sample_history: [
            // STEP 1 - add sample event history
            //{type: 'RoomAdded', data: {name: "Moonshine", roomNumber: "1a", floor: 1}},
            // book "Moonshine"
            // try to book "Moonshine" twice
        ],
```

### Step 2 - Implement the correct assertions

Based on the event history, you will need to provide the correct 
assertions to make the test cases green.

We need to implement at least 2 test cases.

Book a room that was added

Try to book a room twice

```
{
    test_name: "Added Room should result in room booked event",
    // how many events to take from the history
    event_count: 1,
    
    test: (events:Event[], command?:BookRoomCommand) => {
      
      // execute the commandHandler
      const result = commandHandler(events, command!!);
      
      // assert on state - result are the resulting events
        assert(result.length == 1, "")
        assert(result[0].type == 'RoomBooked', "")
    },
    
    command: {type: 'BookRoom', data: {
            name: "Moonshine",
        }}
}
```