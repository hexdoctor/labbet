import { Monom } from "./monom.mjs";

/** @type {(C: string) => Number} */
function parseCoeff(termStr) {
    const C = termStr.match(/^[+-]?\d*\.?\d*/)[0];
    if (C.length === 0 || C === '+') return 1;
    if (C === '-') return -1;
    return Number(C);
}

// TODO:
//  P(X)=Y
//  P'(X) = [dP/dx1 (X), dP/dx2 (X), ..., dP/dxn (X)]
//  deg(P)=?
export class Polynom {
    /** @typedef {[number, Monom]} Term  */

    /** @type {[Term]} */
    terms = [];

    /** @type {(A: Polynom, B: Polynom) => C: Polynom} */
    static sum(A, B) {
        const C = new Polynom();
        for (const a of A.terms) C.addTerm(a);
        for (const b of B.terms) C.addTerm(b);
        return C;
    }

    /** @type {(A: Polynom, B: Polynom) => Polynom} */
    static mul(A, B) {
        const C = new Polynom();
        for (const a of A.terms) {
            for (const b of B.terms) {
                C.addTerm([a[0] * b[0], Monom.mul(a[1], b[1])]);
            }
        }
        return C;
    }

    /** @type {(coeff: number, monom: Monom) => void} */
    addTerm([coeff, monom]) {
        if (coeff !== 0) {
            const [term, index] = this.searchTerm(monom);
            if (term) {
                term[0] += coeff;
                if (term[0] === 0) this.terms.splice(index, 1);
            }
            else {
                this.terms.splice(index, 0, [coeff, new Monom(monom)]);
            }
        }
    }

    /** @type {(monom: Monom) => [Term, number]} */
    searchTerm(monom) {
        let left = 0;
        let right = this.terms.length;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            const term = this.terms[mid];
            const comp = Monom.compare(term[1], monom);
            if (comp < 0) left = mid + 1;
            else if (comp > 0) right = mid;
            else return [term, mid];
        }
        return [undefined, left];
    }

    /** @type {(A: Term, B: Term) => number} */
    static compareTerms(A, B) {
        const val = Monom.compare(A[1], B[1]);
        if (val == 0) return A[0] - B[0];
        return val;
    }

    /** @type {(str: string) => Polynom>} */
    static parse(str) {
        str = str.replace(/\s+/g, '');
        const matches = [...str.matchAll(/[+-]?[^-+]+/g)];
        const P = new Polynom();
        for (const [term] of matches) {
            P.addTerm([parseCoeff(term), Monom.parse(term)]);
        }
        return P;
    }

    /** @type {() => string} */
    toString() {
        let str = '';
        if (this.terms.length > 0) {
            const [coeff, monom] = this.terms[0];
            if (coeff === 1) str += `${monom}`;
            else if (coeff === -1) str += `-${monom}`;
            else str += `${coeff}${monom}`
            for (const [coeff, monom] of this.terms.slice(1)) {
                if (coeff === 1) str += ` + ${monom}`;
                else if (coeff === -1) str += ` - ${monom}`;
                else if (coeff < 0) str += ` - ${-coeff}${monom}`;
                else str += ` + ${coeff}${monom}`;
            }
        }
        return str;
    }
}
