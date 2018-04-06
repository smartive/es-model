import { getMetadata, setMetadata } from './metadata';

export function generateObjectDecorator<T>(): (data?: T) => ClassDecorator {
  return (data?: T): ClassDecorator => (target: any) => setMetadata(target.prototype, data);
}

export function generatePropertyDecorator<T>(key: string): (data?: T) => PropertyDecorator {
  return (data?: T): PropertyDecorator => (target: Object, name: string | symbol) => {
    let mapping = getMetadata<{ [key: string]: T | undefined }>(target, key);
    if (!mapping) {
      mapping = {};
      setMetadata(target, mapping, key);
    }
    mapping[name] = data;
  };
}
