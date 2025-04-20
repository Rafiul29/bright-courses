// import { CourseProgress } from "@/components/course-progress";

import { auth } from "@/auth";
import EnrolledCourseCard from "../../component/enrolled-course-card";
import { getEnrollmentsForUsers } from "@/queries/enrollments";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/queries/users";
import Link from "next/link";

async function EnrolledCourses() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const loggedInUser = await getUserByEmail(session?.user?.email);
  const enrollments = await getEnrollmentsForUsers(loggedInUser?.id);

console.log(enrollments)
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {enrollments && enrollments.length > 0 ? (
        enrollments.map((enrollment) => (
          <Link href={`/courses/${enrollment?.course?._id?.toString()}/lesson`} key={enrollment?.id} >
          <EnrolledCourseCard enrollment={enrollment} />
          </Link>
        ))
      ) : (
        <p> No Enrollments Found</p>
      )}
    </div>
  );
}

export default EnrolledCourses;
