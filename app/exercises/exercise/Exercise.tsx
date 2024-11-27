import {useEffect, useState} from "react";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import {Command, Event} from "@event-driven-io/emmett";
import {debugAllStreams, findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {InventoryEvents, RoomBooked} from "@/app/exercises/Events";
import AddRoom from "@/app/exercises/exercise/addroom/AddRoom";
const markdown = require('!raw-loader!./exercise.md').default;

// STEP 1 - STATE VIEW SLICE - AVAILABLE ROOMS
/**
 * Data Projection
 */
type AvailableRoom = {
    number: string,
    name: string
}

//  TODO : project events to available rooms
const availableRoomsStateView = (events: InventoryEvents[]): AvailableRoom[] => {
    let result: AvailableRoom[] = []
    events.forEach((event) => {
        /*
        FOR EACH EVENT - adjust the result-array.
        If a Room is added, append it to the array. ( result.push(...) )
        If a Room is booked, remove it from the array. ( result = result.filter(...) )
         */
    })
    return result
}

export type BookRoomCommand = Command<
    'BookRoom',
    {
        name: string,
    }
>;



export const commandHandler = (command: BookRoomCommand) => {
    findEventStore().appendToStream(
        'Inventory',
        [{
            type: 'RoomBooked',
            data: {
                name: command.data.name
            }
        } as RoomBooked]
    )

}



export default function Exercise() {

    const [selectedRoom, setSelectedRoom] = useState<string>()
    const [projection, setProjection] = useState<AvailableRoom[]>([])
    const [nextExpectedStreamVersion, setNextExpectedStreamVersion] = useState<bigint>()

    useEffect(() => {
        subscribeStream('Inventory', (nextExpectedStreamVersion, events) => {
            setNextExpectedStreamVersion(nextExpectedStreamVersion)
        })

    }, []);

    useEffect(() => {
        findEventStore().readStream('Inventory').then((events) => {
            setProjection(availableRoomsStateView(events?.events as InventoryEvents[] || []))
        })
    }, [nextExpectedStreamVersion])


    return <div className={"content"}>
        <div className={"columns"}>
            <div className={"column is-one-third padding control"}>
                <AddRoom/>
                <hr/>
                <h3>Book Room</h3>
                <select
                    className={"select"}
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

                <div className={"control"}>
                    <button onClick={() => {
                        commandHandler(
                            {
                                data: {
                                    name: selectedRoom
                                },
                                type: 'BookRoom'
                            } as BookRoomCommand
                        )
                    }} className={"button is-info m-2"}>Book Room
                    </button>
                </div>

            </div>


        </div>
        <details>
            <MarkdownViewer markdown={markdown}/>
        </details>
    </div>
}