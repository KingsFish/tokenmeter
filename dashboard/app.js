/**
 * TokenMeter // Cyberpunk Terminal Dashboard
 * Data monitoring console with real-time visualization
 */

// =============================================================================
// INTERNATIONALIZATION (i18n)
// =============================================================================

const i18n = {
    currentLang: 'zh',
    translations: {
        zh: {
            brandSub: '// 用量监控控制台 v2.0',
            systemActive: '系统运行中',
            config: '[配置]',
            filter: '筛选',
            all: '全部',
            selectRange: '选择范围',
            days7: '7天',
            days30: '30天',
            allTime: '全部时间',
            customRange: '自定义范围',
            apply: '应用',
            allModels: '全部模型',
            searchProject: '搜索项目...',
            reset: '重置',
            totalTokens: '总Token数',
            input: '输入',
            output: '输出',
            totalTurns: '总轮次',
            estCost: '预估费用',
            sessions: '会话数',
            timeline: '时间线',
            projectDist: '[项目分布]',
            modelDist: '[模型分布]',
            last20: '最近20条',
            timestamp: '时间戳',
            project: '项目',
            model: '模型',
            tokens: 'Token数',
            cost: '费用',
            turns: '轮次',
            sysAlert: '系统警告: 未配置模型',
            warningMsg: '价格配置不完整，预估值可能使用默认价格。',
            runConfig: '[运行配置]',
            usageTracker: 'Claude Code 用量追踪器',
            // Chart labels
            chartInput: '输入',
            chartOutput: '输出',
            chartOther: '其他',
            noData: '无数据',
            loading: '加载中...',
            noSessions: '未找到会话',
            from: '从',
            to: '到'
        },
        en: {
            brandSub: '// USAGE MONITORING CONSOLE v2.0',
            systemActive: 'SYSTEM ACTIVE',
            config: '[CFG]',
            filter: 'FILTER',
            all: 'ALL',
            selectRange: 'SELECT_RANGE',
            days7: '7_DAYS',
            days30: '30_DAYS',
            allTime: 'ALL_TIME',
            customRange: 'CUSTOM_RANGE',
            apply: 'APPLY',
            allModels: 'All Models',
            searchProject: 'grep...',
            reset: 'RESET',
            totalTokens: 'TOTAL_TOKENS',
            input: 'IN',
            output: 'OUT',
            totalTurns: 'TOTAL_TURNS',
            estCost: 'EST_COST',
            sessions: 'SESSIONS',
            timeline: 'TIMELINE',
            projectDist: '[PROJECT_DIST]',
            modelDist: '[MODEL_DIST]',
            last20: 'LAST_20',
            timestamp: 'TIMESTAMP',
            project: 'PROJECT',
            model: 'MODEL',
            tokens: 'TOKENS',
            cost: 'COST',
            turns: 'TURNS',
            sysAlert: 'SYS_ALERT: UNCONFIGURED_MODELS',
            warningMsg: 'Pricing config incomplete. Estimates may use defaults.',
            runConfig: '[RUN_CONFIG]',
            usageTracker: 'CLAUDE CODE USAGE TRACKER',
            chartInput: 'INPUT',
            chartOutput: 'OUTPUT',
            chartOther: 'OTHER',
            noData: 'NO_DATA',
            loading: 'LOADING...',
            noSessions: 'NO_SESSIONS_FOUND',
            from: 'FROM',
            to: 'TO'
        }
    },

    t(key) {
        return this.translations[this.currentLang][key] || key;
    },

    setLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('tokenmeter-lang', lang);
        this.updateUI();
    },

    toggleLang() {
        this.setLang(this.currentLang === 'zh' ? 'en' : 'zh');
    },

    updateUI() {
        // Update lang label
        const langLabel = document.getElementById('lang-label');
        if (langLabel) {
            langLabel.textContent = this.currentLang === 'zh' ? 'EN' : '中文';
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLang][key]) {
                el.placeholder = this.translations[this.currentLang][key];
            }
        });
    },

    init() {
        const saved = localStorage.getItem('tokenmeter-lang');
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        }
        this.updateUI();
    }
};

// =============================================================================
// FILTER STATE MANAGEMENT
// =============================================================================

const filterState = {
    last: '',
    from: '',
    to: '',
    model: '',
    project: ''
};

let availableModels = [];

/**
 * Build API URL with current filter state
 */
