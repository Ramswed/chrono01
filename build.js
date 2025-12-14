const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/script/main.ts"],
    bundle: true,
    outfile: "dist/script/main.js",
    format: "iife",
    target: "es2020",
    platform: "browser",
    sourcemap: false,
    minify: false,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  })
  .then(() => {
    console.log("✅ Build réussi !");
  })
  .catch((error) => {
    console.error("❌ Erreur de build:", error);
    process.exit(1);
  });
