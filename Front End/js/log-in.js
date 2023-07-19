import { $, showAlert, showMessage } from "./basic.js";

const formBtn = $.querySelector(".form-btn");
const eyeIcon = $.querySelector(".eye-icon");
const inputList = $.querySelectorAll(".input");
let userName = $.querySelector("#user-name");
let password = $.querySelector("#password");
let alert = $.querySelector(".alert");
const loadingBox = $.querySelector(".loading-box");
const loadingBoxTitle = $.querySelector(".loading-title");
const loadingBoxText = $.querySelector(".loading-text");

// eye icon handler
eyeIcon.addEventListener("click", () => {
  if (eyeIcon.classList.contains("fa-eye-slash")) {
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
    password.setAttribute("type", "password");
  } else {
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
    password.setAttribute("type", "text");
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

// send data to the api
formBtn.addEventListener("click", () => {
  if (checkInputs()) {
    let url = "http://localhost:8000/accounts/api/token/";

    let header = {
      "Content-Type": "application/json",
    };

    let data = {
      username: userName.value,
      password: password.value,
    };

    axios
      .post(url, data, header)
      .then((res) => console.log(res.data))
      .catch((err) => {
        if (err.response.status == 401) {
          showMessage(
            "error",
            "The entered information is not correct",
            loadingBox,
            loadingBoxTitle,
            loadingBoxText
          );
        } else if (err.response.status == 404) {
          location.href = "http://127.0.0.1:5500/404.html";
        } else {
          showMessage(
            "error",
            "There was a problem verifying the profile",
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
