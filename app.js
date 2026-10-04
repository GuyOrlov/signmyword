const SITE_URL = 'https://signmyword.com/';
const SITE_LABEL = 'signmyword.com';

const state = {
  lang: 'bsl',
  word: 'HELLO',
};

const LANGUAGES = {
  asl: {
    label: 'ASL',
    flag: '🇺🇸',
    name: 'American Sign Language',
    file(letter) {
      return `./assets/asl/${letter}.svg`;
    },
    remoteFile(letter) {
      return `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${letter}.svg`;
    },
    source(letter) {
      return `https://commons.wikimedia.org/wiki/File:Sign_language_${letter}.svg`;
    },
  },
  bsl: {
    label: 'BSL',
    flag: '🇬🇧',
    name: 'British Sign Language',
    file(letter) {
      return `./assets/bsl/${letter}.svg`;
    },
    remoteFile(letter) {
      return `https://commons.wikimedia.org/wiki/Special:FilePath/BSL_letter_${letter}.svg`;
    },
    source(letter) {
      return `https://commons.wikimedia.org/wiki/File:BSL_letter_${letter}.svg`;
    },
  },
};

const el = {
  form: document.querySelector('#word-form'),
  input: document.querySelector('#word-input'),
  output: document.querySelector('#letter-output'),
  outputMeta: document.querySelector('#output-meta'),
  outputLang: document.querySelector('#output-lang'),
  mobileOutputTitle: document.querySelector('#mobile-output-title'),
  mobileOutputMeta: document.querySelector('#mobile-output-meta'),
  shareUrl: document.querySelector('#share-url'),
  copy: document.querySelector('#copy-link'),
  whatsapp: document.querySelector('#share-whatsapp'),
  share: document.querySelector('#share-native'),
  qr: document.querySelector('#qr-code'),
  message: document.querySelector('#form-message'),
  languageButtons: [...document.querySelectorAll('[data-language]')],
  exampleButtons: [...document.querySelectorAll('[data-example]')],
  sourceNote: document.querySelector('#source-note'),
  openImageMaker: document.querySelector('#open-image-maker'),
  imageModal: document.querySelector('#image-modal'),
  closeImageModal: document.querySelector('#close-image-modal'),
  imageModalBackdrop: document.querySelector('[data-close-image-modal]'),
  imageStyleButtons: [...document.querySelectorAll('[data-card-style]')],
  imagePreview: document.querySelector('#share-image-preview'),
  imageLoading: document.querySelector('#share-image-loading'),
  imageModalStatus: document.querySelector('#image-modal-status'),
  downloadShareImage: document.querySelector('#download-share-image'),
  shareImageFile: document.querySelector('#share-image-file'),
  shareCard: document.querySelector('#share-card'),
  shareCardTitle: document.querySelector('#share-card-title'),
  shareCardEmoji: document.querySelector('#share-card-emoji'),
  shareCardLetters: document.querySelector('#share-card-letters'),
  shareCardQr: document.querySelector('#share-card-qr'),
  shareCardLanguage: document.querySelector('#share-card-language'),
  shareCardSite: document.querySelector('#share-card-site'),
  popularSection: document.querySelector('#popular-searches'),
  popularCloud: document.querySelector('#popular-word-cloud'),
  popularSubtitle: document.querySelector('#popular-searches-subtitle'),
  popularTitle: document.querySelector('#popular-searches-title'),
  popularEyebrow: document.querySelector('#popular-searches-eyebrow'),
  popularTotal: document.querySelector('#popular-searches-total'),
  heroWordStats: document.querySelector('#hero-word-stats'),
  surpriseWord: document.querySelector('#surprise-word'),
  recentSection: document.querySelector('#recent-searches'),
  recentChips: document.querySelector('#recent-searches-chips'),
  practiceMode: document.querySelector('#practice-mode'),
  classroomLink: document.querySelector('#classroom-link'),
  copyEmbed: document.querySelector('#copy-embed'),
  imageFormatButtons: [...document.querySelectorAll('[data-card-format]')],
  imageIconButtons: [...document.querySelectorAll('[data-card-icon-mode]')],
  copyImage: document.querySelector('#copy-image'),
  imageCustomise: document.querySelector('#image-customise'),
  imageCustomiseHint: document.querySelector('#image-customise-hint'),
  imageSizeLimitHint: document.querySelector('#image-size-limit-hint'),
  reportProblem: document.querySelector('#report-problem'),
  practicePanel: document.querySelector('#practice-panel'),
  practiceImage: document.querySelector('#practice-image'),
  practiceAnswer: document.querySelector('#practice-answer'),
  practiceProgress: document.querySelector('#practice-progress'),
  practicePrev: document.querySelector('#practice-prev'),
  practiceReveal: document.querySelector('#practice-reveal'),
  practiceNext: document.querySelector('#practice-next'),
  practiceSpeed: document.querySelector('#practice-speed'),
};

let html2canvasLoadPromise = null;

function ensureHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  if (html2canvasLoadPromise) return html2canvasLoadPromise;

  html2canvasLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    script.onload = () => window.html2canvas ? resolve(window.html2canvas) : reject(new Error('Image generator could not load.'));
    script.onerror = () => reject(new Error('Image generator could not load.'));
    document.head.appendChild(script);
  });

  return html2canvasLoadPromise;
}

const shareImageState = {
  style: 'light',
  format: 'portrait',
  iconMode: 'auto',
  blob: null,
  previewUrl: null,
};

const SHARE_FORMATS = {
  portrait: { width: 1080, height: 1350, label: 'portrait' },
  square: { width: 1080, height: 1080, label: 'square' },
  story: { width: 1080, height: 1920, label: 'story' },
};

const SHARE_LIMITS = {
  square: { letters: 10, words: 3 },
  portrait: { letters: 16, words: 4 },
  story: { letters: 24, words: 5 },
};

const AUTO_ICON_RULES = [
  { icon: 'birthday', phrases: ['HAPPY BIRTHDAY'], words: ['BIRTHDAY'] },
  { icon: 'heart', phrases: ['I LOVE YOU'], words: ['LOVE', 'XOXO', 'VALENTINE'] },
  { icon: 'thanks', phrases: ['THANK YOU'], words: ['THANKS'] },
  { icon: 'school', phrases: ['BACK TO SCHOOL'], words: ['SCHOOL', 'CLASS', 'TEACHER', 'STUDENT'] },
  { emoji: '👋', label: 'Greeting icon', phrases: ['GOOD MORNING', 'GOODBYE'], words: ['HELLO', 'HI', 'WELCOME', 'BYE'] },
  { emoji: '👏', label: 'Celebration icon', phrases: ['WELL DONE'], words: ['CONGRATULATIONS'] },
  { emoji: '👐', label: 'Signing icon', phrases: [], words: ['SIGN', 'SIGNING', 'ASL'] },
  { emoji: '👍', label: 'Yes icon', phrases: [], words: ['YES'] },
  { emoji: '👎', label: 'No or bad icon', phrases: [], words: ['NO', 'BAD'] },
  { emoji: '✌️', label: 'Peace or two icon', phrases: [], words: ['PEACE', 'TWO'] },
  { emoji: '👌', label: 'Okay icon', phrases: [], words: ['OK', 'OKAY'] },
];

