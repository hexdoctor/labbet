class Matrix3x3 extends Function {
    constructor(r1,r2,r3) {
      super('...args', 'return this.__self__.__call__(...args)')
      var self = this.bind(this)
      this.__self__ = self
      self.a = [r1,r2,r3];
      return self
    }
  
    // Example `__call__` method.
    __call__(i,j) {
      return this.a[i][j];
    }
}
c
// returns qaq^-1 where q is orthogonal
function conjugate(q, a) {
    const 
        r = a(0,0) - a(2,2),
        s = a(1,0),
        t = a(2,0) + a(0,2),
        u = a(0,1),
        v = a(1,1) - a(2,2),
        w = a(2,1) + a(1,2),
        x = q(0,1)*a(0,2) - q(0,0)*a(1,2),
        y = q(1,1)*a(0,2) - q(1,0)*a(1,2),
        z = q(2,1)*a(0,2) - q(2,0)*a(1,2);
    const 
        b00 = r*q(0,0) + s*q(0,1) + t*q(0,2),
        b10 = r*q(1,0) + s*q(1,1) + t*q(1,2),
        b20 = r*q(2,0) + s*q(2,1) + t*q(2,2),
        b01 = u*q(0,0) + v*q(0,1) + w*q(0,2),
        b11 = u*q(1,0) + v*q(1,1) + w*q(1,2),
        b21 = u*q(2,0) + v*q(2,1) + w*q(2,2);
    let 
        c01 = b00*q(1,0) + b01*q(1,1), 
        c11 = b10*q(1,0) + b11*q(1,1), 
        c21 = b20*q(1,0) + b21*q(1,1),
        c02 = b00*q(2,0) + b01*q(2,1),
        c12 = b10*q(2,0) + b11*q(2,1),
        c22 = b20*q(2,0) + b21*q(2,1);
    let
        c00 = r + v - c11 - c22,
        c10 = b10*q(0,0) + b11*q(0,1),
        c20 = b20*q(0,0) + b21*q(0,1);
    c00 += a(2,2);
    c11 += a(2,2);
    c22 += a(2,2);
    c10 += z;
    c01 -= z;
    c02 += y;
    c20 -= y;
    c21 += x;
    c12 -= x;
    return new Matrix3x3(
        [c00,c01,c02],
        [c10,c11,c12],
        [c20,c21,c22]
    )
}
