import Link from "next/link";
import { LogoMark } from "@/components/branding/logo-mark";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <LogoMark compact className="site-footer__logo" />
          <p className="site-footer__tagline">Cinematic AI visuals for advertising, film, VFX, and animation.</p>
        </div>

        <div className="site-footer__links">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="site-footer__meta">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
          <p>{new Date().getFullYear()} Visual Solutions AI</p>
        </div>
      </div>
    </footer>
  );
}
