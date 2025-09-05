import React from "react";
import { PageLayout } from "../components/layout";
import { Profile } from "../components/features/profile";

const ProfilePage: React.FC = () => {
  return (
    <PageLayout>
      <div className="mt-10">
        <Profile />
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