function normalizedPhrase(value = '') {
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function autoIconForWord(value = '') {
  const normalized = normalizedPhrase(value);
  const tokens = new Set(normalized.split(' ').filter(Boolean));

  // ASL has a recognised “I love you” handshape, so use it instead of a heart.
  if (state.lang === 'asl' && normalized === 'I LOVE YOU') {
    return {
      icon: 'asl-ily',
      emoji: '🤟',
      label: 'ASL I love you handshape',
    };
  }

  for (const rule of AUTO_ICON_RULES) {
    if (rule.phrases.some((phrase) => normalized.includes(phrase))) return rule;
    if (rule.words.some((word) => tokens.has(word))) return rule;
  }

  return null;
}

function currentShareIcon() {
  if (shareImageState.iconMode === 'none') return null;
  return autoIconForWord(state.word);
}

function updateShareCardIcon() {
  if (!el.shareCardEmoji) return;

  const icon = currentShareIcon();
  el.shareCardEmoji.replaceChildren();
  el.shareCardEmoji.className = 'share-card__emoji-badge';
  el.shareCardEmoji.removeAttribute('data-icon');
  el.shareCardEmoji.removeAttribute('aria-label');
  el.shareCardEmoji.removeAttribute('role');

  if (!icon) {
    el.shareCardEmoji.hidden = true;
    return;
  }

  el.shareCardEmoji.dataset.icon = icon.icon;

  if (icon.emoji) {
    el.shareCardEmoji.classList.add('share-card__emoji-badge--text');
    el.shareCardEmoji.textContent = icon.emoji;
    el.shareCardEmoji.setAttribute('role', 'img');
    el.shareCardEmoji.setAttribute('aria-label', icon.label || 'Decorative icon');
  } else {
    const image = document.createElement('img');
    image.src = `./assets/icons/${icon.icon}.png`;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    el.shareCardEmoji.appendChild(image);
  }

  el.shareCardEmoji.hidden = false;
}

const SURPRISE_WORDS = [
  'GOOD MORNING',
  'HAPPY BIRTHDAY',
  'I LOVE YOU',
  'THANK YOU',
  'BEST FRIEND',
  'WELCOME',
  'FAMILY',
  'SMILE',
  'WEEKEND',
  'YOU ARE AMAZING',
];

const RECENT_STORAGE_KEY = 'signmyword-recent-v1';
const METRICS_STORAGE_KEY = 'signmyword-metrics-v1';
let practiceModeActive = false;
let practiceIndex = 0;
let practiceTimer = null;

function trackMetric(name, detail = {}) {
  try {
    const metrics = JSON.parse(localStorage.getItem(METRICS_STORAGE_KEY) || '{}');
    metrics[name] = (Number(metrics[name]) || 0) + 1;

    // Keep anonymous dimensions locally so Insights can show what people use,
    // not only how many times an action happened.
    const dimensions = metrics._dimensions && typeof metrics._dimensions === 'object'
      ? metrics._dimensions
      : {};
    const bump = (group, value) => {
      if (!value) return;
      dimensions[group] = dimensions[group] && typeof dimensions[group] === 'object' ? dimensions[group] : {};
      dimensions[group][String(value)] = (Number(dimensions[group][String(value)]) || 0) + 1;
    };

    if (detail.lang) bump('language', detail.lang);
    if (detail.style) bump('theme', detail.style);
    if (detail.format) bump('format', detail.format);
    if (detail.category) bump('category', detail.category);
    metrics._dimensions = dimensions;

    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
  } catch {
    // Metrics are optional and stay anonymous on this device.
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: `signmyword_${name}`, ...detail });
  }
}

const signAssetCache = new Map();

function revokeShareImagePreview() {
  if (shareImageState.previewUrl) {
    URL.revokeObjectURL(shareImageState.previewUrl);
    shareImageState.previewUrl = null;
  }
}

function invalidateShareImage() {
  shareImageState.blob = null;
  revokeShareImagePreview();

  if (el.imagePreview) {
    el.imagePreview.removeAttribute('src');
    el.imagePreview.hidden = true;
  }

  if (el.imageLoading) {
    el.imageLoading.hidden = false;
    el.imageLoading.textContent = 'Creating preview…';
  }
}

function imageFileName(extension = 'jpg') {
  const safeWord = state.word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'word';

  return `signmyword-${state.lang}-${safeWord}-${shareImageState.format}.${extension}`;
}

function setImageModalStatus(message = '') {
  if (el.imageModalStatus) el.imageModalStatus.textContent = message;
}

function imageChoiceLabel(value = '') {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function sharePhraseMetrics() {
  return {
    letters: letterCount(state.word),
    words: phraseWords(state.word).length,
  };
}

function shareFormatFits(format, metrics = sharePhraseMetrics()) {
  const limit = SHARE_LIMITS[format];
  if (!limit) return false;
  return metrics.letters <= limit.letters && metrics.words <= limit.words;
}

function minimumShareFormat(metrics = sharePhraseMetrics()) {
  if (shareFormatFits('square', metrics)) return 'square';
  if (shareFormatFits('portrait', metrics)) return 'portrait';
  if (shareFormatFits('story', metrics)) return 'story';
  return null;
}

function syncShareFormatAvailability({ autoSelect = false } = {}) {
  const metrics = sharePhraseMetrics();
  const minimum = minimumShareFormat(metrics);

  el.imageFormatButtons.forEach((button) => {
    const format = button.dataset.cardFormat;
    const fits = shareFormatFits(format, metrics);
    button.disabled = !fits;
    button.setAttribute('aria-disabled', String(!fits));
    button.title = fits
      ? ''
      : `Too long for ${imageChoiceLabel(format)}. Maximum: ${SHARE_LIMITS[format].letters} letters and ${SHARE_LIMITS[format].words} words.`;
  });

  if (autoSelect && minimum && !shareFormatFits(shareImageState.format, metrics)) {
    shareImageState.format = minimum;
  }

  el.imageFormatButtons.forEach((button) => {
    const active = button.dataset.cardFormat === shareImageState.format;
    button.classList.toggle('image-format-pill--active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (el.imageSizeLimitHint) {
    if (!minimum) {
      el.imageSizeLimitHint.textContent =
        `Too long for a share image: ${metrics.letters} letters, ${metrics.words} words. Maximum is 24 letters and 5 words.`;
    } else if (minimum === 'story') {
      el.imageSizeLimitHint.textContent =
        `Story selected automatically for ${metrics.letters} letters / ${metrics.words} words.`;
    } else if (minimum === 'portrait') {
      el.imageSizeLimitHint.textContent =
        `Portrait or Story fits this phrase (${metrics.letters} letters / ${metrics.words} words).`;
    } else {
      el.imageSizeLimitHint.textContent =
        `Square, Portrait or Story all fit (${metrics.letters} letters / ${metrics.words} words).`;
    }
  }

  return minimum;
}

function updateImageCustomiseHint() {
  if (!el.imageCustomiseHint) return;

  const iconLabel = shareImageState.iconMode === 'none' ? 'No icon' : 'Auto';
  el.imageCustomiseHint.textContent =
    `${imageChoiceLabel(shareImageState.style)} · ${imageChoiceLabel(shareImageState.format)} · ${iconLabel}`;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), { once: true });
    reader.addEventListener('error', () => reject(reader.error || new Error('Could not read sign image.')), { once: true });
    reader.readAsDataURL(blob);
  });
}

function commonsFileName(language, letter) {
  return language === 'bsl'
    ? `BSL_letter_${letter}.svg`
    : `Sign_language_${letter}.svg`;
}

