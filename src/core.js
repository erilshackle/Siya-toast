let listeners = [];
let id = 0;

export const timers = new Map();

export const state = {
  toasts: [],
  config: {
    position: 'top-right',
    duration: 4000,
    max: 5
  }
};

function notify() {
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

// ------------------------------------------------------------
// TIMER
// ------------------------------------------------------------

function startTimer(toast) {
  if (!toast.duration || toast.duration <= 0) return;

  const timer = {
    start: performance.now(),
    remaining: toast.duration,
    paused: false,
    raf: null
  };

  const tick = () => {
    if (!timers.has(toast.id)) return;

    if (!timer.paused) {
      const elapsed = performance.now() - timer.start;
      const remaining = timer.remaining - elapsed;

      if (remaining <= 0) {
        timers.delete(toast.id);
        remove(toast.id);
        return;
      }
    }

    timer.raf = requestAnimationFrame(tick);
  };

  timer.raf = requestAnimationFrame(tick);
  timers.set(toast.id, timer);
}

export function pauseTimer(id) {
  const timer = timers.get(id);
  if (!timer || timer.paused) return;

  const elapsed = performance.now() - timer.start;

  timer.remaining -= elapsed;
  timer.paused = true;

  cancelAnimationFrame(timer.raf);
}

export function resumeTimer(id) {
  const timer = timers.get(id);
  if (!timer || !timer.paused) return;

  timer.paused = false;
  timer.start = performance.now();

  const tick = () => {
    if (!timers.has(id)) return;

    if (!timer.paused) {
      const elapsed = performance.now() - timer.start;
      const remaining = timer.remaining - elapsed;

      if (remaining <= 0) {
        timers.delete(id);
        remove(id);
        return;
      }
    }

    timer.raf = requestAnimationFrame(tick);
  };

  timer.raf = requestAnimationFrame(tick);
}

// ------------------------------------------------------------
// API
// ------------------------------------------------------------

export function show(toast) {
  const isPersistent = toast.persistent ?? false;

  const t = {
    id: ++id,
    type: toast.type || 'default',
    title: toast.title || '',
    message: toast.message || '',
    actions: toast.actions || [],
    duration: isPersistent ? 0 : (toast.duration ?? state.config.duration),
    pauseOnHover: toast.pauseOnHover ?? state.config.pauseOnHover ?? true,
    rich: toast.rich ?? state.config.rich ?? false,
    persistent: isPersistent,
    visible: true
  };

  state.toasts = [t, ...state.toasts];

  if (state.toasts.length > state.config.max) {
    state.toasts = state.toasts.slice(0, state.config.max);
  }

  notify();

  if (!isPersistent) {
    startTimer(t);
  }

  return t;
}

export function remove(id) {
  const toast = state.toasts.find(t => t.id === id);
  if (!toast) return;

  toast.visible = false;
  notify();

  const timer = timers.get(id);
  if (timer?.raf) cancelAnimationFrame(timer.raf);
  timers.delete(id);

  setTimeout(() => {
    state.toasts = state.toasts.filter(t => t.id !== id);
    notify();
  }, 200);
}

export function update(id, patch) {
  state.toasts = state.toasts.map(t =>
    t.id === id ? { ...t, ...patch } : t
  );

  notify();
}

export function clear() {
  timers.forEach(timer => {
    cancelAnimationFrame(timer.raf);
  });

  timers.clear();

  state.toasts = [];

  notify();
}