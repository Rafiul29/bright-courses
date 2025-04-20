import { replaceMongoIdInArray } from "@/lib/convertData";
import { Category } from "@/models/category-model"

export const getCategories=async()=>{
  const categories= await Category.find({}).lean();

  return replaceMongoIdInArray(categories)
}