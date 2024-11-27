import {useState} from "react";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import {commandHandler} from "@/app/exercises/exercise/Exercise";
import {Command} from "@event-driven-io/emmett";
import {RoomAdded, RoomBooked} from "@/app/exercises/Events";

export type AddRoomCommand = Command<'AddRoom', {
    name: string,
    floor: number,
    roomNumber: string
}>

export default function AddRoom() {

    const [roomNumber, setRoomNumber] = useState<string>()
    const [floor, setFloor] = useState<number>()
    const [roomName, setRoomName] = useState<string>()

    const commandHandler = (command: AddRoomCommand) => {
        findEventStore().appendToStream('Inventory', [{
            type: 'RoomAdded',
            data: {
                name: command.data.name,
                roomNumber: command.data.roomNumber,
                floor: command.data.floor
            }
        } as RoomAdded])
    }

    return <div className={"content"}>
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
            value={floor}
            onChange={(evt) => setFloor(parseInt(evt.target.value))}
            className="input is-half"
            type="number"
            placeholder="Floor"
        />
        <div className={"control"}>
            <button onClick={() => {
                commandHandler({
                    type: 'AddRoom', data: {
                        name: roomName!!,
                        floor: floor!!,
                        roomNumber: roomNumber!!
                    }
                })
            }} className={"button is-info m-2"}>Add Room
            </button>
        </div>
    </div>
}