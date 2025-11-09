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

// Display enhanced results
function displayEnhancedResults(results) {
    // FIX: Use results.score from Ultimate GEO v3.1 API
    const finalScore = results.score || results.averageScore || 0;
    
    // Legacy support for old API format
    const chatgptScore = results.chatgpt || finalScore;
    const googleScore = results.google || finalScore;
    
    console.log('🎯 Final score:', finalScore, 'Results:', results);
    
    let level, color, icon;
    if (finalScore >= 80) { level = 'Excellent'; color = 'success'; icon = 'trophy'; }
    else if (finalScore >= 60) { level = 'Good'; color = 'info'; icon = 'thumbs-up'; }
    else if (finalScore >= 40) { level = 'Moderate'; color = 'warning'; icon = 'exclamation-triangle'; }
    else { level = 'Low'; color = 'danger'; icon = 'exclamation-circle'; }
    
    const modalHTML = `
        <div class="modal fade" id="resultsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">AI Visibility Analysis Results</h5>
                        <button type="button" class="close text-white" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-8">
                                <h4>${results.brandName || 'Unknown'}</h4>
                                <p class="text-muted">AI visibility analysis complete</p>
                            </div>
                            <div class="col-md-4 text-center">
                                <div class="card bg-${color} text-white">
                                    <div class="card-body">
                                        <i class="fas fa-${icon} fa-3x mb-2"></i>
                                        <h3>${Math.round(finalScore)}%</h3>
                                        <h5>${level}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6>ChatGPT Visibility: ${Math.round(chatgptScore)}%</h6>
                                        <div class="progress" style="height: 25px;">
                                            <div class="progress-bar bg-success" style="width: ${chatgptScore}%">
                                                ${Math.round(chatgptScore)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6>Google AI Visibility: ${Math.round(googleScore)}%</h6>
                                        <div class="progress" style="height: 25px;">
                                            <div class="progress-bar bg-info" style="width: ${googleScore}%">
                                                ${Math.round(googleScore)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">Key Insights</div>
                            <div class="card-body">
                                <ul>
                                    <li>Market Position: ${finalScore >= 70 ? 'Above average' : finalScore >= 40 ? 'Average' : 'Below average'}</li>
                                    <li>Growth Potential: ${100 - Math.round(finalScore)}% improvement opportunity</li>
                                    <li>AI Reach: ${finalScore >= 70 ? 'High' : finalScore >= 40 ? 'Moderate' : 'Limited'} exposure</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <a href="pricing.html" class="btn btn-primary">Get Full Report</a>
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
