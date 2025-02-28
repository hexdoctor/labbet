const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    console.error("WebGL2 is not supported in this browser.");
}

// Vertex Shader
const vertCode = `#version 300 es
    precision highp float;
    
    uniform vec3 dim;
    uniform vec3 center;
    uniform vec3 e1;
    uniform vec3 e2;
    uniform vec3 e3;

    in vec3 coordinates;
    
    void main(void) {
        vec3 r = coordinates - center;
        vec3 v = vec3(2.0 * dot(r, e1) / dim[0], 
                      2.0 * dot(r, e2) / dim[1], 
                      dot(r, e3) / dim[2]);
        
        gl_Position = vec4(v, v.z + 1.0);
        gl_PointSize = 10.0;
    }
  `;

// Fragment Shader
const fragCode = `#version 300 es
    precision highp float;
    out vec4 outColor;
    
    void main(void) {
        outColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;

const shaderProgram = linkProgram(gl, vertCode, fragCode);

// Create Buffers
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

const coordLocation = gl.getAttribLocation(shaderProgram, "coordinates");
gl.enableVertexAttribArray(coordLocation);
gl.vertexAttribPointer(coordLocation, 3, gl.FLOAT, false, 0, 0);

const indexBuffer = gl.createBuffer();

function draw(camera, points, lines) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), gl.STATIC_DRAW);

    gl.uniform3f(gl.getUniformLocation(shaderProgram, "dim"), camera.width, camera.height, camera.depth);
    gl.uniform3f(gl.getUniformLocation(shaderProgram, "center"), ...camera.center);
    gl.uniform3f(gl.getUniformLocation(shaderProgram, "e1"), ...camera.base[0]);
    gl.uniform3f(gl.getUniformLocation(shaderProgram, "e2"), ...camera.base[1]);
    gl.uniform3f(gl.getUniformLocation(shaderProgram, "e3"), ...camera.base[2]);

    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawArrays(gl.POINTS, 0, points.length / 3);
    gl.drawElements(gl.LINES, lines.length, gl.UNSIGNED_SHORT, 0);
}

function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function linkProgram(gl, vertCode, fragCode) {
    const vertShader = compileShader(gl, vertCode, gl.VERTEX_SHADER);
    const fragShader = compileShader(gl, fragCode, gl.FRAGMENT_SHADER);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader program linking failed: " + gl.getProgramInfoLog(shaderProgram));
    }
    return shaderProgram;
}

class WebGLRenderer {
    constructor(canvasSelector) {
        this.canvas = document.querySelector(canvasSelector);
        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl) throw "WebGL2 is not supported in this browser.";
    }
}
