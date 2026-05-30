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

let state = {
  user: { name:'', track:'Elementary', spec:'English', examDate:null },
  stats: { total:0, correct:0, streak:0, sessions:[], byComponent:{ 'Gen Ed':{total:0,correct:0}, 'Prof Ed':{total:0,correct:0}, 'Specialization':{total:0,correct:0} } },
  quiz: { component:'Gen Ed', difficulty:'mixed', mode:'quick', topicFilter:null, questions:[], usedIds:new Set(), current:0, sessionCorrect:0, sessionTotal:0, sessionWrong:[], totalQuestions:10 },
  selectedComponent:'Gen Ed', selectedDiff:'mixed', selectedMode:'quick',
};

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

function selectTrack(el) {
  document.querySelectorAll('[data-track]').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.user.track = el.dataset.track;
  document.getElementById('spec-section').classList.toggle('hidden', state.user.track !== 'Secondary');
}

function startApp() {
  const name = document.getElementById('user-name').value.trim() || 'Reviewer';
  state.user.name = name;
  state.user.spec = document.getElementById('spec-select').value;
  const d = document.getElementById('exam-date').value;
  state.user.examDate = d ? new Date(d) : null;
  document.getElementById('screen-onboarding').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('avatar-initials').textContent = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('topbar-name').textContent = name.split(' ')[0];
  document.getElementById('topbar-track-badge').textContent = state.user.track;
  document.getElementById('topbar-track-badge').className = 'tag '+(state.user.track==='Elementary'?'tag-gened':'tag-spec');
  if (state.user.examDate) {
    const days = Math.ceil((state.user.examDate - new Date()) / 864e5);
    if (days > 0) document.getElementById('topbar-days').textContent = days+'d left';
  }
  renderHome();
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
    const color = pct===null?'#999':pct>=75?'#1D9E75':pct>=50?'#BA7517':'#E24B4A';
    const label = c==='Specialization'?state.user.spec+' (Spec)':c;
    return `<div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
        <span style="color:#555">${label}</span>
        <span style="font-weight:600;color:${color}">${pct!==null?pct+'%':'No data'}</span>
      </div>
      <div class="floor-bar"><div class="floor-fill" style="width:${pct||0}%;background:${color}"></div></div>
      ${pct!==null&&pct<50?'<div style="font-size:11px;color:#E24B4A;margin-top:2px">Below 50% floor — needs attention</div>':''}
    </div>`;
  }).join('');
}

function getComponents() {
  return state.user.track==='Elementary'?['Gen Ed','Prof Ed']:['Gen Ed','Prof Ed','Specialization'];
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

function goTo(id) {
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

function startQuiz() {
  const totalQ = state.selectedMode==='mock' ? 20 : 10;
  const pool = getPool(state.selectedComponent, state.selectedDiff);

  if (pool.length === 0) {
    alert('No questions available for that combination. Try Mixed difficulty or a different component.');
    return;
  }

  // Pre-pick all questions upfront (no repeats within a session)
  const sessionUsed = new Set();
  const questions = Array.from({length: totalQ}, () => {
    const q = pickQuestion(pool, sessionUsed);
    if (q) sessionUsed.add(q.id);
    return q;
  }).filter(Boolean);

  state.quiz = {
    component: state.selectedComponent,
    difficulty: state.selectedDiff,
    mode: state.selectedMode,
    questions,
    usedIds: sessionUsed,
    current: 0, sessionCorrect: 0, sessionTotal: 0, sessionWrong: [],
    totalQuestions: questions.length,
  };

  goTo('screen-quiz');
  loadQuestion();
}

function loadQuestion() {
  const idx = state.quiz.current;
  const total = state.quiz.totalQuestions;
  const q = state.quiz.questions[idx];

  document.getElementById('q-counter').textContent = `Question ${idx+1} of ${total}`;
  document.getElementById('q-progress').style.width = ((idx+1)/total*100)+'%';
  document.getElementById('explanation-area').classList.add('hidden');
  document.getElementById('choices').innerHTML = '';

  if (!q) { endSession(); return; }

  const cc = q.component==='Gen Ed'?'tag-gened':q.component==='Prof Ed'?'tag-profed':'tag-spec';
  const dc = q.difficulty==='easy'?'tag-easy':q.difficulty==='medium'?'tag-medium':'tag-hard';
  document.getElementById('q-comp-tag').textContent = q.component==='Specialization'?state.user.spec:q.component;
  document.getElementById('q-comp-tag').className = 'tag '+cc;
  document.getElementById('q-diff-tag').textContent = q.difficulty;
  document.getElementById('q-diff-tag').className = 'tag '+dc;
  document.getElementById('q-topic').textContent = q.topic;
  document.getElementById('q-stem').textContent = q.stem;

  const el = document.getElementById('choices');
  q.choices.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'choice-btn'; b.textContent = c;
    b.onclick = () => selectAnswer(i, q);
    el.appendChild(b);
  });
}

