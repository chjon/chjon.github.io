let desiredResistanceInput;
let maxResistorsInput;
let availableResistanceInput;
let calculateButtonInput;
let toleranceInput;
let combinationOutput;

function validate(desiredResistance, availableResistances) {
  // Validate inputs
  if (!desiredResistance) {
    alert('Enter a valid desired resistance');
    return false;
  } else if (!availableResistances) {
    alert('Enter available resistances');
    return false;
  }

  return true;
}

function getResistanceList(availableResistances) {
  return availableResistances
  .replace(/\s|\n|\r/gi, '')
  .split(',')
  .filter((s) => {
    return s.length;
  })
  .map((s) => {
    return parseFloat(s);
  });
}

function connectSeries(resistor1, resistor2) {
  return {
    resistance: resistor1.resistance + resistor2.resistance,
    representation: `(${resistor1.representation})+(${resistor2.representation})`,
  };
}

function connectParallel(resistor1, resistor2) {
  return {
    resistance: 1 / ((1 / resistor1.resistance) + (1 / resistor2.resistance)),
    representation: `(${resistor1.representation})||(${resistor2.representation})`,
  };
}

function generateCombo(resistors, desiredResistance, maxResistors, tolerance) {
  if (maxResistors < 1 || resistors.length === 0) {
    return [];
  }

  // Combine resistances
  let foundCombos = resistors.slice(0);
  const used = [];
  for (let i = 0; i < resistors.length && maxResistors > 1; i = i + 1) {
    const curResistor = resistors[i];

    if (used.indexOf(curResistor.representation) !== -1) {
      continue;
    }

    used.push(curResistor.representation);
    resistors.splice(i, 1);

    const desiredSeriesResistance = desiredResistance - curResistor.resistance;
    const seriesResistors = generateCombo(resistors, desiredSeriesResistance, maxResistors - 1, tolerance)
    .map((resistor) => {
      return connectSeries(curResistor, resistor);
    });

    const desiredParallelResistance = 1 / ((1 / desiredResistance) - (1 / curResistor.resistance));
    const parallelResistors = generateCombo(resistors, desiredParallelResistance, maxResistors - 1, tolerance)
    .map((resistor) => {
      return connectParallel(curResistor, resistor);
    });

    foundCombos = foundCombos.concat(seriesResistors).concat(parallelResistors);
  
    resistors.splice(i, 0, curResistor);
  }

  const foundReps = [];
  return foundCombos.filter((resistor) => {
    if (foundReps.indexOf(resistor.representation) !== -1) {
      return false;
    }

    foundReps.push(resistor.representation);
    return Math.abs(desiredResistance - resistor.resistance) <= tolerance;
  });
}

function recalculate() {
  const desiredResistance = parseInt(desiredResistanceInput.value);
  const maxResistors = parseInt(maxResistorsInput.value);
  const tolerance = parseInt(toleranceInput.value);
  const availableResistances = availableResistanceInput.value;

  if (!validate(desiredResistance, availableResistances)) {
    return;
  }

  const resistors = getResistanceList(availableResistances)
  .map((resistance) => {
    return {
      resistance: resistance,
      representation: `${resistance}`,
    }
  });

  const combinations = generateCombo(resistors, desiredResistance, maxResistors, tolerance);

  console.log(combinations);

  const outputString = combinations
  .sort((a, b) => {
    return Math.abs(a.resistance - desiredResistance) - Math.abs(b.resistance - desiredResistance);
  })
  .reduce((outputString, resistor) => {
    return `${outputString}${resistor.resistance}: ${resistor.representation}\n`;
  }, '');

  combinationOutput.value = outputString;
}

window.onload = () => {
  desiredResistanceInput = document.getElementById('desired-resistance');
  maxResistorsInput = document.getElementById('max-resistors');
  availableResistanceInput = document.getElementById('available-resistances');
  calculateButtonInput = document.getElementById('calculate-button');
  toleranceInput = document.getElementById('acceptable-tolerance');
  combinationOutput = document.getElementById('combo-output');

  calculateButtonInput.onclick = recalculate;
}
