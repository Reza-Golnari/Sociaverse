import { BASEURL, findToken } from "../../js/basic.js";

const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="./components/comment/css/comment.min.css">

<div class="comment">
<div class="comment__user">
  <a href=""></a>
</div>
<div class="comment__body">
  <p></p>
  <nav class="comment__body__footer">
    <button class="comment__reply">Reply</button>
  </nav>
</div>
</div>
<div class="reply-box">
<input
  type="text"
  class="reply-box__input"
  placeholder="Reply ..."
  maxlength="100"
/>
<button class="reply-box__btn">Send</button>
</div>
`;

class Comment extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const a = this.shadowRoot.querySelector(".comment__user a");
    const body = this.shadowRoot.querySelector(".comment__body p");

    a.textContent = this.getAttribute("comment-user");
    a.href = `./profile.html?username=${this.getAttribute("comment-user")}`;
    body.textContent = this.getAttribute("comment-body");

    const replyBox = this.shadowRoot.querySelector(".reply-box");
    const replyBtn = this.shadowRoot.querySelector(".comment__reply");
    const replyInput = this.shadowRoot.querySelector(".reply-box__input");
    const sendReplyBtn = this.shadowRoot.querySelector(".reply-box__btn");

    const commentID = this.getAttribute("id");
    const postID = this.getAttribute("post-id");

    replyBtn.addEventListener("click", openReplyBox);

    function openReplyBox() {
      replyBox.classList.toggle("show");
    }

    sendReplyBtn.addEventListener("click", async () => {
      if (replyInput.value && replyInput.value.length <= 100) {
        await axios
          .post(
            `${BASEURL}profile/comment/reply/${commentID}/${postID}`,
            {
              body: replyInput.value,
            },
            {
              headers: {
                Authorization: `Bearer ${findToken()}`,
              },
            }
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            replyBox.classList.remove("show");
          });
      } else {
        replyBox.classList.remove("show");
      }
    });
  }
}

export { Comment };
