let lastNote = null; // Variable pour stocker la dernière note choisie

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
    'B': 'Si',
    'Do#': 'C#',
    'Ré#': 'D#',
    'Fa#': 'F#',
    'Sol#': 'G#',
    'La#': 'A#',
    'C#': 'Do#',
    'D#': 'Ré#',
    'F#': 'Fa#',
    'G#': 'Sol#',
    'A#': 'La#'
};

function choisirNote() {
    const notationSystem = document.getElementById('notation-system').value;
    const notesLatines = ['Do', 'Ré', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
    const notesAnglo = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    // Ajouter les notes noires
    const blackKeysLatine = ['Do#', 'Ré#', 'Fa#', 'Sol#', 'La#'];
    const blackKeysAnglo = ['C#', 'D#', 'F#', 'G#', 'A#'];

    let notes = notationSystem === 'latin' ? notesLatines : notesAnglo;

    // Vérifiez si la case à cocher est sélectionnée
    if (document.getElementById('include-black-keys').checked) {
        notes = notes.concat(notationSystem === 'latin' ? blackKeysLatine : blackKeysAnglo);
    }
    
    // Choisir une nouvelle note qui n'est pas la même que la dernière
    let noteAleatoire;
    do {
        noteAleatoire = notes[Math.floor(Math.random() * notes.length)];
    } while (noteAleatoire === lastNote); // Vérifier que la nouvelle note n'est pas la même que la dernière

    lastNote = noteAleatoire; // Mettre à jour la dernière note choisie
    document.getElementById('note').innerText = noteAleatoire; // Afficher la nouvelle note
}

// Appeler choisirNote pour initialiser
choisirNote();


function playAudio(noteCliquee) {
    console.log("ID de la note cliquée :", noteCliquee);
    let audio = document.getElementById(noteCliquee); // Assurez-vous que l'ID est correct
    if (audio && audio.tagName === 'AUDIO') { // Vérifiez que c'est bien un élément audio
        audio.currentTime = 0;
        audio.play().catch(error => {
            console.error("Erreur lors de la lecture de l'audio :", error);
        });
    } else {
        console.error(`Audio avec l'ID ${noteCliquee} non trouvé ou ce n'est pas un élément audio.`);
    }
}

function verifierNote(noteCliquee) {
    const noteToGuessElement = document.getElementById('note'); // Récupérer l'élément contenant la note à deviner
    const currentNote = noteToGuessElement.innerText; // Note à deviner

    const touche = document.querySelector(`.key audio[id="${noteCliquee}"]`).parentElement; // Récupérer le parent <div> de l'élément <audio>

    // Vérifiez si la note cliquée correspond à la note affichée ou à sa version anglo-saxonne
    const isCorrect = (noteCliquee === currentNote || noteMapping[noteCliquee] === currentNote);

    if (touche) { // Vérifiez si touche n'est pas null
        if (isCorrect) {
            touche.classList.add('correct'); // Ajouter la classe pour la couleur verte
            touche.classList.remove('incorrect'); // Enlever la classe rouge si elle existe
            playAudio(noteCliquee); // Joue le son uniquement si c'est correct
        } else {
            touche.classList.add('incorrect'); // Ajouter la classe pour la couleur rouge
            touche.classList.remove('correct'); // Enlever la classe verte si elle existe
        }
        
        // Rafraîchir la note après un délai
        setTimeout(() => {
            touche.classList.remove('correct'); // Réinitialiser la couleur
            touche.classList.remove('incorrect'); // Réinitialiser la couleur
            choisirNote(); // Choisir une nouvelle note
        }, 500); // Délai de 500 millisecondes (0,5 seconde)
    } else {
        console.error(`Touche avec l'ID ${noteCliquee} non trouvée.`);
    }
}

// Fonction d'initialisation
(function init() {
    choisirNote(); // Appeler la fonction pour choisir une note aléatoire

    // Ajouter un gestionnaire d'événements pour le changement de notation
    document.getElementById('notation-system').addEventListener('change', choisirNote);

    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('mousedown', function() {
            const noteCliquee = this.children[0].id; // Obtenir l'ID de l'élément <audio> enfant
            verifierNote(noteCliquee); // Vérifie si la note est correcte
        });
    });
})();