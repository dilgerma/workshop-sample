import {useState} from "react";
import MarkdownViewer from "@/app/components/MarkdownViewer";
import {InventoryEvents} from "@/app/exercises/Events";
import {TestResultViewr} from "@/app/components/TestResultViewer";
import type {Event} from "@event-driven-io/emmett";
import {assert, TestCase, TestResult} from "@/app/exercises/tests/TestRunner";

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

export default function Exercise() {

    const [testResults, setTestResults] = useState<TestResult[]>()


    return <div className={"content"}>
        <div className={"columns"}>
            <div className={"column is-one-third padding control"}>
                <h3>Run Tests</h3>
                <button className={"button is-success"} onClick={() => {
                    setTestResults(runTests())
                }}>Run Testcases</button>
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

/**
 * Test Cases
 */

let test_collection: { slice_name: string, sample_history: Event[], tests: TestCase<any>[] }[] = []

const prepareTestCollection = (slice: (events: Event[]) => any[]) => {
    test_collection.push({
        slice_name: "rooms state view",
        sample_history: [
            {type: 'RoomAdded', data: {name: "Moonshine", roomNumber: "1a", floor: 1}},
            // STEP 1 - add sample event history
            // add another room named "Sunshine"
            // add another room namde "Luna"
            // book "Moonshine"
        ],
        tests: [
            {
                test_name: "no history should return empty array",
                event_count: 0,
                test: (history) => {
                    const result = slice(history);
                    assert(result.length == 0, "")
                }
            },
            {
                test_name: "one room added should return one room in correct position",
                event_count: 1,
                test: (history) => {
                    const result = slice(history);
                    assert(result.length == 1, "One room should be returned");
                    assert(result[0].name, "First room should be Moonshine");
                }
            },
            {
                test_name: "two rooms added should return both rooms in correct order",
                event_count: 2,
                test: (history) => {
                    // STEP 2 - implement conditions
                    const result = slice(history);
                    //assert(, "Two rooms should be returned");
                    //assert(, "First room should be Moonshine");
                    //assert(, "Second room should be Sunshine");
                    assert(false, "Implement me")
                }
            },
            {
                test_name: "three rooms added should return all rooms in correct order",
                event_count: 3,
                test: (history) => {
                    const result = slice(history);
                    //assert(, "Three rooms should be returned");
                    //assert(, "First room should be Moonshine");
                    //assert(, "Second room should be Sunshine");
                    //assert(, "Third room should be Lago");
                    assert(false, "Implement me")
                }
            },
            {
                test_name: "Booked Room is not in the list anymore",
                event_count: 4,
                test: (history) => {
                    const result = slice(history);
                    //assert(, "2 rooms should be returned");
                    //assert(, "first room should now be Sunshine");
                    //assert(, "second room should now be be Lago");
                    assert(false, "Implement me")
                }
            },
        ]
    });
}

export const runTests = (): TestResult[] => {
    prepareTestCollection((events:Event[])=>{
        return availableRoomsStateView(events as InventoryEvents[])
    })
    let results: TestResult[] = []
    test_collection.forEach(slice => {
        slice.tests.forEach(test_case => {
            try {
                test_case.test(slice.sample_history.slice(0, test_case.event_count));
                results.push({test_name: test_case.test_name, passed: true})
            } catch (error) {
                results.push({test_name: test_case.test_name, passed: false, message: error?.toString()})
            }
        });
    });
    return results
}