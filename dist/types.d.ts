export type SiyaToastType = 'default' | 'success' | 'error' | 'info' | 'warning';
export interface SiyaAction {
    label: string;
    onClick?: (toast: SiyaToast, ctx: {
        dismiss: () => void;
    }) => void;
}
export interface SiyaToast {
    id?: number;
    type?: SiyaToastType;
    title?: string;
    message?: string;
    actions?: SiyaAction[];
    duration?: number;
    pauseOnHover?: boolean;
    rich?: boolean;
    closable?: boolean;
    persistent?: boolean;
    visible?: boolean;
}
export interface SiyaConfig {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    duration?: number;
    max?: number;
    pauseOnHover?: boolean;
    rich?: boolean;
    closable?: boolean;
    stack?: boolean;
}
