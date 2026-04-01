// Claude Code Usage Tracker - Settings Page
// Handles price configuration for model pricing

// =============================================================================
// State Management
// =============================================================================

/**
 * Current price configuration state
 */
let priceConfig = {
    model_prices: {},
    default_price: {
        input_per_million: 3.0,
        output_per_million: 15.0
    }
};

/**
 * List of models detected from usage data (unconfigured)
 */
let detectedModels = [];

/**
 * Track pending changes (models to add/update/delete)
 */
let pendingChanges = {
    added: {},
    updated: {},
    deleted: []
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format price value for display
 * @param {number} value - Price per million tokens
 * @returns {string} Formatted price string
 */
function formatPrice(value) {
    if (value === null || value === undefined) return 'N/A';
    return '$' + Number(value).toFixed(2) + '/M';
}

/**
 * Create a text node safely
 * @param {string} text - Text content
 * @returns {Text} Text node
 */
function createTextNode(text) {
    return document.createTextNode(text);
}

/**
 * Generate unique ID for table rows
 * @param {string} modelName - Model name
 * @returns {string} Unique ID
 */
function generateRowId(modelName) {
    return 'model-' + modelName.replace(/[^a-zA-Z0-9]/g, '-');
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Fetch current price configuration from API
 * @returns {Promise<Object>} Price configuration
 */
async function fetchPrices() {
    const response = await fetch('/api/prices');
    if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.status}`);
    }
    return response.json();
}

/**
 * Fetch usage data to get detected models
 * @returns {Promise<Object>} Usage data
 */
async function fetchUsage() {
    const response = await fetch('/api/usage');
    if (!response.ok) {
        throw new Error(`Failed to fetch usage data: ${response.status}`);
    }
    return response.json();
}

/**
 * Save price configuration to API
 * @param {Object} config - Price configuration to save
 * @returns {Promise<Object>} API response
 */
async function savePrices(config) {
    const response = await fetch('/api/prices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to save prices: ${response.status}`);
    }
    return response.json();
}

// =============================================================================
// UI Helper Functions
// =============================================================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    // Cyberpunk themed styles
    const bgColor = type === 'success'
        ? 'rgba(0, 255, 136, 0.9)'
        : 'rgba(255, 45, 85, 0.9)';
    const textColor = '#030508';

    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        background: ${bgColor};
        color: ${textColor};
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        z-index: 10000;
        border: 1px solid ${bgColor};
        box-shadow: 0 0 20px ${bgColor};
        animation: toastSlide 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Show loading indicator on a button
 * @param {HTMLElement} button - Button element
 * @param {boolean} loading - Whether to show loading state
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Saving...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

/**
 * Clear element children safely
 * @param {HTMLElement} element - Element to clear
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Create an empty message row for table
 * @param {string} message - Message text
 * @param {number} colspan - Column span
 * @returns {HTMLTableRowElement} Table row element
 */
function createEmptyTableRow(message, colspan) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.setAttribute('colspan', String(colspan));
    cell.className = 'empty-state';
    cell.textContent = message;
    row.appendChild(cell);
    return row;
}

// =============================================================================
// Rendering Functions
// =============================================================================

/**
 * Render the configured models table
 */
