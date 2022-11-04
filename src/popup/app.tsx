import { startTinderSwiping, tinderSwipingScriptBody } from '@/swiping/tinder';

const extensionVersion = chrome.runtime.getManifest().manifest_version;

export const App = () => {
  const handleTinderClick = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const curId = tabs[0].id;
      if (curId) {
        console.log(extensionVersion);
        if (extensionVersion === 3) {
          chrome.scripting.executeScript({
            target: { tabId: curId },
            func: startTinderSwiping,
            args: []
          });
        } else {
          chrome.tabs.executeScript(curId, {
            code: tinderSwipingScriptBody
          });
        }
      }
    });
  };

  const handleBumbleClick = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const curId = tabs[0].id;
      if (curId) {
        console.log(extensionVersion);
        if (extensionVersion === 3) {
          chrome.scripting.executeScript({
            target: { tabId: curId },
            func: startTinderSwiping,
            args: []
          });
        } else {
          chrome.tabs.executeScript(curId, {
            code: tinderSwipingScriptBody
          });
        }
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleTinderClick}
        style={{
          background: '#ff0000',
          borderRadius: 4,
          fontSize: 16,
          padding: '10px 15px',
          color: 'white'
        }}
      >
        Start swiping on Tinder
      </button>
      <button
        onClick={handleBumbleClick}
        style={{
          background: '#ffff000',
          borderRadius: 4,
          fontSize: 16,
          padding: '10px 15px',
          color: 'white'
        }}
      >
        Start swiping on Bumble
      </button>
    </div>
  );
};
