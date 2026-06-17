// ---- Mood catalogue -------------------------------------------------------
// Each mood has a Korean label (shown on the card) and English keywords that
// get fed into the Claude prompt so the generated Suno prompts stay on-theme.
const MOODS = [
  { emoji: "🌙", name: "몽환적인", desc: "dreamy, ethereal, floating" },
  { emoji: "⚡", name: "신나는", desc: "energetic, upbeat, driving" },
  { emoji: "😢", name: "슬픈", desc: "melancholic, sorrowful, tearful" },
  { emoji: "🕊️", name: "평화로운", desc: "peaceful, calm, serene" },
  { emoji: "🌑", name: "어두운", desc: "dark, brooding, ominous" },
  { emoji: "💕", name: "로맨틱한", desc: "romantic, tender, intimate" },
  { emoji: "📻", name: "향수를 자극하는", desc: "nostalgic, retro, bittersweet" },
  { emoji: "🎬", name: "긴장감 있는", desc: "tense, suspenseful, cinematic" },
  { emoji: "☕", name: "포근한", desc: "cozy, warm, comforting" },
  { emoji: "🏔️", name: "웅장한", desc: "epic, grand, sweeping" },
  { emoji: "🔮", name: "미스터리한", desc: "mysterious, enigmatic, shadowy" },
  { emoji: "🦅", name: "자유로운", desc: "free-spirited, soaring, liberating" },
  { emoji: "🔥", name: "분노에 찬", desc: "angry, aggressive, fierce" },
  { emoji: "🌅", name: "희망찬", desc: "hopeful, uplifting, inspiring" },
  { emoji: "🌧️", name: "외로운", desc: "lonely, solitary, wistful" },
  { emoji: "🌫️", name: "몽롱한", desc: "hazy, trippy, lo-fi" },
  { emoji: "🌊", name: "청량한", desc: "refreshing, breezy, crisp" },
  { emoji: "🔆", name: "따뜻한", desc: "warm, gentle, sun-soaked" },
  { emoji: "🎻", name: "우아한", desc: "elegant, graceful, refined" },
  { emoji: "🕺", name: "그루비한", desc: "groovy, funky, danceable" },
  { emoji: "🤖", name: "사이버틱한", desc: "futuristic, cyberpunk, synthetic" },
  { emoji: "🌾", name: "전원적인", desc: "pastoral, rustic, earthy" },
  { emoji: "🌆", name: "도시적인", desc: "urban, sleek, late-night city" },
  { emoji: "🎉", name: "축제 같은", desc: "festive, celebratory, lively" },
  { emoji: "🧘", name: "명상적인", desc: "meditative, ambient, introspective" },
  { emoji: "🐺", name: "야성적인", desc: "wild, primal, untamed" },
  { emoji: "☔", name: "우울한", desc: "gloomy, rainy-day, somber" },
  { emoji: "🌌", name: "우주적인", desc: "cosmic, spacey, otherworldly" },
  { emoji: "🧚", name: "동화 같은", desc: "fairytale-like, whimsical, magical" },
  { emoji: "📼", name: "복고풍의", desc: "retro, vintage, throwback" },
];

const MOOD_CARD_COUNT = 8;
const PROMPT_COUNT = 15;
const STORAGE_KEY = "suno-agent-api-key";
const HISTORY_KEY = "suno-agent-history";
const MODEL = "claude-sonnet-4-6";
const LOGIC_SCRIPT_PATH = "~/Desktop/suno-agent/logic_import.scpt";

// ---- Instrument catalogue ---------------------------------------------------
const INSTRUMENTS = [
  { id: "strings", label: "🎻 현악기", desc: "strings (violin, viola, cello)" },
  { id: "piano", label: "🎹 피아노", desc: "piano" },
  { id: "guitar", label: "🎸 기타", desc: "guitar (acoustic or electric)" },
  { id: "brass", label: "🎺 브라스", desc: "brass (trumpet, trombone, saxophone)" },
  { id: "electronic", label: "🎛️ 전자악기", desc: "electronic synths and pads" },
  { id: "percussion", label: "🥁 타악기", desc: "percussion and drums" },
];

