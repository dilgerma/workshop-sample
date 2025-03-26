import {useEffect, useState} from "react";
import {Room} from "@/app/slices/addroom/AddRoom";
import {findEventStore, subscribeStream, unsubscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Streams} from "@/app/api/Streams";
import {InventoryEvents} from "@/app/api/Events";
import {RegisteredRoom, roomStateView} from "@/app/slices/rooms/roomStateView";

export function Rooms() {
    const [rooms, setRooms] = useState<RegisteredRoom[]>([])

    useEffect(() => {
        let subscription = subscribeStream(Streams.Inventory, async (nextExpectedStreamVersion:bigint, events:InventoryEvents[]) => {
            let result = await findEventStore().readStream<InventoryEvents>(Streams.Inventory)
            setRooms(roomStateView(result?.events || []))
        })

        return ()=>unsubscribeStream(Streams.Inventory, subscription)
    }, []);

    return <div className={"content box"}>
        <h3>Rooms</h3>
        {rooms.map(room => <div key={room.name}>
            <div>{room.name} - {room.number} ({room.price})</div>
        </div>)}
    </div>
}