import { defineArrayMember, defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "client", title: "Client", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "outcome", title: "Outcome", type: "text", rows: 3 }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Campaign Film", value: "Campaign Film" },
          { title: "Brand Film", value: "Brand Film" },
          { title: "VFX", value: "VFX" },
          { title: "Animation", value: "Animation" },
          { title: "Photography", value: "Photography" },
          { title: "Branding", value: "Branding" },
          { title: "Web Design", value: "Web Design" }
        ]
      }
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "YouTube URL", value: "youtube" },
          { title: "Uploaded Video File", value: "upload" },
          { title: "No Video Yet", value: "none" }
        ],
        layout: "radio"
      },
      initialValue: "none"
    }),
    defineField({ name: "videoUrl", title: "YouTube Video URL", type: "url", hidden: ({ parent }) => parent?.mediaType !== "youtube" }),
    defineField({
      name: "videoFile",
      title: "Uploaded Video",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.mediaType !== "upload"
    }),
    defineField({ name: "posterImage", title: "Poster Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
            { name: "caption", type: "string", title: "Caption" }
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "posterImage"
    }
  }
});
