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
const signupForm = $.querySelector(".sign-up");

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

signUpBtn.addEventListener("click", signUpBtnHandler);

async function signUpBtnHandler() {
  if (
    checkInputs(signUserName, signUserPass) &&
    repeatPass.value == signUserPass.value
  ) {
    let data = {
      name: signUserName.value,
      password: signUserPass.value,
    };

    let header = {
      "Content-Type": "application/json",
    };

    let options = {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    };

    await fetch("test", options);

    reset();
  } else {
    showAlert();
  }
}

// reset inputs
function reset() {
  userName.value = "";
  userPass.value = "";
  repeatPass.value = "";
  signUserName.value = "";
  signUserPass.value = "";
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