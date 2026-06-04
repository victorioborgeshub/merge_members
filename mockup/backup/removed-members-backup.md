# Removed Members Feature — Backup

Explored during brainstorming but cut to avoid scope creep.
The backend already supports this fully (`include_removed` param, soft-delete via `status=Removed + removed_at`).

---

## Context

- `UserOrganization` has two statuses: `Active (0)` and `Removed (1)`
- Removed members are soft-deleted — record stays, `removed_at` is set
- They can be restored via `RestoreAction`
- The API supports `include_removed=true` but the UI never exposes it
- Removed members currently disappear from the interface with no way to view them

---

## mockup.html — filter pills + toolbar wrapper

```html
<div class="toolbar-right">
  <div class="filter-pills" id="filter-pills">
    <button class="filter-pill filter-pill--active" data-filter="active">Active</button>
    <button class="filter-pill" data-filter="removed">Removed</button>
    <button class="filter-pill" data-filter="all">All</button>
  </div>
  <div class="col-picker-wrapper" id="col-picker-wrapper">
    <button class="table-icon-btn" id="col-picker-btn" aria-label="Show/hide columns" data-tooltip="Show/hide columns">
      <span class="material-symbols-rounded">view_column</span>
    </button>
    <div class="col-picker-panel" id="col-picker-panel" hidden></div>
    <div class="cp-flyout" id="cp-flyout" hidden></div>
  </div>
</div><!-- /.toolbar-right -->
```

---

## mockup.css

```css
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.filter-pills {
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-pill {
  font-size: 12px;
  font-weight: 400;
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid var(--gray-300);
  background: var(--gray-100);
  color: var(--gray-500);
  cursor: pointer;
  transition: background 120ms, color 120ms, border-color 120ms;
}
.filter-pill--active {
  background: #EFF6FF;
  color: #1D4ED8;
  border-color: #1D4ED8;
}

/* Member cell — removed state */
.member-removed {
  font-size: 11px;
  font-weight: 400;
  color: var(--gray-400);
  margin-top: 1px;
}
.member-cell--removed .avatar { opacity: 0.35; }
.member-cell--removed .member-name,
.member-cell--removed .member-email { color: var(--gray-400); }
.row--removed td { opacity: 0.45; }
```

---

## mockup.js — filter state, applyFilters, memberCell removed logic, pill handler

```js
// In memberCell():
const removed = m.status === 'inactive';
const removedTag = removed ? `<span class="member-removed">Removed</span>` : '';
return `<div class="member-cell${removed ? ' member-cell--removed' : ''}">
  <div class="avatar" style="background:${m.avatarColor}">${m.initials}</div>
  <div class="member-info">
    <span class="member-name">${m.name}${mergeTag}</span>
    <span class="member-email">${m.workEmail}</span>
    ${removedTag}
  </div>
</div>`;

// Filter state (near pgState):
let statusFilter = 'active';

function applyFilters(q = '') {
  const query = q.toLowerCase();
  filteredMembers = all.filter(m => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active'  && m.status !== 'inactive') ||
      (statusFilter === 'removed' && m.status === 'inactive');
    const matchesSearch = !query ||
      m.name.toLowerCase().includes(query) ||
      m.workEmail.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });
  if (statusFilter === 'all') {
    filteredMembers.sort((a, b) => (a.status === 'inactive' ? 1 : 0) - (b.status === 'inactive' ? 1 : 0));
  }
  pgState.page = 1;
  renderPage();
}

// Search handler:
document.getElementById('search-input').addEventListener('input', e => {
  applyFilters(e.target.value);
});

// Pill click handler:
document.getElementById('filter-pills').addEventListener('click', e => {
  const pill = e.target.closest('[data-filter]');
  if (!pill) return;
  statusFilter = pill.dataset.filter;
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('filter-pill--active', p.dataset.filter === statusFilter);
  });
  applyFilters(document.getElementById('search-input').value);
});

// Row rendering — inactive class on <tr>:
// ${m.status === 'inactive' ? ' class="row--removed"' : ''}
```

---

## members-data.js — 7 forced inactive members + dateRemoved column

```js
// Post-processing after window.MEMBERS is assembled:
window.MEMBERS.forEach(m => { if (m.id >= 11 && m.status === 'inactive') m.status = 'active'; });
[18, 31, 45, 59, 72, 88].forEach(id => {
  const m = window.MEMBERS.find(m => m.id === id);
  if (m) { m.status = 'inactive'; m.billing = 'unbilled'; }
});

// Column def:
{ id:'dateRemoved', label:'Date removed', key:'dateRemoved', visible:true }
```
