const esbuild = require("esbuild");
const fs = require("fs");

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
    legalComments: "none",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  })
  .then(() => {
    const filePath = "dist/script/main.js";
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(/^\s*\/\/.*$/gm, "");
    content = content.replace(/\/\*[\s\S]*?\*\//g, "");
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✅ Build réussi !");
  })
  .catch((error) => {
    console.error("❌ Erreur de build:", error);
    process.exit(1);
  });