function renderConfiguredModelsTable() {
    const tbody = document.getElementById('models-table-body');
    if (!tbody) return;

    clearElement(tbody);

    // Combine configured models with pending changes
    const allModels = new Set([
        ...Object.keys(priceConfig.model_prices),
        ...Object.keys(pendingChanges.added)
    ]);

    // Remove deleted models
    pendingChanges.deleted.forEach(model => allModels.delete(model));

    if (allModels.size === 0) {
        tbody.appendChild(createEmptyTableRow(
            'No models configured. Add models below or from unconfigured models section.',
            4
        ));
        return;
    }

    // Sort models alphabetically
    const sortedModels = Array.from(allModels).sort();

    sortedModels.forEach(modelName => {
        // Get price (from pending changes or original config)
        let prices;
        if (pendingChanges.added[modelName]) {
            prices = pendingChanges.added[modelName];
        } else if (pendingChanges.updated[modelName]) {
            prices = pendingChanges.updated[modelName];
        } else {
            prices = priceConfig.model_prices[modelName];
        }

        const row = document.createElement('tr');
        row.id = generateRowId(modelName);

        // Model name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = modelName;
        row.appendChild(nameCell);

        // Input price cell (editable)
        const inputCell = document.createElement('td');
        const inputInput = document.createElement('input');
        inputInput.type = 'number';
        inputInput.step = '0.01';
        inputInput.min = '0';
        inputInput.value = prices.input_per_million;
        inputInput.className = 'price-input';
        inputInput.dataset.model = modelName;
        inputInput.dataset.type = 'input';
        inputInput.addEventListener('change', handlePriceChange);
        inputCell.appendChild(inputInput);
        row.appendChild(inputCell);

        // Output price cell (editable)
        const outputCell = document.createElement('td');
        const outputInput = document.createElement('input');
        outputInput.type = 'number';
        outputInput.step = '0.01';
        outputInput.min = '0';
        outputInput.value = prices.output_per_million;
        outputInput.className = 'price-input';
        outputInput.dataset.model = modelName;
        outputInput.dataset.type = 'output';
        outputInput.addEventListener('change', handlePriceChange);
        outputCell.appendChild(outputInput);
        row.appendChild(outputCell);

        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-cyber btn-cyber--danger';
        deleteBtn.textContent = 'DELETE';
        deleteBtn.addEventListener('click', () => handleDeleteModel(modelName));
        actionsCell.appendChild(deleteBtn);

        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });
}

/**
 * Render the unconfigured models section
 */
function renderUnconfiguredModels() {
    const container = document.getElementById('unconfigured-models');
    if (!container) return;

    clearElement(container);

    // Get all known models (configured + pending added)
    const configuredModels = new Set([
        ...Object.keys(priceConfig.model_prices),
        ...Object.keys(pendingChanges.added)
    ]);

    // Filter out configured models from detected models
    const unconfigured = detectedModels.filter(model => !configuredModels.has(model));

    // Remove already deleted models
    const finalUnconfigured = unconfigured.filter(model => !pendingChanges.deleted.includes(model));

    if (finalUnconfigured.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-state';
        emptyMsg.textContent = 'All detected models have pricing configured.';
        container.appendChild(emptyMsg);
        return;
    }

    // Sort alphabetically
    finalUnconfigured.sort();

    finalUnconfigured.forEach(modelName => {
        const item = document.createElement('div');
        item.className = 'unconfigured-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'unconfigured-item__name';
        nameSpan.textContent = modelName;
        item.appendChild(nameSpan);

        const addBtn = document.createElement('button');
        addBtn.className = 'btn-cyber btn-cyber--primary';
        addBtn.textContent = 'ADD';
        addBtn.addEventListener('click', () => handleAddFromUnconfigured(modelName));
        item.appendChild(addBtn);

        container.appendChild(item);
    });
}

/**
 * Render the default price settings
 */
function renderDefaultPriceSettings() {
    const inputField = document.getElementById('default-input-price');
    const outputField = document.getElementById('default-output-price');

    if (inputField) {
        inputField.value = priceConfig.default_price.input_per_million;
    }
    if (outputField) {
        outputField.value = priceConfig.default_price.output_per_million;
    }
}

// =============================================================================
// Event Handlers
// =============================================================================

/**
 * Handle price input change in the table
 * @param {Event} event - Change event
 */
