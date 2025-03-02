const transpose = (A) => {
    const m = A.length, n = A[0].length;
    const B = Array(n);
    for (let k = 0; k < n; k++) {
        B[k] = Array(m);
        for (let r = 0; r < m; r++) {
            B[k][r] = A[r][k];
        }
    }
    return B;
}

const multiply = (A, B) => {
    const m = A.length, n = B[0].length;
    console.assert(A[0].length == B.length);
    const C = Array(m);
    for (let r = 0; r < m; r++) {
        C[r] = Array(n);
        for (let k = 0; k < n; k++) {
            C[r][k] = 0;
            for (let i = 0; i < B.length; i++) {
                C[r][k] += A[r][i] * B[i][k];
            }
        }
    }
    return C;
}
const XtrX3 = (X) => {
    console.assert(X.length == 3);
    const n = X[0].length;
    let b11 = 0, b22 = 0, b33 = 0, b12 = 0, b13 = 0, b23 = 0;
    for (let i = 0; i < n; i++) {
        b11 += X[0][i]**2;
        b22 += X[1][i]**2;
        b33 += X[2][i]**2;
        b12 += X[0][i]*X[1][i];
        b13 += X[0][i]*X[2][i];
        b23 += X[1][i]*X[2][i];
    }
    return [[b11, b12, b13], [b12, b22, b23], [b13, b23, b33]];
}

function det3x3(matrix) {
    return (
        matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
        matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
        matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );
}

function Matrix(m, n) {
    return Array.from({ length: m }, () => Array(n).fill(0));
}

function SVD(A) {
    var m = A.length;
    var n = A[0].length;
    if (m < n) {
        const { u, q, v } = SVDJS.SVD(transpose(A), 'f');
        return { u: v, q, v: u };
    } else {
        return SVDJS.SVD(A);
    }
}

function NAVA({ u, q, v }) {
    const nullspace = transpose(v).filter((_, i) => q[i] === 0 || i >= q.length);
    const range = transpose(u).filter((_, i) => q[i] !== 0);
    return { nullspace, range };
}
// x1 = x0 + multiply(pseudoInverse(J), -y)
function pseudoInverse({u,q,v}) {
    const tmp = Matrix(v.length, u.length);
    for (const i in q) {
        const s = q[i];
        if (s > 0) {//TODO: epsilon
            for (j = 0; j < u.length; j++) {
                tmp[i][j] = u[j][i] / s
            }
        }
    }
    return multiply(v, tmp)
}
function mineig3x3sym(m) {
    const d1 = m[0][0], d2 = m[1][1], d3 = m[2][2];
    const t = m[0][1], c = m[0][2], s = m[1][2];
    console.assert(t == m[1][0] && c == m[2][0] && s == m[2][1]);
    
    const p1 = t**2 + c**2 + s**2;    
    if (p1 == 0) { // m is diagonal
        if (d1 == d2 == d3) {
            return {l: d1, e: [0,0,1]};
        } else if (d1 == d2) {
            if (d3 > d1) {
                return {l: d1, e: [1,0,0]};
            } else {
                return {l: d3, e: [0,0,1]};
            }
        } else if (d2 == d3) {
            if (d1 < d2) {
                return {l: d1, e: [1,0,0]};
            } else {
                return {l: d2, e:[0,0,1]};
            }
        } else if (d1 == d3) {
            if (d2 < d1) {
                return {l:d2, e:[0,1,0]};
            } else {
                return {l:d3, e:[0,0,1]};
            }
        } else if (d1 > d2 > d3) {
            return {l:d3, e:[0,0,1]};
        } else if (d2 > d3 > d1) {
            return {l:d1, e:[1,0,0]};
        } else if (d3 > d1 > d2) {
            return {l:d2, e:[0,1,0]};
        } else if (d3 > d2 > d1) {
            return {l:d1, e:[1,0,0]};
        } else if (d2 > d1 > d3) {
            return {l:d3, e:[0,0,1]};
        } else {
            return {l:d2, e:[0,1,0]};
        }
    }
    else { // m is not diagonal hence also m have more than one distinct eigenvalues
        const q = (d1 + d2 + d3) / 3;
        const p2 = (d1 - q)**2 + (d2 - q)**2 + (d3 - q)**2 + 2*p1;
        const p = Math.sqrt(p2 / 6);

        const b11 = (d1 - q) / p, b12 = t / p, b13 = c / p
        const b22 = (d2 - q) / p, b23 = s / p, b33 = (d3 - q) / p;
        const r = (
            b11 * (b22 * b33 - b23 * b23) - 
            b12 * (b12 * b33 - b13 * b23) + 
            b13 * (b12 * b23 - b13 * b22)
        ) / 2;
        let lmax, lmin, lmid;
        if (r >= 1) {
            lmax = q + 2*p;
            lmin = q - p;
            lmid = lmin;    
        } else if (r <= -1) {
            lmax = q + p;
            lmin = q - 2*p;
            lmid = lmax;
        } else {
            const phi = Math.acos(r) / 3;
            lmax = q + 2 * p * Math.cos(phi);
            lmin = q + 2 * p * Math.cos(phi + 2 * Math.PI / 3);
            lmid = 3*q - lmax - lmin;
        }
        console.assert(lmax > lmin, "eigenvalues should be distinct");
        if (lmid <= lmin) {
            let u = normalize3([
                (d1+d2-lmin-lmax)*t + c*s,
                t**2 + (d2-lmin)*(d2-lmax) + s**2,
                c*t + s*(d2+d3-lmin-lmax)
            ]);
            return {l:lmin, e:u};
        } else if (lmid >= lmax) {
            let u = normalize3([
                (d1-lmax)**2 + t**2 + c**2, 
                t*(d1+d2-2*lmax) + s*c, 
                c*(d1+d3-2*lmax) + s*t
            ]);
            return {l:lmin, e:u};
        } else {
            let u = normalize3([
                (d1+d2-lmid-lmax)*t + c*s,
                t**2 + (d2-lmid)*(d2-lmax) + s**2,
                c*t + s*(d2+d3-lmid-lmax)
            ]);
            return {l:lmin, e:u};
        }

    }
}

