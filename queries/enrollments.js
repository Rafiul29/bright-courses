import { replaceMongoIdInArray } from "@/lib/convertData";
import { Course } from "@/models/course-model";
import { Enrollment } from "@/models/enrollment-model";
import { Category } from "@/models/category-model";

export async function getEnrollmentsForCourse(courseId) {
  const enrollments = await Enrollment.find({ course: courseId }).lean();
  return replaceMongoIdInArray(enrollments);
}

export async function getEnrollmentsForUsers(userId) {
  try {
    const enrollments = await Enrollment.find({ student: userId })
      .populate({
        path: "course",
        model: Course,
        populate: {
          path: "category",
          model: Category,
        },
      })
      .lean();

    return replaceMongoIdInArray(enrollments);
  } catch (error) {}
}

export async function hasEnrollmentForCourse(courseId, studentId) {
  try {
    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: studentId,
    })
      .populate({
        path: "course",
        model: Course,
      })
      .lean();
    if (!enrollment) return false;
    return true;
  } catch (error) {
    console.log(e);
  }
}

export async function enrollForCourse(courseId, userId, paymentMethod) {
  const newEnrollment = {
    course: courseId,
    student: userId,
    method: paymentMethod,
    status: "not-started",
    enrollment_date: new Date(),
  };

  try {
    const response = await Enrollment.create(newEnrollment);
    return response;
  } catch (e) {
    console.log(e);
    // throw new Error(e)
  }
}
