import {useState} from "react";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {RoomAdded} from "@/app/slices/Events";
import {name} from "estree-util-is-identifier-name";

// STEP 1 - UNCOMMNENT THIS BLOCK
/*export type AddRoomCommand = Command<
    'AddRoom',
    {
        roomNumber: string,
        name: string,
        costPerNight: number
    }
>;*/

// STEP 2
// implement the command handler.
// findEventstore().append...

/*const addRoomCommandHandler = async (events: Event[], command: AddRoomCommand): Promise<Event[]> => {
    return [{
        type: 'RoomAdded',
        data: {
           // TODO define data
        }
    } as RoomAdded]
}*/


export default function AddRoom() {

    const [roomNumber, setRoomNumber] = useState<string>()
    const [roomName, setRoomName] = useState<string>()
    const [costPerNight, setCostPerNight] = useState<number>()

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
                    /*
                    let command: AddRoomCommand = {
                        data: {
                            name: roomName,
                            roomNumber: roomNumber,
                            costPerNight: costPerNight
                        },
                        type: 'AddRoom'
                    }
                    let resultEvents = await addRoomCommandHandler(events, command)
                    await findEventStore().appendToStream('Inventory', resultEvents)
                    */
                }

                setRoomName("")
                setCostPerNight(Number(""))
                setRoomNumber("")

            }} className={"button is-info m-2"}>Add Room
            </button>
        </div>
    </div>
}