import css from './styles.css';

let injected = false;

export default function injectStyles(): void {
    if (injected) return;
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');

    style.textContent = css;

    document.head.appendChild(style);

    injected = true;
}