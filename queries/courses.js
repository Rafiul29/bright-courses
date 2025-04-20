import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { Category } from "@/models/category-model";
import { Course } from "@/models/course-model";
import { Module } from "@/models/module.model";
import { Quizset } from "@/models/quizset-model";
import { Testimonial } from "@/models/testimonial-model";
import { User } from "@/models/user-model";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";
import { Lesson } from "@/models/lesson.model";
import { Quiz } from "@/models/quizzes-model";

export async function getCourseList() {
  const courses = await Course.find({ active: true })
    .select(
      "title subtitle thumbnail modules price category instructor quizSet testimonials"
    )
    .populate({ path: "category", model: Category })
    .populate({ path: "instructor", model: User, select: "-password" })
    .populate({ path: "testimonials", model: Testimonial })
    .populate({ path: "modules", model: Module })
    .populate({ path: "quizSet", model: Quizset })
    .sort({ createdAt: -1 })
    .lean();

  return replaceMongoIdInArray(courses);
}

export async function getCourseDetails(id) {
  const course = await Course.findById(id)
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "quizSet",
      model: Quizset,
      populate: {
        path: "quizIds",
        model: Quiz
    }
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
      populate: {
        path: "user",
        model: User,
      },
    })
    .populate({
      path: "modules",
      model: Module,
      populate: {
        path: "lessonIds",
        model: Lesson,
      },
    })
    .lean();

  return replaceMongoIdInObject(course);
}

export async function getCourseListByInstructor(instructorId) {
  const courses = await Course.find({ instructor: instructorId })
    .select(
      "title subtitle thumbnail modules price category instructor quizSet testimonials"
    )
    .populate({ path: "category", model: Category })
    .populate({ path: "instructor", model: User, select: "-password" })
    .populate({ path: "testimonials", model: Testimonial })
    .populate({ path: "modules", model: Module })
    .populate({ path: "quizSet", model: Quizset })
    .sort({ createdAt: -1 })
    .lean();

  return replaceMongoIdInArray(courses);
}

export async function getCourseDetailsByInstructor(instructorId, expand) {
  const publishedCourses = await Course.find({
    instructor: instructorId,
    active: true,
  }).lean();

  const enrollments = await Promise.all(
    publishedCourses.map(async (course) => {
      const enrollment = await getEnrollmentsForCourse(course?._id?.toString());
      return enrollment;
    })
  );

  // const groupByCourses = Object.groupBy(enrollments.flat(), ({ course }) => course);

  const groupByCourses = enrollments
    .flat()
    .reduce((acc, { course, student }) => {
      if (!acc[course]) {
        acc[course] = [];
      }
      acc[course].push(student);
      return acc;
    }, {});

  const totalRevenue = publishedCourses.reduce((acc, course) => {
    return acc + (groupByCourses[course?._id]?.length || 0) * course?.price;
  }, 0);

  const totalEnrollments = enrollments.reduce((total, currentValue) => {
    return total + currentValue?.length;
  }, 0);

  const testimonials = await Promise.all(
    publishedCourses.map(async (course) => {
      const testimonial = await getTestimonialsForCourse(
        course?._id?.toString()
      );
      return testimonial;
    })
  );

  const totalTestimonials = testimonials?.flat();

  const avarageRating =
    totalTestimonials.reduce(
      (total, currentItem) => total + currentItem.rating,
      0
    ) / totalTestimonials.length;

  if (expand) {
    const courses = await Course.find({ instructor: instructorId }).lean();
    return {
      courses: courses,
      enrollments: enrollments.flat(),
      reviews: totalTestimonials,
    };
  }
  return {
    courses: publishedCourses.length,
    enrollments: totalEnrollments,
    reviews: totalTestimonials?.length,
    rating: avarageRating,
    revenue: totalRevenue,
  };
}

export async function create(courseData) {
  try {
    const course = await Course.create(courseData);
    return JSON.parse(JSON.stringify(course));
  } catch (err) {
    throw new Error(err);
  }
}
