"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./_components/CheckoutForm";
import { useCart } from "@/src/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY);

function Checkout() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { cart, totalAmount } = useCart();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/sign-in");
      return;
    }

  }, []);

  const options = {
    mode: "payment",
    currency: "usd",
    amount: totalAmount * 100,
    // passing the client secret obtained from the server
    //clientSecret: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
  };
  return (
    <>
      {cart.length === 0 ? (
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
            <div className="mx-auto max-w-xl text-center">
              <h1 className="text-3xl font-extrabold sm:text-5xl">
                <strong className="font-bold sm:block">
                  Your cart is empty
                </strong>
              </h1>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-700 sm:w-auto"
                  href="/"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          {currentUser && <CheckoutForm /> }
        </Elements>
      )}
    </>
  );
}

export default Checkout;
