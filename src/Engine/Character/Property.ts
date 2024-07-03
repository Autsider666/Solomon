export class Property<T extends number> {
    protected _value?: T;

    get value(): T {
        return this._value!;
    }

    public update(value: T, onChange: (previousValue: T) => void): void {
        if (value === this._value) {
            return;
        }

        const previous = this._value;
        this._value = value;
        if (previous !== undefined) {
            onChange(previous);
        }
    }
}