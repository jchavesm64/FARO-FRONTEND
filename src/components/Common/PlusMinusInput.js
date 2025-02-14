import React from "react";
import { Button, Input, InputGroup } from "reactstrap";

const PlusMinusInput = ({ value, handleChange, maxAvailable }) => {
  return (
    <InputGroup
      style={{ maxWidth: "7rem" }}
      className="plus-minus-input-container"
    >
      <Button
        color="primary"
        onClick={() => {
          if (value > 0) {
            handleChange(value - 1);
          }
        }}
        disabled={value === 0}
      >
        -
      </Button>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        // onBlur={(e) => handleBlur(e, index)}
        className="text-center"
      />
      <Button
        color="primary"
        onClick={() => {
          if (value < maxAvailable) {
            handleChange(value + 1);
          }
        }}
        // disabled={type.amountBooking === type.lengthAvailable || enableRooms}
      >
        +
      </Button>
    </InputGroup>
  );
};

export default PlusMinusInput;
