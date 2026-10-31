import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", title: "Site Title", type: "string" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "bookingUrl", title: "Booking URL", type: "url" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 3 }),
    defineField({
      name: "founders", type: "array", description: "Founder profiles displayed on the About page. Drag to reorder.",
      of: [defineArrayMember({
        name: "founder", type: "object",
        fields: [
          defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "biography", type: "text", rows: 6, validation: (rule) => rule.required() }),
          defineField({ name: "portrait", type: "image", options: { hotspot: true } }),
          defineField({ name: "portraitUrl", title: "Portrait URL", type: "url", description: "Used when no portrait image has been uploaded. Supports a local /images/ path.", validation: (rule) => rule.uri({ allowRelative: true, scheme: ["https"] }) }),
          defineField({ name: "portraitAlt", title: "Portrait alternative text", type: "string" }),
          defineField({ name: "portraitCredit", type: "string" }),
          defineField({ name: "portraitSourceUrl", type: "url" }),
          defineField({ name: "portraitPosition", title: "Portrait focal position", type: "string", description: "Optional CSS position, for example center 30%.", validation: (rule) => rule.regex(/^(left|center|right|\d+(\.\d+)?%)( (top|center|bottom|\d+(\.\d+)?%))?$/) }),
          defineField({ name: "credentials", type: "array", of: [defineArrayMember({ name: "credential", type: "object", fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "url", title: "Source URL", type: "url", validation: (rule) => rule.required() })
          ], preview: { select: { title: "label" } } })] })
        ], preview: { select: { title: "name", subtitle: "role", media: "portrait" } }
      })]
    })
  ]
});
