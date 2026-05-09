import {
    state,
    show,
    clear,
    update,
    remove
} from './core';

import Renderer from './renderer';

import injectStyles from './inject';

import type {
    SiyaAction,
    SiyaConfig,
    SiyaToast
} from './types';


// --------------------------------------------------
// INTERNALS
// --------------------------------------------------

let renderer: ReturnType<typeof Renderer>;

let mounted = false;


// --------------------------------------------------
// MOUNT
// --------------------------------------------------

function mount(): void {
    if (mounted) {
        return;
    }

    injectStyles();

    renderer = Renderer();

    renderer.mount(state);
    

    mounted = true;
}


// --------------------------------------------------
// API
// --------------------------------------------------

const Siya = {

    init(config: SiyaConfig = {}): void {

        state.config = {
            ...state.config,
            ...config
        };

        mount();
    },


    show(toast: SiyaToast = {}): SiyaToast {
        mount();

        return show({
            ...toast,
            type: toast.type || 'default'
        });
    },


    success(
        message: string,
        options: SiyaToast = {}
    ): SiyaToast {

        return this.show({
            ...options,
            message,
            type: 'success'
        });
    },


    error(
        message: string,
        options: SiyaToast = {}
    ): SiyaToast {

        return this.show({
            ...options,
            message,
            type: 'error'
        });
    },


    info(
        message: string,
        options: SiyaToast = {}
    ): SiyaToast {

        return this.show({
            ...options,
            message,
            type: 'info'
        });
    },


    warning(
        message: string,
        options: SiyaToast = {}
    ): SiyaToast {

        return this.show({
            ...options,
            message,
            type: 'warning'
        });
    },


    action(
        title: string,
        message: string,
        action: SiyaAction
    ): SiyaToast {

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


    promise<T>(
        promise: Promise<T>,

        options: {
            loading?: string;

            success?: string | ((result: T) => string);

            error?: string | ((error: unknown) => string);
        } = {}
    ): Promise<T> {

        mount();

        const toast = this.show({
            message: options.loading,
            type: 'info',
            duration: 0
        });

        return Promise.resolve(promise)

            .then(result => {

                update(toast.id!, {
                    message:
                        typeof options.success === 'function'
                            ? options.success(result)
                            : options.success,

                    type: 'success'
                });

                setTimeout(() => {
                    remove(toast.id!);
                }, 1500);

                return result;
            })

            .catch(error => {

                update(toast.id!, {
                    message:
                        typeof options.error === 'function'
                            ? options.error(error)
                            : options.error,

                    type: 'error'
                });

                setTimeout(() => {
                    remove(toast.id!);
                }, 2000);

                throw error;
            });
    },


    confirm(
        title: string,

        options: {
            message?: string;

            confirm?: string;

            cancel?: string;

            onConfirm?: () => void;

            onCancel?: () => void;
        } = {}
    ): SiyaToast {

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


    clear
};


// --------------------------------------------------
// CDN GLOBAL
// --------------------------------------------------

declare global {
    interface Window {
        Siya: typeof Siya;
    }
}

if (typeof window !== 'undefined') {
    window.Siya = Siya;
}


export default Siya;