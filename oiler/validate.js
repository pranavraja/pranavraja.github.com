// see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

async function validate() {
    const txt = document.getElementById('answer');
    const attempt = txt.value.trim() + "\n";
    const expectedHash = txt.getAttribute('data-hash');
    const actualHash = await digestMessage(attempt);
    if (expectedHash != actualHash) {
        alert('sorry you got the wrong answer');
    } else {
        alert('correct! move on to the next one');
    }
}

document.getElementById('check').addEventListener('click', validate, false);
