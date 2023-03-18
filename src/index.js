const model_selected = document.getElementById('model_selected')
const model_list = document.getElementById('model_list')
const x_angle = document.getElementById('x_angle')
const y_angle = document.getElementById('y_angle')
const z_angle = document.getElementById('z_angle')
const x_translation = document.getElementById('x_translation')
const y_translation = document.getElementById('y_translation')
const z_translation = document.getElementById('z_translation')
const scale = document.getElementById('scale')
const load_btn = document.getElementById('load-btn')
const camera_zoom = document.getElementById('camera_zoom')
const camera_angle_x = document.getElementById('camera_angle_x')
const camera_angle_y = document.getElementById('camera_angle_y')
const camera_angle_z = document.getElementById('camera_angle_z')
const reset = document.getElementById('reset')

function app() {
   gl.enable(gl.DEPTH_TEST);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   for(let i = 0; i < objects.length; ++i) {
      objects[i].draw(gl)
   }
   setTimeout(app)
}
setTimeout(app)

/**
* Handle on rotating model
* @param {Event} e
* @param {String} axis 
*/
function rotateEventListener(e, axis) {
   const angle = e.target.value
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

/**
* Handle on moving model
* @param {Event} e
* @param {String} axis 
*/
function moveEventListener(e, axis) {
   const translation = e.target.value
   const points = objects[selectedIdx].getPoints()
   for(let i = 0; i < points.length; ++i) {
      const movedPoint = movePoint(points[i], translation - eval(`objects[selectedIdx].translation.${axis}`), axis)
      objects[selectedIdx].setPoint(i, movedPoint)
   }
   if (axis === 'x') {
      objects[selectedIdx].setTranslation({
         x: translation,
         y: objects[selectedIdx].translation.y,
         z: objects[selectedIdx].translation.z
      })
   } else if (axis === 'y') {
      objects[selectedIdx].setTranslation({
         x: objects[selectedIdx].translation.x,
         y: translation,
         z: objects[selectedIdx].translation.z
      })
   } else if (axis === 'z') {
      objects[selectedIdx].setTranslation({
         x: objects[selectedIdx].translation.x,
         y: objects[selectedIdx].translation.y,
         z: translation
      })
   }
}

/**
* Handle on scaling model
* @param {Event} e
*/
function scaleEventListener(e) {
   const scale = e.target.value
   const points = objects[selectedIdx].getPoints()
   for(let i = 0; i < points.length; ++i) {
      const scaledPoint = scalePoint(points[i], scale / objects[selectedIdx].scale)
      objects[selectedIdx].setPoint(i, scaledPoint)
   }
   objects[selectedIdx].setScale(scale)
}

/**
 * Handle rotate event listener
 */
x_angle.addEventListener("input", (e) => {
   rotateEventListener(e, 'x')
})
y_angle.addEventListener("input", (e) => {
   rotateEventListener(e, 'y')
})
z_angle.addEventListener("input", (e) => {
   rotateEventListener(e, 'z')
})

/**
 * Handle move event listener
 */
x_translation.addEventListener("input", (e) => {
   moveEventListener(e, 'x')
})
y_translation.addEventListener("input", (e) => {
   moveEventListener(e, 'y')
})
z_translation.addEventListener("input", (e) => {
   moveEventListener(e, 'z')
})

/**
 * Handle scale event listener
 */
scale.addEventListener("input", (e) => {
   scaleEventListener(e)
})

/**
 * Handle load file event listener
 */
load_btn.addEventListener("click", (e) => {
   load()
})

/**
* Handle on change selected model
* @param {Event} e
*/
function changeSelected(idx) {
   selectedIdx = idx
   model_selected.innerHTML = `Model Selected: <b>Model ${selectedIdx + 1}</b>`
   x_angle.value = objects[selectedIdx].angle.x
   y_angle.value = objects[selectedIdx].angle.y
   z_angle.value = objects[selectedIdx].angle.z
   x_translation.value = objects[selectedIdx].translation.x
   y_translation.value = objects[selectedIdx].translation.y
   z_translation.value = objects[selectedIdx].translation.z
   scale.value = objects[selectedIdx].scale
   camera_zoom.value = objects[selectedIdx].camera_zoom
   camera_angle_x.value = objects[selectedIdx].camera_angle_x
   camera_angle_y.value = objects[selectedIdx].camera_angle_y
   camera_angle_z.value = objects[selectedIdx].camera_angle_z
}

/**
 * Handle on reset selected model
 */
function resetSelected() {
   x_angle.value = 0
   y_angle.value = 0
   z_angle.value = 0
   x_translation.value = 0
   y_translation.value = 0
   z_translation.value = 0
   scale.value = 1
   camera_zoom.value = 5
   camera_angle_x.value = 0
   camera_angle_y.value = 0
   camera_angle_z.value = 0
}

/**
 * Load
 */
function load() {
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
        loadObjects(e.target.result, true);
   }
   
   // Begin reading
   reader.readAsText(file)
}

/**
 * Load object_string to objects
 * @param {String} object_string 
 * @param {Boolean} isLoading 
 */
function loadObjects(object_string, isLoading){
    const rawObject = JSON.parse(object_string);
    const model = new Model([], [], []);
    Object.assign(model, rawObject);
    model.init(gl);
    objects.push(model);
    if (isLoading){
      default_objects_string.push(object_string);
    }

    model_selected.innerHTML = `Model Selected: <b>Model ${objects.length}</b>`
    model_list.innerHTML += `
    <button onclick="changeSelected(${objects.length - 1})">
        Model ${objects.length}
    </button>
    `
    selectedIdx = objects.length - 1
    resetSelected()
}

/**
 * Handle from moving camera to z = distance
 * @param {String} distance 
 */
function cameraZoomHandler(distance){
    objects[selectedIdx].moveCameraTo(distance);
}
camera_zoom.addEventListener("input", (e) => {
    cameraZoomHandler(e.target.value);
})

/**
 * Handle rotating camera with object as center of rotation
 * @param {String} degree 
 * @param {String} axis 
 */
function cameraRotationHandler(degree, axis){
    radian = parseFloat(degree) * Math.PI / 180;
    objects[selectedIdx].rotateCamera(radian, axis);
}
camera_angle_x.addEventListener("input", (e) => {
    cameraRotationHandler(e.target.value, "x");
})
camera_angle_y.addEventListener("input", (e) => {
    cameraRotationHandler(e.target.value, "y");
})
camera_angle_z.addEventListener("input", (e) => {
    cameraRotationHandler(e.target.value, "z");
})

/**
 * Handle reset
 */
reset.addEventListener("click", (e) => {
    objects = [];
    model_list.innerHTML = ``;
    default_objects_string.forEach(default_object_string => {
        loadObjects(default_object_string, false);
    });
})

