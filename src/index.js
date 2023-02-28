var vertexShaderSource = `#version 300 es

in vec4 a_position;

void main() {

  gl_Position = a_position;
}
`

var fragmentShaderSource = `#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0.5, 1);
}
`

/**
 * ref. https://webgl2fundamentals.org/webgl/lessons/ko/webgl-boilerplate.html
 *
 * @param {!WebGLRenderingContext} gl
 * @param {number} shaderType
 * @param {string} shaderSource
 * @return {!WebGLShader}
 */
function createShader(gl, shaderType, shaderSource) {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    throw ("could not compile shader:" + gl.getShaderInfoLog(shader))
  }
 
  return shader
}

/**
 * ref. https://webgl2fundamentals.org/webgl/lessons/ko/webgl-boilerplate.html
 *
 * @param {!WebGLRenderingContext} gl
 * @param {!WebGLShader} vertexShader
 * @param {!WebGLShader} fragmentShader
 * @return {!WebGLProgram}
 */
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    throw ("program failed to link:" + gl.getProgramInfoLog (program))
  }
 
  return program
}

function main() {
  // Get A WebGL context
  const canvas = document.querySelector("canvas")
  const gl = canvas.getContext("webgl2")
  if (!gl) {
    return
  }

  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader)

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position")

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer()

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [
    0, 0,
    0, 0.5,
    0.2, 0,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2          // 2 components per iteration
  var type = gl.FLOAT   // the data is 32bit floats
  var normalize = false // don't normalize the data
  var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset)

  webglUtils.resizeCanvasToDisplaySize(gl.canvas)

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program)

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao)

  // draw
  var primitiveType = gl.TRIANGLES
  var offset = 0
  var count = 3
  gl.drawArrays(primitiveType, offset, count)
}

main()
