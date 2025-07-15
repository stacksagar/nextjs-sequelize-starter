import { Button } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { BiCheck, BiCopy, BiCopyAlt, BiSolidCopy } from "react-icons/bi";
import { FaCopy, FaRegCopy } from "react-icons/fa";

export default function CopyButton({ text }: { text?: string }) {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <div
      color={clipboard.copied ? "teal" : "blue"}
      onClick={() => clipboard.copy(text || "")}
    >
      {clipboard.copied ? <BiCheck /> : <BiCopy />}
    </div>
  );
}
