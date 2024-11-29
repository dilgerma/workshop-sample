import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Command, Event} from "@event-driven-io/emmett";
import {AttendantAdded, AttendantAssigned, InventoryEvents} from "@/app/slices/Events";
import {isToday, isWithinRange} from "@/app/util/dates";


type AssignAttendantCommand = Command<'AssignAttendant', {
    roomName: string,
    attendant: string
}>

const assignAttendantCommandHandler = (events: Event[], command: AssignAttendantCommand) => {
    findEventStore().appendToStream('Inventory', [
        {
            type: "AttendantAssigned",
            data: {
                roomName: command.data.roomName,
                attendantName: command.data.attendant,
                date: new Date()
            }
        } as AttendantAssigned
    ]);
}


export const roomsToCleanStateView = (events: InventoryEvents[]): string[] => {
    let result: string[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomBooked":
                if (isWithinRange(new Date(), event.data.from, event.data.to)) {
                    result.push(event.data.name)
                }
                return
            case "AttendantAssigned":
                result = result.filter(room => !(isToday(event.data.date) && room == event.data.roomName))
        }
    })
    return result
}

export const availableAttendantsStateView = (events: Event[]) => {
    let result: string[] = []
    events.forEach((event => {
        switch (event.type) {
            case 'AttendantAdded':
                let attendantAdded: AttendantAdded = event as AttendantAdded
                result.push(attendantAdded.data.name)
                return
            case 'AttendantAssigned':
                let attendantAssiged = event as AttendantAssigned
                result = result.filter(it => !(isToday(attendantAssiged.data.date) && it == attendantAssiged.data.attendantName))
                return
        }

    }))
    return result
}

export const attendantScheduleProcessor = async (today: Date) => {
    let result = await findEventStore().readStream("Inventory")
    let events: Event[] = result?.events ?? []
    let roomsToClean = roomsToCleanStateView(events as InventoryEvents[])
    let availableAttendants = availableAttendantsStateView(events as InventoryEvents[])
    for (const room of roomsToClean) {

        if (availableAttendants.length > 0) {
            // Call commandHandler for each room and assign the current attendant
            assignAttendantCommandHandler(events, {
                type: 'AssignAttendant',
                data: {
                    roomName: room,
                    attendant: availableAttendants[0]
                },
            });
        }

    }
}