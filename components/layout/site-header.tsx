"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { LogoMark } from "@/components/branding/logo-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <LogoMark compact className="site-header__logo" />

        <button
          className={clsx("menu-toggle", menuOpen && "menu-toggle--open")}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={clsx("site-nav", menuOpen && "site-nav--open")}>
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx("site-nav__link", pathname === item.href && "site-nav__link--active")}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/contact" className="button button--small" onClick={() => setMenuOpen(false)}>
            Book a Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
