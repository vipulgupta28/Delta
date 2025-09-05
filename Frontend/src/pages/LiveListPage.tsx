import React from "react";
import { PageLayout } from "../components/layout";
import LiveNowList from "../components/features/live/LiveNowList";

const LiveListPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="mt-10">
        <LiveNowList />
      </div>
    </PageLayout>
  );
};

export default LiveListPage;
