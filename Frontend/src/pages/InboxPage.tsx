import React from "react";
import { PageLayout } from "../components/layout";
import Inbox from "../components/features/interactions/Inbox";

const InboxPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex justify-center">
        <Inbox />
      </div>
    </PageLayout>
  );
};

export default InboxPage;
