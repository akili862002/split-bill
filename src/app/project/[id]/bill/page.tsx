import prisma from "@/lib/prisma";
import { WriteBillPage } from "./write-bill.share";

export default async function AddBillPage({ params }) {
  const users = await prisma.user.findMany({
    where: {
      projectId: {
        equals: params.id,
      },
    },
  });

  return <WriteBillPage users={users} projectId={params.id} />;
}
