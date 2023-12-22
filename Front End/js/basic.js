const $ = document;

const BASEURL = "http://localhost:8000/";

// give active or err to loading box
function showMessage(flag, msg, box, title, text) {
  if (flag === "loading") {
    if (!box.classList.contains("active")) {
      box.classList.add("active");
      setTimeout(() => {
        box.classList.remove("active");
      }, 4000);
    }
  } else if (flag === "error") {
    if (!box.classList.contains("error")) {
      box.classList.add("error");
      title.textContent = "Error!";
      text.textContent = msg;
      setTimeout(() => {
        box.classList.remove("error");
        title.textContent = "Please Wait...";
        text.textContent = "Your registration is in progress";
      }, 6000);
    }
  } else if (flag === "successful") {
    if (!box.classList.contains("active")) {
      box.classList.add("active");
      title.textContent = "Transferring";
      text.textContent = msg;
      setTimeout(() => {
        box.classList.remove("active");
      }, 4000);
    }
  }
}

// give active to alert
function showAlert(alert) {
  if (!alert.classList.contains("active")) {
    alert.classList.add("active");
    setTimeout(() => {
      alert.classList.remove("active");
    }, 5000);
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

// search for our cookie
function foundCookie(cookieName) {
  let allCookies = document.cookie;
  let cookiesArray = allCookies.split(";");
  let cookiesList = [];
  let mainCookie;

  cookiesArray.forEach((cookie) => {
    let mainCookie = cookie.split("=");
    cookiesList.push(mainCookie);
  });

  cookiesList.some((cookie) => {
    if (cookie[0] === cookieName) {
      mainCookie = cookie;
      return true;
    }
  });

  return mainCookie;
}

// set class 'problem' for inputs
function inputProblem(inputList) {
  inputList.forEach((input) => {
    input.classList.remove("problem");
  });
  let inputsArray;
  if ((arguments.length = 5)) {
    inputsArray = [arguments[1], arguments[2], arguments[3], arguments[4]];
  } else if ((arguments.length = 3)) {
    inputsArray = [arguments[1], arguments[2]];
  } else {
    inputsArray = [arguments[1]];
  }

  inputsArray.forEach((input) => {
    input.classList.add("problem");
  });
}

// Check if user logged in, show log out
function isLoggedIn(logInElem, logOutElem) {
  if (foundCookie(" token")) {
    logInElem.style.display = "none";
    logOutElem.style.display = "flex";
    logOutElem.style.fontSize = "1rem";
    logOutElem.style.fontWeight = "700";
    return true;
  } else {
    logInElem.style.display = "flex";
    logOutElem.style.display = "none";
    return false;
  }
}

// Checking if a token refresh is sent if the user's token is expired
async function sendRefreshToken() {
  if (foundCookie(" token") && foundCookie(" refreshtoken")) {
    return true;
  } else if (!foundCookie(" token") && foundCookie(" refreshtoken")) {
    let refreshToken = foundCookie(" refreshtoken")[1];
    let url = "http://localhost:8000/accounts/api/token/refresh/";
    let data = {
      refresh: refreshToken,
    };
    let header = {
      "Content-Type": "application/json",
    };
    await axios
      .post(url, data, header)
      .then((res) => saveTokenAfterRefreshToken(res.data.access))
      .catch((err) => console.log(err));
  } else if (!foundCookie(" refreshtoken")) {
    return false;
  }
}

// save token after sending refresh token
function saveTokenAfterRefreshToken(token) {
  document.cookie = `token=${token};path=/;expires=${setExpires(1)}`;
}

// return a time for expires
function setExpires(day) {
  let time = new Date();

  time.setTime(time.getTime() + day * 24 * 60 * 60 * 1000);

  return time;
}

// add event for log out btn
function logOutBtnHandler(btn, box, closeBtn, clickBtn) {
  btn.addEventListener("click", () => {
    showLogOutBox(box);
  });
  hiddenLogOutBox(box, closeBtn);
  clickBtn.addEventListener("click", () => {
    document.cookie = `token=;path=/;expires=${setExpires(-50)}`;
    document.cookie = `refreshtoken=;path=/;expires=${setExpires(-50)}`;
    location.reload();
  });
}

// show log out box and add class show and blur background
function showLogOutBox(box) {
  if (!box.classList.contains("show")) {
    box.classList.add("show");
  }
}

// hidden log out box by icon
function hiddenLogOutBox(box, closeBtn) {
  closeBtn.addEventListener("click", () => {
    box.classList.remove("show");
  });
}

// found route and give active for list items
function foundRoute() {
  console.log(location.href);
}

// pop up handler
function popUpHandler(popUp, scroll) {
  if (scroll > 500) {
    popUp.classList.remove("hide");
    popUp.classList.add("show");
  } else {
    if (popUp.classList.contains("show")) {
      popUp.classList.remove("show");
      popUp.classList.add("hide");
    }
  }
}

// find token from cookie
function findToken() {
  let cookiesArray = document.cookie.split(";");
  let token;
  cookiesArray.find((cookie) => {
    if (cookie.includes(" token")) {
      token = cookie.split("=")[1];
    }
  });
  return token;
}

export {
  $,
  showMessage,
  showAlert,
  reset,
  foundCookie,
  inputProblem,
  isLoggedIn,
  sendRefreshToken,
  setExpires,
  logOutBtnHandler,
  foundRoute,
  popUpHandler,
  findToken,
  BASEURL,
};
