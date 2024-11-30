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

export const Payment = () => {

    const [bookings, setBookings] = useState<{
        bookingId: string,
        name: string,
        fromDate: Date,
        toDate: Date,
        totalCost: number
    }[]>()
    const [selectedBookingIndex, setSelectedBookingIndex] = useState<number | undefined>();

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
                <button className={"button is-info"} onClick={async () => {}}>Pay
                </button>
            </div>
        </div> : <span/>}
    </div>
}