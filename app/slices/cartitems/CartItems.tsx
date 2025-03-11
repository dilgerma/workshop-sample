import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {Product} from "@/app/slices/additem/AddItem";
import {useEffect, useState} from "react";
import {Streams} from "@/app/api/Streams";
import {CartItem, cartItemsStateView} from "@/app/slices/cartitems/CartItemsStateView";
import {CartEvents} from "@/app/api/events/CartEvents";

export default function CartItems(props: {aggregateId: string}) {

    const [cartItems, setCartItems] = useState<number[]>()

    useEffect(() => {
        subscribeStream(Streams.Cart, (nextExpectedStreamVersion:bigint, events:CartEvents[]) => {
            alert(JSON.stringify(events))
            setCartItems([1,2,3])
        })
        setCartItems([1,2,3])
    }, []);

    return (<div>
        <h3>Cart Items</h3>
        {JSON.stringify(cartItems?.length)}
        {JSON.stringify(cartItems)}
    </div>)
}
