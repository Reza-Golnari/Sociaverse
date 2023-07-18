const $ = document;
const formBtn = $.querySelector(".form-btn");
const eyeIcon = $.querySelector(".eye-icon");
const inputList = $.querySelectorAll(".input");
const labelList = $.querySelectorAll("label");
let userName = $.querySelector("#user-name");
let password = $.querySelector("#password");
let alert = $.querySelector(".alert");

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

formBtn.addEventListener("click", () => {
  if (checkInputs()) {
    console.log("not err");
    reset(userName, password);
  } else {
    showAlert();
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

// give active to alert
function showAlert() {
  if (!alert.classList.contains("active")) {
    alert.classList.add("active");
    setTimeout(() => {
      alert.classList.remove("active");
    }, 5000);
  }
}
