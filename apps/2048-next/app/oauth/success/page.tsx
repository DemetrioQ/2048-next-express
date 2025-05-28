export const metadata = {
  robots: {
    index: false,  // prevent indexing
    follow: false, // prevent following links on this page
  },
};

import OAuthSuccess from './OAuthSuccess';

export default function Page() {
  return <OAuthSuccess />;
}
