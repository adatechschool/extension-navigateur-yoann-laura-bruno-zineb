const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const image = document.querySelector(".image");

let degrees = 0;
prev.addEventListener("click", () => {
  degrees += 45;
  image.style = `transform: perspective(1000px) rotateY(${degrees}deg)`;
});

next.addEventListener("click", () => {
  degrees -= 45;
  image.style = `transform: perspective(1000px) rotateY(${degrees}deg)`;
});
