import {Resource} from "./Resource.ts";
import {ResourceQuery, ResourceQueryKey} from "./ResourceQuery.ts";
import {ResourceTag} from "./ResourceTag.ts";

export class ResourceSet<T> {
    private readonly tags: Map<string, ResourceTag<T>> = new Map<string, ResourceTag<T>>();
    private readonly resources: Map<string, Resource<T>> = new Map<string, Resource<T>>();

    //TODO cleanup unused queries?
    private readonly queries: Map<ResourceQueryKey, ResourceQuery<T>> = new Map<ResourceQueryKey, ResourceQuery<T>>();

    get resourceObjects(): Iterable<T> {
        return Array.from(this.resources.values()).map(resource => resource.object);
    }

    add(object: T, name?: string, startDepth?: number, endDepth?: number, startFrequency?: number, endFrequency?: number, tags?: string): void {
        name ??= this.resources.size.toString();
        startDepth ??= 1;
        endDepth ??= startDepth;
        startFrequency ??= 1.0;
        endFrequency ??= startFrequency;

        if (this.resources.has(name)) {
            throw new Error(`Already has a resources named "${name}"`);
        }

        const resource = new Resource<T>(object, startDepth, endDepth, startFrequency, endFrequency);

        this.resources.set(name, resource);

        if (tags === undefined) {
            return;
        }

        for (const tagName of tags.split(" ")) {
            const tag = this.tags.get(tagName);
            if (!tag) {
                throw new Error(`Unknown tag named "${tagName}"`);
            }

            resource.tags.add(tag);
        }
    }

    loadTags(tagGroups: string): void {
        for (const tagGroup of tagGroups.split(" ")) {
            let parent: ResourceTag<T> | undefined;
            let tag: ResourceTag<T> | undefined;
            for (const tagName of tagGroup.split("/")) {
                if (!this.tags.has(tagName)) {
                    tag = new ResourceTag<T>(tagName, parent);
                    this.tags.set(tagName, tag);
                }

                parent = tag;
            }
        }
    }

    private getResource(name: string): Resource<T> {
        const resource = this.resources.get(name);
        if (resource) {
            return resource;
        }

        throw new Error(`Unknown resource named "${name}"`);
    }

    get(name: string): T {
        return this.getResource(name).object;
    }

    tryGet(name: string): T | undefined {
        return this.resources.get(name)?.object;
    }

    getTag(name: string): ResourceTag<T> {
        const tag = this.tags.get(name);
        if (tag) {
            return tag;
        }

        throw new Error(`Unknown tag named "${name}"`);
    }

    tryGetTag(name: string): ResourceTag<T> | undefined {
        return this.tags.get(name);
    }

    hasTag(name: string, tagName: string): boolean {
        const resource = this.getResource(name);

        const tag = this.getTag(tagName);

        return Array.from(resource.tags).find(otherTag => otherTag.contains(tag)) !== undefined;
    }

    getTags(resourceName: string): Iterable<string> {
        return this.getResource(resourceName).getTags();
    }

    doesTagExist(tagName: string): boolean {
        return this.tags.has(tagName);
    }

    tryChoose(depth: number, tagName?: string, includeParentTags: boolean = true): T | undefined {
        if (tagName === undefined) {
            return this.runQuery("", depth, () => 1.0);
        }

        const targetTag = this.tags.get(tagName);
        if (targetTag === undefined) {
            throw new Error(`Invalid tag provided: ${tagName}`);
        }

        let queryLabel = targetTag.name;
        if (!includeParentTags) {
            queryLabel += " (only)";
        }

        return this.runQuery(queryLabel, depth, resource => {
            let scale = 1.0;

            let currentTag: ResourceTag<T> | undefined = targetTag;
            while (currentTag !== undefined) {
                if (resource.hasTag(currentTag)) {
                    return scale;
                }

                if (!includeParentTags) {
                    break;
                }

                scale /= 10.0;

                currentTag = currentTag.parent;
            }

            return 0;
        });
    }

    public tryChooseMatching(depth: number, tagNames: string[]): T | undefined {
        const tags = tagNames.map(tagName => this.getTag(tagName));

        const queryName = tagNames.sort().join('|');

        return this.runQuery(`${queryName} (match)`, depth, resource => {
            for (const resourceTag of resource.tags) {
                if (tags.find(tag => tag.contains(resourceTag))) {
                    return 1.0;
                }
            }

            return 0;
        });

    }

    private runQuery(name: string, depth: number, scale: (resource: Resource<T>) => number): T | undefined {
        const key = ResourceQuery.generateKey(name, depth);
        let query: ResourceQuery<T> | undefined = this.queries.get(key);
        if (query === undefined) {
            const resources: Resource<T>[] = [];
            const chances: number[] = [];
            let totalChance: number = 0.0;

            for (const [, resource] of this.resources) {
                let chance = scale(resource);
                if (chance === 0) {
                    continue;
                }

                chance *= resource.getFrequencyAtDepth(depth) * resource.getChanceAtDepth(depth);

                chance = Math.max(0.0000001, chance); //TODO Theoretically fine, but check if practical

                totalChance += chance;
                resources.push(resource);
                chances.push(totalChance);
            }

            query = new ResourceQuery<T>(depth, resources, chances, totalChance);

            this.queries.set(key, query);
        }

        return query.choose();
    }
}