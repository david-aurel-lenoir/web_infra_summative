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
function simplifyText(text) {
    const replacements = [
    [/please be advised that/gi, "please note that"], [/at your earliest convenience/gi, "as soon as you can"],
    [/in the event that/gi, "if"], [/due to the fact that/gi, "because"],
    [/at this point in time/gi, "now"], [/failure to/gi, "if you do not"],
    [/prior to/gi, "before"], [/subsequent to/gi, "after"],
    [/are required to/gi, "must"], [/is required to/gi, "must"], [/was required to/gi, "must"], [/were required to/gi, "must"], [/required to/gi, "must"], [/make payment/gi, "pay"],
    [/provide notification/gi, "tell"], [/commence/gi, "start"],
    [/terminate/gi, "end"], [/purchase/gi, "buy"],
    [/assistance/gi, "help"], [/regarding/gi, "about"],
    [/utilize/gi, "use"], [/approximately/gi, "about"], [/additional/gi, "more"]
    ];
    let result = text;
    replacements.forEach(([oldText, newText]) => result = result.replace(oldText, newText));
    return result.trim() ;
}
function splitSentences(text) {
    const matches = text.match(/[^.!?\n]+[.!?]?/g) || [];
    return matches.map((sentence) => sentence.trim()). filter(Boolean);
}
function findDates(text) {
    const found = new set();
    datePatterns.forEach((pattern) => {
        (text.match(pattern) || []).forEach((date) => found.add(date));
    });
    return [...found];
}
function makeKeyPoints(text) {
    const sentences = splitSentences(text);
    const important = sentences.filter((sentences) => actionWords.test(sentence) || findDates(senetnce).length > 0);
    const selected = (important.length ? important : sentences).slice(0, 4);
    keyPoints.replaceChildren();
    selected.forEach((sentence) => {
        const item = document.createElement("li");
        item.textContent = simplifyText(sentences);
        ketPoints.append(item);
    });
}
function makeDatesLits(text) {
    const dates = findDates(text);
    datelist.replaceChildren();
    dateEmpty.hidden = dates.length > 0;
    dates.forEach((date) => {
        const context = splitSentences(text).find((sentences) => sentences.toLowerCase().includes(date.toLowerCase()) ) || text;
        const item = document.createElement("li");
        item.className = "date-item";
        const value = document.createElement("span");
        value.className = "date-value";
        value.textContent = date;
        const description = document.createElement("span");
        description.className = "date-context";
        description.textContent = simplifyText(context);
        item.append(value, description);
        datelist.append(item);
    });
}
function makeSuggestedTasks(text) {
  const matching = splitSentences(text).filter((sentence) =>
    actionWords.test(sentence)
  );
  const unique = [...new Set(matching)].slice(0, 8);
  tasks = unique.map((sentence, index) => ({
    id: `suggested-${index}`,
    text: simplifyText(sentence),
    done: false
  }));
  renderTasks();
}
function renderTasks() {
    taskList.replaceChildren();
    taskEmpty.hidden = taskEmpty.length > 0;
    tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " completed" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.dataset.taskId = task.id;
    checkbox.setAttribute("aria-label", `Mark task complete: ${task.text}`);
    const text = document.createElement("span");
    text.textContent = task.text;
    item.append(checkbox, text);
    taskList.append(item);
    });
}
function analyzeNotice() {
  const notice = noticeInput.value.trim();
  if (!notice) {
    setMainStatus('Paste a notice first, then choose "Make it clearer."', true);
    noticeInput.focus();
    return;
  }
  latestPlainDraft = simplifyText(notice);
  plainDraft.textContent = latestPlainDraft;
  makeKeyPoints(notice);
  makeSuggestedTasks(notice);
  makeDateList(notice);
  results.hidden = false;
  setMainStatus("Draft ready. Check the original notice before acting.");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}
function clearNotice() {
    noticeInput.value = "";
    tasks = [];
    latestPlainDraft = "";
    results.hidden = true;
    definitionResult.hidden = true;
    wordStatus.textContent = "";
    wordStatus.classList.remove("error");
    updateCharacterCount();
    setMainStatus("Your notice statys in this browser tab");
    noticeInput.focus();
}
async function copyResults() {
    const taskLines = tasks.map((task) => `${task.done ? "[x]" : "[ ]"} ${task.text}`);
    const dateLines = findDates(noticeInput.value).map((date) => `- ${date}`);
    const parts = [
    "Plain-language draft", latestPlainDraft,
    "Action checklist", taskLines.join("\n") || "No clear action detected.",
    "Dates mentioned", dateLines.join("\n") || "No date recognized."
  ];
  try {
    await navigator.clipboard.writeText(parts.join("\n\n"));
    setMainStatus("Your draft and checklist were copied.");
  } catch (error) {
    setMainStatus("Copying is unavailable. Copy the text manually.", true);
  }
}
function addTask(event) {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    task.push({ id: `manual-${Date.now()}`, text, done: false});
    taskInput.value = "";
    renderTasks();
}
function updateTask(event) {
    const taskId = event.target.dataset.taskId;
    if (!taskId) return;
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    task.done = event.target.checked;
    renderTasks();
}
function renderDefinition(Entry) {
    const meaning = Entry.meanings?.[0];
    const first = meaning?.definition?.[0];
    definitionResult.replaceChildren();
    if (!first) {
        wordStatus.textContent = "No definition was returned for that word";
        wordStatus.classList.add("error");
        definitionResult.hidden = true;
        return;
    }
    const title = document.createElement("p");
    title.calssName = "definition-word";
    title.textContent = Entry.word || wordInput.value.trim();
    const kind = document.createElement("span");
    kind.className = "definition-kind";
    kind.textContent = meaning.partOfSpeech || "Definition";
    const definition = document.createElement("p");
    definition.className = "definition-text";
    definition.textContent = first.definition;
    definitionResult.append(title, kind, definition);
    if (first.example) {
        const example = document.createElement ("p");
        example.className = "definition-text";
        example.textContent = `Example: ${first.example}`;
        definitionResult.append(example);
    }
    const source = document.createElement("a");
    source.className = "defintion-source";
    source.href = "https://dictionaryapi.dev/";
    source.target = "_blank";
    source.rel = "noreferrer";
    source.textContent = "Definition source";
    definitionResult.append(source);
    definitionResult.hidden = false;
}


    
