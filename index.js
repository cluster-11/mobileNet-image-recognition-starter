//dom elements
const form = document.querySelector("form");
const img = document.querySelector(".img-field");
const imageType = document.querySelector("#image-type");
const submitBtn = document.querySelector(".submit-btn");
const uploadText = document.querySelector(".upload-text");
const confTitle = document.querySelector(".conf-title");
const confText = document.querySelector(".confidence");
const resultContainer = document.querySelector(".result-container");

//initializing ml5 mobileNet model
let mobileNet = ml5.imageClassifier("MobileNet", () => {});

form.addEventListener("change", handleImageInput, false);
form.addEventListener("submit", handleImageSubmit);

//handling image submit
function handleImageSubmit(e) {
  e.preventDefault();
  imageType.innerText = "Loading ...";
  //sending prediction request to mobileNet
  mobileNet.predict(img, gotResult);
}

function handleImageInput(e) {
  //modifying dom elements
  resultContainer.classList.add("hidden");
  resultContainer.classList.remove("show");
  submitBtn.classList.remove("hidden");
  imageType.innerText = "";
  confTitle.textContent = "";
  submitBtn.classList.add("show");
  uploadText.innerText = "Upload Another Image";
  confText.textContent = "";
  //getting imported image url and adding it
  img.src = window.URL.createObjectURL(e.target.files[0]);
}

function gotResult(error, result) {
  if (error) {
    alert("Cannot get Image Type" + "\n" + error);
  } else {
    //modifying dom elements
    submitBtn.classList.add("hidden");
    submitBtn.classList.remove("show");
    resultContainer.classList.remove("hidden");
    resultContainer.classList.add("show");
    confTitle.textContent = "Confidence: ";
    //displaying the result on the dom
    const confidenceResult = Math.round(result[0].confidence * 100);
    imageType.innerText = result[0].label;
    confText.textContent = `${confidenceResult}%`;

    //PREFERENCE: changing `confidence` border-color based on result
    if (confidenceResult < 25) confText.style.borderColor = " #e8492a";
    else if (confidenceResult < 50) confText.style.borderColor = "#f2ef3f";
    else if (confidenceResult < 75) confText.style.borderColor = "#5fa5b8";
    else confText.style.borderColor = "black";
  }
}

//useful documentation:
//  1. https://learn.ml5js.org/docs/#/
//  2.https://ml5js.org/reference/api-ImageClassifier/
