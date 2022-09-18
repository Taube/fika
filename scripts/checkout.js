var showCheckout = false;

function toggleCheckout() {
  showCheckout = !showCheckout;
  populateCheckoutCart();
  updateCheckoutCartText();
  updateCheckoutDisplay();
}

function openCheckout() {
  closeCart();
  toggleCheckout();
}

function populateCheckoutCart() {
  var cartHTML = document.getElementById("shopping_cart").innerHTML;
  document.getElementById("checkout_shopping_cart").innerHTML = cartHTML;
}

function updateCheckoutDisplay() {
  if (showCheckout) {
    document.getElementById("checkout").style.display = "block";
  } else {
    document.getElementById("checkout").style.display = "none";
  }
}

function updateCheckoutCartText() {
  var orderTextarea = document.getElementById("order");
  var checkoutCartText = "";
  cart.forEach((product, index) => {
    checkoutCartText += `${product.amount} st. ${product.title} á ${product.priceFormatted}\n`;
  });

  var total = cart.reduce((total, { sum }) => sum + total, 0);
  checkoutCartText += `\nTotalt: ${total}:-`;

  orderTextarea.value = checkoutCartText;
}

const form = document.getElementById("cart-form");
const thanks = document.getElementById("thanks");
let formPosted = false;
let formIsValid = false;
let message = "";
var view = "form";

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

const setView = (value) => {
  view = value;

  switch (value) {
    case "form":
      form.style.display = "block";
      thanks.style.display = "none";
      break;

    case "thanks":
      console.log("Let's hide form and show thanks page...");
      form.style.display = "none";
      thanks.style.display = "block";
      break;

    case "formReset":
      form.style.display = "block";
      thanks.style.display = "none";
      form.reset();
      formIsValid = false;
      formPosted = false;
      break;
  }
};

function sendData(form) {
  const formData = new FormData(form);
  let data = {};

  for (var entry of formData.entries()) {
    data[entry[0]] = entry[1];
  }

  fetch("/send", {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
  }).then((response) => {
    const jsonPromise = response.json();
    jsonPromise.then((res) => {
      message = res.message;
      setView("thanks");
      clearCart();
    });
  });
}

function clearCart() {
  cart = [];
  document.getElementById("shopping_cart").innerHTML = "";
  document.getElementById("checkout_shopping_cart").innerHTML = "";
  document.getElementById("cart-count").innerHTML = "";
}

const validateFormInputs = () => {
  const validName = validateName();
  const validEmail = validateEmail();
  const validPhone = validatePhone();

  const validatedFields = [validName, validEmail, validPhone];
  const formIsValidCheck = (validatedFields) =>
    validatedFields.every((v) => v === true);

  formIsValid = formIsValidCheck(validatedFields);
};

const validateName = () => {
  let isValid = false;
  if (!formPosted) return;

  const nameValue = fullName.value.trim();
  if (nameValue === "") {
    setError(fullName, "Vänligen ange namn.");
  } else {
    setSuccess(fullName);
    isValid = true;
  }
  return isValid;
};

const validateEmail = () => {
  let isValid = false;
  if (!formPosted) return;

  const emailValue = email.value.trim();
  if (emailValue === "") {
    setError(email, "Vänligen ange e-post.");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Vänligen ange korrekt e-post.");
  } else {
    setSuccess(email);
    isValid = true;
  }
  return isValid;
};

const validatePhone = () => {
  let isValid = false;
  if (!formPosted) return;

  const phoneValue = phone.value.trim();
  if (phoneValue === "") {
    setError(phone, "Vänligen ange telefonnummer.");
  } else {
    setSuccess(phone);
    isValid = true;
  }
  return isValid;
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorWrapper = inputControl.querySelector(".error");

  errorWrapper.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorWrapper = inputControl.querySelector(".error");

  errorWrapper.innerText = "";
  inputControl.classList.remove("error");
  inputControl.classList.add("success");
};

// we initialize our script at page load.
window.addEventListener("load", function () {
  // ...to take over the submit event
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formPosted = true;
    validateFormInputs();
    if (formIsValid) {
      sendData(form);
    }
  });

  fullName.addEventListener("blur", () => validateName());
  fullName.addEventListener("keyup", () => validateName());

  email.addEventListener("blur", () => validateEmail());
  email.addEventListener("keyup", () => validateEmail());

  phone.addEventListener("blur", () => validatePhone());
  phone.addEventListener("keyup", () => validatePhone());
});

// this example takes 2 seconds to run
const start = Date.now();

console.log("starting timer...");
// expected output: starting timer...

setTimeout(() => {
  const millis = Date.now() - start;

  console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
  // expected output: seconds elapsed = 2
}, 2000);
