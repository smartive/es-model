import { Field, Fields, MappingMeta, SubMappingMeta } from '../models/Mapping';
import { getMetadata, getPrimitiveType } from './metadata';

export interface EsIndexTemplateMappings {
  [name: string]: EsIndexTemplateMapping;
}

export interface EsIndexTemplateMapping {
  dynamic?: 'strict';
  _source?: {
    enabled: boolean;
  };
  properties: EsIndexTemplateMappingFields;
}

export interface EsIndexTemplateMappingFields {
  [name: string]: EsIndexTemplateMappingField;
}

export interface EsIndexTemplateMappingField {
  type: string;
  include_in_parent?: boolean;
  search_analyzer?: string;
  analyzer?: string;
  format?: string;
  properties?: EsIndexTemplateMappingFields;
  fields?: EsIndexTemplateMappingFields;
}

export function buildMappings(types: Function[]): EsIndexTemplateMappings {
  const mappings: EsIndexTemplateMappings = {};

  for (const type of types) {
    const { name, mapping } = buildMapping(type.prototype);
    mappings[name || type.name.toLowerCase()] = mapping;
  }

  return mappings;
}

function buildMapping(type: Function): { name: string | undefined, mapping: EsIndexTemplateMapping } {
  const mapping: EsIndexTemplateMapping = {
    properties: {},
  };
  let name: string | undefined;
  const meta = getMetadata<MappingMeta>(type);

  if (meta) {
    name = meta.name;
    mapping._source = meta._source;
    mapping.dynamic = meta.dynamic;
  }
  
  const properties = getMetadata<Fields>(type, 'properties');
  if (properties) {
    mapping.properties = buildFields(properties, type);
  }

  return { name, mapping };
}

function buildFields(data: Fields, type: Function): EsIndexTemplateMappingFields {
  const fields: EsIndexTemplateMappingFields = {};
  for (const name of Object.keys(data)) {
    fields[name] = buildField(data[name], name, type);
  }
  return fields;
}

const PRIMITIVE_TYPES: { [key: string]: string } = {
  String: 'keyword',
  Boolean: 'boolean',
};

function buildField(field: Field, name: string, type: Function): EsIndexTemplateMappingField {
  let res: EsIndexTemplateMappingField = {
    type: 'keyword',
  };
  const primitiveType = getPrimitiveType(type, name);
  if (primitiveType && PRIMITIVE_TYPES[primitiveType.name]) {
    res.type = PRIMITIVE_TYPES[primitiveType.name];
  }

  if (field) {
    res = {
      ...field,
      ...res,
    };
    if (field.type) {
      if (field.type instanceof Function) {
        if (PRIMITIVE_TYPES[field.type.name]) {
          res.type = PRIMITIVE_TYPES[field.type.name];
        } else {
          res.type = 'object';

          const prototype = field.type.prototype;
      
          const fieldTypeMeta = getMetadata<SubMappingMeta>(prototype);
          if (fieldTypeMeta) {
            res = { ...res, ...fieldTypeMeta };
          }
      
          const properties = getMetadata<Fields>(prototype, 'properties');
          if (properties) {
            res.properties = buildFields(properties, prototype);
          }
          const fields = getMetadata<Fields>(prototype, 'fields');
          if (fields) {
            res.fields = buildFields(fields, prototype);
          }
        }
      } else if (field.type) {
        res.type = field.type;
      }
    }
  }

  return res;
}
