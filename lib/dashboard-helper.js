import { auth } from "@/auth";
import { getUserByEmail, getUserById } from "@/queries/users";
import {
  getCourseDetails,
  getCourseDetailsByInstructor,
} from "@/queries/courses";
import { getAReport } from "@/queries/reports";

export const COURSE_DATA = "course";
export const ENROLLMENT_DATA = "enrollment";
export const REVIEW_DATA = "review";

const populateReviewData = async (reviews) => {
  const populatedReiews = await Promise.all(
    reviews.map(async (review) => {
      const student = await getUserById(review?.user?._id);
      review["studentName"] = `${student?.firstName} ${student?.lastName}`;

      return review;
    })
  );
  return populatedReiews;
};

const populateEnrollMentData = async (enrollments) => {
  const populatedEnrollments = await Promise.all(
    enrollments.map(async (enrollment) => {
      const student = await getUserById(enrollment?.student?._id);
      enrollment["studentName"] = `${student?.firstName} ${student?.lastName}`;
      enrollment["studentEmail"] = student?.email
      const filter = {
        course: enrollment?.course?._id,
        student: enrollment.student?._id,
      };

      const report = await getAReport(filter);
      enrollment["progress"] = 0;
      enrollment["quizMark"] = 0;
      if (report) {
        // progress
        const course = await getCourseDetails(enrollment?.course?._id);
        const totalModules = course.modules.length;
        const totalCompleteModules = report?.totalCompletedModeules?.length;
        const progress = (totalCompleteModules / totalModules) * 100;
        enrollment["progress"] = progress;

        // quizmarks
        // Get all Quizzes and Assignments
        const quizzes = report?.quizAssessment?.assessments;

        // Get all quizzes and Assignments
        const totalQuizzes = quizzes.length;

        // Find attemted quizzes
        const quizzesTaken = quizzes.filter((q) => q.attempted);

        //Find how many quizzes answerd correct
        const totalCorrect = quizzesTaken
          .map((quiz) => {
            const item = quiz?.options;
            return item.filter((o) => {
              return o.isCorrect === true && o.isSelected === true;
            });
          })
          .filter((ele) => ele.length > 0)
          .flat();
        // quzzies marks
        const markFromQuizzes = totalCorrect?.length * 5;
        enrollment["quizMark"] = markFromQuizzes;
      }
      return enrollment;
    })
  );
  // console.log(populatedEnrollments);
  return populatedEnrollments
};

export async function getInstructorDashboardData(dataType) {
  try {
    const session = await auth();

    const instructor = await getUserByEmail(session?.user?.email);
    const data = await getCourseDetailsByInstructor(instructor?.id, true);

    switch (dataType) {
      case COURSE_DATA:
        return data?.courses;
      case ENROLLMENT_DATA:
        return populateEnrollMentData(data?.enrollments);
      case REVIEW_DATA:
        return populateReviewData(data?.reviews);
      default:
        return data;
    }
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
}
