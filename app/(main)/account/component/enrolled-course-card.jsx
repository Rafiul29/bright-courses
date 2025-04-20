import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAReport } from "@/queries/reports";
import { CourseProgress } from "@/components/course-progress";
import { getCourseDetails } from "@/queries/courses";

const EnrolledCourseCard = async ({ enrollment }) => {
  const filter = {
    course: enrollment?.course?._id?.toString(),
    student: enrollment?.student?._id.toString(),
  };
  const report = await getAReport(filter);
  const courseDetails = await getCourseDetails(
    enrollment?.course?._id?.toString()
  );
  const totalModuleCount = courseDetails?.modules?.length;

  // total completed Modules
  const totalCompletedModules = report?.totalCompletedModeules
    ? report?.totalCompletedModeules?.length
    : 0;

  // totoal progress
  const totoalProgress = totalModuleCount
    ? (totalCompletedModules / totalModuleCount) * 100
    : 0;

  const totalModules = enrollment?.course?.modules?.length;
  // total completed Lesson
  const totalCompletedLesson = report?.totalCompletedLessons?.length;

  // Get all Quizzes and Assignments
  const quizzes = report?.quizAssessment?.assessments;

  // Get all quizzes and Assignments
  const totalQuizzes = quizzes?.length ? quizzes?.length :0 ;

  // Find attemted quizzes
  const quizzesTaken = quizzes? quizzes?.filter((q) => q.attempted):[]  ;

  //Find how many quizzes answerd correct
  const totalCorrect = quizzesTaken
    ?.map((quiz) => {
      const item = quiz?.options;
      return item.filter((o) => {
        return o.isCorrect === true && o.isSelected === true;
      });
    })
    .filter((ele) => ele.length > 0)
    .flat();

  // quzzies marks
  const totalQuizzesMarks = totalCorrect?  totalCorrect?.length * 5 :0;

  const otherMarks = report?.quizAssessment?.otherMarks ?? 0;

  const totalMarks = totalQuizzesMarks + otherMarks;

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
      {/* Course Thumbnail */}
      <div className="relative w-full aspect-video rounded-md overflow-hidden">
        <Image
          src={`/assets/images/courses/${enrollment?.course?.thumbnail}`}
          alt="course"
          className="object-cover"
          fill
        />
      </div>

      {/* Course Details */}
      <div className="flex flex-col pt-2">
        <h2 className="text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2">
          {enrollment?.course?.title}
        </h2>
        <p className="text-xs text-muted-foreground">
          {enrollment?.course?.category?.title}
        </p>

        {/* Chapters Info */}
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <BookOpen className="w-4" />
            <span>{enrollment?.course?.modules?.length} Chapters</span>
          </div>
        </div>

        {/* Course Progress */}
        <div className="border-b pb-2 mb-2">
          {/* Modules */}
          <div className="flex items-center justify-between">
            <span className="text-md md:text-sm font-medium text-slate-700">
              Total Modules: {totalModules}
            </span>
            <span className="text-md md:text-sm font-medium text-slate-700">
              Completed Modules{" "}
              <Badge variant="success">{totalCompletedModules}</Badge>
            </span>
          </div>

          {/* Quizzes */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-md md:text-sm font-medium text-slate-700">
              Total Quizzes: {totalQuizzes}
            </span>
            <span className="text-md md:text-sm font-medium text-slate-700">
              Quiz Taken <Badge variant="success">{quizzesTaken?.length ? quizzesTaken?.length:0}</Badge>
            </span>
          </div>

          {/* Quiz Marks */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-md md:text-sm font-medium text-slate-700">
              Mark from Quizzes
            </span>
            <span className="text-md md:text-sm font-medium text-slate-700">
              {totalQuizzesMarks}
            </span>
          </div>

          {/* Other Marks */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-md md:text-sm font-medium text-slate-700">
              Others
            </span>
            <span className="text-md md:text-sm font-medium text-slate-700">
              {otherMarks}
            </span>
          </div>
        </div>

        {/* Total Marks */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-md md:text-sm font-medium text-slate-700">
            Total Marks
          </span>
          <span className="text-md md:text-sm font-medium text-slate-700">
            {totalMarks}
          </span>
        </div>

        {/* Uncomment this if using Course Progress */}
        <CourseProgress
          size="sm"
          value={totoalProgress}
          variant={110 === 100 ? "success" : ""}
        />
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
