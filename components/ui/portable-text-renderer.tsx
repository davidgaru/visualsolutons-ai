"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

type PortableTextRendererProps = {
  value: PortableTextBlock[];
};

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

function getFacebookVideoEmbedUrl(url: string): string | null {
  if (!/facebook\.com|fb\.watch/i.test(url)) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
}

function EmbedBlock({ value }: { value: { url?: string; caption?: string } }) {
  const url = value?.url;
  if (!url) return null;

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return (
      <Reveal>
        <figure className="pt-embed">
          <div className="pt-embed__wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <figcaption className="pt-embed__caption">{value.caption}</figcaption>
          )}
        </figure>
      </Reveal>
    );
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return (
      <Reveal>
        <figure className="pt-embed">
          <div className="pt-embed__wrapper">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?dnt=1`}
              title="Vimeo video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <figcaption className="pt-embed__caption">{value.caption}</figcaption>
          )}
        </figure>
      </Reveal>
    );
  }

  const fbUrl = getFacebookVideoEmbedUrl(url);
  if (fbUrl) {
    return (
      <Reveal>
        <figure className="pt-embed">
          <div className="pt-embed__wrapper">
            <iframe
              src={fbUrl}
              title="Facebook video"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <figcaption className="pt-embed__caption">{value.caption}</figcaption>
          )}
        </figure>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <figure className="pt-embed">
        <a href={url} className="pt-embed__link-card" target="_blank" rel="noopener noreferrer">
          <span className="pt-embed__link-icon">&#8599;</span>
          <span className="pt-embed__link-url">{url}</span>
        </a>
        {value.caption && (
          <figcaption className="pt-embed__caption">{value.caption}</figcaption>
        )}
      </figure>
    </Reveal>
  );
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <Reveal>
        <h2 className="pt-heading pt-heading--h2">{children}</h2>
      </Reveal>
    ),
    h3: ({ children }) => (
      <Reveal>
        <h3 className="pt-heading pt-heading--h3">{children}</h3>
      </Reveal>
    ),
    h4: ({ children }) => (
      <Reveal>
        <h4 className="pt-heading pt-heading--h4">{children}</h4>
      </Reveal>
    ),
    normal: ({ children }) => (
      <Reveal>
        <p className="pt-paragraph">{children}</p>
      </Reveal>
    ),
    blockquote: ({ children }) => (
      <Reveal>
        <blockquote className="pt-blockquote">{children}</blockquote>
      </Reveal>
    )
  },
  list: {
    bullet: ({ children }) => (
      <Reveal>
        <ul className="pt-list pt-list--bullet">{children}</ul>
      </Reveal>
    ),
    number: ({ children }) => (
      <Reveal>
        <ol className="pt-list pt-list--number">{children}</ol>
      </Reveal>
    )
  },
  listItem: {
    bullet: ({ children }) => <li className="pt-list-item">{children}</li>,
    number: ({ children }) => <li className="pt-list-item">{children}</li>
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="pt-link"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
  },
  types: {
    image: ({ value }) => {
      const url = value?.asset?.url;
      if (!url) return null;
      return (
        <Reveal>
          <figure className="pt-image">
            <Image
              src={url}
              alt={value.alt || ""}
              width={1400}
              height={800}
              className="pt-image__img"
            />
            {value.caption && (
              <figcaption className="pt-image__caption">{value.caption}</figcaption>
            )}
          </figure>
        </Reveal>
      );
    },
    embed: EmbedBlock
  }
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="pt-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
