import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "../Metric";

interface Props {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, tags, author, upvotes, views, answers, createdAt },
}: Props) => {
  return (
    <div className="px-11 sm:px-11 py-9 rounded-2xl card-wrapper">
      <div className="flex sm:flex-row flex-col-reverse justify-between items-start gap-5">
        <div className="flex-1">
          <span className="flex-sm:hidden text-dark400_light700 line-clamp-1 subtle-regular">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="flex-1 text-dark200_light900 line-clamp-1 sm:h3-semibold base-semibold">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3.5 w-full">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <div className="flex-wrap flex-between gap-3 w-full mt6">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex max-sm:flex-wrap max-sm:justify-start items-center gap-3">
          <Metric
            imgUrl="/icons/like.svg"
            alt="likes"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="message"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
