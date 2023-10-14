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
import { textCard } from "../components/text card/text-card.js";
import { CreateFooter } from "../components/footer/footer.js";
import { CreatePopUp } from "../components/pop up/pop-up.js";

window.customElements.define("pop-up", CreatePopUp);
window.customElements.define("site-footer", CreateFooter);
window.customElements.define("main-menu", CreateBox);
window.customElements.define("hamburger-menu", CreateHamburgerMenu);
window.customElements.define("text-card", textCard);

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

const cardContainer = $.querySelector(".card-container");
let card;
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

let fragment = document.createDocumentFragment();

// axios("http://localhost:8000/explore")
//   .then((res) => {
//     // res.data.posts.forEach(post=>{

//     // })

//     res.data.posts.forEach((post) => {
//       card = document.createElement("post-card");
//       card.setAttribute("post-id", post.id);
//       card.setAttribute("post-title", post.title);
//       card.setAttribute("post-body", post.body);
//       card.setAttribute("post-user", post.user);
//       cardContainer.append(card);
//       console.log(post);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const token = findToken();
// const url = "http://localhost:8000/profile/post/create";
// const data = {
//   title: "Test Title",
//   body: "Test Body ;sdlakfjas;dlkfjsad;flkjsadf;lksadjf;sadlfjsa;dfweqpruqwrpowrupweorpoqeruwqpeorqwproqweproqwurpoeqwrupqwruuopwirwpe qwperouwqrepuio",
//   image: null,
// };
// const config = {
//   headers: { Authorization: `Bearer ${token}` },
// };

// axios.post(url, data, config);

// console.log(findToken());