function buildApiUrl() {
    const params = new URLSearchParams();

    if (filterState.from || filterState.to) {
        if (filterState.from) params.set('from', filterState.from);
        if (filterState.to) params.set('to', filterState.to);
    } else if (filterState.last) {
        params.set('last', filterState.last);
    }

    if (filterState.model) params.set('model', filterState.model);
    if (filterState.project) params.set('project', filterState.project);

    return params.toString() ? `/api/usage?${params.toString()}` : '/api/usage';
}

/**
 * Reset all filters to default
 */
function resetFilters() {
    filterState.last = '';
    filterState.from = '';
    filterState.to = '';
    filterState.model = '';
    filterState.project = '';

    // Reset UI
    document.querySelectorAll('.date-preset').forEach(btn => {
        btn.classList.remove('date-preset--active');
        if (btn.dataset.last === '') {
            btn.classList.add('date-preset--active');
        }
    });
    document.getElementById('filter-from').value = '';
    document.getElementById('filter-to').value = '';
    document.getElementById('filter-model').value = '';
    document.getElementById('filter-project').value = '';

    // Reset display
    const dateDisplay = document.getElementById('date-display');
    if (dateDisplay) {
        dateDisplay.textContent = i18n.t('all');
    }

    initDashboard();
}

/**
 * Populate model dropdown
 */
function populateModelDropdown() {
    const select = document.getElementById('filter-model');
    if (!select) return;

    while (select.options.length > 1) {
        select.remove(1);
    }

    availableModels.forEach(model => {
        const opt = document.createElement('option');
        opt.value = model;
        opt.textContent = model;
        select.appendChild(opt);
    });
}

/**
 * Initialize filter UI event listeners
 */
function initFilterListeners() {
    // Date selector trigger
    const dateTrigger = document.getElementById('date-trigger');
    const datePanel = document.getElementById('date-panel');
    const dateDisplay = document.getElementById('date-display');

    if (dateTrigger && datePanel) {
        // Toggle panel
        dateTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = datePanel.classList.contains('open');
            datePanel.classList.toggle('open');
            dateTrigger.classList.toggle('active');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            datePanel.classList.remove('open');
            dateTrigger.classList.remove('active');
        });

        datePanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Preset buttons (7D, 30D, ALL)
    document.querySelectorAll('.date-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            // Clear custom inputs
            document.getElementById('filter-from').value = '';
            document.getElementById('filter-to').value = '';
            filterState.from = '';
            filterState.to = '';

            // Update active state
            document.querySelectorAll('.date-preset').forEach(b => {
                b.classList.remove('date-preset--active');
            });
            btn.classList.add('date-preset--active');

            filterState.last = btn.dataset.last;

            // Update display
            if (dateDisplay) {
                const labels = { '7': i18n.t('days7'), '30': i18n.t('days30'), '': i18n.t('all') };
                dateDisplay.textContent = labels[filterState.last] || i18n.t('all');
            }

            // Close panel
            datePanel?.classList.remove('open');
            dateTrigger?.classList.remove('active');

            initDashboard();
        });
    });

    // Apply custom range
    const applyBtn = document.getElementById('date-apply');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const fromInput = document.getElementById('filter-from');
            const toInput = document.getElementById('filter-to');

            filterState.from = fromInput?.value || '';
            filterState.to = toInput?.value || '';

            if (filterState.from || filterState.to) {
                filterState.last = '';

                // Clear preset active state
                document.querySelectorAll('.date-preset').forEach(b => {
                    b.classList.remove('date-preset--active');
                });

                // Update display
                if (dateDisplay) {
                    if (filterState.from && filterState.to) {
                        dateDisplay.textContent = `${filterState.from} → ${filterState.to}`;
                    } else if (filterState.from) {
                        dateDisplay.textContent = `${i18n.t('from')} ${filterState.from}`;
                    } else {
                        dateDisplay.textContent = `${i18n.t('to')} ${filterState.to}`;
                    }
                }
            }

            // Close panel
            datePanel?.classList.remove('open');
            dateTrigger?.classList.remove('active');

            initDashboard();
        });
    }

    // Model select
    const modelSelect = document.getElementById('filter-model');
    if (modelSelect) {
        modelSelect.addEventListener('change', () => {
            filterState.model = modelSelect.value;
            initDashboard();
        });
    }

    // Project input with debounce
    const projectInput = document.getElementById('filter-project');
    if (projectInput) {
        let debounceTimer;
        projectInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                filterState.project = projectInput.value.trim();
                initDashboard();
            }, 300);
        });
    }

    // Reset button
    const resetBtn = document.getElementById('filter-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format number with K/M suffix
 */
function formatTokens(num) {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

/**
 * Format cost as USD
 */
function formatCost(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toFixed(2);
}

/**
 * Format ISO date to YYYY-MM-DD HH:MM
 */
function formatDate(isoString) {
    if (!isoString) return '--';
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

/**
 * Format date only (YYYY-MM-DD)
 */
function formatDateOnly(isoString) {
    if (!isoString) return '--';
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// =============================================================================
// DATA FETCHING
// =============================================================================

async function fetchUsage() {
    const response = await fetch(buildApiUrl());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

async function fetchPrices() {
    const response = await fetch('/api/prices');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// =============================================================================
// UI RENDERING
// =============================================================================

/**
 * Show loading state
 */
function showLoading() {
    const metrics = ['total-tokens', 'total-turns', 'total-cost', 'total-sessions'];
    metrics.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const numEl = el.querySelector('.metric-number');
            if (numEl) {
                numEl.textContent = '---';
                numEl.classList.add('loading-pulse');
            }
        }
    });

    const inputEl = document.getElementById('input-tokens');
    const outputEl = document.getElementById('output-tokens');
    if (inputEl) inputEl.textContent = '---';
    if (outputEl) outputEl.textContent = '---';

    const tbody = document.getElementById('sessions-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="log-loading">LOADING...</td></tr>';
    }
}

/**
 * Show empty data message
 */
function showEmptyData() {
    const metrics = ['total-tokens', 'total-turns', 'total-cost', 'total-sessions'];
    metrics.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const numEl = el.querySelector('.metric-number');
            if (numEl) {
                numEl.textContent = '0';
                numEl.classList.remove('loading-pulse');
            }
        }
    });

    const inputEl = document.getElementById('input-tokens');
    const outputEl = document.getElementById('output-tokens');
    if (inputEl) inputEl.textContent = '0';
    if (outputEl) outputEl.textContent = '0';

    const tbody = document.getElementById('sessions-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="log-empty">NO_DATA_FOUND</td></tr>';
    }
}

