const CLASSROOM_LANGUAGES = {
  bsl: {
    label: 'BSL',
    name: 'British Sign Language',
    local(letter) { return `./assets/bsl/${letter}.svg`; },
    remote(letter) { return `https://commons.wikimedia.org/wiki/Special:FilePath/BSL_letter_${letter}.svg`; },
  },
  asl: {
    label: 'ASL',
    name: 'American Sign Language',
    local(letter) { return `./assets/asl/${letter}.svg`; },
    remote(letter) { return `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${letter}.svg`; },
  },
};

let classroomLanguage = 'bsl';

const wordsInput = document.querySelector('#classroom-words');
const preview = document.querySelector('#classroom-preview');
const generate = document.querySelector('#classroom-generate');
const printButton = document.querySelector('#classroom-print');
const quiz = document.querySelector('#classroom-quiz');
const classroomStatus = document.querySelector('#classroom-status');
const classroomTemplate = document.querySelector('#classroom-template');
const classroomPrintLanguage = document.querySelector('#classroom-print-language');
const languageButtons = [...document.querySelectorAll('[data-classroom-language]')];

function isBlockedClassroomInput(value) {
  return Boolean(window.SignMyWordModeration?.check(value)?.blocked);
}

function cleanClassroomText(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z\s'\-\n]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function classroomLines(value) {
  return cleanClassroomText(value)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function classroomItems() {
  return classroomLines(wordsInput.value)
    .filter((item) => !isBlockedClassroomInput(item))
    .slice(0, 10);
}

function classroomImage(letter) {
  const config = CLASSROOM_LANGUAGES[classroomLanguage];
  const image = document.createElement('img');
  image.src = config.local(letter);
  image.alt = `${config.name} fingerspelling for ${letter}`;
  image.loading = 'eager';
  image.dataset.source = 'local';

  image.addEventListener('error', () => {
    if (image.dataset.source === 'local') {
      image.dataset.source = 'remote';
      image.src = config.remote(letter);
    }
  });

  return image;
}

function letterCard(letter) {
  const card = document.createElement('div');
  card.className = 'classroom-letter';

  const label = document.createElement('strong');
  label.textContent = letter;

  card.append(label, classroomImage(letter));
  return card;
}

function phraseBlock(value) {
  const section = document.createElement('article');
  section.className = 'classroom-word';

  const title = document.createElement('h2');
  title.textContent = value;

  const letters = document.createElement('div');
  letters.className = 'classroom-word__letters';

  [...value].forEach((char) => {
    if (/[A-Z]/.test(char)) letters.appendChild(letterCard(char));
  });

  section.append(title, letters);
  return section;
}

function renderAlphabetPoster() {
  const section = document.createElement('article');
  section.className = 'classroom-word';
  const title = document.createElement('h2');
  title.textContent = `${CLASSROOM_LANGUAGES[classroomLanguage].label} fingerspelling alphabet A–Z`;
  const letters = document.createElement('div');
  letters.className = 'classroom-word__letters';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => letters.appendChild(letterCard(letter)));
  section.append(title, letters);
  return section;
}

function renderClassroom() {
  const allItems = classroomLines(wordsInput.value);
  const blockedCount = allItems.filter(isBlockedClassroomInput).length;
  const items = classroomItems();
  const mode = classroomTemplate?.value || 'worksheet';
  document.body.classList.toggle('classroom-name-cards', mode === 'name-cards');
  document.body.classList.toggle('classroom-alphabet', mode === 'alphabet');
  preview.replaceChildren(...(mode === 'alphabet' ? [renderAlphabetPoster()] : items.map(phraseBlock)));

  if (classroomStatus) {
    classroomStatus.textContent = blockedCount
      ? `${blockedCount} ${blockedCount === 1 ? 'word or phrase was' : 'words or phrases were'} not added because ${blockedCount === 1 ? 'it is' : 'they are'} blocked.`
      : '';
  }
}

function setClassroomLanguage(language) {
  if (!CLASSROOM_LANGUAGES[language]) return;
  classroomLanguage = language;

  languageButtons.forEach((button) => {
    const active = button.dataset.classroomLanguage === language;
    button.classList.toggle('language-pill--active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (classroomPrintLanguage) {
    classroomPrintLanguage.textContent = `${CLASSROOM_LANGUAGES[language].name} (${CLASSROOM_LANGUAGES[language].label})`;
  }

  renderClassroom();
}

const params = new URLSearchParams(window.location.search);
const initialLanguage = params.get('lang');
const initialWords = params.get('words');

if (CLASSROOM_LANGUAGES[initialLanguage]) classroomLanguage = initialLanguage;
if (initialWords) wordsInput.value = cleanClassroomText(initialWords);

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setClassroomLanguage(button.dataset.classroomLanguage));
});

generate.addEventListener('click', renderClassroom);
classroomTemplate?.addEventListener('change', renderClassroom);
printButton.addEventListener('click', () => window.print());
quiz.addEventListener('change', () => {
  document.body.classList.toggle('quiz-mode', quiz.checked);
});

setClassroomLanguage(classroomLanguage);
