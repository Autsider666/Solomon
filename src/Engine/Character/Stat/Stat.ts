export type StatList = Map<Stat, number>;

export enum Stat {
    Vitality = 'Vitality',
}

export const Stats = Object.keys(Stat).filter(value => isNaN(Number(value))) as Stat[];

export const MaxStat: Record<Stat, number> = {
    [Stat.Vitality]: 50,
};