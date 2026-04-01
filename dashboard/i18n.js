/**
 * TokenMeter // Internationalization Module
 * Global i18n support for Chinese and English
 */

const i18n = {
    currentLang: 'zh',

    translations: {
        zh: {
            // Brand & Header
            brandSub: '// 用量监控控制台 v2.0',
            systemActive: '系统运行中',
            config: '[配置]',
            back: '返回',

            // Filter
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
            from: '从',
            to: '到',

            // Metrics
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

            // Table
            timestamp: '时间戳',
            project: '项目',
            model: '模型',
            tokens: 'Token数',
            cost: '费用',
            turns: '轮次',

            // Alerts
            sysAlert: '系统警告: 未配置模型',
            warningMsg: '价格配置不完整，预估值可能使用默认价格。',
            runConfig: '[运行配置]',

            // Footer
            usageTracker: 'Claude Code 用量追踪器',

            // Charts
            chartInput: '输入',
            chartOutput: '输出',
            chartOther: '其他',
            noData: '无数据',
            loading: '加载中...',
            noSessions: '未找到会话',

            // Settings Page
            priceConfig: '价格配置',
            configuredModels: '已配置模型',
            configuredModelsDesc: '直接在表格中编辑价格，点击保存全部以应用更改。',
            modelName: '模型名称',
            inputPrice: '输入价格 ($/M)',
            outputPrice: '输出价格 ($/M)',
            action: '操作',
            delete: '删除',
            addModel: '添加模型',
            addModelDesc: '手动添加模型并设置价格。',
            detectedModels: '检测到的模型',
            detectedModelsDesc: '在用量数据中发现但未配置价格的模型，点击添加使用默认价格。',
            defaultPrices: '默认价格',
            defaultPricesDesc: '用于未单独配置价格的模型的默认价格。',
            defaultInput: '默认输入价格 ($/M)',
            defaultOutput: '默认输出价格 ($/M)',
            cancel: '取消',
            saveAll: '保存全部',
            aboutConfig: '关于价格配置',
            aboutConfigDesc: 'TokenMeter 使用这些价格根据 Token 用量估算费用。价格按每百万 Token 计算 (1M = 1,000,000 Token)。',
            configSaved: '配置已保存',
            added: '已添加',
            add: '添加',
            modelExists: '模型已存在',
            enterModelName: '请输入模型名称',
            enterValidPrice: '请输入有效的价格',
            priceMustBePositive: '价格必须为正数',

            // Empty states
            noModelsConfigured: '暂无已配置的模型。可在下方添加或从未配置模型列表中添加。',
            allModelsConfigured: '所有检测到的模型都已配置价格。',
            errorLoading: '加载配置失败: ',

            // Misc
            unconfigured: '未配置',
            toggleLang: '切换语言'
        },

        en: {
            // Brand & Header
            brandSub: '// USAGE MONITORING CONSOLE v2.0',
            systemActive: 'SYSTEM ACTIVE',
            config: '[CFG]',
            back: 'BACK',

            // Filter
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
            from: 'FROM',
            to: 'TO',

            // Metrics
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

            // Table
            timestamp: 'TIMESTAMP',
            project: 'PROJECT',
            model: 'MODEL',
            tokens: 'TOKENS',
            cost: 'COST',
            turns: 'TURNS',

            // Alerts
            sysAlert: 'SYS_ALERT: UNCONFIGURED_MODELS',
            warningMsg: 'Pricing config incomplete. Estimates may use defaults.',
            runConfig: '[RUN_CONFIG]',

            // Footer
            usageTracker: 'CLAUDE CODE USAGE TRACKER',

            // Charts
            chartInput: 'INPUT',
            chartOutput: 'OUTPUT',
            chartOther: 'OTHER',
            noData: 'NO_DATA',
            loading: 'LOADING...',
            noSessions: 'NO_SESSIONS_FOUND',

            // Settings Page
            priceConfig: 'PRICE CONFIG',
            configuredModels: 'CONFIGURED_MODELS',
            configuredModelsDesc: 'Edit prices directly in the table. Click SAVE_ALL to apply changes.',
            modelName: 'MODEL',
            inputPrice: 'INPUT $/M',
            outputPrice: 'OUTPUT $/M',
            action: 'ACTION',
            delete: 'DELETE',
            addModel: 'ADD_MODEL',
            addModelDesc: 'Manually add a model with custom pricing.',
            detectedModels: 'DETECTED_MODELS',
            detectedModelsDesc: 'Models found in usage data without pricing. Click ADD to use default prices.',
            defaultPrices: 'DEFAULT_PRICES',
            defaultPricesDesc: 'Fallback prices for models without specific configuration.',
            defaultInput: 'DEFAULT_INPUT $/M',
            defaultOutput: 'DEFAULT_OUTPUT $/M',
            cancel: 'CANCEL',
            saveAll: 'SAVE_ALL',
            aboutConfig: 'ABOUT_CONFIG',
            aboutConfigDesc: 'Prices are per million tokens (1M = 1,000,000). Config saved to',
            configSaved: 'Configuration saved successfully',
            added: 'Added',
            add: 'ADD',
            modelExists: 'Model already exists',
            enterModelName: 'Please enter a model name',
            enterValidPrice: 'Please enter a valid price',
            priceMustBePositive: 'Price must be a positive number',

            // Empty states
            noModelsConfigured: 'No models configured. Add models below or from unconfigured models section.',
            allModelsConfigured: 'All detected models have pricing configured.',
            errorLoading: 'Error loading configuration: ',

            // Misc
            unconfigured: 'UNCONFIGURED',
            toggleLang: 'Toggle Language'
        }
    },

    /**
     * Get translation for a key
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },

    /**
     * Set language
     */
    setLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('tokenmeter-lang', lang);
        this.updateUI();
        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
    },

    /**
     * Toggle between zh and en
     */
    toggleLang() {
        this.setLang(this.currentLang === 'zh' ? 'en' : 'zh');
    },

    /**
     * Update all UI elements with data-i18n attribute
     */
    updateUI() {
        // Update lang label if exists
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

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (this.translations[this.currentLang][key]) {
                el.title = this.translations[this.currentLang][key];
            }
        });
    },

    /**
     * Initialize i18n from localStorage
     */
    init() {
        const saved = localStorage.getItem('tokenmeter-lang');
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        }
        this.updateUI();
    }
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}