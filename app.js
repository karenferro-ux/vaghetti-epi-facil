
const EPIS = [
  {id:'auricular-plug',name:'Protetor Auricular Tipo Plug',icon:'hearing',category:'Proteção Auditiva',risks:['Ruído'],desc:'Proteção auditiva para ambientes com níveis elevados de ruído.',detail:'Espuma expansível, uso individual e ajuste correto no canal auditivo.'},
  {id:'auricular-concha',name:'Protetor Auricular Tipo Concha',icon:'hearing',category:'Proteção Auditiva',risks:['Ruído'],desc:'Modelo tipo concha para atenuação de ruído em áreas industriais.',detail:'Indicado para uso prolongado quando compatível com o risco da atividade.'},
  {id:'oculos',name:'Óculos de Proteção',icon:'visibility',category:'Proteção dos Olhos',risks:['Químico','Partículas'],desc:'Lente de proteção contra partículas e respingos conforme o modelo aprovado.',detail:'Verifique lente, armação e ajuste antes de iniciar a atividade.'},
  {id:'luva-anticorte',name:'Luvas Anticorte',icon:'front_hand',category:'Proteção das Mãos',risks:['Corte','Partículas'],desc:'Proteção das mãos durante o manuseio de peças com risco de corte.',detail:'Use somente quando o tipo de luva for compatível com a tarefa.'},
  {id:'calcado',name:'Calçado de Segurança',icon:'do_not_step',category:'Proteção dos Pés',risks:['Queda','Impacto'],desc:'Calçado com proteção adequada para riscos de impacto e escorregamento.',detail:'Confira integridade, solado e fechamento antes do uso.'},
  {id:'capacete',name:'Capacete de Segurança',icon:'engineering',category:'Proteção da Cabeça',risks:['Queda','Impacto'],desc:'Protege a cabeça contra impactos e objetos em queda.',detail:'Ajuste a suspensão e substitua o equipamento se houver dano.'},
  {id:'respirador',name:'Respirador PFF2',icon:'masks',category:'Proteção Respiratória',risks:['Químico','Poeira'],desc:'Proteção respiratória indicada para partículas e aerossóis em situações compatíveis.',detail:'O modelo deve ser escolhido conforme o risco identificado e as orientações de segurança.'},
  {id:'avental',name:'Avental de Proteção',icon:'shield',category:'Proteção do Tronco',risks:['Calor','Químico'],desc:'Proteção do tronco contra respingos e riscos específicos da atividade.',detail:'Escolha o material conforme o agente de risco e a orientação do fabricante.'}
];

const SECTORS = {
  'Usinagem':['auricular-concha','oculos','luva-anticorte','calcado'],
  'Pintura':['oculos','respirador','luva-anticorte','avental'],
  'Logística':['capacete','calcado','oculos'],
  'Manutenção Elétrica':['capacete','oculos','calcado','luva-anticorte']
};

function normalize(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function go(page){window.location.href=page}
function getEpi(id){return EPIS.find(e=>e.id===id)||EPIS[0]}
function searchEpi(q){
  const n=normalize(q);
  return EPIS.filter(e=>[e.name,e.category,e.desc,e.detail,...e.risks].some(v=>normalize(v).includes(n)));
}

function showToast(message){
  let t=document.getElementById('epi-toast');
  if(!t){
    t=document.createElement('div'); t.id='epi-toast';
    t.className='fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-on-background text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all duration-300';
    document.body.appendChild(t);
  }
  t.textContent=message; t.classList.remove('opacity-0','translate-y-2');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.add('opacity-0','translate-y-2'),2800);
}

