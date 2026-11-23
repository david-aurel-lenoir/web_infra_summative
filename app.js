const noticeInput = document.querySelector("#notice-input");
const characterCount = document.querySelector("#character-count");
const analyzeButton = document.querySelector("#analyze-button");
const sampleButton = document.querySelector("#sample-button");
const clearButton = document.querySelector("#clear-button");
const mainStatus = document.querySelector("#main-status");
const results = document.querySelector("#results");
const plainDraft = document.querySelector("#plain-draft");
const keyPoints = document.querySelector("#key-points");
const datelist = document.querySelector("#date-list");
const dateEmpty = document.querySelector("#date-empty");
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskEmpty = document.querySelector("#task-empty");
const copyButton = document.querySelector("#copy-button");
const wordForm = document.querySelector("#word-form");
const wordInput = document.querySelector("#word-input");
const wordButton = document.querySelector("#word-button");
const wordStatus = document.querySelector("#word-status");
const definitionResult = document.querySelector("#definition-result");
const serverStatus = document.querySelector("#server-status");

const defaultConfig = {
    dictionaryUrl: "https://api.dictionaryapi.dev/api/v2/entries/en"
};
const sampleNotice = "Please be advised that all students are required to submit the completed registration form prior to April 30, 2026. In the event that you need assistance, contact the school office at 555-0182";
let config = { ...defaultConfig };
let tasks = []; let latestPlainDraft = "";
const actionWords = /\b(please|required|must|need to|submit|complete|bring|pay|contact|attend|return|respond|register|renew|provide|sign|visit|call|send|book|make sure|ensure|due)\b/i;
const monthNames =
"January|February|March|April|May|June|July|August|September|October|November|December";
const dataPatterns = [
    /\b\d{4}-\d{1,2}-\d{1,2}\b/g,
  /\b\d{1,2}[/.]\d{1,2}[/.]\d{2,4}\b/g,
  new RegExp(`\\b(?:${monthNames})\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s+\\d{4})?\\b`, "gi"), new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:of\\s+)?(?:${monthNames})(?:,?\\s+\\d{4})?\\b`, "gi"),
  /\b(?:today|tomorrow|next\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday))\b/gi
];
function setMainStatus(message, isError = false) {
    mainStatus.textContent = message;
    mainStatus.classList.toggle("error", isError);
}
function updateCharacterCount() {
    characterCount.textContent = `${noticeInput.ariaValueMax.length} / 8000 characters`;
}
