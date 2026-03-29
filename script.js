/* ============================================
   FreshNest - Main JavaScript File
   IA#2 - Web Programming Individual Assignment
   ============================================ */

/* =============================================
   IA#2 - JS: Cart State
   Purpose: Holds cart items across all pages using localStorage
   ============================================= */
let cart = JSON.parse(localStorage.getItem('freshnest_cart')) || [];

function saveCart() {
  localStorage.setItem('freshnest_cart', JSON.stringify(cart));
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: updateCartCount()
   Purpose: Updates the cart badge number shown in the navbar
   Creator: Student
   ============================================= */
function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: addToCart(name, price, category)
   Purpose: Adds a product to the cart array and saves it
   Creator: Student
   ============================================= */
function addToCart(name, price, category) {
  var existing = cart.find(function(item) { return item.name === name; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: parseFloat(price), category: category, qty: 1 });
  }
  saveCart();
  updateCartCount();
  showToast(name + ' added to cart!');
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: showToast(message)
   Purpose: Shows a temporary success message at the bottom of the screen
   Creator: Student
   ============================================= */
function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = '\u2713 ' + message;
  toast.classList.add('toast-show');
  setTimeout(function() { toast.classList.remove('toast-show'); }, 3000);
}

/* =============================================
   IA#2 - JS: Event Handling
   Function: toggleNav()
   Purpose: Opens or closes the hamburger navigation menu on mobile
   Creator: Student
   ============================================= */
function toggleNav() {
  var links = document.getElementById('nav-links');
  var toggle = document.getElementById('nav-toggle');
  if (links) {
    links.classList.toggle('open');
    var isOpen = links.classList.contains('open');
    if (toggle) { toggle.setAttribute('aria-expanded', isOpen); }
  }
}

/* =============================================
   IA#2 - JS: Form Validation
   Function: validateLogin(event)
   Purpose: Checks username and password before login form submits
   Creator: Student
   ============================================= */
function validateLogin(event) {
  event.preventDefault();
  var valid = true;
  var username = document.getElementById('username');
  var password = document.getElementById('password');
  var usernameErr = document.getElementById('username-error');
  var passwordErr = document.getElementById('password-error');

  usernameErr.classList.remove('visible');
  passwordErr.classList.remove('visible');

  /* IA#2 - JS: Control Structure - if/else checks */
  if (!username.value.trim()) {
    usernameErr.textContent = 'Username is required.';
    usernameErr.classList.add('visible');
    valid = false;
  }

  if (password.value.length < 6) {
    passwordErr.textContent = 'Password must be at least 6 characters.';
    passwordErr.classList.add('visible');
    valid = false;
  }

  if (valid) {
    showToast('Login successful! Welcome back.');
    setTimeout(function() { window.location.href = 'index.html'; }, 1500);
  }
}

/* =============================================
   IA#2 - JS: Form Validation
   Function: validateRegister(event)
   Purpose: Validates all registration fields including email format
   Creator: Student
   ============================================= */
function validateRegister(event) {
  event.preventDefault();
  var valid = true;

  var name     = document.getElementById('reg-name');
  var email    = document.getElementById('reg-email');
  var pass     = document.getElementById('reg-password');
  var confirm  = document.getElementById('reg-confirm');
  var nameErr    = document.getElementById('name-error');
  var emailErr   = document.getElementById('email-error');
  var passErr    = document.getElementById('rpassword-error');
  var confirmErr = document.getElementById('confirm-error');

  /* IA#2 - JS: Control Structure - reset errors */
  [nameErr, emailErr, passErr, confirmErr].forEach(function(el) {
    if (el) el.classList.remove('visible');
  });

  if (!name || !name.value.trim()) {
    if (nameErr) { nameErr.textContent = 'Full name is required.'; nameErr.classList.add('visible'); }
    valid = false;
  }

  /* IA#2 - JS: Control Structure - email regex check */
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email.value)) {
    if (emailErr) { emailErr.textContent = 'Please enter a valid email address.'; emailErr.classList.add('visible'); }
    valid = false;
  }

  if (!pass || pass.value.length < 6) {
    if (passErr) { passErr.textContent = 'Password must be at least 6 characters.'; passErr.classList.add('visible'); }
    valid = false;
  }

  if (!confirm || confirm.value !== pass.value) {
    if (confirmErr) { confirmErr.textContent = 'Passwords do not match.'; confirmErr.classList.add('visible'); }
    valid = false;
  }

  if (valid) {
    showToast('Registration successful! Welcome to FreshNest.');
    setTimeout(function() { window.location.href = 'login.html'; }, 1800);
  }
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: renderCart()
   Purpose: Builds the cart table dynamically from the cart array
   Creator: Student
   ============================================= */
