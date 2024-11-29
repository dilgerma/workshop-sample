import {PaymentEvents, RoomBookingClosed} from "@/app/slices/Events";
import {Command} from "@event-driven-io/emmett";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";

// https://miro.com/app/board/uXjVL_kfvMw=/?moveToWidget=3458764608862608893&cot=10

type CloseBookingCommand = Command<'CloseBooking', {
    bookingId: string
}>

const closeBookingCommandHandler = (events: PaymentEvents[], command: CloseBookingCommand) => {
    findEventStore().appendToStream('Inventory', [{
        type: 'BookingClosed',
        data: {
            id: command.data.bookingId
        }
    } as RoomBookingClosed])
}

export const bookingClosedProcessor = (events: PaymentEvents[]) => {
    events.forEach((event) => {
        switch (event.type) {
            case 'PaymentProcessed':
                closeBookingCommandHandler(events, {
                    type: 'CloseBooking',
                    data: {bookingId: event.data.referenceId}
                })
        }
    })
}