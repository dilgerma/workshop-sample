import {useState} from "react";
import {AddRoomCommand, BookRoom, ReadyRoom} from "@/app/exercises/Commands";
import {commandHandler} from "@/app/exercises/exercise1/commandHandler";
import MarkdownViewer from "@/app/components/MarkdownViewer";

const markdown = require('!raw-loader!./exercise.md').default;


export type RoomCommands = AddRoomCommand | BookRoom | ReadyRoom

export default function Exercise1() {

    const [value, setValue] = useState<string>()
    const [roomNumber, setRoomNumber] = useState<string>()
    const [floor, setFloor] = useState<number>()

    return <div className={"content"}>
        <div className={"padding control"}>
            <input
                value={roomNumber}
                onChange={(evt) => setRoomNumber(evt.target.value)}
                required={true}
                className="input is-link"
                type="text"
                placeholder="Room Number"
            />
            <input
                required={true}
                value={floor}
                onChange={(evt) => setFloor(parseInt(evt.target.value))}
                className="input is-narrow"
                type="number"
                placeholder="Floor"
            />
            <button onClick={() => {
                commandHandler({data: {roomNumber: roomNumber, floor: floor}, type: 'AddRoom'} as AddRoomCommand)
            }} className={"button"}>Book Room
            </button>

          <MarkdownViewer markdown={markdown}/>

        </div>
    </div>
}