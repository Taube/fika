var showCheckout = false;

function toggleCheckout() {
  showCheckout = !showCheckout;
  populateCheckoutCart();
  updateCheckoutCartText();
  updateCheckoutDisplay();
  populateDateTime();
}

function closeCheckout() {
  closeCart();
  setView("closeAll");
  showCheckout = false;
  updateOverlayDisplay();
  updateCheckoutDisplay();
}

function openCheckout() {
  closeCart();
  toggleCheckout();
}

var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function populateDateTime() {
  var dateField = document.getElementById("date");
  var time = new Date();
  var localTimeStr = time.toLocaleString("sv-SE", { timeZone: "UTC" });

  today = new Date(localTimeStr);
  tomorrow = new Date(today.setDate(today.getDate() + 3))
    .toISOString()
    .split("T")[0];

  maxDay = new Date(today.setDate(today.getDate() + 30))
    .toISOString()
    .split("T")[0];

  dateField.value = tomorrow;
  dateField.min = tomorrow;
  dateField.max = maxDay;
  checkDay();
}

var timeWeekday = `
<option value="16.00">16.00</option>
<option value="17.00">17.00</option>
<option value="18.00">18.00</option>
`;

var timeWeekend = `
<option value="12.00">12.00</option>
<option value="13.00">13.00</option>
<option value="14.00">14.00</option>
<option value="15.00">15.00</option>
<option value="16.00">16.00</option>
`;

function checkDay() {
  var dateField = document.getElementById("date");
  var timeField = document.getElementById("time");
  var inputDate = dateField.valueAsDate;
  var day = days[inputDate.getDay()];

  if (day === "Saturday" || day === "Sunday") {
    timeField.innerHTML = timeWeekend;
  } else {
    timeField.innerHTML = timeWeekday;
  }
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
const address = document.getElementById("address");

const setView = (value) => {
  view = value;

  switch (value) {
    case "form":
      form.style.display = "block";
      thanks.style.display = "none";
      break;

    case "thanks":
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

    case "closeAll":
      form.style.display = "none";
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
  const validAddress = validateAddress();

  const validatedFields = [validName, validEmail, validPhone, validAddress];
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

const validateAddress = () => {
  let isValid = false;
  if (!formPosted) return;

  const addressValue = address.value.trim();
  if (addressValue === "") {
    setError(address, "Vänligen ange address.");
  } else {
    setSuccess(address);
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

  address.addEventListener("blur", () => validateAddress());
  address.addEventListener("keyup", () => validateAddress());
});
