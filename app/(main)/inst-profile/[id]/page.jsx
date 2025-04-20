import InstructorInfo from "./_components/instructor-info";
import InstructorCourseCard from "./_components/instructor-course-card";
import {
  getCourseDetailsByInstructor,
  getCourseListByInstructor,
} from "@/queries/courses";
import { getUserById } from "@/queries/users";
import { SectionTitle } from "@/components/section-title";

const InstructorProfile = async ({ params: { id } }) => {
  const courses = await getCourseListByInstructor(id);
  const instructor = await getUserById(id);
  const getCourseDetailsByInstructorData = await getCourseDetailsByInstructor(id);


  return (
    <section id="categories" className="space-y-6  py-6  lg:py-12">
      <div className="container grid grid-cols-12 lg:gap-x-8 gap-y-8">
        {/* Instructor Info */}
        <InstructorInfo
          instructor={instructor}
          getCourseDetailsByInstructorData={getCourseDetailsByInstructorData}
        />
        {/* Courses */}
        <div className="col-span-12 lg:col-span-8">
          <div>
            <SectionTitle className="mb-6">Courses</SectionTitle>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((course) => (
                <InstructorCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
export default InstructorProfile;
