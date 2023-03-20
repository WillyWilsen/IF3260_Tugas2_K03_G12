const model_selected = document.getElementById('model_selected')
const model_list = document.getElementById('model_list')
const ortographic_btn = document.getElementById('orthographic-btn')
const perspective_btn = document.getElementById('perspective-btn')
const oblique_btn = document.getElementById('oblique-btn')
const model_angle_x = document.getElementById('model_angle_x')
const model_angle_y = document.getElementById('model_angle_y')
const model_angle_z = document.getElementById('model_angle_z')
const model_translation_x = document.getElementById('model_translation_x')
const model_translation_y = document.getElementById('model_translation_y')
const model_translation_z = document.getElementById('model_translation_z')
const model_scale = document.getElementById('model_scale')
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
   setTimeout(app, 16)
}
setTimeout(app, 16)

/**
 * Handle on projection change
 * @param {Event} e 
 * @param {string} type 
 */
function projectionEventListener(e, type) {
   projectionMode = type;
   ortographic_btn.style = 'font-weight: normal;';
   perspective_btn.style = 'font-weight: normal;';
   oblique_btn.style = 'font-weight: normal;';

   if (type == 'orthographic') {
      objects.forEach(model => {
         model.proj_matrix = getOrthogonalProjection(-4, 4, -4, 4, -2, 10);
      });
      ortographic_btn.style = 'font-weight: bold;';
   } else if (type == 'perspective') {
      objects.forEach(model => {
         model.proj_matrix = getPerspectiveProjection(45, canvas.width/canvas.height, -1, 1);
      });
      perspective_btn.style = 'font-weight: bold;';
   } else if (type == 'oblique') {
      objects.forEach(model => {
         model.proj_matrix = getObliqueProjection(-45, -45, 2, 10, 2, 10, -2, 10);
      });
      oblique_btn.style = 'font-weight: bold;';
   }
}

ortographic_btn.addEventListener('click', (e) => projectionEventListener(e, 'orthographic'));
perspective_btn.addEventListener('click', (e) => projectionEventListener(e, 'perspective'));
oblique_btn.addEventListener('click', (e) => projectionEventListener(e, 'oblique'));
perspective_btn.click();

/**
 * Handle rotating model with object as center of rotation
 * @param {String} degree 
 * @param {String} axis 
 */
function modelRotationHandler(degree, axis){
   objects[selectedIdx].rotateModel(parseFloat(degree), axis);
}
model_angle_x.addEventListener("input", (e) => {
   modelRotationHandler(e.target.value, "x");
})
model_angle_y.addEventListener("input", (e) => {
   modelRotationHandler(e.target.value, "y");
})
model_angle_z.addEventListener("input", (e) => {
   modelRotationHandler(e.target.value, "z");
})

/**
 * Handle moving model
 * @param {String} distance 
 * @param {String} axis 
 */
function modelMoveHandler(distance, axis){
   objects[selectedIdx].moveModel(distance, axis);
}
model_translation_x.addEventListener("input", (e) => {
   modelMoveHandler(e.target.value, "x");
})
model_translation_y.addEventListener("input", (e) => {
   modelMoveHandler(e.target.value, "y");
})
model_translation_z.addEventListener("input", (e) => {
   modelMoveHandler(e.target.value, "z");
})

/**
 * Handle scaling model
 * @param {String} k 
 * @param {String} axis 
 */
function modelScaleModel(k){
   objects[selectedIdx].scaleModel(k);
}
model_scale.addEventListener("input", (e) => {
   modelScaleModel(e.target.value);
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
   model_angle_x.value = objects[selectedIdx].model_angle_x
   model_angle_y.value = objects[selectedIdx].model_angle_y
   model_angle_z.value = objects[selectedIdx].model_angle_z
   model_translation_x.value = objects[selectedIdx].model_translation_x
   model_translation_y.value = objects[selectedIdx].model_translation_y
   model_translation_z.value = objects[selectedIdx].model_translation_z
   model_scale.value = objects[selectedIdx].model_scale
   camera_zoom.value = objects[selectedIdx].camera_zoom
   camera_angle_x.value = objects[selectedIdx].camera_angle_x
   camera_angle_y.value = objects[selectedIdx].camera_angle_y
   camera_angle_z.value = objects[selectedIdx].camera_angle_z
}

/**
 * Handle on reset selected model
 */
function resetSelected() {
   model_angle_x.value = 0
   model_angle_y.value = 0
   model_angle_z.value = 0
   model_translation_x.value = 0
   model_translation_y.value = 0
   model_translation_z.value = 0
   model_scale.value = 1
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
    selectedIdx = objects.length - 1;
    resetSelected();
    projectionEventListener(null, projectionMode);
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
    objects[selectedIdx].rotateCamera(parseFloat(degree), axis);
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