async function commonsOriginalFileUrl(language, letter) {
  const filename = commonsFileName(language, letter);
  const apiUrl = new URL('https://commons.wikimedia.org/w/api.php');
  apiUrl.searchParams.set('action', 'query');
  apiUrl.searchParams.set('format', 'json');
  apiUrl.searchParams.set('origin', '*');
  apiUrl.searchParams.set('prop', 'imageinfo');
  apiUrl.searchParams.set('iiprop', 'url');
  apiUrl.searchParams.set('titles', `File:${filename}`);

  const response = await fetch(apiUrl, {
    mode: 'cors',
    credentials: 'omit',
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`Could not resolve ${LANGUAGES[language].label} sign for ${letter}.`);
  }

  const data = await response.json();
  const page = Object.values(data?.query?.pages || {})[0];
  const fileUrl = page?.imageinfo?.[0]?.url;

  if (!fileUrl) {
    throw new Error(`No Wikimedia image was found for ${letter}.`);
  }

  return fileUrl;
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.addEventListener('load', () => resolve(image), { once: true });
    image.addEventListener('error', () => reject(new Error('Could not decode sign artwork.')), { once: true });
    image.src = dataUrl;
  });
}

async function rasterizeSignArtworkDataUrl(blob, { crop = false } = {}) {
  const originalDataUrl = await blobToDataUrl(blob);
  const image = await loadImageFromDataUrl(originalDataUrl);

  const naturalWidth = image.naturalWidth || 1000;
  const naturalHeight = image.naturalHeight || 1000;
  const maxDimension = 1400;
  const scale = Math.min(1, maxDimension / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;

  const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: crop });
  if (!sourceContext) throw new Error('Could not prepare sign artwork.');

  sourceContext.clearRect(0, 0, width, height);
  sourceContext.drawImage(image, 0, 0, width, height);

  if (!crop) {
    return sourceCanvas.toDataURL('image/png');
  }

  const pixels = sourceContext.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];

      const visibleInk = alpha > 12 && (red < 247 || green < 247 || blue < 247);
      if (!visibleInk) continue;

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) {
    return sourceCanvas.toDataURL('image/png');
  }

  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  const paddingX = Math.max(6, Math.round(contentWidth * 0.055));
  const paddingY = Math.max(6, Math.round(contentHeight * 0.055));

  const cropX = Math.max(0, minX - paddingX);
  const cropY = Math.max(0, minY - paddingY);
  const cropRight = Math.min(width, maxX + paddingX + 1);
  const cropBottom = Math.min(height, maxY + paddingY + 1);
  const cropWidth = cropRight - cropX;
  const cropHeight = cropBottom - cropY;

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  const croppedContext = croppedCanvas.getContext('2d');
  if (!croppedContext) return sourceCanvas.toDataURL('image/png');

  croppedContext.clearRect(0, 0, cropWidth, cropHeight);
  croppedContext.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return croppedCanvas.toDataURL('image/png');
}

async function signImageDataUrl(language, letter) {
  const cacheKey = `${language}:${letter}:local-png-v4`;
  if (signAssetCache.has(cacheKey)) return signAssetCache.get(cacheKey);

  const config = LANGUAGES[language];
  let response;

  try {
    response = await fetch(config.file(letter), { cache: 'force-cache' });
  } catch {
    response = null;
  }

  if (!response?.ok) {
    const fileUrl = await commonsOriginalFileUrl(language, letter);
    response = await fetch(fileUrl, {
      mode: 'cors',
      credentials: 'omit',
      cache: 'force-cache',
    });
  }

  if (!response?.ok) {
    throw new Error(`Could not load ${config.label} sign for ${letter}.`);
  }

  const blob = await response.blob();
  const dataUrl = await rasterizeSignArtworkDataUrl(blob, {
    crop: language === 'bsl',
  });

  signAssetCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function phraseWords(value) {
  return String(value || '')
    .split(' ')
    .map((item) => item.trim())
    .filter(Boolean);
}

function shareFlagSvg(language) {
  if (language === 'bsl') {
    return `
      <svg class="share-flag-svg" viewBox="0 0 60 36" aria-hidden="true" focusable="false">
        <rect width="60" height="36" fill="#012169"></rect>
        <path d="M0 0L60 36M60 0L0 36" stroke="#ffffff" stroke-width="7.2"></path>
        <path d="M0 0L60 36M60 0L0 36" stroke="#C8102E" stroke-width="4.4"></path>
        <path d="M30 0V36M0 18H60" stroke="#ffffff" stroke-width="12"></path>
        <path d="M30 0V36M0 18H60" stroke="#C8102E" stroke-width="7.2"></path>
      </svg>
    `;
  }

  return `
    <svg class="share-flag-svg" viewBox="0 0 60 36" aria-hidden="true" focusable="false">
      <rect width="60" height="36" fill="#ffffff"></rect>
      <g fill="#B22234">
        <rect y="0" width="60" height="2.77"></rect>
        <rect y="5.54" width="60" height="2.77"></rect>
        <rect y="11.08" width="60" height="2.77"></rect>
        <rect y="16.62" width="60" height="2.77"></rect>
        <rect y="22.16" width="60" height="2.77"></rect>
        <rect y="27.70" width="60" height="2.77"></rect>
        <rect y="33.24" width="60" height="2.76"></rect>
      </g>
      <rect width="24" height="19.4" fill="#3C3B6E"></rect>
      <g fill="#ffffff">
        <circle cx="3.5" cy="3.4" r="1"></circle><circle cx="8" cy="3.4" r="1"></circle><circle cx="12.5" cy="3.4" r="1"></circle><circle cx="17" cy="3.4" r="1"></circle><circle cx="21.5" cy="3.4" r="1"></circle>
        <circle cx="5.8" cy="7.2" r="1"></circle><circle cx="10.3" cy="7.2" r="1"></circle><circle cx="14.8" cy="7.2" r="1"></circle><circle cx="19.3" cy="7.2" r="1"></circle>
        <circle cx="3.5" cy="11" r="1"></circle><circle cx="8" cy="11" r="1"></circle><circle cx="12.5" cy="11" r="1"></circle><circle cx="17" cy="11" r="1"></circle><circle cx="21.5" cy="11" r="1"></circle>
        <circle cx="5.8" cy="14.8" r="1"></circle><circle cx="10.3" cy="14.8" r="1"></circle><circle cx="14.8" cy="14.8" r="1"></circle><circle cx="19.3" cy="14.8" r="1"></circle>
      </g>
    </svg>
  `;
}

async function shareCardLetter(letter, language) {
  const config = LANGUAGES[language];

  const card = document.createElement('div');
  card.className = 'share-card__letter';
  if (language === 'bsl') card.classList.add('share-card__letter--bsl');

  const label = document.createElement('p');
  label.className = 'share-card__letter-name';
  label.textContent = letter;

  const box = document.createElement('div');
  box.className = 'share-card__letter-box';

  const image = document.createElement('img');
  image.alt = `${config.name} fingerspelling for the letter ${letter}`;

  try {
    image.src = await signImageDataUrl(language, letter);
    box.appendChild(image);

    if (image.decode) {
      try {
        await image.decode();
      } catch {
        // The load/error fallback below still protects export if decode is unavailable.
      }
    }
  } catch (error) {
    const visibleImage = [...el.output.querySelectorAll('.letter-card')].find(
      (item) => item.querySelector('.letter-card__letter')?.textContent?.trim() === letter
    )?.querySelector('.letter-card__image img');

    if (visibleImage?.currentSrc || visibleImage?.src) {
      image.src = visibleImage.currentSrc || visibleImage.src;
      box.appendChild(image);
    } else {
      const fallback = document.createElement('strong');
      fallback.textContent = letter;
      fallback.style.fontSize = '54px';
      fallback.style.lineHeight = '1';
      box.appendChild(fallback);
    }
  }

  card.append(label, box);
  return card;
}

function shareColumnsForCount(count, format = shareImageState.format) {
  if (count <= 0) return 1;
  const oneRowMax = format === 'square' ? 5 : 6;
  if (count <= oneRowMax) return count;
  if (count <= 10) return Math.ceil(count / 2);
  if (count <= 12) return 4;
  if (count <= 15) return 5;
  return 4;
}

function applyShareLetterLayout(container, count) {
  if (!container) return;
  const columns = shareColumnsForCount(count);
  container.style.setProperty('--share-columns', String(columns));
  container.dataset.letterCount = String(count);
  container.classList.toggle('share-letter-row', count <= (shareImageState.format === 'square' ? 5 : 6));
  container.classList.toggle('share-letter-balanced', count > (shareImageState.format === 'square' ? 5 : 6));
}

async function shareCardWordGroup(word, language, index) {
  const group = document.createElement('section');
  group.className = 'share-card__word-group';

  const heading = document.createElement('h3');
  heading.className = 'share-card__word-title';
  heading.textContent = word;
  heading.id = `share-card-word-${index}`;

  const letters = document.createElement('div');
  letters.className = 'share-card__word-letters';

  const letterChars = [...word].filter((char) => /[A-Z]/.test(char));
  const cards = await Promise.all(
    letterChars.map((letter) => shareCardLetter(letter, language))
  );

  applyShareLetterLayout(letters, letterChars.length);
  letters.append(...cards);
  group.setAttribute('aria-labelledby', heading.id);
  group.append(heading, letters);
  return group;
}

async function renderShareCard() {
  if (!el.shareCard) return;

  const language = state.lang;
  const config = LANGUAGES[language];
  const word = state.word;
  const count = letterCount(word);
  const words = phraseWords(word);
  const isPhrase = words.length > 1;
  const metrics = { letters: count, words: words.length };

  if (!minimumShareFormat(metrics)) {
    throw new Error('This phrase is too long for a share image. Use 24 letters / 5 words or fewer.');
  }

  if (!shareFormatFits(shareImageState.format, metrics)) {
    throw new Error(`This phrase is too long for ${imageChoiceLabel(shareImageState.format)}. Choose a larger image size.`);
  }

  const format = SHARE_FORMATS[shareImageState.format] || SHARE_FORMATS.portrait;
  el.shareCard.className = `share-card share-card--${shareImageState.style} share-card--format-${shareImageState.format}`;
  el.shareCard.style.width = `${format.width}px`;
  el.shareCard.style.height = `${format.height}px`;
  el.shareCard.parentElement.style.width = `${format.width}px`;

  if (isPhrase) {
    el.shareCard.classList.add('share-card--phrase');
  } else if (count <= 4) {
    el.shareCard.classList.add('share-card--short');
  } else if (count > 12) {
    el.shareCard.classList.add('share-card--very-dense');
  } else if (count > 6) {
    el.shareCard.classList.add('share-card--dense');
  }

  if (el.shareCardLanguage) {
    el.shareCardLanguage.innerHTML = `${shareFlagSvg(language)}<span>${config.label}</span>`;
  }

  el.shareCardTitle.textContent = `How to fingerspell “${word}” in ${config.name} (${config.label})`;
  if (el.shareCardSite) el.shareCardSite.textContent = SITE_LABEL;
  updateShareCardIcon();
  el.shareCardLetters.replaceChildren();
  el.shareCardLetters.className = 'share-card__letters';

  if (isPhrase) {
    el.shareCardLetters.classList.add('share-card__letters--phrase');
    const groups = await Promise.all(
      words.map((singleWord, index) => shareCardWordGroup(singleWord, language, index))
    );
    el.shareCardLetters.append(...groups);
  } else {
    const letters = [...word].filter((char) => /[A-Z]/.test(char));
    applyShareLetterLayout(el.shareCardLetters, letters.length);
    const cards = await Promise.all(letters.map((letter) => shareCardLetter(letter, language)));
    el.shareCardLetters.append(...cards);
  }

  el.shareCardQr.replaceChildren();

  if (window.QRCode) {
    new QRCode(el.shareCardQr, {
      text: shareLink(),
      width: 126,
      height: 126,
      correctLevel: QRCode.CorrectLevel.M,
    });
  }
}

async function waitForShareCardImages() {
  if (!el.shareCard) return;

  const images = [...el.shareCard.querySelectorAll('img')];

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }

      if (image.decode && image.naturalWidth > 0) {
        try {
          await image.decode();
        } catch {
          // A loaded image can still be safely captured if decode() is unsupported.
        }
      }
    })
  );

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

