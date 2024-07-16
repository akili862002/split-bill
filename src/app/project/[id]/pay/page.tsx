import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PayPage } from "./pay";

export default async function ({ params }) {
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
    },
    include: {
      users: true,
    },
  });
  const bills = await prisma.bill.findMany({
    include: {
      members: true,
    },
    orderBy: {
      issueAt: "desc",
    },
  });

  if (!project) return notFound();

  return <PayPage users={project.users} project={project} bills={bills} />;
}
