import {Command} from "@event-driven-io/emmett"

export type <%=_name%>Command = Command<'<%=_name%>',{
    <%-_fields%>
}>