import {
  $,
  isLoggedIn,
  sendRefreshToken,
  logOutBtnHandler,
  popUpHandler,
  findToken,
  BASEURL,
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
const token = findToken();

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

const search = location.search;
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

window.addEventListener("DOMContentLoaded", async () => {
  const imgInput = document.querySelector(".img-input");
  const titleInput = document.querySelector(".post-title-input");
  const desInput = document.querySelector("textarea");
  const form = document.querySelector("form");
  const formBtn = document.querySelector(".submit");
  const formTitle = document.querySelector("h2");

  if (search) {
    formTitle.textContent = formTitle.textContent.replace("Share", "Update");
    formBtn.value = "Update";
    const searchArray = search.slice(1, search.length).split("&");
    const postID = searchArray[0].split("=")[1];
    const postSlug = searchArray[1].split("=")[1];
    await axios(`${BASEURL}profile/post/${postID}/${postSlug}/`)
      .then((res) => {
        if (res.status === 200) {
          const post = res.data.post;
          titleInput.value = post.title;
          desInput.value = post.body;
        } else {
          location.href = "http://127.0.0.1:5500/404.html";
        }
      })
      .catch(() => {
        location.href = "http://127.0.0.1:5500/404.html";
      });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (
        titleInput.value &&
        titleInput.value.length >= 3 &&
        desInput.value &&
        desInput.value.length >= 3 &&
        desInput.value.length < 200 &&
        titleInput.value.length < 50
      ) {
        const formData = new FormData();
        formData.append("title", titleInput.value);
        formData.append("body", desInput.value);
        if (imgInput.files[0]) {
          formData.append("image", imgInput.files[0]);
        }

        await axios
          .put(`${BASEURL}profile/update/${postID}/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    });
  } else {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (
        titleInput.value &&
        titleInput.value.length >= 3 &&
        desInput.value &&
        desInput.value.length >= 3 &&
        desInput.value.length < 200 &&
        titleInput.value.length < 50
      ) {
        const formData = new FormData();
        formData.append("title", titleInput.value);
        formData.append("body", desInput.value);
        if (imgInput.files[0]) {
          formData.append("image", imgInput.files[0]);
        }

        await axios
          .post(`${BASEURL}profile/post/create`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            imgInput.files = null;
            titleInput.value = "";
            desInput.value = "";
          });
      }
    });
  }
});
