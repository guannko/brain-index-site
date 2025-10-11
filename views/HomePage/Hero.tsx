'use client';

import NextLink from 'next/link';
import styled from 'styled-components';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import HeroIllustration from 'components/HeroIllustation';
import OverTitle from 'components/OverTitle';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { media } from 'utils/media';

export default function Hero() {
  const { setIsModalOpened } = useNewsletterModalContext();

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
        <CustomButtonGroup>
          <Button onClick={() => setIsModalOpened(true)}>
            Получить бесплатный AI-аudit <span>&rarr;</span>
          </Button>
          <NextLink href="#features" passHref>
            <Button transparent>
              Как это работает <span>&rarr;</span>
            </Button>
          </NextLink>
        </CustomButtonGroup>
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

const CustomButtonGroup = styled(ButtonGroup)`
  margin-top: 4rem;
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