function openEpiModal(id){
  const e=getEpi(id);
  let modal=document.getElementById('epi-modal');
  if(!modal){
    modal=document.createElement('div'); modal.id='epi-modal';
    modal.className='fixed inset-0 z-[90] hidden items-center justify-center p-4 bg-black/40 backdrop-blur-sm';
    modal.innerHTML=`
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-7 shadow-2xl border border-outline-variant/40 relative max-h-[90vh] overflow-auto">
        <button id="epi-modal-close" class="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center" aria-label="Fechar">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div id="epi-modal-content"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal) closeEpiModal()});
    document.getElementById('epi-modal-close').addEventListener('click',closeEpiModal);
  }
  document.getElementById('epi-modal-content').innerHTML=`
    <div class="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center text-primary mb-5">
      <span class="material-symbols-outlined text-3xl">${e.icon}</span>
    </div>
    <div class="text-xs uppercase tracking-wider font-bold text-primary mb-2">${e.category}</div>
    <h3 class="font-headline text-3xl font-bold text-on-background mb-3">${e.name}</h3>
    <p class="text-on-surface-variant leading-relaxed mb-5">${e.desc}</p>
    <div class="bg-surface-container rounded-2xl p-4 mb-5">
      <div class="font-bold mb-1">Cuidados e orientação</div>
      <div class="text-sm text-on-surface-variant">${e.detail}</div>
    </div>
    <div class="flex flex-wrap gap-2 mb-6">${e.risks.map(r=>`<span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">${r}</span>`).join('')}</div>
    <a href="epi.html?epi=${encodeURIComponent(e.id)}" class="w-full inline-flex justify-center items-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold hover:opacity-90">
      <span class="material-symbols-outlined">open_in_new</span> Ver instruções completas
    </a>`;
  modal.classList.remove('hidden'); modal.classList.add('flex'); document.body.classList.add('overflow-hidden');
}
function closeEpiModal(){
  const m=document.getElementById('epi-modal'); if(m){m.classList.add('hidden');m.classList.remove('flex');document.body.classList.remove('overflow-hidden')}
}

function renderSearchResults(results,container){
  if(!container)return;
  container.innerHTML='';
  if(!results.length){
    container.innerHTML='<div class="p-5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant">Nenhum EPI encontrado. Tente “capacete”, “luva”, “óculos”, “ruído”, “calor” ou “químico”.</div>';
    return;
  }
  results.forEach(e=>{
    const el=document.createElement('button');
    el.type='button'; el.className='w-full text-left p-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:border-primary hover:bg-primary/5 transition-all';
    el.innerHTML=`<div class="flex gap-4 items-center"><div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center"><span class="material-symbols-outlined text-primary">${e.icon}</span></div><div><div class="font-bold text-on-background">${e.name}</div><div class="text-sm text-on-surface-variant">${e.category} · ${e.desc}</div></div></div>`;
    el.addEventListener('click',()=>openEpiModal(e.id)); container.appendChild(el);
  });
}

function setupHome(){
  const input=document.querySelector('input[placeholder*="Buscar"]'); if(!input)return;
  const button=input.parentElement.querySelector('button');
  let panel=document.getElementById('search-results');
  if(!panel){panel=document.createElement('div');panel.id='search-results';panel.className='mt-4 max-w-2xl space-y-2';input.parentElement.parentElement.appendChild(panel)}
  const run=()=>{const q=input.value.trim();if(!q){panel.innerHTML='';return}renderSearchResults(searchEpi(q),panel)};
  input.addEventListener('input',run); input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run()}}); button?.addEventListener('click',run);

  document.querySelectorAll('main button').forEach(b=>{
    const label=b.innerText.trim();
    if(['Ruído','Queda','Calor','Químico'].includes(label)) b.addEventListener('click',()=>{input.value=label;run();input.scrollIntoView({behavior:'smooth',block:'center'})});
    if(label==='Ver Detalhes') b.addEventListener('click',()=>openEpiModal('auricular-concha'));
  });
}

