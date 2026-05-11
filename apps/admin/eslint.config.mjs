import coreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...coreWebVitals,
  {
    rules: {
      // Prohibits the widely-used fetch-in-useEffect pattern — too strict for this project
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
