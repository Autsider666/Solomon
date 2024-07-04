import {Pronoun} from "../Engine/Core/Logging/Pronoun.ts";

export class StringHelper {
    /**
     * Given a noun pattern, returns the unquantified singular form of it.
     * Examples:
     * singular("dog");           // "dog"
     * singular("dogg[y|ies]");   // "doggy"
     * singular("cockroach[es]"); // "cockroach"
     */
    static singular(text: string): string {
        return this.categorize(text, true);
    }

    // Conjugates the verb pattern in [text] to agree with [pronoun].
    static conjugate(text: string, pronaun: Pronoun): string {
        return this.categorize(text, pronaun === Pronoun.you || pronaun === Pronoun.they);
    }

    static quantify(text: string, count: number): string {
        let quantity: string;
        if (count == 1) {
            // Handle irregular nouns that start with a vowel but use "a", like
            // "a unicorn".
            if (text.startsWith("(a) ")) {
                quantity = "a";
                text = text.substring(4);
            } else if ("aeiouAEIOU".includes(text[0])) {
                quantity = "an";
            } else {
                quantity = "a";
            }
        } else {
            quantity = count.toString();
        }

        return `${quantity} ${this.categorize(text, count == 1, true)}`;
    }

    private static categorize(text: string, isFirst: boolean, force: boolean = false): string {
        const optionalSuffix = /\[(\w+?)]/;
        const irregular = /\[([^|]+)\|([^\]]+)]/;

        // If it's a regular word in second category, just add an "s".
        if (force && !isFirst && !text.includes("[")) {
            return `${text}s`;
        }

        // Handle words with optional suffixes like `close[s]` and `sword[s]`.
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const match = text.match(optionalSuffix);
            if (match == null || match.length === 0) {
                break;
            }

            const before = text.substring(0, match[0].length);
            const after = text.substring(match[match.length - 1].length);
            if (isFirst) {
                // Omit the optional part.
                text = `${before}${after}`;
            } else {
                // Include the optional part.
                text = `${before}${match[1]}${after}`;
            }
        }

        // Handle irregular words like `[are|is]` and `sta[ff|aves]`.
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const match = text.match(irregular);
            if (match == null) {
                break;
            }

            const before = text.substring(0, match[0].length);
            const after = text.substring(match[match.length - 1].length);
            if (isFirst) {
                // Use the first form.
                text = `${before}${match[1]}${after}`;
            } else {
                // Use the second form.
                text = `${before}${match[2]}${after}`;
            }
        }

        return text;
    }

    static capitalize(text: string): string {
        return `${text[0].toUpperCase()}${text.substring(1)}`;
    }
}