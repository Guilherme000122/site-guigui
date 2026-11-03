const guidance = {
  inicio: 'Bem-vindo ao Lab 4.0! Vamos conhecer este espaço de tecnologia e aprendizagem.',
  bia: 'Agora que você já me conhece, que tal explorarmos o laboratório juntos?',
  sobre: 'Aqui você vai descobrir a importância do laboratório para a formação dos estudantes.',
  tecnologias: 'Vamos explorar as máquinas e entender suas funções.',
  cursos: 'Conheça as atividades e os cursos relacionados a este ambiente.',
  galeria: 'Observe as fotografias reais e os detalhes do laboratório.',
  visita: 'Prepare-se para explorar o espaço ao seu redor!'
};
const viewerTips = [
  'Clique na imagem para abrir a visita interativa do Lab 4.0 em 360 graus.',
  'No visualizador, arraste com o mouse ou deslize o dedo para olhar ao redor.',
  'Em dispositivos compatíveis, use o botão de óculos para entrar no modo VR.',
  'Use “Voltar ao Lab 4.0” para retornar à página principal.'
];
const sectionIds = Object.keys(guidance);
const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const guide = document.querySelector('.guide');
let intro = true;
let active = 'inicio';
let viewerTip = 0;

function setGuideMessage(message) {
  const text = guide.querySelector('.guide__bubble p');
  if (text) text.textContent = message;
}
function openGuide() {
  const bubble = guide.querySelector('.guide__bubble');
  const bia = guide.querySelector(':scope > .bia');
  const restore = guide.querySelector('.guide__restore');
  if (bubble) bubble.hidden = false;
  if (bia) bia.hidden = false;
  if (restore) restore.remove();
}
function visit(id) {
  intro = false;
  active = id;
  nav.classList.remove('nav--open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  guide.classList.toggle('guide--viewer-active', id === 'visita');
  openGuide();
  setGuideMessage(guidance[id]);
  guide.querySelector('.guide__start')?.remove();
}

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('nav--open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
document.querySelectorAll('.nav a, .brand').forEach(link => link.addEventListener('click', event => {
  const id = link.getAttribute('href')?.slice(1);
  if (id && sectionIds.includes(id)) { event.preventDefault(); visit(id); }
}));

const actionButtons = [...document.querySelectorAll('button')];
actionButtons.filter(b => /Explorar o laboratório|Vamos conhecer o laboratório|Iniciar visita/.test(b.textContent)).forEach(b => b.addEventListener('click', () => visit('visita')));
actionButtons.filter(b => b.textContent.trim().startsWith('Voltar ao início')).forEach(b => b.addEventListener('click', () => visit('inicio')));

const equipmentDialog = document.querySelector('.equipment-dialog');
const equipmentDialogCategory = equipmentDialog?.querySelector('.equipment-dialog__category');
const equipmentDialogTitle = equipmentDialog?.querySelector('#equipment-dialog-title');
const equipmentDialogDescription = equipmentDialog?.querySelector('.equipment-dialog__description');
document.querySelectorAll('.equipment-card').forEach(card => card.addEventListener('click', () => {
  const body = card.querySelector('.equipment-card__body');
  const category = body?.querySelector('small')?.textContent.trim();
  const name = body?.querySelector('b')?.textContent.trim();
  const description = body?.querySelector(':scope > span')?.textContent.trim();
  if (!equipmentDialog || !equipmentDialogCategory || !equipmentDialogTitle || !equipmentDialogDescription || !category || !name || !description) return;

  equipmentDialogCategory.textContent = category;
  equipmentDialogTitle.textContent = name;
  equipmentDialogDescription.textContent = description;
  equipmentDialog.showModal();
  active = 'tecnologias';
  openGuide();
  setGuideMessage(`Confira as informações de ${name} nesta janela.`);
}));
equipmentDialog?.querySelector('.equipment-dialog__close')?.addEventListener('click', () => equipmentDialog.close());

const guideClose = guide.querySelector('.guide__close');
guideClose?.addEventListener('click', () => {
  guide.querySelector('.guide__bubble').hidden = true;
  guide.querySelector(':scope > .bia').hidden = true;
  const restore = document.createElement('button');
  restore.className = 'guide__restore';
  restore.textContent = 'Falar com a Bia';
  restore.addEventListener('click', openGuide);
  guide.appendChild(restore);
});
guide.querySelector('.guide__start')?.addEventListener('click', () => visit('sobre'));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  active = entry.target.id;
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${active}`));
  guide.classList.toggle('guide--viewer-active', active === 'visita');
  if (!intro) setGuideMessage(guidance[active]);
}), { rootMargin: '-42% 0px -50%' });
sectionIds.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });

const viewerBia = document.querySelector('.viewer-bia');
const viewerBubble = viewerBia?.querySelector('.viewer-bia__bubble');
const viewerFigure = viewerBia?.querySelector('.bia');
const viewerText = viewerBubble?.querySelector('p');
function restartViewerAnimation() {
  viewerBubble.style.animation = 'none';
  void viewerBubble.offsetWidth;
  viewerBubble.style.animation = '';
}
viewerBia?.querySelector('.viewer-bia__close')?.addEventListener('click', () => {
  viewerBubble.hidden = true; viewerFigure.hidden = true;
  const restore = document.createElement('button'); restore.className = 'viewer-bia__restore'; restore.textContent = 'Mostrar Bia';
  restore.addEventListener('click', () => { viewerBubble.hidden = false; viewerFigure.hidden = false; restore.remove(); });
  viewerBia.appendChild(restore);
});
const viewerActions = viewerBia?.querySelectorAll('.viewer-bia__actions button');
viewerActions?.[0]?.addEventListener('click', restartViewerAnimation);
viewerActions?.[1]?.addEventListener('click', () => { viewerTip = (viewerTip + 1) % viewerTips.length; viewerText.textContent = viewerTips[viewerTip]; restartViewerAnimation(); });

const infoToggle = document.querySelector('.info-toggle');
const infoPanel = document.querySelector('.viewer-panel');
infoToggle?.addEventListener('click', () => {
  const isExpanded = infoToggle.getAttribute('aria-expanded') === 'true';
  infoToggle.setAttribute('aria-expanded', String(!isExpanded));
  infoPanel.hidden = isExpanded;
});
infoPanel?.querySelector('.viewer-panel__close')?.addEventListener('click', () => {
  infoPanel.hidden = true;
  infoToggle.setAttribute('aria-expanded', 'false');
  infoToggle.focus();
});
