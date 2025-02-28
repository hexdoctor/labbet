import { Monom } from "./math/monom.mjs";
import { Polynom } from "./math/polynom.mjs";

let A = Monom.parse('x^2a^9zp');
let B = Monom.parse('a^89');
let C = Monom.parse('a^98x^2zp^1');

//console.log(`${A} gånger ${B} är ${Monom.mul(A, B)}`);
let P = Polynom.parse('x+y+z+w+1');
console.log(`P = ${P}`);

let Q = Polynom.parse('x+y+z-w');
console.log(`Q = ${Q}`);

console.log(`P*Q = ${Polynom.mul(P,Q)}`);

function testCompare(strA, strB) {
    console.log('------------------------')
    let A = Monom.parse(strA);
    let B = Monom.parse(strB);
    console.log('A = ', A);
    console.log('B = ', B);
    console.log('compare(A,B) = ', Monom.compare(A, B))
    console.log('compare(B,A) = ', Monom.compare(B, A))
    let arr = [A, B];
    arr.sort(Monom.compare);
    console.log(arr.map(a => a.toString()).join());
}

