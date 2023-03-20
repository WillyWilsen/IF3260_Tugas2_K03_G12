class Model {
    constructor(vertices, colors, faces) {
        //this variable stores only x, y, z
        this.vertices = vertices

        //this variable stores x, y, z
        this.colors = colors

        this.faces = faces

        this.vertexShaderCode = 
        `attribute vec3 position;
        uniform mat4 Pmatrix;
        uniform mat4 Vmatrix;
        uniform mat4 Mmatrix;
        attribute vec3 color;
        varying vec3 vColor;
        void main(void) { 
            gl_Position = vec4(position, 1)*Mmatrix*Vmatrix*Pmatrix;
            vColor = color;
        }
        `

        this.fragmentShaderCode = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1);
        }
        `

        this.program = undefined
        this.vertexShader = undefined
        this.fragmentShader = undefined

        this.proj_matrix = getPerspectiveProjection(45, canvas.width/canvas.height, -1, 1);
        this.mo_matrix = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1 ];
        this.view_matrix = undefined;

        this.angle = {
            x: 0,
            y: 0,
            z: 0
        }
        this.translation = {
            x: 0,
            y: 0,
            z: 0
        }
        this.scale = 1

        this.camera_translation_matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, -5,
            0, 0, 0, 1,
        ]
        this.camera_x_matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
        this.camera_y_matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
        this.camera_z_matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]
        this.setViewMatrix();

        this.camera_zoom = 5
        this.camera_angle_x = 0
        this.camera_angle_y = 0
        this.camera_angle_z = 0

    }

    set(colors, vertices) {
        this.colors = colors
        this.vertices = vertices
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    init(gl) {
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(this.vertexShader, this.vertexShaderCode)
        gl.compileShader(this.vertexShader)
        if(!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(this.vertexShader))
        }

        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(this.fragmentShader, this.fragmentShaderCode)
        gl.compileShader(this.fragmentShader)
        if(!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(this.fragmentShader))
        }

        this.program = gl.createProgram()

        gl.attachShader(this.program, this.vertexShader)
        gl.attachShader(this.program, this.fragmentShader)
        gl.linkProgram(this.program)

        this._Pmatrix = gl.getUniformLocation(this.program, "Pmatrix");
        this._Vmatrix = gl.getUniformLocation(this.program, "Vmatrix");
        this._Mmatrix = gl.getUniformLocation(this.program, "Mmatrix");
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    draw(gl) {

        this.setNormal();

        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

        const vertexPosition = gl.getAttribLocation(this.program, 'position')
        gl.enableVertexAttribArray(vertexPosition)
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)

        const fragmentBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, fragmentBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW)

        const colorPosition = gl.getAttribLocation(this.program, 'color')
        gl.enableVertexAttribArray(colorPosition)
        gl.vertexAttribPointer(colorPosition, 3, gl.FLOAT, false, 0, 0)

        const index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);

        gl.useProgram(this.program)

        gl.uniformMatrix4fv(this._Pmatrix, false, this.proj_matrix);
        gl.uniformMatrix4fv(this._Vmatrix, false, this.view_matrix);
        gl.uniformMatrix4fv(this._Mmatrix, false, this.mo_matrix);

        gl.drawElements(gl.TRIANGLES, this.faces.length, gl.UNSIGNED_SHORT, 0);
    }

    getPoint(index) {
        const getIndex = index * 3

        return {
            x: this.vertices[getIndex],
            y: this.vertices[getIndex + 1],
            z: this.vertices[getIndex + 2]
        }
    }

    getPoints() {
        const result = []
        for(let i = 0; i < this.vertices.length; i += 3) {
            result.push({
                x: this.vertices[i],
                y: this.vertices[i + 1],
                z: this.vertices[i + 2]
            })
        }

        return result
    }

    getPointCount() {
        return this.vertices.length / 3
    }

    setPoint(index, newPoint) {
        const setIndex = index * 3
        this.vertices[setIndex] = newPoint.x
        this.vertices[setIndex + 1] = newPoint.y
        this.vertices[setIndex + 2] = newPoint.z
    }

    setAngle(angle) {
        this.angle = angle
    }

    setTranslation(translation) {
        this.translation = translation
    }

    setScale(scale) {
        this.scale = scale
    }

    setViewMatrix(){
        this.view_matrix = matrixMultiplication(this.camera_translation_matrix, this.camera_x_matrix);
        this.view_matrix = matrixMultiplication(this.view_matrix, this.camera_y_matrix);
        this.view_matrix = matrixMultiplication(this.view_matrix, this.camera_z_matrix);
    }

    moveCameraTo(distance){
        this.camera_translation_matrix[11] = -1*parseFloat(distance);
        this.setViewMatrix();
    }

    rotateCamera(angle, axis){
        const s = Math.sin(angle)
        const c = Math.cos(angle)
        if (axis === "x"){
            this.camera_x_matrix[5] = c;
            this.camera_x_matrix[6] = -1 * s;
            this.camera_x_matrix[9] = s;
            this.camera_x_matrix[10] = c;
        }
        if (axis === "y"){
            this.camera_y_matrix[0] = c;
            this.camera_y_matrix[2] = s;
            this.camera_y_matrix[8] = -1 * s;
            this.camera_y_matrix[10] = c;
        }
        if (axis === "z"){
            this.camera_z_matrix[0] = c;
            this.camera_z_matrix[1] = -1 * s;
            this.camera_z_matrix[4] = s;
            this.camera_z_matrix[5] = c;
        }
        this.setViewMatrix();
    }

    setNormal(){

        this.normal = [];
        let p1, p2, p3;
        let v21, v31;
        let n, l;

        for(let i=0; i<this.faces.length; i+=3){
            
            p1 = {
                x: this.vertices[this.faces[i]*3],
                y: this.vertices[this.faces[i]*3+1],
                z: this.vertices[this.faces[i]*3+2],
            }
            p2 = {
                x: this.vertices[this.faces[i+1]*3],
                y: this.vertices[this.faces[i+1]*3+1],
                z: this.vertices[this.faces[i+1]*3+2],
            }
            p3 = {
                x: this.vertices[this.faces[i+2]*3],
                y: this.vertices[this.faces[i+2]*3+1],
                z: this.vertices[this.faces[i+2]*3+2],
            }

            v21 = {
                x: p2.x - p1.x,
                y: p2.y - p1.y,
                z: p2.z - p1.z,
            }
            v31 = {
                x: p3.x - p1.x,
                y: p3.y - p1.y,
                z: p3.z - p1.z,
            }

            n = {
                x: ((v21.y*v31.z) - (v21.z*v31.y)),
                y: ((v21.z*v31.x) - (v21.x*v31.z)),
                z: ((v21.x*v31.y) - (v21.y*v31.x)),
            }

            l = Math.sqrt(n.x*n.x + n.y*n.y + n.z*n.z);
            n.x /= l;
            n.y /= l;
            n.z /= l;

            this.normal.push(n.x, n.y, n.z);

        }
    }
}

