import {Event} from "@event-driven-io/emmett"

export type CartclearedEvent = Event<"Cartcleared",{
    
	aggregateId:string    
    
}>