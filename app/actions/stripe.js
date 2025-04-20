"use server";
import { formatAmountForStripe } from "@/lib/stripe-helpers";
import { stripe } from "@/lib/stripe";
const CURRENCY = "BDT";
import { headers } from "next/headers";
import { getCourseDetails } from "@/queries/courses";

export async function createCheckoutSession(data) {
  const ui_mode = "hosted";
  const origin = headers().get("origin");
  const courseId = data.get('courseId')

  const course = await getCourseDetails(courseId);

  if(!course){
    return new Error('Course not Found')
  }

  const courseName = course?.title
  const coursePrice = course?.price
  const courseDescription = course?.description
 console.log(courseId,courseName,coursePrice,courseDescription,'qwdqwdqwdqwddq')
 
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "auto",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,

          product_data: {
            name: courseName,
            description:courseDescription
          },

          unit_amount: formatAmountForStripe(coursePrice, CURRENCY),
        },
      },
    ],
    ...(ui_mode === "hosted" && {
      success_url: `${origin}/enroll-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,

      cancel_url: `${origin}/courses`,
    }),

    ui_mode,
  });

  return {
    client_secret: checkoutSession.client_secret,

    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(data) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(coursePrice, CURRENCY),

    automatic_payment_methods: { enabled: true },

    currency: CURRENCY,
  });

  return { client_secret: paymentIntent.client_secret };
}
