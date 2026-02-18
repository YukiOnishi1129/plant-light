"use client";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

interface RakutenLinkProps {
  url: string;
  productId?: number;
  source?: string;
  children: React.ReactNode;
  className?: string;
}

export function RakutenLink({
  url,
  productId,
  source,
  children,
  className,
}: RakutenLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "rakuten_click", {
        product_id: productId,
        ...(source ? { source } : {}),
      });
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
