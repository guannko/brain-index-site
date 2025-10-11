'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Container from 'components/Container';
import { media } from 'utils/media';

const FAQ_DATA = [
  {
    question: 'Это легально?',
    answer: 'Да, абсолютно. Мы анализируем только публичные данные AI-систем и не нарушаем никаких правил использования. Все наши методы полностью соответствуют требованиям AI-платформ.',
  },
  {
    question: 'Сколько времени занимает анализ?',
    answer: 'Отчёт готов через 5 минут после запроса. Мы проверяем вашу видимость в 10+ AI-системах в режиме реального времени и мгновенно формируем детальный анализ.',
  },
  {
    question: 'Какие данные вам нужны?',
    answer: 'Только название вашего бренда или компании. Никаких паролей, логинов или конфиденциальной информации. Мы анализируем публично доступную информацию.',
  },
  {
    question: 'В каких AI-системах вы проверяете видимость?',
    answer: 'ChatGPT, Claude, Gemini, Perplexity, Bing Chat, You.com, Phind, Character.AI и другие. Полный список включает 10+ популярных AI-платформ, которые используют миллионы пользователей.',
  },
  {
    question: 'Что делать после получения отчёта?',
    answer: 'Вы получите конкретный план действий с пошаговыми инструкциями. Мы показываем, что именно нужно изменить на сайте, в контенте и в SEO-стратегии для улучшения AI-видимости.',
  },
  {
    question: 'Подходит ли это для моей ниши?',
    answer: 'Да. Brain Index работает для любого бизнеса: e-commerce, SaaS, рестораны, услуги, B2B. У нас есть специализированные рекомендации для каждой отрасли.',
  },
  {
    question: 'Сколько стоит полная версия?',
    answer: 'Первый анализ бесплатный. Полная версия с мониторингом, конкурентным анализом и API доступом от €49/месяц. Цена зависит от объёма мониторинга и количества брендов.',
  },
  {
    question: 'Как часто обновляются данные?',
    answer: 'В реальном времени. Мы мониторим изменения в AI-системах каждый час и присылаем уведомления, когда что-то изменилось в вашей видимости.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <FAQWrapper>
      <Container>
        <FAQHeader>
          <FAQSuperTitle>FAQ</FAQSuperTitle>
          <FAQTitle>Частые вопросы</FAQTitle>
          <FAQDescription>
            Ответы на самые популярные вопросы о Brain Index и анализе AI-видимости
          </FAQDescription>
        </FAQHeader>

        <FAQList>
          {FAQ_DATA.map((item, index) => (
            <FAQItem key={index}>
              <FAQQuestion
                onClick={() => toggleFAQ(index)}
                isOpen={openIndex === index}
              >
                <span>{item.question}</span>
                <FAQIcon isOpen={openIndex === index}>
                  {openIndex === index ? '−' : '+'}
                </FAQIcon>
              </FAQQuestion>
              <FAQAnswer isOpen={openIndex === index}>
                <FAQAnswerContent>
                  {item.answer}
                </FAQAnswerContent>
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>

        <FAQCta>
          <FAQCtaTitle>Остались вопросы?</FAQCtaTitle>
          <FAQCtaText>
            Свяжитесь с нами в Telegram <strong>@brainindex</strong> или напишите на{' '}
            <strong>support@brainindex.ai</strong>
          </FAQCtaText>
        </FAQCta>
      </Container>
    </FAQWrapper>
  );
}

const FAQWrapper = styled.section`
  padding: 8rem 0;
  background: rgb(var(--background));

  ${media('<=tablet')} {
    padding: 6rem 0;
  }
`;

const FAQHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
  max-width: 70rem;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const FAQSuperTitle = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: rgb(var(--primary));
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FAQTitle = styled.h2`
  font-size: 4.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  line-height: 1.2;

  ${media('<=tablet')} {
    font-size: 3.6rem;
  }
`;

const FAQDescription = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const FAQList = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid rgba(var(--textSecondary), 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.button<{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem 0;
  border: none;
  background: none;
  text-align: left;
  font-size: 1.8rem;
  font-weight: 600;
  color: rgb(var(--text));
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: rgb(var(--primary));
  }

  ${media('<=tablet')} {
    font-size: 1.6rem;
    padding: 2rem 0;
  }
`;

const FAQIcon = styled.span<{ isOpen: boolean }>`
  font-size: 2.4rem;
  color: rgb(var(--primary));
  transition: all 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'rotate(0deg)' : 'rotate(0deg)')};
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? '20rem' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const FAQAnswerContent = styled.div`
  padding-bottom: 2.5rem;
  font-size: 1.6rem;
  line-height: 1.6;
  opacity: 0.8;

  ${media('<=tablet')} {
    font-size: 1.4rem;
    padding-bottom: 2rem;
  }
`;

const FAQCta = styled.div`
  text-align: center;
  margin-top: 6rem;
  padding: 3rem;
  background: rgba(var(--primary), 0.1);
  border-radius: 2rem;
  border: 1px solid rgba(var(--primary), 0.2);

  ${media('<=tablet')} {
    margin-top: 4rem;
    padding: 2rem;
  }
`;

const FAQCtaTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const FAQCtaText = styled.p`
  font-size: 1.6rem;
  opacity: 0.8;
  line-height: 1.6;

  strong {
    color: rgb(var(--primary));
    opacity: 1;
  }

  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;
