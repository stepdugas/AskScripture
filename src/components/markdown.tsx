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
        h4: ({ children }) => (
          <h4 className="serif text-[1.0625rem] leading-tight text-ink font-semibold mt-5 mb-2 first:mt-0">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="serif text-[1rem] leading-tight text-ink font-semibold mt-4 mb-2 first:mt-0">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-[0.75rem] uppercase tracking-[0.12em] text-ink-muted font-medium mt-4 mb-2 first:mt-0">
            {children}
          </h6>
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
          <a
            href={href}
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-6 border-rule" />,
        code: ({ children, className }) => {
          const isBlock = /language-/.test(className ?? "");
          if (isBlock) {
            return (
              <code className={`font-mono text-[0.8125rem] ${className ?? ""}`}>
                {children}
              </code>
            );
          }
          return (
            <code className="font-mono text-[0.875em] bg-paper-2 px-1 py-0.5 rounded-sm">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-4 p-4 bg-paper-2 border border-rule overflow-x-auto text-[0.8125rem] leading-6">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-[0.9375rem] border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-rule-strong">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left py-2 pr-4 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="py-2 pr-4 border-b border-rule align-top">
            {children}
          </td>
        ),
        del: ({ children }) => (
          <del className="text-ink-subtle">{children}</del>
        ),
        img: ({ src, alt }) => (
          <img
            src={typeof src === "string" ? src : undefined}
            alt={alt ?? ""}
            className="my-4 max-w-full h-auto"
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
