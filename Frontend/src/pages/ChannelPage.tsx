import React from "react";
import { PageLayout } from "../components/layout";
import Channel from "../components/features/channels/Channel";

const ChannelPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex justify-center">
        <Channel />
      </div>
    </PageLayout>
  );
};

export default ChannelPage;
