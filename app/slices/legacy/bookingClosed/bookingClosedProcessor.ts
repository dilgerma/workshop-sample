import {PaymentEvents, RoomBookingClosed} from "@/app/slices/Events";
import {Command, Event} from "@event-driven-io/emmett";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";

// https://miro.com/app/board/uXjVL_kfvMw=/?moveToWidget=3458764608862608893&cot=10

type CloseBookingCommand = Command<'CloseBooking', {
    bookingId: string
}>

const closeBookingCommandHandler = async (events: PaymentEvents[], command: CloseBookingCommand): Promise<Event[]> => {
    return [{
        type: 'BookingClosed',
        data: {
            id: command.data.bookingId
        }
    } as RoomBookingClosed]
}

export const bookingClosedProcessor = async (events: PaymentEvents[]) => {
    for (const event of events) {
        switch (event.type) {
            case 'PaymentProcessed':
                const resultEvents = await closeBookingCommandHandler(events, {
                    type: 'CloseBooking',
                    data: { bookingId: event.data.referenceId }
                });
                await findEventStore().appendToStream("Inventory", resultEvents)
                // You can handle resultEvents here if necessary
                break;
            // Add other cases if needed
        }
    }
}