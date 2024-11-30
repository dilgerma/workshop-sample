'use client'

import React, {useEffect} from "react";
import {DebugEvents} from "@/app/debug/eventsdebug";
import Ui from "@/app/slices/ui/ui";
import {Event} from "@event-driven-io/emmett"
import {PaymentEvents} from "@/app/slices/Events";

export default function PrototypePage() {

    return <section className="section main-container">
        <div className="">
            <div className="columns">
                <div className={"container"}>
                    <Ui/>
                </div>
            </div>
        </div>
        <DebugEvents/>

    </section>
}