/**
 * Render summary metrics
 */
function renderSummary(summary) {
    const totalTokens = summary.total_input_tokens + summary.total_output_tokens;

    // Total tokens
    const tokensEl = document.getElementById('total-tokens');
    if (tokensEl) {
        const numEl = tokensEl.querySelector('.metric-number');
        if (numEl) {
            numEl.textContent = formatTokens(totalTokens);
            numEl.classList.remove('loading-pulse');
        }
    }

    // Token breakdown
    const inputEl = document.getElementById('input-tokens');
    const outputEl = document.getElementById('output-tokens');
    if (inputEl) inputEl.textContent = formatTokens(summary.total_input_tokens);
    if (outputEl) outputEl.textContent = formatTokens(summary.total_output_tokens);

    // Turns
    const turnsEl = document.getElementById('total-turns');
    if (turnsEl) {
        const numEl = turnsEl.querySelector('.metric-number');
        if (numEl) {
            numEl.textContent = summary.total_turns.toLocaleString();
            numEl.classList.remove('loading-pulse');
        }
    }

    // Cost
    const costEl = document.getElementById('total-cost');
    if (costEl) {
        const numEl = costEl.querySelector('.metric-number');
        if (numEl) {
            numEl.textContent = formatCost(summary.total_estimated_cost_usd);
            numEl.classList.remove('loading-pulse');
        }
    }

    // Sessions
    const sessionsEl = document.getElementById('total-sessions');
    if (sessionsEl) {
        const numEl = sessionsEl.querySelector('.metric-number');
        if (numEl) {
            numEl.textContent = summary.total_sessions.toLocaleString();
            numEl.classList.remove('loading-pulse');
        }
    }
}

// =============================================================================
// CHART RENDERING (Cyberpunk Theme)
// =============================================================================

const CHART_THEME = {
    cyan: '#00ffd5',
    green: '#00ff88',
    blue: '#00a8ff',
    purple: '#a855f7',
    amber: '#ff6b00',
    red: '#ff2d55',
    palette: ['#00ffd5', '#00ff88', '#00a8ff', '#a855f7', '#ff6b00', '#ff2d55', '#84cc16', '#f97316', '#06b6d4', '#ec4899'],
    gridColor: 'rgba(0, 255, 213, 0.1)',
    textColor: '#5a7a8a'
};

let tokensChart = null;
let projectChart = null;
let modelChart = null;

function isChartJsAvailable() {
    return typeof Chart !== 'undefined';
}

