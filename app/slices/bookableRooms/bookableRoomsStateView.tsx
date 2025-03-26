import {InventoryEvents} from "@/app/api/Events";
import {normalizeToMidnight} from "@/app/util/dates";

export type AvailableRoom = {
    number: string,
    name: string
}

export const bookableRoomsStateView = (state: AvailableRoom[], events: InventoryEvents[], from: Date, to: Date): AvailableRoom[] => {
    let result: AvailableRoom[] = state
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
                result.push({
                    name: event.data.name,
                    number: event.data.roomNumber
                })
                return
            case "RoomBooked":
                result = result.filter(it =>
                    it.name != event.data.name || (normalizeToMidnight(event.data.to) <= normalizeToMidnight(from) || normalizeToMidnight(event.data.from) >= normalizeToMidnight(to))
                );
                return
        }
    })
    return result
}