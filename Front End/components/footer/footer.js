const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/footer/footer.css">
<footer class="footer">
<h4 class="footer-title">
  FrontEnd Developer:
  <a href="https://github.com/Reza-Golnari" class="footer-link"
    >Reza Golnari</a
  >
</h4>
<h4 class="footer-title">
  BackEnd Developer:
  <a href="https://github.com/akbp0" class="footer-link"
    >Arshia Akbaripour</a
  >
</h4>
</footer>
`;

class CreateFooter extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

export {CreateFooter}