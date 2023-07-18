const $ = document;
const eyeIconList = $.querySelectorAll(".eye-icon");
const inputList = $.querySelectorAll(".input");
const formBtn = $.querySelector(".form-btn");
const regexEmail = /[a-zA-Z0-9.-]+@[a-z-]+\.[a-z]{2,3}/;
let userName = inputList[0];
let email = inputList[1];
let password = inputList[2];
let password2 = inputList[3];
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

    // fetch(url, {
    //   method: "POST",
    //   headers: header,
    //   body: JSON.stringify(data),
    // })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));

    axios
      .post(url, data, {
        "Content-Type": "application/json",
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  } else {
    console.log("error");
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
