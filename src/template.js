export default function template(t) {
  const hasActions = t.actions?.length > 0;

  return `
    <div class="seeya-inner">

      <div class="seeya-icon"></div>

      <div class="seeya-body">

        <div class="seeya-content">
          ${t.title ? `<div class="seeya-title"></div>` : ''}
          <div class="seeya-message"></div>
        </div>

        ${
          hasActions
            ? `
              <div class="seeya-actions">
                ${t.actions.map((action, i) => `
                  <button
                    class="seeya-action"
                    data-action="${i}"
                    type="button"
                  >
                    ${action.label}
                  </button>
                `).join('')}
              </div>
            `
            : ''
        }

      </div>

      <button
        class="seeya-close"
        type="button"
        aria-label="Close notification"
      >
        ×
      </button>

    </div>

    ${
      t.duration > 0
        ? `
          <div class="seeya-progress">
            <div class="seeya-progress-bar"></div>
          </div>
        `
        : ''
    }
  `;
}