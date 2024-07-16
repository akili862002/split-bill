"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { paths } from "@/utils/paths.util";

const schema = z.object({
  name: z.string(),
  billMembers: z.array(
    z.object({
      isPayer: z.boolean(),
      userId: z.string(),
      isCustom: z.boolean(),
      amount: z.number(),
    })
  ),
  projectId: z.string(),
  issueAt: z.date(),
});

export const createBillAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: input }) => {
    const bill = await prisma.bill.create({
      data: {
        name: input.name,
        issueAt: input.issueAt,
        project: {
          connect: { id: input.projectId },
        },
        members: {
          create: input.billMembers.map((billMember) => ({
            amount: billMember.amount,
            isPayer: billMember.isPayer,
            isCustom: billMember.isCustom,
            user: {
              connect: { id: billMember.userId },
            },
          })),
        },
      },
    });

    revalidatePath(paths.project(input.projectId));
    revalidatePath("/");

    return bill;
  });

const editBillSchema = z.object({
  id: z.string(),
  data: schema,
});

export const updateBillAction = actionClient
  .schema(editBillSchema)
  .action(async ({ parsedInput: { id, data: input } }) => {
    return await prisma.$transaction(async (prisma) => {
      const bill = await prisma.bill.update({
        where: {
          id,
        },
        data: {
          name: input.name,
          issueAt: input.issueAt,
          project: {
            connect: { id: input.projectId },
          },
        },
        include: {
          members: true,
        },
      });

      const deleteBillMembers = bill.members.filter(
        (mb) =>
          !input.billMembers.some((inputMb) => inputMb.userId === mb.userId)
      );

      await prisma.billMember.deleteMany({
        where: {
          billId: id,
          userId: {
            in: deleteBillMembers.map((mb) => mb.userId),
          },
        },
      });

      for (let mb of input.billMembers) {
        await prisma.billMember.upsert({
          where: {
            billId_userId: {
              userId: mb.userId,
              billId: id,
            },
          },
          update: {
            amount: mb.amount,
            isPayer: mb.isPayer,
            isCustom: mb.isCustom,
          },
          create: {
            amount: mb.amount,
            isPayer: mb.isPayer,
            isCustom: mb.isCustom,
            user: {
              connect: { id: mb.userId },
            },
            bill: {
              connect: { id },
            },
          },
        });
      }

      revalidatePath(paths.project(input.projectId));
      revalidatePath("/");

      return bill;
    });
  });

export const deleteBillAction = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    const bill = await prisma.bill.delete({
      where: {
        id,
      },
    });

    revalidatePath(paths.project(bill.projectId));
    revalidatePath("/");

    return bill;
  });
