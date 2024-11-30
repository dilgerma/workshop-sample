


## Exercise

In our new Hotel System - we need to register rooms so we can rent them to customers.

**We are working in /app/slices/addroom/AddRoom.tsx**

In AddRoom.tsx, we want to be able to add a Room.
For this, uncomment this block. This reveals a Command.


```javascript
// STEP 1 - UNCOMMNENT THIS BLOCK
/*export type AddRoomCommand = Command<
    'AddRoom',
    {
        roomNumber: string,
        floor: number
    }
>;*/
```

### Step 2

Implement the Commmand Handler.

Apply the variables from the input fields:

- name
- costPerNight
- roomNumber

Remember: You have access to the Eventstore using findEventStore()

You can load all Events from a Stream using this code snippet:
```
 let result = await findEventStore().readStream("Inventory")
 let events = result?.events || []
```

```
// STEP 2 - IMPLEMENT THE COMMAND HANDLER
findEventStore().appendToStream(
    'Inventory',
    [{} as RoomAdded]
)
```

Think for a minute. What validations would make sense?

### Step 3

Apply the Command when the Admin clicks the button.

```
addRoomCommandHandler(
    {
        data: {
            name: roomName
            ...
        },
        type: 'EventType' 
    }
)
```

### Verify

<div style="position: relative; padding-bottom: 63.52941176470588%; height: 0;"><iframe src="https://www.loom.com/embed/ce8d51a94b8b4f1ab7d4711b1759115b?sid=b4e6a7e4-d9c3-4a6f-826a-980eb5812c27" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

Add Room 'Sunshine' and Room 'Moonshine' and verify the result.

Use the stream name 'Inventory'

Make sure to verify the applied events in the eventstore.