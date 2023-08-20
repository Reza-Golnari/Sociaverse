const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/hamburger-menu/css/hamburger-menu.min.css">
<link
rel="stylesheet"
href="./icon/fontawesome-free-6.4.0-web/css/all.min.css"
/>
<!-- start of hamburger-menu -->
<nav class="hamburger-navbar">
  <!-- start of logo -->
  <div class="logo-box">
    <a href="index.html" class="logo">
      <span class="green-text">S</span>ocia<span class="green-text">V</span
      >erse
    </a>
  </div>
  <!-- end of logo -->
  <!-- start of hamburger-menu btn -->
  <div class="hamburger hamburgerIcon">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </div>
  <!-- end of hamburger-menu btn -->
  <!-- start of hamburger-menu box -->
  <section class="hamburger-menu-box">
    <!-- start of hamburger box logo -->
    <div class="logo-box side-logo">
      <a href="index.html" class="logo side-logo">
        <span class="green-text">S</span>ocia<span class="green-text"
          >V</span
        >erse
      </a>
    </div>
    <!-- end of hamburger box logo -->
    <!-- start of side box menu -->
    <ul class="side-menu">
      <li class="side-menu-item">
        <a href="index.html" class="side-menu-link active">Home</a>
      </li>
      <li class="side-menu-item">
        <a href="explore.html" class="side-menu-link">Explore</a>
      </li>
      <li class="side-menu-item">
        <a href="profile.html" class="side-menu-link">Profile</a>
      </li>
      <li class="side-menu-item">
        <a href="direct.html" class="side-menu-link">Direct</a>
      </li>
      <a
        href="log-in.html"
        style="--clr: #1890ff"
        class="acc-btn-link side-acc-btn loginBtn"
        >Log In</a
      >
      <button class="side-acc-btn logoutBtn" style="--clr: #ff4e4f">Log Out</button>
    </ul>
    <!-- end of side box menu -->
  </section>
  <!-- end of hamburger-menu box -->
  <!-- start of log out box -->
  <div class="log-out-box">
    <i class="fa fa-times log-out-close" aria-hidden="true"></i>
    <h2 class="log-out-title">Are You Sure?</h2>
    <p class="log-out-text">
      By logging out of your account, you will not be able to perform
      activities that require registration
    </p>
    <button class="log-out-btn">Log Out</button>
  </div>
  <!-- end of log out box -->
</nav>
<!-- end of hamburger-menu -->`;

class CreateHamburgerMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    let listItems = this.shadowRoot.querySelectorAll(".side-menu-link");
    let route = location.pathname;
    let icon = this.shadowRoot.querySelector(".hamburgerIcon");
    let box = this.shadowRoot.querySelector(".hamburger-menu-box");
    icon.addEventListener("click", clickHandler);

    function clickHandler() {
      icon.classList.toggle("active");
      box.classList.toggle("show");
    }

    function removeActive() {
      listItems.forEach((item) => {
        item.classList.remove("active");
      });
    }

    switch (route) {
      case "/index.html":
        removeActive();
        listItems[0].classList.add("active");
        console.log("index");
        break;
      case "/log-in.html":
        removeActive();
        console.log(icon);
        console.log("log-in");
        break;
      case "/sign-up.html":
        removeActive();
        console.log(icon);
        console.log("sign-up");
        break;
      case "/direct.html":
        removeActive();
        listItems[3].classList.add("active");
        console.log("direct");
        break;
      case "/explore.html":
        removeActive();
        listItems[1].classList.add("active");
        console.log("explore");
        break;
      case "/profile.html":
        removeActive();
        listItems[2].classList.add("active");
        console.log("profile");
        break;
      case "/post-page.html":
        removeActive();
        console.log("post");
        break;

      default:
        removeActive();
        listItems[0].classList.add("active");
        location.href = "http://127.0.0.1:5500/index.html";
        break;
    }
  }
}

export { CreateHamburgerMenu };
