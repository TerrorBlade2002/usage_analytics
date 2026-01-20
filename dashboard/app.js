// Configuration
const API_BASE = window.location.origin;
const REFRESH_INTERVAL = 30000; // 30 seconds

// EXACT 10 Portfolio names (must match database)
const PORTFOLIOS = [
    { name: 'EVEREST RECEIVABLES Debt Collection Training', image: '/assets/everest.png', short: 'EVEREST' },
    { name: 'Medical Debt Collector Trainer', image: null, short: 'Medical' },
    { name: 'Auto Loan Debt Collection Trainer', image: null, short: 'Auto Loan' },
    { name: 'Credit Card Debt Collection Training', image: null, short: 'Credit Card' },
    { name: 'CashLane Loans SOP Assist', image: '/assets/cashlane.png', short: 'CashLane Loans' },
    { name: 'CDS SOP Assist', image: null, short: 'CDS' },
    { name: 'ARM Assist', image: null, short: 'ARM' },
    { name: 'CashLane Collections SOP Assist', image: '/assets/cashlane.png', short: 'CashLane Collections' },
    { name: 'Key 2 Recovery Debt Collection Training', image: '/assets/key2recovery.png', short: 'Key 2 Recovery' },
    { name: 'Guglielmo & Associates Debt Collection Training', image: '/assets/guglielmo.jpg', short: 'Guglielmo' }
];

// Chart colors
const CHART_COLORS = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
];

// State
let dailyChart = null;
let distributionChart = null;
let modalDailyChart = null;
let modalRatioChart = null;
let isLoading = false;
let portfoliosData = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initConveyorBelt();
    initCharts();
    refreshData();

    // Auto-refresh
    setInterval(refreshData, REFRESH_INTERVAL);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

// Initialize conveyor belt with exact 10 portfolios
function initConveyorBelt() {
    const track = document.getElementById('conveyor-track');

    // Create items for all 10 portfolios (doubled for seamless loop)
    const items = [...PORTFOLIOS, ...PORTFOLIOS].map(p => {
        const imgHtml = p.image
            ? `<img src="${p.image}" alt="">`
            : `<div class="conveyor-avatar">${getInitials(p.short)}</div>`;
        return `<div class="conveyor-item">${imgHtml}<span>${escapeHtml(p.short)}</span></div>`;
    }).join('');

    track.innerHTML = items;
}

