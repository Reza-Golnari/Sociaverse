const $ = document;
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
        showMessage("loading", "");
        location.href = "http://127.0.0.1:5500/log-in.html";
      })
      .catch((err) => {
        if (err.response.status == 400) {
          showMessage(
            "error",
            "There is a problem with your registration, Duplicate username"
          );
        } else if (err.response.status == 404) {
          location.href = "http://127.0.0.1:5500/404.html";
        } else {
          showMessage("error", "There is a problem with your registration");
        }
      });
  } else {
    showAlert();
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
// reset inputs
function reset() {
  for (arg of arguments) {
    arg.value = "";
  }
  labelList.forEach((label) => {
    label.classList.remove("active");
  });
}

// give active to alert
function showAlert() {
  if (!alert.classList.contains("active")) {
    alert.classList.add("active");
    setTimeout(() => {
      alert.classList.remove("active");
    }, 5000);
  }
}

// give active or err to loading box
function showMessage(flag, msg) {
  if (flag === "loading") {
    loadingBox.classList.add("active");
    setTimeout(() => {
      loadingBox.classList.remove("active");
    }, 4000);
  } else if (flag === "error") {
    loadingBox.classList.add("error");
    loadingBoxTitle.textContent = "Error!";
    loadingBoxText.textContent = msg;
    setTimeout(() => {
      loadingBox.classList.remove("error");
      loadingBoxTitle.textContent = "Please Wait...";
      loadingBoxText.textContent = "Your registration is in progress";
    }, 6000);
  }
}
