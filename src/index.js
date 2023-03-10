import space from './space/space.js'

const vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
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
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
  const colorLocation = gl.getUniformLocation(program, "u_color")

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer()

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray()

  // and make it the one we're currently working with
  gl.bindVertexArray(vao)

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation)

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2          // 2 components per iteration
  const type = gl.FLOAT   // the data is 32bit floats
  const normalize = false // don't normalize the data
  const stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

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

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  space(gl, colorLocation)
}

main()
