// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class _Context<T> {}

export const Context: new<T>() => _Context<T> & T = _Context as any
// eslint-disable-next-line no-redeclare
export type Context<T> = _Context<T> & T
