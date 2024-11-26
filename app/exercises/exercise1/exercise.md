## Preconditions

Make sure you started the app using

```bash
npm install
npm run dev
```

## Exercise description

Implement the command handler in exercise1/commandHandler.tsx

Make sure to handle all event types necessary.

```javascript
switch (event.type) {
    case "AddRoom":
        findEventStore().appendToStream('Inventory', [{
            data: {
                roomNumber: command.data.roomNumber,
                floor: command.data.floor
            }, type: "RoomAdded"
        } as RoomAdded])
        return
}
```

## Follow the instructions in this video

<div style="position: relative; padding-bottom: 64.67065868263472%; height: 0;"><iframe src="https://www.loom.com/embed/2386bcea683d4b60bef36b5af310ee61?sid=5622470a-9b02-48a4-9da1-c2cbd8f69314" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 50%; height: 50%;"></iframe></div>