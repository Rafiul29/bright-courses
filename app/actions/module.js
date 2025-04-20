"use server";

import { create } from "@/queries/modules";
import { Course } from "@/models/course-model";
import { Module } from "@/models/module.model";
import { ModuleTitleForm } from "@/lms-template/app/dashboard/courses/[courseId]/modules/[moduleId]/_components/module-title-form";
import mongoose from "mongoose";

export async function createModule(data) {
  try {
    const title = data.get("title");
    const slug = data.get("slug");
    const courseId = data.get("courseId");
    const order = data.get("order");
    const createdModule = await create({
      title,
      slug,
      course: courseId,
      slug,
      order,
    });
    const course = await Course.findById(courseId);
    course.modules.push(createdModule);
    await course.save();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function reOrderModule(data) {
  try {
    await Promise.all(
      data.map(async (element) => {
        await Module.findByIdAndUpdate(element.id, { order: element.position });
      })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateModule(moduleId, dataToUpdate) {
  try {
    await Module.findByIdAndUpdate(moduleId, dataToUpdate);
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}


export async function changeModulePublishedState(moduleId) {
  try {
    const module = await Module.findById(moduleId);
    const res = await Module.findByIdAndUpdate(
      moduleId,
      { active: !module?.active },
      { lean: true }
    );
    return res?.active; 
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteModule(moduleId, courseId) {
  try {
    const course = await Course.findById(courseId);
    course.modules.pull(new mongoose.Types.ObjectId(moduleId));
    const module = await Module.findByIdAndDelete(moduleId);
    course.save();
    
  } catch (error) {
    throw new Error(error);
  }
}
