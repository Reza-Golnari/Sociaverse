import { $, foundCookie, isLoggedIn } from "./basic.js";

const loginBtn = $.querySelector(".logIn");
const logoutBtn = $.querySelector(".logOut");

isLoggedIn(loginBtn, logoutBtn);
