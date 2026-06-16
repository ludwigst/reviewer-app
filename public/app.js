// ─── GREETINGS ───────────────────────────────────────────────────────────────

const GREETINGS = [
  { main: 'Get that bread,',        sub: 'Your license isn\'t gonna get itself.' },
  { main: 'Padayon,',               sub: 'Keep moving. You\'re closer than you think.' },
  { main: 'I believe in you,',      sub: 'Now go prove yourself right.' },
  { main: 'Basic yan sayo,',        sub: 'You\'ve studied harder things than this.' },
  { main: 'No sweat,',              sub: 'One question at a time. Let\'s go.' },
  { main: 'Laban lang,',            sub: 'The board exam won\'t know what hit it.' },
  { main: 'You\'ve got this,',      sub: 'Consistency beats cramming every time.' },
  { main: 'Charge it to the game,', sub: 'Miss one, learn one. That\'s the process.' },
  { main: 'Para sa lisensya,',      sub: 'Every session gets you closer. Grind on.' },
  { main: 'Ikaw na,',               sub: 'The future Teacher Board Passer is here.' },
];

const RESULTS_MESSAGES = [
  { hi: { main: 'Slay!', sub: 'That\'s a passing score. Keep that energy.' }, mid: { main: 'Not bad!', sub: 'You\'re getting there. One more round?' }, lo: { main: 'Charge it,', sub: 'Miss now, pass later. Review those weak spots.' } },
  { hi: { main: 'Basic yan sayo!', sub: 'Told you. Now do it again.' }, mid: { main: 'Padayon!', sub: 'Progress is progress. Keep going.' }, lo: { main: 'No sweat,', sub: 'This is what practice is for. You\'ll get it.' } },
  { hi: { main: 'LET passer behavior!', sub: 'This is exactly what we\'re going for.' }, mid: { main: 'I believe in you,', sub: 'You\'re building the habit. That matters.' }, lo: { main: 'Laban lang,', sub: 'The grind is the point. Don\'t stop now.' } },
];

// ─── STATE ────────────────────────────────────────────────────────────────────

// Durable fields (user, stats, history, collections) come from the persistence
// store; quiz + selected* are ephemeral and never persisted.
let state = {
  ...Store.defaults(),
  quiz: { component:'Gen Ed', difficulty:'mixed', mode:'quick', topic:null, instant:true, questions:[], usedIds:new Set(), current:0, chosen:[], sessionCorrect:0, sessionTotal:0, sessionWrong:[], totalQuestions:10, timer:null },
  selectedComponent:'Gen Ed', selectedDiff:'mixed', selectedMode:'quick', selectedInstant:true,
  selectedProgressComponent:'Gen Ed',
  lastReview:null, review:null,
};

// ─── PERSISTENCE ───────────────────────────────────────────────────────────────

function persist() {
  Store.save({
    version: Store.VERSION,
    user: state.user,
    stats: state.stats,
    history: state.history,
    collections: state.collections,
  });
}

// Local 'YYYY-MM-DD' key for the given date (defaults to now).
function dayKey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// True if `lastKey` is exactly the calendar day before `todayK`.
function isYesterday(lastKey, todayK) {
  const t = new Date(todayK + 'T00:00:00');
  t.setDate(t.getDate() - 1);
  return dayKey(t) === lastKey;
}

// Day-streak: +1 the first time the user is active on a new day that follows the
// previous active day; reset to 1 after any gap; no-op if already counted today.
function updateStreak() {
  const today = dayKey();
  const last = state.stats.lastActive;
  if (last === today) {
    if (!state.stats.streak) state.stats.streak = 1;
    return;
  }
  state.stats.streak = (last && isYesterday(last, today)) ? (state.stats.streak || 0) + 1 : 1;
  state.stats.lastActive = today;
}

// ─── BOOT ──────────────────────────────────────────────────────────────────────

function init() {
  const saved = Store.load();
  state.user = saved.user;
  state.stats = saved.stats;
  state.history = saved.history;
  state.collections = saved.collections;
  state.version = saved.version;
  if (Store.hasProfile(saved)) enterApp();
}

if (typeof window !== 'undefined') window.addEventListener('DOMContentLoaded', init);

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

