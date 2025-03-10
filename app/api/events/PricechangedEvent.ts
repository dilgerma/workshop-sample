import {Event} from "@event-driven-io/emmett"

export type PricechangedEvent = Event<"Pricechanged",{
    
	price:number,
	productId:string    
    
}>