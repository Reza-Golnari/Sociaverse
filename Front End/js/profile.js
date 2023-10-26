import {
  $,
  isLoggedIn,
  sendRefreshToken,
  logOutBtnHandler,
  popUpHandler,
  findToken,
} from "./basic.js";
import { CreateBox } from "../components/main-menu/main-menu.js";
import { CreateHamburgerMenu } from "../components/hamburger-menu/hamburger-menu.js";
import { CreateFooter } from "../components/footer/footer.js";
import { CreatePopUp } from "../components/pop up/pop-up.js";

window.customElements.define("pop-up", CreatePopUp);
window.customElements.define("main-menu", CreateBox);
window.customElements.define("site-footer", CreateFooter);
window.customElements.define("hamburger-menu", CreateHamburgerMenu);

let mainMenu = $.querySelector("main-menu");
let hamburgerMenu = $.querySelector("hamburger-menu");

const loginBtn = mainMenu.shadowRoot.querySelector(".logIn");
const logoutBtn = mainMenu.shadowRoot.querySelector(".logOut");
const logoutBox = mainMenu.shadowRoot.querySelector(".log-out-box");
const logoutClose = mainMenu.shadowRoot.querySelector(".log-out-close");
const logOutClick = mainMenu.shadowRoot.querySelector(".log-out-btn");

const hamburgerLogInBtn = hamburgerMenu.shadowRoot.querySelector(".loginBtn");
const hamburgerLogOutBtn = hamburgerMenu.shadowRoot.querySelector(".logoutBtn");
const hamburgerLogoutBox =
  hamburgerMenu.shadowRoot.querySelector(".log-out-box");
const hamburgerLogoutClose =
  hamburgerMenu.shadowRoot.querySelector(".log-out-close");
const hamburgerLogoutClick =
  hamburgerMenu.shadowRoot.querySelector(".log-out-btn");

window.addEventListener("load", async () => {
  if (
    isLoggedIn(loginBtn, logoutBtn) &&
    isLoggedIn(hamburgerLogInBtn, hamburgerLogOutBtn)
  ) {
    return;
  } else {
    await sendRefreshToken();
    isLoggedIn(loginBtn, logoutBtn);
    isLoggedIn(hamburgerLogInBtn, hamburgerLogOutBtn);
  }
});

logOutBtnHandler(logoutBtn, logoutBox, logoutClose, logOutClick);

logOutBtnHandler(
  hamburgerLogOutBtn,
  hamburgerLogoutBox,
  hamburgerLogoutClose,
  hamburgerLogoutClick
);

const container = document.querySelector(".container");
const popUp = document
  .querySelector("pop-up")
  .shadowRoot.querySelector(".pop-up");
let scroll;

container.addEventListener("scroll", () => {
  scroll = container.scrollTop;
  popUpHandler(popUp, scroll);
});

const token = findToken();

axios("http://localhost:8000/profile/current-user", {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk4MzI3NTk2LCJpYXQiOjE2OTc3MjI3OTYsImp0aSI6Ijg2YWVjODFhM2I4ODQwNTk4MTI5ZDEyYmE4M2RkOWVkIiwidXNlcl9pZCI6MX0.HUZRdA-uFk3VsABeJSn2yfB5cUbiHArTqhwnIslmk6g`,
  },
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// const url = "http://localhost:8000/profile/post/create";
// const data = {
//   title: "Test Title aaaa",
//   body: "Test Body ;sdlakfjas;dlkfjsad;flkjsadf;lksadjf;sadlfjsa;dfweqpruqwrpowrupweorpoqeruwqpeorqwproqweproqwurpoeqwrupqwruuopwirwpe qwperouwqrepuio",
//   image: null,
// };
// const config = {
//   headers: { Authorization: `Bearer ${token}` },
// };

// axios.post(url, data, config).then((res) => console.log(res));
