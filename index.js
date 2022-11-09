"use strict";

// The current value displayed at the top
let value = "0";

// The value for the left hand side of the operation
let leftValue = null;

// The operation just clicked by the user, if there is one
let activeOperation = null;

// Whether or not an operation has just been clicked, and therefore we are awaiting the right hand side
let awaitingRightInput = false;

// Whether a decimal point has been inputted for the current number
let decimal = false;

/**
 * Sets the current value, and updates the user interface accordingly
 * @param {number} newValue the number to set the current value to
 */
function setValue(newValue) {
  value = newValue;

  let valueElement = document.getElementById("value");

  valueElement.innerText = value;

  // If necessary, scale the text to fit
  if (value.length > 9) {
    valueElement.style.fontSize = `calc(8vh * ${9/value.length})`;
  } else {
    valueElement.style.fontSize = "8vh";
  }

  document.getElementById("clear").innerText = value == "0" ? "AC" : "C";
}

/**
 * Removes the highlighted appearance from the active operation button
 */
function removeActiveOperationAppearance() {
  if (activeOperation !== null) {
    document.getElementById(activeOperation).classList.remove("active");
  }
}

/**
 * Adds the highlighted appearnce to the active opeation button
 */
function addActiveOperationAppearance() {
  if (activeOperation !== null) {
    document.getElementById(activeOperation).classList.add("active");
  }
}

/**
 * Sets the current active operation, and updates the user interface accordingly
 * @param {string} op the new active operation - either "plus", "minus", "multiply", or "divide"
 */
function setActiveOperation(op) {
  removeActiveOperationAppearance();

  activeOperation = op;

  addActiveOperationAppearance();
}

/**
 * Handles the input of a new number.
 * @param {number} n the new number
 */
function number(n) {
  if (value === "0" || awaitingRightInput) {
    // Start a new number
    setValue(n.toString());
    removeActiveOperationAppearance();
    awaitingRightInput = false;
    decimal = false;
  } else {
    // Add to the existing number
    setValue(value + n.toString());
  }
}

/**
 * Handles the input of a decimal point.
 */
function point() {
  if (decimal === false) {
    setValue(value + ".");
    decimal = true;
  }
}

/**
 * Handles the input of an operation.
 * @param {string} op the operation - either "plus", "minus", "multiply", or "divide"
 */
function operation(op) {
  setActiveOperation(op);
  leftValue = value;
  awaitingRightInput = true;
}

/**
 * Tries to perform a calculation using the left hand side value, the current value, and the active operation
 * @returns {number | null} the result of the calculation, or null if there was no left value of active operation
 */
function calculate() {
  if (leftValue !== null && activeOperation !== null) {
    const lhs = parseFloat(leftValue);
    const rhs = parseFloat(value);

    switch (activeOperation) {
      case "plus":
        return lhs + rhs;
      case "subtract":
        return lhs - rhs;
      case "multiply":
        return lhs * rhs;
      case "divide":
        return lhs / rhs;
    }
  } else {
    return null;
  }
}

/**
 * Handles the pressing of the equals button by attempting a calculation and updating the user interface
 */
function equals() {
  const result = calculate();

  if (result !== null) {
    setValue(result.toString());

    setActiveOperation(null);
    leftValue = null;
  }
}

/**
 * If the value is 0, clears the operation, otherwise clears the value
 */
function c() {
  if (value == "0") {
    setActiveOperation(null);
  } else {
    setValue("0");
    addActiveOperationAppearance();
  }
}

/**
 * Negates the current value, and updates the user interface accordingly
 */
function negate() {
  setValue(-value);
}

/**
 * Converts the current value from percentage to decimal, and updates the user interface accordingly
 */
function percentageToDecimal() {
  setValue(value / 100);
}