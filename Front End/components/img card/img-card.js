const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/img card/css/img-card.min.css">
    <div class="img-card card">
    <div class="img-card__img-box">
      <img class="img-card__img-box__img" src="./pic/default-img.jpg" />
    </div>
    <div class="img-card__header">
      <a href="" class="img-card__header__title">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Obcaecati, esse.
      </a>
    </div>
    <div class="img-card__footer">
      <a class="img-card__footer__user">Reza</a>
      <p class="img-card__footer__date">2023-04-12</p>
      <p class="img-card__footer__time">12:04</p>
    </div>
    <a class="update-box">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18q-.825 0-1.412-.587T2 16V5q0-.825.588-1.412T4 3h7q.425 0 .713.288T12 4q0 .425-.288.713T11 5H4v11h16v-2q0-.425.288-.712T21 13q.425 0 .713.288T22 14v2q0 .825-.587 1.413T20 18h-3l.7.7q.15.15.225.338t.075.387V20q0 .425-.288.712T17 21H7q-.425 0-.712-.288T6 20v-.575q0-.2.075-.387T6.3 18.7L7 18H4Zm10-6.825V4q0-.425.288-.712T15 3q.425 0 .713.288T16 4v7.175L17.9 9.3q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L15 15l-4.3-4.3q-.275-.275-.287-.687T10.7 9.3q.275-.275.7-.275t.7.275l1.9 1.875Z"/></svg>
    </a>
  </div>
`;

class imgCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const titleLink = this.shadowRoot.querySelector(".img-card__header__title");
    const image = this.shadowRoot.querySelector(".img-card__img-box__img");

    const footerUser = this.shadowRoot.querySelector(".img-card__footer__user");
    const footerDate = this.shadowRoot.querySelector(".img-card__footer__date");
    const footerTime = this.shadowRoot.querySelector(".img-card__footer__time");
    titleLink.textContent = this.getAttribute("post-title");
    titleLink.setAttribute(
      "href",
      `/post-page.html?postID=${this.getAttribute(
        "post-id"
      )}&postSlug=${this.getAttribute("post-slug")}`
    );

    if (this.getAttribute("post-img")) {
      image.setAttribute(
        "src",
        `http://localhost:8000${this.getAttribute("post-img")}`
      );
    }

    footerUser.textContent = this.getAttribute("post-user");
    footerUser.setAttribute(
      "href",
      `/profile.html?username=${this.getAttribute("post-user")}`
    );

    let fullDate = this.getAttribute("post-date");
    const dateArray = fullDate.split("T");
    footerDate.textContent = dateArray[0];
    footerTime.textContent = dateArray[1].slice(0, 5);

    const updatable = this.getAttribute("updatable");
    const updateBtn = this.shadowRoot.querySelector(".update-box");

    if (updatable) {
      updateBtn.style.display = "flex";
      updateBtn.href = `http://127.0.0.1:5500/create-post.html?postID=${this.getAttribute(
        "post-id"
      )}&postSlug=${this.getAttribute("post-slug")}`;
    }
  }
}

export { imgCard };
