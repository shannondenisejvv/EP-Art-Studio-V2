const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

/* REVEAL ANIMATION */

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

/* POTTERY SLIDER */

const potteryTrack = document.querySelector('.pottery-track');

const potteryNext = document.querySelector(
  '.pottery-slider .next'
);

const potteryPrev = document.querySelector(
  '.pottery-slider .prev'
);

function getSlideAmount() {
  if (!potteryTrack) return 0;

  const firstSlide = potteryTrack.querySelector('img');

  if (!firstSlide) {
    return potteryTrack.clientWidth;
  }

  const gap = parseFloat(
    getComputedStyle(potteryTrack).gap
  ) || 0;

  return firstSlide.getBoundingClientRect().width + gap;
}

if (potteryTrack && potteryNext && potteryPrev) {
  potteryNext.addEventListener('click', () => {
    potteryTrack.scrollBy({
      left: getSlideAmount(),
      behavior: 'smooth'
    });
  });

  potteryPrev.addEventListener('click', () => {
    potteryTrack.scrollBy({
      left: -getSlideAmount(),
      behavior: 'smooth'
    });
  });
}
