import React, { InputHTMLAttributes, LabelHTMLAttributes } from "react";
import { BiSearch } from "react-icons/bi";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  category?: any;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  height?: string;
  width?: string;
}

export default function SearchInput({
  category,
  labelProps,
  height,
  width,
  ...props
}: Props) {
  return (
    <div
      className={`${
        width ? width : "w-full md:w-[400px] lg:w-[450px] 2xl:w-[621px]"
      } max-w-full inline-flex justify-start items-center relative`}
    >
      <label
        htmlFor={props.id || labelProps?.htmlFor || "search-input"}
        {...labelProps}
        className={`absolute inset-y-0 left-4 my-auto flex items-center justify-center ${labelProps?.className}`}
      >
        <BiSearch />
      </label>

      <input
        type="text"
        title="search"
        id="search-input"
        placeholder="Search"
        {...props}
        className={`${
          height ? height : "h-12 sm:h-14"
        } w-full pl-10 pr-3.5 py-2.5 rounded-[50px] border-[1.5px] md:border-[2px] border-blue-800 dark:border-gray-700 focus:ring-[2px] !font-normal md:focus:ring-[3px] focus:ring-blue-300 focus:border-blue-400 text-black focus:outline-0 dark:bg-darkContrasting dark:text-lightMinimalism ${
          props.className
        }`}
      />

      {category ? (
        <div className="absolute h-[75%] inset-y-0 right-[8px] my-auto w-40 pr-2 bg-zinc-100 dark:bg-darkMuted rounded-[50px] flex justify-between items-center overflow-hidden">
          <select
            name="search-category"
            id="search-category"
            title="select search category"
            className="w-full h-full rounded-full bg-zinc-100 dark:bg-darkMuted text-[#262626] dark:text-lightMinimalism px-2 !outline-0"
          >
            <option value="lagos">Lagos</option>
            <option value="others">Others</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}
