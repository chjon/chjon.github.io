let columnNames = [];
let dataset = [];
let stack = [];
let stackIndex = -1;

class FlashcardManager {
  constructor(menuFlashcards, contentFlashcards) {
    this.menuFlashcards = menuFlashcards;
    this.contentFlashcards = contentFlashcards;
    this.cardIndex = 0;
  }

  moveCard(cardIndex, fromClass, toClass) {
    const contentFlashcardIndex = (cardIndex - this.menuFlashcards.length) % this.contentFlashcards.length;
    const card = (cardIndex < this.menuFlashcards.length)
      ? this.menuFlashcards[cardIndex]
      : this.contentFlashcards[contentFlashcardIndex];
    card.classList.remove(fromClass, 'flipped'); // Always unflip cards when moving
    card.classList.add(toClass);
    return card;
  }

  prevCard() {
    if (this.cardIndex == 0) return;

    // Wrap the card on the right to be on the left
    if (this.cardIndex + 1 >= this.menuFlashcards.length + this.contentFlashcards.length) {
      this.moveCard(this.cardIndex + 1, 'out-right', 'out-left');
    }
    
    // Move the card in the centre to be on the right
    this.moveCard(this.cardIndex, 'in-centre', 'out-right');

    // Move the card on the left to be in the centre
    this.cardIndex--;
    const card = this.moveCard(this.cardIndex, 'out-left', 'in-centre');
    populateCard(card, getPrevData());
  }

  nextCard() {
    // Wrap the card on the left to be on the right
    if (this.cardIndex - 1 >= this.menuFlashcards.length) {
      this.moveCard(this.cardIndex - 1, 'out-left', 'out-right');
    }

    // Move the card in the centre to be on the left
    this.moveCard(this.cardIndex, 'in-centre', 'out-left');

    // Move the card on the right to be in the centre
    this.cardIndex++;
    const card = this.moveCard(this.cardIndex, 'out-right', 'in-centre');
    populateCard(card, getPrevData());
  }
}

let flashcardManager = null;

function deselectFile() {
  document.getElementById('select-csv').value = null;
}

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
    document.getElementsByName("flashcard-selector")
      .forEach(radioButton => radioButton.checked = false);
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
      }
      childNode.childNodes[0].style.textAlign = 'center';
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
  return dataset[i];
}

function flipCard(e) {
  // Don't flip card if the user clicked on a link or input
  if (!!e && [
    'A', 'BUTTON', 'INPUT', 'LABEL'
  ].includes(e.target.nodeName)) return;

  for (card of document.getElementsByClassName('card')) {
    if (card.classList.contains('in-centre')) {
      card.classList.toggle('flipped');
    }
  }
}

addEventListener('DOMContentLoaded', () => {
  flashcardManager = new FlashcardManager(
    Array.from(document.getElementsByClassName('menu-card')),
    Array.from(document.getElementsByClassName('content-card'))
  );

  document.getElementById('button-back').onclick = () => { flashcardManager.prevCard() };
  document.getElementById('carousel').onclick = flipCard;
  document.getElementById('button-next').onclick = () => { flashcardManager.nextCard() };

  document.getElementById('select-csv').addEventListener('change', importCsv, false);
  document.getElementsByName('flashcard-selector')
    .forEach(e => e.onclick = deselectFile);
});

addEventListener('keypress', (event) => {
  switch(event.key) {
    case 'a': flashcardManager.prevCard(); break;
    case 's': flipCard(); break;
    case 'd': flashcardManager.nextCard(); break;
  }
});