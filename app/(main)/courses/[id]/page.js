import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import CourseDetails from "./_components/CourseDetails";
import Testimonials from "./_components/Testimonials";
import RelatedCourse from "./_components/RelatedCourse";
import { getCourseDetails } from "@/queries/courses";
import { replaceMongoIdInArray } from "@/lib/convertData";

const SingleCoursePage = async ({ params: { id } }) => {
  const course = await getCourseDetails(id);
  return (
    <>
      <CourseDetailsIntro
        course={course}
      />

      <CourseDetails course={course}/>

      {/* Testimonials */}
      {course?.testimonials && (
        <Testimonials
          testimonials={replaceMongoIdInArray(course?.testimonials)}
        />
      )}
      {/* Releated Course */}
      <RelatedCourse />
      {/* Authors */}
      {/* https://avatars.githubusercontent.com/u/1416832?v=4 */}
      {/* https://avatars.githubusercontent.com/u/3633137?v=4 */}
    </>
  );
};
export default SingleCoursePage;
