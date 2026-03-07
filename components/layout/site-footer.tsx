import Link from "next/link";
import { LogoMark } from "@/components/branding/logo-mark";
import { siteConfig } from "@/lib/site-config";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function VimeoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609C15.9 20.367 13.024 22.5 10.618 22.5c-1.488 0-2.75-1.375-3.78-4.129l-2.065-7.574C4.034 8.043 3.253 6.668 2.412 6.668c-.19 0-.856.4-1.996 1.196L0 7.196c1.254-1.103 2.49-2.207 3.708-3.312 1.673-1.445 2.927-2.205 3.762-2.28 1.977-.19 3.194 1.163 3.65 4.06.492 3.13.834 5.077 1.024 5.838.57 2.587 1.194 3.88 1.876 3.88.53 0 1.327-.84 2.392-2.52 1.062-1.68 1.63-2.959 1.706-3.84.152-1.453-.418-2.18-1.706-2.18-.608 0-1.234.14-1.878.414 1.247-4.088 3.632-6.071 7.157-5.953 2.613.079 3.846 1.773 3.696 5.08z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <LogoMark compact className="site-footer__logo" />
          <p className="site-footer__tagline">Cinematic AI visuals for advertising, film, VFX, and animation.</p>
          <div className="site-footer__social">
            <a href="https://www.instagram.com/visualsolutions.ai" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://vimeo.com/visualsolutionsai" target="_blank" rel="noopener noreferrer" aria-label="Vimeo">
              <VimeoIcon />
            </a>
            <a href="https://www.linkedin.com/company/visual-solutions-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
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
