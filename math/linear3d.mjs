export class mat3 extends Function {
    constructor(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        super('...args', 'return this.__self__.get(...args)')
        var self = this.bind(this)
        this.__self__ = self
        self.data = [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]];
        return self
    }

    // Example `get` method.
    get(i, j) {
        return this.data[i][j];
    }
    
    [Symbol.iterator]() {
        let i = 0, j = 0;
        return {
            next() {
                //return 
            }
        }
    }

    toString() {
        return (
            `⎡${this(0,0)} ${this(0,1)} ${this(0,2)}⎤\n` +
            `⎢${this(1,0)} ${this(1,1)} ${this(1,2)}⎥\n` +
            `⎣${this(2,0)} ${this(2,1)} ${this(2,2)}⎦\n,`
        );
    }
}

// returns qaq^-1 where q is orthogonal
export function conjugate(q, a) {
    const
        r = a(0, 0) - a(2, 2),
        s = a(1, 0),
        t = a(2, 0) + a(0, 2),
        u = a(0, 1),
        v = a(1, 1) - a(2, 2),
        w = a(2, 1) + a(1, 2),
        x = q(0, 1) * a(0, 2) - q(0, 0) * a(1, 2),
        y = q(1, 1) * a(0, 2) - q(1, 0) * a(1, 2),
        z = q(2, 1) * a(0, 2) - q(2, 0) * a(1, 2);
    const
        b00 = r * q(0, 0) + s * q(0, 1) + t * q(0, 2),
        b10 = r * q(1, 0) + s * q(1, 1) + t * q(1, 2),
        b20 = r * q(2, 0) + s * q(2, 1) + t * q(2, 2),
        b01 = u * q(0, 0) + v * q(0, 1) + w * q(0, 2),
        b11 = u * q(1, 0) + v * q(1, 1) + w * q(1, 2),
        b21 = u * q(2, 0) + v * q(2, 1) + w * q(2, 2);
    let
        c01 = b00 * q(1, 0) + b01 * q(1, 1),
        c11 = b10 * q(1, 0) + b11 * q(1, 1),
        c21 = b20 * q(1, 0) + b21 * q(1, 1),
        c02 = b00 * q(2, 0) + b01 * q(2, 1),
        c12 = b10 * q(2, 0) + b11 * q(2, 1),
        c22 = b20 * q(2, 0) + b21 * q(2, 1);
    let
        c00 = r + v - c11 - c22,
        c10 = b10 * q(0, 0) + b11 * q(0, 1),
        c20 = b20 * q(0, 0) + b21 * q(0, 1);
    c00 += a(2, 2);
    c11 += a(2, 2);
    c22 += a(2, 2);
    c10 += z;
    c01 -= z;
    c02 += y;
    c20 -= y;
    c21 += x;
    c12 -= x;
    return new mat3(
        c00, c01, c02,
        c10, c11, c12,
        c20, c21, c22
    )
}

// let LABBET = {};
// LABBET.testa3D = function () {
//     const a = new mat3(
//          1,-2, 3,
//          -3,0, 5,
//         -1, 1, 2
//     );
//     let q = new mat3(
//         1,0,0,
//         0,1,0,
//         0,0,1
//     );
//     console.log(`${a}`);
//     let b = conjugate(q,a);
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             console.assert(a(i,j) == b(i,j), "bad");
//         }
//     }
//     q = new mat3(
//         0,-1,0,
//         1,0,0,
//         0,0,1
//     );
//     b = conjugate(q,a);
//     console.log(`${b}`);
//     q = new mat3(
//         0,1,0,
//         -1,0,0,
//         0,0,1
//     );
//     b = conjugate(q,b);
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             console.assert((a(i,j) == b(i,j)));
//         }
//     }
//     console.log(`${b}`);
// }

// LABBET.testa3D();