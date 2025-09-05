import React from "react";
import { PageLayout } from "../layout";
import { VideoSpace } from "../features/videos";

const Layout: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex items-center justify-center h-full">
        <VideoSpace />
      </div>
    </PageLayout>
  );
};

export default Layout;
