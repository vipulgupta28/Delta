import React, { useState, useEffect } from "react";
import { PageLayout } from "../components/layout";
import UserPosts from "../components/features/posts/UserPosts";
import api from "../api/api";

const UserPostsPage: React.FC = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUserId(res.data.user.user_id);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <PageLayout>
      {userId && <UserPosts userId={userId} />}
    </PageLayout>
  );
};

export default UserPostsPage;