function renderCart() {
  var tbody      = document.getElementById('cart-body');
  var emptyMsg   = document.getElementById('cart-empty');
  var cartSection = document.getElementById('cart-section');
  if (!tbody) return;

  if (cart.length === 0) {
    if (emptyMsg)    emptyMsg.style.display = 'block';
    if (cartSection) cartSection.style.display = 'none';
    return;
  }

  if (emptyMsg)    emptyMsg.style.display = 'none';
  if (cartSection) cartSection.style.display = 'block';

  tbody.innerHTML = '';
  var subtotal = 0;

  /* IA#2 - JS: Control Structure - for loop through cart items */
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var lineTotal = item.price * item.qty;
    subtotal += lineTotal;

    var row = document.createElement('tr');
    row.innerHTML =
      '<td>' + item.name + '</td>' +
      '<td>$' + item.price.toFixed(2) + '</td>' +
      '<td><input type="number" min="1" value="' + item.qty + '" class="qty-input" data-index="' + i + '" aria-label="Quantity for ' + item.name + '"></td>' +
      '<td>$' + lineTotal.toFixed(2) + '</td>' +
      '<td><button class="remove-btn" data-index="' + i + '" aria-label="Remove ' + item.name + '">Remove</button></td>';
    tbody.appendChild(row);
  }

  /* IA#2 - JS: Arithmetic Calculations - tax, discount, total */
  var tax      = subtotal * 0.15;
  var discount = subtotal > 50 ? subtotal * 0.05 : 0;
  var total    = subtotal + tax - discount;

  function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  setEl('subtotal', '$' + subtotal.toFixed(2));
  setEl('discount', '-$' + discount.toFixed(2));
  setEl('tax',      '$' + tax.toFixed(2));
  setEl('total',    '$' + total.toFixed(2));
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: updateQty(index, value)
   Purpose: Updates quantity of a cart item and refreshes cart display
   Creator: Student
   ============================================= */
function updateQty(index, value) {
  var qty = parseInt(value);
  if (qty > 0) {
    cart[index].qty = qty;
    saveCart();
    renderCart();
    updateCartCount();
  }
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: removeItem(index)
   Purpose: Removes an item from the cart by its index
   Creator: Student
   ============================================= */
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
  showToast('Item removed from cart.');
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: clearCart()
   Purpose: Clears all items from the cart after confirmation
   Creator: Student
   ============================================= */
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    showToast('Cart cleared.');
  }
}

/* =============================================
   IA#2 - JS: Form Validation
   Function: validateCheckout(event)
   Purpose: Validates shipping name and address before order confirms
   Creator: Student
   ============================================= */
