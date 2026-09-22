const STORAGE_KEY = "tornproject.apiKey";

const form = document.querySelector("#key-form");
const saved = document.querySelector("#key-saved");
const input = document.querySelector("#api-key");
const errorEl = document.querySelector("#key-error");
const savedMask = document.querySelector("#key-mask");
const savedNote = document.querySelector("#saved-note");
const toggle = document.querySelector("#toggle-visibility");
const reveal = document.querySelector("#reveal-key");
const removeButton = document.querySelector("#remove-key");

function readKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function looksLikeTornKey(key) {
  return /^[A-Za-z0-9]{16}$/.test(key);
}

function maskKey(key) {
  if (key.length <= 4) {
    return "••••";
  }
  return `•••• •••• •••• ${key.slice(-4)}`;
}

function resetReveal() {
  reveal.textContent = "Show key";
  reveal.setAttribute("aria-pressed", "false");
}

function render() {
  const key = readKey();
  const hasKey = key.length > 0;
  form.hidden = hasKey;
  saved.hidden = !hasKey;
  if (!hasKey) {
    return;
  }
  const showing = reveal.getAttribute("aria-pressed") === "true";
  savedMask.textContent = showing ? key : maskKey(key);
  savedNote.hidden = looksLikeTornKey(key);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const key = input.value.trim();
  if (!key) {
    errorEl.hidden = false;
    errorEl.textContent = "Enter a key first.";
    input.focus();
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    errorEl.hidden = false;
    errorEl.textContent =
      "This browser blocked local storage, so the key could not be saved.";
    return;
  }
  errorEl.hidden = true;
  input.value = "";
  resetReveal();
  render();
});

toggle.addEventListener("click", () => {
  const showing = input.type === "password";
  input.type = showing ? "text" : "password";
  toggle.textContent = showing ? "Hide" : "Show";
  toggle.setAttribute("aria-pressed", String(showing));
});

reveal.addEventListener("click", () => {
  const showing = reveal.getAttribute("aria-pressed") === "true";
  reveal.setAttribute("aria-pressed", String(!showing));
  reveal.textContent = showing ? "Show key" : "Hide key";
  render();
});

removeButton.addEventListener("click", () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    errorEl.hidden = false;
    errorEl.textContent = "This browser blocked local storage, so the key could not be removed.";
    return;
  }
  input.value = "";
  input.type = "password";
  toggle.textContent = "Show";
  toggle.setAttribute("aria-pressed", "false");
  errorEl.hidden = true;
  resetReveal();
  render();
  input.focus();
});

render();
