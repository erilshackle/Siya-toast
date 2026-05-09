import type { SiyaToast } from './types';


export default function template(
    toast: SiyaToast
): string {

    const hasActions =
        (toast.actions?.length || 0) > 0;

    return `
        <div class="siya-inner">

            <div class="siya-icon"></div>

            <div class="siya-body">

                <div class="siya-content">

                    ${
                        toast.title
                            ? `<div class="siya-title"></div>`
                            : ''
                    }

                    <div class="siya-message"></div>

                </div>

                ${
                    hasActions
                        ? `
                            <div class="siya-actions">

                                ${toast.actions!
                                    .map((action, index) => `
                                        <button
                                            class="siya-action"
                                            data-action="${index}"
                                            type="button"
                                        >
                                            ${action.label}
                                        </button>
                                    `)
                                    .join('')}

                            </div>
                        `
                        : ''
                }

            </div>

            <button
                class="siya-close"
                type="button"
                aria-label="Close notification"
            >
                ×
            </button>

        </div>

        ${
            toast.duration && toast.duration > 0
                ? `
                    <div class="siya-progress">

                        <div class="siya-progress-bar"></div>

                    </div>
                `
                : ''
        }
    `;
}