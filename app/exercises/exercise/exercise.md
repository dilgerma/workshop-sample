


## Exercise

In this exercise, we will add the possibility to book a room.
A room is booked by it´s name and can only be booked once. 
A bookable room must have been added before.

### Step 1 - Implement the "Available Rooms" State View Slice

We will build the Read Model to project available rooms to be selected.
You can add Rooms, but they do not show up in the drop-down menu.

For this, you will need to implement 'availableRoomsStateView' Function.

The Read Model expects this data structure:
```
type AvailableRoom = {
    number: string,
    name: string
}
```

You need to project the information in the Events to this structure.

Hint - if a Room is booked, it should no longer be selectable.
How can you project this information correctly?

```
const availableRoomsStateView = (events: InventoryEvents[]): AvailableRoom[] => {
    let result: AvailableRoom[] = []
    events.forEach((event) => {
        /*
        FOR EACH EVENT - adjust the result-array.
        If a Room is added, append it to the array. ( result.push(...) )
        If a Room is booked, remove it from the array. ( result = result.filter(...) )
         */
    })
    return result
}
```


