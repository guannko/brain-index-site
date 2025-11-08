import React, { useState } from 'react';
import styled from 'styled-components';

interface GeoLiteResult {
  score: number;
  breakdown: { ai: number; community: number; structured: number };
  insight: string;
  confidence: 'High' | 'Medium' | 'Low';
  cached: boolean;
  data_age: string;
}

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
`;

const Title = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const ScoreDisplay = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ScoreNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const BreakdownItem = styled.div`
  background: #f7f7f7;
  padding: 1rem;
  border-radius: 10px;
`;

const BreakdownIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const BreakdownValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #667eea;
`;

const BreakdownLabel = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

const Insight = styled.p`
  font-size: 0.875rem;
  font-style: italic;
  color: #666;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const UpgradeButton = styled.a`
  display: block;
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 10px;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export default function GeoLite() {
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState<GeoLiteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!brand.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/geo-free?brand=${encodeURIComponent(brand)}`);
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Ошибка анализа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyze();
    }
  };

  return (
    <Container>
      <Title>⚡ GEO Scout (Free)</Title>
      
      <InputGroup>
        <Input
          type="text"
          placeholder="Введите название бренда..."
          value={brand}
          onChange={e => setBrand(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={analyze} disabled={loading || !brand.trim()}>
          {loading ? '⏳' : '🔍'}
        </Button>
      </InputGroup>

      {error && <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>}

      {result && (
        <ResultCard>
          <ScoreDisplay>
            <ScoreNumber>{result.score}/20</ScoreNumber>
            <ScoreLabel>
              {result.cached ? '⚡ Из кэша' : '🧠 Свежий анализ'}
            </ScoreLabel>
          </ScoreDisplay>

          <BreakdownGrid>
            <BreakdownItem>
              <BreakdownIcon>🔍</BreakdownIcon>
              <BreakdownValue>{result.breakdown.ai}/10</BreakdownValue>
              <BreakdownLabel>AI Search</BreakdownLabel>
            </BreakdownItem>
            
            <BreakdownItem>
              <BreakdownIcon>💬</BreakdownIcon>
              <BreakdownValue>{result.breakdown.community}/5</BreakdownValue>
              <BreakdownLabel>Community</BreakdownLabel>
            </BreakdownItem>
            
            <BreakdownItem>
              <BreakdownIcon>📊</BreakdownIcon>
              <BreakdownValue>{result.breakdown.structured}/5</BreakdownValue>
              <BreakdownLabel>Data</BreakdownLabel>
            </BreakdownItem>
          </BreakdownGrid>

          <Insight>{result.insight}</Insight>

          <UpgradeButton href="/signup">
            ✨ Полный анализ (7 критериев) → Pro
          </UpgradeButton>
        </ResultCard>
      )}
    </Container>
  );
}
