import {useState} from "react";

export default function BookRooms() {

    const [selectedRoom, setSelectedRoom] = useState<string>("")

    const [fromDate, setFromDate] = useState<Date | null>()
    const [toDate, setToDate] = useState<Date | null>()

    return <div className={"content box disabled"}>
        <h3>Book Room</h3>
        <div>
            <select
                className={"select m-3"}
                value={selectedRoom}
                onChange={(evt) => setSelectedRoom(evt.target.value)}
                required={true}
            >
                <option>Select Room</option>
            </select>
        </div>
        <div>
            <input className={"m-3"} type={"date"} value={fromDate?.toISOString().split("T")[0] || ""}
                   onChange={(evt) => setFromDate(evt.target.valueAsDate!!)}/>
            <input type={"date"} value={toDate?.toISOString().split("T")[0] ?? ""}
                   onChange={(evt) => setToDate(evt.target.valueAsDate!!)}/>
        </div>

        <button onClick={async () => {
        }} className={"button is-info m-2"}>Book Room
        </button>
        <button className={"button m-2"} onClick={() => {
        }}>Reload
        </button>

    </div>
}