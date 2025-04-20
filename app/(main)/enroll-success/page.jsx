import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCourseDetails } from "@/queries/courses";
import { getUserByEmail } from "@/queries/users";
import { stripe } from "@/lib/stripe";
import { sendEmails } from "@/lib/email";
import { enrollForCourse } from "@/queries/enrollments";

const Success = async ({ searchParams: { session_id, courseId } }) => {
  console.log(session_id, courseId);
  if (!session_id) {
    throw new Error("Please provide a valid session id that starts with cs_id");
  }

  const userSession = await auth();

  if (!userSession?.user?.email) {
    redirect("/login");
  }

  const course = await getCourseDetails(courseId);
  const loggedInUser = await getUserByEmail(userSession?.user?.email);

  const checkouSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const paymentIntent = checkouSession?.payment_intent;
  const paymentStatus = paymentIntent?.status;
  console.log({ paymentStatus });
  // console.log(checkouSession)

  // Cutomer info
  const customerName = `${loggedInUser?.firstName} ${loggedInUser?.lastName}`;
  const customerEmail = loggedInUser?.email;
  const productName = course?.title;

  if (paymentStatus === "succeeded") {
    // update DB(Enrollment collection)
    const enrolled = await enrollForCourse(
      course?.id,
      loggedInUser.id,
      "stripe"
    );

    console.log(enrolled);
    // send Email to the instructor, student and the person
    const instructorName = `${course?.instructor?.firstName} ${course?.instructor?.lastName}`;
    const instructorEmail = course?.instructor?.email;

    const emailsToSend = [
      {
        to: instructorEmail,
        subject: `New Enrollment for ${productName}.`,
        message: `Congratulations, ${instructorName}. A new student, ${customerName} has enrolled to your course ${productName} just now. Please check the instructor dashboard and give a high-five to your new student.`,
      },
      {
        to: customerEmail,
        subject: `Enrollment Success for ${productName}`,
        message: `Hey ${customerName} You have successfully enrolled for the course ${productName}`,
      },
    ];

    const emailSendResponse = await sendEmails(emailsToSend);
    console.log(emailSendResponse);
    console.log(emailSendResponse[0]?.error);
    // who paid
  }

  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-[600px] text-center">
        {paymentStatus === "succeeded" && (
          <>
            <CircleCheckBig className="w-16 h-16  rounded-full p-0 text-green-500" />
            <h1 className="text-xl md:text-2xl lg:text-3xl">
              Congratulations, <strong>{customerName}</strong>! Your Enrollment
              was Successful for <strong>{productName}</strong>
            </h1>
          </>
        )}
        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/courses/${courseId}/lesson`}>Play Course</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Success;
