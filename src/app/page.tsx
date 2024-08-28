import { Avatars } from "@/components/Avatars";
import { AddLocationIcon } from "@/icons/common.icons";
import { Page, PageSection } from "@/layouts/Page";
import prisma from "@/lib/prisma";
import { prettyDate } from "@/utils/date.util";
import { paths } from "@/utils/paths.util";
import { toPrice } from "@/utils/price.util";
import { auth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import Link from "next/link";
dayjs.locale("vi");

export default async function Home() {
  const { userId } = auth();
  console.log({ userId });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: true,
      bills: {
        include: {
          members: {
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });

  return (
    <Page
      title={`Chia hóa đơn (${projects.length})`}
      subtitle="Công bằng, minh bạch, chính xác"
      size="sm"
    >
      {projects.map((project) => {
        const total = project.bills.reduce(
          (acc, bill) =>
            acc + bill.members.reduce((acc, member) => acc + member.amount, 0),
          0
        );

        return (
          <Link
            key={project.id}
            href={paths.project(project.id)}
            className="block"
          >
            <PageSection
              title={project.name}
              subtitle={project.fromDate && prettyDate(project.fromDate)}
            >
              <div className="flex justify-between w-full items-end">
                <div>
                  <Avatars users={project.users} />
                </div>
                <div className="font-semibold">
                  Tổng: <span className="text-lg">{toPrice(total)}</span>
                </div>
              </div>
            </PageSection>
          </Link>
        );
      })}
      <Link href={paths.addProject()} className="block">
        <button
          type="button"
          className="border w-full border-neutral-400 hover:bg-neutral-50 font-semibold  p-6 border-dashed flex items-center justify-center rounded-xl"
        >
          <div className="flex items-center flex-col gap-2">
            <AddLocationIcon className="icon-md" />
            <span>Thêm nhóm</span>
          </div>
        </button>
      </Link>
    </Page>
  );
}
