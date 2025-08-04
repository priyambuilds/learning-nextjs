import React from "react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/components/search/LocalSearch";

export const metadata: Metadata = {
  title: "Dev Overflow | Home",
  description:
    "Discover different programming questions and answers with recommendations from the community.",
};

const Home = async () => {
  return (
    <>
      <section className="flex sm:flex-row flex-col-reverse justify-between sm:items-center gap-4 w-full">
        <h1 className="text-dark100_light900 h1-bold">ALl Questions</h1>
        <Button
          className="px-4 py-3 min-h-[46px] !text-light-900 primary-gradient"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </section>
      HomeFilter
      <div className="flex flex-col gap-6 mt-10 w-full">
        <p>Question Card 1</p>
        <p>Question Card 2</p>
        <p>Question Card 1</p>
        <p>Question Card 2</p>
        <p>Question Card 1</p>
        <p>Question Card 2</p>
      </div>
    </>
  );
};

export default Home;
