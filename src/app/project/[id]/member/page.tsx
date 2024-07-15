"use client";

import { Button } from "@/components/Button";
import { FormikForm } from "@/components/FormikForm";
import { TextField } from "@/components/TextField";
import { Page } from "@/layouts/Page";
import { useState } from "react";
import toast from "react-hot-toast";
import { createUserAction } from "./add-user.action";
import { usePRouter } from "@/hooks/usePRouter.hook";
import { paths } from "@/utils/paths.util";
import { revalidatePath } from "next/cache";

export default function AddUserPage({ params }) {
  const [initValues] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const router = usePRouter();

  const BACK_LINK = paths.project(params.id);

  const handleSubmit = async (values: typeof initValues) => {
    setLoading(true);

    try {
      const result = await createUserAction({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        projectId: params.id,
      });

      console.log(result);
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

  return (
    <Page title="Thêm thành viên" size="sm" backLink={BACK_LINK}>
      <Page.Section>
        <FormikForm
          initValues={initValues}
          onSubmit={handleSubmit}
          yupSchema={(yup) => ({
            fullName: yup.string().required("Tên không được để trống"),
          })}
        >
          {({ fieldProps, values }) => (
            <>
              <TextField
                {...fieldProps.fullName}
                label="Họ và Tên"
                placeholder="e.g: Nguyễn Văn A"
              />
              <TextField
                {...fieldProps.email}
                label="Email"
                placeholder="e.g: a@example.com"
              />
              <TextField
                {...fieldProps.phone}
                label="Số điện thoại"
                placeholder="e.g: 0123456789"
              />
              <Button loading={loading} className="!mt-4" type="submit">
                Thêm thành viên
              </Button>
            </>
          )}
        </FormikForm>
      </Page.Section>
    </Page>
  );
}
