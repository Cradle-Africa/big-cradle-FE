'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    KuvarPay?: {
      init: (config: {
        apiKey: string;
        businessId: string;
        baseUrl: string;
      }) => void;
      openPayment: (
        opts: { sessionId: string },
        callbacks: {
          onSuccess: (sessionId: string) => void;
          onCancel: () => void;
          onError: (err: unknown) => void;
        }
      ) => void;
    };
  }
}

export function useKuvarPay() {
  const initRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const init = useCallback(() => {
    const key = process.env.NEXT_PUBLIC_KVP_CLIENT_KEY;
    const biz = process.env.NEXT_PUBLIC_KVP_BUSINESS_ID;
    if (!key || !biz || initRef.current) return false;
    if (typeof window !== 'undefined' && window.KuvarPay) {
      window.KuvarPay.init({
        apiKey: key,
        businessId: biz,
        baseUrl: 'https://pay.kuvarpay.com',
      });
      initRef.current = true;
      setIsReady(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.KuvarPay) {
      init();
    } else {
      const check = setInterval(() => {
        if (window.KuvarPay) {
          init();
          clearInterval(check);
        }
      }, 100);
      return () => clearInterval(check);
    }
  }, [init]);

  const openPayment = useCallback(
    (
      sessionId: string,
      callbacks: {
        onSuccess: (sessionId: string) => void;
        onCancel: () => void;
        onError: (err: unknown) => void;
      }
    ) => {
      if (window.KuvarPay) {
        window.KuvarPay.openPayment({ sessionId }, callbacks);
      } else {
        callbacks.onError(new Error('KuvarPay SDK not loaded'));
      }
    },
    []
  );

  return { init, openPayment, isReady };
}
