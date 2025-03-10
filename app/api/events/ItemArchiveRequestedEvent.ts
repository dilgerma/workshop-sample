import {Event} from "@event-driven-io/emmett"

export type ItemArchiveRequestedEvent = Event<"ItemArchiveRequested",{
    
	aggregateId:string,
	productId:string,
	itemId:string    
    
}>