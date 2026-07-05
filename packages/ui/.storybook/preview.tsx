import '../dist/styles.css';

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div data-theme="light" style={{ padding: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
