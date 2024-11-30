import {Event} from "@event-driven-io/emmett";
import {AttendantAssigned} from "@/app/slices/Events";
import {isToday} from "@/app/util/dates";
import {useEffect, useState} from "react";
import {findEventStore, subscribeStream} from "@/app/infrastructure/inmemoryEventstore";

export const CleaningscheduleUI = () => {

    return <div className={"box disabled"}>
          <div >
            <h3>Cleaning Schedule <br/>({new Date().toLocaleDateString()})</h3>
        </div>
    </div>
}