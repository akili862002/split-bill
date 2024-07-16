import { Avatar, Avatars } from "@/components/Avatars";
import { Page, PageGrid, PageSection } from "@/layouts/Page";
import prisma from "@/lib/prisma";
import { cn } from "@/utils/cn.util";
import { prettyDate } from "@/utils/date.util";
import { paths } from "@/utils/paths.util";
import { toPrice } from "@/utils/price.util";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export default async function ProjectPage({ params }) {
  const project = await prisma.project.findFirst({
    where: {
      id: params.id,
    },
    include: {
      users: true,
      bills: {
        orderBy: { issueAt: "desc" },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!project) return notFound();

  return (
    <Page
      title={project.name}
      size="md"
      backLink="/"
      primaryAction={{
        content: "Chia tiền peer-to-peer",
        url: paths.pay(params.id),
      }}
    >
      <PageGrid
        left={
          <PageSection
            title="Hóa đơn"
            actions={[
              {
                content: "Thêm hóa đơn",
                url: paths.addBill(params.id),
              },
            ]}
          >
            {!project.bills?.length ? (
              <div className="text-neutral-500">Chưa có hóa đơn nào</div>
            ) : (
              <ul className="space-y-2">
                {project.bills.map((bill, index) => {
                  const total = bill.members.reduce(
                    (acc, member) => acc + member.amount,
                    0
                  );

                  const isDifferentDay =
                    index > 0 &&
                    prettyDate(bill.issueAt) !==
                      prettyDate(project.bills[index - 1].issueAt);

                  const payer = bill.members.find((mb) => mb.isPayer).user;

                  return (
                    <Fragment key={bill.id}>
                      {(index === 0 || isDifferentDay) && (
                        <div
                          className={cn(
                            "font-semibold text-xl !mb-2",
                            isDifferentDay && "!mt-6"
                          )}
                        >
                          {prettyDate(bill.issueAt)}
                        </div>
                      )}
                      <Link
                        href={paths.editBill(params.id, bill.id)}
                        className="block"
                      >
                        <li className="py-2 px-4 border rounded-lg bg-neutral-50">
                          <div className="flex w-full">
                            <div className="flex-1">
                              <h4 className="font-semibold">{bill.name}</h4>
                              <div>
                                {prettyDate(bill.issueAt, "dddd, DD MMMM")}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <span className="font-semibold text-xl">
                                {toPrice(total)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex gap-3">
                            <Avatar
                              user={payer}
                              tooltip={payer.fullName + " (người trả)"}
                            />
                            <Avatars
                              users={bill.members
                                .filter((mb) => !mb.isPayer)
                                .map((mb) => mb.user)}
                            />
                          </div>
                        </li>
                      </Link>
                    </Fragment>
                  );
                })}
              </ul>
            )}
          </PageSection>
        }
        right={
          <PageSection
            title="Thành viên"
            actions={[
              {
                content: "Thêm thành viên",
                url: paths.addUser(params.id),
              },
            ]}
          >
            {!project.users.length ? (
              <div className="text-neutral-500">Chưa có thành viên nào</div>
            ) : (
              <ul className="divide-y">
                {project.users.map((user) => (
                  <li className="flex items-center py-2 gap-3">
                    <img
                      src={user.avatar}
                      className="icon-lg flex-shrink-0 bg-neutral-100 rounded-full object-cover"
                      alt={user.fullName}
                    />
                    <div>
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="text-neutral-500 text-xs">
                        {user.email || user.phone || user.id}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>
        }
      />
    </Page>
  );
}
