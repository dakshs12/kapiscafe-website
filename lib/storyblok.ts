import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

storyblokInit({
  accessToken: "YOUR_STORYBLOK_ACCESS_TOKEN_PLACEHOLDER",
  use: [apiPlugin],
});
