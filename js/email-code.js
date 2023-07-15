const $ = document;
const enterCodeBtn = $.querySelector(".code-btn");
const codeInput = $.querySelector("#code-input");
const codeBox = $.querySelector(".code-box");
// Check Code

enterCodeBtn.addEventListener("click", codeHandler);

async function codeHandler() {
  if (codeInput.value.length == 5 && +codeInput.value) {
    let data = {
      name: signUserName.value,
      password: signUserPass.value,
      email: email.value,
    };

    let header = {
      "Content-Type": "application/json",
    };

    let options = {
      method: "POST",
      headers: header,
      body: JSON.stringify(data),
    };

    await fetch("test", options);

    reset();
  } else {
    showAlert();
  }
}
