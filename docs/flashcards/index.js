let columnNames = [];
let dataset = [];
let stack = [];
let stackIndex = -1;

function importCsv() {
  // Check whether a file was selected
  const csvSelector = document.getElementById('select-csv');
  if (csvSelector.files.length == 0) {
    alert("No file selected");
    return;
  }

  // Try reading file
  const csv = csvSelector.files[0];
  var reader = new FileReader();
  reader.onerror = function(progressEvent) {
    alert("Failed to read file");
  };
  reader.onload = function(progressEvent) {
    dataset = this.result.split('\n').map(line => line.split(','));
    columnNames = dataset[0];
    dataset = dataset.splice(1);
    nextCard();
  };
  
  reader.readAsText(csv);
}

function setCardContent(cardContent, header, body) {
  for (let childNode of cardContent.childNodes) {
    if (childNode.nodeName != "DIV") continue;
    if (childNode.classList.contains("card-header")) {
      childNode.childNodes[0].textContent = header;
    } else if (childNode.classList.contains("card-body")) {
      if (childNode.childNodes.length != 1 || childNode.childNodes[0].nodeName != "P") {
        childNode.replaceChildren(document.createElement("p"));
        childNode.childNodes[0].style.textAlign = 'center';
      }
      childNode.childNodes[0].textContent = body;
    }
  }
}

function populateCard(card, data) {
  if (data == undefined) return;

  // Populate card
  for (let childNode of card.childNodes) {
    if (childNode.nodeName != "DIV") continue;
    if (childNode.classList.contains("q-side")) {
      setCardContent(childNode, columnNames[0], data[0]);
    } else if (childNode.classList.contains("a-side")) {
      setCardContent(childNode, columnNames[1], data[1]);
    }
  }
}

function getPrevData() {
  // Get data for card
  if (stack.length == 0) return;
  if (stackIndex == 0) return dataset[stack[stackIndex]];
  stackIndex -= 1;
  console.log(stackIndex);
  return dataset[stack[stackIndex]];
}

function getNextData() {  
  // Get data for card
  if (dataset.length == 0) return;
  let i = 1;
  stackIndex += 1;
  if (stackIndex < stack.length) {
    i = stack[stackIndex];
  }
  else {
    while (dataset.length > 1) {
      i = Math.floor(Math.random() * (dataset.length));
      if (stack.length == 0 || i != stack[stack.length - 1]) break;
    }
    stack.push(i);
  }
  console.log(stackIndex);
  return dataset[i];
}

function flipCard(e) {
  // Don't flip card if the user clicked on a link or input
  if (!!e && [
    'A', 'BUTTON', 'INPUT'
  ].includes(e.target.nodeName)) return;

  for (card of document.getElementsByClassName('card')) {
    if (card.classList.contains('in-centre')) {
      card.classList.toggle('flipped');
    }
  }
}

function prevCard() {
  for (card of document.getElementsByClassName('card')) {
    if (card.classList.contains('out-left')) {
      populateCard(card, getPrevData());
      card.classList.remove('out-left');
      card.classList.add('in-centre');
    } else if (card.classList.contains('in-centre')) {
      card.classList.remove('in-centre');
      card.classList.remove('flipped');
      card.classList.add('out-right');
    } else if (card.classList.contains('out-right')) {
      card.classList.remove('out-right');
      card.classList.add('out-left');
    }
  }
}

function nextCard() {
  for (card of document.getElementsByClassName('card')) {
    if (card.classList.contains('out-right')) {
      populateCard(card, getNextData());
      card.classList.remove('out-right');
      card.classList.add('in-centre');
    } else if (card.classList.contains('in-centre')) {
      card.classList.remove('in-centre');
      card.classList.remove('flipped');
      card.classList.add('out-left');
    } else if (card.classList.contains('out-left')) {
      card.classList.remove('out-left');
      card.classList.add('out-right');
    }
  }
}

addEventListener('DOMContentLoaded', () => {
  document.getElementById('button-back').onclick = prevCard;
  document.getElementById('carousel').onclick = flipCard;
  document.getElementById('button-next').onclick = nextCard;

  document.getElementById('select-csv').addEventListener('change', importCsv, false);
});

addEventListener('keypress', (event) => {
  switch(event.key) {
    case ' ': flipCard(); break;
    case 'b': prevCard(); break;
    case 'n': nextCard(); break;
  }
});