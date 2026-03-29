// Claude Code Usage Tracker - Dashboard App
// Implements data fetching, charts, and rendering for the usage tracker dashboard

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format a number with K/M suffix
 * @param {number} num - The number to format
 * @returns {string} Formatted string (e.g., "12.9M", "500K")
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
 * Format a cost as USD currency
 * @param {number} num - The cost in dollars
 * @returns {string} Formatted string (e.g., "$1.23", "N/A")
 */
function formatCost(num) {
    if (num === null || num === undefined) return 'N/A';
    return '$' + num.toFixed(2);
}

/**
 * Format an ISO date string to YYYY-MM-DD HH:MM
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Format an ISO date string to just the date part (YYYY-MM-DD)
 * @param {string} isoString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDateOnly(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// =============================================================================
// Data Fetching Functions
// =============================================================================

/**
 * Fetch usage data from the API
 * @returns {Promise<Object>} Usage data object
 */
async function fetchUsage() {
    const response = await fetch('/api/usage');
    if (!response.ok) {
        throw new Error(`Failed to fetch usage data: ${response.status}`);
    }
    return response.json();
}

/**
 * Fetch price configuration from the API
 * @returns {Promise<Object>} Price configuration object
 */
async function fetchPrices() {
    const response = await fetch('/api/prices');
    if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.status}`);
    }
    return response.json();
}

// =============================================================================
// UI Helper Functions
// =============================================================================

/**
 * Show loading state with visual indicator
 */
function showLoading() {
    const tokensEl = document.getElementById('total-tokens');
    const costEl = document.getElementById('total-cost');
    const sessionsEl = document.getElementById('total-sessions');

    // Clear and show loading indicators
    if (tokensEl) {
        tokensEl.innerHTML = '<span class="loading-indicator">Loading...</span>';
    }
    if (costEl) {
        costEl.innerHTML = '<span class="loading-indicator">Loading...</span>';
    }
    if (sessionsEl) {
        sessionsEl.innerHTML = '<span class="loading-indicator">Loading...</span>';
    }

    // Show loading state in sessions table
    const tbody = document.getElementById('sessions-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">Loading...</td></tr>';
    }
}

/**
 * Show empty data message
 */
function showEmptyData() {
    const tokensEl = document.getElementById('total-tokens');
    const costEl = document.getElementById('total-cost');
    const sessionsEl = document.getElementById('total-sessions');

    if (tokensEl) tokensEl.textContent = '0';
    if (costEl) costEl.textContent = '$0.00';
    if (sessionsEl) sessionsEl.textContent = '0';

    // Show empty message in sessions table
    const tbody = document.getElementById('sessions-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No usage data found</td></tr>';
    }

    // Show a message card
    const container = document.querySelector('.container');
    const existingEmptyMsg = document.querySelector('.empty-data-card');
    if (!existingEmptyMsg) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'card empty-data-card';
        emptyDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" style="margin-bottom: 1rem;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 style="color: var(--text-secondary); margin-bottom: 0.5rem;">No Usage Data Found</h3>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">
                    No Claude Code transcript files were found in ~/.claude/projects/
                </p>
            </div>
        `;
        container.insertBefore(emptyDiv, container.querySelector('.summary-cards').nextSibling);
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'card warning-card';

    // Icon container
    const iconDiv = document.createElement('div');
    iconDiv.className = 'warning-card__icon';
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('width', '24');
    iconSvg.setAttribute('height', '24');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('fill', 'none');
    iconSvg.setAttribute('stroke', 'currentColor');
    iconSvg.setAttribute('stroke-width', '2');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '12');
    line1.setAttribute('y1', '8');
    line1.setAttribute('x2', '12');
    line1.setAttribute('y2', '12');

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '12');
    line2.setAttribute('y1', '16');
    line2.setAttribute('x2', '12.01');
    line2.setAttribute('y2', '16');

    iconSvg.appendChild(circle);
    iconSvg.appendChild(line1);
    iconSvg.appendChild(line2);
    iconDiv.appendChild(iconSvg);
    errorDiv.appendChild(iconDiv);

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'warning-card__content';

    const title = document.createElement('h3');
    title.className = 'warning-card__title';
    title.textContent = 'Error Loading Data';

    const msgP = document.createElement('p');
    msgP.className = 'warning-card__message';
    msgP.textContent = message;

    contentDiv.appendChild(title);
    contentDiv.appendChild(msgP);
    errorDiv.appendChild(contentDiv);

    container.insertBefore(errorDiv, container.firstChild.nextSibling);
    console.error('Dashboard error:', message);
}

// =============================================================================
// Summary Cards Rendering
// =============================================================================

