const cards = [
  { id: 1, type: 'text', content: 'מים' },
  { id: 2, type: 'image', content: '<img src="/מים.jpg" alt="מים" class="card-image">' },
  { id: 3, type: 'text', content: 'מזון' },
  { id: 4, type: 'image', content: '<img src="/מזון.jpg" alt="מזון" class="card-image">' },
  { id: 5, type: 'text', content: 'חמצן' },
  { id: 6, type: 'image', content: '<img src="/חמצן.png" alt="חמצן" class="card-image">' },
  { id: 7, type: 'text', content: 'אור שמש' },
  { id: 8, type: 'image', content: '<img src="/אור שמש.jpg" alt="אור שמש" class="card-image">' },
  { id: 9, type: 'text', content: 'טמפרטורה מתאימה' },
  { id: 10, type: 'image', content: '<img src="/טמפרטורה מתאימה.JPG" alt="טמפרטורה מתאימה" class="card-image">' },
  { id: 11, type: 'text', content: 'מרחב מחיה' },
  { id: 12, type: 'image', content: '<img src="/מרחב מחיה.JPG" alt="מרחב מחיה" class="card-image">' }
];

let flippedCards = [];
let matchedPairs = 0;

function shuffleCards() {
  return [...cards].sort(() => Math.random() - 0.5);
}

function createCard(card) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.dataset.id = card.id;
  
  const frontFace = document.createElement('div');
  frontFace.className = 'card-front';
  frontFace.innerHTML = '?';
  
  const backFace = document.createElement('div');
  backFace.className = 'card-back';
  backFace.innerHTML = card.content;
  
  cardElement.appendChild(frontFace);
  cardElement.appendChild(backFace);
  
  cardElement.addEventListener('click', () => flipCard(cardElement));
  return cardElement;
}

function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  
  card.classList.add('flipped');
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const id1 = parseInt(card1.dataset.id);
  const id2 = parseInt(card2.dataset.id);
  
  const isMatch = (
    (id1 === 1 && id2 === 2) || (id1 === 2 && id2 === 1) ||
    (id1 === 3 && id2 === 4) || (id1 === 4 && id2 === 3) ||
    (id1 === 5 && id2 === 6) || (id1 === 6 && id2 === 5) ||
    (id1 === 7 && id2 === 8) || (id1 === 8 && id2 === 7) ||
    (id1 === 9 && id2 === 10) || (id1 === 10 && id2 === 9) ||
    (id1 === 11 && id2 === 12) || (id1 === 12 && id2 === 11)
  );
  
  setTimeout(() => {
    if (isMatch) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      
      if (matchedPairs === 6) {
        celebration();
      }
    } else {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }
    flippedCards = [];
  }, 1000);
}

function celebration() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  document.querySelector('.win-message').classList.remove('hidden');
}

function resetGame() {
  matchedPairs = 0;
  flippedCards = [];
  document.querySelector('.win-message').classList.add('hidden');
  initializeGame();
}

function initializeGame() {
  const gameBoard = document.querySelector('.game-board');
  gameBoard.innerHTML = '';
  const shuffledCards = shuffleCards();
  shuffledCards.forEach(card => {
    gameBoard.appendChild(createCard(card));
  });
}

initializeGame();