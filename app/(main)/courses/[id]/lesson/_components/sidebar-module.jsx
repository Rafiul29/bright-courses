"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import SidebarLesson from "./sidebar-lesson";
import { replaceMongoIdInArray } from "@/lib/convertData";
import { useSearchParams } from "next/navigation";
const SidebarModule = ({ modules, courseId }) => {
  const searchParams = useSearchParams();

  const allModules = replaceMongoIdInArray(modules)?.sort(
    (a, b) => a?.order - b?.order
  );

  const query = searchParams.get("name");
  const expandModule = allModules.find((module) => {
    return module.lessonIds.find((lesson) => {
        return lesson.slug === query;
    });
});

  const expandModuleId = expandModule?.id ?? allModules[0]?.id;

  return (
    <Accordion
      defaultValue={expandModuleId}
      type="single"
      collapsible
      className="w-full px-6"
    >
      {allModules?.map((module) => (
        <AccordionItem className="border-0" value={module?.id} key={module?.id}>
          <AccordionTrigger>{module.title}</AccordionTrigger>
          <SidebarLesson
            courseId={courseId}
            lessons={module?.lessonIds}
            module={module?.slug}
          />
        </AccordionItem>
      ))}

      {/* item ends */}
    </Accordion>
  );
};

export default SidebarModule;
