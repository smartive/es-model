import { Field, Fields, MappingMeta, SubMappingMeta } from '../models/Mapping';
import { getMetadata } from './metadata';

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
  properties?: EsIndexTemplateMappingFields;
  fields?: EsIndexTemplateMappingFields;
}

export function buildMappings(types: Function[]): EsIndexTemplateMappings {
  const mappings: EsIndexTemplateMappings = {};

  for (const type of types) {
    const [name, mapping] = buildMapping(type);
    mappings[name || type.name.toLowerCase()] = mapping;
  }

  return mappings;
}

function buildMapping(type: Function): [string | undefined, EsIndexTemplateMapping] {
  const res: EsIndexTemplateMapping = {
    properties: {},
  };
  let name: string | undefined;
  const meta = getMetadata<MappingMeta>(type.prototype);

  if (meta) {
    name = meta.name;
    res._source = meta._source;
    res.dynamic = meta.dynamic;
  }
  
  const properties = getMetadata<Fields>(type.prototype, 'properties');
  if (properties) {
    res.properties = buildFields(properties);
  }

  return [name, res];
}

function buildFields(data: Fields): EsIndexTemplateMappingFields {
  const fields: EsIndexTemplateMappingFields = {};
  for (const name of Object.keys(data)) {
    fields[name] = buildField(data[name]);
  }
  return fields;
}

function buildField(field: Field): EsIndexTemplateMappingField {
  if (!field) {
    return {
      type: 'keyword',
    };
  }

  if (field.type instanceof Function) {
    if (field.type === String) {
      return {
        type: 'keyword',
      };
    }

    const fieldTypeMeta = getMetadata<SubMappingMeta>(field.type.prototype);
    const res: EsIndexTemplateMappingField = {
      type: fieldTypeMeta.type || 'object',
    };

    const properties = getMetadata<Fields>(field.type.prototype, 'properties');
    if (properties) {
      res.properties = buildFields(properties);
    }
    const fields = getMetadata<Fields>(field.type.prototype, 'fields');
    if (fields) {
      res.fields = buildFields(fields);
    }

    return res;
  }
  
  if (field.type) {
    return {
      type: field.type,
    };
  }

  return {
    type: 'keyword',
  };
}
