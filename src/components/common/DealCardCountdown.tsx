export default function DealCardCountdown({ status }: { status?: string }) {
  const time = {
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  };

  if (status?.toLocaleLowerCase()?.includes("expired"))
    return (
      <div className="absolute top-[165px] inset-x-0 w-full flex p-4 items-center justify-center gap-x-2">
        {Object.entries(time).map(([key, value]) => (
          <div
            key={key}
            className="w-12 px-3 py-2 bg-white rounded-[10px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.08)] outline outline-offset-[-1px] outline-zinc-300 inline-flex flex-col justify-start items-start gap-px"
          >
            <div className="self-stretch h-4 text-center justify-center  text-xs font-bold leading-none">
              {value}
            </div>
            <div className="self-stretch h-4 text-center justify-center  text-[10px] font-medium leading-none capitalize">
              {key}
            </div>
          </div>
        ))}
      </div>
    );

  return null;
}
