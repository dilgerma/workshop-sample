import {InventoryEvents} from "@/app/slices/Events";
import {normalizeToMidnight} from "@/app/util/dates";

export type AvailableRoom = {
    number: string,
    name: string
}

// https://miro.com/app/board/uXjVL_kfvMw=/?moveToWidget=3458764608858298187&cot=14
/**
 * STEP 1 - implement bookable rooms state view
 * add rooms to the result array
 * remove rooms when they are booked based on the given "from" / "to" date
 */
export const bookableRoomsStateView = (events: InventoryEvents[], from: Date, to: Date): AvailableRoom[] => {
    let result: AvailableRoom[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
                // TODO add room to the result array
                return
            case "RoomBooked":
                // TODO filter out already booked rooms
                return
        }
    })
    return result
}