const words = [
  {word:'cross', ko:'십자가', icon:'✝️'}, {word:'Heaven', ko:'천국', icon:'🏰'},
  {word:'earth', ko:'지구', icon:'🌍'}, {word:'pray', ko:'기도하다', icon:'🙏'},
  {word:'sin', ko:'죄', icon:'🚫'}, {word:'heart', ko:'마음', icon:'❤️'},
  {word:'give', ko:'주다', icon:'🎁'}, {word:'read', ko:'읽다', icon:'📖'},
  {word:'take', ko:'가져가다', icon:'🙋'}, {word:'school', ko:'학교', icon:'🏫'},
  {word:'thing', ko:'것 · 물건', icon:'🧸'}, {word:'away', ko:'멀리', icon:'✈️'}
];
const practice = [
  {before:'I must ask ', after:' to take away sin.', answer:'Jesus', choices:['Jesus','Mother','Father']},
  {before:'I ask Jesus to live in my ', after:'.', answer:'heart', choices:['Heaven','heart','ear']},
  {before:'We read God’s ', after:'.', answer:'Book', choices:['Book','Look','Took']},
  {before:'We ', after:' and pray for God.', answer:'work', choices:['word','worm','work']},
  {before:'We ', after:' about God.', answer:'sing', choices:['sing','ring','sink']},
  {before:'We tell ', after:' about Jesus.', answer:'others', choices:['obey','others','over']}
];
const tests = [
  {before:'God lives in ', after:'.', answer:'Heaven', choices:['Leaven','Heaven','Clouds']},
  {before:'Sins are the ', after:' things we do.', answer:'bad', choices:['bad','good','right']},
  {before:'We can live in ', after:'.', answer:'Heaven', choices:['Leaven','Hearts','Heaven']},
  {before:'We must have ', after:' in our hearts.', answer:'Jesus', choices:['Father','Mother','Jesus']},
  {before:'Jesus died on a ', after:'.', answer:'cross', choices:['crome','cross','toss']}
];
const state = {learned:new Set(), practice:new Set()};
const wordGrid=document.querySelector('#wordGrid');
words.forEach((item,i)=>{const el=document.createElement('button');el.className='word-card';el.innerHTML=`<span class="sound">▶</span><div class="illustration">${item.icon}</div><div class="word">${item.word}</div><div class="meaning">${item.ko}</div>`;el.addEventListener('click',()=>{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(item.word));el.classList.add('learned');state.learned.add(i);updateProgress()});wordGrid.append(el)});
const practiceList=document.querySelector('#practiceList');
practice.forEach((q,i)=>{const el=document.createElement('div');el.className='practice-item';el.innerHTML=`<span class="num">${i+1}</span><div class="sentence">${q.before}<span class="blank">______</span>${q.after}</div><select class="answer-select" aria-label="${i+1}번 정답"><option value="">고르기</option>${q.choices.map(c=>`<option>${c}</option>`).join('')}</select><span class="feedback"></span>`;const select=el.querySelector('select');select.addEventListener('change',()=>{el.classList.remove('correct','wrong');const right=select.value===q.answer;el.classList.add(right?'correct':'wrong');el.querySelector('.feedback').textContent=right?'참 잘했어요!':'다시 해봐요';if(right)state.practice.add(i);else state.practice.delete(i);document.querySelector('#practiceScore').textContent=state.practice.size;updateProgress()});practiceList.append(el)});
const form=document.querySelector('#testForm');
tests.forEach((q,i)=>{const el=document.createElement('div');el.className='test-question';el.dataset.answer=q.answer;el.innerHTML=`<div class="qtext">${i+1}. ${q.before}______${q.after}</div><div class="choices">${q.choices.map(c=>`<label class="choice"><input type="radio" name="q${i}" value="${c}"><span>${c}</span></label>`).join('')}</div>`;form.append(el)});
form.addEventListener('change',()=>document.querySelector('#testCount').textContent=`${Array.from(new FormData(form).entries()).length} / 5`);
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===id));document.querySelector('.tabs').scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>showView(t.dataset.view));document.querySelectorAll('.next').forEach(b=>b.onclick=()=>showView(b.dataset.next));document.querySelector('#startBtn').onclick=()=>document.querySelector('.tabs').scrollIntoView({behavior:'smooth'});
function updateProgress(){const n=Math.min(15,state.learned.size+state.practice.size);document.querySelector('#progressText').textContent=`${n} / 15`;document.querySelector('#progressBar').style.width=`${n/15*100}%`}
document.querySelector('#gradeBtn').onclick=()=>{const data=new FormData(form);let score=0;document.querySelectorAll('.test-question').forEach((el,i)=>{const ok=data.get(`q${i}`)===el.dataset.answer;el.classList.remove('ok','no');el.classList.add(ok?'ok':'no');if(ok)score++});const result=document.querySelector('#result');result.classList.add('show');result.innerHTML=`<strong>${score*20}점</strong>${score===5?'완벽해요! 모든 문제를 맞혔어요 🎉':`${score}문제를 맞혔어요. 틀린 문제를 다시 살펴봐요!`}`;result.scrollIntoView({behavior:'smooth',block:'center'})};
document.querySelector('#resetBtn').onclick=()=>{if(confirm('공부 기록을 모두 지우고 다시 시작할까요?'))location.reload()};
