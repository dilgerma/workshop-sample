


## Exercise 2

Implement the state view to display a list of registered rooms.

### Step 1 - Implement the state history

We work in app/slices/addroom/AddRoom.tsx

```
let roomsStateView = (events: InventoryEvents[]): { name: string, pricePerNight: number, roomNumber: string }[] => {

    let result: { name: string, pricePerNight: number, roomNumber: string }[] = []
    /*
     * STEP 1 - implement the State View to list all rooms available.
     * Use forEach(events) and process 'RoomAdded' Events.
     * 
     * Check for event.type == 'RoomAdded'
     */
    return result

}
```

<div style="position: relative; padding-bottom: 63.52941176470588%; height: 0;"><iframe src="https://www.loom.com/embed/bd57206a4dbd4dbcaf06a2ab0fee46dc?sid=faa7c87f-996c-484b-972c-309051d87eb7" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>