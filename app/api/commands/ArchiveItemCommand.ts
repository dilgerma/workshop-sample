import {Command} from "@event-driven-io/emmett"

export type ArchiveItemCommand = Command<'ArchiveItem',{
    
	aggregateId:string,
	productId:string,
	itemId:string    
    
}>