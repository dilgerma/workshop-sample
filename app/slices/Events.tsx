import {Event} from "@event-driven-io/emmett";

export type RoomAdded = Event<'RoomAdded', {
    roomNumber: string
    costPerNight: number,
    name: string
}>
export type RoomBooked = Event<'RoomBooked', {
    id: string,
    name: string
    from: Date,
    to: Date
}>
export type RoomBookingClosed = Event<'BookingClosed', {
    id: string,
}>
export type RoomReadied = Event<'RoomReadied', {
    name: string
    date: Date
    clerk: string
}>
export type AttendantAdded = Event<'AttendantAdded', {
    name: string
}>
export type AttendantAssigned = Event<'AttendantAssigned', {
    attendantName: string
    roomName: string
    date: Date
}>
export type BBQPlanned = Event<'BBQPlanned', {
    date: Date
}>
export type BBQCancelled = Event<'BBQCancelled', {
    date: Date,
    forecast: Forecast
}>

export enum Forecast {
    GOOD = "GOOD",
    BAD = "BAD",
    NEUTRAL = "NEURAL"
}
export type WeatherForecastedGiven = Event<'WeatherForecastedGiven', {
    date: Date,
    forecast: Forecast
}>

export type PaymentRequested = Event<'PaymentRequested', {
    referenceId: string,
    amount: number
}>
export type PaymentProcessed = Event<'PaymentProcessed', {
    referenceId: string
}>
export type PaymentFailed = Event<'PaymentFailed', {
    referenceId: string
}>
export type InventoryEvents = RoomAdded | RoomBooked | RoomReadied | AttendantAdded | AttendantAssigned
export type PaymentEvents = PaymentRequested | PaymentProcessed | PaymentFailed