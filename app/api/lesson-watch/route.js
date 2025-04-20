import { getLoggedInUser } from "@/lib/getLoggedInUser";
import { Watch } from "@/models/watch-model";
import { getLesson } from "@/queries/lessons";
import { getModuleBySlug } from "@/queries/modules";
import { createWatchReport } from "@/queries/reports";
import { NextResponse } from "next/server";

const STARTED = "started";
const COMPLETED = "completed";

async function updateReport(userId, courseId, moduleId, lessonId) {
  try {
    console.log(userId, courseId, moduleId, lessonId)
    createWatchReport({userId, courseId, moduleId, lessonId})
  } catch (err) {
      throw new Error(err);
  }
}


export async function POST(request, response) {
  try {
    const { courseId, lessonId, moduleSlug, state, lastTime } =
      await request.json();

    const lesson = await getLesson(lessonId);

    const loggedInUser = await getLoggedInUser();
    const moduleData = await getModuleBySlug(moduleSlug);

    if (!loggedInUser) {
      return new NextResponse("You are not authenticated", {
        status: 401,
      });
    }

    if (state !== STARTED && state !== COMPLETED) {
      return new NextResponse("Invalid State. Can not process request", {
        status: 500,
      });
    }

    if (!lesson) {
      return new NextResponse("Invalid lesson. Can not process request", {
        status: 500,
      });
    }

    const watchEntry = {
      lastTime,
      lesson: lesson.id,
      module: moduleData.id,
      user: loggedInUser.id,
      state,
    };

    const found = await Watch.findOne({
      lesson: lessonId,
      module: moduleData.id,
      user: loggedInUser.id,
    }).lean();

    if (state === STARTED) {
      if (!found) {
        watchEntry["created_at"] = Date.now();
        await Watch.create(watchEntry);
      }
    } else if (state === COMPLETED) {
      if (!found) {
        watchEntry["created_at"] = Date.now();
        await Watch.create(watchEntry);
        await updateReport(loggedInUser.id, courseId, moduleData.id, lessonId);
        console.log("dfwwwwwwww2222www");
      } else {
        if (found.state === STARTED) {
          watchEntry["modified_at"] = Date.now();

          await Watch.findByIdAndUpdate(found._id, { state: COMPLETED });

          await updateReport(
            loggedInUser.id,
            courseId,
            moduleData.id,
            lessonId
          );

          console.log("dfwwwww1111111111111wwwwww");
        }
      }
    }

    return new NextResponse("Watch record added successfully", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}
