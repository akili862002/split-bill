"use client";

import { BaseSelectDefaultStyle } from "@/components/SelectDefaultStyle";
import { Page, PageGrid, PageSection } from "@/layouts/Page";
import { Bill, BillMember, Project, User } from "@prisma/client";
import { useMemo, useState } from "react";
import { toPrice } from "@/utils/price.util";
import { paths } from "@/utils/paths.util";
import { SimpleTable } from "@/components/SimpleTable";
import { prettyDate } from "@/utils/date.util";
import Link from "next/link";
import ReactApexChart from "react-apexcharts";

interface IPayPageProps {
  project: Project;
  users: User[];
  bills: (Bill & { members: BillMember[] })[];
}

export const PayPage: React.FC<IPayPageProps> = ({
  project,
  users = [],
  bills = [],
}) => {
  const [selected, setSelected] = useState<string>("");

  const paybackUsers = users.filter((usr) => usr.id !== selected);

  return (
    <Page title="Chia tiền peer-to-peer" backLink={paths.project(project.id)}>
      <PageGrid
        className="md:!grid-cols-[1fr,2fr]"
        left={
          <>
            <PageSection title="">
              <BaseSelectDefaultStyle
                label="Tôi là"
                required
                value={selected}
                options={users.map((usr) => ({
                  label: usr.fullName,
                  value: usr.id,
                }))}
                onChange={setSelected}
              />
              {selected && <Analytics userId={selected} bills={bills} />}
            </PageSection>
          </>
        }
        right={
          <>
            {selected &&
              paybackUsers.map((user) => (
                <UserToPay
                  borrower={users.find((usr) => usr.id === selected)}
                  lender={user}
                  key={user.id + selected}
                  bills={bills}
                />
              ))}
          </>
        }
      ></PageGrid>
    </Page>
  );
};

type BillDetail = {
  payer: User;
  you: BillMember;
  bill: Bill & { members: BillMember[] };
};

