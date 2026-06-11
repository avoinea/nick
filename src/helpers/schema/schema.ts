/**
 * Schema helper.
 * @module helpers/schema/schema
 */

// External imports
import { compact } from 'es-toolkit/array';
import { mapValues } from 'es-toolkit/object';
import { isUndefined } from 'es-toolkit/compat';

// Internal imports
import { Fieldset, Property, Schema, Request } from '../../types';

/**
 * Merge schemas
 * @method mergeSchemas
 * @param {Array} schemas Array of schemas
 * @returns {Schema} Merged schemas.
 */
export function mergeSchemas(
  ...schemas: { name: string; data: Schema }[]
): Schema {
  const fieldsets: Fieldset[] = [];
  let properties: { [key: string]: Property } = {};
  let required: string[] = [];
  let behaviors: string[] = [];
  let layouts: string[] = [];

  schemas.map((schema) => {
    if (schema.data.fieldsets) {
      schema.data.fieldsets.map((fieldset) => {
        // Find fieldset
        const index = fieldsets.findIndex((entry) => entry.id === fieldset.id);

        // Check if already exists
        if (index !== -1) {
          // Append fields
          fieldsets[index].fields = [
            ...fieldsets[index].fields,
            ...fieldset.fields,
          ];
        } else {
          // Add new fieldset
          fieldsets.push({
            behavior: schema.name,
            ...fieldset,
          });
        }
      });
    }
    properties = {
      ...properties,
      ...mapValues(schema.data.properties || [], (property: any) => ({
        behavior: schema.name,
        ...property,
      })),
    };
    if (schema.data.required) {
      required = [...required, ...schema.data.required];
    }
    if (schema.data.behaviors) {
      behaviors = [...behaviors, ...schema.data.behaviors];
    }
    if (schema.data.layouts) {
      layouts = [...layouts, ...schema.data.layouts];
    }
  });
  return {
    fieldsets,
    properties,
    required,
    ...(behaviors.length > 0 ? { behaviors } : {}),
    ...(layouts.length > 0 ? { layouts } : {}),
  };
}

/**
 * Translate the schema
 * @method translateSchema
 * @param {Schema} schema Schema object.
 * @param {Request} req Request object.
 * @returns {Schema} Translated schema.
 */
export function translateSchema(schema: Schema, req: Request): Schema {
  return {
    ...schema,
    fieldsets: schema.fieldsets.map((fieldset) => ({
      ...fieldset,
      title: req.i18n(fieldset.title),
    })),
    properties: mapValues(schema.properties as any, (property: Property) => ({
      ...property,
      title: req.i18n(property.title),
      description: req.i18n(property.description || ''),
    })),
  };
}

/**
 * Format schema to html
 * @method schemaToHtml
 * @param {Schema} schema Schema object.
 * @param {any} data Data of the schema.
 * @returns {string} Schema in html schema.
 */
export function schemaToHtml(schema: Schema, data: any): string {
  return schema.fieldsets
    .map(
      (fieldset) =>
        `<table>${fieldset.id === 'default' ? '' : `<tr><th colspan="2">${fieldset.title}</th>`}</tr>${fieldset.fields.map((field) => `<tr><th>${schema.properties?.[field].title || ''}</th><td>${isUndefined(data[field]) ? '' : data[field]}</td></tr>`).join('\n')}</table>`,
    )
    .join('\n');
}

/**
 * Get factory fields.
 * @method getFactoryFields
 * @param {Schema} schema Schema object.
 * @param {string} factory Factory field.
 * @returns {string[]} Array of fields with given factory.
 */
export function getFactoryFields(schema: Schema, factory: string): string[] {
  const properties: any = schema.properties || {};

  // Get factory fields
  const factoryFields = Object.keys(properties).map((property) =>
    properties[property].factory === factory ? property : false,
  );
  return compact(factoryFields) as string[];
}
