/// <reference path="model.js" />

function app() {
   gl.clear(gl.COLOR_BUFFER_BIT)
   for(let i = 0; i < objects.length; ++i) {
      objects[i].draw(gl)
   }
   setTimeout(app)
}

setTimeout(app)

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
