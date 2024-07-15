"use client";

import { BaseSelectDefaultStyle } from "@/components/SelectDefaultStyle";
import { Page, PageSection } from "@/layouts/Page";
import { Project, User } from "@prisma/client";
import { useState } from "react";

interface IPayPageProps {
  users: User[];
  project: Project;
}

export const PayPage: React.FC<IPayPageProps> = ({ project, users = [] }) => {
  const [selected, setSelected] = useState<string>("");

  return (
    <Page title="Chia tiền peer-to-peer" size="sm">
      <PageSection title="Đối tượng">
        <BaseSelectDefaultStyle
          value={selected}
          options={users.map((usr) => ({
            label: usr.fullName,
            value: usr.id,
          }))}
          onChange={setSelected}
        />
      </PageSection>
      {}
    </Page>
  );
};
