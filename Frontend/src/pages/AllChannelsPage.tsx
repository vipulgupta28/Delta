import React from "react";
import { PageLayout } from "../components/layout";
import { AllChannels } from "../components/features/channels";

const AllChannelsPage: React.FC = () => {
  return (
    <PageLayout>
      <AllChannels />
    </PageLayout>
  );
};

export default AllChannelsPage;