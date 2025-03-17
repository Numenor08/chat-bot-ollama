import { CopyIcon } from "@radix-ui/react-icons";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'

const ChatMarkdown = ({ content, className }: { content: string, className: string }) => {
    return (
        <div className={className}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    pre({ children }) {
                        return (
                            <div className={`not-prose m-0`}>
                                {children}
                            </div>
                        );
                    },
                    code({ inline, className, children, ...props }: { inline?: boolean, className?: string, children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <>
                                <div className="bg-[#50505a] text-gray-400 mb-0 rounded-t-xl px-4 py-2 flex items-center justify-between">
                                    <p className="hover:text-gray-200 cursor-default">{match[1]}</p>
                                    <CopyIcon className="w-4 h-4 ml-2 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(String(children))} />
                                </div>
                                <SyntaxHighlighter
                                    customStyle={{
                                        overflow: "auto",
                                        borderTopLeftRadius: "0rem",
                                        borderTopRightRadius: "0rem",
                                        borderBottomLeftRadius: "0.75rem",
                                        borderBottomRightRadius: "0.75rem",
                                        marginTop: 0,
                                        scrollbarWidth: "thin",
                                        scrollbarColor: "rgba(131, 131, 131, 0.5) transparent",
                                    }}
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}>
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    }
                }}>
                {content}
            </Markdown>
        </div>
    );
}

export default ChatMarkdown;