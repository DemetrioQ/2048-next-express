import OAuthFailure from "./OauthFailure";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
 return <OAuthFailure />
}
