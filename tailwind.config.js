import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
        contrast: 'rgb(var(--color-contrast) / <alpha-value>)',
        notice: 'rgb(var(--color-accent) / <alpha-value>)',
        shopPay: 'rgb(var(--color-shop-pay) / <alpha-value>)',
        alert: 'rgb(var(--color-alert) / <alpha-value>)',
        silver: 'rgb(var(--color-silver) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        'sm-max': {max: '48em'},
        'md-max': {max: '64em'},
        'lg-max': {max: '80em'},
        'sm-only': {min: '32em', max: '48em'},
        'md-only': {min: '48em', max: '64em'},
        'lg-only': {min: '64em', max: '80em'},
        'xl-only': {min: '80em', max: '96em'},
        '2xl-only': {min: '96em'},
      },
      spacing: {
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)',
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav':
          'calc(var(--screen-height, 100vh) - var(--height-nav))',
        'screen-dynamic': 'var(--screen-height-dynamic, 100vh)',
      },
      width: {
        mobileGallery: 'calc(100vw - 3rem)',
      },
      fontFamily: {
        sans: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // serif: ['Open Sans', 'Palatino', 'ui-serif'],
        // sans: ['AGaramondPro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['AGaramondPro', 'Palatino', 'ui-serif'],
      },
      fontSize: {
        display: ['var(--font-size-display)', '1.1'],
        heading: ['var(--font-size-heading)', '1.25'],
        'heading-1': ['var(--font-size-heading-1)', '1.25'],
        'heading-2': ['var(--font-size-heading-2)', '1.25'],
        'heading-3': ['var(--font-size-heading-3)', '1.25'],
        'heading-4': ['var(--font-size-heading-4)', '1.25'],
        'heading-5': ['var(--font-size-heading-5)', '1.25'],
        'heading-6': ['var(--font-size-heading-6)', '1.25'],
        'copy-1': ['var(--font-size-copy-1)', '1.5'],
        'copy-2': ['var(--font-size-copy-2)', '1.5'],
        'copy-3': ['var(--font-size-copy-3)', '1.5'],
        lead: ['var(--font-size-lead)', '1.333'],
        copy: ['var(--font-size-copy)', '1.5'],
        fine: ['var(--font-size-fine)', '1.333'],
        small: ['var(--font-size-small)', '1'],
        cart: ['var(--font-size-cart)', '1'],
      },
      maxWidth: {
        'prose-narrow': '45ch',
        'prose-wide': '80ch',
      },
      boxShadow: {
        border: 'inset 0px 0px 0px 1px rgb(var(--color-primary) / 0.08)',
        darkHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.4)',
        lightHeader: 'inset 0px -1px 0px 0px rgba(21, 21, 21, 0.05)',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        99: '99',
        99999: '99999',
        negative: '-1',
      },
    },
  },
  safelist: [
    'bg-black-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-magenta-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
  ],
  plugins: [formsPlugin, typographyPlugin],
};
