const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/hamburger-menu/css/hamburger-menu.min.css">
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
  <div class="hamburger">
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
        class="acc-btn-link side-acc-btn"
        >Log In</a
      >
      <button class="side-acc-btn" style="--clr: #ff4e4f">Log Out</button>
    </ul>
    <!-- end of side box menu -->
  </section>
  <!-- end of hamburger-menu box -->
</nav>
<!-- end of hamburger-menu -->`;

class CreateHamburgerMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const icon = this.shadowRoot.querySelector(".hamburger");
    const sideBox = this.shadowRoot.querySelector(".hamburger-menu-box");
    icon.addEventListener("click", (e) => {
      icon.classList.toggle("active");
      sideBox.classList.toggle("show");
    });
  }
}

export { CreateHamburgerMenu };
