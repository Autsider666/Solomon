export class Pronoun {
    static you: Pronoun = new Pronoun('you', 'you', 'your');
    static she: Pronoun = new Pronoun('she', 'her', 'her');
    static he: Pronoun = new Pronoun('he', 'him', 'his');
    static it: Pronoun = new Pronoun('it', 'it', 'its');
    static they: Pronoun = new Pronoun('they', 'them', 'their');

    constructor(
        public readonly subjective: string,
        public readonly objective: string,
        public readonly possessive: string,
    ) {
    }
}