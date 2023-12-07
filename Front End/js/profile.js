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
import { imgCard } from "../components/img card/img-card.js";
import { textCard } from "../components/text card/text-card.js";

window.customElements.define("pop-up", CreatePopUp);
window.customElements.define("main-menu", CreateBox);
window.customElements.define("site-footer", CreateFooter);
window.customElements.define("hamburger-menu", CreateHamburgerMenu);
window.customElements.define("img-card", imgCard);
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

const userNameElem = $.querySelector(".user-name");
const userEmailElem = $.querySelector(".user-email");
const userBioElem = $.querySelector(".user-bio");
const userImgElem = $.querySelector(".main__header__profile-box__profile-img");
const token = findToken();
let userName, card;
const postContainer = $.querySelector(".post-container");
const fragment = $.createDocumentFragment();

document.addEventListener("DOMContentLoaded", async () => {
  await axios("http://localhost:8000/profile/get-current-user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data)
    .then((data) => {
      userNameElem.textContent = data.username;
      userName = data.username;
      userEmailElem.textContent = data.email;
      if (data.bio) {
        userBioElem.textContent = data.bio;
      } else {
        userBioElem.textContent = "Not Set.";
      }

      if (data.picture) {
        userImgElem.src = data.picture;
      }
    })
    .catch((err) => {
      location.href = "http://127.0.0.1:5500/log-in.html";
    });

  await axios(`http://localhost:8000/profile/list_posts/${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data)
    .then((data) => {
      data.forEach((post) => {
        card = document.createElement("img-card");
        card.setAttribute("post-id", post.id);
        card.setAttribute("post-title", post.title);
        card.setAttribute("post-user", post.user);
        card.setAttribute("post-slug", post.slug);
        card.setAttribute("post-date", post.created);
        if (post.image) {
          card.setAttribute("post-img", post.image);
        }
        fragment.append(card);
      });
      postContainer.append(fragment);
    })
    .catch((err) => {});
});
