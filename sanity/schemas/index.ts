import { type SchemaTypeDefinition } from "sanity";
import { blockContentSchema } from "./block-content";
import { postSchema } from "./post";
import { projectSchema } from "./project";
import { serviceSchema } from "./service";
import { siteSettingsSchema } from "./site-settings";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContentSchema,
  serviceSchema,
  projectSchema,
  postSchema,
  siteSettingsSchema
];
