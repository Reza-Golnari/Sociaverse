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

const container = $.querySelector(".container");
const popUp = $.querySelector("pop-up").shadowRoot.querySelector(".pop-up");
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
let userName, card, userId;
const postContainer = $.querySelector(".post-container");
const fragment = $.createDocumentFragment();

$.addEventListener("DOMContentLoaded", async () => {
  // =========================== Check Url ===========================================
  if (location.search) {
    $.querySelector(".edit").style.display = "none";
    $.querySelector(".create").style.display = "none";
    $.querySelector(".follow").style.display = "flex";
    $.querySelector(".unfollow").style.display = "flex";
  }
  // =========================== Start Of Get User Data ============================
  await axios(`${BASEURL}profile/get-current-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data)
    .then((data) => {
      userId = data.id;
      console.log(userId);
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
  // =========================== End Of Get User Data ==============================

  // =========================== Start Of Get Followers and Following ====================
  await axios(`${BASEURL}profile/followers-following/${userName}`)
    .then((res) => res.data)
    .then((data) => {
      $.querySelector(".followers-text").textContent = data.followers.length;
      $.querySelector(".following-text").textContent = data.following.length;
    });
  // =========================== End Of Get Followers and Following ======================

  // =========================== Start Of Get User Posts ===========================

  await axios(`${BASEURL}profile/list_posts/${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.data)
    .then((data) => {
      $.querySelector(".posts-text").textContent = data.length;
      data.forEach((post) => {
        card = $.createElement("img-card");
        card.setAttribute("post-id", post.id);
        card.setAttribute("post-title", post.title);
        card.setAttribute("post-user", post.user);
        card.setAttribute("post-slug", post.slug);
        card.setAttribute("post-date", post.created);
        card.setAttribute("updatable", true);
        if (post.image) {
          card.setAttribute("post-img", post.image);
        }
        fragment.append(card);
      });
      postContainer.append(fragment);
    })
    .catch((err) => {
      $.querySelector(".no-post").style.display = "block";
    });
  // =========================== End Of Get User Posts =============================

  // =========================== Start Of Follow And UnFollow ======================

  const followBtn = $.querySelector(".follow");
  const unFollowBtn = $.querySelector(".unfollow");

  unFollowBtn.addEventListener("click", async () => {
    await axios.post(`${BASEURL}profile/Unfollow/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  followBtn.addEventListener("click", async () => {
    await axios.post(`${BASEURL}profile/follow/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // =========================== End Of Follow And UnFollow ========================
  });
});
