import React from 'react';
import styled from 'styled-components';
import AutofitGrid from 'components/AutofitGrid';
import BasicCard from 'components/BasicCard';
import Container from 'components/Container';
import { media } from 'utils/media';

const FEATURES = [
  {
    imageUrl: '/grid-icons/asset-1.svg',
    title: 'Анализ 10+ AI-систем',
    description:
      'Проверяем вашу видимость в ChatGPT, Claude, Gemini, Perplexity и других популярных AI-платформах. Полный охват экосистемы искусственного интеллекта.',
  },
  {
    imageUrl: '/grid-icons/asset-2.svg',
    title: 'Мониторинг в реальном времени',
    description:
      'Отслеживаем изменения в реальном времени и присылаем алерты, когда AI-системы начинают рекомендовать ваших конкурентов вместо вас.',
  },
  {
    imageUrl: '/grid-icons/asset-3.svg',
    title: 'Анализ конкурентов',
    description:
      'Сравниваем вашу видимость с конкурентами и показываем, как их обогнать. Детальный разбор стратегий топ-игроков в вашей нише.',
  },
  {
    imageUrl: '/grid-icons/asset-4.svg',
    title: 'План действий GEO',
    description:
      'Получите конкретный план оптимизации для каждой AI-платформы. Пошаговые инструкции, что именно нужно изменить для улучшения видимости.',
  },
  {
    imageUrl: '/grid-icons/asset-5.svg',
    title: 'Отчёты за 5 минут',
    description:
      'Детальный анализ готов через 5 минут после запроса. Никаких ожиданий — получайте инсайты мгновенно и действуйте быстрее конкурентов.',
  },
  {
    imageUrl: '/grid-icons/asset-6.svg',
    title: 'Отраслевые инсайты',
    description:
      'Специализированные рекомендации для разных ниш: e-commerce, SaaS, рестораны, услуги. Индивидуальный подход для каждого типа бизнеса.',
  },
  {
    imageUrl: '/grid-icons/asset-7.svg',
    title: 'API интеграция',
    description:
      'Подключайте Brain Index к вашим системам через API. Автоматизируйте мониторинг AI-видимости и получайте данные в ваших дашбордах.',
  },
  {
    imageUrl: '/grid-icons/asset-8.svg',
    title: 'Белый лейбл',
    description:
      'Предлагайте GEO-анализ вашим клиентам под своим брендом. Идеально для SEO-агентств, маркетинговых компаний и консультантов.',
  },
  {
    imageUrl: '/grid-icons/asset-9.svg',
    title: 'Экспорт и интеграции',
    description:
      'Экспортируйте отчёты в PDF, Excel или подключайте к Google Analytics, Slack, Telegram. Полная интеграция с вашим рабочим процессом.',
  },
];

export default function Features() {
  return (
    <Container>
      <FeaturesHeader>
        <FeaturesSuperTitle>Platform Features</FeaturesSuperTitle>
        <FeaturesTitle>Что вы получите с Brain Index</FeaturesTitle>
        <FeaturesDescription>
          Полный набор инструментов для анализа и улучшения видимости вашего бренда в AI-системах. 
          От диагностики проблем до автоматизации мониторинга.
        </FeaturesDescription>
      </FeaturesHeader>
      <CustomAutofitGrid>
        {FEATURES.map((singleFeature, idx) => (
          <BasicCard key={singleFeature.title} {...singleFeature} />
        ))}
      </CustomAutofitGrid>
    </Container>
  );
}

const CustomAutofitGrid = styled(AutofitGrid)`
  --autofit-grid-item-size: 40rem;

  ${media('<=tablet')} {
    --autofit-grid-item-size: 30rem;
  }

  ${media('<=phone')} {
    --autofit-grid-item-size: 100%;
  }
`;

const FeaturesHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const FeaturesSuperTitle = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: rgb(var(--primary));
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FeaturesTitle = styled.h2`
  font-size: 4.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  line-height: 1.2;

  ${media('<=tablet')} {
    font-size: 3.6rem;
  }
`;

const FeaturesDescription = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;
