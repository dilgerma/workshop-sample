import {useEffect, useState} from "react";
import {Command,Event} from "@event-driven-io/emmett";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {InventoryEvents, RoomBooked} from "@/app/slices/Events";
import {AvailableRoom, bookableRoomsStateView} from "@/app/slices/bookableRooms/bookableRoomsStateView";
import {v4} from "uuid";


export type BookRoomCommand = Command<
    'BookRoom',
    {
        name: string,
        fromDate: Date,
        toDate: Date
    }
>;

export const bookRoomCommandHandler = async (command: BookRoomCommand): Promise<Event[]> => {
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
    const [projection, setProjection] = useState<AvailableRoom[]>([])

    const [fromDate, setFromDate] = useState<Date | null>()
    const [toDate, setToDate] = useState<Date | null>()


    useEffect(() => {
        if (fromDate && toDate) {
            findEventStore().readStream('Inventory').then((events) => {
                setProjection(bookableRoomsStateView(events?.events as InventoryEvents[] || [], fromDate, toDate))
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
                    projection.map(addedRoom => <option selected={addedRoom.name == selectedRoom}
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
                let resultEvents = await bookRoomCommandHandler(
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
                setProjection([])
            }

        }} className={"button is-info m-2"}>Book Room
        </button>
        <button className={"button m-2"} onClick={() => {
            if (fromDate && toDate) {
                findEventStore().readStream('Inventory').then((events) => {
                    setProjection(bookableRoomsStateView(events?.events as InventoryEvents[] || [], fromDate!!, toDate!!))
                });
            }

        }}>Reload
        </button>

    </div>
}