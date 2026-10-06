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

let cart =
    JSON.parse(localStorage.getItem("techStoreCart")) || [];

let currentUser = null;


// -------------------------------------
// Get HTML elements
// -------------------------------------

const addToCartButtons =
    document.querySelectorAll(".add-to-cart");

const cartMessage =
    document.getElementById("cartMessage");

const googleLoginButton =
    document.getElementById("googleLoginButton");


// -------------------------------------
// Format price
// -------------------------------------

function formatPrice(price) {

    return "₦" + price.toLocaleString("en-NG");

}


// -------------------------------------
// Get current logged-in user
// -------------------------------------

async function getCurrentUser() {

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (session) {

        currentUser = session.user;

        return session.user;

    }

    currentUser = null;

    return null;
}


// -------------------------------------
// Load shared cart from Supabase
// -------------------------------------

async function loadSharedCart() {

    const user = await getCurrentUser();

    if (!user) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("cart_items")
            .select("*")
            .eq("user_id", user.id)
            .order("id");


    if (error) {

        console.error(
            "Could not load shared cart:",
            error.message
        );

        return;
    }


    cart = data.map(function(item) {

        return {
            id: Number(item.product_id),
            name: item.product_name,
            price: Number(item.price),
            quantity: item.quantity
        };

    });


    localStorage.setItem(
        "techStoreCart",
        JSON.stringify(cart)
    );


    updateCart();

    displayCheckoutCart();

}


// -------------------------------------
// Save cart item to Supabase
// -------------------------------------

async function saveCartItem(item) {

    if (!currentUser) {
        return;
    }


    const { data: existingItem, error: findError } =
        await supabaseClient
            .from("cart_items")
            .select("id")
            .eq("user_id", currentUser.id)
            .eq("product_id", item.id)
            .maybeSingle();


    if (findError) {

        console.error(
            "Could not check cart item:",
            findError.message
        );

        return;
    }


    if (existingItem) {

        const { error } =
            await supabaseClient
                .from("cart_items")
                .update({
                    quantity: item.quantity
                })
                .eq("id", existingItem.id)
                .eq("user_id", currentUser.id);


        if (error) {

            console.error(
                "Could not update cart:",
                error.message
            );

        }

    } else {

        const { error } =
            await supabaseClient
                .from("cart_items")
                .insert({
                    user_id: currentUser.id,
                    product_id: item.id,
                    product_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                });


        if (error) {

            console.error(
                "Could not save cart:",
                error.message
            );

        }

    }

}


// -------------------------------------
// Add product to cart
// -------------------------------------

async function addToCart(productId) {

    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    if (!product) {
        return;
    }


    const existingItem =
        cart.find(function(item) {

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


    if (currentUser) {

        const item =
            cart.find(function(item) {

                return item.id === productId;

            });

        await saveCartItem(item);

    } else {

        localStorage.setItem(
            "techStoreCart",
            JSON.stringify(cart)
        );

    }

}


// -------------------------------------
// Display cart
// -------------------------------------

function updateCart() {

    localStorage.setItem(
        "techStoreCart",
        JSON.stringify(cart)
    );


    if (!cartMessage) {
        return;
    }


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


    cartMessage.innerHTML =
        cartHTML;

}


// -------------------------------------
// Remove product from cart
// -------------------------------------

async function removeFromCart(productId) {

    cart =
        cart.filter(function(item) {

            return item.id !== productId;

        });


    updateCart();


    if (currentUser) {

        const { error } =
            await supabaseClient
                .from("cart_items")
                .delete()
                .eq("user_id", currentUser.id)
                .eq("product_id", productId);


        if (error) {

            console.error(
                "Could not remove cart item:",
                error.message
            );

        }

    }

}


// -------------------------------------
// Connect Add to Cart buttons
// -------------------------------------

addToCartButtons.forEach(function(button, index) {

    button.addEventListener(
        "click",
        function() {

            const productId =
                products[index].id;

            addToCart(productId);

        }
    );

});


// -------------------------------------
// Display cart on checkout page
// -------------------------------------

function displayCheckoutCart() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    if (!checkoutItems || !checkoutTotal) {
        return;
    }


    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

        checkoutTotal.textContent =
            "₦0";

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


    checkoutItems.innerHTML =
        checkoutHTML;

    checkoutTotal.textContent =
        formatPrice(total);

}


// -------------------------------------
// Move old local cart to Supabase
// -------------------------------------

async function migrateLocalCart() {

    const user =
        await getCurrentUser();

    if (!user) {
        return;
    }


    const localCart =
        JSON.parse(
            localStorage.getItem("techStoreCart")
        ) || [];


    if (localCart.length === 0) {
        return;
    }


    for (const item of localCart) {

        await saveCartItem(item);

    }


    localStorage.removeItem(
        "techStoreCart"
    );

}


// -------------------------------------
// Google Login
// -------------------------------------

if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        async function() {

            const { error } =
                await supabaseClient
                    .auth
                    .signInWithOAuth({

                        provider: "google",

                        options: {

                            redirectTo:
                                "https://yetunde12-alt.github.io/TechStore/"

                        }

                    });


            if (error) {

                alert(
                    "Google login failed: " +
                    error.message
                );

            }

        }
    );

}


