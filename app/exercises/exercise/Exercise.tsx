import {useState} from "react";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import {Command} from "@event-driven-io/emmett";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {RoomAdded} from "@/app/exercises/Events";

const markdown = require('!raw-loader!./exercise.md').default;

// STEP 1 - UNCOMMNENT THIS BLOCK
/*export type AddRoomCommand = Command<
    'AddRoom',
    {
        roomNumber: string,
        floor: number,
        name: string
    }
>;*/

export const commandHandler = (command: Command) => {
    switch (command.type) {
        case 'AddRoom':
        // STEP 2 - UNCOMMENT THE COMMAND HANDLER
        /*findEventStore().appendToStream(
            'Inventory',
            [{} as RoomAdded]
        )*/
    }
}

export default function Exercise() {

    const [roomNumber, setRoomNumber] = useState<string>()
    const [floor, setFloor] = useState<number>()
    const [roomName, setRoomName] = useState<string>()
    const [passed, setPassed] = useState<boolean>()

    return <div className={"content"}>
        <div className={"columns"}>
            <div className={"column is-one-third padding control"}>
                <h3>Add Room</h3>
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
                        // STEP 3 - APPLY THE COMMAND
                        /*commandHandler(
                            {
                                data: {
                                },
                                type:
                            }
                        )*/
                    }} className={"button is-info m-2"}>Book Room
                    </button>
                    <button className={"is-success m-2 button"} onClick={() => {
                        findEventStore().readStream('Inventory').then((events) => {
                            if (events?.events.length == 2 &&
                                events?.events?.every(event => event.type == 'RoomAdded')
                                && (events?.events.some(event => event.data.name == 'Sunshine')
                                    || events?.events.some(event => event.data.name == 'Moonshine')))
                                setPassed(true)
                        })
                    }}>Verify
                    </button>
                </div>
                <div>
                    <div>Passed: {passed?.toString() ?? false?.toString()}</div>
                </div>
            </div>


        </div>
        <details>
            <MarkdownViewer markdown={markdown}/>
        </details>
    </div>
}