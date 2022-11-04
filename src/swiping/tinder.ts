export const tinderSwipingScriptBody = `
if (window._automatcherExecution) {
  clearTimeout(window._automatcherExecution);
}

let likeButton, dislikeButton;

function _getLikeButton() {
  if (!likeButton) {
    likeButton = Array.from(document.querySelectorAll('button')).find(button => button.className.includes('ds-background-like'))
  }
  if (!likeButton) {
    console.error('Could not find the like button')
  }
  return likeButton
}

function _getDislikeButton() {
  if (!dislikeButton) {
    dislikeButton = Array.from(document.querySelectorAll('button')).find(button => button.className.includes('ds-background-nope'))
  }
  if (!dislikeButton) {
    console.error('Could not find the dislike button')
  }
  return dislikeButton
}

function _randomMS(buffer) {
  return Math.random() * 250 + buffer
}

function _randomRange(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min
}

function explorePhotos() {
  const tappableViews = Array.from(document.querySelectorAll('.tappable-view'))
  if (!tappableViews || !tappableViews[1]) {
    console.log('debug::WAIT::');
    const wait = new Promise((resolve) => {
      setTimeout(() => {
        return resolve()
      }, 1500)
    })
    return wait.then(() => explorePhotos())
  }
  const otherPhotoIndicators = Array
      .from(tappableViews[1].querySelectorAll('button'))
      .filter(button => button.className.includes('background-tappy-indicator-inactive'))

  return new Promise((resolve) => {
    if (otherPhotoIndicators.length === 0) {
      resolve();
      return;
    }

    const photosExplored = {}
    let maxContinue = Math.max(5, otherPhotoIndicators.length / 2);

    function tapNextPhoto() {
      const shouldContinue = _randomRange(0, maxContinue)
      maxContinue--;
      console.log('debug::shouldContinue::', shouldContinue);
      if (shouldContinue === 0 && Object.values(photosExplored).length > 0) {
        resolve();
        return;
      }
      for (let i = 0; i < 5; i++) {
        const nextIdx = _randomRange(0, otherPhotoIndicators.length - 1);
        if (!photosExplored[nextIdx]) {
          photosExplored[nextIdx] = true;
          otherPhotoIndicators[nextIdx].click();
          break;
        }
      }
      setTimeout(tapNextPhoto, _randomMS(1000))
    }
    tapNextPhoto();
  });
}

function likeTheProfile() {
  return new Promise((resolve) => {
    _getLikeButton().click();
    resolve();
  })
}

function dislikeTheProfile() {
  return new Promise((resolve) => {
    _getDislikeButton().click();
    resolve();
  })
}

function delay(buffer = 250) {
  return new Promise((resolve) => {
    setTimeout(resolve, _randomMS(buffer))
  })
}

function findNextMatch() {
  let probability = Math.random()
  if (probability < 0.025) {
    dislikeTheProfile()
      .then(() => delay())
      .then(() => findNextMatch());
  } else if (probability < 0.07) {
    explorePhotos()
      .then(() => dislikeTheProfile())
      .then(() => delay())
      .then(() => findNextMatch());
  } else if (probability < 0.3) {
    explorePhotos()
      .then(() => likeTheProfile())
      .then(() => delay())
      .then(() => findNextMatch());
  } else {
    likeTheProfile()
      .then(() => delay())
      .then(() => findNextMatch());
  }
}

window._automatcherExecution = setTimeout(findNextMatch, 1000)
`;

export const startTinderSwiping = () => {
  const matchScript = document.createElement('script');
  matchScript.innerHTML = tinderSwipingScriptBody;
  document.body.appendChild(matchScript);
};
