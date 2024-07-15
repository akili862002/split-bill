"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { paths } from "@/utils/paths.util";
import { generateAvatar } from "@/utils/avatar.util";

const schema = z.object({
  fullName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  projectId: z.string(),
});

export const createUserAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { fullName, email, phone, projectId } }) => {
    const user = await prisma.user.create({
      data: {
        id:
          slugify(fullName, {
            locale: "vi",
            lower: true,
          }) +
          "-" +
          Date.now(),
        fullName,
        email,
        phone,
        project: {
          connect: { id: projectId },
        },
        avatar: generateAvatar(fullName),
      },
    });

    revalidatePath(paths.project(projectId));
    revalidatePath("/");

    return user;
  });
