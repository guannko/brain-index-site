import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import { EnvVars } from 'env';
import { getAllPosts } from 'utils/postsFetcher';
import Cta from 'views/HomePage/Cta';
import Features from 'views/HomePage/Features';
import Hero from 'views/HomePage/Hero';
import HowItWorks from 'views/HomePage/HowItWorks';
import FAQ from 'views/HomePage/FAQ';
import Partners from 'views/HomePage/Partners';
import Testimonials from 'views/HomePage/Testimonials';

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Brain Index - AI Visibility Analysis | Проверьте видимость бренда в AI-системах</title>
        <meta
          name="description"
          content="Узнайте, как ChatGPT, Claude и другие AI рекомендуют ваших конкурентов вместо вас. Бесплатный анализ видимости в 10+ AI-платформах за 2 минуты. GEO оптимизация для AI-поиска."
        />
        <meta property="og:title" content="Brain Index - AI Visibility Analysis" />
        <meta property="og:description" content="Проверьте видимость вашего бренда в AI-системах. Бесплатный анализ за 2 минуты." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brain Index - AI Visibility Analysis" />
        <meta name="twitter:description" content="Узнайте, рекомендуют ли AI-системы ваш бренд или конкурентов" />
        
        {/* Keywords for AI visibility, GEO, ChatGPT marketing */}
        <meta name="keywords" content="AI visibility, GEO optimization, ChatGPT marketing, AI search ranking, generative engine optimization, AI brand analysis, ChatGPT SEO, AI marketing tools" />
        
        {/* Structured data for better AI understanding */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Brain Index",
            "description": "AI visibility analysis platform for brands and businesses",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free AI visibility analysis"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500"
            }
          })}
        </script>
      </Head>
      
      <HomepageWrapper>
        {/* Hero Section with new CTA and messaging */}
        <WhiteBackgroundContainer>
          <Hero />
        </WhiteBackgroundContainer>

        {/* Social Proof - Companies that trust us */}
        <TrustSection>
          <Partners />
        </TrustSection>

        {/* How It Works - 3 step process */}
        <WhiteBackgroundContainer>
          <HowItWorks />
        </WhiteBackgroundContainer>

        {/* Platform Features - what users get */}
        <DarkerBackgroundContainer>
          <Features />
        </DarkerBackgroundContainer>

        {/* Social Proof - Testimonials */}
        <WhiteBackgroundContainer>
          <Testimonials />
        </WhiteBackgroundContainer>

        {/* FAQ - Address objections */}
        <DarkerBackgroundContainer>
          <FAQ />
        </DarkerBackgroundContainer>

        {/* Final CTA */}
        <WhiteBackgroundContainer>
          <Cta />
        </WhiteBackgroundContainer>
      </HomepageWrapper>
    </>
  );
}

const HomepageWrapper = styled.div`
  & > :last-child {
    margin-bottom: 0;
  }
`;

const DarkerBackgroundContainer = styled.div`
  background: rgb(var(--background));
`;

const WhiteBackgroundContainer = styled.div`
  background: rgb(var(--secondBackground));
`;

const TrustSection = styled.div`
  background: rgb(var(--background));
  padding: 4rem 0;
  border-top: 1px solid rgba(var(--textSecondary), 0.1);
  border-bottom: 1px solid rgba(var(--textSecondary), 0.1);
`;

export async function getStaticProps() {
  return {
    props: {
      posts: await getAllPosts(),
    },
  };
}
