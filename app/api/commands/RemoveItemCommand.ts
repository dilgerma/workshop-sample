import {Command} from "@event-driven-io/emmett"

export type RemoveItemCommand = Command<'RemoveItem',{
    
	itemId:string    
    
}>