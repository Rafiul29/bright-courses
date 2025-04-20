import { CourseProgress } from "@/components/course-progress";

import GiveReview from "./give-review";
import DownloadCertificate from "./download-certificate";
import SidebarModule from "./sidebar-module";
import { getCourseDetails } from "@/queries/courses";
import { Watch } from "@/models/watch-model";
import { getLoggedInUser } from "@/lib/getLoggedInUser";
import { getAReport } from "@/queries/reports";
import { Quiz } from "@/models/quizzes-model";
import Quizz from "./quizz";

export const CourseSidebar = async ({ courseId }) => {
  const course = await getCourseDetails(courseId);

  const loggedInUser = await getLoggedInUser();

  // report
  const report = await getAReport({
    course: courseId,
    student: loggedInUser.id,
  });

  const totalCompletedModules = report?.totalCompletedModeules
    ? report?.totalCompletedModeules.length
    : 0;

  const totalModules = course?.modules ? course?.modules?.length : 0;
  console.log({ totalCompletedModules, totalModules });
  const totoalProgress =
    totalModules > 0 ? (totalCompletedModules / totalModules) * 100 : 0;

  const updatedModules = await Promise.all(
    course.modules.map(async (module) => {
      const moduleId = module._id.toString();
      const lessons = module?.lessonIds;

      const updatedLessons = await Promise.all(
        lessons.map(async (lesson) => {
          const lessonId = lesson?._id?.toString();
          const watch = await Watch.findOne({
            lesson: lessonId,
            module: moduleId,
            user: loggedInUser.id,
          });

          if (watch?.state === "completed") {
            lesson.state = "completed";
          }
          return lesson;
        })
      );
      return module;
    })
  );

  const quizSet = course?.quizSet;
  const isQuizComplete = report?.quizAssesment ? true : false;

  return (
    <>
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">Reactive Accelerator</h1>
          {/* Check purchase */}
          {
            <div className="mt-10">
              <CourseProgress variant="success" value={totoalProgress} />
            </div>
          }
        </div>

        <SidebarModule courseId={courseId} modules={updatedModules} />

        {/* item */}

        <div className="w-full px-4 lg:px-14 pt-10 border-t">
          {quizSet && (
            <Quizz
              courseId={courseId}
              quizSet={quizSet}
              isTaken={isQuizComplete}
            />
          )}
        </div>
        <div className="w-full px-6">
          <DownloadCertificate
            courseId={courseId}
            totoalProgress={totoalProgress}
          />
          <GiveReview courseId={courseId} />
        </div>
      </div>
    </>
  );
};
