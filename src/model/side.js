
export class Side {
    static ROMAN = new Side('Roman');
    static CARTHAGINIAN = new Side('Carthaginian');
    static SYRACUSAN = new Side('Syracusan');

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `Side: ${this.name}`;
    }
}
