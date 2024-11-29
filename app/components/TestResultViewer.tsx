import {TestResult} from "@/app/slices/tests/TestRunner";

export const TestResultViewr = (props: {results: TestResult[]})=>{
    return <div>
        {props.results.map(result => <div>
            <div className={"mb-2 p-2"}>
                <span>{result.passed ? "✅" : "❌"}</span>
                <span className={"p-2"}>{result.test_name}</span>
                <span>{result.message}</span>
            </div>
        </div>)}
    </div>
}

