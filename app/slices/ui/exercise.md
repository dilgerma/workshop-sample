


## AddRoomTest

In this exercise, we will build a comprehensive test suite for our 
state view slice from the last exercise.

If you click "Run Testcases" you will see, that there are a lot of red test cases.

Using "Given / When / Then" or "Given / Then" allows us to set the system into a certain state and
verify behavior.

### Step 1 - Implement the state history

In **app/slices/bookableRooms/bookableRoomStateViewTest.tsx** - provide sample history of events.
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

- event_count - defines how many events of your history should be taken into account.
- test(history) - is the actual test case given the history

Define the assertions and meaningful test cases.


```
{
    test_name: "two rooms added should return both rooms in correct order",
    event_count: 2,
    test: (history) => {
        // STEP 2 - implement conditions
        const result = bookableRoomsStateView(history);
        //assert(, "Two rooms should be returned");
        //assert(, "First room should be Moonshine");
        //assert(, "Second room should be Sunshine");
        assert(false, "Implement me")
    }
},
```

<div style="position: relative; padding-bottom: 63.52941176470588%; height: 0;"><iframe src="https://www.loom.com/embed/6c69dbc01da9401786152f9069e3d6b2?sid=b2fee16a-28de-48c5-a4a7-86ab9c795989" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>