// ---- Reference genre catalogue -----------------------------------------------
const GENRES = [
  { label: "Lo-fi", desc: "lo-fi" },
  { label: "Jazz", desc: "jazz" },
  { label: "Classical", desc: "classical" },
  { label: "Ambient", desc: "ambient" },
  { label: "Bossa Nova", desc: "bossa nova" },
  { label: "Neo Soul", desc: "neo soul" },
  { label: "R&B", desc: "R&B" },
  { label: "Indie Folk", desc: "indie folk" },
  { label: "Synthwave", desc: "synthwave" },
  { label: "Cinematic", desc: "cinematic orchestral" },
  { label: "Indie Pop", desc: "indie pop" },
  { label: "Dream Pop", desc: "dream pop" },
  { label: "Soft Pop", desc: "soft pop" },
  { label: "City Pop", desc: "city pop" },
  { label: "Bedroom Pop", desc: "bedroom pop" },
  { label: "Funk", desc: "funk" },
  { label: "Punk Funk", desc: "punk funk" },
  { label: "Disco Funk", desc: "disco funk" },
  { label: "G-Funk", desc: "G-funk" },
  { label: "Jazz Funk", desc: "jazz funk" },
  { label: "Afrobeat", desc: "afrobeat" },
];

// ---- Space-based theme catalogue ----------------------------------------------
// Each space has a description used in the prompt, plus suggested
// instruments/background sounds that get auto-selected as a recommendation.
const SPACES = [
  {
    id: "cafe",
    label: "☕ 카페",
    desc: "a cozy café — warm, relaxed background music for conversation and lingering",
    suggestInstruments: ["piano", "guitar"],
    suggestBackground: ["cafe-noise"],
  },
  {
    id: "study",
    label: "📚 서재",
    desc: "a quiet study or library — calm, focus-friendly music that stays unobtrusive",
    suggestInstruments: ["piano", "strings"],
    suggestBackground: [],
  },
  {
    id: "bedroom",
    label: "🛏️ 침실",
    desc: "an intimate bedroom at night — soft, soothing music for winding down or sleep",
    suggestInstruments: ["piano", "strings"],
    suggestBackground: ["rain"],
  },
  {
    id: "gym",
    label: "💪 헬스장",
    desc: "a gym workout session — high-energy, motivating and driving music",
    suggestInstruments: ["electronic", "percussion"],
    suggestBackground: [],
  },
  {
    id: "drive",
    label: "🚗 드라이브",
    desc: "a road trip drive — smooth, open, free-flowing music for the road",
    suggestInstruments: ["guitar", "electronic"],
    suggestBackground: ["night-street"],
  },
  {
    id: "outdoor",
    label: "🌳 야외",
    desc: "an outdoor open-air setting — fresh, natural and breezy music",
    suggestInstruments: ["guitar", "percussion"],
    suggestBackground: ["wind"],
  },
];

// ---- Season catalogue -----------------------------------------------------------
const SEASONS = [
  { id: "none", label: "선택 안함", desc: "" },
  { id: "spring", label: "🌸 봄", desc: "spring — fresh, blooming, light and hopeful" },
  { id: "summer", label: "☀️ 여름", desc: "summer — bright, vibrant, energetic, sun-drenched" },
  { id: "autumn", label: "🍁 가을", desc: "autumn — mellow, nostalgic, warm amber tones" },
  { id: "winter", label: "❄️ 겨울", desc: "winter — cold, crisp, introspective, quiet" },
];

// ---- Background sound catalogue --------------------------------------------------
const BACKGROUND_SOUNDS = [
  { id: "rain", label: "🌧️ 비소리", desc: "soft rain ambience" },
  { id: "wind", label: "🍃 바람소리", desc: "gentle wind ambience" },
  { id: "cafe-noise", label: "☕ 카페소음", desc: "café chatter and ambient noise" },
  { id: "night-street", label: "🌃 밤거리", desc: "distant night city street ambience" },
  { id: "waves", label: "🌊 파도소리", desc: "ocean wave sounds" },
  { id: "campfire", label: "🔥 캠프파이어", desc: "crackling campfire sounds" },
];

