import { clear } from './core';
import type { SiyaAction, SiyaConfig, SiyaToast } from './types';
declare const Siya: {
    init(config?: SiyaConfig): void;
    toast(toast?: SiyaToast): SiyaToast;
    success(message: string, options?: SiyaToast): SiyaToast;
    error(message: string, options?: SiyaToast): SiyaToast;
    info(message: string, options?: SiyaToast): SiyaToast;
    warning(message: string, options?: SiyaToast): SiyaToast;
    action(title: string, message: string, action: SiyaAction): SiyaToast;
    promise<T>(promise: Promise<T>, options?: {
        loading?: string;
        success?: string | ((result: T) => string);
        error?: string | ((error: unknown) => string);
    }): Promise<T>;
    confirm(title: string, options?: {
        message?: string;
        confirm?: string;
        cancel?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }): SiyaToast;
    clear: typeof clear;
};
export default Siya;
