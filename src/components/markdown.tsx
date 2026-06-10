import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="serif text-[1.5rem] leading-tight text-ink font-semibold mt-6 mb-3 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="serif text-[1.25rem] leading-tight text-ink font-semibold mt-6 mb-2 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium mt-5 mb-2 first:mt-0">
            {children}
          </h3>
        ),
        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold text-ink">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent pl-4 my-4 text-ink-muted italic">
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a href={href} className="text-accent hover:underline">
            {children}
          </a>
        ),
        hr: () => <hr className="my-6 border-rule" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
