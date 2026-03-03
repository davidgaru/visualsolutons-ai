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
    }),
    defineArrayMember({
      type: "object",
      name: "beforeAfter",
      title: "Before / After",
      fields: [
        {
          name: "mediaType",
          type: "string",
          title: "Media Type",
          initialValue: "video",
          options: {
            list: [
              { title: "Video", value: "video" },
              { title: "Image", value: "image" }
            ],
            layout: "radio"
          }
        },
        {
          name: "beforeVideo",
          type: "file",
          title: "Before Video",
          options: { accept: "video/*" },
          hidden: ({ parent }) => parent?.mediaType === "image"
        },
        {
          name: "afterVideo",
          type: "file",
          title: "After Video",
          options: { accept: "video/*" },
          hidden: ({ parent }) => parent?.mediaType === "image"
        },
        {
          name: "beforeImage",
          type: "image",
          title: "Before Image",
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== "image"
        },
        {
          name: "afterImage",
          type: "image",
          title: "After Image",
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== "image"
        },
        {
          name: "beforeLabel",
          type: "string",
          title: "Before Label",
          initialValue: "Before"
        },
        {
          name: "afterLabel",
          type: "string",
          title: "After Label",
          initialValue: "After"
        },
        {
          name: "caption",
          type: "string",
          title: "Caption"
        }
      ],
      preview: {
        select: { subtitle: "caption" },
        prepare({ subtitle }) {
          return { title: "Before / After", subtitle };
        }
      }
    })
  ]
});
