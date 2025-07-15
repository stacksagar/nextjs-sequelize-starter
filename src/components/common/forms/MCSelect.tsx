import { Select, SelectProps } from "@mantine/core";
import Label from "./Label";
import GetThemeComponent from "@/components/utilities/GetThemeComponent";

export default function MCSelect({
  label,
  labelProps,
  ...props
}: SelectProps & {
  label?: string;
  labelProps?: { label?: string } & React.LabelHTMLAttributes<HTMLLabelElement>;
}) {
  return (
    <div>
      {label ? (
        <Label
          className={`capitalize font-medium text-[15px] block mb-1 ${labelProps?.className}`}
        >
          {labelProps?.label || label}
        </Label>
      ) : null}

      <GetThemeComponent
        light={
          <Select
            searchable
            {...props}
            className={`mc_input ${props.className}`}
          />
        }
        dark={
          <Select
            styles={{
              input: {
                background: "#00000050",
                border: "1px solid #222222",
                color: "#ffffff",
              },
            }}
            searchable
            {...props}
            className={`mc_input ${props.className}`}
          />
        }
      />
    </div>
  );
}
