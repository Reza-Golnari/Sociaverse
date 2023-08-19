import { $, isLoggedIn, sendRefreshToken, logOutBtnHandler } from "./basic.js";
import { CreateBox } from "../components/main-menu/main-menu.js";

window.customElements.define("main-menu", CreateBox);

let mainMenu = $.querySelector("main-menu");

const loginBtn = mainMenu.shadowRoot.querySelector(".logIn");
const logoutBtn = mainMenu.shadowRoot.querySelector(".logOut");
const logoutBox = mainMenu.shadowRoot.querySelector(".log-out-box");
const logoutClose = mainMenu.shadowRoot.querySelector(".log-out-close");
const logOutClick = mainMenu.shadowRoot.querySelector(".log-out-btn");
const leftBox = mainMenu.shadowRoot.querySelector(".left-box");
const rightBox = mainMenu.shadowRoot.querySelector(".right-box");

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
