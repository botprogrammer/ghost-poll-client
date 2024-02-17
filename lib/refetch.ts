"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function refetchData() {
  revalidateTag("poll");
  revalidatePath("/");
}
