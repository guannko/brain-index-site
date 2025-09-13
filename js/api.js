// Brain Index API Connection
const API_URL = 'http://localhost:3000/api'; // Позже заменим на production URL

// Анализ бренда
async function analyzeBrand() {
    const brandInput = document.getElementById('brandInput');
    const brand = brandInput.value.trim();
    
    if (!brand) {
        showNotification('Please enter your brand name', 'warning');
        return;
    }
    
    // Показываем индикатор загрузки
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    
    try {
        // Отправляем запрос на анализ
        const response = await fetch(`${API_URL}/analyzer/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                brandName: brand,
                providers: ['chatgpt', 'google'] // Можно расширить
            })
        });
        
        if (!response.ok) {
            throw new Error('Analysis failed');
        }
        
        const data = await response.json();
        
        // Получаем ID задачи
        const jobId = data.jobId;
        
        // Ждём результаты
        checkJobStatus(jobId, button, originalText);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Analysis service is currently unavailable. Please try again later.', 'danger');
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Проверка статуса задачи
async function checkJobStatus(jobId, button, originalText) {
    try {
        const response = await fetch(`${API_URL}/analyzer/results/${jobId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
            // Показываем результаты
            displayResults(data.result);
            button.disabled = false;
            button.innerHTML = originalText;
        } else if (data.status === 'failed') {
            throw new Error('Analysis failed');
        } else {
            // Проверяем снова через 2 секунды
            setTimeout(() => checkJobStatus(jobId, button, originalText), 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to get results. Please try again.', 'danger');
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Отображение результатов
function displayResults(results) {
    // Создаём модальное окно с результатами
    const modalHTML = `
        <div class="modal fade" id="resultsModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">AI Visibility Analysis Results</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h6>Brand: ${results.brandName}</h6>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">ChatGPT Visibility</h6>
                                        <div class="progress">
                                            <div class="progress-bar bg-success" style="width: ${results.chatgptScore || 0}%">
                                                ${results.chatgptScore || 0}%
                                            </div>
                                        </div>
                                        <small class="text-muted">How well ChatGPT knows your brand</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">Google AI Visibility</h6>
                                        <div class="progress">
                                            <div class="progress-bar bg-info" style="width: ${results.googleScore || 0}%">
                                                ${results.googleScore || 0}%
                                            </div>
                                        </div>
                                        <small class="text-muted">Your presence in Google AI results</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <h6>Recommendations:</h6>
                            <ul>
                                ${results.recommendations ? results.recommendations.map(r => `<li>${r}</li>`).join('') : '<li>Sign up for detailed analysis and recommendations</li>'}
                            </ul>
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
    
    // Удаляем старый модал если есть
    const oldModal = document.getElementById('resultsModal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // Добавляем новый модал
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Показываем модал
    $('#resultsModal').modal('show');
}

// Показ уведомлений
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
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
}

// Demo режим (пока нет backend)
function analyzeDemo() {
    const brandInput = document.getElementById('brandInput');
    const brand = brandInput.value.trim();
    
    if (!brand) {
        showNotification('Please enter your brand name', 'warning');
        return;
    }
    
    // Показываем индикатор загрузки
    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    
    // Симулируем задержку
    setTimeout(() => {
        // Генерируем случайные результаты для демо
        const demoResults = {
            brandName: brand,
            chatgptScore: Math.floor(Math.random() * 60) + 20,
            googleScore: Math.floor(Math.random() * 50) + 15,
            recommendations: [
                'Create detailed product descriptions with structured data',
                'Optimize your website for AI crawlers',
                'Build authoritative content that AI systems reference',
                'Implement Schema.org markup for better understanding'
            ]
        };
        
        displayResults(demoResults);
        button.disabled = false;
        button.innerHTML = originalText;
    }, 2000);
}

// Запрос отчёта по email
function requestReport() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'warning');
        return;
    }
    
    // В демо режиме просто показываем сообщение
    showNotification('Thank you! Your report will be sent to ' + email + ' shortly.', 'success');
    emailInput.value = '';
    
    // TODO: Отправить на backend когда будет готов
    // fetch(`${API_URL}/reports/request`, {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({email})
    // });
}
