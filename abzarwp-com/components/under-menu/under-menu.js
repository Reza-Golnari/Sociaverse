const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/under-menu/under-menu.css" />
<div class="under-box">
    <ul class="under-menu">
      <slot name="under-item"></slot>
    </ul>
</div>
`;

class CreateUnderMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static observeAttributes() {
    return ["style"];
  }
}

export { CreateUnderMenu };
