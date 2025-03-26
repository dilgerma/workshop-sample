import {InventoryEvents} from "@/app/api/Events";
import {normalizeToMidnight} from "@/app/util/dates";

export type RegisteredRoom = {
    number: string,
    name: string,
    price: number
}

export const roomStateView = (events: InventoryEvents[]): RegisteredRoom[] => {
    let result: RegisteredRoom[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
                result.push({
                    name: event.data.name,
                    number: event.data.roomNumber,
                    price: event.data.costPerNight
                })
                return
        }
    })
    return result
}