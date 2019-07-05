let fileToUpload = null;

let controller = {
  uploadFile: (file) => {
    let headers = new Headers();
    // Tell the server we want JSON back
    headers.set('Accept', 'application/json');
    const formData = new FormData();
    formData.append("file", fileToUpload);

    //Make the request
    const url = '/get-file-size/';
    const fetchOptions = {
        method: 'POST',
        headers,
        body: formData
      };
    view.showLoader();  
    const responsePromise = fetch(url, fetchOptions);
  
    //Use the response
    responsePromise
  	//Convert the response into JSON object.
    .then(function(response) {
      if (response.ok){
        return response.json();
      }
      else{
        return response.ok;
      }
    })
    .then(function(jsonData) {
      if (jsonData.file_size){
        view.showFileSize(jsonData.file_size);
        view.showStatus("success");
      }
      else{
        view.showError("Something went wrong :( Please refresh the page and try again.");
        view.showStatus("failed");
      }  
    })
    //Fetch only enters the catch statement when there is a network error. Even if we receive a failed response, it will enter the then statement.
     .catch({ function(){
      view.showError("Something went wrong :( Please refresh the page and try again.");
      view.showStatus("failed");
   } 
   });
  }
};

let view = {
  setUpEventListeners: function (){
    const droppableElement = document.querySelector('.droppable');
    //Adds eventListeners to the droppable element
    makeDroppable(droppableElement, this.previewFiles)
    
    const uploadForm = document.getElementById("uploadForm");
    uploadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (fileToUpload){
        document.getElementById("uploadButton").disabled = true;
        controller.uploadFile(fileToUpload);
      } else{ 
        alert ("Please select a file to upload")
      }
    });
  }, 
  previewFiles: function (files) {
    if (files){
      let preview = document.querySelector('#preview');
      preview.innerHTML = ""; 
      
      const fileArray = Array.from(files);
      fileArray.forEach(function(file){
        let reader = new FileReader();
        reader.addEventListener("load", function() {
          ////add image preview
          if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            const previewImg = view.previewImg(file, this.result);
            preview.innerHTML = previewImg;
          }
          else{
             //add a file icon to preview
            const previewFile = view.previewFile(file);
            preview.innerHTML = previewFile; 
          }  
        }, false);
        reader.readAsDataURL(file);
        fileToUpload = file;
      });
    }
  },
  previewImg: function (file, data){
    return `
    <figure>
    <img class="previewImg" title=${file.name} src=${data}>
    <figcaption>${file.name}</figcaption>
    </figure>
    `
  },
  previewFile: function(file){
    return `<div>
    <i class="fa fa-file"> <span>${file.name}</span></i>
    </div>`;
  },
  showLoader: function(){
    let preview = document.querySelector('#preview');
    preview.innerHTML =  `<div>
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      <span class="sr-only">File Icon/span>
      </div>`;
  },
  showStatus(status){
    let button =  document.getElementById("uploadButton")
    let form = document.getElementById('uploadForm');
    if(status === "success"){
      button.value = "SUCCESS"
      button.classList.add("success");
      form.classList.add("success");
      form.classList.add("disable-clicks");
    }
    else if(status == "failed"){
      button.value = "FAILED";
      button.classList.add("failed");
      form.classList.add("failed");
      form.classList.add("disable-clicks");
    }   
  },
  showFileSize(fileSize){
    let preview = document.querySelector('#preview');
    preview.innerHTML = `File Size: ${fileSize}`;
  },
  showError(message){
    let preview = document.querySelector('#preview');
    preview.innerHTML = message;
  }
};

view.setUpEventListeners();