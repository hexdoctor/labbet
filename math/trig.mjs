const P = [
    -5254.7508920534192751630665,
    6236.4128689522053163220058,
    -2597.2384260994230261835544,
    445.05537923135581032176275,
    -27.342673770163272135013850,
    0.30325426599090297962612977
];

const Q = [
    -5254.7508920534192747096309,
    6674.3087766233233966852037,
    -3054.9042449253514128522165,
    603.81083008747677276795370,
    -47.647718147243950851054008
    // 1.0
];

// Approximate arcsin(sqrt(x/2)) / sqrt(x/2) as MiniMax [5/5] over [0, 1/2].
function asinQ (x) {
    let p = P[5] * x + P[4];
    p = p*x + P[3];
    p = p*x + P[2];
    p = p*x + P[1];
    p = p*x + P[0];

    let q = Q[4] + x; // Q[5] = 1.0
    q = q*x + Q[3];
    q = q*x + Q[2];
    q = q*x + Q[1];
    q = q*x + Q[0];

    return p / q;
}

function my_acos (x) {
    const x_abs = x > 0.0 ? x : -x;

    if (x_abs <= 0.5) {
        return Math.PI/2 - x * asinQ(x*x*2);
    } else {
        const x1 = 1.0 - x_abs;
        const ret = Math.sqrt (2*x1) * asinQ (x1);
        return x > 0.0 ? ret : Math.PI - ret;
    }
}
let myacos1, jsacos1;
let start, end;

start = process.hrtime.bigint();
myacos1 = my_acos(Math.SQRT1_2);
end = process.hrtime.bigint();
const mytime_us = (end - start) / 1000n;
start = process.hrtime.bigint();
jsacos1 = Math.acos(Math.SQRT1_2);
end = process.hrtime.bigint();
const jstime_us = (end - start) / 1000n;
console.log(`myacos:${myacos1}, ${mytime_us} microseconds\njsacos:${jsacos1}, ${jstime_us} microseconds`);