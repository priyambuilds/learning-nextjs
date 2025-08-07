import React from "react";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  const content = (
    <>
      <Badge className="flex flex-row gap-2 px-4 py-2 border-none rounded-md text-light400_light500 uppercase subtle-medium background-light800_dark300">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            alt="close"
            width={12}
            height={12}
            className="dark:invert invert-0 object-contain cursor-pointer"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && (
        <p className="text-dark500_light700 small-medium">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {content}
      </button>
    ) : (
      <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        {content}
      </Link>
    );
  }
};

export default TagCard;
