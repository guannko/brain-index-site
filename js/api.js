// Brain Index API Connection - Railway Production
const API_URL = 'https://annoris-production.up.railway.app/api';

// Global brand storage
let currentBrand = '';

// Analyze brand
async function analyzeBrand() {
    const brandInput = document.getElementById('brandInput');
    const brand = brandInput.value.trim();
    
    if (!brand) {
        showNotification('Please enter your brand name', 'warning');
        return;
    }
    
    currentBrand = brand;
    
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    
    try {
        const response = await fetch(`${API_URL}/analyzer/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: brand,
                tier: 'free' // FREE tier = all 5 providers
            })
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        checkJobStatus(data.jobId, button, originalText, brand);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Analysis service is currently unavailable', 'danger');
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Check job status
async function checkJobStatus(jobId, button, originalText, brand) {
    try {
        const response = await fetch(`${API_URL}/analyzer/results/${jobId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
            data.result.brandName = brand || currentBrand;
            displayTerminalResults(data.result);
            button.disabled = false;
            button.innerHTML = originalText;
        } else if (data.status === 'failed') {
            throw new Error('Analysis failed');
        } else {
            setTimeout(() => checkJobStatus(jobId, button, originalText, brand), 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to get results', 'danger');
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Generate ASCII progress bar
function generateProgressBar(score, width = 20) {
    const filled = Math.round((score / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

// Get color class based on score
function getScoreClass(score) {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

// Display terminal-style results
function displayTerminalResults(results) {
    // Calculate overall AI visibility
    const providers = ['chatgpt', 'deepseek', 'mistral', 'grok', 'gemini'];
    const scores = providers.map(p => results[p] || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Provider names for display
    const providerNames = {
        chatgpt: 'ChatGPT',
        deepseek: 'DeepSeek',
        mistral: 'Mistral',
        grok: 'Grok',
        gemini: 'Gemini'
    };
    
    // Generate bars for each provider
    const providerBars = providers.map(provider => {
        const score = results[provider] || 0;
        const bar = generateProgressBar(score);
        const className = getScoreClass(score);
        return `
            <div class="terminal-line">
                <span class="provider-name">${providerNames[provider].padEnd(10)}</span>
                <span class="${className}">${bar}</span>
                <span class="score-number ${className}">${score}/100</span>
            </div>
        `;
    }).join('');
    
    // Overall bar
    const overallBar = generateProgressBar(avgScore);
    const overallClass = getScoreClass(avgScore);
    
    // Generate copyable text for social media
    const copyableText = `Just analyzed my brand with @BrainIndexGEO:\n\n${providers.map(p => 
        `${providerNames[p].padEnd(10)} ${generateProgressBar(results[p] || 0, 12)} ${results[p] || 0}/100`
    ).join('\n')}\n\nAI visibility score: ${avgScore}/100\n\n${avgScore < 60 ? '😅 Time to optimize!' : '💪 Looking good!'}`;
    
    const modalHTML = `
        <div class="modal fade" id="resultsModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content terminal-modal">
                    <div class="modal-header terminal-header">
                        <h5 class="modal-title terminal-title">
                            <span class="terminal-prompt">$</span> brain-index analyze "${results.brandName || 'Unknown'}"
                        </h5>
                        <button type="button" class="close terminal-close" data-dismiss="modal">
                            <span>×</span>
                        </button>
                    </div>
                    <div class="modal-body terminal-body">
                        <!-- Overall Score -->
                        <div class="terminal-section">
                            <div class="terminal-label">» AI VISIBILITY SCORE</div>
                            <div class="terminal-line terminal-main">
                                <span class="terminal-metric">Overall</span>
                                <span class="${overallClass}">${overallBar}</span>
                                <span class="score-number ${overallClass}">${avgScore}/100</span>
                            </div>
                        </div>
                        
                        <div class="terminal-separator">
                            <span>─────────────────────────────────────────────────────</span>
                        </div>
                        
                        <!-- Individual Providers -->
                        <div class="terminal-section">
                            <div class="terminal-label">» PROVIDER BREAKDOWN</div>
                            ${providerBars}
                        </div>
                        
                        <div class="terminal-separator">
                            <span>─────────────────────────────────────────────────────</span>
                        </div>
                        
                        <!-- Key Insights -->
                        <div class="terminal-section">
                            <div class="terminal-label">» KEY INSIGHTS</div>
                            <div class="terminal-insights">
                                <div class="insight-line">
                                    <span class="insight-icon">${avgScore >= 70 ? '✓' : avgScore >= 40 ? '⚠' : '✗'}</span>
                                    Market Position: <span class="${overallClass}">${avgScore >= 70 ? 'Above average' : avgScore >= 40 ? 'Average' : 'Below average'}</span>
                                </div>
                                <div class="insight-line">
                                    <span class="insight-icon">↑</span>
                                    Growth Potential: <span class="score-medium">${100 - avgScore}% improvement opportunity</span>
                                </div>
                                <div class="insight-line">
                                    <span class="insight-icon">📊</span>
                                    AI Reach: <span class="${overallClass}">${avgScore >= 70 ? 'High' : avgScore >= 40 ? 'Moderate' : 'Limited'} exposure</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Copyable text -->
                        <div class="terminal-section">
                            <div class="terminal-label">» SHARE ON SOCIAL MEDIA</div>
                            <div class="terminal-copy">
                                <pre id="copyableText">${copyableText}</pre>
                                <button class="btn btn-sm btn-terminal" onclick="copyToClipboard()">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer terminal-footer">
                        <button type="button" class="btn btn-terminal-secondary" data-dismiss="modal">
                            <span class="terminal-prompt">$</span> exit
                        </button>
                        <a href="pricing.html" class="btn btn-terminal-primary">
                            <span class="terminal-prompt">$</span> upgrade --tier pro
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Terminal CSS Styles - Site Color Scheme -->
        <style>
            .terminal-modal {
                background: #0D47A1;
                border: 2px solid #1565C0;
                box-shadow: 0 0 30px rgba(21, 101, 192, 0.4);
            }
            
            .terminal-header {
                background: #0a3d91;
                border-bottom: 1px solid #1565C0;
                padding: 1rem 1.5rem;
            }
            
            .terminal-title {
                color: #e8e6e3;
                font-family: 'IBM Plex Mono', 'Courier New', monospace;
                font-size: 1rem;
                font-weight: 600;
                margin: 0;
            }
            
            .terminal-prompt {
                color: #00ACC1;
                margin-right: 8px;
            }
            
            .terminal-close {
                color: #FF6B35;
                opacity: 1;
                font-size: 2rem;
                font-weight: 300;
                text-shadow: none;
            }
            
            .terminal-close:hover {
                color: #ff8c5a;
                opacity: 1;
            }
            
            .terminal-body {
                background: #0D47A1;
                padding: 1.5rem;
                font-family: 'IBM Plex Mono', 'Courier New', monospace;
                color: #e8e6e3;
            }
            
            .terminal-section {
                margin-bottom: 1.5rem;
            }
            
            .terminal-label {
                color: #00ACC1;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 0.75rem;
                letter-spacing: 0.5px;
            }
            
            .terminal-line {
                display: flex;
                align-items: center;
                margin: 0.5rem 0;
                font-size: 0.95rem;
                gap: 1rem;
            }
            
            .terminal-main {
                font-size: 1.1rem;
                margin: 1rem 0;
            }
            
            .terminal-metric {
                color: #00ACC1;
                min-width: 80px;
            }
            
            .provider-name {
                color: #00ACC1;
                min-width: 100px;
            }
            
            .score-number {
                min-width: 60px;
                text-align: right;
                font-weight: 600;
            }
            
            .score-high {
                color: #FF6B35;
            }
            
            .score-medium {
                color: #00ACC1;
            }
            
            .score-low {
                color: #a0a0a0;
            }
            
            .terminal-separator {
                color: #2a4a6a;
                margin: 1rem 0;
                font-size: 0.75rem;
            }
            
            .terminal-insights {
                margin-top: 0.75rem;
            }
            
            .insight-line {
                color: #c8c6c3;
                margin: 0.5rem 0;
                font-size: 0.9rem;
            }
            
            .insight-icon {
                color: #00ACC1;
                margin-right: 0.5rem;
            }
            
            .terminal-copy {
                background: #0a3d91;
                border: 1px solid #1565C0;
                border-radius: 4px;
                padding: 1rem;
                margin-top: 0.75rem;
                position: relative;
            }
            
            .terminal-copy pre {
                color: #e8e6e3;
                margin: 0;
                font-size: 0.85rem;
                white-space: pre-wrap;
            }
            
            .terminal-footer {
                background: #0a3d91;
                border-top: 1px solid #1565C0;
                padding: 1rem 1.5rem;
            }
            
            .btn-terminal {
                background: #FF6B35;
                color: #ffffff;
                border: none;
                font-family: 'IBM Plex Mono', 'Courier New', monospace;
                font-weight: 600;
                padding: 0.5rem 1rem;
                margin-top: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .btn-terminal:hover {
                background: #ff8c5a;
                color: #ffffff;
                transform: translateY(-2px);
            }
            
            .btn-terminal-primary {
                background: #FF6B35;
                color: #ffffff;
                border: 1px solid #FF6B35;
                font-family: 'IBM Plex Mono', 'Courier New', monospace;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .btn-terminal-primary:hover {
                background: #ff8c5a;
                border-color: #ff8c5a;
                color: #ffffff;
                transform: translateY(-2px);
            }
            
            .btn-terminal-secondary {
                background: transparent;
                color: #e8e6e3;
                border: 1px solid #1565C0;
                font-family: 'IBM Plex Mono', 'Courier New', monospace;
                transition: all 0.3s ease;
            }
            
            .btn-terminal-secondary:hover {
                background: #1565C0;
                color: #ffffff;
            }
            
            @media (max-width: 768px) {
                .terminal-line {
                    font-size: 0.75rem;
                    gap: 0.5rem;
                }
                
                .provider-name {
                    min-width: 70px;
                }
                
                .score-number {
                    min-width: 50px;
                }
            }
        </style>
    `;
    
    const oldModal = document.getElementById('resultsModal');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    $('#resultsModal').modal('show');
}

// Copy to clipboard
function copyToClipboard() {
    const text = document.getElementById('copyableText').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard! Share on social media 🚀', 'success');
    });
}

// For compatibility with existing code
function displayResults(results) {
    displayTerminalResults(results);
}

function showNotification(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" style="top: 80px; right: 20px; z-index: 9999;">
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
}

// Demo функция для первых тестов
function analyzeDemo() {
    const brandInput = document.getElementById('brandInput');
    const brand = brandInput.value.trim();
    
    if (!brand) {
        showNotification('Please enter your brand name', 'warning');
        return;
    }
    
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    
    analyzeBrand();
}

// Request report function
function requestReport() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'warning');
        return;
    }
    
    showNotification('Thank you! Your report will be sent to ' + email + ' shortly.', 'success');
    emailInput.value = '';
}