// -------------------------------------
// Check Google Login Session
// -------------------------------------

async function checkLogin() {

    const { data: { session } } =
        await supabaseClient.auth.getSession();


    if (session) {

        currentUser =
            session.user;


        if (googleLoginButton) {

            googleLoginButton.textContent =
                "Signed in as " +
                session.user.email;

            googleLoginButton.disabled =
                true;

        }


        // Move existing browser cart
        // into shared cart

        await migrateLocalCart();


        // Load shared cart

        await loadSharedCart();
                // Create mobile password button
        const mobilePasswordButton =
            document.createElement("button");

        mobilePasswordButton.textContent =
            "Set Mobile App Password";

        mobilePasswordButton.style.marginTop = "10px";
        mobilePasswordButton.style.padding = "10px";
        mobilePasswordButton.style.cursor = "pointer";

        mobilePasswordButton.addEventListener(
            "click",
            async function () {

                const newPassword =
                    prompt(
                        "Create a password for the TechStore mobile app:"
                    );

                if (!newPassword) {
                    return;
                }

                if (newPassword.length < 6) {

                    alert(
                        "Password must be at least 6 characters."
                    );

                    return;
                }

                const { error } =
                    await supabaseClient.auth.updateUser({
                        password: newPassword
                    });

                if (error) {

                    alert(
                        "Could not set password: " +
                        error.message
                    );

                    return;
                }

                alert(
                    "Mobile app password created successfully!"
                );

            }
        );

        document.body.appendChild(
            mobilePasswordButton
        );

    }

}


// -------------------------------------
// Start login check
// -------------------------------------

checkLogin();


// -------------------------------------
// Save Order to Supabase
// -------------------------------------

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const customerName =
                document
                    .getElementById("customerName")
                    .value;


            const customerEmail =
                document
                    .getElementById("customerEmail")
                    .value;


            const customerAddress =
                document
                    .getElementById("customerAddress")
                    .value;


            const { data: { session } } =
                await supabaseClient
                    .auth
                    .getSession();


            if (!session) {

                alert(
                    "Please sign in with Google before placing your order."
                );

                return;

            }


            let total = 0;


            cart.forEach(function(item) {

                total +=
                    item.price *
                    item.quantity;

            });


            // -------------------------------------
            // Save order
            // -------------------------------------

            const { error } =
                await supabaseClient
                    .from("orders")
                    .insert({

                        customer_name:
                            customerName,

                        customer_email:
                            customerEmail,

                        delivery_address:
                            customerAddress,

                        order_items:
                            cart,

                        total_amount:
                            total,

                        user_id:
                            session.user.id

                    });


            if (error) {

                alert(
                    "Order failed: " +
                    error.message
                );

                return;

            }


            alert(
                "Order placed successfully!"
            );


            // -------------------------------------
            // Send confirmation email
            // -------------------------------------

            const { error: emailError } =
                await supabaseClient
                    .functions
                    .invoke(
                        "hyper-worker",
                        {
                            body: {

                                customerName:
                                    customerName,

                                customerEmail:
                                    customerEmail,

                                orderItems:
                                    cart,

                                totalAmount:
                                    total

                            }

                        }
                    );


            if (emailError) {

                console.error(
                    "Email failed:",
                    emailError
                );

            } else {

                console.log(
                    "Confirmation email sent."
                );

            }


            // -------------------------------------
            // Clear shared cart after order
            // -------------------------------------

            await supabaseClient
                .from("cart_items")
                .delete()
                .eq(
                    "user_id",
                    session.user.id
                );


            // Clear browser cart

            localStorage.removeItem(
                "techStoreCart"
            );


            cart = [];


            // Clear checkout form

            checkoutForm.reset();


            // Update screen

            updateCart();

            displayCheckoutCart();

        });

}
