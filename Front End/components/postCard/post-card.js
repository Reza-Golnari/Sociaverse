const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/postCard/css/post-card.min.css">
<link
      rel="stylesheet"
      href="./icon/fontawesome-free-6.4.0-web/css/all.min.css"
    />
<div class="card">
<div class="card-header card-header-title">
<h2>Post Title</h2>
</div>
<div class="card-header card-header-img" style="--src: "./pic/IMG_20220103_220433_584.jpg" ">
<img src="./pic/IMG_20220103_220433_584.jpg" />
</div>
<div class="card-body">
  <span class="card-body-text">
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Inventore, aspernatur.
    </p>
  </span>
  <span class="card-body-buttons">
    <a href="#" class="card-btn">Post page</a>
  </span>
</div>
<div class="card-footer">
  <span class="card-footer-span">Radon</span>
  <span class="card-footer-span">
    1243
    <i class="fa fa-heart" aria-hidden="true"></i>
  </span>
  <span class="card-footer-span"> 21:04 </span>
</div>
</div>
`;

class PostCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const titleBox = this.shadowRoot.querySelector(".card-header-title");
    const imgBox = this.shadowRoot.querySelector(".card-header-img");
    console.log(titleBox, imgBox);
    imgBox.style.display = "none";
    titleBox.style.display = "flex";
  }
}

export { PostCard };
