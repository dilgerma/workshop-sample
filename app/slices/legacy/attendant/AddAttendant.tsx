import {useState} from "react";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {AttendantAdded, InventoryEvents, RoomAdded} from "@/app/slices/Events";

export type AddAttendantCommand = Command<'AddAttendant', {
    name: string
}>

const addAttendantCommandHandler = async (events: Event[], command: AddAttendantCommand): Promise<Event[]> => {

    return [{
        type: 'AttendantAdded',
        data: {
            name: command.data.name
        }
    } as AttendantAdded];
}

export default function AddAttendant() {

    const [name, setName] = useState<string>()

    return <div className={"content box"}>
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
                    let resultEvents = await addAttendantCommandHandler(events, {
                        type: 'AddAttendant', data: {
                            name: name!!
                        }
                    })
                    await findEventStore().appendToStream("Inventory", resultEvents)
                    setName("")
                }
            }} className={"button is-info m-2"}>Add Attendant</button>
        </div>
    </div>
}