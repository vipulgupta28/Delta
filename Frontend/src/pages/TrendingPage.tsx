import React from "react";
import { PageLayout } from "../components/layout";
import Trending from "../components/features/posts/Trending";

const TrendingPage: React.FC = () => {
  return (
    <PageLayout>
      <Trending />
    </PageLayout>
  );
};

export default TrendingPage;