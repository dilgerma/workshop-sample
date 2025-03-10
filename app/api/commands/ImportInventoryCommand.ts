import {Command} from "@event-driven-io/emmett"

export type ImportInventoryCommand = Command<'ImportInventory',{
    
	inventory:number,
	productId:string    
    
}>