"use client";

import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({ route, imgSrc, placeholder, otherClasses }: Props) => {
  const searhParams = useSearchParams();
  const query = searhParams.get("query") || "";
  const [searchQuery, setSearchQuery] = React.useState(query);

  return (
    <div
      className={`flex items-center gap-4 px-4 rounded-[10px] min-h-[56px] background-light800_darkgradient grow ${otherClasses}`}
    >
      LocalSearch
      <Image
        src={imgSrc}
        alt="search"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        className="shadow-none border-none outline-none text-dark400_light700 paragraph-regular no-focus placeholder"
        onChange={(e) => setSearchQuery(e.target.value)}
      ></Input>
    </div>
  );
};

export default LocalSearch;
