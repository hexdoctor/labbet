// Helps keeping keys sorted in ascending ASCII order
/** @extends {Map}  */
class SortedMap extends Map {
    constructor(entries) {
        entries?.sort?.();
        super(entries);
    }

    static *merge(A, B) {
        const iterA = A.entries(), iterB = B.entries();

        let a = iterA.next(), b = iterB.next();
        while (!a.done || !b.done) {
            if (b.done || (!a.done && a.value[0] < b.value[0])) {
                yield a.value;
                a = iterA.next();
            } else {
                yield b.value;
                b = iterB.next();
            }
        }
    }
}

/** @extends {Map<string,number>}  */
export class Monom extends SortedMap {

    degree = 0

    /** @type {(A: Monom, B: Monom) => Monom} */
    static mul(A, B) {
        const C = new Monom();
        for (const [key, exp] of SortedMap.merge(A, B)) {
            C.set(key, C.has(key) ? C.get(key) + exp : exp);
            C.degree += exp;
        }
        return C;
    }

    /** @type {(A: Monom, B: Monom) => Boolean} */
    static eq(A, B) {
        if (A.size != B.size) return false;
        for (const [key, exp] of A) {
            if (!B.has(key) || B.get(key) != exp) return false;
        }
        return true;
    }

    /** @type {(A: Monom, B: Monom) => number} */
    static compare(A, B) {
        const iterA = A.entries(), iterB = B.entries();        
        let a = iterA.next(), b = iterB.next();
        while (!a.done && !b.done) {
            if (a.value[0] < b.value[0]) return -1;
            if (a.value[0] > b.value[0]) return 1;
            if (a.value[1] < b.value[1]) return 1;
            if (a.value[1] > b.value[1]) return -1;
            a = iterA.next();
            b = iterB.next();
        }
        if (a.done && !b.done) return 1;
        if (b.done && !a.done) return -1;
        return 0;
    }

    set(key, exp) {
        const exp0 = this.get(key);
        if (exp) super.set(key, exp);
        else this.delete(key);
    }

    // get degree() {
    //     let deg = 0;
    //     for (const [_, exp] of this) deg += exp;
    //     return deg;
    // }

    /** @type {(str: string) => Monom>} */
    static parse(str) {
        return new Monom(
            str.match(/([a-z]\d*)(\^\d+)?/g)?.map(s => {
                const [key, exp] = s.split('^');
                return [key, exp == undefined ? 1 : Number(exp)];
            }).filter(([_, exp]) => exp > 0)
        );
    }

    /** @type {() => string} */
    toString() {
        let str = '';
        for (const [key, exp] of this)
            str += exp > 1 ? `${key}^${exp}` : key;
        return str;
    }
}
