'use client';
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useCart } from "@/src/contexts/CartContext";
import { createOrder } from "../../api/orders";
import { useAuth } from "@/src/contexts/AuthContext";

export default function CheckoutForm() {
  const { cart, totalAmount } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser.name ? currentUser.name : '');
  const [email, setEmail] = useState(currentUser.email ? currentUser.email : '');


  const fetchClientSecret = async () => {
    const response = await fetch("/api/stripe-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalAmount * 100,
        name: name,
        email: email
      }),
    });

    const { clientSecret } = await response.json();

    return clientSecret;
  };

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setErrorMessage('');
    const clientSecret = await fetchClientSecret(); // Fetch the clientSecret as shown above

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    if(!errorMessage){
      newOrder();
    }

    const result = await stripe.confirmPayment({
      clientSecret: clientSecret,
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment-complete",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
      handleError(result.error);
    } else {
    }
  };

  const newOrder = () => {
    const productIds = cart.map((product) => product.id); // Proper use of map to transform cart items into an array of IDs

    const orderData = {
      data: {
        name, // Include name
        email, // Include email
        users_permissions_user: currentUser.id,
        products: productIds, // Use the transformed array
        amount: totalAmount,
        status: "completed",
      },
    };
    
      createOrder(orderData).then((response) => {
        console.log(orderData);
        console.log(response);
      });
        
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-500 w-full text-left"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-3 px-3 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-500 w-full text-left"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-3 border mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <PaymentElement />
          <button
            className="block w-full mt-4 rounded bg-primary px-5 py-3 text-sm text-gray-100 transition hover:bg-blue-700"
            disabled={!stripe}
          >
            Submit
          </button>
          {errorMessage && (<div className="error text-sm font-medium mt-2 text-red-600">{errorMessage}</div>)}
        </form>
      </div>
    </div>
  );
}
