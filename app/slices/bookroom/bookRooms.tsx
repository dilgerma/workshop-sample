import {useEffect, useState} from "react";
import {Command,Event} from "@event-driven-io/emmett";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {InventoryEvents, RoomBooked} from "@/app/api/Events";
import {AvailableRoom, bookableRoomsStateView} from "@/app/slices/bookableRooms/bookableRoomsStateView";
import {v4} from "uuid";
import {Streams} from "@/app/api/Streams";


export type BookRoomCommand = Command<
    'BookRoom',
    {
        name: string,
        fromDate: Date,
        toDate: Date
    }
>;

export const bookRoomCommandHandler = (events: Event[], command: BookRoomCommand): Event[] => {
    return [{
            type: 'RoomBooked',
            data: {
                id: v4(),
                name: command.data.name,
                from: new Date(command.data.fromDate),
                to: new Date(command.data.toDate)
            }
        } as RoomBooked]
}

export default function BookRooms() {

    const [selectedRoom, setSelectedRoom] = useState<string>("")
    const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])

    const [fromDate, setFromDate] = useState<Date | null>()
    const [toDate, setToDate] = useState<Date | null>()


    useEffect(() => {
        if (fromDate && toDate) {

            findEventStore().readStream<InventoryEvents>(Streams.Inventory).then((events) => {
                setAvailableRooms((prevState:AvailableRoom[])=> bookableRoomsStateView([],events?.events || [], fromDate, toDate))
            })
        }
    }, [fromDate, toDate])

    return <div className={"content box"}>
        <h3>Book Room</h3>
        <div>
            <select
                className={"select m-3"}
                value={selectedRoom}
                onChange={(evt) => setSelectedRoom(evt.target.value)}
                required={true}
            >
                <option>Select Room</option>
                {
                    availableRooms.map(addedRoom => <option selected={addedRoom.name == selectedRoom}
                                                        value={addedRoom.name}>{addedRoom.name}</option>)
                }
            </select>
        </div>
        <div>
            <input className={"m-3"} type={"date"} value={fromDate?.toISOString().split("T")[0] || ""}
                   onChange={(evt) => setFromDate(evt.target.valueAsDate!!)}/>
            <input type={"date"} value={toDate?.toISOString().split("T")[0] ?? ""}
                   onChange={(evt) => setToDate(evt.target.valueAsDate!!)}/>
        </div>

        <button onClick={async () => {
            if (selectedRoom) {
                let resultEvents = bookRoomCommandHandler([],
                    {
                        data: {
                            name: selectedRoom,
                            fromDate: fromDate!!,
                            toDate: toDate!!
                        },
                        type: 'BookRoom'
                    }
                )
                await findEventStore().appendToStream("Inventory", resultEvents)
                setFromDate(null)
                setToDate(null)
                setAvailableRooms([])
            }

        }} className={"button is-info m-2"}>Book Room
        </button>
        <button className={"button m-2"} onClick={() => {
            if (fromDate && toDate) {
                findEventStore().readStream(Streams.Inventory).then((events) => {
                    setAvailableRooms(bookableRoomsStateView([], events?.events as InventoryEvents[] || [], fromDate!!, toDate!!))
                });
            }

        }}>Reload
        </button>

    </div>
}