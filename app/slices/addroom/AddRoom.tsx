import {useEffect, useState} from "react";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {InventoryEvents, RoomAdded} from "@/app/slices/Events";

export type AddRoomCommand = Command<'AddRoom', {
    name: string,
    costPerNight: number,
    roomNumber: string
}>

const addRoomCommandHandler = (events: Event[], command: AddRoomCommand) => {

    var addedRooms = events.filter(it => it.type == "RoomAdded").reduce((acc: string[], event: Event) => {
        acc.push((event as RoomAdded).data.name);
        return acc; // Return the updated accumulator
    }, []);

    if (!addedRooms.includes(command.data.name)) {
        findEventStore().appendToStream('Inventory', [{
            type: 'RoomAdded',
            data: {
                name: command.data.name,
                roomNumber: command.data.roomNumber,
                costPerNight: command.data.costPerNight
            }
        } as RoomAdded]);
    } else {
        throw Error("Cannot add room twice")
    }

}

let roomsStateView = (events: InventoryEvents[]): { name: string, pricePerNight: number, roomNumber: string }[] => {

    let result: { name: string, pricePerNight: number, roomNumber: string }[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
                result.push({
                    name: event.data.name,
                    roomNumber: event.data.roomNumber,
                    pricePerNight: event.data.costPerNight
                })
        }
    })
    return result

}

export default function AddRoom() {

    const [roomNumber, setRoomNumber] = useState<string>()
    const [roomName, setRoomName] = useState<string>()
    const [costPerNight, setCostPerNight] = useState<number>()
    const [rooms, setRooms] = useState<{ name: string, pricePerNight: number, roomNumber: string }[]>()

    useEffect(() => {
        subscribeStream("Inventory", async (_)=>{
            let result = await findEventStore().readStream("Inventory")
            let events = result?.events

            setRooms(roomsStateView(events as InventoryEvents[]))
        })
    }, []);

    return <div className={"content box"}>
        <h3>Add Room</h3>
        <small>An administrator can add available rooms</small>
        <input
            value={roomName}
            onChange={(evt) => setRoomName(evt.target.value)}
            required={true}
            className="input is-link is-half"
            type="text"
            placeholder="Room Name"
        />
        <input
            value={roomNumber}
            onChange={(evt) => setRoomNumber(evt.target.value)}
            required={true}
            className="input is-link is-half"
            type="text"
            placeholder="Room Number"
        />
        <input
            required={true}
            value={costPerNight}
            onChange={(evt) => setCostPerNight(Number(evt.target.value))}
            className="input is-half"
            type="number"
            placeholder="Cost per night"
        />
        <div className={"control"}>
            <button onClick={async () => {

                if (roomName && costPerNight && roomNumber) {
                    let result = await findEventStore().readStream("Inventory")
                    let events = result?.events || []
                    addRoomCommandHandler(events, {
                        type: 'AddRoom', data: {
                            name: roomName!!,
                            costPerNight: costPerNight,
                            roomNumber: roomNumber!!
                        }
                    })
                    setRoomName("")
                    setCostPerNight(Number(""))
                    setRoomNumber("")
                }

            }} className={"button is-info m-2"}>Add Room
            </button>
            <div>
                <h3>Rooms</h3>
                {rooms?.map((room)=>{
                    return <div>{room.name} / {room.pricePerNight}</div>
                })}
            </div>
        </div>
    </div>
}