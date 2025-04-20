"use server";
import { replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/models/lesson.model";
import { Module } from "@/models/module.model";
import { create } from "@/queries/lessons";
import mongoose from "mongoose";

export async function createLesson(data) {
  try {
    const title = data.get("title");
    const slug = data.get("slug");
    const moduleId = data.get("moduleId");
    const order = data.get("order");

    const createdLesson = await create({ title, slug, order });
    console.log(createdLesson);
    const module = await Module.findById(moduleId);
    module.lessonIds.push(createdLesson?._id);
    module.save();
    return createdLesson;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function reOrderLesson(data) {
  try {
    await Promise.all(
      data.map(async (element) => {
        await Lesson.findByIdAndUpdate(element.id, { order: element.position });
      })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateLesson(lessonId, dataToUpdate) {
  try {
    await Lesson.findByIdAndUpdate(lessonId, dataToUpdate);
  } catch (error) {
    throw new Error(error);
  }
}

export async function changeLessonPublishedState(lessonId) {
  try {
    const lesson = await Lesson.findById(lessonId);
    const res = await Lesson.findByIdAndUpdate(
      lessonId,
      { active: !lesson?.active },
      { lean: true }
    );
    return res?.active;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteLesson(lessonId, moduleId) {
  try {
    const module = await Module.findById(moduleId);
    module.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
    const lesson = await Lesson.findByIdAndDelete(lessonId);
    module.save();
    
  } catch (error) {
    throw new Error(error);
  }
}


export async function getLessonBySlug(slug){
  try{
    const lesson = await Lesson.findOne({slug:slug}).lean()
    return replaceMongoIdInObject(lesson)
  }catch(error){
    throw new Error(error)
  }
}