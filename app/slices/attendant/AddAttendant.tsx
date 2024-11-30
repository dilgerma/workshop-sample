import {useState} from "react";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Event, Command} from "@event-driven-io/emmett";
import {AttendantAdded, InventoryEvents, RoomAdded} from "@/app/slices/Events";

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
            }} className={"button is-info m-2"}>Add Attendant</button>
        </div>
    </div>
}