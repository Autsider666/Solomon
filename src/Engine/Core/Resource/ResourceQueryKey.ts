export class ResourceQueryKey {
    constructor(
        public readonly name: string,
        public readonly depth: number,
    ) {
    }

    get hashCode(): number {
        return 0; //FIXME
    }

    equals(key: unknown): boolean {
        if (!(key instanceof ResourceQueryKey)) {
            return false;
        }

        return this.name === key.name && this.depth === key.depth;
    }

    public toString(): string {
        return `${this.name} (${this.depth})`;
    }
}