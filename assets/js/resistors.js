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

function combineCost(cost1, cost2) {
  const allCosts = {};
  
  cost1.forEach(({ key, count }) => {
    if (allCosts[key]) {
      allCosts[key].count += count;
    } else {
      allCosts[key] = { key, count };
    }
  });

  cost2.forEach(({ key, count }) => {
    if (allCosts[key]) {
      allCosts[key].count += count;
    } else {
      allCosts[key] = { key, count };
    }
  });

  return Object.values(allCosts);
}

function connectSeries(resistor1, resistor2) {
  const resistance = resistor1.resistance + resistor2.resistance;
  const representation = (resistor1.resistance < resistor2.resistance) ?
    `(${resistor1.representation})+(${resistor2.representation})` :
    `(${resistor2.representation})+(${resistor1.representation})`;

  return { resistance, representation };
}

function connectParallel(resistor1, resistor2) {
  return {
    resistance: 1 / ((1 / resistor1.resistance) + (1 / resistor2.resistance)),
    representation: `(${resistor1.representation})||(${resistor2.representation})`,
  };
}

function generateCombo(resistors, desiredResistance, maxResistors, tolerance) {
  const allCombos = [{}];
  resistors.forEach((resistor) => {
    if (allCombos[0][resistor.representation]) {
      allCombos[0][resistor.representation].count++;
    } else {
      allCombos[0][resistor.representation] = resistor;
      resistor.cost = [{ key: resistor.representation, count: 1 }];
      resistor.count = 1;
    }
  });

  for (let i = 0; i < maxResistors; i++) {
    for (let j = 0; j <= i && i + j + 1 < maxResistors; j++) {
      const iSet = Object.values(allCombos[i]);
      const jSet = Object.values(allCombos[j]);
      allCombos[i + j + 1] = allCombos[i + j + 1] || {};

      for (let k = 0; k < iSet.length; k++) {
        for (let l = 0; l < jSet.length; l++) {
          const combinedCost = combineCost(iSet[k].cost, jSet[l].cost);
          const costTooHigh = combinedCost.reduce((costTooHigh, { key, count }) => {
            return costTooHigh || count > allCombos[0][key].count;
          }, false);

          if (costTooHigh) {
            continue;
          }

          const seriesCombo = { ...connectSeries(iSet[k], jSet[l]), cost: combinedCost};
          const parallelCombo = { ...connectParallel(iSet[k], jSet[l]), cost: combinedCost};
          if (allCombos[i + j + 1][seriesCombo.representation]) {
            continue;
          }

          allCombos[i + j + 1][seriesCombo.representation] = seriesCombo;
          allCombos[i + j + 1][parallelCombo.representation] = parallelCombo;
        }
      }
    }
  }

  return allCombos.reduce((acc, cur) => {
    return acc.concat(Object.values(cur));
  }, []);
}

function recalculate() {
  const desiredResistance = parseFloat(desiredResistanceInput.value);
  const maxResistors = parseInt(maxResistorsInput.value);
  const tolerance = parseFloat(toleranceInput.value);
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

  const outputString = combinations
  .filter((resistor) => {
    return Math.abs(resistor.resistance - desiredResistance) <= tolerance;
  })
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
