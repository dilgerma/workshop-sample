import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Product} from "@/app/slices/additem/AddItem";
import {useEffect, useState} from "react";
import {Streams} from "@/app/api/Streams";
import {CartItem, cartItemsStateView} from "@/app/slices/cartitems/CartItemsStateView";
import {CartEvents} from "@/app/api/events/CartEvents";

export default function CartItems(props: {aggregateId: string}) {

    const [cartItems, setCartItems] = useState<CartItem[]>()

    useEffect(() => {
        subscribeStream(Streams.Cart, (nextExpectedStreamVersion:bigint, events:CartEvents[]) => {
            setCartItems(cartItemsStateView(events))
        })
    }, []);

    return (<div className={"content"}>
        <h3>Cart Items</h3>
        {cartItems?.map(item => <div>
            <span>{item.name}</span>
            <b className={"m-2 p-2"}>{item.price}</b>
        </div>)}
    </div>)
}
