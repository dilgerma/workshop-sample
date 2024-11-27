import {useState} from "react";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import {InventoryEvents, RoomBooked} from "@/app/exercises/Events";
import {assert, TestCase, TestResult} from "@/app/exercises/tests/TestRunner";
import {TestResultViewr} from "@/app/components/TestResultViewer";
import {Command, Event} from "@event-driven-io/emmett";
import {findEventStore} from "@/app/infrastructure/inmemoryEventstore";

const markdown = require('!raw-loader!./exercise.md').default;

export type AvailableRoom = {
    number: string,
    name: string
}

export const availableRoomsStateView = (events: InventoryEvents[]): AvailableRoom[] => {
    let result: AvailableRoom[] = []
    events.forEach((event) => {
        switch (event.type) {
            case "RoomAdded":
                result.push({name: event.data.name, number: event.data.roomNumber})
                return
            case 'RoomBooked':
                result = result.filter(room => room.name !== event.data.name)
                return
        }
    })
    return result
}

export type BookRoomCommand = Command<
    'BookRoom',
    {
        name: string,
    }
>;

export const commandHandler = (events: Event[], command: BookRoomCommand): Event[] => {
    let resultEvents = [{
        type: 'RoomBooked',
        data: {
            name: command.data.name
        }
    } as RoomBooked]
    findEventStore().appendToStream(
        'Inventory',
        resultEvents
    )
    return resultEvents

}


export default function Exercise() {

    const [testResults, setTestResults] = useState<TestResult[]>()


    return <div className={"content"}>
        <div className={"columns"}>
            <div className={"column is-one-third padding control"}>
                <h3>Run Tests</h3>
                <button className={"button is-success"} onClick={() => {
                    setTestResults(runTests())
                }}>Run Testcases
                </button>
            </div>
            <div>
                {testResults ? <TestResultViewr results={testResults}/> : <span/>}
            </div>

        </div>
        <details>
            <MarkdownViewer markdown={markdown}/>
        </details>
    </div>
}



let test_collection: {
    slice_name: string,
    sample_history: Event[],
    tests: TestCase<BookRoomCommand>[]
}[] = []

export const prepareTest = (commandHandler: (events:Event[], command?: BookRoomCommand) => any[]) => {
    test_collection.push({
        slice_name: "book an added room",
        sample_history: [
            // STEP 1 - add sample event history
            //{type: 'RoomAdded', data: {name: "Moonshine", roomNumber: "1a", floor: 1}},
            // book "Moonshine"
            // try to book "Moonshine" twice
        ],
        tests: [
            {
                test_name: "Added Room should result in room booked event",
                event_count: 1,
                test: (events:Event[], command?:BookRoomCommand) => {
                    const result = commandHandler(events, command!!);
                    assert(false, "IMPLEMENT ME")
                },
                command: {type: 'BookRoom', data: {
                        name: "Moonshine",
                    }}
            },
            {
                test_name: "Cannot book the same room twice",
                event_count: 1,
                test: (events:Event[], command?:BookRoomCommand) => {
                    const result = commandHandler(events, command!!);
                    assert(result.length == 0, "Room cannot be booked twice");
                }
            }
        ]
    });
}


export const runTests = (): TestResult[] => {
    prepareTest((events:Event[], command?:BookRoomCommand)=>{
        return commandHandler(events, command!!)
    })
    let results: TestResult[] = []
    test_collection.forEach(slice => {
        slice.tests.forEach(test_case => {
            try {
                test_case.test(slice.sample_history.slice(0, test_case.event_count), test_case.command);
                results.push({test_name: test_case.test_name, passed: true})
            } catch (error) {
                results.push({test_name: test_case.test_name, passed: false, message: error?.toString()})
            }
        });
    });
    return results
}
