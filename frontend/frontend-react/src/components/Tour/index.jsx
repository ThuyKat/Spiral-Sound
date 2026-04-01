import { Joyride } from 'react-joyride';
import styles from './tooltip.module.css';

const steps = [
  {
    target: '#top-banner',
    content: 'Welcome to Spiral Sound! This is your main navigation bar.',
    placement: 'bottom',
    skipBeacon: true,
  },
  {
    target: '#cart-icon',
    content: 'Your cart lives here. Click it anytime to review your items.',
    placement: 'bottom',
    skipBeacon: true,
  },
  {
    target: '#genre-filter',
    content: 'Filter beats and samples by genre to find exactly what you need.',
    placement: 'bottom',
    skipBeacon: true,
  },
  {
    target: '.product-list',
    content: 'Browse the catalog and add anything you like to your cart.',
    placement: 'top',
    skipBeacon: true,
  },
];

function CustomTooltip({
  step,
  backProps,
  primaryProps,
  closeProps,
  index,
  size,
}) {
  return (
    <div className={styles.tooltip}>
      <div className={styles.header}>
        <span className={styles.progress}>
          {index + 1} / {size}
        </span>
        <button className={styles.close} {...closeProps}>
          ✕
        </button>
      </div>
      <p className={styles.content}>{step.content}</p>
      <div className={styles.footer}>
        {index > 0 && (
          <button className={styles.btnBack} {...backProps}>
            Back
          </button>
        )}
        <button className={styles.btnNext} {...primaryProps}>
          {index === size - 1 ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default function Tour() {
  return (
    <Joyride
      run
      continuous
      steps={steps}
      tooltipComponent={CustomTooltip}
      styles={{
        options: { zIndex: 10000 },
      }}
    />
  );
}
