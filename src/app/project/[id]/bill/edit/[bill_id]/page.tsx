import prisma from "@/lib/prisma";
import { WriteBillPage } from "../../write-bill.share";

export default async function EditBillPage({ params }) {
  const users = await prisma.user.findMany();
  const bill = await prisma.bill.findFirst({
    where: {
      id: params.bill_id,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return <WriteBillPage users={users} projectId={params.id} editBill={bill} />;
}
