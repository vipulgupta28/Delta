import React from "react";
import { PageLayout } from "../components/layout";
import UsersProfile from "../components/features/profile/usersProfile";

const UsersProfilePage: React.FC = () => {
  return (
    <PageLayout>
      <div className="mt-10">
        <UsersProfile />
      </div>
    </PageLayout>
  );
};

export default UsersProfilePage;
