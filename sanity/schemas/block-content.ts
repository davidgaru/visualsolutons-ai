import { defineArrayMember, defineType } from "sanity";

export const blockContentSchema = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" }
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" }
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] })
              }
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text"
        },
        {
          name: "caption",
          type: "string",
          title: "Caption"
        }
      ]
    }),
    defineArrayMember({
      type: "object",
      name: "embed",
      title: "Embed",
      fields: [
        {
          name: "url",
          type: "url",
          title: "URL",
          description: "Paste a YouTube, Vimeo, Facebook, or any link to embed",
          validation: (rule) => rule.required()
        },
        {
          name: "caption",
          type: "string",
          title: "Caption"
        }
      ],
      preview: {
        select: { title: "url", subtitle: "caption" }
      }
    })
  ]
});
