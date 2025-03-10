import {Event} from "@event-driven-io/emmett"

export type ItemAddedEvent = Event<"ItemAdded",{
    
	aggregateId:string,
	description:string,
	itemId:string,
	name:string,
	price:string,
	productId:string    
    
}>