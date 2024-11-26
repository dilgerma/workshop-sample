import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {RoomAdded, RoomBooked, RoomReadied} from "@/app/exercises/Events";
import {RoomCommands} from "@/app/exercises/exercise1/Exercise1";

export const commandHandler = (command: RoomCommands) => {
    switch (command.type) {
         // TODO implement command handler
        case "AddRoom":
            findEventStore().appendToStream("Inventory", [{
                data: {
                    roomNumber: command.data.roomNumber,
                    floor: command.data.floor
                }
            } as RoomAdded])
    }
}