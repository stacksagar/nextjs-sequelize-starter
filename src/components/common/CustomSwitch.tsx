import React, { InputHTMLAttributes } from "react";
import styled from "styled-components";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const CustomSwitch = ({ ...props }: Props) => {
  return (
    <StyledWrapper>
      <div className="check">
        <input id="check" type="checkbox" {...props} />
        <label htmlFor="check" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .check {
    position: relative;
    background: linear-gradient(90deg, #f19af3, #f099b5);
    line-height: 0;
    font-size: 25px;
  }

  .check input[type="checkbox"],
  .check label,
  .check label::before,
  .check label::after {
    appearance: none;
    display: inline-block;
    font-size: inherit;
    border-radius: 1em;
    border: 0;
    transition: 0.35s ease-in-out;
    box-sizing: border-box;
    cursor: pointer;
  }

  .check {
    appearance: none;
    display: inline-block;
    border-radius: 1em;
    border: 0;
    transition: 0.35s ease-in-out;
    box-sizing: border-box;
    cursor: pointer;
  }

  .check label {
    width: 2.2em;
    height: 1em;
    background: #d7d7d7;
    overflow: hidden;
  }

  .check input[type="checkbox"] {
    position: absolute;
    z-index: 1;
    width: 0.8em;
    height: 0.8em;
    top: 0.1em;
    left: 0.1em;
    background: linear-gradient(45deg, #dedede, #ffffff);
    box-shadow: 0 6px 7px rgba(0, 0, 0, 0.3);
    outline: none;
  }

  .check input[type="checkbox"]:checked {
    left: 1.3em;
  }

  .check input[type="checkbox"]:checked + label {
    background: transparent;
  }

  .check label::before,
  .check label::after {
    content: "· ·";
    position: absolute;
    overflow: hidden;
    left: 0.5em;
    top: 0.5em;
    height: 1em;
    letter-spacing: -0.04em;
    color: #9b9b9b;
    font-family: "Times New Roman", serif;
    z-index: 2;
    font-size: 0.6em;
    border-radius: 0;
    transform-origin: 0 0 -0.5em;
    backface-visibility: hidden;
  }

  .check label::after {
    content: "?";
    top: 0.65em;
    left: 0.6em;
    height: 0.1em;
    width: 0.35em;
    font-size: 0.2em;
    transform-origin: 0 0 -0.4em;
  }

  .check input[type="checkbox"]:checked + label::before,
  .check input[type="checkbox"]:checked + label::after {
    left: 2.55em;
    top: 0.4em;
    line-height: 0.1em;
    transform: rotateY(360deg);
  }

  .check input[type="checkbox"]:checked + label::after {
    height: 0.16em;
    top: 0.55em;
    left: 2.6em;
    font-size: 0.6em;
    line-height: 0;
  }
`;

export default CustomSwitch;
