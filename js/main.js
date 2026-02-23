/* ═══════════════════════════════════════════════
   main.js
   Todas las animaciones ScrollTrigger de la página.

   ÍNDICE:
   0. Setup — Registro del plugin
   1. Cursor personalizado
   2. Barra de progreso de scroll
   3. Hero — Timeline de entrada
   4. Word Reveal (Sección 2)
   5. Tarjetas en cascada (Sección 3)
   6. Parallax multicapa (Sección 4)
   7. Pin Horizontal (Sección 5)
   8. Contadores animados (Sección 6)
   9. CTA Final (Sección 7)
═══════════════════════════════════════════════ */


/* ── 0. SETUP ─────────────────────────────────
   Siempre lo primero: registrar el plugin.
   Sin esto, ScrollTrigger no funciona.
────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── MENÚ HAMBURGUESA ─────────────────────────
   Al hacer click en el botón:
   - Añade/quita la clase "active" al menú y al botón
   - Muestra/oculta el overlay
   - Bloquea el scroll del body mientras está abierto
────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');

function toggleMenu(open) {
  hamburger.classList.toggle('active', open);
  navLinks.classList.toggle('active', open);
  navOverlay.style.display = open ? 'block' : 'none';
  // Pequeño delay para que la transición de opacidad funcione
  setTimeout(() => navOverlay.classList.toggle('active', open), 10);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('active');
  toggleMenu(!isOpen);
});

// Cerrar al hacer click en el overlay
navOverlay.addEventListener('click', () => toggleMenu(false));

// Cerrar al hacer click en cualquier link del menú
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});



/* ── 1. CURSOR PERSONALIZADO ──────────────────
   El punto sigue el ratón al instante.
   El anillo sigue con un pequeño lag (más suave).
────────────────────────────────────────────── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX - 6, y: mouseY - 6, duration: 0 });
});

// El ticker de GSAP corre en cada frame (~60fps)
gsap.ticker.add(() => {
  ringX += (mouseX - ringX) * 0.12; // interpolación suave
  ringY += (mouseY - ringY) * 0.12;
  gsap.set(cursorRing, { x: ringX - 18, y: ringY - 18 });
});


/* ── 2. BARRA DE PROGRESO ─────────────────────
   Se escala de 0 a 1 en el eje X según el scroll.
   scrub:true = ligada directamente al scroll.
────────────────────────────────────────────── */
gsap.to('#progress-bar', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});


/* ── 3. HERO — TIMELINE DE ENTRADA ───────────
   gsap.timeline() encadena animaciones en orden.
   El "-=0.5" hace que la siguiente empiece 0.5s
   antes de que termine la anterior (se solapan).
────────────────────────────────────────────── */
const heroTl = gsap.timeline({ delay: 0.2 });

