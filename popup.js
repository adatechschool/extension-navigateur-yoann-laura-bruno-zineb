let seconds = 0;

const maClasseElement = document.querySelector("body");
maClasseElement.style.backdropFilter = "blur";

// créer un nouvel élement
const newParagraph = document.createElement("modal");

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
const button = document.querySelector(".button");

// Ajoutez un écouteur d'événements de clic
button.addEventListener("click", function () {
  resumeTimer();
});

let intervalId;
let isTimerActive = false; // le timer est nul
const alarme = document.getElementById("song");

function startTimer() {
  seconds = localStorage.getItem("timerNew");
  isTimerActive = true; // le décompte commence
  intervalId = setInterval(function () {
    //  setInterval arrêter le timer
    if (seconds > 0) {
      seconds--; // décompte
      localStorage.setItem("timerNew", seconds); //  clé qui garde la valeur en mémoire, et permet d'enregistrer a l'actualisation
      updateTimerDisplay(seconds);
    }
    if (seconds === 5 || seconds <= 0) {
      showPopUp(); // quand le temps est écoulé la poppup s'ouvre
      stopTimer(); // le temps s'arrete
      //ajout de l'alarme
      if (alarme) {
        alarme.play();
      }
    }
  }, 1000); // 1000 = 1 seconde
}

function stopTimer() {
  isTimerActive = false; // on arrete le timer
  clearInterval(intervalId); // remettre le compteur a zéro
  localStorage.removeItem("timerSeconds"); // supprime de la mémoire faut pas le faire pour partager le timer
}

function updateTimerDisplay() {
  const minutes = Math.floor(seconds / 60);
  const tseconds = seconds % 60;

  // Mettre à jour l'affichage du temps
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0"
  );
}

// Appeler la fonction de mise à jour toutes les 1000 millisecondes (1 seconde)
const interval2 = setInterval(updateTimerDisplay, 1000);
updateTimerDisplay();

function resumeTimer() {
  // si le timer est actif
  // reprends le temps là ou tu t'es arrêté
  if (!isTimerActive) {
    // si le timer est différent de faux

    const storedSecondsNew = localStorage.getItem("timerNew");

    if (storedSecondsNew > 0) {
      seconds = parseInt(storedSecondsNew); // timerSeconds est récupéré en chiffre
      hidePopup();

      startTimer(); // le timer repart au moment ou on s'est arrêté
    } else {
      localStorage.setItem("timerNew", 1 * 10);
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
  run_blur("body { filter: blur(0.5rem); }"); // on floute l'onglet courant
}

function hidePopup() {
  document.getElementById("modal").style.display = "none"; // récupère l'élement html modal pour l'afficher en poppup
  document.getElementById("time").style.display = "block";
  run_blur("body { filter: blur(0); }"); // on rend lisible l'onglet courant
}

const modal = document.getElementById("modal");

async function run_blur(css) {
  if (css) {
    // Quand le paramètre css existe et est différent selon le contexte d'appel:
    const [currentTab] = await chrome.tabs.query({
      // on sélectionne via la Chrome API
      active: true, // l'onglet actif
      currentWindow: true // de la fenêtre courante,
    });
    try {
      // puis on tente
      await chrome.scripting.insertCSS({
        // d'insérer la CSS
        css: css, // dont la feuille de style est passée en paramètre
        target: {
          // avec comme cible:
          tabId: currentTab.id // l'identifiant de l'onglet courant,
        }
      });
    } catch (e) {
      // sauf quand une erreur survient
      console.error(e); // alors on l'affiche dans la console en tant qu'erreur.
    }
  }
}
