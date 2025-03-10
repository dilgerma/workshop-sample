import {Command} from "@event-driven-io/emmett"

export type PublishCartCommand = Command<'PublishCart',{
    
	aggregateId:string,
	orderedProducts:string[],
	totalPrice:number    
    
}>