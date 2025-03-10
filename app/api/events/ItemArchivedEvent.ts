import {Event} from "@event-driven-io/emmett"

export type ItemArchivedEvent = Event<"ItemArchived",{
    
	aggregateId:string,
	productId:string,
	itemId:string    
    
}>