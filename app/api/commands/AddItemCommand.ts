import {Command} from "@event-driven-io/emmett"

export type AddItemCommand = Command<'AddItem',{
    
	aggregateId:string,
	description:string,
	price:number,
	itemId:string,
	name:string,
	productId:string    
    
}>