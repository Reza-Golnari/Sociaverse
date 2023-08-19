const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="./components/main-menu/css/main-menu.min.css">
<link
      rel="stylesheet"
      href="./icon/fontawesome-free-6.4.0-web/css/all.min.css"
    />
<!-- start of nav -->
<nav class="navbar" id="main-menu">
  <!-- start of logo -->
  <div class="logo-box">
    <a href="index.html" class="logo">
      <span class="green-text">S</span>ocia<span class="green-text"
        >V</span
      >erse
    </a>
  </div>
  <!-- end of logo -->
  <!-- start of search box -->
  <div class="search-box">
    <input
      class="search"
      type="text"
      placeholder="Search"
      name="search"
      autocomplete="off"
    />
    <i class="fa fa-search search-icon" aria-hidden="true"></i>
  </div>
  <!-- end of search box -->
  <!-- start of menu -->
  <ul class="header-menu">
    <li class="header-menu-item">
      <a href="index.html" class="header-menu-link active">Home</a>
    </li>
    <li class="header-menu-item">
      <a href="explore.html" class="header-menu-link">Explore</a>
    </li>
    <li class="header-menu-item">
      <a href="profile.html" class="header-menu-link">Profile</a>
    </li>
    <li class="header-menu-item">
      <a href="direct.html" class="header-menu-link">Direct</a>
    </li>
  </ul>
  <!-- end of menu -->
  <!-- start of login -->
  <div class="logIn-box">
    <a href="log-in.html" class="logIn acc-btn">Log In</a>
    <button class="logOut acc-btn">Log Out</button>
  </div>
  <!-- end of login -->
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
<!-- end of nav -->
`;

class CreateBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    let listItems = this.shadowRoot.querySelectorAll(".header-menu-link");
    let route = location.pathname;
    console.log(route);
    console.log(listItems);

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
        console.log("log-in");
        break;
      case "/sign-up.html":
        removeActive();
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

export { CreateBox };
