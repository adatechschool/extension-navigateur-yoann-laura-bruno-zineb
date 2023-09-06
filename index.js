const maClasseElement = document.querySelector("body");
maClasseElement.style.backdropFilter = "blur";

// créer un nouvel élement
const newParagraph = document.createElement("modal");

// Ajoutez du contenu au paragraphe (facultatif)
newParagraph.textContent = `Temps de travail : ${seconds} secondes`;

// Ajoutez le paragraphe comme enfant de l'élément avec la classe "maClasse"
maClasseElement.appendChild(newParagraph);



// service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((registration) => {
      console.log("Service Worker enregistré avec succès :", registration);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de l'enregistrement du Service Worker :",
        error
      );
    });
}

/ Démarrer le minuteur une fois que la page est chargée
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.controller.postMessage("start");
  }
});
// Écouter les messages du service worker pour mettre à jour le minuteur sur la page
navigator.serviceWorker.addEventListener("message", (event) => {
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = `Temps de travail: ${event.data.seconds} secondes`;
  }
});


let seconds = 10;
let intervalId;
let isTimerActive = false;// le timer est nul 

function startTimer() {
  isTimerActive = true; // le décompte commence
  intervalId = setInterval(function () { //  setInterval arrêter le timer
    seconds--; // décompte 
    updateTimerDisplay(seconds);
    if (seconds === 0) {
      window.onload = resumeTimer; // fenetre se charge et garde en mémoire les secondes
      showPopUp() // quand le temps est écoulé la poppup s'ouvre
      stopTimer() // le temps s'arrete
    }
    localStorage.setItem("timerSeconds", seconds) //  clé qui garde la valeur en mémoire, et permet d'enregistrer a l'actualisation 
  },
    1000); // 1000 = 1 seconde
}

function stopTimer() {
  isTimerActive = false; // on arrete le timer
  clearInterval(intervalId); // remettre le compteur a zéro
  localStorage.removeItem("timerSeconds") // supprime de la mémoire

}

function updateTimerDisplay() { // récupère le temps dans le html
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `Temps de travail : ${seconds} secondes`; // création de texte quand le temps est écoulé
  }

}

function resumeTimer() { // reprends le temps là ou tu t'es arrêté
  if (!isTimerActive) {// si le timer est différent de faux
    const storedSeconds = localStorage.getItem("timerSeconds")// garde en mémoire le décompte 
    if (storedSeconds) {
      seconds = parseInt(storedSeconds) // timerSeconds est récupéré en chiffre
      startTimer(); // le timer repart au moment ou on s'est arrêté
    }
  }
}

window.onload = startTimer; // fenêtre ouverte le timer commence

function showPopUp() {
  document.getElementById("modal").style.display = "block" // récupère l'élement html modal pour l'afficher en poppup
}

const modal = document.getElementById("modal")

