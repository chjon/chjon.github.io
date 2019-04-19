/**
 * Generate an n-dimensional array
 * @param {number[]} dimensions - the dimensions for the new array
 * @param {any} initValue - the initial value for each element
 */
export function newNDArray(dimensions, initValue) {
  const newArray = [];

  if (dimensions.length === 1) {
    for (let i = 0; i < dimensions[0]; i++) {
      if (Array.isArray(initValue)) {
        newArray[i] = initValue.slice(0);
      } else if (typeof initValue === 'object') {
        newArray[i] = { ...initValue };
      } else {
        newArray[i] = initValue;
      }
    }
  } else {
    const newDimensions = dimensions.slice(1);
    for (let i = 0; i < dimensions[0]; i++) {
      newArray[i] = newNDArray(newDimensions, initValue);
    }
  }

  return newArray;
}

/**
 * Get the dimensions of the largest grid of n-dimensional squares that will fit in the container, bounded
 * by a given maximum number of squares along each axis
 * @param {{ actual, max }[]} dimensions - an array of the actual size and desired maximums for each dimension
 * @param { number } dimensions.actual - the actual size of the container
 * @param { number } dimensions.max - the maximum number of cells in that dimension
 */
export function constrainDimensions(dimensions) {
  const dimensionsInSquares = dimensions.map(({ actual, max }) => {
    return actual / max;
  });

  const max = Math.max.apply(1, dimensionsInSquares);
  return dimensions.map(({ actual }) => {
    return Math.floor(actual / max);
  });
}

/**
 * Iterate over every element of an n-dimensional array
 * @param {any[]} array - the array over which to iterate
 * @param {Function} callback - the function to apply to each element 
 * @param {number[]} indices - the index of the current array
 */
export function forEach(array, callback, indices = []) {
  array.forEach((element, index) => {
    if (Array.isArray(element)) {
      forEach(element, callback, [...indices, index]);
    } else {
      callback(element, [...indices, index]);
    }
  });
}
