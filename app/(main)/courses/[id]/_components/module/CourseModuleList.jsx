import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookCheck,
  Clock10,
  FileQuestion,
  NotepadText,
  Radio,
  StickyNote,
  Tv,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CourseLessionList from "./CourseLessionList";

const CourseModuleList = ({ module }) => {
  const moduleDuration = module.lessonIds?.reduce(
    (acc, obj) => acc + obj.duration,
    0
  );

  return (
    <AccordionItem className="border-none" value="item-1">
      <AccordionTrigger>{module.title}</AccordionTrigger>
      <AccordionContent>
        {/* header */}
        <div class="flex gap-x-5 items-center flex-wrap mt-4 mb-6 text-gray-600 text-sm">
          <span className="flex items-center gap-1.5">
            <Video className="w-4 h-4" />
            {(moduleDuration / 3600).toFixed(1)} Lessons
          </span>
          <span className="flex items-center gap-1.5">
            <NotepadText className="w-4 h-4" />
            10 Notes
          </span>
          <span className="flex items-center gap-1.5">
            <FileQuestion className="w-4 h-4" />
            10 Quiz
          </span>
          <span className="flex items-center gap-1.5">
            <Radio className="w-4 h-4" />1 Live Class
          </span>
        </div>
        {/* header ends */}

        <div className="space-y-3">
          {/* item */}
          {module?.lessonIds &&
            module?.lessonIds?.map((lessonId) => (
              <CourseLessionList key={lessonId} lessonId={lessonId} />
            ))}
          {/* item ends */}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CourseModuleList;
