export const bumbleSwipingScriptBody = `
if (window._automatcherExecution) {
  clearTimeout(window._automatcherExecution);
}

let likeButton, dislikeButton;

function _getLikeButton() {
  if (!likeButton) {
    try {
      likeButton = document.querySelectorAll('.encounters-controls__actions .encounters-controls__action')[2].children[0]
    } catch {
      likeButton = document.querySelectorAll('.encounters-controls__actions .encounters-controls__action')[1].children[0]
    }
  }
  if (!likeButton) {
    console.error('Could not find the like button')
  }
  return likeButton
}

function _getDislikeButton() {
  if (!dislikeButton) {
    dislikeButton = document.querySelectorAll('.encounters-controls__actions .encounters-controls__action')[0].children[0]
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
  const scrollableViews = Array.from(document.querySelectorAll('.encounters-album__story'))
  if (!scrollableViews || !scrollableViews[1]) {
    console.log('debug::WAIT::');
    const wait = new Promise((resolve) => {
      setTimeout(() => {
        return resolve()
      }, 1500)
    })
    return wait.then(() => explorePhotos())
  }
  return new Promise((resolve) => {
    let maxContinue = 5;
    let currentIdx = 0;
    let attempts = 0;
    if (scrollableViews.length === 0 || attempts >= maxContinue) {
      resolve();
      return;
    }
    function goNextPhoto() {
      try {
        attempts += 1
        if (attempts >= maxContinue) {
          return resolve();
        }
        const upOrDown = (() => {
          if (currentIdx === 0) {
              return 'down';
          }
          if (currentIdx === scrollableViews.length - 1) {
              return 'up'
          }
          const rand = Math.random()
          console.log('debug::', rand);
          return rand > 0.25 ? 'down' : 'up';
        })();
        console.log('debug::upOrDown::', upOrDown, { currentIdx, scrollableViews: scrollableViews.length })
        if (upOrDown === 'up') {
          currentIdx -= 1;
          document.getElementById('x-scroll-up').click()
        } else if (upOrDown === 'down') {
          currentIdx += 1;
          document.getElementById('x-scroll-down').click()
        }
        setTimeout(goNextPhoto, _randomMS(1000))
      } catch (e) {
        resolve();
      }
    }
    goNextPhoto();
  });
}

function createClickEvent() {
    return new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 20,
        /* whatever properties you want to give it */
    });
}

function likeTheProfile() {
  console.log('debug::likeTheProfile::');
  return new Promise((resolve) => {
    _getLikeButton().dispatchEvent(createClickEvent());
    resolve();
  })
}

function dislikeTheProfile() {
  console.log('debug::dislikeTheProfile::');
  return new Promise((resolve) => {
    _getDislikeButton().dispatchEvent(createClickEvent());
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

/**
 * INSERT THIS BEFORE using the extension.


function onClickDown() {
  function fireKey(el, keyCode, key)
  {
      //Set key to corresponding code. This one is set to the left arrow key.
      if(document.createEventObject) {
        console.log('#1')
          let eventObj = document.createEventObject();
          eventObj.keyCode = keyCode;
          eventObj.key = key;
          el.fireEvent("onkeydown", eventObj);   
      } else if(document.createEvent) {
        console.log('#2')
          let eventObj = document.createEvent("Events");
          eventObj.initEvent("keydown", true, true);
          eventObj.which = key;
          eventObj.key = key;
          el.dispatchEvent(eventObj);
      }
  }
  fireKey(window, 40, 'ArrowDown');
}

function onClickUp() {
  function fireKey(el, keyCode, key)
  {
      //Set key to corresponding code. This one is set to the left arrow key.
      if(document.createEventObject) {
        console.log('#1')
          let eventObj = document.createEventObject();
          eventObj.keyCode = keyCode;
          eventObj.key = key;
          el.fireEvent("onkeydown", eventObj);   
      } else if(document.createEvent) {
        console.log('#2')
          let eventObj = document.createEvent("Events");
          eventObj.initEvent("keydown", true, true);
          eventObj.which = key;
          eventObj.key = key;
          el.dispatchEvent(eventObj);
      }
  }
  fireKey(window, 40, 'ArrowUp');
}


const downButton = document.createElement('button')
downButton.setAttribute('id', 'x-scroll-down');
downButton.innerText = 'Arrow move Down';
downButton.addEventListener('click', onClickDown)
const upButton = document.createElement('button')
upButton.setAttribute('id', 'x-scroll-up');
upButton.innerText = 'Arrow move UP';
upButton.addEventListener('click', onClickUp)
document.body.appendChild(downButton)
document.body.appendChild(upButton)

 */

export const startBumbleSwiping = () => {
  const matchScript = document.createElement('script');
  matchScript.innerHTML = bumbleSwipingScriptBody;
  document.body.appendChild(matchScript);
};
