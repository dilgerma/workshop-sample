import {Command} from "@event-driven-io/emmett"

export type ClearCartCommand = Command<'ClearCart',{
    
	aggregateId:string    
    
}>