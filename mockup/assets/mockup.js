/* Members page — mockup.js */

(function () {

  const all = window.MEMBERS;

  // ── Info sub-fields (stacked inside the Info column) ─────────
  const INFO_FIELDS = [
    { id:'empId',         label:'Employee ID',      group:'Identity',         visible:false, getter:m => m.info.identity.employeeId || '—' },
    { id:'birthday',      label:'Birthday',          group:'Identity',         visible:false, getter:m => formatDate(m.info.identity.birthday) },
    { id:'ipAddress',     label:'IP address (date)', group:'Identity',         visible:false, getter:m => m.info.identity.ipAddress || '—' },
    { id:'stateCountryW', label:'State, Country',    group:'Work contact',     visible:false, getter:m => [m.info.workContact.state, m.info.workContact.country].filter(Boolean).join(', ') || '—' },
    { id:'workEmail',     label:'Work email',        group:'Work contact',     visible:false, getter:m => m.info.workContact.email || '—' },
    { id:'workPhone',     label:'Work phone',        group:'Work contact',     visible:false, getter:m => m.info.workContact.phone || '—' },
    { id:'stateCountryP', label:'State, Country',    group:'Personal contact', visible:false, getter:m => [m.info.personalContact.state, m.info.personalContact.country].filter(Boolean).join(', ') || '—' },
    { id:'personalEmail', label:'Personal email',    group:'Personal contact', visible:false, getter:m => m.info.personalContact.email || '—' },
    { id:'personalPhone', label:'Personal phone',    group:'Personal contact', visible:false, getter:m => m.info.personalContact.phone || '—' },
  ];

  // ── Employment sub-fields (stacked inside the Employment column)
  const EMPLOYMENT_FIELDS = [
    { id:'jobTitle',   label:'Job title',                    group:'Job details',    visible:false, getter:m => m.employment.jobDetails.jobTitle || '—' },
    { id:'jobType',    label:'Job type',                     group:'Job details',    visible:false, getter:m => m.employment.jobDetails.jobType || '—' },
    { id:'department', label:'Department',                   group:'Job details',    visible:false, getter:m => m.employment.jobDetails.department || '—' },
    { id:'empType',    label:'Employment type',              group:'Hiring details', visible:false, getter:m => m.employment.hiringDetails.employmentType || '—' },
    { id:'workArr',    label:'In-office / Remote',           group:'Hiring details', visible:false, getter:m => m.employment.hiringDetails.workArrangement || '—' },
    { id:'empThrough', label:'Employed through',             group:'Hiring details', visible:false, getter:m => m.employment.hiringDetails.employedThrough || '—' },
    { id:'vendorName', label:'Name of Vendor/EOR/Subsidiary',group:'Hiring details', visible:false, getter:m => m.employment.hiringDetails.vendorName || '—' },
    { id:'taxId',      label:'Tax ID number',                group:'Accounting',     visible:false, getter:m => m.employment.accounting.taxId || '—' },
    { id:'taxType',    label:'Tax type',                     group:'Accounting',     visible:false, getter:m => m.employment.accounting.taxType || '—' },
    { id:'accountCode',label:'Account code',                 group:'Accounting',     visible:false, getter:m => m.employment.accounting.accountCode || '—' },
    { id:'currency',   label:'Currency',                     group:'Accounting',     visible:false, getter:m => m.employment.accounting.currency || '—' },
    { id:'startDate',  label:'Start date',                   group:'Timeline',       visible:false, getter:m => formatDate(m.employment.timeline.startDate) },
    { id:'endDate',    label:'End date',                     group:'Timeline',       visible:false, getter:m => formatDate(m.employment.timeline.endDate) },
    { id:'termReason', label:'Termination reason',           group:'Timeline',       visible:false, getter:m => m.employment.timeline.terminationReason || '—' },
    { id:'empComment', label:'Employment comment',           group:'Timeline',       visible:false, getter:m => m.employment.timeline.comment || '—' },
  ];

  // ── Summary stats ─────────────────────────────────────────────
  const graceMembers    = all.filter(m => m.billing === 'grace' || m.status === 'grace' || m.graceDays != null);
  const mergeMembers    = all.filter(m => m.mergeSuggestion);
  const membersById     = new Map(all.map(m => [m.id, m]));
  const occupiedSeats   = all.filter(m => m.status !== 'inactive').length;
  const trackedPool     = all.filter(m => m.status !== 'inactive' && m.timeTracking && m.timeTracking.enabled);
  const totalSeats      = occupiedSeats + 5;
  const totalTrackedPool = all.filter(m => m.status !== 'inactive');

  const viewerMembers = all.filter(m => m.billing === 'viewer');
  const el = id => document.getElementById(id);
  if (el('stat-total'))     el('stat-total').textContent     = all.length;
  if (el('stat-seats-occ')) el('stat-seats-occ').textContent = occupiedSeats;
  if (el('stat-seats-cap')) el('stat-seats-cap').textContent = totalSeats;
  if (el('stat-unbilled'))  el('stat-unbilled').textContent  = graceMembers.length;
  if (el('stat-viewers'))   el('stat-viewers').textContent   = viewerMembers.length;
  if (el('stat-merge-count')) el('stat-merge-count').textContent = mergeMembers.length;

  const tabCount = document.getElementById('tab-members-count');
  if (tabCount) tabCount.textContent = `(${all.length})`;

  // ── Merge suggestions (derived from members data) ─────────────
  const MONTH_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function formatDate(str) {
    if (!str) return '—';
    const [y, m, d] = str.split('-').map(Number);
    return `${MONTH_SHORT[m - 1]} ${d}, ${y}`;
  }

  function formatDateSince(str) {
    if (!str) return '—';
    const [y, m] = str.split('-').map(Number);
    return `${MONTH_LONG[m - 1]} ${y}`;
  }

  function splitName(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return ['member', 'member'];
    if (parts.length === 1) return [parts[0], parts[0]];
    const first = parts[0];
    const last = parts[parts.length - 1];
    return [first, last];
  }

  const SUGGESTIONS = mergeMembers.map(m => {
    const target = membersById.get(m.mergeIntoId) || m;
    return {
      source: {
        name:        m.name,
        email:       m.workEmail,
        initials:    m.initials,
        avatarColor: m.avatarColor,
        accountType: m.accountType,
        lastSeen:    'Today, 9:43 AM',
        billing:     'Unbilled seat',
      },
      dest: {
        initials:    target.initials,
        avatarColor: target.avatarColor,
        name:        target.name,
        email:       target.workEmail,
        since:       formatDateSince(target.dateAdded),
        billing:     'Billed seat',
        accountType: target.accountType,
      },
    };
  });

  // ── Cell renderers ────────────────────────────────────────────

  function memberCell(m) {
    const isRemoved = m.status === 'removed';
    const isOnline  = !isRemoved && m.timeTracking && m.timeTracking.enabled;
    const dotClass  = isRemoved ? 'avatar-dot--removed' : isOnline ? 'avatar-dot--online' : 'avatar-dot--offline';
    return `<div class="member-cell">
      <div class="avatar-wrap">
        <div class="avatar${isRemoved ? ' avatar--removed' : ''}"${isRemoved ? '' : ` style="background:${m.avatarColor}"`}>${m.initials}</div>
        <span class="avatar-dot ${dotClass}"></span>
      </div>
      <div class="member-info">
        <span class="member-name">${m.name}</span>
        <span class="member-email">${m.workEmail}</span>
      </div>
    </div>`;
  }

  const ACCOUNT_TYPE = {
    silent:   ['pill--silent',   'Silent'],
    standard: ['pill--standard', 'Standard'],
    scim:     ['pill--scim',     'SCIM'],
    sso:      ['pill--sso',      'SSO'],
  };
  function accountTypeCell(type) {
    const [cls, label] = ACCOUNT_TYPE[type] || ['pill--silent', type];
    return `<span class="pill ${cls}">${label}</span>`;
  }

  const STATUS = {
    active:   ['status-pill--active',   'Active'],
    inactive: ['status-pill--inactive', 'Inactive'],
    grace:    ['status-pill--active',   'Active'],
  };
  function statusCell(status) {
    const [cls, label] = STATUS[status] || ['', status];
    return `<span class="status-pill ${cls}">${label}</span>`;
  }

  function paymentCell(p) {
    if (!p || p.payRate == null) return '<span class="text-muted">—</span>';
    return `<div class="stack-cell">
      <span>Pay rate: $${p.payRate}</span>
      <span>Bill rate: $${p.billRate}</span>
      <span>Frequency: ${p.frequency}</span>
    </div>`;
  }

  function limitsCell(l) {
    if (!l || l.weeklyHours == null) return '<span class="text-muted">—</span>';
    const daily = l.dailyHours ? `${l.dailyHours}h / day` : 'No daily limit';
    return `<div class="stack-cell">
      <span>${l.weeklyHours}h / week</span>
      <span>${daily}</span>
    </div>`;
  }

  function screenshotsCell(s) {
    if (!s || !s.active) return '<span class="text-muted">Off</span>';
    return `<a class="screenshots-link" href="#">${s.count}</a>`;
  }

  function appsUrlsCell(a) {
    if (!a || !a.tracked) return '<span class="text-muted">—</span>';
    return `<span class="text-muted">${a.count}</span>`;
  }

  function timeTrackingCell(tt) {
    const on = tt && tt.enabled;
    return `<span class="tt-label ${on ? 'tt-label--on' : 'tt-label--off'}">${on ? 'Enabled' : 'Disabled'}</span>`;
  }

  function billingCell(m) {
    if (m.billing === 'billed')
      return `<span class="billing-billed">Paid seat</span>`;
    if (m.billing === 'viewer')
      return `<span class="billing-viewer">Free seat</span>`;
    if ((m.billing === 'grace' || m.billing === 'unbilled') && m.graceDays)
      return `<div class="billing-grace-cell">
        <span class="billing-grace-days">${m.graceDays} days left</span>
        <span class="billing-grace">Unpaid seat</span>
      </div>`;
    return `<span class="billing-grace">Unpaid seat</span>`;
  }

  function stackedCell(fields, m) {
    const visible = fields.filter(f => f.visible);
    if (!visible.length) return '<span class="text-muted">—</span>';
    const MAX = 4;
    const shown = visible.slice(0, MAX);
    const extra = visible.length - MAX;
    const items = shown.map(f => `<span class="stack-item">${f.getter(m)}</span>`).join('');
    const more  = extra > 0 ? `<span class="stack-more">+${extra} more</span>` : '';
    return `<div class="stack-cell">${items}${more}</div>`;
  }
  function infoCell(m)       { return stackedCell(INFO_FIELDS, m); }
  function employmentCell(m) { return stackedCell(EMPLOYMENT_FIELDS, m); }

  function renderCell(col, m) {
    switch (col.id) {
      case 'member':       return memberCell(m);
      case 'accountType':  return accountTypeCell(m.accountType);
      case 'status':       return statusCell(m.status);
      case 'role':         return `<span class="cell-text">${m.role}</span>`;
      case 'projects':     return `<span class="text-muted">${m.projects || '—'}</span>`;
      case 'workOrders':   return `<span class="text-muted">${m.workOrders || '—'}</span>`;
      case 'payment':      return paymentCell(m.payment);
      case 'limits':       return limitsCell(m.limits);
      case 'screenshots':  return screenshotsCell(m.screenshots);
      case 'appsUrls':     return appsUrlsCell(m.appsAndUrls);
      case 'timeTracking': return timeTrackingCell(m.timeTracking);
      case 'dateAdded':    return `<span class="text-muted">${formatDate(m.dateAdded)}</span>`;
      case 'dateRemoved':  return `<span class="text-muted">${formatDate(m.dateRemoved)}</span>`;
      case 'billing':      return billingCell(m);
      case 'info':         return infoCell(m);
      case 'employment':   return employmentCell(m);
      case 'actions':      return `<button class="btn btn--ghost btn--row-action">Actions<span class="material-symbols-rounded">expand_more</span></button>`;
      default:             return '—';
    }
  }

  // ── Filter + sort state ───────────────────────────────────────

  const pgState = { page: 1, perPage: 50 };
  let filteredMembers = all;
  let searchQuery = '';
  let sortState = { col: null, dir: 'asc' };
  let statusFilter = 'active';

  function billingSortKey(m) {
    const days = m.graceDays || 0;
    if (m.billing === 'billed') return [2, 0, m.name.toLowerCase()];
    return [0, days, m.name.toLowerCase()];
  }

  function sortedMembers(arr) {
    if (sortState.col !== 'billing') return arr;
    const dir = sortState.dir === 'asc' ? 1 : -1;
    return arr.slice().sort((a, b) => {
      const [at, ad, an] = billingSortKey(a);
      const [bt, bd, bn] = billingSortKey(b);
      if (at !== bt) return (at - bt) * dir;
      if (ad !== bd) return (ad - bd) * dir;
      if (an < bn) return -1 * dir;
      if (an > bn) return 1 * dir;
      return 0;
    });
  }

  function applyFilters() {
    let base = all;
    if (statusFilter === 'active')  base = base.filter(m => m.status !== 'removed');
    if (statusFilter === 'removed') base = base.filter(m => m.status === 'removed');
    if (searchQuery) {
      base = base.filter(m =>
        m.name.toLowerCase().includes(searchQuery) ||
        m.workEmail.toLowerCase().includes(searchQuery) ||
        m.role.toLowerCase().includes(searchQuery)
      );
    }
    filteredMembers = base;
    pgState.page = 1;
    renderPage();
  }

  function updateFilterBadge() {
    const badge = document.getElementById('filter-badge');
    badge.hidden = true;
  }

  function paginationFooterHTML(total, page, perPage) {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start = total === 0 ? 0 : (page - 1) * perPage + 1;
    const end   = Math.min(page * perPage, total);

    let pageHTML = '';
    let lastWasEllipsis = false;
    for (let p = 1; p <= totalPages; p++) {
      const near = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
      if (near) {
        lastWasEllipsis = false;
        pageHTML += `<button class="pg-btn${p === page ? ' is-active' : ''}" data-pg-btn="${p}">${p}</button>`;
      } else if (!lastWasEllipsis) {
        lastWasEllipsis = true;
        pageHTML += `<span class="pg-ellipsis">…</span>`;
      }
    }

    return `
      <span>Showing ${start}–${end} of ${total} members</span>
      <div class="per-page">
        <select class="per-page-select" id="per-page-select">
          <option value="25"${perPage===25?' selected':''}>25</option>
          <option value="50"${perPage===50?' selected':''}>50</option>
          <option value="100"${perPage===100?' selected':''}>100</option>
        </select>
        <span>per page</span>
      </div>
      <div class="pagination-gap"></div>
      <div class="pagination">
        <button class="pg-nav"${page<=1?' disabled':''} data-pg-dir="-1" aria-label="Previous page"><span class="material-symbols-rounded">chevron_left</span></button>
        ${pageHTML}
        <button class="pg-nav"${page>=totalPages?' disabled':''} data-pg-dir="1" aria-label="Next page"><span class="material-symbols-rounded">chevron_right</span></button>
      </div>`;
  }

  function renderFooter() {
    const footer = document.getElementById('table-footer');
    footer.innerHTML = paginationFooterHTML(filteredMembers.length, pgState.page, pgState.perPage);

    footer.querySelector('#per-page-select').addEventListener('change', e => {
      pgState.perPage = parseInt(e.target.value);
      pgState.page = 1;
      renderPage();
    });
    footer.querySelectorAll('[data-pg-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        pgState.page = parseInt(btn.dataset.pgBtn);
        renderPage();
      });
    });
    footer.querySelectorAll('[data-pg-dir]').forEach(btn => {
      btn.addEventListener('click', () => {
        pgState.page += parseInt(btn.dataset.pgDir);
        renderPage();
      });
    });
  }

  // ── Table render ──────────────────────────────────────────────

  function visibleCols() {
    return window.COLUMN_DEFS.filter(c => {
      if (c.always) return true;
      if (c.id === 'info')       return INFO_FIELDS.some(f => f.visible);
      if (c.id === 'employment') return EMPLOYMENT_FIELDS.some(f => f.visible);
      return c.visible;
    });
  }

  function renderPage() {
    const cols = visibleCols();
    const { page, perPage } = pgState;
    const sorted = sortedMembers(filteredMembers);
    const pageMembers = sorted.slice((page - 1) * perPage, page * perPage);

    const COL_CHANGES = {
      member:      'Fixed column — the Member column is now sticky. It stays visible as you scroll the table horizontally.',
      accountType: 'New column — account type (Standard, Silent, SCIM, SSO) was previously shown as a badge inside the Member column.',
      billing:     'New column — billing status doesn\'t exist on the current Members page.',
    };

    document.getElementById('members-thead').innerHTML = `<tr>
      <th class="th-check">
        <label class="cb-wrap">
          <input type="checkbox" id="check-all" />
          <span class="cb-vis"></span>
        </label>
      </th>
      ${cols.map(c => {
        const changeAttr = COL_CHANGES[c.id] ? ` data-change="${COL_CHANGES[c.id]}"` : '';
        if (c.id !== 'billing') return `<th${changeAttr}>${c.label}</th>`;
        const active = sortState.col === 'billing';
        return `<th class="th-sortable${active ? ' th-sortable--active' : ''}" data-sort-col="billing"${changeAttr}>
          ${c.label}<span class="sort-icon material-symbols-rounded">import_export</span>
        </th>`;
      }).join('')}
    </tr>`;

    document.querySelector('[data-sort-col="billing"]')?.addEventListener('click', () => {
      if (sortState.col === 'billing') {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = 'billing';
        sortState.dir = 'desc';
      }
      pgState.page = 1;
      renderPage();
    });

    // tbody
    const tbody = document.getElementById('members-tbody');
    tbody.innerHTML = pageMembers.map(m => `
      <tr${m.billing !== 'billed' ? ' data-grace' : ''}${m.status === 'removed' ? ' class="row--removed"' : ''}>
        <td class="td-check">
          <label class="cb-wrap">
            <input type="checkbox" class="row-cb" />
            <span class="cb-vis"></span>
          </label>
        </td>
        ${cols.map(c => `<td>${renderCell(c, m)}</td>`).join('')}
      </tr>`).join('');

    tbody.querySelectorAll('[data-open-merge]').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); openModal(0); });
    });

    wireCheckAll();
    renderFooter();
  }

  function wireCheckAll() {
    const allCb = document.getElementById('check-all');
    if (!allCb) return;
    allCb.addEventListener('change', () => {
      document.querySelectorAll('.row-cb').forEach(cb => { cb.checked = allCb.checked; });
    });
    document.querySelectorAll('.row-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const rows = document.querySelectorAll('.row-cb');
        const n = [...rows].filter(c => c.checked).length;
        allCb.indeterminate = n > 0 && n < rows.length;
        allCb.checked = n === rows.length;
      });
    });
  }

  function initStatusPills() {
    const activeCount  = all.filter(m => m.status !== 'removed').length;
    const removedCount = all.filter(m => m.status === 'removed').length;
    const allCount     = all.length;

    const wrap = document.createElement('div');
    wrap.className = 'status-filter-pills';
    wrap.innerHTML = `
      <button class="sfpill sfpill--on" data-sf="active">Active <span class="sfpill__count">(${activeCount})</span></button>
      <button class="sfpill" data-sf="removed">Removed <span class="sfpill__count">(${removedCount})</span></button>
      <button class="sfpill" data-sf="all">All <span class="sfpill__count">(${allCount})</span></button>`;

    document.querySelector('.toolbar-right').prepend(wrap);

    wrap.querySelectorAll('.sfpill').forEach(btn => {
      btn.addEventListener('click', () => {
        statusFilter = btn.dataset.sf;
        wrap.querySelectorAll('.sfpill').forEach(b => b.classList.remove('sfpill--on'));
        btn.classList.add('sfpill--on');
        applyFilters();
      });
    });
  }

  applyFilters();
  initStatusPills();

  // ── Search ────────────────────────────────────────────────────

  document.getElementById('search-input').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
  });

  // ── Merge suggestions modal ───────────────────────────────────

  let remaining = SUGGESTIONS.slice(); // working copy — items removed as resolved
  let detailIndex = 0;                 // index into `remaining` currently in detail view

  const mergeModal    = document.getElementById('merge-modal');
  const msListView    = document.getElementById('ms-list-view');
  const msDetailView  = document.getElementById('ms-detail-view');
  const msCounter     = document.getElementById('modal-counter');

  function openModal() {
    remaining = SUGGESTIONS.slice();
    showListView();
    mergeModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    mergeModal.hidden = true;
    document.body.style.overflow = '';
  }

  function showListView() {
    msListView.hidden  = false;
    msDetailView.hidden = true;
    renderList();
  }

  function showDetailView(index) {
    detailIndex = index;
    msListView.hidden   = true;
    msDetailView.hidden = false;
    populateDetail(remaining[index]);
    updateCounter();
  }

  function updateCounter() {
    const n = remaining.length;
    msCounter.textContent = n ? `${n} suggestion${n !== 1 ? 's' : ''}` : '';
  }

  function renderList() {
    const list = document.getElementById('ms-list');
    updateCounter();

    if (!remaining.length) {
      list.innerHTML = `
        <div class="ms-empty">
          <span class="material-symbols-rounded">check_circle</span>
          All suggestions have been reviewed.
        </div>`;
      return;
    }

    list.innerHTML = remaining.map((s, i) => `
      <div class="ms-row" data-row="${i}">
        <div class="ms-row__member">
          <div class="avatar" style="background:${s.source.avatarColor || '#9ca3af'}">${s.source.initials || '?'}</div>
          <div class="ms-row__info">
            <span class="ms-row__name">${s.source.name}</span>
            <span class="ms-row__email">${s.source.email}</span>
          </div>
          <span class="pill pill--silent">Silent</span>
        </div>
        <div class="ms-row__arrow">
          <span class="material-symbols-rounded">arrow_forward</span>
        </div>
        <div class="ms-row__member">
          <div class="avatar" style="background:${s.dest.avatarColor}">${s.dest.initials}</div>
          <div class="ms-row__info">
            <span class="ms-row__name">${s.dest.name}</span>
            <span class="ms-row__email">${s.dest.email}</span>
          </div>
        </div>
        <div class="ms-row__actions">
          <button class="btn btn--ghost btn--sm" data-ignore="${i}">Ignore</button>
          <button class="btn btn--outline-primary btn--sm" data-review="${i}">Review</button>
        </div>
      </div>`).join('');

    list.querySelectorAll('[data-ignore]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const i = parseInt(btn.dataset.ignore);
        remaining.splice(i, 1);
        renderList();
        updateMergeBadge();
      });
    });

    list.querySelectorAll('[data-review]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        showDetailView(parseInt(btn.dataset.review));
      });
    });
  }

  function populateDetail(s) {
    const srcAvatar = document.getElementById('ms-src-avatar');
    srcAvatar.textContent      = s.source.initials || '?';
    srcAvatar.style.background = s.source.avatarColor || '#9ca3af';
    document.getElementById('src-name').textContent  = s.source.name;
    document.getElementById('src-email').textContent = s.source.email;
    const [srcCls, srcLabel] = ACCOUNT_TYPE[s.source.accountType] || ['pill--silent', 'Silent'];
    const srcPill = document.getElementById('ms-src-pill');
    srcPill.className   = `pill ${srcCls} mm__card-pill`;
    srcPill.textContent = srcLabel;

    const destAvatar = document.getElementById('dest-avatar');
    destAvatar.textContent      = s.dest.initials;
    destAvatar.style.background = s.dest.avatarColor;
    document.getElementById('dest-name').textContent  = s.dest.name;
    document.getElementById('dest-email').textContent = s.dest.email;
    const [dstCls, dstLabel] = ACCOUNT_TYPE[s.dest.accountType] || ['pill--standard', 'Standard'];
    const dstPill = document.getElementById('ms-dst-pill');
    dstPill.className   = `pill ${dstCls} mm__card-pill`;
    dstPill.textContent = dstLabel;

  }

  function resolveDetail() {
    remaining.splice(detailIndex, 1);
    updateMergeBadge();
    if (remaining.length) {
      showListView();
    } else {
      showListView(); // shows empty state
    }
  }

  function updateMergeBadge() {
    const n = remaining.length;
    const el = document.getElementById('stat-merge-count');
    if (el) el.textContent = n;
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-text').textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => { toast.hidden = true; }, 3500);
  }

  document.querySelector('#card-merge .scard__action').addEventListener('click', openModal);

  document.getElementById('modal-close').addEventListener('click', closeModal);
  mergeModal.addEventListener('click', e => { if (e.target === mergeModal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mergeModal.hidden) closeModal(); });

  document.getElementById('ms-close-btn').addEventListener('click', closeModal);

  document.getElementById('ms-back-btn').addEventListener('click', showListView);

  document.getElementById('btn-skip').addEventListener('click', () => {
    resolveDetail();
  });

  document.getElementById('btn-merge').addEventListener('click', () => {
    const s = remaining[detailIndex];
    showToast(`${s.source.name} merged into ${s.dest.name}.`);
    resolveDetail();
  });

  // ── Add member dropdown ───────────────────────────────────────
  const addMemberWrap  = document.getElementById('add-member-wrap');
  const addMemberBtn   = document.getElementById('add-member-btn');
  const addMemberPanel = document.getElementById('add-member-panel');

  addMemberBtn.addEventListener('click', e => {
    e.stopPropagation();
    const opening = addMemberPanel.hidden;
    addMemberPanel.hidden = !opening;
    addMemberWrap.classList.toggle('is-open', opening);
    addMemberBtn.setAttribute('aria-expanded', String(opening));
  });

  addMemberPanel.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', () => {
    addMemberPanel.hidden = true;
    addMemberWrap.classList.remove('is-open');
    addMemberBtn.setAttribute('aria-expanded', 'false');
  });

  // ── Column picker ─────────────────────────────────────────────

  function cpRowHTML(col) {
    return `<div class="cp-row" data-col-toggle="${col.id}">
      <span class="material-symbols-rounded cp-check${col.visible ? '' : ' cp-check--off'}">check</span>
      <span class="cp-row-label">${col.label}</span>
    </div>`;
  }

  function renderColPicker() {
    const COLS = window.COLUMN_DEFS;
    const panel = document.getElementById('col-picker-panel');

    const flyoutCols  = COLS.filter(c => c.flyout);
    const regularCols = COLS.filter(c => !c.always && !c.flyout);

    let html = '<div class="cp-header">Columns</div>';

    flyoutCols.forEach(col => {
      const pool = col.id === 'info' ? INFO_FIELDS : EMPLOYMENT_FIELDS;
      const anyOn = pool.some(f => f.visible);
      html += `<div class="cp-row cp-row--flyout" data-flyout="${col.id}">
        <span class="material-symbols-rounded cp-check${anyOn ? '' : ' cp-check--off'}">check</span>
        <span class="cp-row-label">${col.label}</span>
        <span class="material-symbols-rounded cp-flyout-chevron">chevron_right</span>
      </div>`;
    });

    regularCols.forEach(col => { html += cpRowHTML(col); });

    panel.innerHTML = html;

    panel.querySelectorAll('.cp-row--flyout').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.flyout;
        const isActive = row.classList.contains('is-active');
        panel.querySelectorAll('.cp-row--flyout').forEach(r => r.classList.remove('is-active'));
        isActive ? closeFlyout() : openFlyout(id, row);
        if (!isActive) row.classList.add('is-active');
      });
    });

    panel.querySelectorAll('[data-col-toggle]').forEach(row => {
      row.addEventListener('click', () => {
        const col = COLS.find(c => c.id === row.dataset.colToggle);
        if (!col) return;
        col.visible = !col.visible;
        row.querySelector('.cp-check').classList.toggle('cp-check--off', !col.visible);
        pgState.page = 1;
        renderPage();
      });
    });
  }

  function openFlyout(groupId, anchorRow) {
    const flyout  = document.getElementById('cp-flyout');
    const panel   = document.getElementById('col-picker-panel');
    const fields  = groupId === 'info' ? INFO_FIELDS : EMPLOYMENT_FIELDS;
    const title   = groupId === 'info' ? 'Info' : 'Employment';

    // Group fields by sub-group
    const groups = {};
    fields.forEach(f => { (groups[f.group] = groups[f.group] || []).push(f); });

    let html = `<div class="cp-header">${title}</div>`;
    Object.entries(groups).forEach(([name, flds]) => {
      html += `<div class="cp-sub-header">${name}</div>`;
      flds.forEach(f => {
        html += `<div class="cp-row cp-row--sub" data-field-toggle="${f.id}" data-field-group="${groupId}">
          <span class="material-symbols-rounded cp-check${f.visible ? '' : ' cp-check--off'}">check</span>
          <span class="cp-row-label">${f.label}</span>
        </div>`;
      });
    });

    flyout.innerHTML = html;
    flyout.hidden = false;

    // Position to the left of the picker panel, top aligned with the clicked row
    const wrapperRect = document.getElementById('col-picker-wrapper').getBoundingClientRect();
    const anchorRect  = anchorRow.getBoundingClientRect();
    flyout.style.right = (panel.offsetWidth + 8) + 'px';
    flyout.style.top   = (anchorRect.top - wrapperRect.top) + 'px';

    flyout.querySelectorAll('[data-field-toggle]').forEach(row => {
      row.addEventListener('click', () => {
        const pool = row.dataset.fieldGroup === 'info' ? INFO_FIELDS : EMPLOYMENT_FIELDS;
        const f = pool.find(x => x.id === row.dataset.fieldToggle);
        if (!f) return;
        f.visible = !f.visible;
        row.querySelector('.cp-check').classList.toggle('cp-check--off', !f.visible);
        // sync the check on the parent picker row
        const pickerRow = document.querySelector(`[data-flyout="${row.dataset.fieldGroup}"]`);
        if (pickerRow) {
          const anyOn = pool.some(x => x.visible);
          pickerRow.querySelector('.cp-check').classList.toggle('cp-check--off', !anyOn);
        }
        pgState.page = 1;
        renderPage();
      });
    });
  }

  function closeFlyout() {
    const flyout = document.getElementById('cp-flyout');
    flyout.hidden = true;
  }

  const pickerBtn   = document.getElementById('col-picker-btn');
  const pickerPanel = document.getElementById('col-picker-panel');
  const flyoutPanel = document.getElementById('cp-flyout');

  pickerBtn.addEventListener('click', e => {
    e.stopPropagation();
    const opening = pickerPanel.hidden;
    pickerPanel.hidden = !opening;
    if (!opening) closeFlyout();
    if (opening) renderColPicker();
  });

  document.addEventListener('click', () => { pickerPanel.hidden = true; closeFlyout(); });
  pickerPanel.addEventListener('click', e => e.stopPropagation());
  flyoutPanel.addEventListener('click', e => e.stopPropagation());

  // ── Merge members modal ───────────────────────────────────────

  (function () {
    const mmModal   = document.getElementById('manual-merge-modal');
    const mmClose   = document.getElementById('mm-close');
    const mmCancel  = document.getElementById('mm-cancel');
    const mmConfirm = document.getElementById('mm-confirm');

    const mmSrcCard     = document.getElementById('mm-src-card');
    const mmDstCard     = document.getElementById('mm-dst-card');
    const mmSrcSlot     = document.getElementById('mm-src-slot');
    const mmDstSlot     = document.getElementById('mm-dst-slot');
    const mmDestSpinner = document.getElementById('mm-dest-spinner');
    const mmDestChevron = document.getElementById('mm-dest-chevron');

    let destLoadTimer = null;

    // accountType → [css class, label] — ready for future merge-eligibility rules
    const ACCOUNT_PILL = {
      silent:   ['pill--silent',   'Silent'],
      standard: ['pill--standard', 'Standard'],
      scim:     ['pill--scim',     'SCIM'],
      sso:      ['pill--sso',      'SSO'],
    };

    let srcMember = null;
    let dstMember = null;

    function openMM() {
      srcMember = null;
      dstMember = null;
      resetSide('source');
      resetSide('dest');
      updateView();
      mmModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeMM() {
      mmModal.hidden = true;
      document.body.style.overflow = '';
      closeDropdown('source');
      closeDropdown('dest');
    }

    function resetSide(side) {
      const valEl    = document.getElementById(`mm-${side}-val`);
      const selectEl = document.getElementById(`mm-${side}-select`);
      valEl.textContent = 'Select member';
      valEl.classList.remove('mm__select-val--filled');
      closeDropdown(side);
      if (side === 'dest') {
        if (destLoadTimer) { clearTimeout(destLoadTimer); destLoadTimer = null; }
        selectEl.classList.add('mm__select--locked');
        selectEl.classList.remove('mm__select--loading');
        selectEl.tabIndex = -1;
        mmDestSpinner.hidden = true;
        mmDestChevron.style.display = '';
        document.getElementById('mm-dest-col').classList.add('mm__col--locked');
      }
    }

    function startDestLoading() {
      if (destLoadTimer) { clearTimeout(destLoadTimer); destLoadTimer = null; }
      const destCol    = document.getElementById('mm-dest-col');
      const destSelect = document.getElementById('mm-dest-select');
      // Unlock col opacity, but keep select non-interactive during load
      destCol.classList.remove('mm__col--locked');
      destSelect.classList.remove('mm__select--locked');
      destSelect.classList.add('mm__select--loading');
      destSelect.tabIndex = -1;
      mmDestSpinner.hidden = false;
      mmDestChevron.style.display = 'none';

      destLoadTimer = setTimeout(() => {
        destSelect.classList.remove('mm__select--loading');
        destSelect.tabIndex = 0;
        mmDestSpinner.hidden = true;
        mmDestChevron.style.display = '';
        destLoadTimer = null;
      }, 1000);
    }

    function openDropdown(side) {
      closeDropdown(side === 'source' ? 'dest' : 'source');
      const dd     = document.getElementById(`mm-${side}-dropdown`);
      const search = document.getElementById(`mm-${side}-search`);
      dd.hidden = false;
      search.value = '';
      renderList(side, '');
      search.focus();
    }

    function closeDropdown(side) {
      const dd = document.getElementById(`mm-${side}-dropdown`);
      if (dd) dd.hidden = true;
    }

    function renderList(side, query) {
      const list      = document.getElementById(`mm-${side}-list`);
      const excludeId = side === 'dest' && srcMember ? srcMember.id : null;
      const q         = query.toLowerCase();
      const members   = all.filter(m => {
        if (side === 'source' && m.accountType !== 'silent') return false;
        if (excludeId && m.id === excludeId) return false;
        if (!q) return true;
        return m.name.toLowerCase().includes(q) || m.workEmail.toLowerCase().includes(q);
      }).slice(0, 60);

      if (!members.length) {
        list.innerHTML = '<div class="mm-empty-msg">No members found</div>';
        return;
      }

      list.innerHTML = members.map(m =>
        `<div class="mm-item" data-member-id="${m.id}">
          <div class="avatar" style="background:${m.avatarColor}">${m.initials}</div>
          <div class="mm-item-info">
            <span class="mm-item-name">${m.name}</span>
            <span class="mm-item-email">${m.workEmail}</span>
          </div>
        </div>`
      ).join('');

      list.querySelectorAll('.mm-item').forEach(item => {
        item.addEventListener('click', e => {
          e.stopPropagation();
          const member = all.find(m => m.id === parseInt(item.dataset.memberId));
          selectMember(side, member);
        });
      });
    }

    function selectMember(side, member) {
      if (side === 'source') {
        srcMember = member;
        // If new source matches current dest, clear dest
        if (dstMember && dstMember.id === member.id) {
          dstMember = null;
          const destVal = document.getElementById('mm-dest-val');
          destVal.textContent = 'Select member';
          destVal.classList.remove('mm__select-val--filled');
        }
        // Briefly load the dest field to communicate that options are being scoped to the selection
        startDestLoading();
      } else {
        dstMember = member;
      }

      closeDropdown(side);

      const valEl = document.getElementById(`mm-${side}-val`);
      valEl.textContent = '1 member';
      valEl.classList.add('mm__select-val--filled');

      updateView();
    }

    function fillCard(prefix, member) {
      const avatarEl = document.getElementById(`mm-${prefix}-avatar`);
      const nameEl   = document.getElementById(`mm-${prefix}-name`);
      const emailEl  = document.getElementById(`mm-${prefix}-email`);
      const pillEl   = document.getElementById(`mm-${prefix}-pill`);

      avatarEl.textContent      = member.initials;
      avatarEl.style.background = member.avatarColor;
      nameEl.textContent        = member.name;
      emailEl.textContent       = member.workEmail;

      // accountType drives the pill — will also gate merge eligibility in a future update
      const [cls, label] = ACCOUNT_PILL[member.accountType] || ['pill--silent', member.accountType];
      pillEl.className   = `pill ${cls} mm__card-pill`;
      pillEl.textContent = label;
    }

    function updateView() {
      const hasSrc  = !!srcMember;
      const hasBoth = !!(srcMember && dstMember);

      if (hasSrc) {
        fillCard('src', srcMember);
        mmSrcCard.hidden = false;
        mmSrcSlot.hidden = true;
        mmSrcCard.classList.toggle('mm__card--dim', hasBoth);
      } else {
        mmSrcCard.hidden = true;
        mmSrcSlot.hidden = false;
      }

      if (dstMember) {
        fillCard('dst', dstMember);
        mmDstCard.hidden = false;
        mmDstSlot.hidden = true;
      } else {
        mmDstCard.hidden = true;
        mmDstSlot.hidden = false;
      }

      mmConfirm.disabled = !hasBoth;
    }

    // Select field clicks → toggle dropdown
    document.getElementById('mm-source-select').addEventListener('click', e => {
      e.stopPropagation();
      const dd = document.getElementById('mm-source-dropdown');
      dd.hidden ? openDropdown('source') : closeDropdown('source');
    });

    document.getElementById('mm-dest-select').addEventListener('click', e => {
      e.stopPropagation();
      if (!srcMember || destLoadTimer) return;
      const dd = document.getElementById('mm-dest-dropdown');
      dd.hidden ? openDropdown('dest') : closeDropdown('dest');
    });

    // Search inputs
    document.getElementById('mm-source-search').addEventListener('input', e => renderList('source', e.target.value));
    document.getElementById('mm-dest-search').addEventListener('input',   e => renderList('dest',   e.target.value));

    // Close dropdowns when clicking outside
    mmModal.addEventListener('click', e => {
      if (e.target === mmModal) { closeMM(); return; }
      if (!e.target.closest('#mm-source-col')) closeDropdown('source');
      if (!e.target.closest('#mm-dest-col'))   closeDropdown('dest');
    });

    document.querySelector('.btn--outline-primary').addEventListener('click', openMM);
    mmClose.addEventListener('click', closeMM);
    mmCancel.addEventListener('click', closeMM);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mmModal.hidden) closeMM(); });

    mmConfirm.addEventListener('click', closeMM);
  })();


  // ── Silent app org toggle ─────────────────────────────────────
  (function () {
    const cardMerge = document.getElementById('card-merge');
    const mergeBtn  = document.querySelector('.btn--outline-primary');

    // Build and inject toggle into the topbar, right after the timer
    const toggleEl = document.createElement('div');
    toggleEl.id = 'silent-toggle';
    toggleEl.className = 'silent-toggle';
    toggleEl.setAttribute('role', 'switch');
    toggleEl.setAttribute('aria-checked', 'false');
    toggleEl.setAttribute('aria-label', 'Silent app');
    toggleEl.setAttribute('tabindex', '0');
    toggleEl.innerHTML = '<div class="silent-toggle__track"><div class="silent-toggle__thumb"></div></div><span class="silent-toggle__label">Silent app</span>';

    const topbarLeft = document.querySelector('#hs-topbar .hs-topbar-left');
    if (topbarLeft) {
      const divider = document.createElement('div');
      divider.className = 'hs-topbar-divider';
      topbarLeft.appendChild(divider);
      topbarLeft.appendChild(toggleEl);
    }

    const toggle = toggleEl;

    function apply(on) {
      toggle.classList.toggle('is-on', on);
      toggle.setAttribute('aria-checked', String(on));
      cardMerge.hidden = !on;
      mergeBtn.hidden  = !on;
      const billingCol = window.COLUMN_DEFS.find(c => c.id === 'billing');
      if (billingCol) billingCol.visible = on;
      pgState.page = 1;
      renderPage();
    }

    apply(false);

    toggle.addEventListener('click', () => apply(!toggle.classList.contains('is-on')));
    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(!toggle.classList.contains('is-on')); }
    });
  })();

})();