export const UserToPay: React.FC<{
  borrower: User;
  lender: User;
  bills: (Bill & { members: BillMember[] })[];
}> = ({ lender, borrower, bills }) => {
  const billsYouMustPayBack: BillDetail[] = useMemo(() => {
    const billsYouMustPayBack = [];

    for (let bill of bills) {
      const you = bill.members.find((mb) => mb.userId === borrower.id);
      const he = bill.members.find((mb) => mb.userId === lender.id);

      if (you && he && !you.isPayer && he.isPayer)
        billsYouMustPayBack.push({
          payer: lender,
          you,
          bill,
        });
    }

    return billsYouMustPayBack;
  }, []);

  const billsHeMustPayBackToYou: BillDetail[] = useMemo(() => {
    const billsHeMustPayBack = [];

    for (let bill of bills) {
      const you = bill.members.find((mb) => mb.userId === borrower.id);
      const he = bill.members.find((mb) => mb.userId === lender.id);

      if (you && he && you.isPayer && !he.isPayer) {
        billsHeMustPayBack.push({
          payer: borrower,
          you,
          bill,
        });
      }
    }

    return billsHeMustPayBack;
  }, []);

  const totalBillYouMustPay = billsYouMustPayBack.reduce(
    (acc, curr) => acc + curr.you.amount,
    0
  );
  const totalBillHeMustPay = billsHeMustPayBackToYou.reduce(
    (acc, curr) => acc + curr.you.amount,
    0
  );

  const final = totalBillYouMustPay - totalBillHeMustPay;

  return (
    <PageSection noPadding title={lender.fullName}>
      <Page.SectionBlock
        className="px-4 py-2 border-t"
        title={`Bạn mượn tiền ${lender.fullName}`}
      >
        {!billsYouMustPayBack.length ? (
          <div className="text-neutral-500">(Trống)</div>
        ) : (
          <div>
            <SimpleTable
              headings={["Hóa đơn", "Ngày", "Số tiền"]}
              columnContentTypes={["text", "text", "numeric"]}
              rows={billsYouMustPayBack.map((bill) => [
                <Link
                  className="hover:underline"
                  href={paths.editBill(bill.bill.projectId, bill.bill.id)}
                  target="_blank"
                >
                  {bill.bill.name} ↗
                </Link>,
                prettyDate(bill.bill.issueAt, "dddd DD/MM"),
                <div className="font-semibold">{toPrice(bill.you.amount)}</div>,
              ])}
            />
            <div className="mt-2 w-full flex justify-end">
              <p className="">
                Tổng cộng:{" "}
                <span className="text-base font-semibold">
                  {toPrice(totalBillYouMustPay)}
                </span>
              </p>
            </div>
          </div>
        )}
      </Page.SectionBlock>
      <Page.SectionBlock
        className="px-4 py-2 border-t !mt-0"
        title={`${lender.fullName} mượn tiền bạn`}
      >
        {!billsHeMustPayBackToYou.length ? (
          <div className="text-neutral-500">(Trống)</div>
        ) : (
          <div>
            <SimpleTable
              headings={["Hóa đơn", "Ngày", "Số tiền"]}
              columnContentTypes={["text", "text", "numeric"]}
              rows={billsHeMustPayBackToYou.map((bill) => [
                <Link
                  className="hover:underline"
                  href={paths.editBill(bill.bill.projectId, bill.bill.id)}
                  target="_blank"
                >
                  {bill.bill.name} ↗
                </Link>,
                prettyDate(bill.bill.issueAt, "dddd DD/MM"),
                <div className="font-semibold">{toPrice(bill.you.amount)}</div>,
              ])}
            />
            <div className="mt-2 w-full flex justify-end">
              <p className="">
                Tổng cộng:{" "}
                <span className="text-base font-semibold">
                  {toPrice(totalBillHeMustPay)}
                </span>
              </p>
            </div>
          </div>
        )}
      </Page.SectionBlock>
      <div className="border-t px-4 pt-4 pb-2 !mt-0 flex justify-end w-full items-end gap-2 ">
        {final > 0 ? (
          <>
            <span className="text-base">Bạn phải trả {lender.fullName}</span>
            <div className="font-bold text-3xl">{toPrice(final)}</div>
          </>
        ) : (
          <div>
            <span className="text-base italic">
              {lender.fullName} phải trả bạn {toPrice(-final)}
            </span>
          </div>
        )}
      </div>
    </PageSection>
  );
};

const Analytics: React.FC<{
  bills: (Bill & { members: BillMember[] })[];
  userId: string;
}> = ({ bills, userId }) => {
  const billMembers = bills
    .flatMap((bill) => bill.members.map((mb) => ({ ...mb, bill })))
    .filter((mb) => mb.userId === userId);

  const totalExpense = billMembers.reduce((acc, curr) => acc + curr.amount, 0);

  const series = billMembers.map((mb: any) => mb.amount);
  const labels = billMembers.map((mb: any) => mb.bill.name);
  chartOptions.labels = labels;

  return (
    <Page.SectionBlock title="Thống kê chi tiêu">
      <div className="grid grid-cols-2 gap-y-1">
        <div>Chi tiêu:</div>
        <div>
          <div className="font-semibold">{toPrice(totalExpense)}</div>
        </div>
        <div>Số hóa đơn:</div>
        <div className="font-semibold">{billMembers.length}</div>
      </div>
      <div>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="polarArea"
          width={380}
        />
      </div>
    </Page.SectionBlock>
  );
};

const chartOptions: ApexCharts.ApexOptions = {
  chart: {
    width: 380,
    type: "polarArea",
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
    // position: "bottom",
  },
  tooltip: {},
  stroke: {
    colors: ["#fff"],
  },
  fill: {
    opacity: 0.8,
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 0,
      },
      spokes: {
        strokeWidth: 0,
      },
    },
  },
  // theme: {
  //   monochrome: {
  //     enabled: true,
  //     shadeTo: "light",
  //     shadeIntensity: 0.6,
  //   },
  // },
};
