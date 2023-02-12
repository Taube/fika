var addItemId = 0;
var cart = [];
var showCart = false;

function cartItemRowImage(product) {
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  var img = document.createElement("img");
  img.setAttribute("src", product.image);
  cell.append(img);
  cell.colSpan = 4;
  row.append(cell);
  return row;
}

function cartItemRow(product) {
  var row = document.createElement("tr");

  var title = document.createElement("td");
  title.innerText = product.title;

  var amount = document.createElement("td");
  amount.innerText = product.amount;

  var price = document.createElement("td");
  price.innerText = product.priceFormatted;

  var sum = document.createElement("td");
  sum.innerText = product.sumFormatted;

  row.append(title);
  row.append(amount);
  row.append(price);
  row.append(sum);

  return row;
}

function cartSummary() {
  var cell = document.createElement("div");
  var total = cart.reduce((total, { sum }) => sum + total, 0);
  cell.innerText = "summa: " + total + ":-";
  return cell;
}

function updateCart(cart) {
  var shoppingCart = document.getElementById("shopping_cart");
  shoppingCart.innerHTML = "";

  var cartCount = document.getElementById("cart-count");

  if (cart.length === 0) {
    shoppingCart.innerHTML = "<tr><td>Din varukorg är tom.</td></tr>";
    cartCount.innerHTML = "";
  }

  cart.forEach((product, index) => {
    var row1 = cartItemRowImage(product);
    var row2 = cartItemRow(product);
    var row3 = cartItemRowButton(product);

    var table = document.createElement("table");
    table.setAttribute("id", "cart-" + product.id);

    table.append(row1);
    table.append(row2);
    table.append(row3);

    shoppingCart.append(table);
  });

  var summary = cartSummary();
  shoppingCart.append(summary);

  var total = cart.reduce((total, { amount }) => amount + total, 0);

  cartCount.innerText = 0 < total ? total : "";
}

function deleteFromCart(id) {
  cart = cart.filter((object) => {
    return object.id !== id;
  });

  updateCart(cart);
}

function cartItemRowButton(product) {
  var row = document.createElement("tr");
  var cell = document.createElement("td");

  var button = document.createElement("button");
  button.innerText = "Ta bort";

  button.setAttribute("onclick", "deleteFromCart('" + product.id + "')");
  button.className = "taBortKnapp";
  cell.append(button);
  cell.colSpan = 4;
  row.append(cell);
  return row;
}

function addToCart(item) {
  var id = item.id;
  var amount = parseInt(item.children[2].children[0].children[1].value);
  var priceFormatted = item.children[2].children[1].innerText;
  var price = parseInt(priceFormatted.replace(":-", ""));

  var foundProduct = cart.find((product) => product.id === id);

  if (foundProduct) {
    var previousAmount = foundProduct.amount;
    var newAmount = previousAmount + amount;
    var newSum = newAmount * price;
    var newSumFormatted = newSum.toString() + ":-";
    foundProduct.amount = newAmount;
    foundProduct.sum = newSum;
    foundProduct.sumFormatted = newSumFormatted;
  } else {
    var sum = amount * price;
    var product = {
      id: id,
      image: item.children[0].currentSrc,
      title: item.children[1].innerText,
      amount: amount,
      price: price,
      priceFormatted: priceFormatted,
      sum: sum,
      sumFormatted: sum.toString() + ":-",
    };
    cart.push(product);
  }

  updateCart(cart);
  showCart = true;
  updateCartDisplay();
  updateOverlayDisplay();
}

//------------------------done with cart------------------------//

function toggleCart() {
  showCart = !showCart;
  updateCartDisplay();
  updateOverlayDisplay();
}

function closeCart() {
  showCart = false;
  updateCartDisplay();
  updateOverlayDisplay();
}

function updateCartDisplay() {
  var cartElement = document.getElementById("cart");
  if (!cartElement) {
    return;
  }
  if (showCart) {
    cartElement.style.display = "inline";
  } else {
    cartElement.style.display = "none";
  }
}

function updateOverlayDisplay() {
  var overlay = document.getElementById("overlay");
  if (!overlay) {
    return;
  }
  if (showCart) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}
