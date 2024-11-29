import {Event} from '@event-driven-io/emmett'

export type TestCase<COMMAND> = {
    test_name: string,
    event_count: number,
    test: (events: Event[], command?:COMMAND) => void,
    command?: COMMAND,
}

export type TestResult = {
    test_name: string,
    passed: boolean,
    message?: string
}

export const assert = (condition, message) => {
    if (!condition) throw new Error(message);
}