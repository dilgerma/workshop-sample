'use client'

import React, {useEffect} from "react";
import {DebugEvents} from "@/app/debug/eventsdebug";
import Navigation from "@/app/components/Navigation";
import CartItems from "@/app/slices/cartitems/CartItems";

export default function PrototypePage() {

    return (<>
        <Navigation/>
        <section className="section main-container">
        <div className="">
            <div className="columns">
                <div className={"container"}>
                   <CartItems aggregateId={"1"}/>
                </div>
            </div>
        </div>
        <DebugEvents/>

    </section></>)
}