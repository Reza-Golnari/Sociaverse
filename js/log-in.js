import { showAlert } from "./sign-up.js";

const $ = document;
const eyeIcon = $.querySelector(".eye-icon");
const formBtn = $.querySelector(".form-btn");
const inputList = $.querySelectorAll(".input");
const labelList = $.querySelectorAll("label");
let userName = $.querySelector("#user-name");
let password = $.querySelector("#password");
// set event for icons

eyeIcon.addEventListener("click", () => {
  if (eyeIcon.className == "fas fa-eye eye-icon") {
    eyeIcon.className = "fas fa-eye-slash eye-icon";
    eyeIcon.previousElementSibling.previousElementSibling.setAttribute(
      "type",
      "text"
    );
  } else {
    eyeIcon.className = "fas fa-eye eye-icon";
    eyeIcon.previousElementSibling.previousElementSibling.setAttribute(
      "type",
      "password"
    );
  }
});

// give active to labels
inputList.forEach((input) => {
  input.addEventListener("focus", (event) => {
    event.target.nextElementSibling.classList.add("active");
  });

  input.addEventListener("blur", (event) => {
    if (!event.target.value) {
      event.target.nextElementSibling.classList.remove("active");
    } else {
      return;
    }
  });
});

// check inputs value
function checkInputs() {
  if (
    userName.value.length >= 3 &&
    userName.value.length <= 12 &&
    password.value.length >= 8 &&
    password.value.length <= 15
  ) {
    return true;
  } else {
    return false;
  }
}

formBtn.addEventListener("click", () => {
  if (checkInputs()) {
    console.log("not err");
    reset(userName, password);
  } else {
    console.log("err");
  }
});

// reset inputs
function reset() {
  for (arg of arguments) {
    arg.value = "";
    labelList.forEach((label) => {
      label.classList.remove("active");
    });
  }
}

showAlert();
