const cards = [
  { id: 1, type: 'text', content: 'מים' },
  { id: 2, type: 'image', content: '<img src="מים.jpg" alt="מים" class="card-image">' },
  { id: 3, type: 'text', content: 'מזון' },
  { id: 4, type: 'image', content: '<img src="מזון.jpg" alt="מזון" class="card-image">' },
  { id: 5, type: 'text', content: 'חמצן' },
  { id: 6, type: 'image', content: '<img src="חמצן.png" alt="חמצן" class="card-image">' },
  { id: 7, type: 'text', content: 'אור שמש' },
  { id: 8, type: 'image', content: '<img src="אור שמש.jpg" alt="אור שמש" class="card-image">' },
  { id: 9, type: 'text', content: 'טמפרטורה מתאימה' },
  { id: 10, type: 'image', content: '<img src="טמפרטורה מתאימה.JPG" alt="טמפרטורה מתאימה" class="card-image">' },
  { id: 11, type: 'text', content: 'מרחב מחיה' },
  { id: 12, type: 'image', content: '<img src="מרחב מחיה.JPG" alt="מרחב מחיה" class="card-image">' }
];


let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 6;

// Sound effects
const flipSound = new Audio('click.mp3');
const matchSound = new Audio('click.mp3'); // You can replace with another sound if available
const winSound = new Audio('click.mp3'); // You can replace with another sound if available

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function updateScore() {
  const scoreBoard = document.getElementById('scoreBoard');
  if (scoreBoard) {
    scoreBoard.textContent = `התאמות: ${matchedPairs} מתוך ${totalPairs}`;
  }
}

function shuffleCards() {
  return [...cards].sort(() => Math.random() - 0.5);
}

function createCard(card) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.dataset.id = card.id;

  // Card front (question mark, fills card)
  const frontFace = document.createElement('div');
  frontFace.className = 'card-front';
  frontFace.innerHTML = '?';

  // Card back (image or text, fills card)
  const backFace = document.createElement('div');
  backFace.className = 'card-back';
  backFace.innerHTML = card.content;

  // Make both faces fill the card
  frontFace.style.position = 'absolute';
  frontFace.style.width = '100%';
  frontFace.style.height = '100%';
  frontFace.style.top = '0';
  frontFace.style.left = '0';
  backFace.style.position = 'absolute';
  backFace.style.width = '100%';
  backFace.style.height = '100%';
  backFace.style.top = '0';
  backFace.style.left = '0';

  cardElement.appendChild(frontFace);
  cardElement.appendChild(backFace);

  cardElement.addEventListener('click', () => flipCard(cardElement));
  return cardElement;
}

function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.classList.add('bounce');
  setTimeout(() => card.classList.remove('bounce'), 400);
  playSound(flipSound);
  flippedCards.push(card);
  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function showMatchEffect(card1, card2) {
  // Add a happy face/star effect
  [card1, card2].forEach(card => {
    const effect = document.createElement('div');
    effect.style.position = 'absolute';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '2.5rem';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '10';
    effect.textContent = '⭐';
    card.appendChild(effect);
    setTimeout(() => effect.remove(), 900);
  });
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const id1 = parseInt(card1.dataset.id);
  const id2 = parseInt(card2.dataset.id);
  
  // Each pair is (odd, even) where odd is text and even is image, and (id1+1 === id2 || id2+1 === id1) and Math.abs(id1-id2) === 1 and Math.ceil(id1/2) === Math.ceil(id2/2)
  const isMatch = (
    Math.abs(id1 - id2) === 1 && Math.ceil(id1 / 2) === Math.ceil(id2 / 2)
  );
  
  setTimeout(() => {
    if (isMatch) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      updateScore();
      playSound(matchSound);
      showMatchEffect(card1, card2);
      if (matchedPairs === totalPairs) {
        setTimeout(() => playSound(winSound), 400);
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
  updateScore();
  initializeGame();
}

function initializeGame() {
  const gameBoard = document.querySelector('.game-board');
  gameBoard.innerHTML = '';
  const shuffledCards = shuffleCards();
  shuffledCards.forEach(card => {
    gameBoard.appendChild(createCard(card));
  });
  updateScore();
}

// Add bounce animation style
const style = document.createElement('style');
style.innerHTML = `
.card.bounce {
  animation: bounce 0.4s;
}
@keyframes bounce {
  0% { transform: scale(1) rotateY(0deg); }
  30% { transform: scale(1.15) rotateY(10deg); }
  60% { transform: scale(0.95) rotateY(-10deg); }
  100% { transform: scale(1) rotateY(0deg); }
}`;
document.head.appendChild(style);

initializeGame();