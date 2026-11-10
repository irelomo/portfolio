// Small, dependency-free interactions for the portfolio.
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero entrance
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Reveal on scroll, with a small stagger for siblings
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--delay', `${Math.min(i, 5) * 0.08}s`);
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Scroll-linked effects: progress bar, header, act rail, parallax numerals
  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.scroll-progress span');
  const rail = document.querySelector('.act-rail');
  const railItems = rail ? [...rail.querySelectorAll('li')] : [];
  const acts = [...document.querySelectorAll('.act')];
  const nums = [...document.querySelectorAll('.act-num')];

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    header.classList.toggle('scrolled', y > 40);

    if (acts.length && rail) {
      const first = acts[0].offsetTop;
      const last = acts[acts.length - 1];
      const end = last.offsetTop + last.offsetHeight;
      const mid = y + vh * 0.5;
      rail.classList.toggle('visible', mid > first && mid < end);
      const p = Math.min(1, Math.max(0, (mid - first) / (end - first)));
      rail.style.setProperty('--rail', p.toFixed(4));
      acts.forEach((act, i) => {
        const inAct = mid >= act.offsetTop && mid < act.offsetTop + act.offsetHeight;
        railItems[i]?.classList.toggle('active', inAct);
      });
    }

    if (!reduceMotion) {
      nums.forEach((n) => {
        const r = n.parentElement.getBoundingClientRect();
        n.style.setProperty('--parallax', `${(r.top - vh / 2) * -0.15}px`);
      });
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
