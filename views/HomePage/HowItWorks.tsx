import React from 'react';
import styled from 'styled-components';
import Container from 'components/Container';
import { media } from 'utils/media';

const STEPS = [
  {
    number: '1',
    title: 'Введите название бренда',
    description: 'Просто укажите название вашей компании или продукта. Никаких паролей или сложных настроек.',
    icon: '🔍',
  },
  {
    number: '2', 
    title: 'Мы проанализируем 10+ AI-систем',
    description: 'Проверим вашу видимость в ChatGPT, Claude, Gemini, Perplexity и других популярных AI-платформах.',
    icon: '🤖',
  },
  {
    number: '3',
    title: 'Получите отчёт с рекомендациями',
    description: 'Детальный анализ с конкретным планом действий и пошаговыми инструкциями по улучшению.',
    icon: '📊',
  },
];

export default function HowItWorks() {
  return (
    <HowItWorksWrapper>
      <Container>
        <HowItWorksHeader>
          <HowItWorksSuperTitle>How It Works</HowItWorksSuperTitle>
          <HowItWorksTitle>Как это работает</HowItWorksTitle>
          <HowItWorksDescription>
            Получите анализ AI-видимости вашего бренда за 3 простых шага. 
            Весь процесс занимает менее 5 минут.
          </HowItWorksDescription>
        </HowItWorksHeader>

        <StepsContainer>
          {STEPS.map((step, index) => (
            <StepItem key={index}>
              <StepIconContainer>
                <StepIcon>{step.icon}</StepIcon>
                <StepNumber>{step.number}</StepNumber>
              </StepIconContainer>
              
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>

              {index < STEPS.length - 1 && (
                <StepArrow>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path 
                      d="M16.6667 13.3333L23.3333 20L16.6667 26.6667" 
                      stroke="rgb(var(--primary))" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </StepArrow>
              )}
            </StepItem>
          ))}
        </StepsContainer>

        <DemoSection>
          <DemoTitle>Посмотрите демо анализа</DemoTitle>
          <DemoDescription>
            Пример отчёта для IT-компании: видимость в AI-системах, анализ конкурентов, план действий
          </DemoDescription>
          <DemoButton>
            Скачать пример отчёта <span>📋</span>
          </DemoButton>
        </DemoSection>
      </Container>
    </HowItWorksWrapper>
  );
}

const HowItWorksWrapper = styled.section`
  padding: 8rem 0;
  background: rgb(var(--secondBackground));

  ${media('<=tablet')} {
    padding: 6rem 0;
  }
`;

const HowItWorksHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
  max-width: 70rem;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const HowItWorksSuperTitle = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: rgb(var(--primary));
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const HowItWorksTitle = styled.h2`
  font-size: 4.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  line-height: 1.2;

  ${media('<=tablet')} {
    font-size: 3.6rem;
  }
`;

const HowItWorksDescription = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 120rem;
  margin: 0 auto 8rem;
  gap: 2rem;

  ${media('<=desktop')} {
    flex-direction: column;
    align-items: center;
    gap: 4rem;
  }
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  flex: 1;
  max-width: 35rem;

  ${media('<=desktop')} {
    max-width: 50rem;
    flex-direction: row;
    text-align: left;
    gap: 2rem;
  }

  ${media('<=tablet')} {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const StepIconContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;

  ${media('<=desktop')} {
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

const StepIcon = styled.div`
  width: 8rem;
  height: 8rem;
  background: linear-gradient(135deg, rgb(var(--primary)), rgb(var(--primaryLight)));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: 0 10px 30px rgba(var(--primary), 0.3);

  ${media('<=tablet')} {
    width: 6rem;
    height: 6rem;
    font-size: 2.4rem;
  }
`;

const StepNumber = styled.div`
  position: absolute;
  bottom: -0.5rem;
  right: -0.5rem;
  width: 3rem;
  height: 3rem;
  background: rgb(var(--textSecondary));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
`;

const StepContent = styled.div`
  ${media('<=desktop')} {
    flex: 1;
  }
`;

const StepTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const StepDescription = styled.p`
  font-size: 1.6rem;
  opacity: 0.8;
  line-height: 1.6;

  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const StepArrow = styled.div`
  position: absolute;
  top: 4rem;
  right: -3rem;
  opacity: 0.5;

  ${media('<=desktop')} {
    display: none;
  }
`;

const DemoSection = styled.div`
  text-align: center;
  padding: 4rem 3rem;
  background: rgba(var(--primary), 0.1);
  border-radius: 2rem;
  border: 1px solid rgba(var(--primary), 0.2);
  max-width: 70rem;
  margin: 0 auto;

  ${media('<=tablet')} {
    padding: 3rem 2rem;
  }
`;

const DemoTitle = styled.h3`
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    font-size: 2.4rem;
  }
`;

const DemoDescription = styled.p`
  font-size: 1.6rem;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2.5rem;

  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const DemoButton = styled.button`
  background: linear-gradient(135deg, rgb(var(--primary)), rgb(var(--primaryLight)));
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(var(--primary), 0.4);
  }

  span {
    font-size: 1.8rem;
  }

  ${media('<=tablet')} {
    padding: 1.3rem 2.5rem;
    font-size: 1.4rem;
  }
`;
