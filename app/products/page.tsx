'use client'

import React, {useEffect, useState} from "react";
import {DebugEvents} from "@/app/debug/eventsdebug";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";
import {addItemCommandHandler} from "@/app/slices/additem/commandHandler";
import {Streams} from "@/app/api/Streams";
import {v4} from "uuid";
import CartView from "@/app/slices/cartview/CartView";
import Navigation from "@/app/components/Navigation";

export default function ProductsPage() {


    const [cartSession, setCartSession] = useState(v4())
    const [products, setProducts] = useState([
        {
            "productId": "1",
            "price": 19.99,
            "name": "Premium Coffee Brand",
            "description": "A premium coffee brand that offers a unique and exceptional coffee experience.",
        },
        {
            "productId": "2",
            "price": 24.99,
            "name": "Single Origin Ethiopian",
            "description": "Rich, floral Ethiopian coffee with distinctive blueberry notes and smooth finish.",
        },
        {
            "productId": "3",
            "price": 21.99,
            "name": "Dark Roast Espresso",
            "description": "Bold and intense espresso blend perfect for creating authentic Italian coffee drinks.",
        },
        {
            "productId": "4",
            "price": 18.99,
            "name": "Colombian Supremo",
            "description": "Medium roasted Colombian beans with caramel sweetness and nutty undertones.",
        },
        {
            "productId": "5",
            "price": 22.99,
            "name": "Organic Cold Brew Blend",
            "description": "Specially crafted blend for smooth, low-acid cold brew with chocolate notes.",
        }
    ])
    return (<>
        <Navigation/>
        <section className="section main-container container content">
        <div className="">
            <div className="columns is-flex-wrap-wrap">
                {products.map((product) => {
                    return <div className={"column is-4 p-3 m-4"}>
                        <div className={"columns"}>
                            <div className={"panel"}>
                                <h3 className={"panel-heading"}>{product.name}</h3>
                                <div className={"panel-block"}>
                                    <div>{product.description}</div>
                                    <b className={"notification"}>{product.price}</b>
                                </div>
                                <button className={"button is-info"} onClick={async () => {
                                    let eventsResult = await findEventStore().readStream(Streams.Cart)
                                    let resultEvents = await addItemCommandHandler(eventsResult?.events || [], {
                                        type: "AddItem",
                                        data: {
                                            name: product.name,
                                            description: product.description,
                                            price: product.price,
                                            productId: product.productId,
                                            itemId: v4(),
                                            aggregateId: cartSession
                                        }
                                    })
                                    await findEventStore().appendToStream(Streams.Cart, resultEvents, {expectedStreamVersion:eventsResult?.currentStreamVersion})
                                }}>Add to Cart
                                </button>
                        </div>
                    </div>
                </div>
                })}
            </div>
            <DebugEvents/>
        </div>
    </section></>)
}