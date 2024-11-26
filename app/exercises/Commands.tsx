import {Command} from "@event-driven-io/emmett";

export type AddRoomCommand = Command<
    'AddRoom',
    {
        roomNumber: string,
        floor: number
    }
>;

export type BookRoom = Command<
    'BookRoom',
    {
        roomNumber: string,
    }
>;

export type ReadyRoom = Command<
    'ReadyRoom',
    {
        roomNumber: string,
    }
>;