heroTl
  // Las líneas del título suben desde abajo
  .to('.hero-title .line span', {
    y: 0,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.12 // cada línea con 0.12s de retardo
  })
  // El label aparece mientras el título sigue animando
  .to('.hero-label', {
    opacity: 1,
    duration: 0.8,
    ease: 'expo.out'
  }, '-=0.8')
  .to('.hero-sub', {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.5')
  .to('.hero-cta', {
    opacity: 1,
    duration: 0.6
  }, '-=0.4')
  .to('.hero-scroll-hint', {
    opacity: 1,
    duration: 0.6
  }, '-=0.3');

// El número de fondo hace parallax al scroll
gsap.to('.hero-bg-num', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});


/* ── 4. WORD REVEAL ───────────────────────────
   Técnica: dividir el texto en palabras con JS,
   envolver cada una en un span, y animar los spans.
────────────────────────────────────────────── */
const revealText = document.getElementById('reveal-text');
const words = revealText.innerText.split(' ');

// Reemplazamos el texto plano con spans por palabra
revealText.innerHTML = words
  .map(word => `<span class="word"><span>${word}</span></span>`)
  .join(' ');

gsap.from('#reveal-text .word span', {
  y: '100%',
  opacity: 0,
  duration: 0.8,
  ease: 'expo.out',
  stagger: 0.04, // cada palabra con 0.04s de retardo
  scrollTrigger: {
    trigger: '#reveal-text',
    start: 'top 80%'
  }
});

// Las dos cajas entran desde lados opuestos
const boxes = document.querySelectorAll('#fade-section .anim-fade');

gsap.from(boxes[0], {
  x: -80, opacity: 0, duration: 0.9, ease: 'expo.out',
  scrollTrigger: { trigger: boxes[0], start: 'top 85%' }
});

gsap.from(boxes[1], {
  x: 80, opacity: 0, duration: 0.9, ease: 'expo.out',
  scrollTrigger: { trigger: boxes[1], start: 'top 85%' }
});

// Los section-tags (etiquetas) se animan en todas las secciones
gsap.utils.toArray('.section-tag').forEach(el => {
  gsap.from(el, {
    y: 30, opacity: 0, duration: 0.7,
    scrollTrigger: { trigger: el, start: 'top 90%' }
  });
});


/* ── 5. TARJETAS EN CASCADA ───────────────────
   gsap.utils.toArray() es como querySelectorAll
   pero devuelve un array real (más cómodo).

   stagger: 0.12 → cada tarjeta entra 0.12s
   después de la anterior.
────────────────────────────────────────────── */
gsap.from('.cards-header h2', {
  y: 60, opacity: 0, duration: 1,
  scrollTrigger: { trigger: '.cards-header', start: 'top 80%' }
});

gsap.from('.cards-header p', {
  y: 40, opacity: 0, duration: 0.8, delay: 0.2,
  scrollTrigger: { trigger: '.cards-header', start: 'top 80%' }
});

gsap.from('.card', {
  y: 100,
  opacity: 0,
  duration: 0.9,
  ease: 'expo.out',
  stagger: 0.12,
  scrollTrigger: {
    trigger: '.cards-grid',
    start: 'top 80%'
  }
});


/* ── 6. PARALLAX MULTICAPA ────────────────────
   Cada capa tiene un yPercent diferente y un
   scrub diferente → se mueven a distintas velocidades.

   Regla general:
   - scrub alto = movimiento más suave/lento
   - yPercent negativo = sube al hacer scroll
────────────────────────────────────────────── */

// Generamos los puntos flotantes dinámicamente
const dotsLayer = document.getElementById('dots-layer');
for (let i = 0; i < 40; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.left    = Math.random() * 100 + '%';
  dot.style.top     = Math.random() * 100 + '%';
  dot.style.opacity = Math.random() * 0.4 + 0.1;
  dotsLayer.appendChild(dot);
}

const parallaxConfig = { trigger: '#parallax-section', start: 'top bottom', end: 'bottom top' };

gsap.to('.parallax-bg', {
  yPercent: 20, ease: 'none',
  scrollTrigger: { ...parallaxConfig, scrub: true }
});

gsap.to('.parallax-layer-1', {
  yPercent: -30, ease: 'none',
  scrollTrigger: { ...parallaxConfig, scrub: 1.5 }
});

gsap.to('.parallax-layer-2', {
  yPercent: -15, xPercent: 10, ease: 'none',
  scrollTrigger: { ...parallaxConfig, scrub: 2 }
});

gsap.to('.dots-layer', {
  yPercent: -40, ease: 'none',
  scrollTrigger: { ...parallaxConfig, scrub: 0.8 }
});

gsap.from('.parallax-content', {
  scale: 0.8, opacity: 0, duration: 1,
  scrollTrigger: { trigger: '#parallax-section', start: 'top 70%' }
});


/* ── 7. PIN HORIZONTAL ────────────────────────
   pin: true → fija la sección en pantalla.
   Animamos el xPercent del wrapper mientras el
   usuario hace scroll vertical.

   400vw de ancho / 4 slides → -75% para ver el último.
   end: "+=300%" → la sección consume 3 pantallas de scroll.
────────────────────────────────────────────── */
gsap.to('#pin-wrapper', {
  xPercent: -75,
  ease: 'none',
  scrollTrigger: {
    trigger: '#pin-section',
    pin: true,         // fija la sección
    scrub: 1,          // suavizado de 1 segundo
    start: 'top top',
    end: '+=300%'      // cuánto scroll consume esta animación
  }
});


/* ── 8. CONTADORES ANIMADOS ───────────────────
   Técnica: animamos una propiedad de un objeto
   JS (no del DOM), y en onUpdate actualizamos
   el texto del elemento.

   once: true → solo se ejecuta una vez (no se
   resetea si el usuario sube de nuevo).
────────────────────────────────────────────── */
document.querySelectorAll('.counter-val').forEach(el => {
  const target = parseInt(el.dataset.target);
  const obj = { val: 0 }; // objeto auxiliar para animar

  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      // Se ejecuta en cada frame de la animación
      el.textContent = Math.round(obj.val).toLocaleString();
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      once: true
    }
  });
});


/* ── 9. CTA FINAL ─────────────────────────────
   Animación sencilla de entrada para el cierre.
────────────────────────────────────────────── */
gsap.from('.cta-title', {
  y: 120, opacity: 0, duration: 1.4,
  ease: 'expo.out',
  scrollTrigger: {
    trigger: '#cta-section',
    start: 'top 75%'
  }
});

gsap.from('.cta-btn', {
  y: 40, opacity: 0, duration: 0.8, delay: 0.3,
  scrollTrigger: {
    trigger: '#cta-section',
    start: 'top 70%'
  }
});