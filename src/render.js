import {
  subscribe,
  remove,
  pauseTimer,
  resumeTimer,
  timers
} from './core.js';
import template from './template.js';
import icons from './icons.js';

function createToast(t, config) {
  const el = document.createElement('div');

  const type = t.type || 'default';

  el.classList.add('seeya-toast');
  el.classList.add(`seeya-${type}`);

  if (t.rich) {
    el.classList.add('seeya-rich');
  }

  el.classList.add('enter');

  el.innerHTML = template(t);

  // ------------------------------------------------------------
  // ICON
  // ------------------------------------------------------------

  const iconEl = el.querySelector('.seeya-icon');
  if (iconEl) {
    iconEl.innerHTML = icons[type] || icons.default || '';
  }

  // ------------------------------------------------------------
  // TITLE / MESSAGE
  // ------------------------------------------------------------

  const titleEl = el.querySelector('.seeya-title');
  if (titleEl) titleEl.textContent = t.title || '';

  const msgEl = el.querySelector('.seeya-message');
  if (msgEl) msgEl.textContent = t.message || '';

  // ------------------------------------------------------------
  // CLOSE
  // ------------------------------------------------------------

  el.querySelector('.seeya-close')?.addEventListener('click', () => {
    remove(t.id);
  });

  // ------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------

  const actionsEl = el.querySelector('.seeya-actions');

  if (actionsEl && t.actions) {
    actionsEl.innerHTML = '';

    t.actions.forEach(action => {
      const btn = document.createElement('button');

      btn.className = 'seeya-action';
      btn.type = 'button';
      btn.textContent = action.label;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        action.onClick?.(t, {
          dismiss: () => remove(t.id)
        });

        remove(t.id);
      });

      actionsEl.appendChild(btn);
    });
  }


  // ------------------------------------------------------------
  // PAUSE ON HOVER (CORRETO)
  // ------------------------------------------------------------

  if (t.pauseOnHover) {
    el.addEventListener('mouseenter', () => pauseTimer(t.id));
    el.addEventListener('mouseleave', () => resumeTimer(t.id));
  }

  // ------------------------------------------------------------
  // PROGRESS BAR
  // ------------------------------------------------------------

  if (t.duration > 0) {
    const bar = el.querySelector('.seeya-progress-bar');

    if (bar) {
      let raf;

      const tick = () => {
        if (!el.isConnected) return;

        const timer = timers.get(t.id);

        if (!timer) return;

        const elapsed = timer.paused
          ? 0
          : performance.now() - timer.start;

        const remaining = timer.remaining - elapsed;

        const percent = Math.max(remaining / t.duration, 0);

        bar.style.transform = `scaleX(${percent})`;

        raf = requestAnimationFrame(tick);
      };

      bar.style.transformOrigin = 'left';

      raf = requestAnimationFrame(tick);

      el.__progressRAF = raf;
    }
  }

  // ------------------------------------------------------------
  // ENTER ANIMATION
  // ------------------------------------------------------------

  requestAnimationFrame(() => {
    el.classList.remove('enter');
    el.classList.add('enter-active');
  });

  return el;
}

// ------------------------------------------------------------

export default function Renderer() {
  let container;
  const elements = new Map();
  let unsubscribe;

  function getContainer(config) {
    if (container) return container;

    const el = document.createElement('div');
    el.className = `seeya-container seeya-${config.position}`;

    document.body.appendChild(el);
    container = el;

    return el;
  }

  function render(state) {
    const { config, toasts } = state;
    const active = new Set();

    const root = getContainer(config);

    toasts.forEach(t => {
      if (!t.visible) return;

      active.add(t.id);

      if (elements.has(t.id)) return;

      const el = createToast(t, config);

      elements.set(t.id, el);
      root.appendChild(el);
    });

    // cleanup
    elements.forEach((el, id) => {
      if (active.has(id)) return;

      el.classList.add('leave-active');

      setTimeout(() => {
        if (el.__progressRAF) {
          cancelAnimationFrame(el.__progressRAF);
        }
        el.remove();
        elements.delete(id);
      }, 200);
    });
  }

  return {
    mount(initialState) {
      unsubscribe = subscribe(render);
      render(initialState);
    },

    unmount() {
      unsubscribe?.();
      container?.remove();
      container = null;
      elements.clear();
    }
  };
}