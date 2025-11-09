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
    
    console.log('📡 Sending request to:', `${API_URL}/analyzer/analyze`);
    
    try {
        const response = await fetch(`${API_URL}/analyzer/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: brand })
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        console.log('📦 Job created:', data.jobId);
        checkJobStatus(data.jobId, button, originalText, brand);
        
    } catch (error) {
        console.error('❌ Error:', error);
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
        
        console.log('📊 Job status:', data.status);
        
        if (data.status === 'completed') {
            console.log('✅ Analysis completed:', data.result);
            data.result.brandName = brand || currentBrand;
            displayEnhancedResults(data.result);
            button.disabled = false;
            button.innerHTML = originalText;
        } else if (data.status === 'failed') {
            throw new Error('Analysis failed');
        } else {
            setTimeout(() => checkJobStatus(jobId, button, originalText, brand), 2000);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification('Failed to get results', 'danger');
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Display enhanced results with circular progress
function displayEnhancedResults(results) {
    const finalScore = results.score || results.averageScore || 0;
    const providers = results.providers || [];
    
    console.log('🎯 Final score:', finalScore, 'Providers:', providers);
    
    let level, color, icon;
    if (finalScore >= 80) { level = 'Excellent'; color = '#28a745'; icon = 'trophy'; }
    else if (finalScore >= 60) { level = 'Good'; color = '#17a2b8'; icon = 'thumbs-up'; }
    else if (finalScore >= 40) { level = 'Moderate'; color = '#ffc107'; icon = 'exclamation-triangle'; }
    else { level = 'Low'; color = '#dc3545'; icon = 'exclamation-circle'; }
    
    // Provider configs with colors and info
    const providerConfig = {
        'chatgpt': { color: '#10a37f', name: 'ChatGPT', info: 'OpenAI GPT-4' },
        'chatgpt-free': { color: '#10a37f', name: 'ChatGPT', info: 'OpenAI GPT-4' },
        'deepseek': { color: '#4285f4', name: 'DeepSeek', info: 'DeepSeek V3' },
        'mistral': { color: '#ff7f50', name: 'Mistral', info: 'Mistral Large' },
        'grok': { color: '#1da1f2', name: 'Grok', info: 'xAI Grok-2' },
        'gemini': { color: '#8e44ad', name: 'Gemini', info: 'Google Gemini' }
    };
    
    // Build provider circles
    let providerCircles = '';
    providers.forEach(provider => {
        const config = providerConfig[provider.name] || { color: '#6c757d', name: provider.name, info: 'AI Provider' };
        const score = Math.round(provider.score || 0);
        
        providerCircles += `
            <div class="col-md-4 col-6 mb-4">
                <div class="text-center">
                    <div class="circular-progress mx-auto" style="--progress: ${score}; --color: ${config.color};">
                        <div class="progress-value">
                            <div>${score}%</div>
                        </div>
                    </div>
                    <h6 class="mt-3 mb-1">${config.name}</h6>
                    <small class="text-muted">${config.info}</small>
                </div>
            </div>
        `;
    });
    
    // If no providers data, show average across main AIs
    if (providers.length === 0) {
        ['chatgpt', 'gemini', 'grok', 'deepseek', 'mistral'].forEach(name => {
            const config = providerConfig[name];
            providerCircles += `
                <div class="col-md-4 col-6 mb-4">
                    <div class="text-center">
                        <div class="circular-progress mx-auto" style="--progress: ${Math.round(finalScore)}; --color: ${config.color};">
                            <div class="progress-value">
                                <div>${Math.round(finalScore)}%</div>
                            </div>
                        </div>
                        <h6 class="mt-3 mb-1">${config.name}</h6>
                        <small class="text-muted">${config.info}</small>
                    </div>
                </div>
            `;
        });
    }
    
    const modalHTML = `
        <style>
            .circular-progress {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                background: conic-gradient(
                    var(--color) calc(var(--progress) * 1%),
                    #e9ecef calc(var(--progress) * 1%)
                );
            }
            
            .circular-progress::before {
                content: "";
                position: absolute;
                width: 90px;
                height: 90px;
                border-radius: 50%;
                background: white;
            }
            
            .progress-value {
                position: relative;
                font-size: 24px;
                font-weight: bold;
                color: #333;
            }
            
            .main-score-circle {
                width: 180px;
                height: 180px;
            }
            
            .main-score-circle .progress-value {
                font-size: 48px;
            }
            
            .main-score-circle::before {
                width: 140px;
                height: 140px;
            }
        </style>
        
        <div class="modal fade" id="resultsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">
                            <i class="fas fa-chart-line mr-2"></i>
                            AI Visibility Analysis Results
                        </h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body p-4">
                        <!-- Overall Score -->
                        <div class="text-center mb-5">
                            <h3 class="mb-4">${results.brandName || 'Unknown Brand'}</h3>
                            <div class="circular-progress main-score-circle mx-auto" style="--progress: ${Math.round(finalScore)}; --color: ${color};">
                                <div class="progress-value">
                                    <div>${Math.round(finalScore)}%</div>
                                </div>
                            </div>
                            <h4 class="mt-4" style="color: ${color};">
                                <i class="fas fa-${icon} mr-2"></i>${level}
                            </h4>
                            <p class="text-muted">Overall AI Visibility Score</p>
                        </div>
                        
                        <!-- Provider Breakdown -->
                        <div class="mb-4">
                            <h5 class="mb-4">
                                <i class="fas fa-robot mr-2"></i>
                                AI Provider Analysis
                            </h5>
                            <div class="row">
                                ${providerCircles}
                            </div>
                        </div>
                        
                        <!-- Key Insights -->
                        <div class="card border-0 bg-light">
                            <div class="card-body">
                                <h6 class="mb-3">
                                    <i class="fas fa-lightbulb mr-2"></i>
                                    Key Insights
                                </h6>
                                <ul class="mb-0">
                                    <li><strong>Market Position:</strong> ${finalScore >= 70 ? 'Above average' : finalScore >= 40 ? 'Average' : 'Below average'}</li>
                                    <li><strong>Growth Potential:</strong> ${100 - Math.round(finalScore)}% improvement opportunity</li>
                                    <li><strong>AI Reach:</strong> ${finalScore >= 70 ? 'High' : finalScore >= 40 ? 'Moderate' : 'Limited'} exposure</li>
                                    ${results.tier === 'free' ? '<li class="text-info"><strong>Free Analysis:</strong> Upgrade for detailed breakdown across all 7 criteria</li>' : ''}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <a href="pricing.html" class="btn btn-primary">
                            <i class="fas fa-star mr-2"></i>Get Full Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('resultsModal');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    $('#resultsModal').modal('show');
}

// For compatibility with existing code
function displayResults(results) {
    displayEnhancedResults(results);
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
    
    // Попробуем сначала настоящий API, если не работает - demo
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
    
    // Симулируем отправку
    showNotification('Thank you! Your report will be sent to ' + email + ' shortly.', 'success');
    emailInput.value = '';
    
    // TODO: Подключить к backend для отправки email
}