async function generateShareImageBlob() {
  await ensureHtml2Canvas();

  if (el.imageLoading) {
    el.imageLoading.hidden = false;
    el.imageLoading.textContent = 'Creating preview…';
  }
  if (el.imagePreview) el.imagePreview.hidden = true;
  setImageModalStatus('');

  await renderShareCard();

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitForShareCardImages();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const format = SHARE_FORMATS[shareImageState.format] || SHARE_FORMATS.portrait;
  const canvas = await html2canvas(el.shareCard, {
    backgroundColor: null,
    scale: 1,
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: format.width,
    height: format.height,
  });

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error('Could not create the image.'));
    }, 'image/jpeg', 0.9);
  });

  shareImageState.blob = blob;
  revokeShareImagePreview();
  shareImageState.previewUrl = URL.createObjectURL(blob);

  if (el.imagePreview) {
    el.imagePreview.src = shareImageState.previewUrl;
    el.imagePreview.hidden = false;
  }
  if (el.imageLoading) el.imageLoading.hidden = true;

  return blob;
}

async function ensureShareImageBlob() {
  return shareImageState.blob || generateShareImageBlob();
}

async function openImageMaker() {
  if (!el.imageModal) return;

  trackMetric('image_maker_opened', { lang: state.lang });
  const minimumFormat = syncShareFormatAvailability({ autoSelect: true });
  updateImageCustomiseHint();
  el.imageModal.hidden = false;
  document.body.classList.add('modal-open');
  setImageModalStatus('');
  invalidateShareImage();

  if (!minimumFormat) {
    if (el.imageLoading) {
      el.imageLoading.hidden = false;
      el.imageLoading.textContent = 'Phrase too long for a share image';
    }
    setImageModalStatus('Shorten the phrase to 24 letters and 5 words or fewer.');
    return;
  }

  try {
    await generateShareImageBlob();
  } catch (error) {
    if (el.imageLoading) {
      el.imageLoading.hidden = false;
      el.imageLoading.textContent = 'Preview unavailable';
    }
    setImageModalStatus(error?.message || 'Could not create the share image.');
  }
}

function closeImageMaker() {
  if (!el.imageModal) return;

  el.imageModal.hidden = true;
  document.body.classList.remove('modal-open');
  setImageModalStatus('');
  el.openImageMaker?.focus();
}

async function downloadShareImage() {
  try {
    const jpegBlob = await ensureShareImageBlob();
    const blob = await jpegBlobToPngBlob(jpegBlob);
    trackMetric('image_downloaded', { format: shareImageState.format, style: shareImageState.style, file_type: 'png' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = imageFileName('png');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setImageModalStatus('Image downloaded ✓');
  } catch (error) {
    setImageModalStatus(error?.message || 'Could not download the image.');
  }
}

async function shareGeneratedImage() {
  try {
    const blob = await ensureShareImageBlob();
    const file = new File([blob], imageFileName(), { type: 'image/jpeg' });
    const data = {
      title: `How to fingerspell ${state.word}`,
      text: `How to fingerspell “${state.word}” in ${LANGUAGES[state.lang].name} (${LANGUAGES[state.lang].label})`,
      files: [file],
    };

    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      try {
        await navigator.share(data);
        trackMetric('image_shared', { format: shareImageState.format, style: shareImageState.style });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
        throw error;
      }
    }

    await downloadShareImage();
    setImageModalStatus('Your browser cannot share image files directly, so the image was downloaded instead.');
  } catch (error) {
    setImageModalStatus(error?.message || 'Could not share the image.');
  }
}



function jpegBlobToPngBlob(jpegBlob) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(jpegBlob);
    const image = new Image();

    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Could not prepare the image for copying.'));
      }, 'image/png');
    }, { once: true });

    image.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not prepare the image for copying.'));
    }, { once: true });

    image.src = objectUrl;
  });
}

