import React from "react";
import { PageLayout } from "../components/layout";
import DebateRooms from "../components/features/posts/DebateRooms";

const DebateRoomsPage: React.FC = () => {
  return (
    <PageLayout>
      <div className="mt-10">
        <DebateRooms />
      </div>
    </PageLayout>
  );
};

export default DebateRoomsPage;
