import React from "react";
import { getProduct } from "../../api/products";
import Image from "next/image";
import AddToCartButton from "@/src/components/AddToCartButton";

async function SingleProduct({ params: { slug } }) {
  const product = await getProduct(slug);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-10">
          {product ? (
            <>
              {product.attributes.banner.data.attributes.url ? (
                <div className="w-full sm:w-1/3">
                  <img
                    className="rounded-lg"
                    src={product.attributes.banner.data.attributes.url}
                    alt="banner"
                  />
                </div>
              ) : (
                <div className="h=[400px] w-[400px] bg-slate-200 animate-pulse"></div>
              )}

              <div className="w-full sm:w-2/3">
                <h1 className="text-[24px] sm:text-[24px] font-bold text-black">
                  {product.attributes.title}
                </h1>
                <h2 className="text-[14px] sm:text-[16px] font-bold mt-2 text-gray-400">
                  {product.attributes.category}
                </h2>
                <p className="text-[14px] sm:text-[16px] mt-5 text-gray-700">
                  {product.attributes.description}
                </p>
                <h2 className="text-[20px] sm:text-[24px] font-semibold mt-5 text-primary">
                  $ {product.attributes.price}
                </h2>
                <AddToCartButton product={product} />
              </div>
            </>
          ) : (
            <>
              <div className="h=[400px] w-[100%] bg-slate-200 animate-pulse"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
