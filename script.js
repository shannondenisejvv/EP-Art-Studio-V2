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
    return potteryTrack.clientWidth * 0.8;
  }

  const gap = parseFloat(
    getComputedStyle(potteryTrack).gap
  ) || 0;

  return firstSlide.getBoundingClientRect().width + gap;
}

function snapToNearestSlide() {

  if (!potteryTrack) return;

  const slideAmount = getSlideAmount();

  if (!slideAmount) return;

  const nearestIndex = Math.round(
    potteryTrack.scrollLeft / slideAmount
  );

  potteryTrack.scrollTo({
    left: nearestIndex * slideAmount,
    behavior: 'smooth'
  });
}

if (potteryTrack && potteryNext && potteryPrev) {

  /* BUTTONS */

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

  /* DRAGGING */

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasMoved = false;
  let snapTimeout;

  potteryTrack.addEventListener('pointerdown', (event) => {

    isDown = true;
    hasMoved = false;

    startX = event.clientX;
    scrollLeft = potteryTrack.scrollLeft;

    potteryTrack.classList.add('dragging');

    potteryTrack.setPointerCapture(event.pointerId);

  });

  potteryTrack.addEventListener('pointermove', (event) => {

    if (!isDown) return;

    const walk = event.clientX - startX;

    if (Math.abs(walk) > 4) {
      hasMoved = true;
    }

    potteryTrack.scrollLeft = scrollLeft - walk;

  });

  function endDrag(event) {

    if (!isDown) return;

    isDown = false;

    potteryTrack.classList.remove('dragging');

    try {
      potteryTrack.releasePointerCapture(event.pointerId);
    } catch (error) {}

    if (hasMoved) {

      clearTimeout(snapTimeout);

      snapTimeout = setTimeout(() => {
        snapToNearestSlide();
      }, 80);

    }
  }

  potteryTrack.addEventListener('pointerup', endDrag);

  potteryTrack.addEventListener('pointercancel', endDrag);

  potteryTrack.addEventListener('pointerleave', endDrag);

  /* SNAP AFTER SCROLL */

  potteryTrack.addEventListener('scroll', () => {

    clearTimeout(snapTimeout);

    snapTimeout = setTimeout(() => {
      snapToNearestSlide();
    }, 140);

  }, {
    passive: true
  });
}