function selectTrack(el) {
  document.querySelectorAll('[data-track]').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.user.track = el.dataset.track;
  document.getElementById('spec-section').classList.toggle('hidden', state.user.track !== 'Secondary');
}

function startApp() {
  state.user.name = document.getElementById('user-name').value.trim() || 'Reviewer';
  state.user.spec = document.getElementById('spec-select').value;
  const d = document.getElementById('exam-date').value;
  state.user.examDate = d || null; // stored as 'YYYY-MM-DD' string for JSON round-trip
  persist();
  enterApp();
}

// Reveal the main app, populate the chrome (avatar/topbar), count the day, and
// land on Home. Used both after onboarding and on boot when a profile exists.
function enterApp() {
  const name = state.user.name || 'Reviewer';
  document.getElementById('screen-onboarding').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('avatar-initials').textContent = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('topbar-name').textContent = name.split(' ')[0];
  document.getElementById('topbar-track-badge').textContent = state.user.track;
  document.getElementById('topbar-track-badge').className = 'tag '+(state.user.track==='Elementary'?'tag-gened':'tag-spec');
  document.getElementById('topbar-days').textContent = '';
  if (state.user.examDate) {
    const days = Math.ceil((new Date(state.user.examDate) - new Date()) / 864e5);
    if (days > 0) document.getElementById('topbar-days').textContent = days+'d left';
  }
  updateStreak();
  persist();
  goTo('screen-home');
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function renderHome() {
  const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  document.getElementById('greeting').textContent = g.main+' '+state.user.name.split(' ')[0]+'!';
  document.getElementById('greeting-sub').textContent = g.sub;
  document.getElementById('stat-total').textContent = state.stats.total;
  document.getElementById('stat-streak').textContent = state.stats.streak;
  document.getElementById('component-scores').innerHTML = getComponents().map(c => {
    const s = state.stats.byComponent[c]||{total:0,correct:0};
    const pct = s.total > 0 ? Math.round(s.correct/s.total*100) : null;
    const color = pctColor(pct);
    const label = c==='Specialization'?state.user.spec+' (Spec)':c;
    const floor = pct===null
      ? '<span class="muted">Not started yet</span>'
      : pct>=50
        ? '<span class="pass-text">✓ Above the 50% floor</span>'
        : '<span class="fail-text">✗ Below 50% floor — needs attention</span>';
    return `<div class="comp-score-row">
      ${masteryRing(pct, 46)}
      <div class="comp-score-meta">
        <div class="comp-score-top"><span>${label}</span><span style="font-weight:600;color:${color}">${pct!==null?pct+'%':'No data'}</span></div>
        <div class="floor-bar"><div class="floor-fill" style="width:${pct||0}%;background:${color}"></div></div>
        <div class="comp-score-floor">${floor}</div>
      </div>
    </div>`;
  }).join('');
}

// ─── MASTERY HELPERS ───────────────────────────────────────────────────────────

// Threshold palette shared across home/progress: ≥75 emerald, 50–74 amber, <50 red.
function pctColor(pct) {
  if (pct === null || pct === undefined) return '#B8B29C';
  return pct >= 75 ? '#1D9E75' : pct >= 50 ? '#BA7517' : '#E24B4A';
}

// Circular % gauge (conic-gradient). pct=null renders a muted, empty ring.
function masteryRing(pct, size) {
  size = size || 56;
  const color = pctColor(pct);
  const p = (pct === null || pct === undefined) ? 0 : pct;
  const label = (pct === null || pct === undefined) ? '—' : pct + '%';
  const fontSize = Math.round(size * 0.27);
  return `<div class="ring" role="img" aria-label="Mastery ${label}" style="width:${size}px;height:${size}px;--p:${p};--ring-color:${color}">
    <span class="ring-val" style="color:${color};font-size:${fontSize}px">${label}</span>
  </div>`;
}

// Questions available for a component (Specialization respects the user's spec).
function getComponentPool(component) {
  return component==='Specialization'
    ? (SPEC_QUESTIONS[state.user.spec]||[])
    : QUESTION_BANK.filter(q => q.component===component);
}

// { topicGroup: [topic, ...] } taxonomy derived from the component's question pool.
function getTaxonomy(component) {
  const groups = {};
  getComponentPool(component).forEach(q => {
    (groups[q.topicGroup] = groups[q.topicGroup] || new Set()).add(q.topic);
  });
  const out = {};
  Object.keys(groups).sort().forEach(g => { out[g] = [...groups[g]].sort(); });
  return out;
}

function topicStat(component, topic) {
  return ((state.stats.byTopic[component]||{})[topic]) || { total:0, correct:0 };
}

function getComponents() {
  return state.user.track==='Elementary'?['Gen Ed','Prof Ed']:['Gen Ed','Prof Ed','Specialization'];
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

function goTo(id) {
  if (id!=='screen-quiz') clearQuizTimer();
  document.querySelectorAll('[id^="screen-"]').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  if (id==='screen-mode')     renderModeScreen();
  if (id==='screen-progress') renderProgress();
  if (id==='screen-home')     renderHome();
}

function navTo(id, btn) {
  goTo(id);
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── MODE SCREEN ──────────────────────────────────────────────────────────────

function renderModeScreen() {
  // Components
  document.getElementById('mode-components').innerHTML = getComponents().map(c => {
    const label = c==='Specialization'?state.user.spec+' (Spec)':c;
    const tc = c==='Gen Ed'?'tag-gened':c==='Prof Ed'?'tag-profed':'tag-spec';
    const sel = state.selectedComponent===c;
    const sub = c==='Gen Ed'?'English, Filipino, Math, Science, Araling Panlipunan':c==='Prof Ed'?'Child dev, Assessment, Curriculum, Ed Tech...':state.user.spec+' board content';
    return `<button class="btn btn-full row-btn" style="${sel?'border-color:#1D9E75;background:#E1F5EE':''}" onclick="selectComponent('${c}')">
      <span class="tag ${tc}">${label}</span>
      <span style="font-size:12px;color:#999">${sub}</span>
    </button>`;
  }).join('');
  updateInstantToggle();
}

function selectComponent(c) { state.selectedComponent=c; renderModeScreen(); }

function selectDiff(el) {
  document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedDiff = el.dataset.diff;
}

function selectMode(el) {
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedMode = el.dataset.mode;
  updateInstantToggle();
}

// Instant feedback is a Practice-only option; Mock always reviews at the end.
function updateInstantToggle() {
  const el = document.getElementById('instant-toggle');
  if (!el) return;
  const isMock = state.selectedMode==='mock';
  el.classList.toggle('disabled', isMock);
  const on = isMock ? false : state.selectedInstant;
  el.classList.toggle('selected', on);
  el.textContent = isMock ? 'Review at end (timed exam)' : 'Instant feedback: '+(on?'On':'Off');
}

function toggleInstant(el) {
  if (state.selectedMode==='mock') return; // locked off for exams
  state.selectedInstant = !state.selectedInstant;
  updateInstantToggle();
}

// ─── QUESTION HELPERS ─────────────────────────────────────────────────────────

function getPool(component, difficulty) {
  const bank = component==='Specialization'
    ? (SPEC_QUESTIONS[state.user.spec]||[])
    : QUESTION_BANK.filter(q => q.component===component);
  if (difficulty==='mixed') return bank;
  return bank.filter(q => q.difficulty===difficulty);
}

function pickQuestion(pool, usedIds) {
  // Prefer unused questions; if all used, reset and pick from full pool
  let available = pool.filter(q => !usedIds.has(q.id));
  if (available.length === 0) { usedIds.clear(); available = pool; }
  return available[Math.floor(Math.random() * available.length)];
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

// Launch from the mode screen using the current selections.
function startQuiz() {
  beginQuiz({
    component: state.selectedComponent,
    difficulty: state.selectedDiff,
    mode: state.selectedMode,
    instant: state.selectedMode==='mock' ? false : state.selectedInstant,
  });
}

// Launch a focused drill on a single topic (from the Progress accordion).
function startTopicDrill(component, topic) {
  beginQuiz({ component, difficulty:'mixed', mode:'topic', topic, instant:true });
}

// Single entry point for every quiz. opts: {component, difficulty, mode, topic, instant}.
function beginQuiz(opts) {
  const component = opts.component;
  const difficulty = opts.difficulty || 'mixed';
  const mode = opts.mode || 'quick';
  const topic = opts.topic || null;
  const instant = opts.instant !== undefined ? opts.instant : (mode!=='mock');
  const totalQ = mode==='mock' ? 20 : 10;

  let pool = getPool(component, difficulty);
  if (topic) pool = pool.filter(q => q.topic===topic);
  if (pool.length === 0) {
    alert('No questions available for that selection. Try Mixed difficulty or another topic.');
    return;
  }

  // Pre-pick all questions upfront (no repeats within a session)
  const sessionUsed = new Set();
  const questions = Array.from({length: totalQ}, () => {
    const q = pickQuestion(pool, sessionUsed);
    if (q) sessionUsed.add(q.id);
    return q;
  }).filter(Boolean);

  clearQuizTimer();
  state.quiz = {
    component, difficulty, mode, topic, instant,
    questions,
    usedIds: sessionUsed,
    current: 0, chosen: [], sessionCorrect: 0, sessionTotal: 0, sessionWrong: [],
    totalQuestions: questions.length, timer: null,
  };

  goTo('screen-quiz');
  if (mode==='mock') startQuizTimer(totalQ * 60); // ~60s per item
  loadQuestion();
}

// ─── QUIZ TIMER (mock only) ────────────────────────────────────────────────────

function startQuizTimer(seconds) {
  clearQuizTimer();
  state.quiz.timer = { remaining: seconds, id: null };
  document.getElementById('q-timer').classList.remove('hidden');
  renderTimer();
  state.quiz.timer.id = setInterval(() => {
    if (!state.quiz.timer) return;
    state.quiz.timer.remaining--;
    renderTimer();
    if (state.quiz.timer.remaining <= 0) { clearQuizTimer(); endSession(); }
  }, 1000);
}

function renderTimer() {
  const t = state.quiz.timer; if (!t) return;
  const m = Math.floor(Math.max(0,t.remaining)/60), s = Math.max(0,t.remaining)%60;
  document.getElementById('q-timer-val').textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  document.getElementById('q-timer').classList.toggle('low', t.remaining<=60);
}

function clearQuizTimer() {
  if (state.quiz && state.quiz.timer && state.quiz.timer.id) clearInterval(state.quiz.timer.id);
  if (state.quiz) state.quiz.timer = null;
  const pill = document.getElementById('q-timer');
  if (pill) { pill.classList.add('hidden'); pill.classList.remove('low'); }
}

function loadQuestion() {
  const idx = state.quiz.current;
  const total = state.quiz.totalQuestions;
  const q = state.quiz.questions[idx];

  document.getElementById('q-counter').textContent = `Question ${idx+1} of ${total}`;
  document.getElementById('q-progress').style.width = ((idx+1)/total*100)+'%';
  document.getElementById('explanation-area').classList.add('hidden');
  document.getElementById('quiz-nav').classList.add('hidden');
  document.getElementById('choices').innerHTML = '';

  if (!q) { endSession(); return; }

  const cc = q.component==='Gen Ed'?'tag-gened':q.component==='Prof Ed'?'tag-profed':'tag-spec';
  const dc = q.difficulty==='easy'?'tag-easy':q.difficulty==='medium'?'tag-medium':'tag-hard';
  document.getElementById('q-comp-tag').textContent = q.component==='Specialization'?state.user.spec:q.component;
  document.getElementById('q-comp-tag').className = 'tag '+cc;
  document.getElementById('q-diff-tag').textContent = q.difficulty;
  document.getElementById('q-diff-tag').className = 'tag '+dc;
  const bloomTag = document.getElementById('q-bloom-tag');
  if (q.bloom) { bloomTag.textContent = q.bloom; bloomTag.classList.remove('hidden'); }
  else bloomTag.classList.add('hidden');
  document.getElementById('q-topic').textContent = q.topic;
  document.getElementById('q-stem').textContent = q.stem;
  document.getElementById('quiz-next-btn').innerHTML = (idx===total-1)
    ? 'See results <i class="ti ti-arrow-right"></i>'
    : 'Next <i class="ti ti-arrow-right"></i>';

  const el = document.getElementById('choices');
  q.choices.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'choice-btn'; b.textContent = c;
    b.onclick = () => selectAnswer(i, q);
    el.appendChild(b);
  });
}

function selectAnswer(chosen, q) {
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach(b => b.disabled=true);
  const correct = chosen===q.answer;
  state.quiz.chosen[state.quiz.current] = chosen;
  state.quiz.sessionTotal++;
  state.stats.total++;
  if (!state.stats.byComponent[q.component]) state.stats.byComponent[q.component]={total:0,correct:0};
  state.stats.byComponent[q.component].total++;
  const bt = state.stats.byTopic;
  bt[q.component] = bt[q.component] || {};
  bt[q.component][q.topic] = bt[q.component][q.topic] || { total:0, correct:0 };
  bt[q.component][q.topic].total++;
  if (correct) { state.quiz.sessionCorrect++; state.stats.correct++; state.stats.byComponent[q.component].correct++; bt[q.component][q.topic].correct++; }
  else state.quiz.sessionWrong.push(q.topic);

  if (state.quiz.instant) {
    btns[chosen].classList.add(correct?'correct':'wrong');
    if (!correct) btns[q.answer].classList.add('reveal-correct');
    document.getElementById('explanation-text').textContent = (correct?'✓ Correct! ':'✗ Incorrect. ')+q.explanation;
    document.getElementById('explanation-area').classList.remove('hidden');
  } else {
    btns[chosen].classList.add('picked'); // neutral: no reveal until end-of-test review
  }
  document.getElementById('quiz-nav').classList.remove('hidden');
  persist();
}

function nextQuestion() {
  state.quiz.current++;
  if (state.quiz.current >= state.quiz.totalQuestions) endSession();
  else loadQuestion();
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────

function endSession() {
  clearQuizTimer();
  const pct = Math.round(state.quiz.sessionCorrect/state.quiz.sessionTotal*100)||0;
  const tier = pct>=75?'hi':pct>=50?'mid':'lo';
  const rm = RESULTS_MESSAGES[Math.floor(Math.random()*RESULTS_MESSAGES.length)][tier];
  document.getElementById('res-score').textContent = pct+'%';
  document.getElementById('res-correct').textContent = state.quiz.sessionCorrect+'/'+state.quiz.sessionTotal;
  document.getElementById('results-title').textContent = rm.main+' '+state.user.name.split(' ')[0]+'!';
  document.getElementById('results-sub').textContent = rm.sub;
  document.getElementById('floor-result').innerHTML = pct>=50
    ?'<span style="color:#1D9E75">✓ Passed the 50% floor</span> — You cleared the minimum threshold for this component.'
    :'<span style="color:#E24B4A">✗ Below 50% floor</span> — In the real LET, below 50% on any component is an automatic fail, regardless of your overall average.';
  const weak = [...new Set(state.quiz.sessionWrong)];
  document.getElementById('weak-areas').textContent = weak.length?weak.join(' · '):'Nothing to flag this session!';
  state.stats.sessions.push({ date:new Date().toISOString(), score:pct, component:state.quiz.component, correct:state.quiz.sessionCorrect, total:state.quiz.sessionTotal });

  // Snapshot per-question answers so the Review screen survives quiz reset.
  state.lastReview = {
    component: state.quiz.component,
    mode: state.quiz.mode,
    topic: state.quiz.topic,
    score: pct,
    items: state.quiz.questions
      .map((q,i) => ({ q, chosen: state.quiz.chosen[i] }))
      .filter(it => it.chosen!==null && it.chosen!==undefined),
  };

  updateStreak();
  persist();
  goTo('screen-results');
}

function startMockExam() {
  state.selectedComponent = getComponents()[0];
  state.selectedDiff = 'mixed';
  state.selectedMode = 'mock';
  goTo('screen-mode');
}

function resetQuiz() {
  clearQuizTimer();
  state.quiz = { component:'Gen Ed', difficulty:'mixed', mode:'quick', topic:null, instant:true, questions:[], usedIds:new Set(), current:0, chosen:[], sessionCorrect:0, sessionTotal:0, sessionWrong:[], totalQuestions:10, timer:null };
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

function selectProgressComponent(c) {
  state.selectedProgressComponent = c;
  renderProgress();
}

function renderProgress() {
  document.getElementById('prog-total').textContent = state.stats.total;
  document.getElementById('prog-acc').textContent = state.stats.total>0?Math.round(state.stats.correct/state.stats.total*100)+'%':'—';

  // Component selector
  const comps = getComponents();
  if (!comps.includes(state.selectedProgressComponent)) state.selectedProgressComponent = comps[0];
  const active = state.selectedProgressComponent;
  document.getElementById('prog-comp-selector').innerHTML = comps.map(c => {
    const label = c==='Specialization'?state.user.spec+' (Spec)':c;
    return `<button class="topic-pill ${c===active?'selected':''}" onclick="selectProgressComponent('${c}')">${label}</button>`;
  }).join('');

  // Component header: mastery ring + 50% floor badge
  const cs = state.stats.byComponent[active]||{total:0,correct:0};
  const cpct = cs.total>0?Math.round(cs.correct/cs.total*100):null;
  const floorBadge = cpct===null
    ? '<span class="floor-badge neutral">No data yet</span>'
    : cpct>=50
      ? '<span class="floor-badge pass">✓ Above 50% floor</span>'
      : '<span class="floor-badge fail">✗ Below 50% floor</span>';
  document.getElementById('prog-comp-header').innerHTML = `
    <div class="comp-head">
      ${masteryRing(cpct, 66)}
      <div class="comp-head-meta">
        <div class="comp-head-title">${active==='Specialization'?state.user.spec+' (Spec)':active}</div>
        <div class="comp-head-sub">${cs.total} answered · ${cs.correct} correct</div>
        ${floorBadge}
      </div>
    </div>`;

  // Topic accordion (grouped by topicGroup → topics with mini floor-bars)
  const tax = getTaxonomy(active);
  const groups = Object.keys(tax);
  document.getElementById('prog-accordion').innerHTML = groups.length ? groups.map(g => {
    let gt=0, gc=0;
    const rows = tax[g].map(t => {
      const ts = topicStat(active, t);
      gt+=ts.total; gc+=ts.correct;
      const tpct = ts.total>0?Math.round(ts.correct/ts.total*100):null;
      const color = pctColor(tpct);
      const sub = t.includes(' - ')?t.split(' - ').slice(1).join(' - '):t;
      const flag = tpct!==null&&tpct<50?'<span class="topic-flag">below floor</span>':'';
      const tEsc = t.replace(/'/g, "\\'");
      return `<div class="topic-row">
        <div class="topic-row-head">
          <span class="topic-row-name">${sub}${flag}</span>
          <span class="topic-row-right">
            <span class="topic-row-pct" style="color:${color}">${tpct!==null?tpct+'%':'—'}</span>
            <button class="topic-play" title="Drill this topic" aria-label="Drill ${sub}" onclick="startTopicDrill('${active}', '${tEsc}')"><i class="ti ti-player-play"></i></button>
          </span>
        </div>
        <div class="floor-bar mini"><div class="floor-fill" style="width:${tpct||0}%;background:${color}"></div></div>
        <div class="topic-row-meta">${ts.total} answered</div>
      </div>`;
    }).join('');
    const gpct = gt>0?Math.round(gc/gt*100):null;
    const gcolor = pctColor(gpct);
    const belowFloor = gpct!==null && gpct<50;
    return `<details class="topic-acc"${belowFloor?' open':''}>
      <summary>
        <i class="ti ti-chevron-right acc-chevron"></i>
        <span class="acc-title">${g}${belowFloor?'<span class="topic-flag">below floor</span>':''}</span>
        <span class="acc-bar floor-bar mini"><span class="floor-fill" style="width:${gpct||0}%;background:${gcolor}"></span></span>
        <span class="acc-pct" style="color:${gcolor}">${gpct!==null?gpct+'%':'—'}</span>
      </summary>
      <div class="acc-body">${rows}</div>
    </details>`;
  }).join('') : '<div class="text-sm muted">No topics found for this component.</div>';

  const el = document.getElementById('prog-activity');
  el.innerHTML = state.stats.sessions.length
    ? state.stats.sessions.slice(-5).reverse().map(s=>`
        <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:0.5px solid #eee">
          <span style="font-size:13px">${s.component==='Specialization'?state.user.spec:s.component}</span>
          <span style="font-size:13px;font-weight:600;color:${s.score>=75?'#1D9E75':s.score>=50?'#BA7517':'#E24B4A'}">${s.score}%</span>
        </div>`).join('')
    : 'No sessions yet. Start practicing!';
}

// ─── REVIEW + BOOKMARKS ────────────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// A single default "Saved" collection backs the bookmark action (Sprint 4 adds
// named collections + management UI).
function defaultCollection() {
  let col = state.collections.find(c => c.id==='saved');
  if (!col) { col = { id:'saved', name:'Saved', qIds:[] }; state.collections.push(col); }
  return col;
}

function isBookmarked(qId) {
  const col = state.collections.find(c => c.id==='saved');
  return !!(col && col.qIds.includes(qId));
}

function toggleBookmark(qId, btn) {
  const col = defaultCollection();
  const i = col.qIds.indexOf(qId);
  if (i>=0) col.qIds.splice(i,1); else col.qIds.push(qId);
  persist();
  if (btn) updateBookmarkBtn(btn, col.qIds.includes(qId));
}

function updateBookmarkBtn(btn, on) {
  btn.classList.toggle('active', on);
  const label = btn.querySelector('span');
  if (label) label.textContent = on ? 'Saved' : 'Bookmark';
}

// Open the review for the most recently finished session.
function openReview() {
  if (!state.lastReview) return;
  renderReview(state.lastReview, 'screen-results');
  goTo('screen-review');
}

// payload: { component, mode, score, items:[{q, chosen}] }; back: screen id to return to.
function renderReview(payload, back) {
  state.review = { payload, back: back || 'screen-home' };
  const comp = payload.component==='Specialization' ? state.user.spec : payload.component;
  document.getElementById('review-title').textContent = 'Answer review';
  document.getElementById('review-sub').textContent =
    `${comp} · ${payload.score}% · ${payload.items.length} question${payload.items.length===1?'':'s'}`;
  document.getElementById('review-back-btn').onclick = () => goTo(state.review.back);
  document.getElementById('review-list').innerHTML = payload.items.length
    ? payload.items.map((it, idx) => reviewItemHTML(it, idx)).join('')
    : '<div class="text-sm muted">No answered questions to review.</div>';
}

function reviewItemHTML(it, idx) {
  const q = it.q;
  const chosen = it.chosen;
  const answered = chosen!==null && chosen!==undefined;
  const correct = answered && chosen===q.answer;
  const status = !answered ? 'skipped' : correct ? 'right' : 'wrong';
  const statusLabel = !answered ? 'Not answered' : correct ? 'Correct' : 'Incorrect';
  const choices = q.choices.map((c, i) => {
    let cls = 'review-choice';
    let mark = '';
    if (i===q.answer) { cls += ' correct'; mark = '<i class="ti ti-check"></i>'; }
    else if (answered && i===chosen) { cls += ' wrong'; mark = '<i class="ti ti-x"></i>'; }
    return `<div class="${cls}"><span class="review-choice-letter">${String.fromCharCode(65+i)}</span><span class="review-choice-text">${esc(c)}</span>${mark}</div>`;
  }).join('');
  const dc = q.difficulty==='easy'?'tag-easy':q.difficulty==='medium'?'tag-medium':'tag-hard';
  const bloom = q.bloom ? `<span class="tag tag-bloom">${esc(q.bloom)}</span>` : '';
  const bk = isBookmarked(q.id);
  return `<div class="review-card ${status}">
    <div class="review-card-head">
      <span class="review-num">${idx+1}</span>
      <span class="review-status ${status}">${statusLabel}</span>
      <span class="review-card-tags">${bloom}<span class="tag ${dc}">${q.difficulty}</span></span>
    </div>
    <div class="review-stem">${esc(q.stem)}</div>
    <div class="review-choices">${choices}</div>
    <div class="explanation-box review-rationale">${esc(q.explanation)}</div>
    <button class="btn btn-bookmark ${bk?'active':''}" onclick="toggleBookmark(${q.id}, this)">
      <i class="ti ti-bookmark"></i><span>${bk?'Saved':'Bookmark'}</span>
    </button>
  </div>`;
}
