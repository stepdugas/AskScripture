"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  signedIn: boolean;
  isAdmin: boolean;
};

/**
 * Mobile-only hamburger + slide-down menu. Editorial styling — hairline
 * borders, no shadows. Closes on route change automatically.
 */
export function MobileMenu({ signedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sections: { eyebrow: string; links: { href: string; label: string }[] }[] =
    [
      {
        eyebrow: "Read",
        links: [
          { href: "/today", label: "Today" },
          { href: "/genesis/1", label: "Open the reader" },
          { href: "/compare/john/1", label: "Compare translations" },
          { href: "/search", label: "Search" },
        ],
      },
      {
        eyebrow: "Study",
        links: [
          { href: "/word-study", label: "Translation debates" },
          { href: "/modes", label: "Chat modes" },
          { href: "/plans", label: "Reading plans" },
          { href: "/timeline", label: "Timeline" },
        ],
      },
      {
        eyebrow: "Project",
        links: [
          { href: "/about", label: "About" },
          { href: "/method", label: "Method" },
          { href: "/sources", label: "Sources" },
          { href: "/api-docs", label: "Public API" },
          { href: "/pricing", label: "Pricing" },
        ],
      },
    ];

  const accountLinks = signedIn
    ? [
        { href: "/dashboard", label: "Home" },
        ...(isAdmin
          ? [{ href: "/admin", label: "Admin", accent: true as const }]
          : []),
      ]
    : [
        { href: "/signin", label: "Sign in" },
        { href: "/signup", label: "Create account" },
      ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="inline-flex flex-col gap-[5px] py-1.5 text-ink"
      >
        <span
          className={
            "block w-5 h-px bg-current transition-transform " +
            (open ? "translate-y-[6px] rotate-45" : "")
          }
        />
        <span
          className={
            "block w-5 h-px bg-current transition-opacity " +
            (open ? "opacity-0" : "")
          }
        />
        <span
          className={
            "block w-5 h-px bg-current transition-transform " +
            (open ? "-translate-y-[6px] -rotate-45" : "")
          }
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Menu"
          className="fixed inset-0 top-14 z-40 md:hidden flex flex-col bg-paper"
        >
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-8 space-y-10">
              {sections.map((section) => (
                <div key={section.eyebrow}>
                  <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                    {section.eyebrow}
                  </div>
                  <ul className="mt-3 border-t border-rule">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block py-3 border-b border-rule text-[1rem] text-ink hover:text-accent transition-colors"
                        >
                          {link.label}{" "}
                          <span
                            aria-hidden
                            className="text-ink-subtle ml-1"
                          >
                            &rarr;
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <div className="text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle font-medium">
                  Account
                </div>
                <ul className="mt-3 border-t border-rule">
                  {accountLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={
                          "block py-3 border-b border-rule text-[1rem] hover:text-accent transition-colors " +
                          ("accent" in link && link.accent
                            ? "text-flag"
                            : "text-ink")
                        }
                      >
                        {link.label}{" "}
                        <span aria-hidden className="text-ink-subtle ml-1">
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  ))}
                  {signedIn && (
                    <li>
                      <form
                        action="/api/auth/signout"
                        method="post"
                        className="block py-3 border-b border-rule"
                      >
                        <button
                          type="submit"
                          className="text-[1rem] text-ink-muted hover:text-ink transition-colors"
                        >
                          Sign out
                        </button>
                      </form>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
