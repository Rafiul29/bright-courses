import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { Quizset } from "@/models/quizset-model";
import { Quiz } from "@/models/quizzes-model";

export async function getAllQuizSets(excludeUnPublished) {
  try {
    let quizSets = [];
    if (excludeUnPublished) {
      quizSets = await Quizset.find({active:true}).lean();
    } else {
      quizSets = await Quizset.find().lean();
    }

    return replaceMongoIdInArray(quizSets);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getQuizSetById(id) {
  try {
    const quiz = await Quizset.findById(id)
      .populate({ path: "quizIds", model: Quiz })
      .lean();
    return replaceMongoIdInObject(quiz);
  } catch (error) {
    throw new Error(error);
  }
}

export async function createQuiz(quizData) {
  try {
    const quiz = await Quiz.create(quizData);
    return quiz._id.toString();
  } catch (e) {
    throw new Error(e);
  }
}


export async function editQuiz(quizId, quizData) {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      quizData,
      { new: true } // returns the updated document
    ).lean();

    if (!updatedQuiz) throw new Error("Quiz not found");
    return updatedQuiz;
  } catch (error) {
    throw new Error(error);
  }
}


export async function deleteQuiz(quizId) {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) throw new Error("Quiz not found");
    return deletedQuiz._id.toString();
  } catch (error) {
    throw new Error(error);
  }
}
