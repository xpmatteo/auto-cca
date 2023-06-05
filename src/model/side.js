
export class Side {
    static ROMAN = new Side('Roman');
    static CARTHAGINIAN = new Side('Carthaginian');
    constructor(name) {
        this.name = name;
    }

    toString() {
        return `Side: ${this.name}`;
    }
}
