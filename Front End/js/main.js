import {
  $,
  foundCookie,
  isLoggedIn,
  sendRefreshToken,
  logOutBtnHandler,
} from "./basic.js";

const loginBtn = $.querySelector(".logIn");
const logoutBtn = $.querySelector(".logOut");
const logoutBox = $.querySelector(".log-out-box");
const logoutClose = $.querySelector(".log-out-close");
const logOutClick = $.querySelector(".log-out-btn");
const leftBox = $.querySelector(".left-box");
const rightBox = $.querySelector(".right-box");

window.addEventListener("load", async () => {
  if (isLoggedIn(loginBtn, logoutBtn)) {
    return;
  } else {
    await sendRefreshToken();
    isLoggedIn(loginBtn, logoutBtn);
  }
});

logOutBtnHandler(
  logoutBtn,
  logoutBox,
  leftBox,
  rightBox,
  logoutClose,
  logOutClick
);
