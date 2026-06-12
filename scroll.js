// NEXFIT — скролл-анимации (GSAP ScrollTrigger + Lenis)
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  // Плавный инерционный скролл
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // ===== 1. Пин-секция «СОЗДАН ДЛЯ ДВИЖЕНИЯ» =====
  // Один scrub-таймлайн на весь сценарий: слова собираются → окно с фото
  // раскрывается на весь экран (clip-path, без пересчёта layout) → слова
  // улетают → подпись проявляется. Все фазы привязаны к прогрессу скролла,
  // поэтому всегда доигрывают до конца, как быстро бы ни крутили.
  function motionClipStart() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var w = vw <= 640 ? vw * 0.78 : Math.min(vw * 0.34, 420);
    var h = Math.min(w * 4 / 3, vh * 0.8);
    var x = Math.max((vw - w) / 2, 0), y = Math.max((vh - h) / 2, 0);
    return 'inset(' + y.toFixed(1) + 'px ' + x.toFixed(1) + 'px round 6px)';
  }

  gsap.set('.motion__word', { yPercent: 120, opacity: 0 });
  gsap.set('.motion__frame', { clipPath: motionClipStart() });

  var motionTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.motion',
      start: 'top top',
      end: '+=250%',
      scrub: 0.4,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
  motionTl
    // фаза 1: заголовок собирается (0 → 0.25)
    .fromTo('.motion__word', { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, stagger: 0.05, ease: 'power2.out', duration: 0.22 }, 0)
    // фаза 2: окно раскрывается на весь экран + фото доскейливается (0.3 → 0.72)
    .fromTo('.motion__frame',
      { clipPath: function () { return motionClipStart(); } },
      { clipPath: 'inset(0px 0px round 0px)', duration: 0.42 }, 0.3)
    .to('.motion__frame img', { scale: 1, duration: 0.42 }, 0.3)
    // фаза 3: заголовок улетает (0.34 → 0.58)
    .to('.motion__word', { yPercent: -160, opacity: 0, stagger: 0.04, ease: 'power1.in', duration: 0.2 }, 0.34)
    // фаза 4: подпись проявляется и остаётся (0.74 → 0.92)
    .fromTo('.motion__caption', { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power1.out', duration: 0.18 }, 0.74);

  // ===== 2. Описание товара — слова проявляются по скроллу (Apple-стиль) =====
  var desc = document.querySelector('#tab-desc .about__cols > p');
  if (desc) {
    desc.innerHTML = desc.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="split-word">' + w + '</span>';
    }).join(' ');
    gsap.to(desc.querySelectorAll('.split-word'), {
      opacity: 1,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: { trigger: desc, start: 'top 82%', end: 'bottom 55%', scrub: true }
    });
  }

  // ===== 3. Карточки «То, что вы смотрели» — ровный fade-in, без поворота и scrub =====
  gsap.from('.card', {
    y: 60,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out',
    duration: 0.7,
    scrollTrigger: { trigger: '.cards', start: 'top 85%' }
  });

  // ===== 4. Перки 01/02/03 — единый fade-in, без параллакса (цифры не уезжают) =====
  gsap.from('.perk', {
    opacity: 0, y: 40, stagger: 0.12, ease: 'power2.out', duration: 0.8,
    scrollTrigger: { trigger: '.perks', start: 'top 80%' }
  });

  // ===== 5. Гигантский nexfit — буквы выезжают по одной =====
  var ft = document.getElementById('footerFit');
  if (ft) {
    var text = ft.textContent;
    ft.innerHTML = text.split('').map(function (ch) {
      return '<span class="ft-letter">' + ch + '</span>';
    }).join('');
    // end: 'bottom bottom' — окно гарантированно достижимо у низа страницы,
    // буквы всегда доезжают до конца (раньше end был недостижим и анимация зависала)
    gsap.from(ft.querySelectorAll('.ft-letter'), {
      yPercent: 105,
      opacity: 0,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.footer__type', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
  }

  // Пересчёт после загрузки шрифтов/картинок (влияет на высоты)
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
