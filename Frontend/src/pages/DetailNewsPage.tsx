import React from "react";
import { PageLayout } from "../components/layout";
import LongVideos from "../components/features/videos/LongVideos";

const DetailNewsPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="mt-10">
        <LongVideos />
      </div>
    </PageLayout>
  );
};

export default DetailNewsPage;
