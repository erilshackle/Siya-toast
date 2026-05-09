import type {
    SiyaConfig,
    SiyaToast
} from './types';


// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface SiyaState {
    toasts: SiyaToast[];
    config: Required<SiyaConfig>;
}

type Listener = (state: SiyaState) => void;

interface TimerState {
    start: number;
    remaining: number;
    paused: boolean;
    raf: number | null;
}


// --------------------------------------------------
// INTERNALS
// --------------------------------------------------

let listeners: Listener[] = [];

let toastId = 0;

export const timers = new Map<number, TimerState>();


// --------------------------------------------------
// STATE
// --------------------------------------------------

export const state: SiyaState = {
    toasts: [],

    config: {
        position: 'top-right',
        duration: 4000,
        max: 5,
        pauseOnHover: true,
        rich: false,
        closable: true,
        stack: false
    }
};


// --------------------------------------------------
// EMIT
// --------------------------------------------------

function notify(): void {
    listeners.forEach(listener => listener(state));
}


// --------------------------------------------------
// SUBSCRIBE
// --------------------------------------------------

export function subscribe(listener: Listener): () => void {
    listeners.push(listener);

    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
}


// --------------------------------------------------
// TIMER
// --------------------------------------------------

function startTimer(toast: SiyaToast): void {
    if (!toast.id) return;

    if (!toast.duration || toast.duration <= 0) {
        return;
    }

    const timer: TimerState = {
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


// --------------------------------------------------
// PAUSE TIMER
// --------------------------------------------------

export function pauseTimer(id: number): void {
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


// --------------------------------------------------
// RESUME TIMER
// --------------------------------------------------

export function resumeTimer(id: number): void {
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


// --------------------------------------------------
// SHOW
// --------------------------------------------------

export function show(toast: SiyaToast): SiyaToast {
    const isPersistent = toast.persistent ?? false;

    const t: SiyaToast = {
        id: ++toastId,

        type: toast.type || 'default',

        title: toast.title || '',

        message: toast.message || '',

        actions: toast.actions || [],

        duration: isPersistent
            ? 0
            : (toast.duration ?? state.config.duration),

        pauseOnHover:
            toast.pauseOnHover
            ?? state.config.pauseOnHover,

        rich:
            toast.rich
            ?? state.config.rich,

        closable:
            toast.closable
            ?? state.config.closable,

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


// --------------------------------------------------
// REMOVE
// --------------------------------------------------

export function remove(id: number): void {
    const toast = state.toasts.find(t => t.id === id);

    if (!toast) {
        return;
    }

    toast.visible = false;

    notify();

    const timer = timers.get(id);

    if (timer?.raf) {
        cancelAnimationFrame(timer.raf);
    }

    timers.delete(id);

    setTimeout(() => {
        state.toasts = state.toasts.filter(
            t => t.id !== id
        );

        notify();
    }, 200);
}


// --------------------------------------------------
// UPDATE
// --------------------------------------------------

export function update(
    id: number,
    patch: Partial<SiyaToast>
): void {

    state.toasts = state.toasts.map(toast =>
        toast.id === id
            ? { ...toast, ...patch }
            : toast
    );

    notify();
}


// --------------------------------------------------
// CLEAR
// --------------------------------------------------

export function clear(): void {
    timers.forEach(timer => {
        if (timer.raf) {
            cancelAnimationFrame(timer.raf);
        }
    });

    timers.clear();

    state.toasts = [];

    notify();
}