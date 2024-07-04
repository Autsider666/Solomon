export class ResourceTag<T> {
    constructor(
        public readonly name: string,
        public readonly parent?: ResourceTag<T>,
    ) {
    }

    contains(tag: ResourceTag<T>): boolean {
        if (tag === this) {
            return true;
        }

        let currentTag: ResourceTag<T> | undefined = this.parent;
        while (currentTag) {
            if (currentTag === tag) {
                return true;
            }

            currentTag = currentTag.parent;
        }

        return false;
    }

    toString(): string {
        if (this.parent) {
            return `${this.parent}/${this.name}`;
        }

        return this.name;
    }
}