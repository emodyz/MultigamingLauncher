export interface CacheContract {
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
    has(key: string): boolean;
    delete(key: string): void;
}