function selectAnswer(chosen, q) {
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled=true);
  const correct = chosen===q.answer;
  document.querySelectorAll('.choice-btn')[chosen].classList.add(correct?'correct':'wrong');
  if (!correct) document.querySelectorAll('.choice-btn')[q.answer].classList.add('reveal-correct');
  state.quiz.sessionTotal++;
  state.stats.total++;
  if (!state.stats.byComponent[q.component]) state.stats.byComponent[q.component]={total:0,correct:0};
  state.stats.byComponent[q.component].total++;
  if (correct) { state.quiz.sessionCorrect++; state.stats.correct++; state.stats.byComponent[q.component].correct++; }
  else state.quiz.sessionWrong.push(q.topic);
  document.getElementById('explanation-text').textContent = (correct?'✓ Correct! ':'✗ Incorrect. ')+q.explanation;
  document.getElementById('explanation-area').classList.remove('hidden');
}

function nextQuestion() {
  state.quiz.current++;
  if (state.quiz.current >= state.quiz.totalQuestions) endSession();
  else loadQuestion();
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────

function endSession() {
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
  state.stats.sessions.push({ date:new Date(), score:pct, component:state.quiz.component, correct:state.quiz.sessionCorrect, total:state.quiz.sessionTotal });
  if (!state.stats.streak) state.stats.streak=1;
  goTo('screen-results');
}

function startMockExam() {
  state.selectedComponent = getComponents()[0];
  state.selectedDiff = 'mixed';
  state.selectedMode = 'mock';
  goTo('screen-mode');
}

function resetQuiz() {
  state.quiz = { component:'Gen Ed', difficulty:'mixed', mode:'quick', questions:[], usedIds:new Set(), current:0, sessionCorrect:0, sessionTotal:0, sessionWrong:[], totalQuestions:10 };
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

function renderProgress() {
  document.getElementById('prog-total').textContent = state.stats.total;
  document.getElementById('prog-acc').textContent = state.stats.total>0?Math.round(state.stats.correct/state.stats.total*100)+'%':'—';
  document.getElementById('prog-components').innerHTML = getComponents().map(c => {
    const s = state.stats.byComponent[c]||{total:0,correct:0};
    const pct = s.total>0?Math.round(s.correct/s.total*100):null;
    const color = pct===null?'#999':pct>=75?'#1D9E75':pct>=50?'#BA7517':'#E24B4A';
    const label = c==='Specialization'?state.user.spec+' (Spec)':c;
    return `<div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>${label}</span><span style="font-weight:600;color:${color}">${pct!==null?pct+'%':'No data yet'}</span></div>
      <div style="font-size:11px;color:#999;margin-bottom:3px">${s.total} answered · Floor: ${pct!==null?(pct>=50?'✓ Passed':'✗ Below 50%'):'—'}</div>
      <div class="floor-bar" style="height:7px"><div class="floor-fill" style="width:${pct||0}%;background:${color}"></div></div>
    </div>`;
  }).join('');
  const el = document.getElementById('prog-activity');
  el.innerHTML = state.stats.sessions.length
    ? state.stats.sessions.slice(-5).reverse().map(s=>`
        <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:0.5px solid #eee">
          <span style="font-size:13px">${s.component==='Specialization'?state.user.spec:s.component}</span>
          <span style="font-size:13px;font-weight:600;color:${s.score>=75?'#1D9E75':s.score>=50?'#BA7517':'#E24B4A'}">${s.score}%</span>
        </div>`).join('')
    : 'No sessions yet. Start practicing!';
}
