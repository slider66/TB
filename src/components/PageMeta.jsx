import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSeoForPath } from '../lib/seoConfig';

const PageMeta = () => {
  const location = useLocation();
  const { pathname } = location;

  const seo = getSeoForPath(pathname);

  if (seo?.disabled) {
    return null;
  }

  return (
    <Helmet prioritizeSeoTags>
      {seo?.title && <title>{seo.title}</title>}
      {seo?.description && <meta name="description" content={seo.description} />}
      {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo?.robots && <meta name="robots" content={seo.robots} />}

      {seo?.title && <meta property="og:title" content={seo.title} />}
      {seo?.description && <meta property="og:description" content={seo.description} />}
      {seo?.canonical && <meta property="og:url" content={seo.canonical} />}
      {seo?.ogImage && <meta property="og:image" content={seo.ogImage} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {seo?.ogType && <meta property="og:type" content={seo.ogType} />}
      {seo?.siteName && <meta property="og:site_name" content={seo.siteName} />}

      {seo?.twitterCard && <meta name="twitter:card" content={seo.twitterCard} />}
      {seo?.title && <meta name="twitter:title" content={seo.title} />}
      {seo?.description && <meta name="twitter:description" content={seo.description} />}
      {seo?.ogImage && <meta name="twitter:image" content={seo.ogImage} />}

      {Array.isArray(seo?.extraMeta) &&
        seo.extraMeta.map(({ name, property, content }, index) => {
          if (!content) return null;
          if (!name && !property) return null;
          const key = name ? `meta-name-${name}-${index}` : `meta-property-${property}-${index}`;
          return name ? (
            <meta key={key} name={name} content={content} />
          ) : (
            <meta key={key} property={property} content={content} />
          );
        })}
    </Helmet>
  );
};

export default PageMeta;
