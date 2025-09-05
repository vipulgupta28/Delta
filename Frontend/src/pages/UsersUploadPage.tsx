import React from "react";
import { PageLayout } from "../components/layout";
import UsersUploads from "../components/features/profile/UsersUploads";

const UsersUploadPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="mt-10">
        <UsersUploads />
      </div>
    </PageLayout>
  );
};

export default UsersUploadPage;
