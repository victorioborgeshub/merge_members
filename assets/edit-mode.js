(() => {
  // ── Inject toggle into topbar (next to Highlight changes) ───────────
  const toggleEl = document.createElement('button');
  toggleEl.id = 'edit-mode-btn';
  toggleEl.className = 'silent-toggle';
  toggleEl.setAttribute('role', 'switch');
  toggleEl.setAttribute('aria-checked', 'false');
  toggleEl.setAttribute('aria-label', 'Edit mode');
  toggleEl.innerHTML = '<div class="silent-toggle__track"><div class="silent-toggle__thumb"></div></div><span class="silent-toggle__label">Edit mode</span>';

  const topbarLeft = document.querySelector('#hs-topbar .hs-topbar-left');
  if (topbarLeft) {
    const divider = document.createElement('div');
    divider.className = 'hs-topbar-divider';
    topbarLeft.appendChild(divider);
    topbarLeft.appendChild(toggleEl);
  }

  // ── State ────────────────────────────────────────────────────────────
  const panel    = document.getElementById('edit-panel');
  const body     = document.getElementById('ep-body');
  const EMPTY    = '<p class="ep-empty">Select a highlighted element to edit it.</p>';

  let active        = false;
  let selectedEl    = null;
  let pointerInSafe = false; // true when mousedown started inside panel or editable

  // Track where each pointer-down originates — prevents drag-to-select leaking a click
  document.addEventListener('pointerdown', e => {
    pointerInSafe = panel.contains(e.target) || !!e.target.closest('[data-editable]');
  });

  // ── Toggle edit mode ─────────────────────────────────────────────────
  function setActive(on) {
    active = on;
    toggleEl.classList.toggle('is-on', on);
    toggleEl.setAttribute('aria-checked', String(on));
    document.body.classList.toggle('edit-mode', on);
    if (!on) deselect();
  }

  toggleEl.addEventListener('click', () => setActive(!active));
  toggleEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(!active); }
  });

  // ── Click handler ────────────────────────────────────────────────────
  document.addEventListener('click', e => {
    if (!active) return;
    if (panel.contains(e.target)) return;

    const target = e.target.closest('[data-editable]');
    if (!target) { if (!pointerInSafe) deselect(); return; }

    e.preventDefault();
    e.stopImmediatePropagation();
    select(target);
  }, true);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && active) deselect();
  });

  // ── Select / deselect ────────────────────────────────────────────────
  function select(el) {
    if (el === selectedEl) return; // already selected — don't re-render and lose focus
    if (selectedEl) selectedEl.classList.remove('ep-selected');
    selectedEl = el;
    el.classList.add('ep-selected');
    renderPanel(el);
  }

  function deselect() {
    if (selectedEl) selectedEl.classList.remove('ep-selected');
    selectedEl = null;
    body.innerHTML = EMPTY;
  }

  // ── Render panel fields ──────────────────────────────────────────────
  function renderPanel(target) {
    const config = JSON.parse(target.dataset.editable);
    body.innerHTML = '';

    const nameEl = document.createElement('div');
    nameEl.className = 'ep-selected-label';
    nameEl.textContent = config.name;
    body.appendChild(nameEl);

    const divider = document.createElement('div');
    divider.className = 'ep-divider';
    body.appendChild(divider);

    // Track input elements by field key to wire up dependencies
    const fieldEls = {};

    config.fields.forEach(field => {
      const wrap = document.createElement('div');
      wrap.className = 'ep-field';

      const label = document.createElement('span');
      label.className = 'ep-label';
      label.textContent = field.label;
      wrap.appendChild(label);

      if (field.type === 'text') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'ep-input';
        input.value = getLive(target, field);
        input.addEventListener('input', () => setLive(target, field, input.value));
        wrap.appendChild(input);
        fieldEls[field.key] = input;

      } else if (field.type === 'textarea') {
        const ta = document.createElement('textarea');
        ta.className = 'ep-textarea';
        ta.value = getLive(target, field);
        ta.addEventListener('input', () => setLive(target, field, ta.value));
        wrap.appendChild(ta);
        fieldEls[field.key] = ta;

      } else if (field.type === 'toggle') {
        const row = document.createElement('div');
        row.className = 'ep-toggle-row';
        const current = getLive(target, field);

        field.options.forEach(opt => {
          const b = document.createElement('button');
          b.className = 'ep-toggle-btn' + (opt.value === current ? ' is-active' : '');
          b.textContent = opt.label;
          b.addEventListener('click', () => {
            row.querySelectorAll('.ep-toggle-btn').forEach(x => x.classList.remove('is-active'));
            b.classList.add('is-active');
            setLive(target, field, opt.value);
            applyDependencies(config, fieldEls, target);
          });
          row.appendChild(b);
        });
        wrap.appendChild(row);
        fieldEls[field.key] = row;
      }

      body.appendChild(wrap);
    });

    // Apply initial dependency state
    applyDependencies(config, fieldEls, target);
  }

  // ── Wire field dependencies ──────────────────────────────────────────
  // Info icon off → tooltip disabled; on → tooltip enabled
  function applyDependencies(config, fieldEls, target) {
    const iconField = config.fields.find(f => f.key === 'infoIcon');
    if (!iconField || !fieldEls.tooltip) return;

    const iconOn = getLive(target, iconField) === 'on';
    const ta = fieldEls.tooltip;
    ta.disabled = !iconOn;
    ta.style.opacity = iconOn ? '' : '0.4';
    ta.style.cursor  = iconOn ? '' : 'not-allowed';
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function getLabelNode(target) {
    // First text node is always the label — create one if missing
    let node = [...target.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (!node) {
      node = document.createTextNode('');
      target.insertBefore(node, target.firstChild);
    }
    return node;
  }

  // ── Live read/write per field key ────────────────────────────────────
  function getLive(target, field) {
    if (field.key === 'label') {
      return getLabelNode(target).textContent;
    }
    if (field.key === 'infoIcon') {
      return target.querySelector('.col-info-icon') ? 'on' : 'off';
    }
    if (field.key === 'tooltip') {
      const icon = target.querySelector('.col-info-icon');
      return icon ? (icon.dataset.tooltip || '') : (target.dataset.epTooltipCache || '');
    }
    return '';
  }

  function setLive(target, field, value) {
    if (field.key === 'label') {
      getLabelNode(target).textContent = value;
      return;
    }
    if (field.key === 'infoIcon') {
      const existing = target.querySelector('.col-info-icon');
      if (value === 'off' && existing) {
        // Persist tooltip text before removing the icon
        target.dataset.epTooltipCache = existing.dataset.tooltip || '';
        existing.remove();
      } else if (value === 'on' && !existing) {
        const span = document.createElement('span');
        span.className = 'material-symbols-rounded col-info-icon has-tooltip';
        span.dataset.tooltip = target.dataset.epTooltipCache || '';
        span.textContent = 'info';
        target.appendChild(span);
      }
      return;
    }
    if (field.key === 'tooltip') {
      // Always keep the cache in sync so it survives icon off/on cycles
      target.dataset.epTooltipCache = value;
      const icon = target.querySelector('.col-info-icon');
      if (icon) icon.dataset.tooltip = value;
      return;
    }
  }
})();
