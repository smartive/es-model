import { Field } from '../models/Mapping';
import { generatePropertyDecorator } from '../utils/decorators';

// tslint:disable-next-line:variable-name - This is a decorator
export const EsProperty = generatePropertyDecorator<Field>('properties');
