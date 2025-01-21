const notesFr = ['Do', 'Ré', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
const notesEn = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const noteToGuessElement = document.getElementById('noteToGuess');

// Mapping entre les notations
const noteMapping = {
    'Do': 'C',
    'Ré': 'D',
    'Mi': 'E',
    'Fa': 'F',
    'Sol': 'G',
    'La': 'A',
    'Si': 'B',
    'C': 'Do',
    'D': 'Ré',
    'E': 'Mi',
    'F': 'Fa',
    'G': 'Sol',
    'A': 'La',
    'B': 'Si'
};

// Fonction pour choisir une note aléatoire
function chooseRandomNote() {
    const notation = document.getElementById('notationSelect').value; // Utiliser l'élément select
    const notes = notation === 'fr' ? notesFr : notesEn;
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
}

// Fonction pour mettre à jour la note à deviner
function updateNoteToGuess() {
    const note = chooseRandomNote();
    noteToGuessElement.textContent = `Note à deviner : ${note}`;
}

// Fonction pour mettre en surbrillance la touche correspondante
function highlightKey(note, isCorrect) {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (isCorrect) {
        key.classList.add('correct');
    } else {
        key.classList.add('incorrect');
    }
    // Retirer la couleur après un délai
    setTimeout(() => {
        key.classList.remove('correct', 'incorrect');
    }, 500); // Durée de l'illumination
}

// Événement de changement sur le menu déroulant
document.getElementById('notationSelect').addEventListener('change', () => {
    updateNoteToGuess(); // Met à jour la note à deviner lors du changement de notation
});

let correctAnswers = 0;
let errors = 0;
let timer;
let timeElapsed = 0;

function startGame() {
    correctAnswers = 0;
    errors = 0;
    timeElapsed = 0;
    timer = setInterval(() => {
        timeElapsed++;
    }, 1000);
}

function updateGameInfo() {
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('errorCount').textContent = errors;
}

function keyPressed(note) {
    if (correctAnswers === 0) {
        startGame();
    }
    // Logique pour vérifier la note
    const currentNote = noteToGuessElement.textContent.split(' : ')[1]; // Note à deviner
    const isCorrect = (note === currentNote || noteMapping[note] === currentNote); // Comparaison directe
    if (isCorrect) {
        correctAnswers++;
        updateGameInfo(); // Met à jour les infos du jeu
        if (correctAnswers === 20) {
            clearInterval(timer);
            document.getElementById('finalTime').textContent = timeElapsed;
            document.getElementById('gameInfo').style.display = 'block'; // Assurez-vous que les infos du jeu sont visibles
            document.getElementById('restartButton').style.display = 'block'; // Afficher le bouton pour recommencer le jeu
            // Désactiver les événements de clic sur les touches
            document.querySelectorAll('.key').forEach(key => {
                key.removeEventListener('click', keyPressed);
            });
        }
    } else {
        errors++;
        updateGameInfo(); // Met à jour les infos du jeu
    }
    highlightKey(note, isCorrect);
    // Jouer le son seulement si la note est correcte
    if (isCorrect) {
        playSound(note); // Jouer le son correspondant
    }
    updateNoteToGuess();
}

// Événement de clic sur les touches du piano
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        const note = key.dataset.note; // Note en notation FR
        keyPressed(note);
    });
});

// Fonction pour jouer le son correspondant à la note
function playSound(note) {
    const audio = new Audio(`sounds/${note}.mp3`); // Chemin vers le fichier audio
    audio.play();
}

// Initialiser l'application
updateNoteToGuess();

document.getElementById('restartButton').addEventListener('click', () => {
    correctAnswers = 0;
    errors = 0;
    timeElapsed = 0;
    document.getElementById('finalTime').textContent = '0';
    document.getElementById('correctCount').textContent = '0';
    document.getElementById('errorCount').textContent = '0';
    // Ne pas cacher le conteneur des infos du jeu
    document.getElementById('gameInfo').style.display = 'block';
    document.getElementById('restartButton').style.display = 'none'; // Cacher le bouton après redémarrage
    updateNoteToGuess(); // Remettre à jour la note à deviner
    startGame(); // Redémarrer le jeu
    // Réactiver les événements de clic sur les touches
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', keyPressed);
    });
});