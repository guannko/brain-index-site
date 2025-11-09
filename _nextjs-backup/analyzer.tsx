import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import Page from 'components/Page';
import SectionTitle from 'components/SectionTitle';
import { media } from 'utils/media';

// Конфиг API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://annoris-production.up.railway.app';

interface ProviderScore {
  name: string;
  score: number;
  error?: string;
}

interface AnalysisResult {
  jobId: string;
  status: string;
  result?: {
    score: number;
    breakdown?: string;
    insights?: string;
    analysis?: string;
    verification?: string;
    confidence?: string;
    providers?: ProviderScore[];
    averageScore?: number;
    recommendations?: string[];
    brandName: string;
    domain?: string;
    // Legacy support
    chatgpt?: number;
    google?: number;
  };
}

export default function AnalyzerPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);
  const [autoAnalyzed, setAutoAnalyzed] = useState(false);

  // Функция анализа
  const handleAnalyze = useCallback(async (inputValue?: string) => {
    const brandToAnalyze = inputValue || input;
    if (!brandToAnalyze.trim()) return;

    console.log('🔍 Starting analysis for:', brandToAnalyze);
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const url = `${API_URL}/api/analyzer/analyze`;
      console.log('📡 Sending request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: brandToAnalyze.trim() }),
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) throw new Error('Ошибка анализа');

      const data = await response.json();
      console.log('📦 Received data:', data);
      
      setJobId(data.jobId);
      setPolling(true);
    } catch (err) {
      console.error('❌ Analysis error:', err);
      setError('Произошла ошибка при анализе. Попробуйте позже.');
      setLoading(false);
    }
  }, [input]);

  // ... rest of the component code

  return (
    <Page title="AI Visibility Analyzer - Brain Index" description="Проверьте видимость вашего бренда в AI системах">
      {/* Component JSX */}
    </Page>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}