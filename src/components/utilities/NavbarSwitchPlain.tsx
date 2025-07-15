import React from "react";
import styled from "styled-components";

const NavbarSwitchPlain = ({
  onChange,
  checked,
}: {
  onChange: any;
  checked: boolean;
}) => {
  return (
    <StyledWrapper>
      <label className="burger" htmlFor="burger">
        <input
          onChange={(e) => onChange(e.target.checked)}
          checked={checked}
          type="checkbox"
          id="burger"
          title="toggle menu"
        />
        <span className="!w-[95%] bars dark:bg-[#F7F7F7] bg-[#3F2E3E]" />
        <span className="bars dark:bg-[#E4E4E4] bg-[#4B3B4C]" />
        <span className="!w-[95%] bars dark:bg-[#F5E8D8] bg-[#635363]" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .burger {
    position: relative;
    width: 40px;
    height: 30px;
    background: transparent;
    cursor: pointer;
    display: block;
    transform: scale(0.75);
  }

  .burger input {
    display: none;
  }

  .burger span {
    display: block;
    position: absolute;
    height: 4px;
    width: 100%;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out !important;
  }

  .burger span:nth-of-type(1) {
    top: 0px;
    transform-origin: left center;
  }

  .burger span:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
  }

  .burger span:nth-of-type(3) {
    top: 100%;
    transform-origin: left center;
    transform: translateY(-100%);
  }

  .burger input:checked ~ span:nth-of-type(1) {
    transform: rotate(45deg);
    top: 0px;
    left: 5px;
  }

  .burger input:checked ~ span:nth-of-type(2) {
    width: 0%;
    opacity: 0;
  }

  .burger input:checked ~ span:nth-of-type(3) {
    transform: rotate(-45deg);
    top: 28px;
    left: 5px;
  }
`;

export default NavbarSwitchPlain;
