# Frontend Architecture - brain-index-site

## 🏗️ Tech Stack

- **Deployment:** Vercel
- **Domain:** brain-index.com
- **Stack:** HTML5, CSS3, JavaScript (ES6+)
- **Framework:** Bootstrap 4
- **Icons:** Font Awesome
- **Analytics:** None (yet)

## 📁 Project Structure

```
brain-index-site/
├── index.html           # Landing page
├── pricing.html         # Pricing tiers
├── about.html          # About page
├── contact.html        # Contact form
├── css/
│   └── brain-index.css # Custom styles
├── js/
│   └── api.js          # API integration & UI logic
└── assets/             # Images, fonts
```

## 🎨 Design System

**Colors:**
- Primary: `#007bff` (blue)
- Success: `#28a745` (green)
- Info: `#17a2b8` (cyan)
- Warning: `#ffc107` (yellow)
- Danger: `#dc3545` (red)

**Typography:**
- Font: Roboto
- Headers: Bold
- Body: Regular

## 🔌 API Integration (`js/api.js`)

### Core Functions

**analyzeBrand()**
```javascript
async function analyzeBrand() {
  // 1. Get brand name from input
  // 2. POST to /api/analyzer/analyze
  // 3. Get jobId
  // 4. Start polling with checkJobStatus()
}
```

**checkJobStatus(jobId)**
```javascript
async function checkJobStatus(jobId) {
  // 1. GET /api/analyzer/results/:jobId
  // 2. If completed → displayEnhancedResults()
  // 3. If processing → retry after 2s
  // 4. If failed → show error
}
```

**displayEnhancedResults(results)**
```javascript
function displayEnhancedResults(results) {
  // 1. Extract score & providers
  // 2. Generate modal HTML with circular progress
  // 3. Show modal with Bootstrap
}
```

### API Configuration
```javascript
const API_URL = 'https://annoris-production.up.railway.app/api';
```

## 🎯 Results Modal Design

### Structure
```html
<modal>
  <header>AI Visibility Analysis Results</header>
  
  <body>
    <!-- Main Score Circle -->
    <div class="main-score-circle">
      <circular-progress>19%</circular-progress>
      <status>Low</status>
    </div>
    
    <!-- Provider Breakdown -->
    <div class="provider-grid">
      <provider-circle name="ChatGPT" score="19%" />
      <provider-circle name="DeepSeek" score="19%" />
      <provider-circle name="Mistral" score="19%" />
      <provider-circle name="Grok" score="19%" />
      <provider-circle name="Gemini" score="19%" />
    </div>
    
    <!-- Key Insights -->
    <insights>
      • Market Position
      • Growth Potential
      • AI Reach
    </insights>
  </body>
  
  <footer>
    <button>Close</button>
    <button>Get Full Report</button>
  </footer>
</modal>
```

### Circular Progress CSS
```css
.circular-progress {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    var(--color) calc(var(--progress) * 1%),
    #e9ecef calc(var(--progress) * 1%)
  );
}

.circular-progress::before {
  content: "";
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: white;
}
```

## 🎨 Provider Color Coding

```javascript
const providerConfig = {
  'chatgpt': { 
    color: '#10a37f', 
    name: 'ChatGPT', 
    info: 'OpenAI GPT-4' 
  },
  'deepseek': { 
    color: '#4285f4', 
    name: 'DeepSeek', 
    info: 'DeepSeek V3' 
  },
  'mistral': { 
    color: '#ff7f50', 
    name: 'Mistral', 
    info: 'Mistral Large' 
  },
  'grok': { 
    color: '#1da1f2', 
    name: 'Grok', 
    info: 'xAI Grok-2' 
  },
  'gemini': { 
    color: '#8e44ad', 
    name: 'Gemini', 
    info: 'Google Gemini' 
  }
};
```

## 🔄 User Flow

1. **Landing** → brain-index.com
2. **Input** → Enter brand name
3. **Click** → "Analyze Brand" button
4. **Loading** → Spinner + "Analyzing..."
5. **Polling** → Check job status every 2s
6. **Results** → Modal with circular progress
7. **CTA** → "Get Full Report" → pricing.html

## 📱 Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 991px
- Desktop: > 992px

**Adaptations:**
- Stack circles vertically on mobile
- Reduce circle sizes
- Simplify navigation

## 🚀 Deployment (Vercel)

**Auto-deploy:**
- Push to main branch → instant deploy
- Preview deployments for PRs
- Zero config needed

**Domain Setup:**
- brain-index.com → Production
- Custom domain configured in Vercel

**Build Settings:**
- Framework: None (static site)
- Build Command: None
- Output Directory: `.` (root)

## 📊 Performance

**Lighthouse Scores:**
- Performance: ~95
- Accessibility: ~90
- Best Practices: ~95
- SEO: ~100

**Optimizations:**
- Minified CSS/JS
- Lazy loading images
- Font preloading
- CDN delivery (Vercel Edge)

## 🎯 Key Features

1. **Circular Progress** - Visual score representation
2. **Multi-Provider Display** - 5 AI systems shown
3. **Real-time Analysis** - Job polling system
4. **Responsive Modal** - Works on all devices
5. **Clean Design** - Minimal, professional

## 🐛 Known Issues

- No loading state for initial request
- Modal doesn't close on backdrop click
- No error retry mechanism
- Font loading warnings (non-critical)

## 📝 Next Steps

- Add loading skeleton
- Improve error handling
- Add analytics (Google Analytics)
- A/B test CTA buttons
- Add testimonials section
