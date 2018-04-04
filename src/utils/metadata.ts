export const KEY = 'es-model';

export function setMetadata(target: any, metadata: any, key?: string): void {
  if (key) {
    Reflect.defineMetadata(
      KEY,
      metadata,
      target,
      key,
    );
  } else {
    Reflect.defineMetadata(
      KEY,
      metadata,
      target,
    );
  }
}

export function getMetadata<T>(target: any, key?: string): T {
  if (key) {
    return Reflect.getMetadata(KEY, target, key);
  }

  return Reflect.getMetadata(KEY, target);
}

export function getPrimitiveType(objectType: Function, key: string): Function | null {
  return Reflect.getMetadata('design:type', objectType, key);
}
