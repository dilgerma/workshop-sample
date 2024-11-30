


## AddRoomTest

In this exercise, 2 simple test cases are prepared using "Given / When / Then" in 
**app/slices/bookableRooms/bookRoomTest.tsx**

Test Cases always look the same.

```
{
    test_name: <describe your test case>,
    given: [
        < list of events >
    ],
    expectError: < define if you expect an error >
    when: async (history: Event[]): Promise<Event[]> => {
        < call the command handler >
    },
    verifyThen: (result: Event[]) => {
        < verify the resulting events>
    }
},
```

### Step 1 - Run the tests and implement validation

<iframe width="800" height="518" src="https://www.loom.com/embed/c6900dcb79ae4c8e977301f405ffe281?sid=f68792f2-cf9b-48aa-9a00-6cf3d1ce5f6a" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

Run the application and verify that both test cases are red.

To get the test cases green, you need to implement the buiness logic and
validation.

In **app/slices/bookRoom/bookRoom.tsx** - implement the necessary 
validation so no room is booked twice.

```
if (event.data.name == command.data.name &&
    command.data.fromDate <= event.data.to &&
    command.data.toDate >= event.data.from) {
    // handle properly
}
```

### Step 2 - Apply Events

Only if the validation succeeds, events are applied.

Return the list of applied Events from the command handler.


```
return [{
        type: 'RoomBooked',
        data: {
            id: v4(),
            // implement
        }
    }]
```

