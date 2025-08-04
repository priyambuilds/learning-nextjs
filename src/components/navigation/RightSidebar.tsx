import React from "react";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "How do I use express as a custom server in NextJS?" },
  { _id: "2", title: "Cascading Deletes in SQLAlchemy?" },
  { _id: "3", title: "How to perfectly center a div with Tailwind CSS?" },
  {
    _id: "4",
    title: "Best practices for data fetching in a Next.js application",
  },
  { _id: "5", title: "Redux Toolkit Not Updating State as Expected" },
];

const popularTags = [
  { _id: "1", name: "javascript", questions: 5 },
  { _id: "2", name: "react", questions: 5 },
  { _id: "3", name: "nextjs", questions: 5 },
  { _id: "4", name: "typescript", questions: 2 },
  { _id: "5", name: "react-query", questions: 2 },
];

const RightSidebar = () => {
  return (
    <section className="max-xl:hidden top-0 right-0 sticky flex flex-col gap-6 shadow-light-300 dark:shadow-none p-6 pt-36 light-border border-l w-[350px] h-screen overflow-y-auto custom-scrollbar background-light900_dark200">
      <div>
        <h3 className="text-dark200_light900 h3-bold">Top Questions</h3>
        <div className="flex flex-col gap-[30px] mt-7">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              href={ROUTES.PROFILE(_id)}
              key={_id}
              className="flex justify-between items-center gap-7 cursor-pointer"
            >
              <p className="text-dark500_light700 body-medium">{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="text-dark200_light900 h3-bold">Popular Tags</h3>
        <div className="flex flex-col gap-4 mt-7">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
