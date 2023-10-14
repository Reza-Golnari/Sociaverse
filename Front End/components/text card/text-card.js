const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/text card/css/text-card.min.css">
<link
      rel="stylesheet"
      href="./icon/fontawesome-free-6.4.0-web/css/all.min.css"
    />
    <div class="text-card card">
    <div class="text-card__header">
      <a href="#" class="text-card__header__title">
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
      <a href="#" class="text-card__footer__user">Reza</a>
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
  connectedCallback() {}
}

export { textCard };