/**
 * Render summary cards
 * @param {Object} summary - Summary data from API
 */
function renderSummary(summary) {
    const totalTokens = summary.total_input_tokens + summary.total_output_tokens;
    document.getElementById('total-tokens').textContent = formatTokens(totalTokens);
    document.getElementById('total-cost').textContent = formatCost(summary.total_estimated_cost_usd);
    document.getElementById('total-sessions').textContent = summary.total_sessions.toLocaleString();
}

// =============================================================================
// Charts Rendering
// =============================================================================

// Chart color palettes
const CHART_COLORS = {
    // Primary colors for tokens chart
    inputTokens: '#4f46e5',   // Indigo
    outputTokens: '#10b981',  // Green

    // Palette for pie charts
    palette: [
        '#4f46e5', // Indigo
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#f97316', // Orange
        '#ec4899', // Pink
        '#84cc16', // Lime
        '#6366f1', // Violet
    ]
};

// Store chart instances for cleanup
let tokensChart = null;
let projectChart = null;
let modelChart = null;

/**
 * Check if Chart.js is available
 * @returns {boolean} True if Chart.js is loaded
 */
function isChartJsAvailable() {
    return typeof Chart !== 'undefined';
}

/**
 * Show chart unavailable message
 */
function showChartUnavailableMessage() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center;"><p>Chart.js unavailable. Please check your network connection.</p></div>';
    });
}

/**
 * Render all charts
 * @param {Object} data - Full data object from API
 */
function renderCharts(data) {
    if (!isChartJsAvailable()) {
        console.warn('Chart.js is not available, skipping chart rendering');
        showChartUnavailableMessage();
        return;
    }
    renderTokensChart(data.sessions);
    renderProjectChart(data.summary.by_project);
    renderModelChart(data.summary.by_model);
}

/**
 * Render token usage over time chart (line chart)
 * @param {Array} sessions - Array of session objects
 */
