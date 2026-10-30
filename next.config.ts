import createNextIntlPlugin from "next-intl/plugin";
export default createNextIntlPlugin("./src/lib/i18n/request.ts")({
  // Supplied instructions must remain byte-identical.
  agentRules: false,
  pageExtensions:
    process.env.NODE_ENV === "production"
      ? ["ts", "tsx"]
      : ["ts", "tsx", "dev.tsx"],
});
