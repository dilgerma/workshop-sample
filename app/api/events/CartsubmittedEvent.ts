import {Event} from "@event-driven-io/emmett"

export type CartsubmittedEvent = Event<"Cartsubmitted",{
    
	aggregateId:string    
    
}>