function setupSectors(){
  const sectorButtons=[...document.querySelectorAll('main button')].filter(b=>SECTORS[b.innerText.trim()]);
  const title=[...document.querySelectorAll('h2,h3')].find(x=>normalize(x.innerText).includes('checklist'));
  const grid=title?.parentElement?.querySelector(':scope > div.grid');
  function selectSector(name,btn){
    sectorButtons.forEach(b=>b.classList.remove('bg-primary-container/20','border-primary/30'));
    btn.classList.add('bg-primary-container/20','border-primary/30');
    if(!grid)return;
    grid.innerHTML='';
    SECTORS[name].map(getEpi).forEach(e=>{
      const card=document.createElement('button'); card.type='button';
      card.className='bg-surface-bright rounded-xl p-5 border border-outline-variant/30 hover:border-primary/40 transition-colors flex flex-col items-center text-center group cursor-pointer shadow-sm';
      card.innerHTML=`<div class="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-4"><span class="material-symbols-outlined text-3xl text-primary">${e.icon}</span></div><h4 class="font-bold text-on-surface mb-2">${e.name}</h4><p class="text-sm text-on-surface-variant">${e.detail}</p>`;
      card.addEventListener('click',()=>openEpiModal(e.id)); grid.appendChild(card);
    });
    showToast(`${name}: ${SECTORS[name].length} EPIs recomendados`);
  }
  sectorButtons.forEach(b=>b.addEventListener('click',()=>selectSector(b.innerText.trim(),b)));
  if(sectorButtons[0])selectSector(sectorButtons[0].innerText.trim(),sectorButtons[0]);

  const confirm=[...document.querySelectorAll('button')].find(b=>normalize(b.innerText).includes('confirmar leitura'));
  if(confirm)confirm.addEventListener('click',()=>{localStorage.setItem('epiRead',new Date().toISOString());confirm.innerHTML='<span class="material-symbols-outlined text-sm">check_circle</span> Leitura confirmada';confirm.disabled=true;showToast('Leitura registrada com sucesso!')});
}

function setupEpi(){
  const params=new URLSearchParams(location.search); const e=getEpi(params.get('epi')||'auricular-plug');
  const h=document.querySelector('h1');
  if(h) h.innerHTML=e.name.replace(/(tipo.*)$/i,'<br><span class="text-primary italic">$1</span>');
  const desc=h?.parentElement?.querySelector('p'); if(desc)desc.textContent=e.desc+' '+e.detail;
  const icon=document.querySelector('h1')?.parentElement?.querySelector('.material-symbols-outlined');
  if(icon)icon.textContent=e.icon;
  const back=document.querySelector('header button'); if(back)back.addEventListener('click',()=>history.length>1?history.back():go('index.html'));
  const nr=[...document.querySelectorAll('button')].find(b=>normalize(b.innerText).includes('ver norma')); if(nr)nr.addEventListener('click',()=>go('normas.html'));
}

function setupNormas(){
  const links=[...document.querySelectorAll('a')];
  links.forEach(a=>{
    const text=normalize(a.innerText);
    if(a.getAttribute('href')==='#'){
      if(text.includes('home')||text.includes('busca'))a.href='index.html';
      else if(text.includes('setores'))a.href='setores.html';
      else if(text.includes('normas'))a.href='normas.html';
    }
    if(text.includes('falar com sesmt')){
      a.href='mailto:sesmt@empresa.com?subject=Solicitação%20sobre%20EPI';
      a.addEventListener('click',()=>showToast('Abrindo seu aplicativo de e-mail...'));
    }
  });
  const read=[...document.querySelectorAll('a')].find(a=>normalize(a.innerText).includes('ler norma completa'));
  if(read)read.href='normas.html';
}

function setupGlobal(){
  document.querySelectorAll('a[href="#"]').forEach(a=>{
    const t=normalize(a.innerText);
    if(t.includes('home')||t.includes('busca'))a.href='index.html';
    else if(t.includes('setores'))a.href='setores.html';
    else if(t.includes('normas'))a.href='normas.html';
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeEpiModal()});
}

document.addEventListener('DOMContentLoaded',()=>{
  setupGlobal(); setupHome(); setupSectors(); setupEpi(); setupNormas();
});
