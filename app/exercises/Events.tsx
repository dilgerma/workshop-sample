import {Event} from "@event-driven-io/emmett";

export type RoomAdded = Event<'RoomAdded', {
    roomNumber: string
    floor: number
}>
export type RoomBooked = Event<'RoomBooked', {
    roomNumber: string
}>
export type RoomReadied = Event<'RoomReadied', {
    roomNumber: string
}>

export type Events = RoomAdded | RoomBooked | RoomReadied