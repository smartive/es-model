export type SimpleFieldType = 'text' | 'keyword' | 'date' | 'long' | 'double' | 'boolean' | 'ip';
export type ObjectFieldType = 'object' | 'nested';
export type SpecializedFieldType = 'geo_point' | 'geo_shape' | 'completion';

export type Field = {
  type?: SimpleFieldType | Function;
  search_analyzer?: 'suggestion_query_analyzer';
  analyzer?: 'suggestion_analyzer';
};

export type Fields = {
  [name: string]: Field,
};

export type MappingMeta = {
  name?: string;
  dynamic?: 'strict';
  _source?: {
    enabled: boolean;
  };
};

export type SubMappingMeta = {
  type?: SimpleFieldType | ObjectFieldType;
};
