import {Event} from "@event-driven-io/emmett"

export type InventorychangedEvent = Event<"Inventorychanged",{
    
	productId:string,
	inventory:number    
    
}>