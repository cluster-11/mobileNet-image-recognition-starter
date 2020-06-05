const form = document.querySelector("form");
const img = document.querySelector("#img-field");
const imageType = document.querySelector("#image-type");
const submitBtn = document.querySelector(".submit-btn");
const uploadText = document.querySelector(".upload-text");
const confTitle = document.querySelector(".conf-title");
const confidenceText = document.querySelector(".confidence");
const resultContainer = document.querySelector(".result-container");

let modifiedImg;
let createImgCapture;

let mobileNet = ml5.imageClassifier("MobileNet", () => {
  //do something if the model is ready
});

form.addEventListener("change", handleImageInput, false);

form.addEventListener("submit", handleImageSubmit);

//`setup` function from p5js
function setup() {
  createCanvas(1, 1);
  createImgCapture = createImg; //capturing `createImg` function for later usage
}

//handling image submit
function handleImageSubmit(e) {
  e.preventDefault();
  imageType.innerText = "Loading ...";
  modifiedImg = createImgCapture(img.src, imageReady); //using `createImgCapture` function to make the image suitable for ml5-mobileNet image pattern request
  modifiedImg.addClass("hidden"); //using `createImgCapture` creates an img on the dom, we don't want to display it
}

function handleImageInput(e) {
  resultContainer.classList.add("hidden");
  resultContainer.classList.remove("show");
  submitBtn.classList.remove("hidden");
  imageType.innerText = "";
  confTitle.textContent = "";
  submitBtn.classList.add("show");
  uploadText.innerText = "Upload Another Image";
  confidenceText.textContent = "";
  //chrome doesn't allow direct image url capture from the client.
  //we used an workaround
  img.src = window.URL.createObjectURL(e.target.files[0]);
}

function imageReady() {
  //sending request to mobileNet
  mobileNet.predict(modifiedImg, gotResult);
}

function gotResult(error, result) {
  if (error) {
    alert("Cannot get Image Type" + "\n" + error);
  } else {
    submitBtn.classList.add("hidden");
    submitBtn.classList.remove("show");
    resultContainer.classList.remove("hidden");
    resultContainer.classList.add("show");

    confTitle.textContent = "Confidence: ";
    const confidenceResult = Math.round(result[0].confidence * 100);
    //displaying the result on the dom
    imageType.innerText = result[0].label;
    confidenceText.textContent = `${confidenceResult}%`;

    //changing `confidence` border-color based on result
    if (confidenceResult < 25) confidenceText.style.borderColor = " #e8492a";
    else if (confidenceResult < 50)
      confidenceText.style.borderColor = "#f2ef3f";
    else if (confidenceResult < 75)
      confidenceText.style.borderColor = "#5fa5b8";
    else confidenceText.style.borderColor = "black";
  }
}
