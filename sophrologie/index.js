const btn = document.querySelector(".btn");
const Video = document.querySelector(".custom-video-player-sophrologie");
const close = document.querySelector(".close");
btn.onclick = () => {
  btn.classList.add("active");
  Video.classList.add("active");
};
close.onclick = () => {
  btn.classList.remove("active");
  Video.classList.remove("active");
};
