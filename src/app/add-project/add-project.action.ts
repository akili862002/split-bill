"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const schema = z.object({
  name: z.string(),
  fromDate: z.date().nullable(),
  toDate: z.date().nullable(),
});

export const createProjectAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, fromDate, toDate } }) => {
    const project = await prisma.project.create({
      data: {
        id: slugify(name, {
          locale: "vi",
          lower: true,
        }),
        name,
        fromDate,
        toDate,
      },
    });

    revalidatePath("/");

    return project;
  });
