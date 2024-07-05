import {State, Storage} from "./Storage.ts";

export class LocalStorage extends Storage {
    saveStata(state: State): void {
        localStorage.setItem('heroes', JSON.stringify(state));
    }

    loadStata(): State | undefined {
        const stateString = localStorage.getItem('heroes');
        if (!stateString) {
            return undefined;
        }

        return JSON.parse(stateString);
    }
}