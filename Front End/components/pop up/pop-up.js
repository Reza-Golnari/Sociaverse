const template = document.createElement("template");

template.innerHTML = `
<link
      rel="stylesheet"
      href="./icon/fontawesome-free-6.4.0-web/css/all.min.css"
    />
    <link rel="stylesheet" href="./components/pop up/pop-up.css">
<div class="pop-up">
      <i class="fa fa-arrow-up pop-up-icon" aria-hidden="true"></i>
    </div>
`;

class CreatePopUp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const popUp = this.shadowRoot.querySelector(".pop-up");

    popUp.addEventListener("click", () => {
      document.querySelector(".container").scrollTop = 0;
    });
  }
}

export { CreatePopUp };
