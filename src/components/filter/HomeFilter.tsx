"use client";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const filter = [
  { name: "Newest", value: "newest" },
  { name: "Recommended", value: "recommended" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = React.useState(filterParams || "");
  const handleClick = (filter: string) => {
    let newUrl = "";
    if (filter === active) {
      setActive("");
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="hidden sm:flex flex-wrap gap-3 mt-10">
      {filter.map((item) => (
        <button
          key={item.name}
          onClick={() => handleClick(item.value)}
          className={cn(
            `shadow-none px-6 py-3 rounded-lg capitalize body-medium`,
            active === item.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500"
              : "bg-light-800 dark:bg-dark-300 hover:bg-light-800 dark:text-light-500 dark:hover:bg-dark-300"
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default HomeFilter;
