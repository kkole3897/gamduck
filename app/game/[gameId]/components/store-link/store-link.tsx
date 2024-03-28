import Link from 'next/link';
import { RiSteamFill } from '@remixicon/react';

import * as styles from './store-link.css';
import type { PriceInfo, GameStore } from '@/app/types';
import { usePriceInfo } from './hooks/use-price-info';

interface Props {
  store: GameStore;
  href: string;
  price?: PriceInfo | undefined;
}

const storeIconMap: { [key in GameStore]: React.ReactNode } = {
  steam: <RiSteamFill />,
};

export default function StoreLink(props: Props) {
  const { href, store, price } = props;
  const { initalPrice, finalPrice, isDiscounted, isLowest } = usePriceInfo(
    price ?? { regular: 0, current: 0, lowest: 0 }
  );

  if (!price) {
    return (
      <Link href={href} target="_blank" className={styles.storeLink}>
        <div>{storeIconMap[store]}</div>
        <div className={styles.priceArea}>
          <span className={styles.priceNa}>N/A</span>
        </div>
      </Link>
    );
  }
  const { lowest = 0, regular = 0, current = 0 } = price ?? {};

  const initialPriceText = `${initalPrice.toLocaleString()}원`;
  const lowestPriceText = `${lowest.toLocaleString()}원`;
  const finalPriceText = `${finalPrice.toLocaleString()}원`;
  const discountPercent = Math.round(((regular - current) / regular) * 100);

  return (
    <Link href={href} target="_blank" className={styles.storeLink}>
      <div>{storeIconMap[store]}</div>
      <div className={styles.priceArea}>
        {isDiscounted && (
          <div className={styles.initialPriceArea}>
            <span className={styles.discountPercent}>{discountPercent}%</span>
            <span className={styles.initialPrice}>{initialPriceText}</span>
          </div>
        )}
        <div className={styles.finalPriceArea}>
          {isLowest && <span className={styles.lowestBadge}>최저</span>}
          <span className={styles.finalPrice}>{finalPriceText}</span>
        </div>
        {!isLowest && (
          <div className={styles.lowestPriceArea}>
            <span>
              스토어 최저가:{' '}
              <span className={styles.lowestPrice}>{lowestPriceText}</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
