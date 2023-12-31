const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/text card/css/text-card.min.css">
    <div class="text-card card">
    <div class="text-card__header">
      <a href="" class="text-card__header__title">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Obcaecati, esse.
      </a>
    </div>
    <div class="text-card__body">
      <p class="text-card__body__paragraph">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
        ex ipsum quibusdam velit accusantium odit a voluptates laborum
        eius non.Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Ullam ex ipsum quibusdam velit accusantium odit a
        voluptates laborum eius non.Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Ullam ex ipsum quibusdam velit
        accusantium odit a voluptates laborum eius non.Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Ullam ex ipsum quibusdam
        velit accusantium odit a voluptates laborum eius non.
      </p>
    </div>
    <div class="text-card__footer">
      <a class="text-card__footer__user">Reza</a>
      <p class="text-card__footer__date">2023-04-12</p>
      <p class="text-card__footer__time">12:04</p>
    </div>
  </div>
`;

class textCard extends HTMLElement {
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

export { textCard };
