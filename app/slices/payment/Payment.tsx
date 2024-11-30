import {useEffect, useState} from "react";
import {
    PaymentEvents,
    PaymentFailed,
    PaymentProcessed,
    PaymentRequested,
    RoomAdded,
    RoomBooked,
    RoomBookingClosed
} from "@/app/slices/Events";
import {Command, Event} from '@event-driven-io/emmett'
import {countDays} from "@/app/util/dates";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {paymentAPI} from "@/app/slices/payment/ExternalPaymentAPI";

/*
* https://miro.com/app/board/uXjVL_kfvMw=/?moveToWidget=3458764608860900378&cot=14
* */

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


const paymentTodos = (events: PaymentEvents[]): { id: string, amount: number }[] => {
    let result: { id: string, amount: number }[] = []
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

const paymentProcessor = (events: PaymentEvents[]) => {

    let paymentTodoItems = paymentTodos(events)
    if (paymentTodoItems.length > 0) {
        try {
            paymentAPI.executePayment(paymentTodoItems[0].id, paymentTodoItems[0].amount);
            confirmPaymentCommandHandler(events, {
                type: 'ConfirmPayment',
                data: {
                    bookingId: paymentTodoItems[0].id
                }
            })
        } catch (error) {
            console.log(error)
            confirmPaymentCommandHandler(events, {
                type: 'CancelPayment',
                data: {
                    bookingId: paymentTodoItems[0].id
                }
            })
        }
    }

}

const requestPaymentCommandHandler = (events: Event[], command: RequestPayment) => {
    findEventStore().appendToStream('Payment', [
        {
            type: 'PaymentRequested',
            data: {
                amount: command.data.amount,
                referenceId: command.data.bookingId
            }
        } as PaymentRequested
    ])
}

const confirmPaymentCommandHandler = (events: Event[], command: ConfirmPayment | CancelPayment) => {
    findEventStore().appendToStream('Payment', [
        {
            type: command.type == 'CancelPayment' ? 'PaymentFailed' : 'PaymentProcessed',
            data: {
                referenceId: command.data.bookingId
            }
        }
    ])
}

const bookingsStateView = (events: Event[]) => {

    let rooms: { name: string, costPerNight: number }[] = []
    let bookings: { bookingId: string, name: string, fromDate: Date, toDate: Date, totalCost: number }[] = []

    events.forEach((event) => {
        switch (event.type) {
            case 'RoomAdded':
                let roomAdded: RoomAdded = event as RoomAdded
                rooms.push({name: roomAdded.data.name, costPerNight: roomAdded.data.costPerNight})
                return
            case 'RoomBooked':
                let roomBooked: RoomBooked = event as RoomBooked
                let totalCost = countDays(
                    roomBooked.data.from,
                    roomBooked.data.to
                ) * rooms.find(it => it.name == roomBooked.data.name)!!.costPerNight
                bookings.push({
                    bookingId: roomBooked.data.id,
                    name: roomBooked.data.name,
                    fromDate: roomBooked.data.from,
                    toDate: roomBooked.data.to,
                    totalCost
                })
                return
            case 'BookingClosed':
                let bookingClosedEvent = event as RoomBookingClosed
                bookings = bookings.filter(it => it.bookingId !== bookingClosedEvent.data.id)
        }
    })

    return bookings
}

export const Payment = () => {

    const [bookings, setBookings] = useState<{
        bookingId: string,
        name: string,
        fromDate: Date,
        toDate: Date,
        totalCost: number
    }[]>()
    const [selectedBookingIndex, setSelectedBookingIndex] = useState<number | undefined>();

    useEffect(() => {
        subscribeStream('Inventory', async () => {
            let events = await findEventStore().readStream("Inventory");
            setBookings(bookingsStateView(events?.events ?? []))
        })

        subscribeStream('Payment', async ()=>{
            let result = await findEventStore().readStream("Payment");
            let events = result?.events??[]
            paymentProcessor(events as PaymentEvents[])
        })
    }, []);

    return <div>
        {bookings?.length??0  > 0 ? <div className={"box disabled"}>
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
                    var result = await findEventStore().readStream("Inventory");
                    if (bookings && selectedBookingIndex !== undefined) {
                        requestPaymentCommandHandler(result?.events ?? [], {
                            type: "RequestPayment",
                            data: {
                                amount: (bookings[selectedBookingIndex]).totalCost,
                                bookingId: bookings[selectedBookingIndex].bookingId
                            }
                        });
                    }

                }}>Pay
                </button>
            </div>
        </div> : <span/>}
    </div>
}