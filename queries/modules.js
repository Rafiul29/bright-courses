import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/models/lesson.model";
import { Module } from "@/models/module.model";

export async function create(moduleData) {
  try {
    if (!moduleData) {
      throw new Error("Module data is required");
    }

    const data = await Module.create(moduleData)

    return data
  } catch (error) {
    console.error("Error creating module:", error);
    throw new Error(error); // Maintain original error stack
  }
}


export async function getModuleDetails(id) { 
  try {

    const moduleData = await Module.findById(id).populate({ path: "lessonIds", model: Lesson }).lean();
    return replaceMongoIdInObject(moduleData);
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}


export async function getModuleBySlug(slug){
  try{

    const moduleData = await Module.findOne({slug:slug}).lean()

    return replaceMongoIdInObject(moduleData)

  }catch(error){
    throw new Error(error)
  }
}