function renderCharts(data) {
    if (!isChartJsAvailable()) {
        document.querySelectorAll('.chart-frame').forEach(frame => {
            frame.innerHTML = '<div class="chart-unavailable">CHART_JS_UNAVAILABLE</div>';
        });
        return;
    }
    renderTokensChart(data.sessions);
    renderProjectChart(data.summary.by_project);
    renderModelChart(data.summary.by_model);
}

/**
 * Token flow timeline (line chart)
 */
function renderTokensChart(sessions) {
    const ctx = document.getElementById('tokens-chart');
    if (!ctx) return;

    if (tokensChart) tokensChart.destroy();

    // Aggregate by date
    const dailyData = {};
    sessions.forEach(s => {
        const date = formatDateOnly(s.start_time);
        if (!dailyData[date]) dailyData[date] = { input: 0, output: 0 };
        dailyData[date].input += s.input_tokens;
        dailyData[date].output += s.output_tokens;
    });

    const sortedDates = Object.keys(dailyData).sort();
    const labels = sortedDates;
    const inputData = sortedDates.map(d => dailyData[d].input);
    const outputData = sortedDates.map(d => dailyData[d].output);

    tokensChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: i18n.t('chartInput'),
                    data: inputData,
                    borderColor: CHART_THEME.green,
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: CHART_THEME.green,
                    pointBorderColor: CHART_THEME.green
                },
                {
                    label: i18n.t('chartOutput'),
                    data: outputData,
                    borderColor: CHART_THEME.cyan,
                    backgroundColor: 'rgba(0, 255, 213, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: CHART_THEME.cyan,
                    pointBorderColor: CHART_THEME.cyan
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: "'JetBrains Mono'", size: 11 },
                        color: CHART_THEME.textColor,
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: CHART_THEME.cyan,
                    borderWidth: 1,
                    titleFont: { family: "'JetBrains Mono'" },
                    bodyFont: { family: "'JetBrains Mono'" },
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${formatTokens(ctx.raw)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_THEME.gridColor, drawBorder: false },
                    ticks: {
                        font: { family: "'JetBrains Mono'", size: 10 },
                        color: CHART_THEME.textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: CHART_THEME.gridColor, drawBorder: false },
                    ticks: {
                        font: { family: "'JetBrains Mono'", size: 10 },
                        color: CHART_THEME.textColor,
                        callback: v => formatTokens(v)
                    }
                }
            }
        }
    });
}

/**
 * Project distribution (doughnut chart)
 */
