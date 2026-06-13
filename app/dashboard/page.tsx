import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Your personalized developer dashboard for commands, snippets, notes, and resources.',
  robots: {
    index: false,
    follow: false,
  },
};

const DashboardPage = () => {
  return <h2>Main</h2>;
};

export default DashboardPage;