async function copyGeneratedImage() {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      throw new Error('Copy image is not supported in this browser.');
    }

    const jpegBlob = await ensureShareImageBlob();
    let blob = jpegBlob;
    let type = 'image/jpeg';

    if (typeof ClipboardItem.supports === 'function' && !ClipboardItem.supports(type)) {
      blob = await jpegBlobToPngBlob(jpegBlob);
      type = 'image/png';
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [type]: blob }),
      ]);
    } catch (error) {
      if (type !== 'image/png') {
        blob = await jpegBlobToPngBlob(jpegBlob);
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
      } else {
        throw error;
      }
    }

    trackMetric('image_copied', { format: shareImageState.format });
    setImageModalStatus('Image copied ✓');
  } catch (error) {
    setImageModalStatus(error?.message || 'Could not copy the image.');
  }
}

function readRecentSearches() {
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
    return Array.isArray(recent) ? recent : [];
  } catch {
    return [];
  }
}

function recordRecentSearch(word) {
  const entry = { word, lang: state.lang, at: Date.now() };
  const recent = readRecentSearches()
    .filter((item) => item && !(item.word === word && item.lang === state.lang));
  recent.unshift(entry);

  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent.slice(0, 8)));
  } catch {
    // Recent searches are optional and remain on this device.
  }

  }

