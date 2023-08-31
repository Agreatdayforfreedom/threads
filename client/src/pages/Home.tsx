import React, { useEffect, useState } from "react";
import ThreadForm from "../components/ThreadForm";
import ThreadSection from "../components/ThreadSection";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }, []);

  return (
    <main>
      <ThreadSection />
    </main>
  );
};

export default Home;
