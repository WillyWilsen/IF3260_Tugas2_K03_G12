const x_angle = document.getElementById('x_angle')
const y_angle = document.getElementById('y_angle')
const z_angle = document.getElementById('z_angle')

let selectedIdx = 0

function app() {
   gl.clear(gl.COLOR_BUFFER_BIT)
   for(let i = 0; i < objects.length; ++i) {
      objects[i].draw(gl)
   }
   setTimeout(app)
}
setTimeout(app)

function rotateEventListener(angle, axis) {
   const points = objects[selectedIdx].getPoints()
   const midpoint = calculateMidpoint(points)
   for(let i = 0; i < points.length; ++i) {
      const rotatedPoint = rotatePoint(points[i], angle - eval(`objects[selectedIdx].angle.${axis}`), midpoint, axis)
      objects[selectedIdx].setPoint(i, rotatedPoint)
   }
   if (axis === 'x') {
      objects[selectedIdx].setAngle({
         x: angle,
         y: objects[selectedIdx].angle.y,
         z: objects[selectedIdx].angle.z
      })
   } else if (axis === 'y') {
      objects[selectedIdx].setAngle({
         x: objects[selectedIdx].angle.x,
         y: angle,
         z: objects[selectedIdx].angle.z
      })
   } else if (axis === 'z') {
      objects[selectedIdx].setAngle({
         x: objects[selectedIdx].angle.x,
         y: objects[selectedIdx].angle.y,
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


canvas.addEventListener("mousedown", (e) => {
   isClicked = true
})
canvas.addEventListener("mousemove", (e) => {
   if (isClicked) {
      var rect = canvas.getBoundingClientRect()
      const pos = {
         x: e.clientX - rect.left,
         y: e.clientY - rect.top
      }
      const convertedPoint = convertPoint(rect, pos)
      const distance = substractPoint(convertedPoint, objects[selectedIdx].translation)
      const points = objects[selectedIdx].getPoints()
      for(let i = 0; i < points.length; ++i) {
         const movedPoint = movePoint(points[i], distance)
         objects[selectedIdx].setPoint(i, movedPoint)
      }
      objects[selectedIdx].setTranslation(convertedPoint)
   }
})
canvas.addEventListener("mouseup", (e) => {
   isClicked = false
})
canvas.addEventListener("mouseout", (e) => {
   isClicked = false
})


document.getElementById("load-btn").onclick = load;


/**
 * Load
 */
function load() {
   // Confirmation
   const confirmation = confirm("Do you want to continue? Existing objects will be discarded");
   if (!confirmation) {
       return;
   }

   // Create upload element
   const uploadElement = document.createElement('input');
   uploadElement.type = "file";
   uploadElement.accept = "application/json";
   uploadElement.style.display = 'none';
   document.body.appendChild(uploadElement);

   // Set onchange listener, then click the element
   uploadElement.onchange = fileUploaded;
   uploadElement.click();

   // Remove from body
   document.body.removeChild(uploadElement);
}

/**
* Handle when a file has been uploaded
* @param {Event} e 
*/
function fileUploaded(e) {
   // Check whether files empty
   /** @type {FileList} */
   const files = e.target.files
   if (files.length == 0) {
       return;
   }

   // Create file reader
   const file = files[0];
   const reader = new FileReader();

   // Setting file reader on load
   reader.onload = (e) => {
      const rawObject = JSON.parse(e.target.result);
      const model = new Model([], [], []);
      Object.assign(model, rawObject);
   
      model.init(gl);
      objects.push(model);
   }
   
   // Begin reading
   reader.readAsText(file)
}
