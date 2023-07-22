const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./css/main-menu.min.css" />
<div class="box">
<h2 class="box-title">Test</h2>
<p class="box-text">
  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur,
  repellendus?
</p>
<button class="btn btn-1">Button 1</button>
<button class="btn btn-2">Button 2</button>
</div>
`;

class CreateBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static observe;
}

export { CreateBox };
