import {useState} from "react";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {AttendantAdded, InventoryEvents, RoomAdded} from "@/app/slices/Events";

export type AddAttendantCommand = Command<'AddAttendant', {
    name: string
}>

const addAttendantCommandHandler = (events: Event[], command: AddAttendantCommand) => {

    findEventStore().appendToStream('Inventory', [{
        type: 'AttendantAdded',
        data: {
            name: command.data.name
        }
    } as AttendantAdded]);
}

export default function AddAttendant() {

    const [name, setName] = useState<string>()

    return <div className={"content box disabled"}>
        <h3>Add Attendant</h3>
        <input
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            required={true}
            className="input is-link is-half"
            type="text"
            placeholder="Attendant Name"
        />
        <div className={"control"}>
            <button onClick={async () => {
                if(name) {
                    let result = await findEventStore().readStream("Inventory")
                    let events = result?.events || []
                    addAttendantCommandHandler(events, {
                        type: 'AddAttendant', data: {
                            name: name!!
                        }
                    })
                    setName("")
                }
            }} className={"button is-info m-2"}>Add Attendant</button>
        </div>
    </div>
}