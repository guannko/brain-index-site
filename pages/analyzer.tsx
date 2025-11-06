import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Page from 'components/Page';
import Button from 'components/Button';
import Container from 'components/Container';
import SectionTitle from 'components/SectionTitle';
import Input from 'components/Input';
import { media } from 'utils/media';

// Конфиг API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://annoris-production.up.railway.app';

interface AnalysisResult {
  jobId: string;
  status: string;
  result?: {
    chatgpt: number;
    google: number;
    analysis: string;
    recommendations?: string[];
    brandName: string;
    domain?: string;
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

  // Обработка параметра из URL
  useEffect(() => {
    if (router.query.q) {
      setInput(router.query.q as string);
      // Автоматически запускаем анализ
      setTimeout(() => handleAnalyze(router.query.q as string), 100);
    }
  }, [router.query.q]);

  // Функция анализа
  const handleAnalyze = async (inputValue?: string) => {
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
  };

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
    }, 1000);

    // Таймаут 30 секунд
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      setLoading(false);
      setPolling(false);
      setError('Анализ занимает больше времени чем обычно. Попробуйте позже.');
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [jobId, polling]);

  return (
    <Page title="AI Visibility Analyzer - Brain Index" description="Проверьте видимость вашего бренда в AI системах">
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
                  type="text"
                  placeholder="Введите название бренда или URL сайта"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <SearchButton type="submit" disabled={loading || !input.trim()}>
                  {loading ? 'Анализируем...' : 'Анализировать'}
                </SearchButton>
              </SearchForm>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </SearchSection>
          )}

          {loading && (
            <LoadingSection>
              <LoadingSpinner />
              <LoadingText>Анализируем видимость в AI системах...</LoadingText>
              <LoadingSubtext>Это может занять до 30 секунд</LoadingSubtext>
            </LoadingSection>
          )}

          {result && result.result && (
            <ResultsSection>
              <ResultHeader>
                <BrandName>{result.result.brandName}</BrandName>
                {result.result.domain && <DomainName>{result.result.domain}</DomainName>}
              </ResultHeader>

              <ScoresGrid>
                <ScoreCard>
                  <ScoreLabel>ChatGPT Visibility</ScoreLabel>
                  <ScoreValue color={getScoreColor(result.result.chatgpt)}>
                    {result.result.chatgpt}/100
                  </ScoreValue>
                  <ScoreBar>
                    <ScoreBarFill width={result.result.chatgpt} color={getScoreColor(result.result.chatgpt)} />
                  </ScoreBar>
                </ScoreCard>

                <ScoreCard>
                  <ScoreLabel>Google AI Visibility</ScoreLabel>
                  <ScoreValue color={getScoreColor(result.result.google)}>
                    {result.result.google}/100
                  </ScoreValue>
                  <ScoreBar>
                    <ScoreBarFill width={result.result.google} color={getScoreColor(result.result.google)} />
                  </ScoreBar>
                </ScoreCard>
              </ScoresGrid>

              <AnalysisSection>
                <AnalysisTitle>Анализ</AnalysisTitle>
                <AnalysisText>{result.result.analysis}</AnalysisText>
              </AnalysisSection>

              {/* Бесплатная версия показывает только 2 рекомендации */}
              {result.result.recommendations && result.result.recommendations.length > 0 && (
                <RecommendationsSection>
                  <RecommendationsTitle>Базовые рекомендации</RecommendationsTitle>
                  <RecommendationsList>
                    {result.result.recommendations.slice(0, 2).map((rec, index) => (
                      <RecommendationItem key={index}>{rec}</RecommendationItem>
                    ))}
                  </RecommendationsList>
                </RecommendationsSection>
              )}

              <CTASection>
                <CTATitle>Хотите увидеть полный анализ?</CTATitle>
                <CTASubtitle>
                  Получите детальные рекомендации, анализ конкурентов и персональную стратегию улучшения видимости
                </CTASubtitle>
                <CTAButtons>
                  <Button onClick={() => router.push('/pricing')}>
                    Попробовать Pro версию
                  </Button>
                  <Button transparent onClick={() => router.push('/contact')}>
                    Связаться с экспертом
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

// Helper function
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#ef4444';
  return '#6b7280';
};

// Styled components
const Content = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 8rem 0;

  ${media('<=tablet')} {
    padding: 4rem 0;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Subtitle = styled.p`
  font-size: 1.8rem;
  color: rgba(var(--text), 0.8);
  margin-top: 1rem;
`;

const SearchSection = styled.div`
  margin-bottom: 4rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1.5rem;
  max-width: 60rem;
  margin: 0 auto;

  ${media('<=tablet')} {
    flex-direction: column;
  }
`;

const SearchInput = styled(Input)`
  flex: 1;
  height: 5.6rem;
  font-size: 1.6rem;
  padding: 0 2rem;
`;

const SearchButton = styled(Button)`
  height: 5.6rem;
  padding: 0 3rem;
  font-size: 1.6rem;
  white-space: nowrap;
`;

const ErrorMessage = styled.p`
  color: rgb(var(--errorColor));
  text-align: center;
  margin-top: 2rem;
  font-size: 1.4rem;
`;

const LoadingSection = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 auto 2rem;
  border: 3px solid rgba(var(--primary), 0.1);
  border-top-color: rgb(var(--primary));
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.8rem;
  color: rgb(var(--text));
  margin-bottom: 0.5rem;
`;

const LoadingSubtext = styled.p`
  font-size: 1.4rem;
  color: rgba(var(--text), 0.6);
`;

const ResultsSection = styled.div`
  background: rgba(var(--cardBackground), 0.5);
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const BrandName = styled.h2`
  font-size: 3.2rem;
  font-weight: bold;
  color: rgb(var(--text));
  margin-bottom: 0.5rem;
`;

const DomainName = styled.p`
  font-size: 1.6rem;
  color: rgba(var(--text), 0.6);
`;

const ScoresGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  ${media('<=tablet')} {
    grid-template-columns: 1fr;
  }
`;

const ScoreCard = styled.div`
  background: rgba(var(--cardBackground));
  padding: 2.5rem;
  border-radius: 1rem;
  text-align: center;
`;

const ScoreLabel = styled.h3`
  font-size: 1.6rem;
  color: rgba(var(--text), 0.8);
  margin-bottom: 1rem;
`;

const ScoreValue = styled.div<{ color: string }>`
  font-size: 4.2rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-bottom: 1.5rem;
`;

const ScoreBar = styled.div`
  width: 100%;
  height: 0.8rem;
  background: rgba(var(--text), 0.1);
  border-radius: 0.4rem;
  overflow: hidden;
`;

const ScoreBarFill = styled.div<{ width: number; color: string }>`
  width: ${props => props.width}%;
  height: 100%;
  background: ${props => props.color};
  transition: width 1s ease;
`;

const AnalysisSection = styled.div`
  margin-bottom: 3rem;
`;

const AnalysisTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: rgb(var(--text));
`;

const AnalysisText = styled.p`
  font-size: 1.6rem;
  line-height: 1.8;
  color: rgba(var(--text), 0.8);
`;

const RecommendationsSection = styled.div`
  margin-bottom: 3rem;
`;

const RecommendationsTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: rgb(var(--text));
`;

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecommendationItem = styled.li`
  font-size: 1.6rem;
  line-height: 1.8;
  color: rgba(var(--text), 0.8);
  padding-left: 2.5rem;
  position: relative;
  margin-bottom: 1rem;

  &:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: rgb(var(--primary));
    font-weight: bold;
  }
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, rgba(var(--primary), 0.1), rgba(var(--primary), 0.05));
  padding: 3rem;
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const CTATitle = styled.h3`
  font-size: 2.4rem;
  margin-bottom: 1rem;
  color: rgb(var(--text));
`;

const CTASubtitle = styled.p`
  font-size: 1.6rem;
  color: rgba(var(--text), 0.8);
  margin-bottom: 2rem;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;

  ${media('<=tablet')} {
    flex-direction: column;
    align-items: center;
  }
`;

const NewAnalysisButton = styled(Button)`
  display: block;
  margin: 0 auto;
`;