"use client";

import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  toggler: React.ReactNode | string;
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CollapseContent({
  toggler,
  children,
  open,
  setOpen,
}: Props) {
  const [opened, { toggle }] = useDisclosure(open || false);

  return (
    <div>
      <div
        onClick={() => {
          toggle();
          setOpen && setOpen((p) => !p);
        }}
      >
        {" "}
        {toggler}{" "}
      </div>
      <Collapse in={opened} transitionDuration={300}>
        {children}
      </Collapse>
    </div>
  );
}
