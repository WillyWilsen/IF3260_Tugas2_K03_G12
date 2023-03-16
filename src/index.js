const x_angle = document.getElementById('x_angle')
const y_angle = document.getElementById('y_angle')
const z_angle = document.getElementById('z_angle')

let selectedIdx = 0

function app() {
   gl.clear(gl.COLOR_BUFFER_BIT)
   for(let i = 0; i < object.length; i++) {
      object[i].draw(gl)
   }
   setTimeout(app)
}
setTimeout(app)

function rotateEventListener(rotation, axis) {
   const angle = rotation * Math.PI / 180
   const points = object[selectedIdx].getPoints()
   const midpoint = calculateMidpoint(points)
   for(let i = 0; i < points.length; i++) {
      const resetRotatedPoint = resetRotatePoint(points[i], eval(`object[selectedIdx].angle.${axis}`), midpoint, axis)
      const rotatedPoint = rotatePoint(resetRotatedPoint, angle, midpoint, axis)
      object[selectedIdx].setPoint(i, rotatedPoint)
   }
   if (axis === 'x') {
      object[selectedIdx].setAngle({
         x: angle,
         y: object[selectedIdx].angle.y,
         z: object[selectedIdx].angle.z
      })
   } else if (axis === 'y') {
      object[selectedIdx].setAngle({
         x: object[selectedIdx].angle.x,
         y: angle,
         z: object[selectedIdx].angle.z
      })
   } else if (axis === 'z') {
      object[selectedIdx].setAngle({
         x: object[selectedIdx].angle.x,
         y: object[selectedIdx].angle.y,
         z: angle
      })
   }
}

x_angle.addEventListener("input", (e) => {
   rotateEventListener(e.target.value, 'x')
})
y_angle.addEventListener("input", (e) => {
   rotateEventListener(e.target.value, 'y')
})
z_angle.addEventListener("input", (e) => {
   rotateEventListener(e.target.value, 'z')
})