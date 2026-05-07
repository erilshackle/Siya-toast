/**
 * Seeya
 * Minimal toast/notification library.
 *
 * @typedef {Object} SeeyaAction
 * @property {string} label
 * @property {(toast: object, ctx: { dismiss: Function }) => void} [onClick]
 *
 * @typedef {Object} SeeyaToast
 * @property {number} [id]
 * @property {'default'|'success'|'error'|'info'|'warning'} [type]
 * @property {string} [title]
 * @property {string} [message]
 * @property {SeeyaAction[]} [actions]
 * @property {number} [duration]
 * @property {boolean} [pauseOnHover]
 * @property {boolean} [rich]
 * @property {boolean} [closable]
 * @property {boolean} [persistent]
 *
 * @typedef {Object} SeeyaConfig
 * @property {'top-right'|'top-left'|'bottom-right'|'bottom-left'|'top-center'|'bottom-center'} [position]
 * @property {number} [duration]
 * @property {number} [max]
 * @property {boolean} [pauseOnHover]
 * @property {boolean} [rich]
 * @property {boolean} [closable]
 * @property {boolean} [stack]
 */

import { state, show, clear, update, remove } from './core.js';
import Renderer from './render.js';
// import './style.css';

let renderer;
let mounted = false;

/**
 * Mounts the renderer once.
 *
 * @returns {void}
 */
function mount() {
    if (mounted) return;

    renderer = Renderer();
    renderer.mount(state);

    mounted = true;
}

/**
 * Seeya public API.
 */
const Seeya = {

    /**
     * Initializes Seeya.
     *
     * @param {SeeyaConfig} [config={}]
     * @returns {void}
     */
    init(config = {}) {
        state.config = {
            position: 'top-right',
            duration: 4000,
            max: 5,
            pauseOnHover: true,
            rich: false,
            closable: true,
            stack: false,

            ...state.config,
            ...config
        };

        mount();
    },

    /**
     * Shows a toast.
     *
     * @param {SeeyaToast} [toast={}]
     * @returns {object}
     */
    show(toast = {}) {
        mount();

        return show({
            ...toast,
            type: toast.type || 'default'
        });
    },

    /**
     * Shows a success toast.
     *
     * @param {string} message
     * @param {SeeyaToast} [options={}]
     * @returns {object}
     */
    success(message, options = {}) {
        return this.show({
            ...options,
            message,
            type: 'success'
        });
    },

    /**
     * Shows an error toast.
     *
     * @param {string} message
     * @param {SeeyaToast} [options={}]
     * @returns {object}
     */
    error(message, options = {}) {
        return this.show({
            ...options,
            message,
            type: 'error'
        });
    },

    /**
     * Shows an info toast.
     *
     * @param {string} message
     * @param {SeeyaToast} [options={}]
     * @returns {object}
     */
    info(message, options = {}) {
        return this.show({
            ...options,
            message,
            type: 'info'
        });
    },

    /**
     * Shows a warning toast.
     *
     * @param {string} message
     * @param {SeeyaToast} [options={}]
     * @returns {object}
     */
    warning(message, options = {}) {
        return this.show({
            ...options,
            message,
            type: 'warning'
        });
    },

    /**
     * Shows an action toast.
     *
     * @param {string} title
     * @param {string} message
     * @param {SeeyaAction} [action={}]
     * @returns {object}
     */
    action(title, message, action = {}) {
        return this.show({
            title,
            message,
            actions: [
                {
                    label: action.label || 'Action',
                    onClick: action.onClick
                }
            ],
            duration: 0
        });
    },

    /**
     * Handles promise lifecycle notifications.
     *
     * @template T
     *
     * @param {Promise<T>} p
     * @param {{
     *   loading?: string,
     *   success?: string | ((result: T) => string),
     *   error?: string | ((error: any) => string)
     * }} [options={}]
     *
     * @returns {Promise<T>}
     */
    promise(p, options = {}) {
        mount();

        const t = this.show({
            message: options.loading,
            type: 'info',
            duration: 0
        });

        return Promise.resolve(p)
            .then(res => {
                update(t.id, {
                    message: typeof options.success === 'function'
                        ? options.success(res)
                        : options.success,
                    type: 'success'
                });

                setTimeout(() => remove(t.id), 1500);

                return res;
            })
            .catch(err => {
                update(t.id, {
                    message: typeof options.error === 'function'
                        ? options.error(err)
                        : options.error,
                    type: 'error'
                });

                setTimeout(() => remove(t.id), 2000);

                throw err;
            });
    },

    /**
     * Shows a confirmation toast.
     *
     * @param {string} title
     * @param {{
     *   message?: string,
     *   confirm?: string,
     *   cancel?: string,
     *   onConfirm?: Function,
     *   onCancel?: Function
     * }} [options={}]
     *
     * @returns {object}
     */
    confirm(title, options = {}) {
        mount();

        return this.show({
            title,
            message: options.message || '',
            duration: 0,
            rich: true,
            actions: [
                {
                    label: options.cancel || 'Cancel',
                    onClick: () => {
                        options.onCancel?.();
                    }
                },
                {
                    label: options.confirm || 'Confirm',
                    onClick: () => {
                        options.onConfirm?.();
                    }
                }
            ]
        });
    },

    /**
     * Clears all active toasts.
     *
     * @returns {void}
     */
    clear
};

if (typeof window !== 'undefined') {
    window.Seeya = Seeya;
}

export default Seeya;