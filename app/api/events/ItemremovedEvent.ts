import {Event} from "@event-driven-io/emmett"

export type ItemremovedEvent = Event<"Itemremoved",{
    
	itemId:string    
    
}>