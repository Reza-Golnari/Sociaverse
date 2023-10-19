const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/img card/css/img-card.min.css">
    <div class="img-card card">
    <div class="img-card__img-box">
      <img class="img-card__img-box__img" src="./pic/6-300x200.jpg" />
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
  </div>
`;

class imgCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const titleLink = this.shadowRoot.querySelector(
      ".text-card__header__title"
    );
    const bodyParagraph = this.shadowRoot.querySelector(
      ".text-card__body__paragraph"
    );
    const footerUser = this.shadowRoot.querySelector(
      ".text-card__footer__user"
    );
    const footerDate = this.shadowRoot.querySelector(
      ".text-card__footer__date"
    );
    const footerTime = this.shadowRoot.querySelector(
      ".text-card__footer__time"
    );

    titleLink.textContent = this.getAttribute("post-title");
    titleLink.setAttribute(
      "href",
      `/post-page.html?postID=${this.getAttribute(
        "post-id"
      )}&postSlug=${this.getAttribute("post-slug")}`
    );

    bodyParagraph.textContent = this.getAttribute("post-body");
    footerUser.textContent = this.getAttribute("post-user");
    footerUser.setAttribute(
      "href",
      `/profile.html?username=${this.getAttribute("post-user")}`
    );

    let fullDate = this.getAttribute("post-date");
    const dateArray = fullDate.split("T");
    footerDate.textContent = dateArray[0];
    footerTime.textContent = dateArray[1].slice(0, 5);
  }
}

export { imgCard };
