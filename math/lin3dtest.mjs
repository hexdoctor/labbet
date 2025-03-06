import { mat3, conjugate, eigvalsym3 } from "./linear3d.mjs";
const s2 = new mat3(
     3,-2, 4,
    -2, 6, 2,
     4, 2, 3
);
const s2_eigenvalues = [7,7,-2];
const s1 = new mat3(
     0, -1,  0,
    -1,-1/2, 1,
     0,  1, -1
);
const s1_eigenvalues = [1,-0.5,-2]

console.log(`Matrix:\n${s1}`);
console.log(`Eigenvalues: ${s1_eigenvalues}`);
console.log(`Computed Eigenvalues: ${eigvalsym3(s1)}`);

console.log(`Matrix:\n${s2}`);
console.log(`Eigenvalues: ${s2_eigenvalues}`);
console.log(`Computed Eigenvalues: ${eigvalsym3(s2)}`);