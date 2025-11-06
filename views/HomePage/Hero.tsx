'use client';

import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from 'components/Button';
import Container from 'components/Container';
import HeroIllustration from 'components/HeroIllustation';
import OverTitle from 'components/OverTitle';
import Input from 'components/Input';
import { media } from 'utils/media';

export default function Hero() {
  const [brandInput, setBrandInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandInput.trim()) return;
    
    setIsLoading(true);
    // Переходим на страницу анализатора с параметром
    router.push(`/analyzer?q=${encodeURIComponent(brandInput.trim())}`);
  };

  return (
    <HeroWrapper>
      <Contents>
        <CustomOverTitle>GEO - Generative Engine Optimization</CustomOverTitle>
        <Heading>Ваш бренд теряет клиентов в AI-поиске? Проверим бесплатно за 2 минуты.</Heading>
        <Description>
          Узнайте, как ChatGPT, Claude и другие AI рекомендуют ваших конкурентов, а не вас. 
          <strong> 37% поисков теперь проходят через AI-системы</strong> — получите детальный анализ 
          видимости вашего бренда в 10+ AI-платформах и план действий по исправлению.
        </Description>
        <StatsSection>
          <Stat>
            <StatNumber>37%</StatNumber>
            <StatText>поисков через AI</StatText>
          </Stat>
          <Stat>
            <StatNumber>60M+</StatNumber>
            <StatText>пользователей ChatGPT</StatText>
          </Stat>
          <Stat>
            <StatNumber>500+</StatNumber>
            <StatText>компаний доверяют Brain Index</StatText>
          </Stat>
        </StatsSection>
        <UrgencyMessage>
          ⚡ Осталось <strong>3 бесплатных анализа</strong> сегодня!
        </UrgencyMessage>
        
        <AnalyzerForm onSubmit={handleSubmit}>
          <AnalyzerInput
            type="text"
            placeholder="Введите ваш бренд или сайт (например: Apple или apple.com)"
            value={brandInput}
            onChange={(e) => setBrandInput(e.target.value)}
            required
            disabled={isLoading}
          />
          <AnalyzerButton type="submit" disabled={isLoading || !brandInput.trim()}>
            {isLoading ? 'Анализируем...' : 'Проверить бесплатно →'}
          </AnalyzerButton>
        </AnalyzerForm>
        
        <SecondaryLink>
          <NextLink href="#features" passHref>
            <Button transparent>
              Как это работает <span>&rarr;</span>
            </Button>
          </NextLink>
        </SecondaryLink>
      </Contents>
      <ImageContainer>
        <HeroIllustration />
      </ImageContainer>
    </HeroWrapper>
  );
}

const HeroWrapper = styled(Container)`
  display: flex;
  padding-top: 5rem;

  ${media('<=desktop')} {
    padding-top: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const Contents = styled.div`
  flex: 1;
  max-width: 60rem;

  ${media('<=desktop')} {
    max-width: 100%;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-start;

  svg {
    max-width: 45rem;
  }

  ${media('<=desktop')} {
    margin-top: 2rem;
    justify-content: center;
    svg {
      max-width: 80%;
    }
  }
`;

const Description = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;

  strong {
    color: rgb(var(--primary));
    opacity: 1;
  }

  ${media('<=desktop')} {
    font-size: 1.5rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 7.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 4rem;
  letter-spacing: -0.03em;

  ${media('<=tablet')} {
    font-size: 4.6rem;
    margin-bottom: 2rem;
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 4rem;
  margin: 3rem 0;
  padding: 2rem 0;

  ${media('<=tablet')} {
    gap: 2rem;
    flex-wrap: wrap;
  }
`;

const Stat = styled.div`
  text-align: center;

  ${media('<=tablet')} {
    flex: 1;
    min-width: 10rem;
  }
`;

const StatNumber = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: rgb(var(--primary));
  line-height: 1.2;

  ${media('<=tablet')} {
    font-size: 2.8rem;
  }
`;

const StatText = styled.div`
  font-size: 1.4rem;
  opacity: 0.8;
  margin-top: 0.5rem;

  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const UrgencyMessage = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  font-size: 1.6rem;
  text-align: center;
  margin: 2rem 0;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

  strong {
    font-weight: bold;
  }

  ${media('<=tablet')} {
    font-size: 1.4rem;
    padding: 1.2rem 1.5rem;
  }
`;

const AnalyzerForm = styled.form`
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;
  
  ${media('<=tablet')} {
    flex-direction: column;
  }
`;

const AnalyzerInput = styled(Input)`
  flex: 1;
  height: 5.6rem;
  font-size: 1.6rem;
  padding: 0 2rem;
  border: 2px solid rgba(var(--primary), 0.2);
  border-radius: 1rem;
  transition: all 0.2s;
  
  &:focus {
    border-color: rgb(var(--primary));
    box-shadow: 0 0 0 3px rgba(var(--primary), 0.1);
  }
  
  ${media('<=tablet')} {
    height: 5rem;
    font-size: 1.4rem;
  }
`;

const AnalyzerButton = styled(Button)`
  height: 5.6rem;
  padding: 0 3rem;
  font-size: 1.6rem;
  font-weight: bold;
  white-space: nowrap;
  
  ${media('<=tablet')} {
    height: 5rem;
    font-size: 1.4rem;
  }
`;

const SecondaryLink = styled.div`
  margin-top: 2rem;
  text-align: center;
`;