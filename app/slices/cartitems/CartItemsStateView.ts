import {CartEvents} from "@/app/api/events/CartEvents";

export type CartItem = {
    name: string,
    price: number,
    itemId: string,
    aggregateId: string
}

export const cartItemsStateView = (events: CartEvents[]): CartItem[] => {
    let result: CartItem[] = []
    events.forEach((event: CartEvents) => {
        switch (event.type) {
            case "ItemAdded":
                result.push({
                    name: event.data.name,
                    price: event.data.price,
                    itemId: event.data.itemId,
                    aggregateId: event.data.aggregateId
                })
                return
            case "Itemremoved":
                result = result.filter(item => item.itemId !== event.data.itemId)
                return
            case "CartCleared":
                result = []
                return
            case "ItemArchived":
                result = result.filter(item => item.itemId !== event.data.itemId)
                return
        }

    })
    return result
}