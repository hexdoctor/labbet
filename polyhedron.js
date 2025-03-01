class Polyhedron {

    constructor(halfedges, vertices, faces) {
        this.halfedges = halfedges;
        this.vertices = vertices;
        this.edges = halfedges.map(({ vertex, next }) => [vertex, next.vertex]);
        this.faces = faces;
        this.V = vertices.length;
        this.E = halfedges.length;
        this.F = faces.length;
    }
    

    edge = (e) => {
        const he = this.halfedges[e];
        return [he.vertex, he.next.vertex];
    };

    static fromLoops(loops, vertices) {
        const mesh = loops.reduce((mesh, loop, face) => {
            const n = loop.length;
            let prev = {}
            const hoop = []
            for (let i = 0; i < n; i++) {
                const curr = { vertex: loop[i], edge: null, face, twin: null };
                prev.next = curr;
                hoop.push(curr);
                prev = curr;
            }
            hoop[n - 1].next = hoop[0];
            return [...mesh, ...hoop];
        }, []);

        const halfedges = [];
        mesh.forEach((he) => {
            if (he.twin !== null) return;
            const a = he.vertex;
            const b = he.next.vertex;
            const twin = mesh.find(he => he.vertex === b && he.next.vertex === a);
            console.assert(twin && twin.twin === null);
            he.twin = twin;
            twin.twin = he;
            halfedges.push(he);
        })

        return new Polyhedron(halfedges, vertices, loops);
    }
}

var phi = 1.61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475408807538689175212663386222353693179318006076672635;
var pho = 0.61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475408807538689175212663386222353693179318006076672635;

var Dodecahedron = () => Polyhedron.fromLoops([
    [5, 15, 14, 1, 19],
    [5, 19, 18, 6, 11],
    [5, 11, 10, 4, 15],
    [4, 17, 0, 14, 15],
    [0, 8, 9, 1, 14],
    [1, 9, 2, 18, 19],
    [2, 12, 13, 6, 18],
    [6, 13, 7, 10, 11],
    [7, 16, 17, 4, 10],
    [3, 8, 0, 17, 16],
    [3, 12, 2, 9, 8],
    [3, 16, 7, 13, 12],
], [
    [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1],
    [1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, 1],
    [0, -pho, -phi], [0, pho, -phi], [0, -pho, phi], [0, pho, phi],
    [-phi, 0, -pho], [-phi, 0, pho], [phi, 0, -pho], [phi, 0, pho],
    [-pho, -phi, 0], [pho, -phi, 0], [-pho, phi, 0], [pho, phi, 0],
])