"use client";

import { Button } from "@/components/Button";
import { FormikForm } from "@/components/FormikForm";
import { TextField } from "@/components/TextField";
import { Page, PageGrid } from "@/layouts/Page";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePRouter } from "@/hooks/usePRouter.hook";
import { paths } from "@/utils/paths.util";
import {
  createBillAction,
  deleteBillAction,
  updateBillAction,
} from "./add-bill.action";
import { SimpleDatePicker } from "@/components/SimpleDatePicker";
import { Bill, BillMember, User } from "@prisma/client";
import { NumericFormat } from "@/components/NumericFormat";
import { SimpleTable } from "@/components/SimpleTable";
import { Checkbox } from "@/components/Checkbox";
import { TrashIcon } from "@/icons/common.icons";
import { toPrice } from "@/utils/price.util";
import { prettyDate } from "@/utils/date.util";
import { cn } from "@/utils/cn.util";

export function WriteBillPage({
  projectId,
  editBill,
  users,
}: {
  projectId: string;
  users: User[];
  editBill?: Bill & {
    members: BillMember[];
  };
}) {
  const [initValues, setInitValues] = useState({
    name: editBill?.name,
    description: editBill?.description,
    issueAt: editBill?.issueAt || new Date(),
    amount: editBill
      ? editBill.members.reduce((acc, mb) => acc + mb.amount, 0)
      : undefined,
    members: editBill
      ? editBill.members
      : (users.map((usr) => ({
          user: usr,
          isPayer: false,
          amount: 0,
          isCustom: false,
        })) as {
          user: User;
          isPayer: boolean;
          amount: number;
          isCustom: boolean;
        }[]),
  });

  const [loading, setLoading] = useState(false);
  const router = usePRouter();

  const BACK_LINK = paths.project(projectId);

  const handleSubmit = async (values: typeof initValues) => {
    const hasPayer = values.members.some((mb) => mb.isPayer);
    if (!hasPayer) {
      toast.error("Chưa chọn người trả tiền");
      return;
    }

    setLoading(true);

    const data = {
      name: values.name,
      projectId: projectId,
      issueAt: values.issueAt,
      billMembers: values.members.map((mb) => ({
        isPayer: mb.isPayer,
        userId: mb.user.id,
        amount: mb.amount,
        isCustom: mb.isCustom,
      })),
    };

    try {
      let result = null;

      if (!editBill) {
        result = await createBillAction(data);
      } else {
        result = await updateBillAction({
          id: editBill.id,
          data,
        });
      }

      if (result.serverError) throw new Error(result.serverError);
      if (result.validationErrors) throw new Error("Lỗi trường dữ liệu");

      toast.success("Tạo thành công!");
      router.push(BACK_LINK);
    } catch (error) {
      toast.error(error.message, {
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const isOK = confirm("Bạn có chắc muốn xóa bill?");
    if (!isOK) return;

    await deleteBillAction({
      id: editBill.id,
    });
    toast.success("Xóa thành công!");
    router.push(BACK_LINK);
  };

  return (
    <FormikForm
      initValues={initValues}
      onSubmit={handleSubmit}
      yupSchema={(yup) => ({
        name: yup.string().required(),
        amount: yup
          .number()
          .required()
          .min(1000)
          .test({
            // write test to make sure sum of members amount is equal to total amount
            name: "amount",
            message: "Tổng tiền không khớp với tổng tiền của các thành viên",
            test: (value, ctx) => {
              const totalMemberAmount = ctx.parent.members.reduce(
                (acc, mb) => acc + mb.amount,
                0
              );
              return Math.abs(totalMemberAmount - value) < 3;
            },
          }),
        issueAt: yup.date().required(),
        members: yup.array().min(2),
      })}
    >
      {({ fieldProps, values, setFieldValue }) => {
        useEffect(() => {
          calcEachAmount();
        }, [values.amount]);

        const calcEachAmount = () => {
          const customMembers = values.members.filter((mb) => mb.isCustom);
          const totalCustomAmount = customMembers.reduce(
            (acc, mb) => acc + mb.amount,
            0
          );

          values.members.forEach((mb) => {
            if (!mb.isCustom) {
              mb.amount =
                (values.amount - totalCustomAmount) /
                (values.members.length - customMembers.length);
            }
          });

          setFieldValue("members", values.members);
        };

        return (
          <Page
            title={editBill ? `Bill: ${editBill.name}` : "Thêm hóa đơn"}
            backLink={BACK_LINK}
          >
            <PageGrid
              left={
                <Page.Section>
                  <>
                    <TextField
                      {...fieldProps.name}
                      label="Tên hóa đơn"
                      placeholder="e.g: Đi chơi sở thú"
                    />
                    <SimpleDatePicker
                      {...fieldProps.issueAt}
                      label="Ngày thanh toán"
                    />
                    <NumericFormat
                      {...fieldProps.amount}
                      label="Tổng tiền"
                      allowNegative={false}
                      decimalScale={0}
                      prefix="VND "
                      placeholder="VND"
                    />
                    <div className="!mt-6">
                      <SimpleTable
                        headings={[
                          "Người mua",
                          "Người trả tiền",
                          "Custom",
                          "Số tiền",
                          "",
                        ]}
                        columnContentTypes={["text", "text", "text", "numeric"]}
                        rows={values.members.map((mb, index) => [
                          mb.user.fullName,
                          <input
                            type="radio"
                            checked={mb.isPayer}
                            onClick={(e) => {
                              if (e.currentTarget.checked) {
                                values.members.forEach(
                                  (m) => (m.isPayer = false)
                                );
                                values.members[index].isPayer = true;
                                setFieldValue(`members`, values.members);
                              }
                            }}
                          />,
                          <Checkbox
                            name={`members.${index}.isCustom`}
                            required
                            label=""
                          />,
                          <NumericFormat
                            name={`members.${index}.amount`}
                            required
                            allowNegative={false}
                            decimalScale={0}
                            prefix="VND "
                            placeholder="VND"
                            disabled={!mb.isCustom}
                            onBlur={() => {
                              calcEachAmount();
                            }}
                          />,
                          <button
                            type="button"
                            onClick={() => {
                              values.members.splice(index, 1);
                              setFieldValue(`members`, values.members);
                              calcEachAmount();
                            }}
                          >
                            <TrashIcon className="icon-sm text-neutral-400 hover:text-black" />
                          </button>,
                        ])}
                      />
                    </div>

                    <div className="flex gap-2 !mt-6">
                      <Button loading={loading} className="" type="submit">
                        Lưu hóa đơn
                      </Button>
                      {editBill && (
                        <Button variant="outline" onClick={handleDelete}>
                          Xóa bill
                        </Button>
                      )}
                    </div>
                  </>
                </Page.Section>
              }
              right={
                <Page.Section title="Hóa đơn">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-3 font-semibold">
                      <div>{values.name}</div>
                      <div className="font-normal text-[13px]">
                        {prettyDate(values.issueAt)}
                      </div>
                    </div>
                    <div>
                      <ul className="">
                        {values.members.map((mb, index) => (
                          <li
                            key={mb}
                            className={cn(
                              "w-full flex justify-between items-center px-3 py-1.5"
                            )}
                          >
                            <div
                              className={cn(
                                "",
                                mb.isPayer &&
                                  "border-b border-dashed border-neutral-500"
                              )}
                            >
                              {mb.user.fullName}
                            </div>
                            <div className="font-semibold">
                              {toPrice(mb.amount)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 border-t border-dashed mt-2 bg-neutral-50 flex font-semibold justify-end w-full text-xl">
                      <div>
                        {toPrice(
                          values.members.reduce((acc, mb) => acc + mb.amount, 0)
                        )}
                      </div>
                    </div>
                  </div>
                </Page.Section>
              }
            />
          </Page>
        );
      }}
    </FormikForm>
  );
}
