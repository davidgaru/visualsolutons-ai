export const metadata = {
  title: "Studio | Visual Solutions AI",
  robots: "noindex"
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .site-header,
        .site-footer,
        .grain {
          display: none !important;
        }

        body::before,
        body::after {
          display: none !important;
        }

        html,
        body {
          background: #0f1115 !important;
        }

        body {
          overflow: hidden;
        }

        [data-studio-root] {
          min-height: 100svh;
        }
      `}</style>
      <div data-studio-root>{children}</div>
    </>
  );
}
