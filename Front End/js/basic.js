const $ = document;

// give active or err to loading box
function showMessage(flag, msg, box, title, text) {
  if (flag === "loading") {
    box.classList.add("active");
    setTimeout(() => {
      box.classList.remove("active");
    }, 4000);
  } else if (flag === "error") {
    box.classList.add("error");
    title.textContent = "Error!";
    text.textContent = msg;
    setTimeout(() => {
      box.classList.remove("error");
      title.textContent = "Please Wait...";
      text.textContent = "Your registration is in progress";
    }, 6000);
  }
}

// give active to alert
function showAlert(alert) {
  if (!alert.classList.contains("active")) {
    alert.classList.add("active");
    setTimeout(() => {
      alert.classList.remove("active");
    }, 5000);
  }
}

// reset inputs
function reset() {
  for (arg of arguments) {
    arg.value = "";
  }
  labelList.forEach((label) => {
    label.classList.remove("active");
  });
}

export { $, showMessage, showAlert, reset };
