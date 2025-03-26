import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Command, Event} from "@event-driven-io/emmett";
import {AttendantAdded, AttendantAssigned, InventoryEvents} from "@/app/api/Events";
import {isToday, isWithinRange} from "@/app/util/dates";
import {Streams} from "@/app/api/Streams";


type AssignAttendantCommand = Command<'AssignAttendant', {
    roomName: string,
    attendant: string
}>

const assignAttendantCommandHandler = (events: InventoryEvents[], command: AssignAttendantCommand): InventoryEvents[] => {
    return [
        {
            type: "AttendantAssigned",
            data: {
                roomName: command.data.roomName,
                attendantName: command.data.attendant,
                date: new Date()
            }
        }
    ];
}


export const roomsToCleanStateView = (state: string[], events: InventoryEvents[]): string[] => {
    let result: string[] = state
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

export const availableAttendantsStateView = (state:string[], events: Event[]):string[] => {
    let result: string[] = state
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
    let result = await findEventStore().readStream<InventoryEvents>(Streams.Inventory)
    let events: InventoryEvents[] = result?.events ?? []
    let roomsToClean = roomsToCleanStateView([],events)
    let availableAttendants = availableAttendantsStateView([],events)
    for (const room of roomsToClean) {

        if (availableAttendants.length > 0) {
            // Call commandHandler for each room and assign the current attendant
            let resultEvents = assignAttendantCommandHandler(events, {
                type: 'AssignAttendant',
                data: {
                    roomName: room,
                    attendant: availableAttendants[0]
                },
            });
            await findEventStore().appendToStream(Streams.Inventory, resultEvents)
        }

    }
}