const $ = document;
const userName = $.querySelector("#user-name");
const userPass = $.querySelector("#password");
const logInBtn = $.querySelector(".log-in-btn");
const goSignUp = $.querySelector(".sign-up-link");
const signUserName = $.querySelector("#user-name-sign");
const signUserPass = $.querySelector("#password-sign");
const repeatPass = $.querySelector("#password-check");
const signUpBtn = $.querySelector(".sign-up-btn");
const eyeIcon = $.querySelectorAll(".eye-icon");
const alert = $.querySelector(".alert");
const goLogIn = $.querySelector(".go-log-in");
const loginForm = $.querySelector(".log-in");
const loginFormInfo = $.querySelector("#sign-form");
const signupForm = $.querySelector(".sign-up");
const email = $.querySelector("#email");
const regexEmail = /[a-zA-Z0-9.-]+@[a-z-]+\.[a-z]{2,3}/;

logInBtn.addEventListener("click", logInBtnHandler);

// log In
async function logInBtnHandler() {
  if (checkInputs(userName, userPass)) {
    let data = {
      name: userName.value,
      password: userPass.value,
    };

    let header = {
      "Content-Type": "application/json",
    };

    let options = {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    };

    // post request
    await fetch("test", options);

    reset();
  } else {
    showAlert();
  }
}

// check inputs
function checkInputs(name, pass) {
  if (
    name.value.length >= 3 &&
    name.value.length <= 12 &&
    pass.value.length >= 8 &&
    pass.value.length <= 15
  ) {
    return true;
  } else {
    return false;
  }
}
// give active to alert
function showAlert() {
  if (alert.className != "alert active") {
    alert.classList.add("active");
    setTimeout(() => {
      alert.classList.remove("active");
    }, 5000);
  } else {
    return;
  }
}

loginFormInfo.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    checkInputs(signUserName, signUserPass) &&
    repeatPass.value == signUserPass.value &&
    email.value.match(regexEmail)
  ) {
    let url = "http://127.0.0.1:8000/accounts/register/";

    let data = {
      username: signUserName.value,
      email: email.value,
      password: signUserPass.value,
      password2: repeatPass.value,
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
    console.log(JSON.stringify(data));
    console.log(data);
    xhr.onload = function () {
      if (this.status == 200) {
        location.href = "http://127.0.0.1:5500/email-code.html";
        setTimeout(() => {
          console.log(this);
        }, 1000);
      } else {
        console.log(this.responseText);
      }
    };
  } else {
    showAlert();
  }
});

// sign up

function signUpBtnHandler() {}

// reset inputs
function reset() {
  userName.value = "";
  userPass.value = "";
  repeatPass.value = "";
  signUserName.value = "";
  signUserPass.value = "";
  email.value = "";
  codeInput.value = "";
}

// icon
eyeIcon.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    if (event.target.className == "fas fa-eye eye-icon") {
      event.target.className = "fas fa-eye-slash eye-icon";
      event.target.style.color = "#ff4e4f";
      event.target.previousElementSibling.setAttribute("type", "text");
    } else {
      event.target.className = "fas fa-eye eye-icon";
      event.target.style.color = "#1890ff";
      event.target.previousElementSibling.setAttribute("type", "password");
    }
  });
});

//move login and sign up

goLogIn.addEventListener("click", () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
});

goSignUp.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});
