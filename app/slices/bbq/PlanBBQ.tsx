import {useState} from "react";

export default function PlanBBQ() {

    const [date, setDate] = useState<Date | null>()

    return <div className={"box disabled"}>
        <h3>Plan next BBQ</h3>
        <small>Only one BBQ per day</small>
        <input className={"m-3"} type={"date"} value={date?.toISOString().split("T")[0] || ""}
               onChange={(evt) => setDate(evt.target.valueAsDate!!)}/>
        <div className={"control"}>
            <button onClick={() => {
            }} className={"button is-info m-2"}>Plan BBQ
            </button>
        </div>
        <h3>Planned BBQs</h3>
        <ul>
        </ul>

    </div>
}