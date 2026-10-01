// -------------------------------------
// Product information
// -------------------------------------

const products = [
    {
        id: 1,
        name: "Smartphone",
        price: 450000
    },
    {
        id: 2,
        name: "Laptop",
        price: 850000
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 75000
    },
    {
        id: 4,
        name: "Smartwatch",
        price: 120000
    },
    {
        id: 5,
        name: "Power Bank",
        price: 35000
    },
    {
        id: 6,
        name: "USB-C Charger",
        price: 20000
    }
];


// -------------------------------------
// Shopping cart
// -------------------------------------

let cart = JSON.parse(localStorage.getItem("techStoreCart")) || [];


// -------------------------------------
// Get HTML elements
// -------------------------------------

const addToCartButtons = document.querySelectorAll(".add-to-cart");

const cartMessage = document.getElementById("cartMessage");


// -------------------------------------
// Format price
// -------------------------------------

function formatPrice(price) {

    return "₦" + price.toLocaleString("en-NG");

}


// -------------------------------------
// Add product to cart
// -------------------------------------

function addToCart(productId) {

    const product = products.find(function(item) {

        return item.id === productId;

    });


    if (!product) {

        return;

    }


    const existingItem = cart.find(function(item) {

        return item.id === productId;

    });


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            quantity: 1

        });

    }


    updateCart();

}


// -------------------------------------
// Display cart
// -------------------------------------

function updateCart() {

    // Save cart in browser
    localStorage.setItem(
        "techStoreCart",
        JSON.stringify(cart)
    );
        // Stop if this page does not have a cart section
    if (!cartMessage) {
        return;
    }


    // If cart is empty
    if (cart.length === 0) {

        cartMessage.textContent =
            "Your cart is currently empty.";

        return;

    }


    let cartHTML = "";

    let total = 0;


    cart.forEach(function(item) {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        cartHTML += `

            <div class="cart-item">

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ${formatPrice(item.price)}
                    × ${item.quantity}
                </p>

                <button
                    class="remove-button"
                    onclick="removeFromCart(${item.id})">

                    Remove

                </button>

            </div>

        `;

    });


    cartHTML += `

        <div class="cart-total">

            <h3>
                Total: ${formatPrice(total)}
            </h3>

        </div>

    `;


    cartMessage.innerHTML = cartHTML;

}


// -------------------------------------
// Remove product from cart
// -------------------------------------

function removeFromCart(productId) {

    cart = cart.filter(function(item) {

        return item.id !== productId;

    });


    updateCart();

}


// -------------------------------------
// Connect Add to Cart buttons
// -------------------------------------

addToCartButtons.forEach(function(button, index) {

    button.addEventListener("click", function() {

        const productId = products[index].id;

        addToCart(productId);

    });

});


// -------------------------------------
// Display saved cart when page opens
// -------------------------------------

updateCart();
// -------------------------------------
// Display cart on checkout page
// -------------------------------------

function displayCheckoutCart() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    // Stop if we are not on the checkout page
    if (!checkoutItems || !checkoutTotal) {

        return;

    }


    // If cart is empty
    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

        checkoutTotal.textContent = "₦0";

        return;

    }


    let checkoutHTML = "";

    let total = 0;


    cart.forEach(function(item) {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        checkoutHTML += `

            <div class="checkout-item">

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ${formatPrice(item.price)}
                    × ${item.quantity}
                </p>

                <p>
                    Subtotal:
                    ${formatPrice(itemTotal)}
                </p>

            </div>

        `;

    });


    checkoutItems.innerHTML = checkoutHTML;

    checkoutTotal.textContent =
        formatPrice(total);

}


// Display checkout cart
displayCheckoutCart();
// -------------------------------------
// Google Login
// -------------------------------------

const googleLoginButton =
    document.getElementById("googleLoginButton");


if (googleLoginButton) {

    googleLoginButton.addEventListener("click", async function() {

        const { error } =
    await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: "https://yetunde12-alt.github.io/TechStore/"
        }
    });


        if (error) {

            alert("Google login failed: " + error.message);

        }

    });

}