// ---- Instrument emphasis sliders --------------------------------------------------
// Each slider ranges 0-4 (2 = neutral/default, untouched).
const EMPHASIS_INSTRUMENTS = [
  { id: "drums", label: "드럼", desc: "drums" },
  { id: "piano", label: "피아노", desc: "piano" },
  { id: "guitar", label: "기타", desc: "guitar" },
  { id: "bass", label: "베이스", desc: "bass" },
  { id: "strings", label: "스트링", desc: "strings" },
  { id: "brass", label: "브라스", desc: "brass" },
  { id: "synth", label: "신스", desc: "synths" },
  { id: "percussion", label: "퍼커션", desc: "percussion" },
  { id: "vocal", label: "보컬", desc: "vocals" },
];

const EMPHASIS_NEUTRAL = 2;
const EMPHASIS_LEVEL_DESC = {
  0: "almost entirely absent — avoid or strip out",
  1: "minimal and subtle, kept in the background",
  3: "prominent and emphasized in the mix",
  4: "a dominant, central, driving element",
};

// ---- State -----------------------------------------------------------------
let currentMoodCards = [];
const selectedMoodNames = new Set();

let vocalMode = "with-vocals"; // "with-vocals" | "instrumental"
let bpmMin = 80;
let bpmMax = 120;
let songLength = 2; // minutes: 1 | 2 | 3 | 4
let structureMode = "off"; // "off" | "on" (기승전결)

const selectedInstruments = new Set();
const selectedGenres = new Set();
const selectedBackgroundSounds = new Set();
let selectedSpaceId = null;
let selectedSeasonId = null;

// instrument id -> emphasis level (0-4, 2 = neutral)
const emphasisValues = {};
EMPHASIS_INSTRUMENTS.forEach((i) => (emphasisValues[i.id] = EMPHASIS_NEUTRAL));

// ---- Element refs -----------------------------------------------------------
const apiKeyInput = document.getElementById("api-key-input");
const saveKeyBtn = document.getElementById("save-key-btn");
const apiKeyStatus = document.getElementById("api-key-status");
const shuffleBtn = document.getElementById("shuffle-btn");
const moodGrid = document.getElementById("mood-grid");
const generateBtn = document.getElementById("generate-btn");
const generateHint = document.getElementById("generate-hint");
const resultSection = document.getElementById("result-section");
const resultGrid = document.getElementById("result-grid");
const resultCount = document.getElementById("result-count");

const vocalToggle = document.getElementById("vocal-toggle");
const lengthToggle = document.getElementById("length-toggle");
const bpmMinInput = document.getElementById("bpm-min");
const bpmMaxInput = document.getElementById("bpm-max");
const bpmMinValue = document.getElementById("bpm-min-value");
const bpmMaxValue = document.getElementById("bpm-max-value");

const structureToggle = document.getElementById("structure-toggle");
const structureDesc = document.getElementById("structure-desc");
const instrumentChips = document.getElementById("instrument-chips");
const genreChips = document.getElementById("genre-chips");
const spaceChips = document.getElementById("space-chips");
const spaceHint = document.getElementById("space-hint");
const seasonToggle = document.getElementById("season-toggle");
const bgsoundChips = document.getElementById("bgsound-chips");
const emphasisGrid = document.getElementById("emphasis-grid");

const logicFolderInput = document.getElementById("logic-folder-input");
const logicGenerateBtn = document.getElementById("logic-generate-btn");
const logicHint = document.getElementById("logic-hint");
const logicInstructions = document.getElementById("logic-instructions");
const logicCommandText = document.getElementById("logic-command-text");
const logicCommandCopy = document.getElementById("logic-command-copy");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = {
  generate: document.getElementById("tab-generate"),
  history: document.getElementById("tab-history"),
};
const historyList = document.getElementById("history-list");
const historyEmpty = document.getElementById("history-empty");
const clearHistoryBtn = document.getElementById("clear-history-btn");

// ---- API key persistence ----------------------------------------------------
function loadApiKey() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    apiKeyInput.value = saved;
    apiKeyStatus.textContent = "저장된 API 키를 불러왔어요.";
    apiKeyStatus.className = "api-key-hint success";
  }
}

