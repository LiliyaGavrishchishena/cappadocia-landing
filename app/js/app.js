let position = 0;
const slidesToScroll = 1;
const slideToShow = 1;

const slider = document.querySelector(".fairy-tail__slider");
const track = document.querySelector(".fairy-tail__track");
const items = document.querySelectorAll(".fairy-tail__item");
const prev = document.querySelector(".fairy-tail__prev");
const next = document.querySelector(".fairy-tail__next");
const itemsCount = items.length;

const itemWidth = slider.clientWidth / slideToShow;
const movePosition = slidesToScroll * itemWidth;

items.forEach((item) => {
  item.style.minWidth = `${itemWidth}px`;
});

next.addEventListener("click", () => {
  console.log("next");
  const itemsLeft =
    itemsCount - (Math.abs(position) + slideToShow * itemWidth) / itemWidth;
  position -=
    itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;
  setPosition();
  checkButtons();
});

prev.addEventListener("click", () => {
  console.log("prev");
  const itemsLeft = Math.abs(position) / itemWidth;
  position +=
    itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;
  setPosition();
  checkButtons();
});

const setPosition = () => {
  track.style.transform = `translateX(${position}px)`;
};

const checkButtons = () => {
  prev.disabled = position === 0;
  next.disabled = position <= -(itemsCount - slideToShow) * itemWidth;
};

checkButtons();