function handlePriceChange(event) {
    const input = event.target;
    const modelName = input.dataset.model;
    const type = input.dataset.type; // 'input' or 'output'
    const value = parseFloat(input.value) || 0;

    // Get current prices for this model
    let currentPrices;
    if (pendingChanges.added[modelName]) {
        currentPrices = { ...pendingChanges.added[modelName] };
    } else if (pendingChanges.updated[modelName]) {
        currentPrices = { ...pendingChanges.updated[modelName] };
    } else {
        currentPrices = { ...priceConfig.model_prices[modelName] };
    }

    // Update the appropriate price
    if (type === 'input') {
        currentPrices.input_per_million = value;
    } else {
        currentPrices.output_per_million = value;
    }

    // Determine if this is an added model or an update to existing
    if (pendingChanges.added[modelName]) {
        pendingChanges.added[modelName] = currentPrices;
    } else if (priceConfig.model_prices[modelName]) {
        pendingChanges.updated[modelName] = currentPrices;
    }
}

/**
 * Handle delete model button click
 * @param {string} modelName - Model name to delete
 */
function handleDeleteModel(modelName) {
    // Add to deleted list
    if (!pendingChanges.deleted.includes(modelName)) {
        pendingChanges.deleted.push(modelName);
    }

    // Remove from added/updated if present
    delete pendingChanges.added[modelName];
    delete pendingChanges.updated[modelName];

    // Re-render
    renderConfiguredModelsTable();
    renderUnconfiguredModels();
}

/**
 * Handle adding model from unconfigured list
 * @param {string} modelName - Model name to add
 */
function handleAddFromUnconfigured(modelName) {
    // Use default prices
    pendingChanges.added[modelName] = {
        input_per_million: priceConfig.default_price.input_per_million,
        output_per_million: priceConfig.default_price.output_per_million
    };

    // Re-render
    renderConfiguredModelsTable();
    renderUnconfiguredModels();

    showToast(`Added "${modelName}" with default prices. You can edit the prices in the table above.`);
}

/**
 * Handle add new model form submission
 * @param {Event} event - Form submit event
 */
function handleAddModelForm(event) {
    event.preventDefault();

    const modelNameInput = document.getElementById('new-model-name');
    const inputPriceInput = document.getElementById('new-input-price');
    const outputPriceInput = document.getElementById('new-output-price');

    const modelName = modelNameInput.value.trim();
    const inputPriceStr = inputPriceInput.value.trim();
    const outputPriceStr = outputPriceInput.value.trim();

    if (!modelName) {
        showToast('Please enter a model name', 'error');
        return;
    }

    // Validate prices are valid numbers
    if (!inputPriceStr || isNaN(parseFloat(inputPriceStr))) {
        showToast('Please enter a valid input price', 'error');
        return;
    }

    if (!outputPriceStr || isNaN(parseFloat(outputPriceStr))) {
        showToast('Please enter a valid output price', 'error');
        return;
    }

    const inputPrice = parseFloat(inputPriceStr);
    const outputPrice = parseFloat(outputPriceStr);

    // Validate prices are positive
    if (inputPrice < 0) {
        showToast('Input price must be a positive number', 'error');
        return;
    }

    if (outputPrice < 0) {
        showToast('Output price must be a positive number', 'error');
        return;
    }

    // Check if model already exists
    const existingModels = new Set([
        ...Object.keys(priceConfig.model_prices),
        ...Object.keys(pendingChanges.added)
    ]);

    if (existingModels.has(modelName) && !pendingChanges.deleted.includes(modelName)) {
        showToast(`Model "${modelName}" already exists`, 'error');
        return;
    }

    // Add to pending changes
    pendingChanges.added[modelName] = {
        input_per_million: inputPrice,
        output_per_million: outputPrice
    };

    // Remove from deleted if it was there
    pendingChanges.deleted = pendingChanges.deleted.filter(m => m !== modelName);

    // Clear form
    modelNameInput.value = '';
    inputPriceInput.value = '';
    outputPriceInput.value = '';

    // Re-render
    renderConfiguredModelsTable();
    renderUnconfiguredModels();

    showToast(`Added "${modelName}" to configuration`);
}

