import { Monom } from "./monom.mjs";
import { Polynom } from "./polynom.mjs";

let A = Monom.parse('x^2a^9zp');
let B = Monom.parse('a^89');
let C = Monom.parse('a^98x^2zp^1');

//console.log(`${A} gånger ${B} är ${Monom.mul(A, B)}`);
// let P = Polynom.parse('x+y+z+w+1');
// console.log(`P = ${P}`);

// let Q = Polynom.parse('x+y+z-w');
// console.log(`Q = ${Q}`);

// console.log(`P*Q = ${Polynom.mul(P,Q)}`);

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

/*****************************************************
 * EIGEN 3x3 PERFORMANCE TEST 
 */
import { eigs, multiply, transpose } from 'mathjs';
import { eigen3x3symmetric } from "./linear.mjs";
import { mat3, conjugate } from "./linear3d.mjs";


const m_1 = [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0]
]

const m_2 = [
    [3, -2, 4],
    [-2, 6, 2],
    [4, 2, 3]
]
const q = new mat3(
    1/3, 2/3, 2/3,
    2/3, 1/3, -2/3,
    -2/3, 2/3, -1/3
)

const a = new mat3(
    88, 0, 0,
    0, -3, 0,
    0, 0, -27
)

const m_3 = conjugate(q,a).data;


let start, end, results = {
    m_1: {},
    m_2: {},
    m_3: {},
};

start = process.hrtime.bigint();
eigen3x3symmetric(m_1);
end = process.hrtime.bigint();
results.m_1.LabLinear = (end - start) / 1000n;

start = process.hrtime.bigint();
eigs(m_1);
end = process.hrtime.bigint();
results.m_1.MathJS = (end - start) / 1000n;

start = process.hrtime.bigint();
eigen3x3symmetric(m_2);
end = process.hrtime.bigint();
results.m_2.LabLinear = (end - start) / 1000n;

start = process.hrtime.bigint();
eigs(m_2);
end = process.hrtime.bigint();
results.m_2.MathJS = (end - start) / 1000n;

start = process.hrtime.bigint();
eigen3x3symmetric(m_3);
end = process.hrtime.bigint();
results.m_3.LabLinear = (end - start) / 1000n;

start = process.hrtime.bigint();
eigs(m_3);
end = process.hrtime.bigint();
results.m_3.MathJS = (end - start) / 1000n;

console.log("MathJS vs linear: eigen 3x3", results);

/*****************************************************
 * CONJUGATE PERFORMANCE TEST 
 */
const q_ = q.data, a_ = a.data;
results = {}

start = process.hrtime.bigint();
conjugate(q,a);
end = process.hrtime.bigint();
results.LabLinear = (end - start) / 1000n;

start = process.hrtime.bigint();
multiply(q_,a_, transpose(q_))
end = process.hrtime.bigint();
results.MathJS = (end - start) / 1000n;

console.log("MathJS vs linear: conjugate", results);

//console.log((end - start) / 1000n, 'µs?', ...eig1.map(({l}) => (l)));
//console.log((end - start) / 1000n, 'µs?', ...eig2.values);