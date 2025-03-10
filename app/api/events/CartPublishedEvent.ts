import {Event} from "@event-driven-io/emmett"

export type CartPublishedEvent = Event<"CartPublished",{
    
	aggregateId:string,
	orderedProducts:string[],
	totalPrice:number    
    
}>