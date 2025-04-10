import format from "@stdlib/string-format";

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === "undefined";

export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === "object";

export const isPlainObject = (fn: any): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, "constructor") &&
    proto.constructor;
  return (
    typeof ctor === "function" &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
    Function.prototype.toString.call(Object)
  );
};

export const isArray = (fn: any): boolean => Array.isArray(fn);

export const addLeadingSlash = (path?: string): string =>
  path && typeof path === "string"
    ? !path.startsWith("/")
      ? "/" + path
      : path
    : "";

export const normalizePath = (path?: string): string =>
  path
    ? path.startsWith("/")
      ? ("/" + path.replace(/\/+$/, "")).replace(/\/+/g, "/")
      : "/" + path.replace(/\/+$/, "")
    : "/";

export const stripEndSlash = (path: string) =>
  path.endsWith("/") ? path.slice(0, path.length - 1) : path;

export const isFunction = (val: any): val is Function =>
  typeof val === "function";
export const isString = (val: any): val is string => typeof val === "string";
export const isNumber = (val: any): val is number => typeof val === "number";
export const isConstructor = (val: any): boolean => val === "constructor";
export const isNil = (val: any): val is null | undefined =>
  isUndefined(val) || val === null;
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isSymbol = (val: any): val is symbol => typeof val === "symbol";

export const generateColors = () => {
  const colors: string[] = [];
  for (let i = 50; i <= 231; i++) {
    colors.push(`\x1b[38;5;${i}m`);
  }
  return colors;
};

export function SString(str: string, ...args: any[]) {
  return format(str, ...args);
}


export function adicionarColisoresDeMalha(entity: pc.Entity) {
  if (entity.render && entity.render.meshInstances.length > 0) {
    entity.addComponent('collision', {
      type: 'mesh',
      asset: entity.render.meshInstances[0].mesh
    });


    entity.addComponent('rigidbody', {
      type: 'static'
    });
  }

  entity.children.forEach((child: any) => adicionarColisoresDeMalha(child));
}
