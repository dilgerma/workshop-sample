


## Exercise

In Exercise.tsx, we want to be able to add a Room.
For this, uncomment this block in Exercise.tsx

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
- floor
- roomNumber

```
// STEP 2 - IMPLEMENT THE COMMAND HANDLER
findEventStore().appendToStream(
    'Inventory',
    [{} as RoomAdded]
)
```

### Step 3

Apply the Command when the Admin clicks the button.

```
commandHandler(
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

Add Room 'Sunshine' and Room 'Moonshine' and verify the result.

Use the stream name 'Inventory'

Make sure to verify the applied events in the eventstore.