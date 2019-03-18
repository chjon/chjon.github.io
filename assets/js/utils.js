/**
 * Generate an n-dimensional array
 * @param {number} dimensions - the dimensions for the new array
 * @param {any} initValue - the initial value for each element
 */
export function newNDArray(dimensions, initValue) {
  const newArray = [];

  if (dimensions.length === 1) {
    for (let i = 0; i < dimensions[0]; i++) {
      newArray[i] = initValue;
    }
  } else {
    const newDimensions = dimensions.slice(1);
    for (let i = 0; i < dimensions[0]; i++) {
      newArray[i] = newNDArray(newDimensions, initValue);
    }
  }

  return newArray;
}