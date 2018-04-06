import { MappingMeta } from '../models/Mapping';
import { generateObjectDecorator } from '../utils/decorators';

// tslint:disable-next-line:variable-name - This is a decorator
export const EsMapping = generateObjectDecorator<MappingMeta>();
