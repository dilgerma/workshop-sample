import Editor from '@monaco-editor/react';
import {useEffect, useRef, useState} from "react";
import {debugAllStreams, findEventStore} from "@/app/infrastructure/inmemoryEventstore";
import {Command, Event} from "@event-driven-io/emmett";

//@ts-ignore
window.findEventStore = findEventStore
//@ts-ignore
window.debugAllStreams = debugAllStreams

export type DoItCommand = Command<
    'DoItCommand',
    {
        name: string
    }
>;

export type DoneEvent = Event<'DoneEvent', {
    name: string
}>

export default function Exercise1() {

    const [value, setValue] = useState<string>()

    const commandHandler = (command: DoItCommand) => {
        let resultEvent: DoneEvent = {
            data: {
                name: command.data.name
            }, type: "DoneEvent"}
        findEventStore().appendToStream("my-stream", [resultEvent])
    }


    return <div>
        <div className={"padding"}>
            <input
                onChange={(evt) => setValue(evt.target.value)}
                className="input is-link"
                type="text"
                placeholder="Link input"
            />
            <button onClick={() => {
                commandHandler({data: {name: value!!}, type: "DoItCommand"})
            }} className={"button"}>Submit Command
            </button>
        </div>
    </div>
}