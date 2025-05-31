class Dataset {
  constructor(fileSelector, radioButtons) {
    this.fileSelector = fileSelector;
    this.radioButtons = radioButtons;

    this.columns = [];
    this.rows = [];
  }

  async importJson() {
    // Check whether a file was selected
    if (this.fileSelector.files.length == 0)
      throw Error("No file selected");

    return await new Promise((resolve, reject) => {
      // Try reading file
      const reader = new FileReader();
      reader.onerror = function(progressEvent) {
        reject("Failed to read file");
      };
      reader.onload = function(progressEvent) {
        resolve(JSON.parse(this.result));
      };
      
      reader.readAsText(this.fileSelector.files[0]);
    });
  }

  async loadData() {
    // Check radio buttons
    let selectedData = null;
    this.radioButtons.forEach((radioButton) => {
      if (radioButton.checked) selectedData = radioButton.dataset.flashcardPath;
    });

    if (selectedData != null) {
      const result = await fetch(selectedData);
      const { columns, rows } = await result.json();
      [this.columns, this.rows] = [columns, rows];
    } else {
      const { columns, rows } = this.importJson();
      [this.columns, this.rows] = [columns, rows];
    }
  }
}

class FlashcardManager {
  constructor(menuFlashcards, contentFlashcards) {
    this.menuFlashcards = menuFlashcards;
    this.contentFlashcards = contentFlashcards;
    this.cardIndex = 0;
    this.stack = [];
  }

  getCard(cardIndex) {
    const contentFlashcardIndex = (cardIndex - this.menuFlashcards.length) % this.contentFlashcards.length;
    const card = (cardIndex < this.menuFlashcards.length)
      ? this.menuFlashcards[cardIndex]
      : this.contentFlashcards[contentFlashcardIndex];
    return card;
  }

  moveCard(cardIndex, fromClass, toClass) {
    const card = this.getCard(cardIndex);
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
    const oldCard = this.moveCard(this.cardIndex, 'in-centre', 'out-right');
    toggleFlashcardInputs(oldCard);

    // Move the card on the left to be in the centre
    this.cardIndex--;
    const newCard = this.moveCard(this.cardIndex, 'out-left', 'in-centre');
    populateCard(newCard, this.getPrevData());
    toggleFlashcardInputs(newCard);
  }

  async nextCard() {
    if (this.cardIndex == this.menuFlashcards.length - 1)
      await dataset.loadData();

    // Wrap the card on the left to be on the right
    if (this.cardIndex - 1 >= this.menuFlashcards.length) {
      this.moveCard(this.cardIndex - 1, 'out-left', 'out-right');
    }

    // Move the card in the centre to be on the left
    const oldCard = this.moveCard(this.cardIndex, 'in-centre', 'out-left');
    toggleFlashcardInputs(oldCard);

    // Move the card on the right to be in the centre
    this.cardIndex++;
    const newCard = this.moveCard(this.cardIndex, 'out-right', 'in-centre');
    populateCard(newCard, this.getNextData());
    toggleFlashcardInputs(newCard);
  }

  flipCard(e) {
    // Don't flip card if the user clicked on a link or input
    if (!!e && [
      'A', 'BUTTON', 'INPUT', 'LABEL'
    ].includes(e.target.nodeName)) return;

    // Flip current card
    const card = this.getCard(this.cardIndex);
    card.classList.toggle('flipped');

    // Enable/disable inputs
    toggleFlashcardInputs(card);
  }

  getPrevData() {
    if (this.cardIndex < this.menuFlashcards.length) return undefined;
    
    // Get data for card
    const stackIndex = this.cardIndex - this.menuFlashcards.length;
    return dataset.rows[this.stack[stackIndex]];
  }

  getNextData() {
    if (this.cardIndex < this.menuFlashcards.length) return undefined;

    // Get data for card if it already exists
    const stackIndex = this.cardIndex - this.menuFlashcards.length;
    if (stackIndex < this.stack.length) return dataset.rows[this.stack[stackIndex]];

    // Generate a new card
    if (dataset.rows.length == 0) return ["No data available", undefined];
    while (true) {
      const i = Math.floor(Math.random() * (dataset.rows.length));
      if (this.stack.length == 0 || i != this.stack[this.stack.length - 1]) {
        this.stack.push(i);
        return dataset.rows[i]
      };
    }
  }
}

function toggleFlashcardInputs(card) {
  function setInputDisabled(element, disabled) {
    // Enable/disable element if it can be disabled
    if (element.nodeName == 'INPUT') element.disabled = disabled;
    if (element.nodeName == 'A') element.tabIndex = disabled ? -1 : undefined;
    if (disabled && document.activeElement == element) document.activeElement.blur();

    // Enable/disable child nodes
    if (!element.childNodes) return;  
    element.childNodes.forEach(childNode => {
      setInputDisabled(childNode, disabled)
    });
  }

  const cardFlipped = card.classList.contains('flipped');
  const disabled = card.classList.contains('in-centre');
  for (let childNode of card.childNodes) {
    if (childNode.nodeName != "DIV") continue;
    if (childNode.classList.contains("q-side")) {
      setInputDisabled(childNode, disabled ^ !cardFlipped);
    } else if (childNode.classList.contains("a-side")) {
      setInputDisabled(childNode, disabled ^ cardFlipped);
    }
  }
}

let dataset = null;
let flashcardManager = null;

function populateCard(card, data) {
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

  if (data == undefined) return;

  // Populate card
  for (let childNode of card.childNodes) {
    if (childNode.nodeName != "DIV") continue;
    if (childNode.classList.contains("q-side")) {
      setCardContent(childNode, dataset.columns[0], data[0]);
    } else if (childNode.classList.contains("a-side")) {
      setCardContent(childNode, dataset.columns[1], data[1]);
    }
  }
}

addEventListener('DOMContentLoaded', () => {
  dataset = new Dataset(
    document.getElementById('select-csv'),
    document.getElementsByName('flashcard-selector')
  );

  flashcardManager = new FlashcardManager(
    Array.from(document.getElementsByClassName('menu-card')),
    Array.from(document.getElementsByClassName('content-card'))
  );

  // Mouse interaction
  document.getElementById('button-back').onclick = () => { flashcardManager.prevCard() };
  document.getElementById('carousel').onclick = (e) => { flashcardManager.flipCard(e) };
  document.getElementById('button-next').onclick = async () => { await flashcardManager.nextCard() };

  // Ensure only one dataset is selected at a time
  const flashcardSelectorRadioButtons = document.getElementsByName("flashcard-selector");
  document.getElementById('select-csv').addEventListener('change', () => {
    flashcardSelectorRadioButtons.forEach(radioButton => radioButton.checked = false);
  }, false);
  flashcardSelectorRadioButtons.forEach(e => e.onclick = () => {
    document.getElementById('select-csv').value = null });
});

// Keybindings
addEventListener('keypress', async (event) => {
  switch(event.key) {
    case 'a': flashcardManager?.prevCard(); break;
    case 's': flashcardManager?.flipCard(); break;
    case 'd': await flashcardManager?.nextCard(); break;
  }
});