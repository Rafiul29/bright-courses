"use server";

import { Quizset } from "@/models/quizset-model";
import { createQuiz } from "@/queries/quizzes";

export async function updateQuizSet(id, dataToUpdate) {
  try {
    await Quizset.findByIdAndUpdate(id, dataToUpdate);
  } catch (error) {
    throw new Error(error);
  }
}

export async function addQuizToQuizSet(quizSetId, quizData) {
  try {
    const createdQuizId = await createQuiz(quizData);

    const quizSet = await Quizset.findById(quizSetId);
    quizSet.quizIds.push(createdQuizId);
    quizSet.save();
  } catch (error) {
    throw new Error(error);
  }
}

export async function doCreateQuizSet(data) {
  try {
    const createQuizSet = await Quizset.create(data);
    return createQuizSet?._id.toString();
  } catch (error) {
    throw new Error(error);
  }
}


