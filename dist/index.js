// src/core.ts
var listeners = [];
var toastId = 0;
var timers = /* @__PURE__ */ new Map();
var state = {
  toasts: [],
  config: {
    position: "top-right",
    duration: 4e3,
    max: 5,
    pauseOnHover: true,
    rich: false,
    closable: true,
    stack: false
  }
};
function notify() {
  listeners.forEach((listener) => listener(state));
}
function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
function startTimer(toast) {
  if (!toast.id) return;
  if (!toast.duration || toast.duration <= 0) {
    return;
  }
  const timer = {
    start: performance.now(),
    remaining: toast.duration,
    paused: false,
    raf: null
  };
  const tick = () => {
    if (!toast.id) return;
    if (!timers.has(toast.id)) {
      return;
    }
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
function pauseTimer(id) {
  const timer = timers.get(id);
  if (!timer || timer.paused) {
    return;
  }
  const elapsed = performance.now() - timer.start;
  timer.remaining -= elapsed;
  timer.paused = true;
  if (timer.raf) {
    cancelAnimationFrame(timer.raf);
  }
}
function resumeTimer(id) {
  const timer = timers.get(id);
  if (!timer || !timer.paused) {
    return;
  }
  timer.paused = false;
  timer.start = performance.now();
  const tick = () => {
    if (!timers.has(id)) {
      return;
    }
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
function show(toast) {
  var _a, _b, _c, _d, _e;
  const isPersistent = (_a = toast.persistent) != null ? _a : false;
  const t = {
    id: ++toastId,
    type: toast.type || "default",
    title: toast.title || "",
    message: toast.message || "",
    actions: toast.actions || [],
    duration: isPersistent ? 0 : (_b = toast.duration) != null ? _b : state.config.duration,
    pauseOnHover: (_c = toast.pauseOnHover) != null ? _c : state.config.pauseOnHover,
    rich: (_d = toast.rich) != null ? _d : state.config.rich,
    closable: (_e = toast.closable) != null ? _e : state.config.closable,
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
function remove(id) {
  const toast = state.toasts.find((t) => t.id === id);
  if (!toast) {
    return;
  }
  toast.visible = false;
  notify();
  const timer = timers.get(id);
  if (timer == null ? void 0 : timer.raf) {
    cancelAnimationFrame(timer.raf);
  }
  timers.delete(id);
  setTimeout(() => {
    state.toasts = state.toasts.filter(
      (t) => t.id !== id
    );
    notify();
  }, 200);
}
function update(id, patch) {
  state.toasts = state.toasts.map(
    (toast) => toast.id === id ? { ...toast, ...patch } : toast
  );
  notify();
}
function clear() {
  timers.forEach((timer) => {
    if (timer.raf) {
      cancelAnimationFrame(timer.raf);
    }
  });
  timers.clear();
  state.toasts = [];
  notify();
}

// src/template.ts
function template(toast) {
  var _a;
  const hasActions = (((_a = toast.actions) == null ? void 0 : _a.length) || 0) > 0;
  return `
        <div class="siya-inner">

            <div class="siya-icon"></div>

            <div class="siya-body">

                <div class="siya-content">

                    ${toast.title ? `<div class="siya-title"></div>` : ""}

                    <div class="siya-message"></div>

                </div>

                ${hasActions ? `
                            <div class="siya-actions">

                                ${toast.actions.map((action, index) => `
                                        <button
                                            class="siya-action"
                                            data-action="${index}"
                                            type="button"
                                        >
                                            ${action.label}
                                        </button>
                                    `).join("")}

                            </div>
                        ` : ""}

            </div>

            <button
                class="siya-close"
                type="button"
                aria-label="Close notification"
            >
                \xD7
            </button>

        </div>

        ${toast.duration && toast.duration > 0 ? `
                    <div class="siya-progress">

                        <div class="siya-progress-bar"></div>

                    </div>
                ` : ""}
    `;
}

// src/icons.ts
var icons = {
  success: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>

            <path d="M8 12l2.5 2.5L16 9"></path>
        </svg>
    `,
  error: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <circle cx="12" cy="12" r="10"></circle>

            <path d="M9 9l6 6M15 9l-6 6"></path>
        </svg>
    `,
  warning: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>

            <path d="M12 9v4"></path>

            <path d="M12 17h.01"></path>
        </svg>
    `,
  info: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <circle cx="12" cy="12" r="10"></circle>

            <path d="M12 10v4"></path>

            <path d="M12 7h.01"></path>
        </svg>
    `,
  default: `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"></path>

            <path d="M13.73 21a2 2 0 01-3.46 0"></path>
        </svg>
    `
};
var icons_default = icons;

// src/renderer.ts
function createToast(toast) {
  var _a;
  const el = document.createElement("div");
  const type = toast.type || "default";
  el.classList.add("siya-toast");
  el.classList.add(`siya-${type}`);
  if (toast.rich) {
    el.classList.add("siya-rich");
  }
  el.classList.add("enter");
  el.innerHTML = template(toast);
  const iconEl = el.querySelector(
    ".siya-icon"
  );
  if (iconEl) {
    iconEl.innerHTML = icons_default[type] || icons_default.default || "";
  }
  const titleEl = el.querySelector(
    ".siya-title"
  );
  if (titleEl) {
    titleEl.textContent = toast.title || "";
  }
  const messageEl = el.querySelector(
    ".siya-message"
  );
  if (messageEl) {
    messageEl.textContent = toast.message || "";
  }
  (_a = el.querySelector(".siya-close")) == null ? void 0 : _a.addEventListener("click", () => {
    if (toast.id) {
      remove(toast.id);
    }
  });
  const actionsEl = el.querySelector(
    ".siya-actions"
  );
  if (actionsEl && toast.actions) {
    actionsEl.innerHTML = "";
    toast.actions.forEach((action) => {
      const button = document.createElement("button");
      button.className = "siya-action";
      button.type = "button";
      button.textContent = action.label;
      button.addEventListener(
        "click",
        (event) => {
          var _a2;
          event.stopPropagation();
          (_a2 = action.onClick) == null ? void 0 : _a2.call(
            action,
            toast,
            {
              dismiss: () => {
                if (toast.id) {
                  remove(toast.id);
                }
              }
            }
          );
          if (toast.id) {
            remove(toast.id);
          }
        }
      );
      actionsEl.appendChild(button);
    });
  }
  if (toast.pauseOnHover && toast.id) {
    el.addEventListener(
      "mouseenter",
      () => pauseTimer(toast.id)
    );
    el.addEventListener(
      "mouseleave",
      () => resumeTimer(toast.id)
    );
  }
  if (toast.duration && toast.duration > 0 && toast.id) {
    const bar = el.querySelector(
      ".siya-progress-bar"
    );
    if (bar) {
      let raf = 0;
      const tick = () => {
        if (!el.isConnected) {
          return;
        }
        const timer = timers.get(toast.id);
        if (!timer) {
          return;
        }
        const elapsed = timer.paused ? 0 : performance.now() - timer.start;
        const remaining = timer.remaining - elapsed;
        const percent = Math.max(
          remaining / toast.duration,
          0
        );
        bar.style.transform = `scaleX(${percent})`;
        raf = requestAnimationFrame(tick);
      };
      bar.style.transformOrigin = "left";
      raf = requestAnimationFrame(tick);
      el.__progressRAF = raf;
    }
  }
  requestAnimationFrame(() => {
    el.classList.remove("enter");
    el.classList.add("enter-active");
  });
  return el;
}
function Renderer() {
  let container = null;
  const elements = /* @__PURE__ */ new Map();
  let unsubscribe;
  function getContainer(state2) {
    if (container) {
      return container;
    }
    const el = document.createElement("div");
    el.className = `siya-container siya-${state2.config.position}`;
    document.body.appendChild(el);
    container = el;
    return el;
  }
  function render(state2) {
    const active = /* @__PURE__ */ new Set();
    const root = getContainer(state2);
    state2.toasts.forEach((toast) => {
      if (!toast.visible || !toast.id) {
        return;
      }
      active.add(toast.id);
      if (elements.has(toast.id)) {
        return;
      }
      const el = createToast(toast);
      elements.set(
        toast.id,
        el
      );
      root.appendChild(el);
    });
    elements.forEach((el, id) => {
      if (active.has(id)) {
        return;
      }
      el.classList.add(
        "leave-active"
      );
      setTimeout(() => {
        if (el.__progressRAF) {
          cancelAnimationFrame(
            el.__progressRAF
          );
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
      unsubscribe == null ? void 0 : unsubscribe();
      container == null ? void 0 : container.remove();
      container = null;
      elements.clear();
    }
  };
}

// src/styles.css
var styles_default = {};

// src/inject.ts
var injected = false;
function injectStyles() {
  if (injected) return;
  if (typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = styles_default;
  document.head.appendChild(style);
  injected = true;
}

// src/index.ts
var renderer;
var mounted = false;
function mount() {
  if (mounted) {
    return;
  }
  injectStyles();
  renderer = Renderer();
  renderer.mount(state);
  mounted = true;
}
var Siya = {
  init(config = {}) {
    state.config = {
      ...state.config,
      ...config
    };
    mount();
  },
  toast(toast = {}) {
    mount();
    return show({
      ...toast,
      type: toast.type || "default"
    });
  },
  success(message, options = {}) {
    return this.toast({
      ...options,
      message,
      type: "success"
    });
  },
  error(message, options = {}) {
    return this.toast({
      ...options,
      message,
      type: "error"
    });
  },
  info(message, options = {}) {
    return this.toast({
      ...options,
      message,
      type: "info"
    });
  },
  warning(message, options = {}) {
    return this.toast({
      ...options,
      message,
      type: "warning"
    });
  },
  action(title, message, action) {
    return this.toast({
      title,
      message,
      actions: [
        {
          label: action.label || "Action",
          onClick: action.onClick
        }
      ],
      duration: 0
    });
  },
  promise(promise, options = {}) {
    mount();
    const toast = this.toast({
      message: options.loading,
      type: "info",
      duration: 0
    });
    return Promise.resolve(promise).then((result) => {
      update(toast.id, {
        message: typeof options.success === "function" ? options.success(result) : options.success,
        type: "success"
      });
      setTimeout(() => {
        remove(toast.id);
      }, 1500);
      return result;
    }).catch((error) => {
      update(toast.id, {
        message: typeof options.error === "function" ? options.error(error) : options.error,
        type: "error"
      });
      setTimeout(() => {
        remove(toast.id);
      }, 2e3);
      throw error;
    });
  },
  confirm(title, options = {}) {
    mount();
    return this.toast({
      title,
      message: options.message || "",
      duration: 0,
      rich: true,
      actions: [
        {
          label: options.cancel || "Cancel",
          onClick: () => {
            var _a;
            (_a = options.onCancel) == null ? void 0 : _a.call(options);
          }
        },
        {
          label: options.confirm || "Confirm",
          onClick: () => {
            var _a;
            (_a = options.onConfirm) == null ? void 0 : _a.call(options);
          }
        }
      ]
    });
  },
  clear
};
var index_default = Siya;
export {
  index_default as default
};
