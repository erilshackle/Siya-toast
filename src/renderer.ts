import {
    subscribe,
    remove,
    pauseTimer,
    resumeTimer,
    timers,

    type SiyaState
} from './core';

import type { SiyaToast } from './types';

import template from './template';

import icons from './icons';


// --------------------------------------------------
// EXTENDED ELEMENT
// --------------------------------------------------

interface ToastElement extends HTMLDivElement {
    __progressRAF?: number;
}


// --------------------------------------------------
// CREATE TOAST
// --------------------------------------------------

function createToast(
    toast: SiyaToast
): ToastElement {

    const el = document.createElement('div') as ToastElement;

    const type = toast.type || 'default';

    el.classList.add('siya-toast');
    el.classList.add(`siya-${type}`);

    if (toast.rich) {
        el.classList.add('siya-rich');
    }

    el.classList.add('enter');

    el.innerHTML = template(toast);


    // --------------------------------------------------
    // ICON
    // --------------------------------------------------

    const iconEl = el.querySelector(
        '.siya-icon'
    );

    if (iconEl) {
        iconEl.innerHTML =
            icons[type]
            || icons.default
            || '';
    }


    // --------------------------------------------------
    // TITLE
    // --------------------------------------------------

    const titleEl = el.querySelector(
        '.siya-title'
    );

    if (titleEl) {
        titleEl.textContent = toast.title || '';
    }


    // --------------------------------------------------
    // MESSAGE
    // --------------------------------------------------

    const messageEl = el.querySelector(
        '.siya-message'
    );

    if (messageEl) {
        messageEl.textContent =
            toast.message || '';
    }


    // --------------------------------------------------
    // CLOSE
    // --------------------------------------------------

    el.querySelector('.siya-close')
        ?.addEventListener('click', () => {

            if (toast.id) {
                remove(toast.id);
            }
        });


    // --------------------------------------------------
    // ACTIONS
    // --------------------------------------------------

    const actionsEl = el.querySelector(
        '.siya-actions'
    );

    if (
        actionsEl
        && toast.actions
    ) {

        actionsEl.innerHTML = '';

        toast.actions.forEach(action => {

            const button =
                document.createElement('button');

            button.className = 'siya-action';

            button.type = 'button';

            button.textContent = action.label;

            button.addEventListener(
                'click',
                event => {

                    event.stopPropagation();

                    action.onClick?.(
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


    // --------------------------------------------------
    // PAUSE ON HOVER
    // --------------------------------------------------

    if (
        toast.pauseOnHover
        && toast.id
    ) {

        el.addEventListener(
            'mouseenter',
            () => pauseTimer(toast.id!)
        );

        el.addEventListener(
            'mouseleave',
            () => resumeTimer(toast.id!)
        );
    }


    // --------------------------------------------------
    // PROGRESS BAR
    // --------------------------------------------------

    if (
        toast.duration
        && toast.duration > 0
        && toast.id
    ) {

        const bar = el.querySelector(
            '.siya-progress-bar'
        ) as HTMLElement | null;

        if (bar) {

            let raf = 0;

            const tick = () => {

                if (!el.isConnected) {
                    return;
                }

                const timer =
                    timers.get(toast.id!);

                if (!timer) {
                    return;
                }

                const elapsed = timer.paused
                    ? 0
                    : performance.now() - timer.start;

                const remaining =
                    timer.remaining - elapsed;

                const percent = Math.max(
                    remaining / toast.duration!,
                    0
                );

                bar.style.transform =
                    `scaleX(${percent})`;

                raf = requestAnimationFrame(tick);
            };

            bar.style.transformOrigin = 'left';

            raf = requestAnimationFrame(tick);

            el.__progressRAF = raf;
        }
    }


    // --------------------------------------------------
    // ENTER ANIMATION
    // --------------------------------------------------

    requestAnimationFrame(() => {

        el.classList.remove('enter');

        el.classList.add('enter-active');
    });

    return el;
}


// --------------------------------------------------
// RENDERER
// --------------------------------------------------

export default function Renderer() {

    let container: HTMLDivElement | null = null;

    const elements =
        new Map<number, ToastElement>();

    let unsubscribe:
        (() => void)
        | undefined;


    // --------------------------------------------------

    function getContainer(
        state: SiyaState
    ): HTMLDivElement {

        if (container) {
            return container;
        }

        const el =
            document.createElement('div');

        el.className =
            `siya-container siya-${state.config.position}`;

        document.body.appendChild(el);

        container = el;

        return el;
    }


    // --------------------------------------------------

    function render(
        state: SiyaState
    ): void {

        const active =
            new Set<number>();

        const root =
            getContainer(state);


        state.toasts.forEach(toast => {

            if (
                !toast.visible
                || !toast.id
            ) {
                return;
            }

            active.add(toast.id);

            if (
                elements.has(toast.id)
            ) {
                return;
            }

            const el =
                createToast(toast);

            elements.set(
                toast.id,
                el
            );

            root.appendChild(el);
        });


        // cleanup

        elements.forEach((el, id) => {

            if (active.has(id)) {
                return;
            }

            el.classList.add(
                'leave-active'
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


    // --------------------------------------------------

    return {

        mount(initialState: SiyaState) {

            unsubscribe =
                subscribe(render);

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