// Fetch data from API
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Fetch day-wise data for a specific portfolio
async function fetchDaywiseStats(portfolioId) {
    try {
        const response = await fetch(`${API_BASE}/api/stats/${portfolioId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Update the dashboard
async function refreshData() {
    if (isLoading) return;
    isLoading = true;

    const statusEl = document.getElementById('status');
    statusEl.className = 'status-indicator';
    statusEl.querySelector('.status-text').textContent = 'Refreshing...';

    try {
        const data = await fetchStats();
        portfoliosData = data.portfolios || [];

        // Update totals
        document.getElementById('total-interactions').textContent = formatNumber(data.totals.total_interactions);
        document.getElementById('total-sessions').textContent = formatNumber(data.totals.total_sessions);
        document.getElementById('today-interactions').textContent = formatNumber(data.totals.today_interactions);
        document.getElementById('today-sessions').textContent = formatNumber(data.totals.today_sessions);

        // Update table
        updatePortfoliosTable(portfoliosData);

        // Update charts
        updateDistributionChart(portfoliosData);
        updateDistributionLegend(portfoliosData);

        // Fetch daywise data for first portfolio with data
        const portfolioWithData = portfoliosData.find(p => parseInt(p.total_interactions) > 0) || portfoliosData[0];
        if (portfolioWithData) {
            const daywiseData = await fetchDaywiseStats(portfolioWithData.id);
            if (daywiseData) {
                updateDailyChart(daywiseData.daywise);
            }
        }

        // Update status
        statusEl.className = 'status-indicator connected';
        statusEl.querySelector('.status-text').textContent = 'Connected';

        // Update timestamp
        document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();

    } catch (error) {
        statusEl.className = 'status-indicator error';
        statusEl.querySelector('.status-text').textContent = 'Connection Error';
        console.error('Refresh failed:', error);
    } finally {
        isLoading = false;
    }
}

// Format large numbers
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    num = parseInt(num) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
}

// Format relative time
function formatTimeAgo(date) {
    if (!date) return 'Never';

    const now = new Date();
    const then = new Date(date);
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString();
}

// Get portfolio info by name
function getPortfolioInfo(name) {
    return PORTFOLIOS.find(p => p.name === name) || { name, image: null, short: name };
}

// Get portfolio initials
function getInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Update portfolios table (clickable for drill-down)
function updatePortfoliosTable(portfolios) {
    const tableBody = document.getElementById('portfolios-table');

    if (!portfolios || portfolios.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-row">No data available</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = portfolios.map(portfolio => {
        const info = getPortfolioInfo(portfolio.name);
        const avatarHtml = info.image
            ? `<img src="${info.image}" alt="">`
            : `<div class="avatar">${getInitials(info.short)}</div>`;

        return `
            <tr onclick="openPortfolioModal(${portfolio.id}, '${escapeHtml(portfolio.name).replace(/'/g, "\\'")}')">
                <td>
                    <div class="portfolio-name">
                        ${avatarHtml}
                        ${escapeHtml(info.short)}
                    </div>
                </td>
                <td class="value-cell">${formatNumber(portfolio.total_interactions)}</td>
                <td class="value-cell">${formatNumber(portfolio.total_sessions)}</td>
                <td class="value-cell today-cell">${formatNumber(portfolio.today_interactions)}</td>
                <td class="time-cell">${formatTimeAgo(portfolio.last_interaction)}</td>
            </tr>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize charts
function initCharts() {
    Chart.defaults.color = '#64748b';
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.weight = 500;

    // Daily chart
    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    dailyChart = new Chart(dailyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Interactions',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                borderWidth: 2
            }, {
                label: 'Sessions',
                data: [],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', align: 'end', labels: { usePointStyle: true, padding: 20, font: { size: 12, weight: 600 } } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });

    // Distribution chart
    const distCtx = document.getElementById('distributionChart').getContext('2d');
    distributionChart = new Chart(distCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{ data: [], backgroundColor: CHART_COLORS, borderWidth: 0, hoverOffset: 10 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '70%'
        }
    });
}

// Update daily chart
function updateDailyChart(daywise) {
    if (!daywise || daywise.length === 0) {
        dailyChart.data.labels = ['No data'];
        dailyChart.data.datasets[0].data = [0];
        dailyChart.data.datasets[1].data = [0];
        dailyChart.update();
        return;
    }

    const sorted = [...daywise].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);

    dailyChart.data.labels = sorted.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    dailyChart.data.datasets[0].data = sorted.map(d => d.interactions);
    dailyChart.data.datasets[1].data = sorted.map(d => d.sessions);
    dailyChart.update();
}

// Update distribution chart
function updateDistributionChart(portfolios) {
    if (!portfolios || portfolios.length === 0) return;

    distributionChart.data.labels = portfolios.map(p => getPortfolioInfo(p.name).short);
    distributionChart.data.datasets[0].data = portfolios.map(p => parseInt(p.total_interactions) || 0);
    distributionChart.update();
}

// Update distribution legend (clickable)
function updateDistributionLegend(portfolios) {
    const legendEl = document.getElementById('distribution-legend');
    if (!portfolios || portfolios.length === 0) {
        legendEl.innerHTML = '';
        return;
    }

    const total = portfolios.reduce((sum, p) => sum + (parseInt(p.total_interactions) || 0), 0);

    legendEl.innerHTML = portfolios.map((portfolio, index) => {
        const value = parseInt(portfolio.total_interactions) || 0;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        const info = getPortfolioInfo(portfolio.name);

        return `
            <div class="legend-item" onclick="openPortfolioModal(${portfolio.id}, '${escapeHtml(portfolio.name).replace(/'/g, "\\'")}')">
                <span class="legend-color" style="background: ${CHART_COLORS[index % CHART_COLORS.length]}"></span>
                <span class="legend-label" title="${escapeHtml(portfolio.name)}">${escapeHtml(info.short)}</span>
                <span class="legend-value">${percentage}%</span>
            </div>
        `;
    }).join('');
}

// =====================
// DRILL-DOWN MODAL
// =====================

async function openPortfolioModal(portfolioId, portfolioName) {
    const modal = document.getElementById('modal-overlay');
    const info = getPortfolioInfo(portfolioName);

    // Set header
    document.getElementById('modal-portfolio-name').textContent = info.short;
    const imgEl = document.getElementById('modal-portfolio-img');
    if (info.image) {
        imgEl.src = info.image;
        imgEl.style.display = 'block';
        imgEl.classList.remove('modal-avatar');
    } else {
        imgEl.style.display = 'none';
    }

    // Show modal
    modal.classList.add('active');

    // Fetch detailed stats
    try {
        const data = await fetchDaywiseStats(portfolioId);
        if (!data) return;

        const stats = data.stats;
        const daywise = data.daywise || [];

        // Update stats
        document.getElementById('modal-total-interactions').textContent = formatNumber(stats.total_interactions);
        document.getElementById('modal-total-sessions').textContent = formatNumber(stats.total_sessions);
        document.getElementById('modal-active-days').textContent = formatNumber(stats.active_days);

        // Calculate average per day
        const activeDays = parseInt(stats.active_days) || 1;
        const avgPerDay = Math.round((parseInt(stats.total_interactions) || 0) / activeDays);
        document.getElementById('modal-avg-per-day').textContent = formatNumber(avgPerDay);

        // Initialize modal charts
        initModalCharts(daywise);

    } catch (error) {
        console.error('Error loading portfolio details:', error);
    }
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    modal.classList.remove('active');

    // Destroy modal charts to prevent memory leaks
    if (modalDailyChart) { modalDailyChart.destroy(); modalDailyChart = null; }
    if (modalRatioChart) { modalRatioChart.destroy(); modalRatioChart = null; }
}

function initModalCharts(daywise) {
    // Destroy existing charts
    if (modalDailyChart) modalDailyChart.destroy();
    if (modalRatioChart) modalRatioChart.destroy();

    const sorted = [...daywise].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);

    // Daily activity chart
    const dailyCtx = document.getElementById('modalDailyChart').getContext('2d');
    modalDailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
            labels: sorted.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Interactions',
                data: sorted.map(d => d.interactions),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4
            }, {
                label: 'Sessions',
                data: sorted.map(d => d.sessions),
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 15, font: { size: 11 } } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }
            }
        }
    });

    // Ratio chart (interactions per session over time)
    const ratioData = sorted.map(d => {
        const sessions = parseInt(d.sessions) || 1;
        return (parseInt(d.interactions) / sessions).toFixed(1);
    });

    const ratioCtx = document.getElementById('modalRatioChart').getContext('2d');
    modalRatioChart = new Chart(ratioCtx, {
        type: 'line',
        data: {
            labels: sorted.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Interactions per Session',
                data: ratioData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 } } }
            }
        }
    });
}
