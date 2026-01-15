import { AsyncLocalStorage } from 'async_hooks';

export class AsyncContext {
    private static storage = new AsyncLocalStorage<Map<string, any>>();

    static run(callback: () => void) {
        const store = new Map<string, any>();
        this.storage.run(store, callback);
    }

    static set(key: string, value: any) {
        const store = this.storage.getStore();
        if (store) {
            store.set(key, value);
        }
    }

    static get(key: string) {
        const store = this.storage.getStore();
        return store ? store.get(key) : undefined;
    }

    static setUserId(userId: string) {
        this.set('userId', userId);
    }

    static getUserId(): string | undefined {
        return this.get('userId');
    }

    static setIpAddress(ip: string) {
        this.set('ipAddress', ip);
    }

    static getIpAddress(): string | undefined {
        return this.get('ipAddress');
    }

    static setUserAgent(ua: string) {
        this.set('userAgent', ua);
    }

    static getUserAgent(): string | undefined {
        return this.get('userAgent');
    }
}
