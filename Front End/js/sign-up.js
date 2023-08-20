import {
  $,
  showAlert,
  showMessage,
  inputProblem,
  isLoggedIn,
  sendRefreshToken,
  logOutBtnHandler,
} from "./basic.js";
import { CreateBox } from "../components/main-menu/main-menu.js";
import { CreateHamburgerMenu } from "../components/hamburger-menu/hamburger-menu.js";

window.customElements.define("main-menu", CreateBox);
window.customElements.define("hamburger-menu", CreateHamburgerMenu);

const eyeIconList = $.querySelectorAll(".eye-icon");
const inputList = $.querySelectorAll(".input");
const formBtn = $.querySelector(".form-btn");
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
      .then(() => {
        showMessage(
          "loading",
          "Please wait",
          loadingBox,
          loadingBoxTitle,
          loadingBoxText
        );
        location.href = "http://127.0.0.1:5500/log-in.html";
      })
      .catch((err) => {
        let errorData = err.response.data;
        if (err.response.status === 400) {
          console.log(errorData);
          if (errorData.email && errorData.username) {
            showMessage(
              "error",
              "The username and email entered already exist, please enter a new name and email",
              loadingBox,
              loadingBoxTitle,
              loadingBoxText
            );
            inputProblem(inputList, userName, email);
          } else if (errorData.email) {
            showMessage(
              "error",
              "The entered email address already exists, please enter a new email address",
              loadingBox,
              loadingBoxTitle,
              loadingBoxText
            );
            inputProblem(inputList, email);
          } else if (errorData.username) {
            showMessage(
              "error",
              "The username entered already exists, please enter a new one",
              loadingBox,
              loadingBoxTitle,
              loadingBoxText
            );
            inputProblem(inputList, userName);
          }
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
    userName.value.length < 3 ||
    (userName.value.length > 12 &&
      !email.value.match(regexEmail) &&
      password.value.length < 8) ||
    password.value.length > 15
  ) {
    showAlert(alert);
    inputProblem(inputList, userName, email, password, password2);
    return false;
  } else if (userName.value.length < 3 || userName.value.length > 12) {
    showAlert(alert);
    inputProblem(inputList, userName);
    return false;
  } else if (!email.value.match(regexEmail)) {
    showAlert(alert);
    inputProblem(inputList, email);
    return false;
  } else if (password.value.length < 8 || password.value.length > 15) {
    showAlert(alert);
    inputProblem(inputList, password);
    return false;
  } else if (password.value != password2.value) {
    showAlert(alert);
    inputProblem(inputList, password, password2);
    return false;
  } else {
    return true;
  }
}

let mainMenu = $.querySelector("main-menu");
let hamburgerMenu = $.querySelector("hamburger-menu");

const loginBtn = mainMenu.shadowRoot.querySelector(".logIn");
const logoutBtn = mainMenu.shadowRoot.querySelector(".logOut");
const logoutBox = mainMenu.shadowRoot.querySelector(".log-out-box");
const logoutClose = mainMenu.shadowRoot.querySelector(".log-out-close");
const logOutClick = mainMenu.shadowRoot.querySelector(".log-out-btn");

const hamburgerLogInBtn = hamburgerMenu.shadowRoot.querySelector(".loginBtn");
const hamburgerLogOutBtn = hamburgerMenu.shadowRoot.querySelector(".logoutBtn");
const hamburgerLogoutBox =
  hamburgerMenu.shadowRoot.querySelector(".log-out-box");
const hamburgerLogoutClose =
  hamburgerMenu.shadowRoot.querySelector(".log-out-close");
const hamburgerLogoutClick =
  hamburgerMenu.shadowRoot.querySelector(".log-out-btn");

window.addEventListener("load", async () => {
  if (
    isLoggedIn(loginBtn, logoutBtn) &&
    isLoggedIn(hamburgerLogInBtn, hamburgerLogOutBtn)
  ) {
    return;
  } else {
    await sendRefreshToken();
    isLoggedIn(loginBtn, logoutBtn);
    isLoggedIn(hamburgerLogInBtn, hamburgerLogOutBtn);
  }
});

logOutBtnHandler(logoutBtn, logoutBox, logoutClose, logOutClick);

logOutBtnHandler(
  hamburgerLogOutBtn,
  hamburgerLogoutBox,
  hamburgerLogoutClose,
  hamburgerLogoutClick
);