/**
 * Handle default price change
 */
function handleDefaultPriceChange() {
    const inputField = document.getElementById('default-input-price');
    const outputField = document.getElementById('default-output-price');

    if (inputField && outputField) {
        priceConfig.default_price.input_per_million = parseFloat(inputField.value) || 0;
        priceConfig.default_price.output_per_million = parseFloat(outputField.value) || 0;
    }
}

/**
 * Handle save button click
 */
async function handleSave() {
    const saveBtn = document.getElementById('save-btn');
    setButtonLoading(saveBtn, true);

    try {
        // Build final configuration
        const finalConfig = {
            model_prices: {},
            default_price: priceConfig.default_price
        };

        // Copy existing models (excluding deleted)
        for (const [model, prices] of Object.entries(priceConfig.model_prices)) {
            if (!pendingChanges.deleted.includes(model)) {
                finalConfig.model_prices[model] = prices;
            }
        }

        // Apply updates
        for (const [model, prices] of Object.entries(pendingChanges.updated)) {
            finalConfig.model_prices[model] = prices;
        }

        // Add new models
        for (const [model, prices] of Object.entries(pendingChanges.added)) {
            finalConfig.model_prices[model] = prices;
        }

        // Save to API
        await savePrices(finalConfig);

        // Update local state
        priceConfig = finalConfig;

        // Clear pending changes
        pendingChanges = {
            added: {},
            updated: {},
            deleted: []
        };

        // Re-render
        renderConfiguredModelsTable();
        renderUnconfiguredModels();

        showToast('Configuration saved successfully');

    } catch (error) {
        console.error('Failed to save configuration:', error);
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(saveBtn, false);
    }
}

/**
 * Handle cancel button click
 */
function handleCancel() {
    // Navigate back to index
    window.location.href = 'index.html';
}

// =============================================================================
// Initialization
// =============================================================================

/**
 * Initialize the settings page
 */
async function initSettings() {
    const tbody = document.getElementById('models-table-body');
    if (!tbody) return;

    try {
        // Show loading state
        clearElement(tbody);
        tbody.appendChild(createEmptyTableRow('Loading...', 4));

        // Fetch price configuration
        priceConfig = await fetchPrices();

        // Fetch usage data to get detected models
        const usageData = await fetchUsage();

        // Extract model names from usage data
        if (usageData.summary && usageData.summary.by_model) {
            detectedModels = Object.keys(usageData.summary.by_model);
        } else if (usageData.price_config && usageData.price_config.unconfigured_models) {
            // Also check unconfigured_models from price_config
            detectedModels = usageData.price_config.unconfigured_models;
        }

        // Also include models from sessions
        if (usageData.sessions) {
            const sessionModels = usageData.sessions.map(s => s.model).filter(Boolean);
            detectedModels = [...new Set([...detectedModels, ...sessionModels])];
        }

        // Clear pending changes
        pendingChanges = {
            added: {},
            updated: {},
            deleted: []
        };

        // Render all sections
        renderConfiguredModelsTable();
        renderUnconfiguredModels();
        renderDefaultPriceSettings();

    } catch (error) {
        console.error('Failed to initialize settings:', error);

        clearElement(tbody);
        tbody.appendChild(createEmptyTableRow(
            'Error loading configuration: ' + error.message,
            4
        ));

        showToast(error.message, 'error');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page
    initSettings();

    // Set up event listeners
    const addForm = document.getElementById('add-model-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddModelForm);
    }

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSave);
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
    }

    // Default price inputs
    const defaultInput = document.getElementById('default-input-price');
    const defaultOutput = document.getElementById('default-output-price');
    if (defaultInput) {
        defaultInput.addEventListener('change', handleDefaultPriceChange);
    }
    if (defaultOutput) {
        defaultOutput.addEventListener('change', handleDefaultPriceChange);
    }
});