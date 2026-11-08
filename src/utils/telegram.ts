/**
 * Telegram Mini App WebApp helper utility
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          start_param?: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string) => void;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (fn: () => void) => void;
        };
      };
    };
  }
}

export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
};

export const initTelegramApp = () => {
  if (typeof window === 'undefined') return null;
  const webApp = window.Telegram?.WebApp;
  if (webApp) {
    webApp.ready();
    try {
      webApp.expand();
    } catch {
      // ignore
    }
    return webApp;
  }
  return null;
};

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
  if (typeof window === 'undefined') return;
  const haptic = window.Telegram?.WebApp?.HapticFeedback;
  if (haptic) {
    if (type === 'success') {
      haptic.notificationOccurred('success');
    } else {
      haptic.impactOccurred(type);
    }
  }
};

export const sendTelegramInquiry = (inquiry: {
  listingId: string;
  title: string;
  price: string;
  type: string;
  location: string;
  buyerName?: string;
  buyerPhone?: string;
  telegramUsername?: string;
}) => {
  triggerHaptic('success');
  const webApp = window.Telegram?.WebApp;
  
  const payload = {
    action: 'inquiry',
    ...inquiry,
    timestamp: new Date().toISOString(),
  };

  const payloadString = JSON.stringify(payload);

  // If inside Telegram Mini App with sendData capability
  if (webApp && webApp.sendData) {
    try {
      webApp.sendData(payloadString);
      return { method: 'webapp_senddata', success: true };
    } catch {
      // Fallback to link if sendData is only allowed for keyboard button webapps
    }
  }

  // Fallback to Telegram Bot or Agent direct chat link
  const botUsername = inquiry.telegramUsername || 'nur_marketplace_bot';
  const cleanUsername = botUsername.replace('@', '');
  const encodedText = encodeURIComponent(
    `ሰላም! ስለ "${inquiry.title}" (ዋጋ: ${inquiry.price} - ቦታ: ${inquiry.location}) መረጃ መጠየቅ ፈልጌ ነበር።`
  );

  const telegramUrl = `https://t.me/${cleanUsername}?text=${encodedText}`;

  if (webApp && webApp.openTelegramLink) {
    webApp.openTelegramLink(telegramUrl);
  } else {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  }

  return { method: 'direct_link', success: true };
};
