'use client'

import React from "react";
import {DebugEvents} from "@/app/debug/eventsdebug";
import Exercise from "@/app/exercises/exercise/Exercise";

export default function PrototypePage() {

    return <section className="section main-container">
        <div className="">
            <div className="columns">
                <div className={"container"}>
                    <Exercise/>
                </div>
            </div>
        </div>
        <DebugEvents/>

    </section>
}