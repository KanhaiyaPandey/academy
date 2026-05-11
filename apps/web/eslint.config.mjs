import coreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...coreWebVitals,
  {
    rules: {
      // Pre-existing unescaped ' and " in JSX text — display-only, no functionality impact
      "react/no-unescaped-entities": "off",
    },
  },
];
