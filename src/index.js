function app() {
   gl.clear(gl.COLOR_BUFFER_BIT)
   for(let i = 0; i < object.length; ++i) {
      object[i].draw(gl)
   }
   setTimeout(app)
}

setTimeout(app)