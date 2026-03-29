// Claude Code Usage Tracker - Dashboard App
// This file will be implemented in Task 7

// Placeholder data for static view testing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with placeholder data
    document.getElementById('total-tokens').textContent = '0.0M';
    document.getElementById('total-cost').textContent = '$0.00';
    document.getElementById('total-sessions').textContent = '0';

    // Placeholder for charts (will be implemented in Task 7)
    const tokensCtx = document.getElementById('tokens-chart');
    const projectCtx = document.getElementById('project-chart');
    const modelCtx = document.getElementById('model-chart');

    if (tokensCtx) {
        new Chart(tokensCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Tokens',
                    data: [],
                    borderColor: '#4f46e5',
                    tension: 0.3
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
    }

    if (projectCtx) {
        new Chart(projectCtx.getContext('2d'), {
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
                maintainAspectRatio: false
            }
        });
    }

    if (modelCtx) {
        new Chart(modelCtx.getContext('2d'), {
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
                maintainAspectRatio: false
            }
        });
    }

    console.log('Dashboard placeholder initialized. Full implementation coming in Task 7.');
});