function renderProjectChart(byProject) {
    const ctx = document.getElementById('project-chart');
    if (!ctx) return;

    if (projectChart) projectChart.destroy();

    if (!byProject || Object.keys(byProject).length === 0) {
        projectChart = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [i18n.t('noData')],
                datasets: [{ data: [1], backgroundColor: ['rgba(90, 122, 138, 0.3)'] }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        return;
    }

    const sorted = Object.entries(byProject)
        .map(([name, data]) => ({ name, tokens: data.input + data.output }))
        .sort((a, b) => b.tokens - a.tokens);

    const TOP_N = 8;
    let labels, data;
    if (sorted.length <= TOP_N) {
        labels = sorted.map(p => p.name);
        data = sorted.map(p => p.tokens);
    } else {
        const top = sorted.slice(0, TOP_N);
        const otherSum = sorted.slice(TOP_N).reduce((s, p) => s + p.tokens, 0);
        labels = [...top.map(p => p.name), i18n.t('chartOther')];
        data = [...top.map(p => p.tokens), otherSum];
    }

    projectChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: CHART_THEME.palette.slice(0, labels.length),
                borderColor: 'rgba(10, 14, 23, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: "'JetBrains Mono'", size: 10 },
                        color: CHART_THEME.textColor,
                        boxWidth: 12,
                        padding: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: CHART_THEME.cyan,
                    borderWidth: 1,
                    titleFont: { family: "'JetBrains Mono'" },
                    bodyFont: { family: "'JetBrains Mono'" },
                    callbacks: {
                        label: ctx => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((ctx.raw / total) * 100).toFixed(1);
                            return `${ctx.label}: ${formatTokens(ctx.raw)} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Model distribution (doughnut chart)
 */
function renderModelChart(byModel) {
    const ctx = document.getElementById('model-chart');
    if (!ctx) return;

    if (modelChart) modelChart.destroy();

    if (!byModel || Object.keys(byModel).length === 0) {
        modelChart = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [i18n.t('noData')],
                datasets: [{ data: [1], backgroundColor: ['rgba(90, 122, 138, 0.3)'] }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        return;
    }

    const sorted = Object.entries(byModel)
        .map(([name, data]) => ({ name, tokens: data.input + data.output }))
        .sort((a, b) => b.tokens - a.tokens);

    const labels = sorted.map(m => m.name);
    const data = sorted.map(m => m.tokens);
    const colors = labels.map((_, i) => CHART_THEME.palette[i % CHART_THEME.palette.length]);

    modelChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                borderColor: 'rgba(10, 14, 23, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: "'JetBrains Mono'", size: 10 },
                        color: CHART_THEME.textColor,
                        boxWidth: 12,
                        padding: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: CHART_THEME.cyan,
                    borderWidth: 1,
                    titleFont: { family: "'JetBrains Mono'" },
                    bodyFont: { family: "'JetBrains Mono'" },
                    callbacks: {
                        label: ctx => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((ctx.raw / total) * 100).toFixed(1);
                            return `${ctx.label}: ${formatTokens(ctx.raw)} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

// =============================================================================
// SESSION LOG TABLE
// =============================================================================

function renderSessionsTable(sessions) {
    const tbody = document.getElementById('sessions-body');
    if (!tbody) return;

    tbody.textContent = '';

    if (!sessions || sessions.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '6');
        cell.className = 'log-empty';
        cell.textContent = i18n.t('noSessions');
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    // Sort descending, take last 20
    const recent = [...sessions]
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
        .slice(0, 20);

    recent.forEach(session => {
        const row = document.createElement('tr');

        // Timestamp
        const tdTime = document.createElement('td');
        tdTime.textContent = formatDate(session.start_time);
        row.appendChild(tdTime);

        // Project
        const tdProj = document.createElement('td');
        tdProj.textContent = session.project_name || 'UNKNOWN';
        tdProj.title = session.project_path || '';
        row.appendChild(tdProj);

        // Model
        const tdModel = document.createElement('td');
        tdModel.textContent = session.model || 'UNKNOWN';
        row.appendChild(tdModel);

        // Tokens
        const tdTokens = document.createElement('td');
        tdTokens.textContent = formatTokens(session.input_tokens + session.output_tokens);
        row.appendChild(tdTokens);

        // Cost
        const tdCost = document.createElement('td');
        tdCost.textContent = '$' + formatCost(session.estimated_cost_usd);
        row.appendChild(tdCost);

        // Turns
        const tdTurns = document.createElement('td');
        tdTurns.textContent = String(session.turns || 0);
        row.appendChild(tdTurns);

        tbody.appendChild(row);
    });
}

// =============================================================================
// WARNING ALERT
// =============================================================================

function showWarnings(priceConfig) {
    const card = document.getElementById('warning-card');
    const msg = document.getElementById('warning-message');

    if (!card || !msg) return;

    const unconfigured = priceConfig?.unconfigured_models || [];

    if (unconfigured.length === 0) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'flex';
    const models = unconfigured.length === 1
        ? `"${unconfigured[0]}"`
        : `${unconfigured.slice(0, -1).map(m => `"${m}"`).join(', ')} and "${unconfigured[unconfigured.length - 1]}"`;

    msg.textContent = `${unconfigured.length} model(s) (${models}) missing pricing config. Using defaults.`;
}

// =============================================================================
// LIVE CLOCK
// =============================================================================

function updateClock() {
    const el = document.getElementById('live-clock');
    if (!el) return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

async function initDashboard() {
    showLoading();

    try {
        const data = await fetchUsage();

        if (data.summary && data.summary.by_model) {
            availableModels = Object.keys(data.summary.by_model);
            populateModelDropdown();
        }

        if (!data.sessions || data.sessions.length === 0) {
            showEmptyData();
            renderCharts(data);
            showWarnings(data.price_config);
            return;
        }

        renderSummary(data.summary);
        renderCharts(data);
        renderSessionsTable(data.sessions);
        showWarnings(data.price_config);

    } catch (error) {
        console.error('Dashboard init failed:', error);

        // Reset metrics on error
        const metrics = ['total-tokens', 'total-turns', 'total-cost', 'total-sessions'];
        metrics.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const numEl = el.querySelector('.metric-number');
                if (numEl) numEl.textContent = 'ERR';
            }
        });
    }
}

// Start on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n first
    i18n.init();

    // Set up language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            i18n.toggleLang();
            initDashboard(); // Refresh charts with new labels
        });
    }

    initFilterListeners();
    initDashboard();
    updateClock();
    setInterval(updateClock, 1000);
});