function validateCheckout(event) {
  event.preventDefault();
  var valid = true;
  var name    = document.getElementById('ship-name');
  var address = document.getElementById('ship-address');
  var nameErr = document.getElementById('ship-name-error');
  var addrErr = document.getElementById('ship-address-error');

  if (nameErr) nameErr.classList.remove('visible');
  if (addrErr) addrErr.classList.remove('visible');

  if (!name || !name.value.trim()) {
    if (nameErr) { nameErr.textContent = 'Full name is required.'; nameErr.classList.add('visible'); }
    valid = false;
  }

  if (!address || !address.value.trim()) {
    if (addrErr) { addrErr.textContent = 'Shipping address is required.'; addrErr.classList.add('visible'); }
    valid = false;
  }

  if (valid) {
    cart = [];
    saveCart();
    showToast('Order confirmed! Thank you for shopping with FreshNest.');
    setTimeout(function() { window.location.href = 'index.html'; }, 2500);
  }
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: filterProducts(category)
   Purpose: Shows or hides product cards based on selected category
   Creator: Student
   ============================================= */
function filterProducts(category) {
  var cards   = document.querySelectorAll('.product-card');
  var buttons = document.querySelectorAll('.filter-btn');

  /* IA#2 - JS: Control Structure - loop to filter cards */
  cards.forEach(function(card) {
    if (category === 'All' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  buttons.forEach(function(btn) {
    var isActive = btn.dataset.filter === category;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

/* =============================================
   IA#2 - JS: DOM Manipulation
   Function: loadCheckoutSummary()
   Purpose: Populates the checkout sidebar with cart items and total
   Creator: Student
   ============================================= */
function loadCheckoutSummary() {
  var container = document.getElementById('checkout-items');
  var totalEl   = document.getElementById('checkout-total');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="checkout-empty">Your cart is empty.</p>';
    return;
  }

  var html     = '';
  var subtotal = 0;

  /* IA#2 - JS: Control Structure - loop cart for summary */
  cart.forEach(function(item) {
    var line = item.price * item.qty;
    subtotal += line;
    html += '<div class="summary-item"><span>' + item.name + ' x' + item.qty + '</span><span>$' + line.toFixed(2) + '</span></div>';
  });

  /* IA#2 - JS: Arithmetic Calculations */
  var tax      = subtotal * 0.15;
  var discount = subtotal > 50 ? subtotal * 0.05 : 0;
  var total    = subtotal + tax - discount;

  html += '<div class="summary-item"><span>Tax (15%)</span><span>$' + tax.toFixed(2) + '</span></div>';
  if (discount > 0) {
    html += '<div class="summary-item"><span>Discount</span><span>-$' + discount.toFixed(2) + '</span></div>';
  }

  container.innerHTML = html;
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

/* =============================================
   IA#2 - JS: Event Listener - DOMContentLoaded
   Purpose: Sets up all event listeners once the page has fully loaded
   Creator: Student
   ============================================= */
document.addEventListener('DOMContentLoaded', function() {

  /* Update cart badge on every page load */
  updateCartCount();

  /* IA#2 - JS: Event Listener 1 - Hamburger nav toggle */
  var toggleBtn = document.getElementById('nav-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleNav);
  }

  /* IA#2 - JS: Event Listener 2 - Login form submit */
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', validateLogin);
  }

  /* IA#2 - JS: Event Listener 3 - Register form submit */
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', validateRegister);
  }

  /* IA#2 - JS: Event Listener 4 - Checkout form submit */
  var checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', validateCheckout);
    loadCheckoutSummary();
  }

  /* IA#2 - JS: Event Listener 5 - Add to cart buttons (event delegation) */
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('product-card__btn')) {
      var btn      = e.target;
      var name     = btn.dataset.name;
      var price    = btn.dataset.price;
      var category = btn.dataset.category;
      addToCart(name, price, category);
    }
  });

  /* IA#2 - JS: Event Listener 6 - Filter buttons on products page */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    filterBar.addEventListener('click', function(e) {
      if (e.target.classList.contains('filter-btn')) {
        filterProducts(e.target.dataset.filter);
      }
    });
  }

  /* IA#2 - JS: Event Listener 7 - Cart quantity change */
  var cartBody = document.getElementById('cart-body');
  if (cartBody) {
    renderCart();
    cartBody.addEventListener('change', function(e) {
      if (e.target.classList.contains('qty-input')) {
        updateQty(e.target.dataset.index, e.target.value);
      }
    });
    cartBody.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-btn')) {
        removeItem(e.target.dataset.index);
      }
    });
  }

  /* IA#2 - JS: Event Listener 8 - Clear cart button */
  var clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCart);
  }

});
