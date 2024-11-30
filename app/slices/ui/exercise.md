


## Bookable Rooms

In this exercise, we will first define another state view for bookable rooms and build a comprehensive test suite for our 
state view.

If you click "Run Testcases" you will see, that there are a lot of red test cases.

Using "Given / When / Then" or "Given / Then" allows us to set the system into a certain state and
verify behavior.

### Step 1 - Implement the State View for bookable rooms

Only rooms that have been added can be booked.
Only available rooms can be booked.

Implement the state view in **"app/slices/bookablerooms/bookableRoomStateView.tsx"**

```
export const bookableRoomsStateView = (events: InventoryEvents[], from: Date, to: Date): AvailableRoom[] => {
    let result: AvailableRoom[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
               // add the 'available room' to result
            case "RoomBooked":
               // room is no longer available. Remove it from the list. Make sure to take from / to Dates into account
        }
    })
    return result
}
```

The Logic to remove the room from the list could look like this:
```
result = result.filter(it =>
     it.name != event.data.name || (event.data.to < from || event.data.from > to)
);
```

<iframe width="800" height="509" src="https://www.loom.com/embed/ee0c48fc074449a3bb24ec14f56a7dad?sid=f8b67f9b-42fa-4a4f-9589-4262bf8472e0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### Step 2 - Test your state view

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

<iframe width="800" height="509" src="https://www.loom.com/embed/6c69dbc01da9401786152f9069e3d6b2?sid=796b6e17-f68a-4f7d-9886-5f0e2fdfa3ba" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>