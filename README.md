# TechStore

TechStore is a simple online gadget shop built as a web development assignment. Users can browse products, add items to a cart, sign in with Google, complete checkout, and receive an order confirmation email.

## Features

- Google authentication
- Product listing
- Shopping cart
- Checkout page
- Order storage using Supabase
- Row Level Security (RLS)
- Order confirmation emails using Mailgun
- Responsive design

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Supabase
- Supabase Edge Functions
- Mailgun
- Google OAuth
- GitHub Pages

## Project Structure

TechStore/
- index.html
- checkout.html
- style.css
- script.js
- README.md

## How It Works

1. Users browse the available products.
2. Users add products to their shopping cart.
3. Users sign in using Google.
4. Users proceed to checkout.
5. Customer and delivery information are submitted.
6. The order is saved in the Supabase database.
7. A Supabase Edge Function sends the order information to Mailgun.
8. Mailgun sends a confirmation email to the customer.
9. The cart is cleared after a successful order.

## Database

Supabase is used to store customer orders.

The orders table stores:

- Customer name
- Customer email
- Delivery address
- Order items
- Total amount
- User ID
- Order creation date

Row Level Security (RLS) is enabled to protect user orders.

## Email Notifications

Mailgun is used to send confirmation emails after a successful order.

The Mailgun API key is stored securely as a Supabase Edge Function secret.

## Authentication

Google OAuth is implemented using Supabase Authentication and Google Cloud Console.

Users must sign in with Google before placing an order.

## Live Website

https://yetunde12-alt.github.io/TechStore/

## Author

Tanimomo Yetunde
