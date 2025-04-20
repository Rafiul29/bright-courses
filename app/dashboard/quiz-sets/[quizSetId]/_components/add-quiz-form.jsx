"use client";

import * as z from "zod";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getSlug } from "@/lib/convertData";
import { addQuizToQuizSet } from "@/app/actions/quizzes";

const formSchema = z.object({
  title: z
    .string({
      required_error: "Question is required",
    })
    .min(1, {
      message: "Title is required",
    }),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, {
      message: "Description is required",
    }),
  // explanations: z
  // .string({
  //   required_error: "Explanations is required",
  // })
  // .min(1, {
  //   message: "Explanations is required",
  // }),
  optionA: z.object({
    text: z
      .string({
        required_error: "Option label is required",
      })
      .min(1, {
        message: "Option label is required",
      }),
    is_correct: z.boolean().default(false),
  }),
  optionB: z.object({
    text: z
      .string({
        required_error: "Option label is required",
      })
      .min(1, {
        message: "Option label is required",
      }),
    is_correct: z.boolean().default(false),
  }),
  optionC: z.object({
    text: z
      .string({
        required_error: "Option label is required",
      })
      .min(1, {
        message: "Option label is required",
      }),
    is_correct: z.boolean().default(false),
  }),
  optionD: z.object({
    text: z
      .string({
        required_error: "Option label is required",
      })
      .min(1, {
        message: "Option label is required",
      }),
    is_correct: z.boolean().default(false),
  }),
});

export const AddQuizForm = ({ quizSetId }) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      explanations: "",
      optionA: {
        text: "",
        is_correct: false,
      },
      optionB: {
        text: "",
        is_correct: false,
      },
      optionC: {
        text: "",
        is_correct: false,
      },
      optionD: {
        text: "",
        is_correct: false,
      },
    },
  });

  const { isSubmitting, isValid, errors } = form.formState;
  console.log(errors);

  const onSubmit = async (values) => {
    try {
      console.log({ values });

      const structuredQuiz = {
        title: values.title,
        description: values.description,
        explanations: values.explanations,
        slug:getSlug(values.title),
        options: [
          values.optionA,
          values.optionB,
          values.optionC,
          values.optionD,
        ],
      };
      const correctMarked = structuredQuiz.options.filter(
        (op) => op.is_correct
      );
      const isOneCorrecrMarked = correctMarked.length === 1;
      if (isOneCorrecrMarked) {
        // Call server action
        await addQuizToQuizSet(quizSetId, structuredQuiz);
        // Reset the form
 
        // setQuizes((prevQuizes) => [...prevQuizes, structuredQuiz]);
        form.reset({
          title: "",
          description: "",
          explanations: "",
          optionA: {
            text: "",
            is_correct: false,
          },
          optionB: {
            text: "",
            is_correct: false,
          },
          optionC: {
            text: "",
            is_correct: false,
          },
          optionD: {
            text: "",
            is_correct: false,
          },
        });
        // toggleEdit();
        router.refresh();
        toast.success("Quizz added ");
      } else {
        toast.error("You must mark only one correct answer.");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Add New Quiz
      </div>

      {
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* quiz title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Enter quiz question"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* quiz description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Enter quiz description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* quiz e */}
            <FormField
              control={form.control}
              name="explanations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Explanations</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Enter quiz explanations"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --------------- OPTION A -------- */}
            <div className="space-y-3">
              <FormLabel>Option A</FormLabel>
              <div className="flex items-start gap-3">
                <FormField
                  control={form.control}
                  name="optionA.is_correct"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  {/* option label  */}
                  <FormField
                    control={form.control}
                    name="optionA.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter quiz question"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* --------------- OPTION A ENDS -------- */}

            {/* --------------- OPTION B -------- */}
            <div className="space-y-3">
              <FormLabel>Option B</FormLabel>
              <div className="flex items-start gap-3">
                <FormField
                  control={form.control}
                  name="optionB.is_correct"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  {/* option label  */}
                  <FormField
                    control={form.control}
                    name="optionB.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter quiz question"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* --------------- OPTION B ENDS -------- */}

            {/* --------------- OPTION C -------- */}
            <div className="space-y-3">
              <FormLabel>Option C</FormLabel>
              <div className="flex items-start gap-3">
                <FormField
                  control={form.control}
                  name="optionC.is_correct"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  {/* option label  */}
                  <FormField
                    control={form.control}
                    name="optionC.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter quiz question"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* --------------- OPTION C ENDS -------- */}

            {/* --------------- OPTION D -------- */}
            <div className="space-y-3">
              <FormLabel>Option D</FormLabel>
              <div className="flex items-start gap-3">
                <FormField
                  control={form.control}
                  name="optionD.is_correct"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex-1">
                  {/* option label  */}
                  <FormField
                    control={form.control}
                    name="optionD.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter quiz question"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* --------------- OPTION D ENDS -------- */}
            <div className="flex items-center justify-end gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      }
    </div>
  );
};
