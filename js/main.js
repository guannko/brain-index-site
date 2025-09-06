// API configuration
const API_URL = 'https://api.brain-index.com'; // Поменяем когда деплоим

// Analyze button click
document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const brand = document.getElementById('brandInput').value;
    
    if (!brand) {
        alert('Please enter a brand name');
        return;
    }
    
    // Show loading
    document.getElementById('results').classList.remove('d-none');
    document.getElementById('jobId').textContent = 'Processing...';
    
    // Пока просто демо
    setTimeout(() => {
        alert(`Analysis complete for: ${brand}\n\nThis is a demo. Backend coming soon!`);
    }, 2000);
});
