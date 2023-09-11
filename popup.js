let seconds = 0;
const timer = {
  seconds : 0,
  minutes : 0,
}
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
    seconds--; // décompte
    localStorage.setItem("timerNew", seconds); //  clé qui garde la valeur en mémoire, et permet d'enregistrer a l'actualisation
    updateTimerDisplay(seconds);

    if (seconds === 5 || seconds <= 0) {
      showPopUp(); // quand le temps est écoulé la poppup s'ouvre
      stopTimer(); // le temps s'arrete
      //ajout de l'alarme
      if (alarme) {
        alarme.play();
      }
      if (Notification.permission === "granted") {
        const text = seconds === "Take a break!";
        new Notification(text);
        if (seconds === 5) {
          const popup = window.open(
            "minipopup.html",
            "Take a break!",
            "width=700,height=30,left=100,top=100",
            "z-index=100",
          );
          
        }
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
  // récupère le temps dans le html
  // const timerElement = document.getElementById("timer");
  // // if (timerElement) {
  // //   timerElement.textContent = `Temps de travail :  ${seconds} secondes`; // création de texte quand le temps est écoulé
  // // }
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
}

function hidePopup() {
  document.getElementById("modal").style.display = "none"; // récupère l'élement html modal pour l'afficher en poppup
  document.getElementById("time").style.display = "block";
}

const modal = document.getElementById("modal");

// document.addEventListener("DOMContentLoaded", () => {
//   if ("Notification" in window) {
//     if (
//       Notification.permission !== "granted" &&
//       Notification.permission !== "denied"
//     ) {
//       Notification.requestPermission().then(function (permission) {
//         if (permission === "granted") {
//           new Notification(
//             "Awesome! You will be notified at the start of each session"
//           );
//           showPopUp();
//         }
//       });
//     }
//   }
// });
