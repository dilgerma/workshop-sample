import {Command} from "@event-driven-io/emmett"

export type ChangePriceCommand = Command<'ChangePrice',{
    
	price:number,
	productId:string    
    
}>