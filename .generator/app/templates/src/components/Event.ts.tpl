import {Event} from "@event-driven-io/emmett"

export type <%=_name%>Event = Event<"<%=_name%>",{
    <%-_fields%>
}>