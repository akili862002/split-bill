"use client";

import { Button } from "@/components/Button";
import { FormikForm } from "@/components/FormikForm";
import { SimpleDatePicker } from "@/components/SimpleDatePicker";
import { TextField } from "@/components/TextField";
import { Page } from "@/layouts/Page";
import dayjs from "dayjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { createProjectAction } from "./add-project.action";
import { usePRouter } from "@/hooks/usePRouter.hook";

export default function AddProjectPage() {
  const [initValues] = useState({
    name: "",
    fromDate: new Date() as Date,
    toDate: new Date() as Date,
  });
  const [loading, setLoading] = useState(false);
  const router = usePRouter();

  const handleSubmit = async (values: typeof initValues) => {
    setLoading(true);

    try {
      const result = await createProjectAction({
        name: values.name,
        fromDate: values.fromDate,
        toDate: values.toDate,
      });

      if (result.serverError) throw new Error(result.serverError);
      if (result.validationErrors) throw new Error("Lỗi trường dữ liệu");

      toast.success("Tạo thành công!");
      router.push("/");
    } catch (error) {
      toast.error(error.message, {
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Thêm nhóm chia tiền" size="sm" backLink="/">
      <Page.Section>
        <FormikForm
          initValues={initValues}
          onSubmit={handleSubmit}
          yupSchema={(yup) => ({
            name: yup.string().required("Tên nhóm không được để trống"),
          })}
        >
          {({ fieldProps, values }) => (
            <>
              <TextField
                {...fieldProps.name}
                label="Tên nhóm"
                placeholder="e.g: Đà Lạt 12/7 - 14/7"
              />
              <SimpleDatePicker
                {...fieldProps.fromDate}
                label="Từ ngày"
                maxDate={values.toDate || dayjs().add(1, "year").toDate()}
              />
              <SimpleDatePicker
                {...fieldProps.toDate}
                label="Đến ngày"
                minDate={values.fromDate}
                maxDate={dayjs().add(1, "year").toDate()}
              />

              <Button loading={loading} className="!mt-4" type="submit">
                Thêm nhóm
              </Button>
            </>
          )}
        </FormikForm>
      </Page.Section>
    </Page>
  );
}
