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

  // Функция анализа
  const handleAnalyze = useCallback(async (inputValue?: string) => {
    const brandToAnalyze = inputValue || input;
    if (!brandToAnalyze.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/analyzer/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: brandToAnalyze.trim() }),
      });

      if (!response.ok) throw new Error('Ошибка анализа');

      const data = await response.json();
      setJobId(data.jobId);
      setPolling(true);
    } catch (err) {
      setError('Произошла ошибка при анализе. Попробуйте позже.');
      setLoading(false);
    }
  }, [input]);

  // Обработка параметра из URL
  useEffect(() => {
    if (router.query.q) {
      setInput(router.query.q as string);
      // Автоматически запускаем анализ
      setTimeout(() => handleAnalyze(router.query.q as string), 100);
    }
  }, [router.query.q, handleAnalyze]);

  // Получение результатов
  useEffect(() => {
    if (!jobId || !polling) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/analyzer/results/${jobId}`);
        const data = await response.json();

        if (data.status === 'completed' && data.result) {
          setResult(data);
          setLoading(false);
          setPolling(false);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    // Таймаут 60 секунд
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setLoading(false);
      setPolling(false);
      setError('Анализ занимает больше времени чем обычно. Попробуйте позже.');
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [jobId, polling]);

  const finalScore = result?.result?.score || result?.result?.averageScore || 0;

  return (
    <Page title=\"AI Visibility Analyzer - Brain Index\" description=\"Проверьте видимость вашего бренда в AI системах\">
      <Container>
        <Content>
          <Header>
            <SectionTitle>AI Visibility Analyzer</SectionTitle>
            <Subtitle>Узнайте, как AI-системы видят ваш бренд</Subtitle>
          </Header>

          {!result && (
            <SearchSection>
              <SearchForm onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
                <SearchInput
                  type=\"text\"
                  placeholder=\"Apple, Nike или ваш сайт: example.com, mycompany.io\"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <SearchButton type=\"submit\" disabled={loading || !input.trim()}>
                  {loading ? 'Анализируем...' : 'Анализировать'}
                </SearchButton>
              </SearchForm>
              
              <ExamplesSection>
                <ExamplesTitle>Примеры для анализа:</ExamplesTitle>
                <ExamplesGrid>
                  <ExampleChip onClick={() => { setInput('Apple'); handleAnalyze('Apple'); }}>Apple</ExampleChip>
                  <ExampleChip onClick={() => { setInput('tesla'); handleAnalyze('tesla'); }}>Tesla</ExampleChip>
                  <ExampleChip onClick={() => { setInput('Nike'); handleAnalyze('Nike'); }}>Nike</ExampleChip>
                </ExamplesGrid>
              </ExamplesSection>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </SearchSection>
          )}

          {loading && (
            <LoadingSection>
              <LoadingSpinner />
              <LoadingText>Анализируем видимость (Ultimate GEO v3.1)...</LoadingText>
              <LoadingSubtext>7 критериев + verification pass</LoadingSubtext>
            </LoadingSection>
          )}

          {result && result.result && (
            <ResultsSection>
              <ResultHeader>
                <BrandName>{result.result.brandName}</BrandName>
                {result.result.domain && <DomainName>{result.result.domain}</DomainName>}
              </ResultHeader>

              <AverageScoreCard>
                <AverageScoreLabel>AI Visibility Score (Ultimate GEO v3.1)</AverageScoreLabel>
                <AverageScoreValue color={getScoreColor(finalScore)}>
                  {Math.round(finalScore)}/100
                </AverageScoreValue>
                {result.result.confidence && <Confidence>Confidence: {result.result.confidence}</Confidence>}
                <AverageScoreBar>
                  <AverageScoreBarFill 
                    width={finalScore} 
                    color={getScoreColor(finalScore)} 
                  />
                </AverageScoreBar>
              </AverageScoreCard>

              {result.result.analysis && (
                <AnalysisSection>
                  <AnalysisTitle>Detailed Breakdown</AnalysisTitle>
                  <AnalysisText>{result.result.analysis}</AnalysisText>
                </AnalysisSection>
              )}

              <CTASection>
                <CTATitle>Хотите увидеть полную детализацию?</CTATitle>
                <CTASubtitle>
                  7 критериев GEO анализа + персональные рекомендации в Pro версии
                </CTASubtitle>
                <CTAButtons>
                  <Button onClick={() => router.push('/pricing')}>
                    Попробовать Pro версию
                  </Button>
                </CTAButtons>
              </CTASection>

              <NewAnalysisButton onClick={() => { setResult(null); setInput(''); }}>
                Новый анализ
              </NewAnalysisButton>
            </ResultsSection>
          )}
        </Content>
      </Container>
    </Page>
  );
}

// Make this page server-side rendered to avoid 404
export async function getServerSideProps() {
  return {
    props: {},
  };
}

// Helper function
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#ef4444';
  return '#6b7280';
};

// Styled components (сокращённая версия для экономии токенов)
const Content = styled.div`max-width: 80rem; margin: 0 auto; padding: 8rem 0; ${media('<=tablet')} { padding: 4rem 0; }`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Subtitle = styled.p`font-size: 1.8rem; color: rgba(var(--text), 0.8); margin-top: 1rem;`;
const SearchSection = styled.div`margin-bottom: 4rem;`;
const SearchForm = styled.form`display: flex; gap: 1.5rem; max-width: 60rem; margin: 0 auto; ${media('<=tablet')} { flex-direction: column; }`;
const SearchInput = styled(Input)`flex: 1; height: 5.6rem; font-size: 1.6rem; padding: 0 2rem;`;
const SearchButton = styled.button`height: 5.6rem; padding: 0 3rem; font-size: 1.6rem; white-space: nowrap; border: none; background: rgb(var(--primary)); color: rgb(var(--textSecondary)); text-transform: uppercase; font-family: var(--font); font-weight: bold; border-radius: 0.4rem; cursor: pointer; transition: transform 0.3s, opacity 0.3s; &:hover:not(:disabled) { transform: scale(1.025); } &:disabled { opacity: 0.6; cursor: not-allowed; }`;
const ExamplesSection = styled.div`margin-top: 3rem; text-align: center;`;
const ExamplesTitle = styled.p`font-size: 1.4rem; color: rgba(var(--text), 0.6); margin-bottom: 1.5rem;`;
const ExamplesGrid = styled.div`display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; max-width: 60rem; margin: 0 auto;`;
const ExampleChip = styled.button`background: rgba(var(--primary), 0.1); border: 1px solid rgba(var(--primary), 0.2); border-radius: 2rem; padding: 0.8rem 1.8rem; font-size: 1.4rem; color: rgb(var(--text)); cursor: pointer; transition: all 0.2s; &:hover { background: rgba(var(--primary), 0.2); border-color: rgba(var(--primary), 0.4); transform: translateY(-2px); }`;
const ErrorMessage = styled.p`color: rgb(var(--errorColor)); text-align: center; margin-top: 2rem; font-size: 1.4rem;`;
const LoadingSection = styled.div`text-align: center; padding: 4rem 0;`;
const LoadingSpinner = styled.div`width: 4rem; height: 4rem; margin: 0 auto 2rem; border: 3px solid rgba(var(--primary), 0.1); border-top-color: rgb(var(--primary)); border-radius: 50%; animation: spin 1s linear infinite; @keyframes spin { to { transform: rotate(360deg); } }`;
const LoadingText = styled.p`font-size: 1.8rem; color: rgb(var(--text)); margin-bottom: 0.5rem;`;
const LoadingSubtext = styled.p`font-size: 1.4rem; color: rgba(var(--text), 0.6);`;
const ResultsSection = styled.div`background: rgba(var(--cardBackground), 0.5); padding: 3rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);`;
const ResultHeader = styled.div`text-align: center; margin-bottom: 3rem;`;
const BrandName = styled.h2`font-size: 3.2rem; font-weight: bold; color: rgb(var(--text)); margin-bottom: 0.5rem;`;
const DomainName = styled.p`font-size: 1.6rem; color: rgba(var(--text), 0.6);`;
const AverageScoreCard = styled.div`background: linear-gradient(135deg, rgba(var(--primary), 0.15), rgba(var(--primary), 0.05)); padding: 3rem; border-radius: 1.2rem; text-align: center; margin-bottom: 3rem; border: 2px solid rgba(var(--primary), 0.2);`;
const AverageScoreLabel = styled.h3`font-size: 1.8rem; color: rgba(var(--text), 0.9); margin-bottom: 1.5rem; font-weight: 600;`;
const AverageScoreValue = styled.div<{ color: string }>`font-size: 5.2rem; font-weight: bold; color: ${props => props.color}; margin-bottom: 1rem;`;
const Confidence = styled.div`font-size: 1.4rem; color: rgba(var(--text), 0.7); margin-bottom: 2rem;`;
const AverageScoreBar = styled.div`width: 100%; height: 1.2rem; background: rgba(var(--text), 0.1); border-radius: 0.6rem; overflow: hidden;`;
const AverageScoreBarFill = styled.div<{ width: number; color: string }>`width: ${props => props.width}%; height: 100%; background: ${props => props.color}; transition: width 1s ease;`;
const AnalysisSection = styled.div`margin-bottom: 3rem;`;
const AnalysisTitle = styled.h3`font-size: 2rem; margin-bottom: 1.5rem; color: rgb(var(--text));`;
const AnalysisText = styled.p`font-size: 1.4rem; line-height: 1.8; color: rgba(var(--text), 0.8); white-space: pre-wrap;`;
const CTASection = styled.div`background: linear-gradient(135deg, rgba(var(--primary), 0.1), rgba(var(--primary), 0.05)); padding: 3rem; border-radius: 1rem; text-align: center; margin-bottom: 2rem;`;
const CTATitle = styled.h3`font-size: 2.4rem; margin-bottom: 1rem; color: rgb(var(--text));`;
const CTASubtitle = styled.p`font-size: 1.6rem; color: rgba(var(--text), 0.8); margin-bottom: 2rem; max-width: 60rem; margin-left: auto; margin-right: auto;`;
const CTAButtons = styled.div`display: flex; gap: 1.5rem; justify-content: center; ${media('<=tablet')} { flex-direction: column; align-items: center; }`;
const NewAnalysisButton = styled(Button)`display: block; margin: 0 auto;`;
