// NEXFIT — страница товара

// Галерея
const mainImg = document.getElementById('mainImg');
const galleryImgs = ['assets/hero.jpg', 'assets/thumb1.jpg', 'assets/thumb2.jpg'];
let galIdx = 0;

galleryImgs.forEach(src => { const im = new Image(); im.src = src; });

function showImg(i) {
  galIdx = (i + galleryImgs.length) % galleryImgs.length;
  const next = galleryImgs[galIdx];
  if (mainImg.src.endsWith(next)) return;
  mainImg.classList.add('is-fading');
  setTimeout(() => {
    mainImg.onload = () => mainImg.classList.remove('is-fading');
    mainImg.src = next;
  }, 180);
}
document.getElementById('galPrev').addEventListener('click', () => showImg(galIdx - 1));
document.getElementById('galNext').addEventListener('click', () => showImg(galIdx + 1));

document.querySelectorAll('.thumb').forEach(t => {
  t.addEventListener('click', () => showImg(galleryImgs.indexOf(t.dataset.img)));
});

// Избранное
const favBtn = document.getElementById('favBtn');
favBtn.addEventListener('click', () => favBtn.classList.toggle('is-active'));

// Цвет
const colorName = document.getElementById('colorName');
document.querySelectorAll('.swatch').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(x => x.classList.remove('is-active'));
    s.classList.add('is-active');
    colorName.textContent = s.dataset.color;
  });
});

// Размер
document.querySelectorAll('.size').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.size').forEach(x => x.classList.remove('is-active'));
    s.classList.add('is-active');
  });
});

// Количество
const qtyVal = document.getElementById('qtyVal');
let qty = 1;
document.getElementById('qtyMinus').addEventListener('click', () => {
  if (qty > 1) qtyVal.textContent = --qty;
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  if (qty < 10) qtyVal.textContent = ++qty;
});

// Корзина
const cartCount = document.getElementById('cartCount');
let inCart = 0;
document.getElementById('addToCart').addEventListener('click', e => {
  inCart += qty;
  cartCount.textContent = inCart;
  cartCount.hidden = false;
  cartCount.classList.remove('pop');
  void cartCount.offsetWidth;
  cartCount.classList.add('pop');
  e.target.textContent = 'Добавлено ✓';
  setTimeout(() => { e.target.textContent = 'Добавить в корзину'; }, 1500);
});

// Табы
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('is-active'));
    document.querySelectorAll('.tab-pane').forEach(x => x.classList.remove('is-active'));
    t.classList.add('is-active');
    document.getElementById('tab-' + t.dataset.tab).classList.add('is-active');
  });
});

// «То что вы смотрели» — прокрутка на мобильных
const cards = document.getElementById('cards');
document.getElementById('vwPrev').addEventListener('click', () => cards.scrollBy({ left: -320, behavior: 'smooth' }));
document.getElementById('vwNext').addEventListener('click', () => cards.scrollBy({ left: 320, behavior: 'smooth' }));

// Гигантская надпись в футере — точно по ширине экрана
function fitFooterType() {
  const el = document.getElementById('footerFit');
  if (!el) return;
  const base = 100;
  el.style.fontSize = base + 'px';
  const w = el.getBoundingClientRect().width;
  const target = el.parentElement.clientWidth;
  if (w > 0) el.style.fontSize = (base * target / w * 0.99) + 'px';
  el.classList.add('fitted');
}
fitFooterType();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitFooterType);
window.addEventListener('resize', fitFooterType);

// Появление блоков при скролле
(function () {
  if (!('IntersectionObserver' in window)) return;
  const targets = [];
  const add = (sel, stagger) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (stagger) el.style.setProperty('--d', (i * stagger).toFixed(2) + 's');
      targets.push(el);
    });
  };
  add('.viewed__head');
  add('.reviews__head');
  add('.review', 0.08);
  add('.footer__col', 0.06);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));
})();
