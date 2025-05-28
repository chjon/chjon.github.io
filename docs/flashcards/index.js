function flipCard(e) {
  console.log(e);

  for (card of document.getElementsByClassName('card')) {
    if (card.classList.contains('in-centre')) {
      card.classList.toggle('flipped');
    }
  }
}

function prevCard() {
  for (card of document.getElementsByClassName('card')) {
    if (card.classList.contains('out-left')) {
      // TODO: Load prev content here
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
      // TODO: Load next content here
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
  console.log(document.getElementById('data-table'));
  document.getElementById('button-back').onclick = prevCard;
  document.getElementById('carousel').onclick = flipCard;
  document.getElementById('button-next').onclick = nextCard;
});

addEventListener('keypress', (event) => {
  switch(event.key) {
    case ' ': flipCard(); break;
    case 'b': prevCard(); break;
    case 'n': nextCard(); break;
  }
});