import { type SchemaTypeDefinition } from "sanity";
import { postSchema } from "./post";
import { projectSchema } from "./project";
import { serviceSchema } from "./service";
import { siteSettingsSchema } from "./site-settings";

export const schemaTypes: SchemaTypeDefinition[] = [
  serviceSchema,
  projectSchema,
  postSchema,
  siteSettingsSchema
];
