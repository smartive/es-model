// Types according to https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html
export type CoreDatatype =
  | 'text'
  | 'keyword'
  | 'date'
  | 'date_nanos'
  | 'long'
  | 'integer'
  | 'short'
  | 'byte'
  | 'double'
  | 'float'
  | 'half_float'
  | 'scaled_float'
  | 'boolean'
  | 'binary'
  | 'integer_range'
  | 'float_range'
  | 'long_range'
  | 'double_range'
  | 'date_range';
export type ComplexDatatype = 'object' | 'nested';
export type SpecialisedDatatype =
  | 'geo_point'
  | 'geo_shape'
  | 'completion'
  | 'ip'
  | 'completion'
  | 'token_count'
  | 'murmur3'
  | 'annotated-text';

export type Field = {
  type?: CoreDatatype | SpecialisedDatatype | Function;
  search_analyzer?: string;
  analyzer?: string;
  format?: 'date' | 'hour_minute';
};

export type Fields = {
  [name: string]: Field;
};

export type MappingMeta = {
  name?: string;
  dynamic?: 'strict';
  _source?: {
    enabled: boolean;
  };
};

export type SubMappingMeta = {
  type?: CoreDatatype | ComplexDatatype;
  include_in_parent?: boolean;
};
