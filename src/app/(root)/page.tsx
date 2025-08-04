import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Overflow | Home",
  description:
    "Discover different programming questions and answers with recommendations from the community.",
};

const Home = () => {
  return (
    <>
      <h1 className="font-inter font-bold text-3xl underline">Hello world!</h1>
    </>
  );
};

export default Home;
