import {InventoryEvents} from "@/app/slices/Events";
import {normalizeToMidnight} from "@/app/util/dates";

export type AvailableRoom = {
    number: string,
    name: string
}

// https://miro.com/app/board/uXjVL_kfvMw=/?moveToWidget=3458764608858298187&cot=14
export const bookableRoomsStateView = (events: InventoryEvents[], from: Date, to: Date): AvailableRoom[] => {
    let result: AvailableRoom[] = []
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
                    it.name != event.data.name || event.data.to <= from || event.data.from >= to
                );
                return
        }
    })
    return result
}