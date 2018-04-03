import { getMetadata, setMetadata } from './metadata';

export function generateObjectDecorator<T>(): (data: T) => ClassDecorator {
  return (data: T): ClassDecorator => (target: any) => setMetadata(target.prototype, data);
}

export function generatePropertyDecorator<T>(key: string): PropertyDecorator {
  return (data: T) => (target: Object, name: string) => {
    let mapping = getMetadata<{ [key: string]: T }>(target, key);
    if (!mapping) {
      mapping = {};
      setMetadata(target, mapping, key);
    }
    mapping[name] = data;
  };
}
