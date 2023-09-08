let seconds = 0;
const maClasseElement = document.querySelector("body");
maClasseElement.style.backdropFilter = "blur";

// créer un nouvel élement
const newParagraph = document.createElement("modal");

// Ajoutez du contenu au paragraphe (facultatif)
//newParagraph.textContent = `Temps de travail : ${seconds} secondes`;

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

//Démarrer le minuteur une fois que la page est chargée
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

// Sélectionnez l'élément par son ID
const button = document.querySelector("button");

// Ajoutez un écouteur d'événements de clic
button.addEventListener("click", function () {
  resumeTimer();
});

let intervalId;
let isTimerActive = false; // le timer est nul

function startTimer() {
  seconds = localStorage.getItem("timerNew");
  console.log("je suis dans startTimer avec : ", seconds);
  isTimerActive = true; // le décompte commence
  intervalId = setInterval(function () {
    //  setInterval arrêter le timer
    seconds--; // décompte
    localStorage.setItem("timerNew", seconds); //  clé qui garde la valeur en mémoire, et permet d'enregistrer a l'actualisation
    console.log("je mets à jour dans startTimer avec : ", seconds);

    updateTimerDisplay(seconds);
    if (seconds === 5 || seconds <= 0) {
      showPopUp(); // quand le temps est écoulé la poppup s'ouvre
      stopTimer(); // le temps s'arrete
    }
  }, 1000); // 1000 = 1 seconde
}

function stopTimer() {
  isTimerActive = false; // on arrete le timer
  clearInterval(intervalId); // remettre le compteur a zéro
  localStorage.removeItem("timerSeconds"); // supprime de la mémoire faut pas le faire pour partager le timer
}

function updateTimerDisplay() {
  // récupère le temps dans le html
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = `Temps de travail : ${seconds} secondes`; // création de texte quand le temps est écoulé
  }
}

function resumeTimer() {
  console.log("je suis dans resumeTimer");
  // reprends le temps là ou tu t'es arrêté
  if (!isTimerActive) {
    // si le timer est différent de faux

    const storedSecondsNew = localStorage.getItem("timerNew");

    console.log(storedSecondsNew);
    if (storedSecondsNew > 0) {
      seconds = parseInt(storedSecondsNew); // timerSeconds est récupéré en chiffre
      hidePopup();

      startTimer(); // le timer repart au moment ou on s'est arrêté
    } else {
      localStorage.setItem("timerNew", 20);
      hidePopup();
      startTimer();
    }
  }
}

// storage to set and track timer variables on load
localStorage.getItem(["timerNew"], (res) => {
  localStorage.setItem({
    timerNew: "timerNew" in res ? res.timerNew : 100,
  });
});
window.onload = startTimer; // fenêtre ouverte le timer commence

function showPopUp() {
  document.getElementById("modal").style.display = "block"; // récupère l'élement html modal pour l'afficher en poppup
  document.getElementById("time").style.display = "none";
}

function hidePopup() {
  document.getElementById("modal").style.display = "none"; // récupère l'élement html modal pour l'afficher en poppup
  document.getElementById("time").style.display = "block";
}

const modal = document.getElementById("modal");
