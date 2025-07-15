import { Input } from "@mantine/core";
import { useState } from "react";
import Label from "./Label";

const ExpiryDateInput = ({
  onChange,
  label,
}: {
  onChange?: (number: string) => void;
  label?: string;
}) => {
  const [expiryDate, setExpiryDate] = useState("");

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
    let formatted = "";

    if (cleaned.length > 0) {
      formatted += cleaned.substring(0, 2);
    }
    if (cleaned.length > 1) {
      formatted += " / " + cleaned.substring(2, 4);
    }

    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    onChange && onChange(formattedValue);
    setExpiryDate(formattedValue);
  };

  return (
    <div>
      <Label className={`capitalize font-medium text-[15px] block mb-1`}>
        {label || "Expires"}
      </Label>

      <Input
        className="mc_input rounded-full-mc"
        autoComplete="cc-exp"
        id="expiryDate"
        name="expiryDate"
        type="tel"
        placeholder="MM / YY"
        value={expiryDate}
        onChange={handleInputChange}
        maxLength={7}
      />
    </div>
  );
};

export default ExpiryDateInput;
