import { replaceMongoIdInArray } from "@/lib/convertData";
import { Lesson } from "@/models/lesson.model";

export const getLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId);
  return lesson;
};

export async function create(lessonData) {
  try {
    const lesson = await Lesson.create(lessonData);
    return JSON.parse(JSON.stringify(lesson));
  } catch (err) {
    throw new Error(err);
  }
}
