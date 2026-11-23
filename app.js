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
