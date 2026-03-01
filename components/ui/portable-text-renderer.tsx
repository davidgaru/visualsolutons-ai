"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

type PortableTextRendererProps = {
  value: PortableTextBlock[];
};

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
    }
  }
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="pt-content">
      <PortableText value={value} components={components} />
    </div>
  );
}
