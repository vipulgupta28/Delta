import React from "react";
import { PageLayout } from "../components/layout";
import Happening from "../components/features/posts/Happening";

const HappeningsPage: React.FC = () => {
  return (
    <PageLayout>
      <Happening />
    </PageLayout>
  );
};

export default HappeningsPage;