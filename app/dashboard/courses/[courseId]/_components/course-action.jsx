"use client";

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { changeModulePublishedState, deleteModule } from "@/app/actions/module";
import { useRouter } from "next/navigation";
import { changeCoursePublishedState, deleteCourse } from "@/app/actions/course";

export const CourseActions = ({ course }) => {

  const [action, setAction] = useState(null);
  const [published, setPublished] = useState(course?.active);

  const router =useRouter()
  async function handleSubmit(event) {
    event.preventDefault();

     try {
          switch (action) {
            case "change-active": {
              const activeState = await changeCoursePublishedState(course.id);
              setPublished(!activeState);
              toast.success(published ? "Course Unpublish" : "Course Publish");
              router.refresh()
              break;
            }
            case "delete": {
              if(published){
                toast.error('A published Course can not be deleted, First unpublished it then delete')
              }else{
                await deleteCourse(course.id)
                // router.refresh()
                router.push(`/dashboard/courses`)
              }
              break;
            }
            default: {
              throw new Error("Invalid Module Action");
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
  }


  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAction("change-active")}
        >
          {published ? "Unpublish" : "Publish"}
        </Button>

        <Button size="sm" onClick={() => setAction("delete")}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
