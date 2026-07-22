export class ControllerBaseDB {
    constructor(pool) {
        this.pool = pool;
        this.autoBind();
    }

    autoBind() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (const method of methods) {
            if (method !== 'constructor' && typeof this[method] === 'function') {
                this[method] = this[method].bind(this);
            }
        }
    }
}