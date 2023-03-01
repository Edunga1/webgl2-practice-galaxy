/**
 * @param {!WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} cl
 */
export default function space(gl, cl) {
  const count = 1000
  renderSpace(gl, cl)
  for (let ii = 0; ii < count; ++ii) {
    renderStar(gl, cl, randomInt(1000), randomInt(1000), randomInt(5), randomInt(5))
  }
}

/**
 * @param {!WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} cl
 */
function renderSpace(gl, cl) {
  setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height)
  gl.uniform4f(cl, 0, 0, 0, 1)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

/**
 * @param {!WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} cl
 */
function renderStar(gl, cl, x, y, w, h) {
  const x1 = x
  const x2 = x + w
  const y1 = y
  const y2 = y + h
  gl.uniform4f(cl, 1, 1, 1, 1)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
  ]), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW)
}

function randomInt(range) {
  return Math.floor(Math.random() * range)
}
