import React from "react";

export default function GetThemeComponent({
  dark,
  light,
}: {
  light: React.ReactNode;
  dark: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden dark:block"> {dark} </div>
      <div className="block dark:hidden"> {light} </div>
    </>
  );
}
