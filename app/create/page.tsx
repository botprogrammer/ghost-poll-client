"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import Button from "@/components/ui/button";
import { createPoll } from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const pollSchema = z.object({
  question: z.string().min(1, { message: "Question is required" }),
  options: z
    .array(
      z.object({ value: z.string().min(1, { message: "Option is required" }) }),
    )
    .min(2, { message: "Minimum two options are required" })
    .max(10, { message: "Maximum ten options are allowed" }),
  expiresAt: z.enum(["3600", "43200", "86400"]),
  hideResults: z.boolean().default(false),
});

type PollSchemaType = z.infer<typeof pollSchema>;

export default function CreatePoll() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PollSchemaType>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: "",
      options: [{ value: "" }, { value: "" }],
      expiresAt: "3600",
      hideResults: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const addOption = () => {
    append({ value: "" });
  };

  const removeOption = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: PollSchemaType) => {
    setIsSubmitting(true);

    try {
      console.log(data);

      const res = await createPoll(data);
      console.log(res);

      setIsSubmitting(false);

      const { slug } = res?.data;

      router.push(`/poll/${slug}`);
    } catch (error) {
      console.error("Failed to create poll:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-4">
        <Link
          href="/"
          className="flex items-center text-sm transition-colors hover:text-gray-800 dark:hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          Back to home
        </Link>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Create a New Poll</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your poll will be accessible via a unique link and will expire
            automatically.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <label htmlFor="question" className="block text-sm font-medium">
                Question
              </label>
              <textarea
                id="question"
                placeholder="What do you want to ask?"
                className="focus:border-primary focus:ring-primary min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                {...register("question")}
              />
              {errors.question && (
                <p className="text-sm text-red-600/70">
                  {errors.question.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Options</label>
              {fields.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="focus:border-primary focus:ring-primary h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                    {...register(`options.${index}.value` as const)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => removeOption(index)}
                    disabled={fields.length <= 2}
                    className="inline-flex items-center justify-center rounded-md focus:outline-none disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove option</span>
                  </Button>
                </div>
              ))}
              {errors.options && errors.options.message && (
                <p className="text-sm text-red-600/70">
                  {errors.options.message}
                </p>
              )}
              {errors.options &&
                errors.options[0] &&
                errors.options[0].value &&
                errors.options[0].value?.message && (
                  <p className="text-sm text-red-600/70">
                    {errors.options[0].value?.message}
                  </p>
                )}
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                disabled={fields.length >= 10}
                className="B inline-flex w-full items-center justify-center px-4 py-2 text-sm font-medium shadow-sm focus:outline-none disabled:opacity-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Poll Duration</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <input
                    type="radio"
                    id="1hour"
                    value="3600"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    {...register("expiresAt")}
                  />
                  <label htmlFor="1hour" className="flex-1 text-sm">
                    1 hour
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <input
                    type="radio"
                    id="12hours"
                    value="43200"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    {...register("expiresAt")}
                  />
                  <label htmlFor="12hours" className="flex-1 text-sm">
                    12 hours
                  </label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <input
                    type="radio"
                    id="24hours"
                    value="86400"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    {...register("expiresAt")}
                  />
                  <label htmlFor="24hours" className="flex-1 text-sm">
                    24 hours
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors dark:bg-gray-800">
                <input
                  type="checkbox"
                  id="hide-results"
                  className="peer sr-only"
                  {...register("hideResults")}
                />
                <span className="peer-checked:bg-primary inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition-transform peer-checked:translate-x-6" />
                <label
                  htmlFor="hide-results"
                  className="absolute inset-0 cursor-pointer rounded-full"
                />
              </div>
              <label htmlFor="hide-results" className="text-sm font-medium">
                Hide results until poll expires
              </label>
            </div>
          </div>
          <div className="border-t p-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
