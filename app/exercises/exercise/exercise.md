


## Exercise

In this exercise, we will build a comprehensive test suite for our 
state view slice from the last exercise.

If you click "Run Testcases" you will see, that besides there are a lot of red test cases.

Using "Given / When / Then" or "Given / Then" allows us to set the system into a certain state.

### Step 1 - Implement the state history

In TestRunner.tsx - provide sample history of events.
This should be all the events that make up the history for this slice.

```
sample_history: [
            {type: 'RoomAdded', data: {name: "Moonshine", roomNumber: "1a", floor: 1}},
            // STEP 1 - add sample event history
            // add another room named "Sunshine"
            // add another room namde "Luna"
            // book "Moonshine"
        ],
```

### Step 2 - Implement the correct assertions

Based on the event history, you will need to provide the correct 
assertions to make the test cases green.

```
{
    test_name: "two rooms added should return both rooms in correct order",
    event_count: 2,
    test: (history) => {
        // STEP 2 - implement conditions
        const result = slice(history);
        //assert(, "Two rooms should be returned");
        //assert(, "First room should be Moonshine");
        //assert(, "Second room should be Sunshine");
        assert(false, "Implement me")
    }
},
```