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

let routeSearch, routeSearchArray, postID, postSlug;

if (location.search) {
  routeSearch = location.search;
  routeSearchArray = routeSearch.split("&");
  postID = routeSearchArray[0].split("=")[1];
  postSlug = routeSearchArray[1].split("=")[1];
} else {
  location.href = "http://127.0.0.1:5500/404.html";
}

// =================== OOP Post =====================
class Post {
  constructor(data) {
    this.postTitle = data.post.title;
    this.postBody = data.post.body;
    this.postUser = data.post.user;
    this.postImg = data.post.image;
    this.postCreated = data.post.created;
    this.comments = data.comments;
    this.isLiked = data.liked;
    this.likesCount = data.likes_count;
    this.postID = data.post.id;
  }

  get imgSrc() {
    if (this.postImg) {
      return `${BASEURL}${this.postImg}`;
    } else {
      return "./pic/default-img.jpg";
    }
  }

  get createDate() {
    return this.postCreated.split("T")[0];
  }

  get createTime() {
    return this.postCreated.split("T")[1].slice(0, 5);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  let post;
  // =============================== Start of get post =====================
  await axios(`${BASEURL}profile/post/${postID}/${postSlug}`)
    .then((res) => {
      if (res.status === 200) {
        post = new Post(res.data);
        console.log(res.data);
      } else {
        location.href = "http://127.0.0.1:5500/404.html";
      }
    })
    .catch((err) => {
      location.href = "http://127.0.0.1:5500/404.html";
    });

  const postImgElement = $.querySelector(".main__header__img");
  const postTitleElement = $.querySelector(".main__title");
  const postBodyElement = $.querySelector(".main__article__paragraph");
  const postUserElement = $.querySelector(".main__article__info__user");
  const postLikeIconElement = $.querySelector(
    ".main__article__info__like__icon svg"
  );
  const postLikeCounterElement = $.querySelector(
    ".main__article__info__like__count"
  );
  const postCreateElement = $.querySelector(
    ".main__article__info__create__date"
  );
  const postTimeElement = $.querySelector(".main__article__info__create-time");

  postImgElement.src = post.imgSrc;
  postTitleElement.textContent = post.postTitle;
  postBodyElement.textContent = post.postBody;
  postUserElement.textContent = post.postUser;
  postUserElement.setAttribute(
    "href",
    `/profile.html?username=${post.postUser}`
  );
  if (post.isLiked) {
    postLikeIconElement.classList.add("active");
  }
  postLikeCounterElement.textContent = post.likesCount;
  postCreateElement.textContent = post.createDate;
  postTimeElement.textContent = post.createTime;

  // ======================== Like ==========================
  const likeBtn = $.querySelector(".main__article__info__like__icon");
  const token = findToken();
  likeBtn.addEventListener("click", async () => {
    console.log(post.postID);
    await axios.post(`${BASEURL}profile/like/${post.postID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  // ======================== Create New Comment ===========
  const commentTextArea = $.querySelector(
    ".comment-container__header__new-comment__textarea"
  );
  const commentBtn = $.querySelector(
    ".comment-container__header__new-comment__comment-btn"
  );

  commentBtn.addEventListener("click", checkCommentValidation);

  function checkCommentValidation() {
    if (commentTextArea.value && commentTextArea.value.length <= 200) {
      sendNewComment();
    }
  }

  async function sendNewComment() {
    console.log(postID, postSlug);
    await axios
      .post(
        `${BASEURL}profile/comment/create/${postID}/${postSlug}/`,
        {
          body: commentTextArea.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
