import { $, isLoggedIn, sendRefreshToken } from "./basic.js";

const loginBtn = $.querySelector(".logIn");
const logoutBtn = $.querySelector(".logOut");

window.addEventListener("load", async () => {
  if (isLoggedIn(loginBtn, logoutBtn)) {
    return;
  } else {
    await sendRefreshToken();
    isLoggedIn(loginBtn, logoutBtn);
  }
});
