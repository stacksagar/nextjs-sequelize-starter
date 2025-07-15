"use client";

import { useState } from "react"; 
import { Input } from "@mantine/core"; 
import Label from "./Label";

const CardNumberInput = ({
  onChange,
}: {
  onChange?: (number: string) => void;
}) => {
  const [cardNumber, setCardNumber] = useState("");

  const patternMatch = (input: string, template: string) => {
    try {
      let j = 0;
      let formatted = "";
      let countj = 0;
      while (j < template.length) {
        if (countj > input.length - 1) {
          template = template.substring(0, j);
          break;
        }

        if (template[j] === input[j]) {
          j++;
          countj++;
          continue;
        }

        if (template[j] === "x") {
          template =
            template.substring(0, j) +
            input[countj] +
            template.substring(j + 1);
          formatted += input[countj];
          countj++;
        }
        j++;
      }

      return template;
    } catch {
      return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedValue = patternMatch(rawValue, "xxxx xxxx xxxx xxxx");
    setCardNumber(formattedValue);
    onChange && onChange(formattedValue);
  };

  return (
    <div>
      <Label className={`capitalize font-medium text-[15px] block mb-1`}>
        Card number
      </Label>

      <div className="relative">
        <Input
          className={`mc_input rounded-full-mc mc_input_card_number`}
          autoComplete="cc-number"
          id="cardNumber"
          name="cardNumber"
          type="tel"
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={handleInputChange}
        />

        <div className="absolute left-0 inset-y-0 h-full flex items-center justify-center px-3">
          <div
            data-payment-method="Mastercard"
            data-size="sm"
            className="px-2.5 py-2 relative bg-white rounded outline-1 outline-offset-[-1px] outline-gray-100"
          >
            <img src="/icons/mastercard.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNumberInput;
