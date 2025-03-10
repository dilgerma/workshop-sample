import {Event} from "@event-driven-io/emmett"

export type InventoryUpdatedEvent = Event<"InventoryUpdated",{
    
	inventory:number,
	productId:string    
    
}>