function eigen3x3symmetric(m){
    const d1 = m[0][0], d2 = m[1][1], d3 = m[2][2];
    const t = m[0][1], c = m[0][2], s = m[1][2];
    console.assert(t == m[1][0] && c == m[2][0] && s == m[2][1]);
    
    const p1 = t**2 + c**2 + s**2;    
    if (p1 == 0) { // m is diagonal
        if (d1 == d2 == d3) {
            return [{l: d1, es: [[1,0,0], [0,1,0], [0,0,1]]}];
        } else if (d1 == d2) {
            if (d3 > d1) {
                return [{l:d3, es: [[0,0,1]]}, {l: d1, es: [[1,0,0],[0,1,0]]}];
            } else {
                return [{l:d1, es: [[1,0,0], [0,1,0]]}, {l: d3, es: [[0,0,1]]}];
            }
        } else if (d2 == d3) {
            if (d1 < d2) {
                return [{l: d2, es: [[0,1,0],[0,0,1]]},{l: d1, es: [[1,0,0]]}];
            } else {
                return [{l: d1, es: [[1,0,0]]},{l: d2, es: [[0,1,0],[0,0,1]]}];
            }
        } else if (d1 == d3) {
            if (d2 < d1) {
                return [{l:d3, es:[[0,0,1],[1,0,0]]}, {l:d2, es:[[0,1,0]]}];
            } else {
                return [{l:d2, es:[[0,1,0]]}, {l:d3, es:[[0,0,1],[1,0,0]]}];
            }
        } else if (d1 > d2 > d3) {
            return [{l:d1, es:[[1,0,0]]}, {l:d2, es:[[0,1,0]]}, {l:d3, es:[[0,0,1]]}];
        } else if (d2 > d3 > d1) {
            return [{l:d2, es:[[0,1,0]]}, {l:d3, es:[[0,0,1]]}, {l:d1, es:[[1,0,0]]}];
        } else if (d3 > d1 > d2) {
            return [{l:d3, es:[[0,0,1]]}, {l:d1, es:[[1,0,0]]}, {l:d2, es:[[0,1,0]]}];
        } else if (d3 > d2 > d1) {
            return [{l:d3, es:[[0,0,-1]]}, {l:d2, es:[[0,1,0]]}, {l:d1, es:[[1,0,0]]}];
        } else if (d2 > d1 > d3) {
            return [{l:d2, es:[[0,1,0]]}, {l:d1, es:[[-1,0,0]]}, {l:d3, es:[[0,0,1]]}];
        } else {
            return [{l:d1, es:[[1,0,0]]}, {l:d3, es:[[0,0,1]]}, {l:d2, es:[[0,-1,0]]}];
        }
    }
    else { // m is not diagonal hence also m have more than one distinct eigenvalues
        const q = (d1 + d2 + d3) / 3;
        const p2 = (d1 - q)**2 + (d2 - q)**2 + (d3 - q)**2 + 2*p1;
        const p = Math.sqrt(p2 / 6);

        const b11 = (d1 - q) / p, b12 = t / p, b13 = c / p
        const b22 = (d2 - q) / p, b23 = s / p, b33 = (d3 - q) / p;
        const r = (
            b11 * (b22 * b33 - b23 * b23) - 
            b12 * (b12 * b33 - b13 * b23) + 
            b13 * (b12 * b23 - b13 * b22)
        ) / 2;
        let lmax, lmin, lmid;
        if (r >= 1) {
            lmax = q + 2*p;
            lmin = q - p;
            lmid = lmin;    
        } else if (r <= -1) {
            lmax = q + p;
            lmin = q - 2*p;
            lmid = lmax;
        } else {
            const phi = Math.acos(r) / 3;
            lmax = q + 2 * p * Math.cos(phi);
            lmin = q + 2 * p * Math.cos(phi + 2 * Math.PI / 3);
            lmid = 3*q - lmax - lmin;
        }
        console.assert(lmax > lmin, "eigenvalues should be distinct");
        if (lmid <= lmin) {
            let v = normalize3([
                (d1-lmin)**2 + t**2 + c**2, 
                t*(d1+d2-2*lmin) + s*c, 
                c*(d1+d3-2*lmin) + s*t
            ]);
            let u = normalize3([
                (d1+d2-lmin-lmax)*t + c*s,
                t**2 + (d2-lmin)*(d2-lmax) + s**2,
                c*t + s*(d2+d3-lmin-lmax)
            ]);
            return [{l:lmax, es:[v]}, {l:lmin, es:[ cross(u, v), u]}];
        } else if (lmid >= lmax) {
            let u = normalize3([
                (d1-lmax)**2 + t**2 + c**2, 
                t*(d1+d2-2*lmax) + s*c, 
                c*(d1+d3-2*lmax) + s*t
            ]);
            let v = normalize3([
                (d1+d2-lmin-lmax)*t + c*s,
                t**2 + (d2-lmin)*(d2-lmax) + s**2,
                c*t + s*(d2+d3-lmin-lmax)
            ]);
            return [{l:lmax, es:[v, cross(u,v)]}, {l:lmin, es:[u]}];
        } else {
            let u = normalize3([
                (d1+d2-lmid-lmax)*t + c*s,
                t**2 + (d2-lmid)*(d2-lmax) + s**2,
                c*t + s*(d2+d3-lmid-lmax)
            ]);
            let v = normalize3([
                (d1+d2-lmin-lmid)*t + c*s,
                t**2 + (d2-lmin)*(d2-lmid) + s**2,
                c*t + s*(d2+d3-lmin-lmid)
            ]);
            return [{l:lmax, es:[v]},{l:lmid, es:[cross(u,v)]},{l:lmin, es:[u]}];
        }

    }
}

