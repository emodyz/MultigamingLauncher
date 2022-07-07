import { BehaviorSubject } from 'rxjs'

export type Constructor<T = {}> = new (...args: any[]) => T;

export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type SyncableAttributes<T extends any> = {
  // @ts-ignore
  [Property in keyof NonFunctionProperties<T> as `${Property}Sync`]: BehaviorSubject<T[Property]>
} & T;
