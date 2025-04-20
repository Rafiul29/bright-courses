import { AccordionContent } from "@/components/ui/accordion";

import SidebarLessonItem from "./sidebar-lesson-item";
import { replaceMongoIdInArray } from "@/lib/convertData";
const SidebarLesson = ({ courseId, module, lessons }) => {
  const allLessons = replaceMongoIdInArray(lessons).sort(
    (a, b) => a.order - b.order
  );

  
  return (
    <AccordionContent>
      <div className="flex flex-col w-full gap-3">
        {/* active and completed */}
        {allLessons?.map((lesson) => (
          <SidebarLessonItem key={lesson.id}  lesson={lesson} courseId={courseId} module={module} />
        ))}
      </div>
    </AccordionContent>
  );
};

export default SidebarLesson;