function eigenvalues(a11, a22, a33, a12, a13, a23) {
    const p1 = a12 ** 2 + a13 ** 2 + a23 ** 2;
    let phi;
    let eig1, eig3;
    if (p1 == 0) {
        return [a11, a22, a33];
    } else {
        const q = (a11 + a22 + a33) / 3;
        const p2 = (a11 - q) ** 2 + (a22 - q) ** 2 + (a33 - q) ** 2 + 2 * p1;
        const p = Math.sqrt(p2 / 6);
        const b11 = (a11 - q) / p, b12 = a12 / p, b13 = a13 / p
        const b22 = (a22 - q) / p, b23 = a23 / p, b33 = (a33 - q) / p;
        const r = (
            b11 * (b22 * b33 - b23 * b23) - 
            b12 * (b12 * b33 - b13 * b23) + 
            b13 * (b12 * b23 - b13 * b22)
        ) / 2;
        if (r <= -1) {
            phi = Math.PI / 3;
        } else if (r >= 1) {
            phi = 0;
        } else {
            phi = Math.acos(r) / 3
        }
        eig1 = q + 2 * p * Math.cos(phi);
        eig3 = q + 2 * p * Math.cos(phi + 2 * Math.PI / 3);
        return [eig1, 3 * q - eig1 - eig3, eig3]
    }
}

const cross = ([a,b,c],[x,y,z]) => [b*z-c*y,c*x-a*z,a*y-b*x];
function norm3([x,y,z]) {
    const square = x * x + y * y + z * z;
    if (Number.isFinite(square)) return Math.sqrt(square)
    else {
        const a = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
        return a*Math.sqrt((x/a)**2 + (y/a)**2 + (z/a)**2);
    }
}

function normalize3(v) {
    const d = norm3(v);
    return [v[0]/d, v[1]/d, v[2]/d];
}
