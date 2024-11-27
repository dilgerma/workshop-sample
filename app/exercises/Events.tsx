import {Event} from "@event-driven-io/emmett";

export type RoomAdded = Event<'RoomAdded', {
    roomNumber: string
    floor: number,
    name: string
}>
export type RoomBooked = Event<'RoomBooked', {
    name: string
}>
export type RoomReadied = Event<'RoomReadied', {
    name: string
}>

export type InventoryEvents = RoomAdded | RoomBooked | RoomReadied