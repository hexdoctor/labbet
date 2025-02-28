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

function det3x3(matrix) {
    return (
        matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
        matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
        matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );
}

function detSymmetric3x3(matrix) {
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][1], e = matrix[1][2];
    const f = matrix[2][2];

    return a * (d * f - e * e) - b * (b * f - c * e) + c * (b * e - c * d);
}

function Matrix(n, m) {
    return Array.from({ length: n }, () => Array(m).fill(0));
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

function NAVA(A) {
    const { u, q, v } = SVD(A);
    const nullspace = transpose(v).filter((_, i) => q[i] === 0 || i >= q.length);
    const range = transpose(u).filter((_, i) => q[i] !== 0);
    console.assert(range.length + nullspace.length === A[0].length);
    return { nullspace, range };
}
// x1 = x0 + multiply(pseudoInverse(J), -y)
function pseudoInverse({u,q,v}) {
    const S = Matrix(v.length, u.length);
    for (const i in q) {
        const s = q[i];
        if (s > 0) S[i][i] = 1 / s
    }
    return multiply(v, multiply(S, transpose(u)))
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
        const r = (b11 * (b22 * b33 - b23 * b23) - b12 * (b12 * b33 - b13 * b23) + b13 * (b12 * b23 - b13 * b22)) / 2;
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
