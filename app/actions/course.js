"use server";

import { getLoggedInUser } from "@/lib/getLoggedInUser";
import { Course } from "@/models/course-model";
import mongoose from "mongoose";

const { create } = require("@/queries/courses");

export async function createCourse(data) {
  try {
    const loggedInUser = await getLoggedInUser();
    data["instructor"] = loggedInUser.id;
    const course = await create(data);
    return course;
  } catch (e) {
    throw new Error(e); // Corrected error throwing
  }
}

export async function updateCourse(courseId, dataToUpdate) {
  try {
    await Course.findByIdAndUpdate(courseId, dataToUpdate);
  } catch (error) {
    throw new Error(error);
  }
}

export async function changeCoursePublishedState(courseId) {
  try {
    const course = await Course.findById(courseId);
    const res = await Course.findByIdAndUpdate(
      courseId,
      { active: !course?.active },
      { lean: true }
    );
    return res?.active;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteCourse(courseId) {
  try {
    const module = await Course.findByIdAndDelete(courseId);
  } catch (error) {
    throw new Error(error);
  }
}



export async function updateQuizSetForCourse(courseId,dataToUpdate){
  try{
    console.log(dataToUpdate)
    const data={}
    data['quizSet']= new mongoose.Types.ObjectId(dataToUpdate.quizSetId)
    await Course.findByIdAndUpdate(courseId, data);
  }catch(error){
    console.log(error)
    throw new Error(error)
  }
}