function saveApiKey() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    apiKeyStatus.textContent = "API 키를 입력한 뒤 저장해주세요.";
    apiKeyStatus.className = "api-key-hint error";
    return;
  }
  localStorage.setItem(STORAGE_KEY, key);
  apiKeyStatus.textContent = "API 키가 저장되었습니다. (브라우저에만 보관됩니다)";
  apiKeyStatus.className = "api-key-hint success";
}

function getApiKey() {
  return localStorage.getItem(STORAGE_KEY) || apiKeyInput.value.trim();
}

// ---- Mood cards --------------------------------------------------------------
function pickRandomMoods(count) {
  const pool = [...MOODS];
  const picked = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

function renderMoodCards() {
  currentMoodCards = pickRandomMoods(MOOD_CARD_COUNT);
  selectedMoodNames.clear();
  updateGenerateState();

  moodGrid.innerHTML = "";
  currentMoodCards.forEach((mood) => {
    const card = document.createElement("div");
    card.className = "mood-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <span class="emoji">${mood.emoji}</span>
      <span class="mood-name">${mood.name}</span>
      <span class="mood-desc">${mood.desc}</span>
    `;

    const toggle = () => {
      if (selectedMoodNames.has(mood.name)) {
        selectedMoodNames.delete(mood.name);
        card.classList.remove("selected");
      } else {
        selectedMoodNames.add(mood.name);
        card.classList.add("selected");
      }
      updateGenerateState();
    };

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    moodGrid.appendChild(card);
  });
}

function updateGenerateState() {
  const hasSelection = selectedMoodNames.size > 0;
  generateBtn.disabled = !hasSelection;
  generateHint.textContent = hasSelection
    ? `선택한 분위기: ${[...selectedMoodNames].join(", ")}`
    : "분위기 카드를 1개 이상 선택해주세요";
  generateHint.className = "generate-hint";
}

// ---- Style options (vocal / BPM / length) ------------------------------------
function setupSegmentedGroup(container, onChange) {
  const buttons = [...container.querySelectorAll(".segment")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      onChange(btn.dataset.value);
    });
  });
}

function setupStyleOptions() {
  setupSegmentedGroup(vocalToggle, (value) => {
    vocalMode = value;
  });

  setupSegmentedGroup(lengthToggle, (value) => {
    songLength = Number(value);
  });

  setupSegmentedGroup(structureToggle, (value) => {
    structureMode = value;
    structureDesc.hidden = structureMode !== "on";
  });

  const syncBpmDisplays = () => {
    bpmMinValue.textContent = bpmMin;
    bpmMaxValue.textContent = bpmMax;
  };

  bpmMinInput.addEventListener("input", () => {
    bpmMin = Number(bpmMinInput.value);
    if (bpmMin > bpmMax) {
      bpmMax = bpmMin;
      bpmMaxInput.value = bpmMax;
    }
    syncBpmDisplays();
  });

  bpmMaxInput.addEventListener("input", () => {
    bpmMax = Number(bpmMaxInput.value);
    if (bpmMax < bpmMin) {
      bpmMin = bpmMax;
      bpmMinInput.value = bpmMin;
    }
    syncBpmDisplays();
  });

  syncBpmDisplays();
}

// ---- Theme expansion options (instruments / genres / space / season / bg sounds) ----
// Multi-select chip group: clicking a chip toggles its id in `selectedSet`.
function setupMultiChipGroup(container, items, selectedSet) {
  container.innerHTML = "";
  items.forEach((item) => {
    const id = item.id ?? item.label;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = item.label;
    chip.classList.toggle("selected", selectedSet.has(id));

    chip.addEventListener("click", () => {
      if (selectedSet.has(id)) {
        selectedSet.delete(id);
        chip.classList.remove("selected");
      } else {
        selectedSet.add(id);
        chip.classList.add("selected");
      }
    });

    container.appendChild(chip);
  });
}

// Single-select chip group: clicking the active chip again deselects it.
function setupSingleChipGroup(container, items, onSelect) {
  container.innerHTML = "";
  items.forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = item.label;

    chip.addEventListener("click", () => {
      const wasSelected = chip.classList.contains("selected");
      [...container.children].forEach((c) => c.classList.remove("selected"));
      if (wasSelected) {
        onSelect(null);
      } else {
        chip.classList.add("selected");
        onSelect(item);
      }
    });

    container.appendChild(chip);
  });
}

function applySpaceRecommendation(space) {
  if (!space) {
    selectedSpaceId = null;
    spaceHint.hidden = true;
    return;
  }

  selectedSpaceId = space.id;

  // Auto-select suggested instruments and background sounds as a starting recommendation.
  space.suggestInstruments.forEach((id) => selectedInstruments.add(id));
  space.suggestBackground.forEach((id) => selectedBackgroundSounds.add(id));
  setupMultiChipGroup(instrumentChips, INSTRUMENTS, selectedInstruments);
  setupMultiChipGroup(bgsoundChips, BACKGROUND_SOUNDS, selectedBackgroundSounds);

  spaceHint.hidden = false;
  spaceHint.textContent = `추천 테마: ${space.desc}`;
}

function setupThemeOptions() {
  setupMultiChipGroup(instrumentChips, INSTRUMENTS, selectedInstruments);
  setupMultiChipGroup(genreChips, GENRES, selectedGenres);
  setupMultiChipGroup(bgsoundChips, BACKGROUND_SOUNDS, selectedBackgroundSounds);
  setupSingleChipGroup(spaceChips, SPACES, applySpaceRecommendation);

  // Season uses the same segmented style as vocal/length toggles.
  seasonToggle.innerHTML = "";
  SEASONS.forEach((season, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "segment" + (index === 0 ? " active" : "");
    btn.dataset.value = season.id;
    btn.textContent = season.label;
    seasonToggle.appendChild(btn);
  });
  setupSegmentedGroup(seasonToggle, (value) => {
    selectedSeasonId = value === "none" ? null : value;
  });
}

// ---- Instrument emphasis sliders --------------------------------------------------
function setupEmphasisSliders() {
  emphasisGrid.innerHTML = "";
  EMPHASIS_INSTRUMENTS.forEach((instrument) => {
    const row = document.createElement("div");
    row.className = "emphasis-row";
    row.innerHTML = `
      <span class="emphasis-label">${instrument.label}</span>
      <div class="emphasis-slider-wrap">
        <span class="emphasis-end">Less</span>
        <input type="range" min="0" max="4" step="1" value="${EMPHASIS_NEUTRAL}" />
        <span class="emphasis-end">More</span>
      </div>
    `;

    const slider = row.querySelector("input[type='range']");
    slider.addEventListener("input", () => {
      emphasisValues[instrument.id] = Number(slider.value);
      row.classList.toggle("active", emphasisValues[instrument.id] !== EMPHASIS_NEUTRAL);
    });

    emphasisGrid.appendChild(row);
  });
}

function describeStyleOptions(options) {
  const vocalLabel = options.vocal === "instrumental" ? "연주곡(보컬 없음)" : "보컬 있음";
  const parts = [vocalLabel, `${options.bpmMin}-${options.bpmMax} BPM`, `약 ${options.length}분`];
  if (options.structure === "on") parts.push("🎭 기승전결 구성");
  if (options.instruments?.length) parts.push(`주 악기: ${options.instruments.join(", ")}`);
  if (options.genres?.length) parts.push(`레퍼런스: ${options.genres.join(", ")}`);
  if (options.space) parts.push(`공간: ${options.space}`);
  if (options.season) parts.push(`계절: ${options.season}`);
  if (options.backgroundSounds?.length) parts.push(`배경음: ${options.backgroundSounds.join(", ")}`);
  return parts.join(" · ");
}

// ---- Claude API call ----------------------------------------------------------
function buildUserPrompt(selectedMoods) {
  const moodList = selectedMoods
    .map((m) => `- ${m.name} (${m.desc})`)
    .join("\n");

  const vocalLine =
    vocalMode === "instrumental"
      ? 'All tracks must be instrumental — no vocals or lyrics of any kind. Explicitly include the word "instrumental" in each prompt.'
      : "All tracks should feature vocals — describe a fitting vocal style/timbre (e.g. \"breathy female vocals\", \"raspy male rock vocals\", \"layered choir harmonies\") in each prompt.";

  const extraLines = [];

  const instruments = INSTRUMENTS.filter((i) => selectedInstruments.has(i.id));
  if (instruments.length > 0) {
    extraLines.push(
      `- Prominently feature the following instrument(s) across all tracks: ${instruments
        .map((i) => i.desc)
        .join(", ")}.`
    );
  }

  const genres = GENRES.filter((g) => selectedGenres.has(g.label));
  if (genres.length > 0) {
    extraLines.push(
      `- Use the following as reference genres, blending or adapting their stylistic traits with the mood(s) above: ${genres
        .map((g) => g.desc)
        .join(", ")}.`
    );
  }

  const space = SPACES.find((s) => s.id === selectedSpaceId);
  if (space) {
    extraLines.push(`- These tracks will be played in this setting, so the overall vibe should suit it: ${space.desc}.`);
  }

  const season = SEASONS.find((s) => s.id === selectedSeasonId);
  if (season) {
    extraLines.push(`- Infuse each track with a seasonal atmosphere: ${season.desc}.`);
  }

  const backgroundSounds = BACKGROUND_SOUNDS.filter((b) => selectedBackgroundSounds.has(b.id));
  if (backgroundSounds.length > 0) {
    extraLines.push(
      `- Each prompt must explicitly weave in the following ambient background sound element(s), described naturally as part of the soundscape (e.g. "with soft rain ambience in the background"): ${backgroundSounds
        .map((b) => b.desc)
        .join(", ")}.`
    );
  }

  const emphasisLines = EMPHASIS_INSTRUMENTS.filter((i) => emphasisValues[i.id] !== EMPHASIS_NEUTRAL).map(
    (i) => `${i.desc}: ${EMPHASIS_LEVEL_DESC[emphasisValues[i.id]]}`
  );
  if (emphasisLines.length > 0) {
    extraLines.push(`- Adjust the instrumentation balance as follows: ${emphasisLines.join("; ")}.`);
  }

  const structureBlock =
    structureMode === "on"
      ? `

Structure all ${PROMPT_COUNT} prompts as one cohesive playlist following the Korean narrative arc "기승전결" (Ki-Seung-Jeon-Gyeol — introduction, development, climax, resolution):
- Tracks 1-4 (기, Introduction): Gently establish the core mood with calmer, simpler arrangements that set the tone.
- Tracks 5-8 (승, Development): Build on the established mood by adding more layers, energy, or rhythmic complexity.
- Tracks 9-12 (전, Climax): Reach the emotional or energetic peak with the fullest arrangements and most intense dynamics.
- Tracks 13-15 (결, Resolution): Wind the energy back down for a satisfying, resolved close.
Make the overall sequence feel like one continuous, intentional musical journey, with smooth transitions in energy and instrumentation between sections.`
      : "";

  return `You are an expert prompt writer for Suno AI, the AI music generation tool.

Based on the following mood(s), write exactly ${PROMPT_COUNT} unique music prompts in English, ready to paste into Suno's "Style of Music" field:

${moodList}

Style requirements that apply to EVERY prompt:
- Tempo: roughly ${bpmMin}-${bpmMax} BPM
- Track length: about ${songLength} minute${songLength > 1 ? "s" : ""} long
- ${vocalLine}
${extraLines.length > 0 ? extraLines.join("\n") + "\n" : ""}
Additional requirements for each prompt:
- A single descriptive line (roughly 15-40 words)
- Include genre/sub-genre, mood, key instrumentation, and energy/dynamics
- Make all ${PROMPT_COUNT} prompts distinct from one another (vary sub-genres, instruments, eras, textures) while staying true to the chosen mood(s) and the shared style requirements above
- Written entirely in English, regardless of the language of the mood labels above${structureBlock}

Respond with ONLY a valid JSON array of exactly ${PROMPT_COUNT} strings — no markdown, no code fences, no explanation. Example shape:
["first prompt text", "second prompt text", "..."]`;
}

function extractJsonArray(text) {
  let cleaned = text.trim();
  // Strip ```json ... ``` or ``` ... ``` fences if the model added them anyway.
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("응답에서 JSON 배열을 찾을 수 없습니다.");
  }
  const jsonSlice = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(jsonSlice);
  if (!Array.isArray(parsed)) {
    throw new Error("응답이 배열 형식이 아닙니다.");
  }
  return parsed.filter((item) => typeof item === "string" && item.trim().length > 0);
}

async function callClaude(selectedMoods, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: buildUserPrompt(selectedMoods) }],
    }),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const errBody = await response.json();
      detail = errBody?.error?.message || JSON.stringify(errBody);
    } catch (_) {
      detail = await response.text();
    }
    throw new Error(`API 요청 실패 (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return extractJsonArray(text);
}

// ---- Clipboard helper ----------------------------------------------------------
function attachCopyHandler(button, textOrFn) {
  button.addEventListener("click", async () => {
    const text = typeof textOrFn === "function" ? textOrFn() : textOrFn;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "✅ 복사됨";
      button.classList.add("copied");
      setTimeout(() => {
        button.textContent = "📋 복사";
        button.classList.remove("copied");
      }, 1500);
    } catch (_) {
      button.textContent = "복사 실패";
      setTimeout(() => {
        button.textContent = "📋 복사";
      }, 1500);
    }
  });
}

// ---- Result rendering ----------------------------------------------------------
// 기승전결 (Ki-Seung-Jeon-Gyeol) section labels, keyed by the 0-based index where each section starts.
const STRUCTURE_SECTIONS = {
  0: "🌱 기 — 도입 (1-4번)",
  4: "📈 승 — 전개 (5-8번)",
  8: "🔥 전 — 전환/절정 (9-12번)",
  12: "🍃 결 — 마무리 (13-15번)",
};

function renderResults(prompts, options = {}) {
  resultGrid.innerHTML = "";
  resultCount.textContent = `(${prompts.length}곡)`;
  resultSection.hidden = false;

  prompts.forEach((promptText, index) => {
    if (options.structure === "on" && STRUCTURE_SECTIONS[index] !== undefined) {
      const sectionHeader = document.createElement("div");
      sectionHeader.className = "section-header";
      sectionHeader.textContent = STRUCTURE_SECTIONS[index];
      resultGrid.appendChild(sectionHeader);
    }

    const card = document.createElement("div");
    card.className = "prompt-card";
    card.innerHTML = `
      <span class="prompt-index">Track ${String(index + 1).padStart(2, "0")}</span>
      <p class="prompt-text"></p>
      <button class="copy-btn">📋 복사</button>
    `;
    card.querySelector(".prompt-text").textContent = promptText;
    attachCopyHandler(card.querySelector(".copy-btn"), promptText);
    resultGrid.appendChild(card);
  });

  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Generate button handler -----------------------------------------------------
async function handleGenerate() {
  const apiKey = getApiKey();
  if (!apiKey) {
    generateHint.textContent = "먼저 상단에서 Anthropic API 키를 입력하고 저장해주세요.";
    generateHint.className = "generate-hint error";
    return;
  }
  if (selectedMoodNames.size === 0) return;

  const selectedMoods = currentMoodCards.filter((m) => selectedMoodNames.has(m.name));

  generateBtn.disabled = true;
  generateBtn.innerHTML = `<span class="spinner"></span>생성 중...`;
  generateHint.textContent = "Claude가 프롬프트를 작성하고 있어요. 잠시만 기다려주세요...";
  generateHint.className = "generate-hint";

  try {
    const prompts = await callClaude(selectedMoods, apiKey);
    if (prompts.length === 0) {
      throw new Error("생성된 프롬프트가 없습니다. 다시 시도해주세요.");
    }

    const options = {
      vocal: vocalMode,
      bpmMin,
      bpmMax,
      length: songLength,
      structure: structureMode,
      instruments: INSTRUMENTS.filter((i) => selectedInstruments.has(i.id)).map((i) => i.label),
      genres: [...selectedGenres],
      space: SPACES.find((s) => s.id === selectedSpaceId)?.label || "",
      season: SEASONS.find((s) => s.id === selectedSeasonId)?.label || "",
      backgroundSounds: BACKGROUND_SOUNDS.filter((b) => selectedBackgroundSounds.has(b.id)).map((b) => b.label),
    };

    renderResults(prompts, options);
    generateHint.textContent = `선택한 분위기: ${[...selectedMoodNames].join(", ")}`;

    saveHistoryEntry({
      id: Date.now(),
      date: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      moods: selectedMoods.map((m) => `${m.emoji} ${m.name}`),
      options,
      prompts,
    });
    renderHistory();
  } catch (err) {
    console.error(err);
    generateHint.textContent = `오류: ${err.message}`;
    generateHint.className = "generate-hint error";
  } finally {
    generateBtn.disabled = selectedMoodNames.size === 0;
    generateBtn.innerHTML = "✨ 프롬프트 생성";
  }
}

// ---- Playlist history (localStorage) ----------------------------------------------
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveHistoryEntry(entry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function deleteHistoryEntry(id) {
  const history = loadHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function clearAllHistory() {
  if (loadHistory().length === 0) return;
  if (!confirm("저장된 히스토리를 모두 삭제할까요? 이 작업은 되돌릴 수 없어요.")) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();
  historyEmpty.hidden = history.length > 0;
  historyList.innerHTML = "";

  history.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <div class="history-head">
        <div>
          <span class="history-date"></span>
          <span class="history-moods"></span>
          <span class="history-options"></span>
        </div>
        <button class="btn btn-secondary history-delete-btn">🗑 삭제</button>
      </div>
      <details class="history-details">
        <summary>프롬프트 ${entry.prompts.length}개 보기 / 복사</summary>
        <div class="history-prompts"></div>
      </details>
    `;

    card.querySelector(".history-date").textContent = entry.date;
    card.querySelector(".history-moods").textContent = entry.moods.join(", ");
    card.querySelector(".history-options").textContent = describeStyleOptions(entry.options);

    const promptsContainer = card.querySelector(".history-prompts");
    entry.prompts.forEach((promptText, index) => {
      const row = document.createElement("div");
      row.className = "history-prompt-row";
      row.innerHTML = `<span class="history-prompt-text"></span><button class="copy-btn">📋 복사</button>`;
      row.querySelector(".history-prompt-text").textContent = `${index + 1}. ${promptText}`;
      attachCopyHandler(row.querySelector(".copy-btn"), promptText);
      promptsContainer.appendChild(row);
    });

    card.querySelector(".history-delete-btn").addEventListener("click", () => deleteHistoryEntry(entry.id));
    historyList.appendChild(card);
  });
}

// ---- Tabs -----------------------------------------------------------------------
function setupTabs() {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
      Object.entries(tabPanels).forEach(([key, panel]) => {
        panel.hidden = key !== target;
      });
      if (target === "history") renderHistory();
    });
  });
}

// ---- Logic Pro integration --------------------------------------------------------
function buildLogicCommand(folderName) {
  // $HOME expands safely inside double quotes (unlike ~), so spaces in the
  // folder name are preserved correctly when pasted into a shell.
  return `osascript ${LOGIC_SCRIPT_PATH} "$HOME/Desktop/${folderName}"`;
}

function setupLogicPro() {
  logicGenerateBtn.addEventListener("click", () => {
    const folderName = logicFolderInput.value.trim();
    if (!folderName) {
      logicHint.textContent = "먼저 바탕화면에 있는 폴더 이름을 입력해주세요.";
      logicHint.className = "generate-hint error";
      logicInstructions.hidden = true;
      return;
    }

    logicCommandText.textContent = buildLogicCommand(folderName);
    logicHint.textContent = `대상 폴더: ~/Desktop/${folderName} — 아래 안내를 따라 터미널에서 실행하세요.`;
    logicHint.className = "generate-hint";
    logicInstructions.hidden = false;
    logicInstructions.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  attachCopyHandler(logicCommandCopy, () => logicCommandText.textContent);
}

// ---- Wire up events -------------------------------------------------------------
saveKeyBtn.addEventListener("click", saveApiKey);
shuffleBtn.addEventListener("click", renderMoodCards);
generateBtn.addEventListener("click", handleGenerate);
clearHistoryBtn.addEventListener("click", clearAllHistory);

setupStyleOptions();
setupThemeOptions();
setupEmphasisSliders();
setupTabs();
setupLogicPro();

loadApiKey();
renderMoodCards();
renderHistory();
