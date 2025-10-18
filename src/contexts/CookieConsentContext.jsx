import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CONSENT_COOKIE_NAME = 'tb_cookie_consent';
const CONSENT_VERSION = '2025-01-01';
const CONSENT_MAX_AGE_DAYS = 730; // 24 months

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: false,
  functional: false,
};

const CookieConsentContext = createContext(undefined);

const getCookieValue = (name) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) {
    return null;
  }

  const [, value] = match.split('=');

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (error) {
    console.error('Invalid cookie consent value', error);
    return null;
  }
};

const setCookieValue = (name, value) => {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAgeSeconds = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  const encodedValue = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${name}=${encodedValue};path=/;max-age=${maxAgeSeconds};SameSite=Lax`;
};

const removeCookie = (name) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
};

const isExpired = (entry) => {
  if (!entry?.updatedAt) {
    return true;
  }

  const updatedAt = new Date(entry.updatedAt);
  if (Number.isNaN(updatedAt.getTime())) {
    return true;
  }

  const ageInDays = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays > CONSENT_MAX_AGE_DAYS;
};

export const CookieConsentProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [consentMeta, setConsentMeta] = useState(null);
  const [isBannerVisible, setBannerVisible] = useState(false);
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const storedConsent = getCookieValue(CONSENT_COOKIE_NAME);

    if (
      !storedConsent ||
      storedConsent.version !== CONSENT_VERSION ||
      isExpired(storedConsent)
    ) {
      if (storedConsent && storedConsent.version !== CONSENT_VERSION) {
        removeCookie(CONSENT_COOKIE_NAME);
      }
      setBannerVisible(true);
      return;
    }

    const storedPreferences = {
      ...DEFAULT_PREFERENCES,
      ...storedConsent.preferences,
      necessary: true,
    };

    setPreferences(storedPreferences);
    setConsentMeta(storedConsent);
  }, []);

  const persistConsent = useCallback((nextPreferences) => {
    const payload = {
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...nextPreferences,
        necessary: true,
      },
    };

    setPreferences(payload.preferences);
    setConsentMeta({
      version: payload.version,
      updatedAt: payload.updatedAt,
    });
    setCookieValue(CONSENT_COOKIE_NAME, payload);
  }, []);

  const hideBanner = useCallback(() => setBannerVisible(false), []);
  const showBanner = useCallback(() => setBannerVisible(true), []);
  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const acceptAll = useCallback(() => {
    persistConsent({
      analytics: true,
      functional: true,
    });
    setBannerVisible(false);
    setPreferencesOpen(false);
  }, [persistConsent]);

  const rejectAll = useCallback(() => {
    persistConsent({
      analytics: false,
      functional: false,
    });
    setBannerVisible(false);
    setPreferencesOpen(false);
  }, [persistConsent]);

  const savePreferences = useCallback(
    (nextPreferences) => {
      persistConsent(nextPreferences);
      setBannerVisible(false);
      setPreferencesOpen(false);
    },
    [persistConsent],
  );

  const value = useMemo(
    () => ({
      preferences,
      consentMeta,
      isBannerVisible,
      isPreferencesOpen,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
      showBanner,
      hideBanner,
      hasConsentFor: (category) => Boolean(preferences[category]),
    }),
    [
      preferences,
      consentMeta,
      isBannerVisible,
      isPreferencesOpen,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
      showBanner,
      hideBanner,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
