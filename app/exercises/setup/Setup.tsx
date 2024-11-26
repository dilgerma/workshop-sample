import MarkdownViewer from "@/app/components/MarkdownViewer";
const markdown = require('!raw-loader!./setup.md').default;

export default function Setup() {

    return <div className={"content"}>
        <MarkdownViewer markdown={markdown}/>
    </div>
}