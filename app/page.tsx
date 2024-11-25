'use client'

import React, {useState} from "react";
import {DebugEvents} from "@/app/debug/eventsdebug";
import Exercise1 from "@/app/components/Exercise1";
import Exercise2 from "./components/Exercise2";

export default function PrototypePage() {

    const [currentExercise, setCurrentExercise] = useState<number>(1)

    return <section className="section main-container">
        <div className="">
            <div className="tabs">
                <ul>
                    <li onClick={()=>setCurrentExercise(1)} className={currentExercise == 1 ? "is-active" : ""}><a>Exercise 1</a></li>
                    <li onClick={()=>setCurrentExercise(2)} className={currentExercise == 2 ? "is-active" : ""}><a>Exercise 2</a></li>
                    <li onClick={()=>setCurrentExercise(3)} className={currentExercise == 3 ? "is-active" : ""}><a>Exercise 3</a></li>
                    <li onClick={()=>setCurrentExercise(4)} className={currentExercise == 4 ? "is-active" : ""}><a>Exercise 4</a></li>
                </ul>
            </div>
            <div className="columns">
                <div className={"container"}>
                {currentExercise == 1 ? <Exercise1/> : <span/>}
                {currentExercise == 2 ? <Exercise2/> : <span/>}
                </div>
            </div>
        </div>
        <DebugEvents/>

    </section>
}