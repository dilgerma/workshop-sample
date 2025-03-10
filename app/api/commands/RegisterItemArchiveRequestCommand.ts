import {Command} from "@event-driven-io/emmett"

export type RegisterItemArchiveRequestCommand = Command<'RegisterItemArchiveRequest',{
    
	aggregateId:string,
	productId:string,
	itemId:string    
    
}>