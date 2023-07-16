const $ = document;
const eyeIconList = $.querySelectorAll(".eye-icon");
const inputList = $.querySelectorAll(".input");

// set event for icons
eyeIconList.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    if (event.target.className == "fas fa-eye eye-icon") {
      event.target.className = "fas fa-eye-slash eye-icon";
      event.target.previousElementSibling.setAttribute("type", "text");
    } else {
      event.target.className = "fas fa-eye eye-icon";
      event.target.previousElementSibling.setAttribute("type", "password");
    }
  });
});

// give active to labels
inputList.forEach((input) => {
  input.addEventListener("focus", (event) => {
    event.target.nextElementSibling.classList.add("active");
  });

  input.addEventListener("blur", (event) => {
    if (!event.target.value) {
      event.target.nextElementSibling.classList.remove("active");
    } else {
      return;
    }
  });
});
