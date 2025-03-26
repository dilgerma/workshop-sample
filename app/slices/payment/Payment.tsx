import {useEffect, useState} from "react";
import {
    InventoryEvents,
    PaymentEvents,
    PaymentFailed,
    PaymentProcessed,
    PaymentRequested,
    RoomAdded,
    RoomBooked,
    RoomBookingClosed
} from "@/app/api/Events";
import {Command, Event} from '@event-driven-io/emmett'
import {countDays} from "@/app/util/dates";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {paymentAPI} from "@/app/slices/payment/ExternalPaymentAPI";
import {Streams} from "@/app/api/Streams";

type RequestPayment = Command<'RequestPayment', {
    bookingId: string,
    amount: number
}>

type ConfirmPayment = Command<'ConfirmPayment', {
    bookingId: string
}>
type CancelPayment = Command<'CancelPayment', {
    bookingId: string
}>

export type Payment = { id: string, amount: number }
const paymentTodosStateView = (state: Payment[], events: PaymentEvents[]): Payment[] => {
    let result: { id: string, amount: number }[] = state
    events.forEach((event) => {
        switch (event.type) {
            case 'PaymentRequested':
                let paymentRequested = event as PaymentRequested
                result.push({
                    id: paymentRequested.data.referenceId,
                    amount: paymentRequested.data.amount}
                )
                return
            case 'PaymentProcessed':
                let paymentProcessed = event as PaymentProcessed
                result = result.filter(it => it.id !== paymentProcessed.data.referenceId)
                return
            case 'PaymentFailed':
                let paymentFailed = event as PaymentFailed
                result = result.filter(it => it.id !== paymentFailed.data.referenceId)
                return
        }
    })
    return result
}

const paymentProcessor = async () => {

    let result = await findEventStore().readStream<PaymentEvents>(Streams.Payment)
    let paymentTodoItems = paymentTodosStateView([],result?.events||[])
    if (paymentTodoItems.length > 0) {
        try {
            paymentAPI.executePayment(paymentTodoItems[0].id, paymentTodoItems[0].amount);
            let resultEvents = confirmPaymentCommandHandler(result?.events||[], {
                type: 'ConfirmPayment',
                data: {
                    bookingId: paymentTodoItems[0].id
                }
            })
            await findEventStore().appendToStream(Streams.Payment, resultEvents)

        } catch (error) {
            console.log(error)
            let resultEvents = confirmPaymentCommandHandler(result?.events||[], {
                type: 'CancelPayment',
                data: {
                    bookingId: paymentTodoItems[0].id
                }
            })
            await findEventStore().appendToStream(Streams.Payment, resultEvents)

        }
    }

}

const requestPaymentCommandHandler = (events: Event[], command: RequestPayment): Event[] => {
    return [
        {
            type: 'PaymentRequested',
            data: {
                amount: command.data.amount,
                referenceId: command.data.bookingId
            }
        } as PaymentRequested
    ]
}

const confirmPaymentCommandHandler =  (events: Event[], command: ConfirmPayment | CancelPayment) : Event[] => {
    return [
        {
            type: command.type == 'CancelPayment' ? 'PaymentFailed' : 'PaymentProcessed',
            data: {
                referenceId: command.data.bookingId
            }
        }
    ]
}

export type Booking = { bookingId: string, name: string, fromDate: Date, toDate: Date, totalCost: number }
const bookingsStateView = (events: InventoryEvents[]) => {

    let rooms: { name: string, costPerNight: number }[] = []
    let bookings: Booking[] = []

    events.forEach((event) => {
        switch (event.type) {
            case 'RoomAdded':
                rooms.push({name: event.data.name, costPerNight: event.data.costPerNight})
                return
            case 'RoomBooked':
                let totalCost = countDays(
                    event.data.from,
                    event.data.to
                ) * rooms.find(it => it.name == event.data.name)!!.costPerNight
                bookings.push({
                    bookingId: event.data.id,
                    name: event.data.name,
                    fromDate: event.data.from,
                    toDate: event.data.to,
                    totalCost
                })
                return
        }
    })

    return bookings
}

export const Payment = () => {

    const [bookings, setBookings] = useState<Booking[]>([])
    const [selectedBookingIndex, setSelectedBookingIndex] = useState<number | undefined>();

    useEffect(() => {
        subscribeStream(Streams.Inventory, async (_:bigint, events:InventoryEvents[]) => {
            let eventResult = await findEventStore().readStream<InventoryEvents>(Streams.Inventory)
            setBookings(bookingsStateView(eventResult?.events||[]))
        })

        subscribeStream(Streams.Payment, async (_:bigint)=>{
            await paymentProcessor()
        })
    }, []);

    return <div>
        {bookings?.length??0  > 0 ? <div className={"box"}>
            <h3>Checkout</h3>
            <select
                value={selectedBookingIndex}
                onChange={(evt) => setSelectedBookingIndex(Number(evt.target.value))}
                required={true}
                className="input is-link is-half"
            >
                <option value="">Bitte wählen</option>
                {bookings?.map((booking, idx) => (
                    <option key={idx} value={idx}>
                        {booking.name} / {booking.fromDate.getDate()}
                    </option>
                ))}
            </select>
            {selectedBookingIndex !== undefined && bookings && (
                <div className={"top-margin"}>
                    <h4>Selected Booking:</h4>
                    <p>Name: {bookings[selectedBookingIndex].name}</p>
                    <p>From: {bookings[selectedBookingIndex].fromDate.toDateString()}</p>
                    <p>To: {bookings[selectedBookingIndex].toDate.toDateString()}</p>
                    <p>Total Cost: ${bookings[selectedBookingIndex].totalCost}</p>
                </div>
            )}
            <div className={"top-margin"}>
                <button className={"button is-info"} onClick={async () => {
                    var result = await findEventStore().readStream(Streams.Inventory);
                    if (bookings && selectedBookingIndex !== undefined) {
                        let resultEvents = requestPaymentCommandHandler(result?.events ?? [], {
                            type: "RequestPayment",
                            data: {
                                amount: (bookings[selectedBookingIndex]).totalCost,
                                bookingId: bookings[selectedBookingIndex].bookingId
                            }
                        });
                       await findEventStore().appendToStream(Streams.Payment,resultEvents)
                    }

                }}>Pay
                </button>
            </div>
        </div> : <span/>}
    </div>
}