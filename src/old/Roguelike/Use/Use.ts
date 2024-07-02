import {Entity} from "../Entity/Entity.ts";

export type UseType = 'melee' | 'defense' | 'quaff';

export abstract class Use {

    abstract get type(): UseType;

    abstract use(something: Entity): void;
}