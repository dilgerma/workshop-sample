import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

export default function MarkdownViewer(props:{markdown:string}){

    return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
            code({node, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                    <SyntaxHighlighter
                        // theme
                        language={match[1]}
                        PreTag='section' // parent tag
                        {...props}
                    >{String(children).replace(/\n$/, "")}</SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
        }}

    >{props.markdown}</ReactMarkdown>

}