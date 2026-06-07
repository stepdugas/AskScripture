import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user";
import { MobileMenu } from "./mobile-menu";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const isAdmin = !!user?.isAdmin;
  const signedIn = !!user;

  return (
    <header className="border-b border-rule">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center hover:opacity-80 transition-opacity"
            aria-label="AskScripture, home"
          >
            <Image
              src="/logo.svg"
              alt="AskScripture"
              width={156}
              height={32}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop / tablet nav (>= md) */}
          <nav className="hidden md:flex items-center gap-7 text-[0.8125rem] text-ink-muted">
            <Link href="/today" className="hover:text-ink transition-colors">
              Today
            </Link>
            <Link href="/genesis/1" className="hover:text-ink transition-colors">
              Read
            </Link>
            <Link
              href="/compare/john/1"
              className="hover:text-ink transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/word-study"
              className="hover:text-ink transition-colors"
            >
              Word Study
            </Link>
            <Link
              href="/search"
              className="hover:text-ink transition-colors"
              aria-label="Search the Bible"
            >
              Search
            </Link>
            <Link
              href="/modes"
              className="hover:text-ink transition-colors hidden lg:inline"
            >
              Modes
            </Link>
            <Link
              href="/plans"
              className="hover:text-ink transition-colors hidden lg:inline"
            >
              Plans
            </Link>
            <Link
              href="/about"
              className="hover:text-ink transition-colors hidden lg:inline"
            >
              About
            </Link>
            <span className="h-4 w-px bg-rule" aria-hidden />
            {signedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-ink hover:text-accent transition-colors"
                >
                  Home
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-flag hover:text-ink transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-ink-muted hover:text-ink transition-colors"
                    aria-label="Sign out"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-ink hover:text-accent transition-colors"
              >
                Sign in
              </Link>
            )}
          </nav>

          {/* Mobile (< md) — hamburger + drawer. Sign-in link stays inline so
              an anonymous mobile visitor still sees the primary CTA. */}
          <div className="md:hidden flex items-center gap-4 text-[0.8125rem]">
            {!signedIn && (
              <Link
                href="/signin"
                className="text-ink hover:text-accent transition-colors"
              >
                Sign in
              </Link>
            )}
            <MobileMenu signedIn={signedIn} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </header>
  );
}