function renderTokensChart(sessions) {
    const ctx = document.getElementById('tokens-chart');
    if (!ctx) return;

    // Destroy existing chart
    if (tokensChart) {
        tokensChart.destroy();
    }

    // Group sessions by date
    const dailyData = {};
    sessions.forEach(session => {
        const date = formatDateOnly(session.start_time);
        if (!dailyData[date]) {
            dailyData[date] = { input: 0, output: 0 };
        }
        dailyData[date].input += session.input_tokens;
        dailyData[date].output += session.output_tokens;
    });

    // Sort by date and prepare chart data
    const sortedDates = Object.keys(dailyData).sort();
    const labels = sortedDates;
    const inputData = sortedDates.map(date => dailyData[date].input);
    const outputData = sortedDates.map(date => dailyData[date].output);

    tokensChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Input Tokens',
                    data: inputData,
                    borderColor: CHART_COLORS.inputTokens,
                    backgroundColor: CHART_COLORS.inputTokens + '20',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'Output Tokens',
                    data: outputData,
                    borderColor: CHART_COLORS.outputTokens,
                    backgroundColor: CHART_COLORS.outputTokens + '20',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatTokens(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatTokens(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render project distribution chart (pie chart)
 * @param {Object} byProject - Project data keyed by project name
 */
function renderProjectChart(byProject) {
    const ctx = document.getElementById('project-chart');
    if (!ctx) return;

    // Destroy existing chart
    if (projectChart) {
        projectChart.destroy();
    }

    // Handle empty data
    if (!byProject || Object.keys(byProject).length === 0) {
        projectChart = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['No data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e5e7eb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return;
    }

    // Sort projects by total tokens and prepare data
    const sortedProjects = Object.entries(byProject)
        .map(([name, data]) => ({
            name,
            tokens: data.input + data.output
        }))
        .sort((a, b) => b.tokens - a.tokens);

    // Top 10 projects, rest grouped as "Other"
    const TOP_N = 10;
    let labels, data;

    if (sortedProjects.length <= TOP_N) {
        labels = sortedProjects.map(p => p.name);
        data = sortedProjects.map(p => p.tokens);
    } else {
        const topProjects = sortedProjects.slice(0, TOP_N);
        const otherTokens = sortedProjects.slice(TOP_N).reduce((sum, p) => sum + p.tokens, 0);
        labels = [...topProjects.map(p => p.name), 'Other'];
        data = [...topProjects.map(p => p.tokens), otherTokens];
    }

    projectChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: CHART_COLORS.palette.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 8,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${formatTokens(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Render model distribution chart (pie chart)
 * @param {Object} byModel - Model data keyed by model name
 */
function renderModelChart(byModel) {
    const ctx = document.getElementById('model-chart');
    if (!ctx) return;

    // Destroy existing chart
    if (modelChart) {
        modelChart.destroy();
    }

    // Handle empty data
    if (!byModel || Object.keys(byModel).length === 0) {
        modelChart = new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['No data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e5e7eb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return;
    }

    // Sort models by total tokens
    const sortedModels = Object.entries(byModel)
        .map(([name, data]) => ({
            name,
            tokens: data.input + data.output
        }))
        .sort((a, b) => b.tokens - a.tokens);

    const labels = sortedModels.map(m => m.name);
    const data = sortedModels.map(m => m.tokens);

    // Generate colors for all models (extend palette if needed)
    const colors = [];
    for (let i = 0; i < labels.length; i++) {
        colors.push(CHART_COLORS.palette[i % CHART_COLORS.palette.length]);
    }

    modelChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 8,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${formatTokens(context.raw)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// =============================================================================
// Sessions Table Rendering
// =============================================================================

/**
 * Create a table cell with text content
 * @param {string} text - Text content
 * @param {string} [title] - Optional title attribute
 * @returns {HTMLElement} Table cell element
 */
function createTableCell(text, title) {
    const cell = document.createElement('td');
    cell.textContent = text;
    if (title) {
        cell.setAttribute('title', title);
    }
    return cell;
}

/**
 * Render sessions table
 * @param {Array} sessions - Array of session objects
 */
function renderSessionsTable(sessions) {
    const tbody = document.getElementById('sessions-body');
    if (!tbody) return;

    // Clear existing rows
    tbody.textContent = '';

    // Handle empty sessions
    if (!sessions || sessions.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '6');
        cell.style.textAlign = 'center';
        cell.style.color = 'var(--text-secondary)';
        cell.textContent = 'No sessions found';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    // Sort by date descending and take last 20
    const sortedSessions = [...sessions]
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
        .slice(0, 20);

    // Create rows
    sortedSessions.forEach(session => {
        const row = document.createElement('tr');
        const totalTokens = session.input_tokens + session.output_tokens;

        // Date cell
        row.appendChild(createTableCell(formatDate(session.start_time)));

        // Project cell with tooltip
        row.appendChild(createTableCell(
            session.project_name || 'Unknown',
            session.project_path || ''
        ));

        // Model cell
        row.appendChild(createTableCell(session.model || 'Unknown'));

        // Tokens cell
        row.appendChild(createTableCell(formatTokens(totalTokens)));

        // Cost cell
        row.appendChild(createTableCell(formatCost(session.estimated_cost_usd)));

        // Turns cell
        row.appendChild(createTableCell(String(session.turns || 0)));

        tbody.appendChild(row);
    });
}

// =============================================================================
// Warnings Section
// =============================================================================

/**
 * Show warnings for unconfigured models
 * @param {Object} priceConfig - Price configuration from API
 */
function showWarnings(priceConfig) {
    const warningCard = document.getElementById('warning-card');
    const warningMessage = document.getElementById('warning-message');

    if (!warningCard || !warningMessage) return;

    const unconfiguredModels = priceConfig.unconfigured_models || [];

    if (unconfiguredModels.length === 0) {
        warningCard.style.display = 'none';
        return;
    }

    // Show warning card
    warningCard.style.display = 'flex';

    // Build warning message
    const modelsText = unconfiguredModels.length === 1
        ? `"${unconfiguredModels[0]}"`
        : `${unconfiguredModels.slice(0, -1).map(m => `"${m}"`).join(', ')} and "${unconfiguredModels[unconfiguredModels.length - 1]}"`;

    warningMessage.textContent =
        `${unconfiguredModels.length} model${unconfiguredModels.length > 1 ? 's' : ''} (${modelsText}) ` +
        `don't have pricing configured. Cost estimates may be incomplete.`;
}

// =============================================================================
// Initialization
// =============================================================================

/**
 * Initialize the dashboard
 */
async function initDashboard() {
    showLoading();

    try {
        // Fetch data
        const data = await fetchUsage();

        // Check for empty data
        if (!data.sessions || data.sessions.length === 0) {
            showEmptyData();
            // Still render empty charts
            renderCharts(data);
            showWarnings(data.price_config);
            return;
        }

        // Render components
        renderSummary(data.summary);
        renderCharts(data);
        renderSessionsTable(data.sessions);
        showWarnings(data.price_config);

    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showError(error.message);

        // Reset loading state on error
        const tokensEl = document.getElementById('total-tokens');
        const costEl = document.getElementById('total-cost');
        const sessionsEl = document.getElementById('total-sessions');
        if (tokensEl) tokensEl.textContent = '--';
        if (costEl) costEl.textContent = '--';
        if (sessionsEl) sessionsEl.textContent = '--';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);