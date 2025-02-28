
function sum(a, b) {
    const c = Array(a[0].length);
    for (let i in a) c[i] = a[i] + b[i];
    return c;
}

function add(a, b) {
    for (let i in a) a[i] += b[i];
    return a;
}

function scale(x, s) {

}

// avg(x1,x2,...xn) = (x1+x2+...+xn)/n
function avg(xs) {
    const n = xs[0].length;
    const y = Array(n);
    for (const x of xs) add(y, x);
    return scale(y, 1 / n);
}

function normalize([x, y, z]) {
    const d = Math.sqrt(x * x + y * y + z * z);
    return [x / d, y / d, z / d];
}
