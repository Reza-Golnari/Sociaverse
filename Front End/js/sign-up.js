import { $, showAlert, showMessage } from "./basic.js";

const eyeIconList = $.querySelectorAll(".eye-icon");
const inputList = $.querySelectorAll(".input");
const formBtn = $.querySelector(".form-btn");
const labelList = $.querySelectorAll("label");
const alert = $.querySelector(".alert");
const loadingBox = $.querySelector(".loading-box");
const loadingBoxTitle = $.querySelector(".loading-title");
const loadingBoxText = $.querySelector(".loading-text");
const regexEmail = /[a-zA-Z0-9.-]+@[a-z-]+\.[a-z]{2,3}/;
let userName = $.querySelector("#user-name");
let email = $.querySelector("#email");
let password = $.querySelector("#password");
let password2 = $.querySelector("#password2");

// set event for icons
eyeIconList.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    if (event.target.className == "fas fa-eye eye-icon") {
      event.target.className = "fas fa-eye-slash eye-icon";
      event.target.previousElementSibling.previousElementSibling.setAttribute(
        "type",
        "text"
      );
    } else {
      event.target.className = "fas fa-eye eye-icon";
      event.target.previousElementSibling.previousElementSibling.setAttribute(
        "type",
        "password"
      );
    }
  });
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

// set event for btn
formBtn.addEventListener("click", (event) => {
  if (checkInputs()) {
    const url = "http://localhost:8000/accounts/register/";
    const header = {
      "Content-Type": "application/json",
    };
    const data = {
      username: userName.value,
      email: email.value,
      password: password.value,
      password2: password2.value,
    };

    axios
      .post(url, data, header)
      .then((res) => {
        showMessage("loading", "", loadingBox, loadingBoxTitle, loadingBoxText);
        location.href = "http://127.0.0.1:5500/log-in.html";
      })
      .catch((err) => {
        if (err.response.status == 400) {
          showMessage(
            "error",
            "There is a problem with your registration, Duplicate username or Email",
            loadingBox,
            loadingBoxTitle,
            loadingBoxText
          );
        } else if (err.response.status == 404) {
          location.href = "http://127.0.0.1:5500/404.html";
        } else {
          showMessage(
            "error",
            "There is a problem with your registration",
            loadingBox,
            loadingBoxTitle,
            loadingBoxText
          );
        }
      });
  } else {
    showAlert(alert);
  }
});

// check inputs value
function checkInputs() {
  if (
    userName.value.length >= 3 &&
    userName.value.length <= 12 &&
    email.value.match(regexEmail) &&
    password.value.length >= 8 &&
    password.value.length <= 15 &&
    +password.value == +password2.value
  ) {
    return true;
  } else {
    return false;
  }
}