function renderRecentSearches() {
  if (!el.recentSection || !el.recentChips) return;
  const recent = readRecentSearches().filter((item) => !isBlockedInput(item?.word)).slice(0, 6);
  el.recentChips.replaceChildren();

  if (!recent.length) {
    el.recentSection.hidden = true;
    return;
  }

  recent.forEach((item) => {
    if (!LANGUAGES[item.lang]) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recent-search-chip';
    button.textContent = `${LANGUAGES[item.lang].label} · ${item.word}`;
    button.addEventListener('click', () => {
      state.lang = item.lang;
      setWord(item.word, { track: false, recent: false });
      document.querySelector('.result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    el.recentChips.appendChild(button);
  });

  el.recentSection.hidden = !el.recentChips.children.length;
}

function practiceLetters() {
  return (state.word.match(/[A-Z]/g) || []);
}

function stopPracticeTimer() {
  if (practiceTimer) window.clearInterval(practiceTimer);
  practiceTimer = null;
}

function renderPracticeCard() {
  const letters = practiceLetters();
  if (!letters.length || !el.practicePanel) return;
  practiceIndex = Math.max(0, Math.min(practiceIndex, letters.length - 1));
  const letter = letters[practiceIndex];
  const config = LANGUAGES[state.lang];
  el.practicePanel.hidden = !practiceModeActive;
  if (el.practiceImage) {
    el.practiceImage.src = config.file(letter);
    el.practiceImage.alt = `${config.name} fingerspelling handshape to identify`;
  }
  if (el.practiceAnswer) {
    el.practiceAnswer.textContent = letter;
    el.practiceAnswer.hidden = true;
  }
  if (el.practiceProgress) el.practiceProgress.textContent = `${practiceIndex + 1} of ${letters.length}`;
  if (el.practiceReveal) el.practiceReveal.textContent = 'Reveal answer';
}

function restartPracticeTimer() {
  stopPracticeTimer();
  const seconds = Number(el.practiceSpeed?.value || 0);
  if (!practiceModeActive || !seconds) return;
  practiceTimer = window.setInterval(() => {
    const letters = practiceLetters();
    if (!letters.length) return;
    practiceIndex = (practiceIndex + 1) % letters.length;
    renderPracticeCard();
  }, seconds * 1000);
}

function updatePracticeMode() {
  document.body.classList.toggle('practice-mode', practiceModeActive);
  if (el.practiceMode) {
    el.practiceMode.setAttribute('aria-pressed', String(practiceModeActive));
    el.practiceMode.textContent = practiceModeActive ? 'Exit practice' : 'Practice mode';
  }
  if (el.practicePanel) el.practicePanel.hidden = !practiceModeActive;
  if (practiceModeActive) renderPracticeCard();
  else stopPracticeTimer();
}

function togglePracticeMode() {
  practiceModeActive = !practiceModeActive;
  practiceIndex = 0;
  updatePracticeMode();
  if (practiceModeActive) {
    trackMetric('practice_started', { lang: state.lang });
    restartPracticeTimer();
  }
}

function classroomUrl() {
  const url = new URL('./classroom.html', window.location.href);
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('words', state.word);
  return url.toString();
}

function updateClassroomLink() {
  if (el.classroomLink) el.classroomLink.href = classroomUrl();
}

async function copyEmbedCode() {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('word', state.word);
  url.searchParams.set('embed', '1');
  const snippet = `<iframe src="${url.toString()}" title="SignMyWord fingerspelling for ${state.word}" loading="lazy" style="width:100%;max-width:900px;height:560px;border:0;border-radius:20px"></iframe>`;

  try {
    await navigator.clipboard.writeText(snippet);
    const previous = el.copyEmbed?.textContent;
    if (el.copyEmbed) el.copyEmbed.textContent = 'Embed copied ✓';
    setTimeout(() => {
      if (el.copyEmbed) el.copyEmbed.textContent = previous || 'Copy embed';
    }, 1600);
    trackMetric('embed_copied');
  } catch {
    // Clipboard access can be blocked by browser permissions.
  }
}

function applyEmbedMode() {
  const params = new URLSearchParams(window.location.search);
  document.body.classList.toggle('embed-mode', params.get('embed') === '1');
}

const WORD_USAGE_STORAGE_KEY = 'signmyword-word-usage-v1';
const POPULAR_STORAGE_KEY = 'signmyword-popular-searches-v1';
const POPULAR_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const POPULAR_API_URL = window.SIGNMYWORD_POPULAR_API || '';
const POPULAR_MIN_COUNT = 3;
const SAFE_POPULAR_WORDS = [
  'HELLO','THANK YOU','LOVE','NAME','WELCOME','FAMILY','FRIEND','SCHOOL',
  'TEACHER','STUDENT','GOOD MORNING','GOODBYE','HAPPY BIRTHDAY','PLEASE',
  'SORRY','YES','NO','WEEKEND','SMILE','MUM','DAD','SISTER','BROTHER'
];
const SAFE_POPULAR_SET = new Set(SAFE_POPULAR_WORDS);

function readWordUsageCounts() {
  try {
    const raw = JSON.parse(localStorage.getItem(WORD_USAGE_STORAGE_KEY) || '{}');
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  } catch {
    return {};
  }
}

function wordUsageKey(word, lang = state.lang) {
  return `${lang}::${cleanWord(word)}`;
}

function wordUsageCount(word, lang = state.lang) {
  const counts = readWordUsageCounts();
  return Number(counts[wordUsageKey(word, lang)] || 0);
}

function incrementWordUsage(word, lang = state.lang) {
  const cleaned = cleanWord(word);
  if (!cleaned) return 0;

  const counts = readWordUsageCounts();
  const key = wordUsageKey(cleaned, lang);
  const next = Number(counts[key] || 0) + 1;
  counts[key] = next;

  try {
    localStorage.setItem(WORD_USAGE_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Per-word usage is optional; the generator must keep working without storage.
  }

  return next;
}

function renderHeroWordStats(value = state.word) {
  if (!el.heroWordStats) return;

  const previewWord = cleanWord(value);
  el.heroWordStats.replaceChildren();

  if (!previewWord) return;

  const letters = letterCount(previewWord);
  const words = phraseWords(previewWord).length;
  const bslCount = wordUsageCount(previewWord, 'bsl');
  const aslCount = wordUsageCount(previewWord, 'asl');

  const word = document.createElement('strong');
  word.textContent = previewWord;

  const letterData = document.createElement('span');
  letterData.className = 'hero-word-stats__letters';
  letterData.textContent = words > 1
    ? `${words} words · ${letters} letters`
    : `${letters} ${letters === 1 ? 'letter' : 'letters'}`;

  const makeLanguageStat = (lang, count) => {
    const item = document.createElement('span');
    item.className = 'hero-word-stats__language';

    const flag = document.createElement('span');
    flag.className = `flag-icon flag-icon--${lang === 'bsl' ? 'gb' : 'us'}`;
    flag.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.textContent = LANGUAGES[lang].label;

    const usage = document.createElement('span');
    usage.className = 'hero-word-stats__count';
    usage.textContent = `${count.toLocaleString()} ${count === 1 ? 'search' : 'searches'}`;

    item.append(flag, label, usage);
    return item;
  };

  el.heroWordStats.append(
    word,
    letterData,
    makeLanguageStat('bsl', bslCount),
    makeLanguageStat('asl', aslCount)
  );
}

function removeLiteralBackslashN() {
  const hero = document.querySelector('.marketing-hero__inner');
  if (!hero) return;

  const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (/^\s*\\n\s*$/.test(node.nodeValue || '')) node.remove();
  });
}

function eligiblePopularWord(word) {
  return SAFE_POPULAR_SET.has(word) && !isBlockedInput(word);
}

function readLocalPopularEvents() {
  try {
    const raw = JSON.parse(localStorage.getItem(POPULAR_STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    const cutoff = Date.now() - POPULAR_WINDOW_MS;
    return raw
      .filter((item) => item && typeof item.word === 'string' && Number(item.at) >= cutoff)
      .slice(-500);
  } catch {
    return [];
  }
}

function writeLocalPopularEvents(events) {
  try {
    localStorage.setItem(POPULAR_STORAGE_KEY, JSON.stringify(events.slice(-500)));
  } catch {
    // Popularity data is optional; the generator must keep working without storage.
  }
}

function localPopularSummary() {
  const events = readLocalPopularEvents();
  const counts = new Map();
  const languageTotals = { bsl: 0, asl: 0 };

  events.forEach(({ word, lang }) => {
    if (!eligiblePopularWord(word) || !LANGUAGES[lang]) return;

    const key = `${lang}\u0000${word}`;
    counts.set(key, (counts.get(key) || 0) + 1);
    languageTotals[lang] += 1;
  });

  const words = [...counts.entries()]
    .map(([key, count]) => {
      const [lang, word] = key.split('\u0000');
      return { word, lang, count };
    })
    .filter((item) => item.count >= POPULAR_MIN_COUNT)
    .sort((a, b) =>
      b.count - a.count ||
      a.word.localeCompare(b.word) ||
      a.lang.localeCompare(b.lang)
    )
    .slice(0, 24);

  return {
    words,
    total: languageTotals.bsl + languageTotals.asl,
    languageTotals,
    source: 'local',
  };
}

async function remotePopularSummary() {
  if (!POPULAR_API_URL) return null;

  try {
    const response = await fetch(POPULAR_API_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data?.words)) return null;

    const words = data.words
      .filter((item) =>
        eligiblePopularWord(String(item?.word || '').toUpperCase()) &&
        Number(item?.count) >= POPULAR_MIN_COUNT &&
        LANGUAGES[item?.lang]
      )
      .map((item) => ({
        word: String(item.word).toUpperCase(),
        lang: item.lang,
        count: Number(item.count),
      }))
      .sort((a, b) =>
        b.count - a.count ||
        a.word.localeCompare(b.word) ||
        a.lang.localeCompare(b.lang)
      )
      .slice(0, 24);

    const languageTotals = words.reduce(
      (totals, item) => {
        totals[item.lang] += item.count;
        return totals;
      },
      { bsl: 0, asl: 0 }
    );

    return {
      words,
      total: Number(data.total) || languageTotals.bsl + languageTotals.asl,
      languageTotals,
      source: 'site',
    };
  } catch {
    return null;
  }
}

function cloudSize(count, min, max) {
  if (max <= min) return 24;
  const ratio = (count - min) / (max - min);
  return Math.round(16 + ratio * 22);
}

function renderPopularSuggestions() {
  if (!el.popularSection || !el.popularCloud || !el.popularTotal || !el.popularSubtitle) return;

  const suggestions = SAFE_POPULAR_WORDS.slice(0, 6);
  const config = LANGUAGES[state.lang];

  el.popularCloud.replaceChildren();

  suggestions.forEach((word, index) => {
    const button = document.createElement('button');
    button.className = 'popular-word popular-word--suggestion';
    button.type = 'button';
    button.dataset.tier = 'low';
    button.dataset.lang = state.lang;
    button.setAttribute('aria-label', `Number ${index + 1}: ${word}, ${config.label}`);

    const rank = document.createElement('span');
    rank.className = 'popular-word__rank';
    rank.textContent = String(index + 1);
    rank.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'popular-word__label';
    label.textContent = word;

    const language = document.createElement('span');
    language.className = 'popular-word__language';
    language.setAttribute('aria-hidden', 'true');

    const flag = document.createElement('span');
    flag.className = `popular-word__flag flag-icon flag-icon--${state.lang === 'bsl' ? 'gb' : 'us'}`;

    const languageName = document.createElement('span');
    languageName.className = 'popular-word__language-name';
    languageName.textContent = config.label;

    language.append(flag, languageName);
    button.append(rank, label, language);

    button.addEventListener('click', () => setWord(word, { track: false }));
    el.popularCloud.appendChild(button);
  });

  if (el.popularEyebrow) el.popularEyebrow.textContent = '';
  if (el.popularTitle) el.popularTitle.textContent = `Popular ${config.label} examples`;
  el.popularSubtitle.textContent = '';
  el.popularTotal.textContent = '';
  el.popularSection.hidden = false;
}

function renderPopularSummary(summary) {
  if (!el.popularSection || !el.popularCloud || !el.popularTotal || !el.popularSubtitle) return;

  const words = (summary?.words || []).slice(0, 6);
  if (!words.length) {
    renderPopularSuggestions();
    return;
  }
  if (el.popularEyebrow) el.popularEyebrow.textContent = '';
  if (el.popularTitle) el.popularTitle.textContent = 'Popular this week';

  const counts = words.map((item) => item.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);

  el.popularCloud.replaceChildren();

  words.forEach(({ word, lang, count }, index) => {
    if (!LANGUAGES[lang]) return;

    const config = LANGUAGES[lang];
    const button = document.createElement('button');
    button.className = 'popular-word';
    button.type = 'button';
    button.style.setProperty('--popular-size', `${cloudSize(count, min, max)}px`);
    button.style.setProperty('--popular-weight', count === max ? '800' : '700');
    button.title = `${word}: ${count} ${count === 1 ? 'search' : 'searches'} in ${config.label} over the last 7 days`;
    button.setAttribute(
      'aria-label',
      `${count} ${count === 1 ? 'search' : 'searches'} for ${word} in ${config.name}, ${config.label}`
    );

    const tier =
      count >= max * 0.66 ? 'high' :
      count >= max * 0.33 ? 'medium' :
      'low';

    button.dataset.tier = tier;
    button.dataset.lang = lang;

    const rank = document.createElement('span');
    rank.className = 'popular-word__rank';
    rank.textContent = String(index + 1);
    rank.setAttribute('aria-hidden', 'true');

    const countLabel = document.createElement('span');
    countLabel.className = 'popular-word__count';
    countLabel.textContent = count;
    countLabel.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'popular-word__label';
    label.textContent = word;

    const language = document.createElement('span');
    language.className = 'popular-word__language';
    language.setAttribute('aria-hidden', 'true');

    const flag = document.createElement('span');
    flag.className = `popular-word__flag flag-icon flag-icon--${lang === 'bsl' ? 'gb' : 'us'}`;

    const languageName = document.createElement('span');
    languageName.className = 'popular-word__language-name';
    languageName.textContent = config.label;

    language.append(flag, languageName);
    button.append(rank, label, language);

    button.addEventListener('click', () => {
      setLanguage(lang);
      setWord(word, { track: false });
      document.querySelector('.result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    el.popularCloud.appendChild(button);
  });

  el.popularTotal.replaceChildren();

  el.popularSubtitle.textContent = '';

  el.popularSection.hidden = false;
}
async function refreshPopularSearches() {
  const remote = await remotePopularSummary();
  renderPopularSummary(remote || localPopularSummary());
}

async function recordPopularSearch(word) {
  if (!eligiblePopularWord(word)) return;

  let remoteRecorded = false;

  if (POPULAR_API_URL) {
    try {
      const response = await fetch(POPULAR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({ word, lang: state.lang }),
      });
      remoteRecorded = response.ok;
    } catch {
      remoteRecorded = false;
    }
  }

  if (!remoteRecorded) {
    const events = readLocalPopularEvents();
    events.push({ word, lang: state.lang, at: Date.now() });
    writeLocalPopularEvents(events);
  }

  await refreshPopularSearches();
}

function isBlockedInput(value) {
  return Boolean(window.SignMyWordModeration?.check(value)?.blocked);
}

function wordCategory(value = '') {
  const word = String(value).toUpperCase().trim();
  const tokens = new Set(word.split(/\s+/).filter(Boolean));
  if (/BIRTHDAY|CONGRAT|CELEBRAT/.test(word)) return 'Birthday';
  if (/LOVE|XOXO|VALENTINE|KISS|DARLING|SWEETHEART/.test(word)) return 'Love';
  if (/HELLO|HI|WELCOME|MORNING|AFTERNOON|EVENING|GOODBYE|BYE|THANK/.test(word)) return 'Greetings';
  if (/MUM|MOM|DAD|FAMILY|SISTER|BROTHER|GRAND|WIFE|HUSBAND|BABY/.test(word)) return 'Family';
  if (/SCHOOL|CLASS|TEACHER|STUDENT|LEARN|COLLEGE|UNIVERSITY/.test(word)) return 'School';
  if (/WORK|JOB|OFFICE|BOSS|TEAM|MEETING|BUSINESS/.test(word)) return 'Work';
  if (word.split(' ').length === 1 && word.length >= 2 && word.length <= 14) return 'Names / words';
  return 'Other';
}

function cleanWord(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 32);
}

function letterCount(word) {
  return (word.match(/[A-Z]/g) || []).length;
}

function shareLink() {
  const url = new URL(SITE_URL);
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('word', state.word);
  return url.toString();
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('word', state.word);
  history.replaceState({}, '', url);
}

function renderLanguage() {
  el.languageButtons.forEach((button) => {
    const active = button.dataset.language === state.lang;
    button.classList.toggle('language-pill--active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  const config = LANGUAGES[state.lang];
  el.outputLang.textContent = `${config.name} (${config.label})`;
  el.sourceNote.innerHTML =
    state.lang === 'asl'
      ? 'ASL artwork is stored locally when available, with Wikimedia Commons as the source fallback. Open any sign for source information.'
      : 'BSL artwork is stored locally when available, with Wikimedia Commons as the source fallback. Open any sign for source and licence information.';
}

function separatorCard(char) {
  const span = document.createElement('div');
  span.className = 'letter-separator';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = char === ' ' ? '·' : char;
  return span;
}

function letterCard(letter) {
  const config = LANGUAGES[state.lang];
  const card = document.createElement('article');
  card.className = 'letter-card';

  const heading = document.createElement('strong');
  heading.className = 'letter-card__letter';
  heading.textContent = letter;

  const imageBox = document.createElement('a');
  imageBox.className = 'letter-card__image';
  imageBox.href = config.source(letter);
  imageBox.target = '_blank';
  imageBox.rel = 'noopener noreferrer';
  imageBox.title = `Open Wikimedia source for ${config.label} letter ${letter}`;

  const image = document.createElement('img');
  image.src = config.file(letter);
  image.alt = `${config.name} fingerspelling for the letter ${letter}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.dataset.assetFallback = 'local';

  if (state.lang === 'bsl') {
    card.classList.add('letter-card--bsl');
    image.classList.add('sign-image--cropped');

    signImageDataUrl('bsl', letter)
      .then((croppedSrc) => {
        if (image.isConnected) image.src = croppedSrc;
      })
      .catch(() => {
        // Keep the original Wikimedia image if trimming is unavailable.
      });
  }

  const fallback = document.createElement('span');
  fallback.className = 'letter-card__fallback';
  fallback.hidden = true;
  fallback.textContent = `${letter} image unavailable`;

  image.addEventListener('error', () => {
    if (image.dataset.assetFallback === 'local') {
      image.dataset.assetFallback = 'remote';
      image.src = config.remoteFile(letter);
      return;
    }

    image.hidden = true;
    fallback.hidden = false;
  });

  imageBox.append(image, fallback);
  card.append(heading, imageBox);
  return card;
}

function renderWordGroup(word, index) {
  const group = document.createElement('section');
  group.className = 'word-sign-group';
  group.setAttribute('aria-labelledby', `word-sign-group-${index}`);

  const heading = document.createElement('h3');
  heading.className = 'word-sign-group__title';
  heading.id = `word-sign-group-${index}`;
  heading.textContent = word;

  const cards = document.createElement('div');
  cards.className = 'word-sign-group__cards';

  [...word].forEach((char) => {
    if (/[A-Z]/.test(char)) {
      cards.appendChild(letterCard(char));
    } else {
      cards.appendChild(separatorCard(char));
    }
  });

  group.append(heading, cards);
  return group;
}

function renderWord() {
  const count = letterCount(state.word);
  const words = state.word.split(' ').filter(Boolean);
  const isPhrase = words.length > 1;

  el.output.replaceChildren();
  el.output.className = 'letter-output';

  if (isPhrase) {
    el.output.classList.add('letter-output--phrase');
  } else if (count <= 4) {
    el.output.classList.add('letter-output--short');
  } else if (count <= 8) {
    el.output.classList.add('letter-output--medium');
  } else {
    el.output.classList.add('letter-output--long');
  }

  if (!count) {
    el.outputMeta.textContent = 'Type a word to begin';
    return;
  }

  if (isPhrase) {
    words.forEach((word, index) => {
      el.output.appendChild(renderWordGroup(word, index));
    });
  } else {
    [...state.word].forEach((char) => {
      if (/[A-Z]/.test(char)) {
        el.output.appendChild(letterCard(char));
      } else {
        el.output.appendChild(separatorCard(char));
      }
    });
  }

  const wordSummary = isPhrase ? ` · ${words.length} words` : '';
  el.outputMeta.textContent = `${state.word} · ${count} ${count === 1 ? 'letter' : 'letters'}${wordSummary}`;

  const config = LANGUAGES[state.lang];

  if (el.mobileOutputTitle) {
    el.mobileOutputTitle.textContent = `Learn how to fingerspell ${state.word} in ${config.name} (${config.label}).`;
  }

  if (el.mobileOutputMeta) {
    el.mobileOutputMeta.textContent = `${config.name} (${config.label}) · ${count} ${count === 1 ? 'letter' : 'letters'}${wordSummary}`;
  }
}

function renderShare() {
  const url = shareLink();
  el.shareUrl.value = url;
  el.whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`How to fingerspell “${state.word}” in ${LANGUAGES[state.lang].name} (${LANGUAGES[state.lang].label}) — ${url}`)}`;

  el.qr.replaceChildren();
  if (window.QRCode) {
    new QRCode(el.qr, {
      text: url,
      width: 126,
      height: 126,
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.textContent = 'Open share link';
    el.qr.appendChild(fallback);
  }
}

function updateReportLink() {
  if (!el.reportProblem) return;
  const subject = `SignMyWord hand image report — ${state.lang.toUpperCase()} ${state.word}`;
  const body = `Please describe the hand image, letter or usability problem.\n\nLanguage: ${LANGUAGES[state.lang].name} (${LANGUAGES[state.lang].label})\nWord/phrase: ${state.word}\nPage: ${shareLink()}\n\nWhat looks wrong or could be clearer?\n`;
  el.reportProblem.href = `mailto:guyorlov@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function render() {
  renderLanguage();
  renderWord();
  updateUrl();
  renderShare();
  updateClassroomLink();
  updateReportLink();
  renderHeroWordStats();
  renderRecentSearches();
  if (practiceModeActive) renderPracticeCard();
  invalidateShareImage();
}

function setWord(value, options = {}) {
  if (isBlockedInput(value)) {
    el.message.textContent = 'That word or phrase isn’t available on SignMyWord. Try another.';
    el.input.focus();
    trackMetric('blocked_search', { lang: state.lang });
    return;
  }

  const next = cleanWord(value);
  if (!next) {
    el.message.textContent = 'Please enter at least one letter A–Z.';
    el.input.focus();
    return;
  }
  state.word = next;
  el.input.value = next;
  el.message.textContent = '';
  practiceModeActive = false;
  updatePracticeMode();
  if (options.track !== false) incrementWordUsage(next, state.lang);
  render();

  if (options.recent !== false) {
    recordRecentSearch(next);
  }

  if (options.track !== false) {
    recordPopularSearch(next);
    trackMetric('word_generated', {
      lang: state.lang,
      letters: letterCount(next),
      words: phraseWords(next).length,
      category: wordCategory(next),
    });
    trackMetric('result_shown', { lang: state.lang });
  }

  if (options.scroll !== false) {
    window.setTimeout(() => {
      const result = document.querySelector('.result-section');
      if (!result) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      result.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 80);
  }
}

function setLanguage(language) {
  if (!LANGUAGES[language]) return;
  state.lang = language;
  render();
  renderHeroWordStats();
  refreshPopularSearches();
  trackMetric('language_selected', { lang: language });
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareLink());
    trackMetric('link_copied', { lang: state.lang });
    const previous = el.copy.textContent;
    el.copy.textContent = 'Copied ✓';
    setTimeout(() => (el.copy.textContent = previous), 1600);
  } catch {
    el.shareUrl.focus();
    el.shareUrl.select();
  }
}

async function nativeShare() {
  const data = {
    title: `SignMyWord — ${state.word}`,
    text: `How to fingerspell “${state.word}” in ${LANGUAGES[state.lang].name} (${LANGUAGES[state.lang].label})`,
    url: shareLink(),
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      trackMetric('native_shared', { lang: state.lang });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  await copyLink();
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  const rawWord = params.get('word') || '';
  const blockedWord = isBlockedInput(rawWord);
  const word = blockedWord ? '' : cleanWord(rawWord);

  if (LANGUAGES[lang]) state.lang = lang;
  if (word) state.word = word;

  el.input.value = state.word;
  if (blockedWord) {
    el.message.textContent = 'That word or phrase isn’t available on SignMyWord. Try another.';
  }
}

el.input.addEventListener('input', () => {
  renderHeroWordStats(el.input.value);
});

el.form.addEventListener('submit', (event) => {
  event.preventDefault();
  setWord(el.input.value);
});

el.languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});

el.exampleButtons.forEach((button) => {
  button.addEventListener('click', () => setWord(button.dataset.example));
});

el.surpriseWord?.addEventListener('click', () => {
  const choices = SURPRISE_WORDS.filter((item) => item !== state.word);
  const word = choices[Math.floor(Math.random() * choices.length)] || 'HELLO';
  setWord(word);
  trackMetric('surprise_used');
});

el.practiceMode?.addEventListener('click', togglePracticeMode);
el.practicePrev?.addEventListener('click', () => {
  const letters = practiceLetters();
  if (!letters.length) return;
  practiceIndex = (practiceIndex - 1 + letters.length) % letters.length;
  renderPracticeCard();
  restartPracticeTimer();
});
el.practiceNext?.addEventListener('click', () => {
  const letters = practiceLetters();
  if (!letters.length) return;
  practiceIndex = (practiceIndex + 1) % letters.length;
  renderPracticeCard();
  restartPracticeTimer();
});
el.practiceReveal?.addEventListener('click', () => {
  if (!el.practiceAnswer) return;
  el.practiceAnswer.hidden = false;
  el.practiceReveal.textContent = 'Answer shown';
  trackMetric('practice_revealed', { lang: state.lang });
});
el.practiceSpeed?.addEventListener('change', restartPracticeTimer);
el.copyEmbed?.addEventListener('click', copyEmbedCode);

el.copy.addEventListener('click', copyLink);
el.share.addEventListener('click', nativeShare);
el.whatsapp?.addEventListener('click', () => trackMetric('whatsapp_clicked', { lang: state.lang }));

el.openImageMaker?.addEventListener('click', openImageMaker);
el.closeImageModal?.addEventListener('click', closeImageMaker);
el.imageModalBackdrop?.addEventListener('click', closeImageMaker);
el.downloadShareImage?.addEventListener('click', downloadShareImage);
el.shareImageFile?.addEventListener('click', shareGeneratedImage);
el.copyImage?.addEventListener('click', copyGeneratedImage);

el.imageFormatButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    if (button.disabled) return;
    shareImageState.format = button.dataset.cardFormat || 'portrait';
    trackMetric('format_selected', { format: shareImageState.format, lang: state.lang });

    el.imageFormatButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('image-format-pill--active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    updateImageCustomiseHint();
    invalidateShareImage();

    try {
      await generateShareImageBlob();
    } catch (error) {
      setImageModalStatus(error?.message || 'Could not create this image size.');
    }
  });
});

el.imageStyleButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    shareImageState.style = button.dataset.cardStyle || 'light';
    trackMetric('theme_selected', { style: shareImageState.style, lang: state.lang });

    el.imageStyleButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('image-style-pill--active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    updateImageCustomiseHint();
    invalidateShareImage();

    try {
      await generateShareImageBlob();
    } catch (error) {
      setImageModalStatus(error?.message || 'Could not create this image style.');
    }
  });
});

el.imageIconButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    shareImageState.iconMode = button.dataset.cardIconMode || 'auto';

    el.imageIconButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('image-icon-pill--active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    updateImageCustomiseHint();
    invalidateShareImage();

    try {
      await generateShareImageBlob();
    } catch (error) {
      setImageModalStatus(error?.message || 'Could not update the icon setting.');
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !el.imageModal?.hidden) closeImageMaker();
});

loadFromUrl();
removeLiteralBackslashN();
applyEmbedMode();
render();
renderRecentSearches();
updatePracticeMode();
syncShareFormatAvailability({ autoSelect: true });
updateImageCustomiseHint();
refreshPopularSearches();
