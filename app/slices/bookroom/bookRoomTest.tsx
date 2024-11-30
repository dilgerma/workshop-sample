import {useState} from "react";
import {TestResultViewer} from "@/app/components/TestResultViewer";
import type {Event} from "@event-driven-io/emmett";
import {assert, GWTTest, TestResult} from "@/app/slices/tests/TestRunner";
import {InventoryEvents, RoomAdded, RoomBooked} from "@/app/slices/Events";
import {BookRoomCommand, bookRoomCommandHandler} from "@/app/slices/bookroom/bookRooms";


const prepareTestCollection = () => {
    let today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);

    let bookRoomCommand = {
        type: 'BookRoom',
        data: {
            name: 'Moonlight lounge',
            toDate: today,
            // tomorrow
            fromDate: tomorrow
        }
    } as BookRoomCommand

    let test_collection: { slice_name: string, tests: GWTTest<any>[] }[] = []

    test_collection.push({
        slice_name: "rooms state view",
        tests: [
            {
                test_name: "can book an added room",
                expectError: false,
                given: [
                    {
                        type: "RoomAdded",
                        data: {
                            name: 'Moonlight lounge',
                            costPerNight: 199,
                            roomNumber: "1"
                        }
                    } as RoomAdded
                ],
                when: async (history: Event[]): Promise<Event[]> => {
                    return await bookRoomCommandHandler(history as InventoryEvents[], bookRoomCommand)
                },
                verifyThen: (result: Event[]) => {
                    assert(result?.some(event => event.type == 'RoomBooked'), "room should have been booked")
                }
            },
            {
                test_name: "cannot book room twice",
                expectError: true,
                given: [
                    {
                        type: "RoomAdded",
                        data: {
                            name: 'Moonlight lounge',
                            costPerNight: 199,
                            roomNumber: "1"
                        }
                    } as RoomAdded,
                    {
                        type: "RoomBooked",
                        data: {
                            name: 'Moonlight lounge',
                            from: today,
                            to: tomorrow
                        }
                    } as RoomBooked
                ],
                when: async (history: Event[]): Promise<Event[]> => {
                    return await bookRoomCommandHandler(history as InventoryEvents[], bookRoomCommand)
                },
                verifyThen: (result: Event[]) => {
                }
            },
        ]
    });

    return test_collection
}

export default function BookRoomTest() {

    const [testResults, setTestResults] = useState<TestResult[]>()

    return <div className={"content"}>
        <div className={""}>
            <div className={"is-one-third padding control"}>
                <h3>Run Tests</h3>
                <button className={"button is-success"} onClick={async () => {
                    setTestResults(await runTests())
                }}>Run Testcases
                </button>
            </div>
            <div>
                {testResults ? <TestResultViewer results={testResults}/> : <span/>}
            </div>

        </div>

    </div>
}


export const runTests = async (): Promise<TestResult[]> => {
    const test_collection = prepareTestCollection();
    const results: TestResult[] = [];

    for (const slice of test_collection) {
        // Map each test case to a promise
        const sliceResults = await Promise.all(slice.tests.map(async (test_case) => {
            try {
                const result = await test_case.when(test_case.given);
                test_case.verifyThen(result);
                return {test_name: test_case.test_name, passed: test_case.expectError == false};
            } catch (error) {
                return {test_name: test_case.test_name, passed: test_case.expectError == true, message: error?.toString()};
            }
        }));
        results.push(...sliceResults); // Collect results from this slice
    }

    return results; // Return the accumulated results
};