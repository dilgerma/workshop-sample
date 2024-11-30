import {Event} from '@event-driven-io/emmett'

export type TestCase<COMMAND> = {
    test_name: string,
    event_count?: number,
    given?: Event[],
    when?: COMMAND,
    then?: Event[],
    test: (events: Event[], command?: COMMAND) => void,
}

export type GWTTest<COMMAND> = {
    test_name: string,
    given: Event[],
    expectError?: boolean,
    verifyThen: (events:Event[])=>void
    when: (events: Event[], command?: COMMAND) => Promise<Event[]>,
}

export type TestResult = {
    test_name: string,
    passed: boolean,
    message?: string
}

export const assert = (condition, message) => {
    if (!condition) throw new Error(message);
}