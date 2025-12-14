import { initWidget } from "./widget/manager";

console.log("📦 Script d'émargement lancé");

function waitForTable(): void {
  let tries = 0;
  const maxTries = 60;

  const interval = setInterval(() => {
    const rows = document.querySelectorAll<HTMLTableRowElement>("tbody tr");
    if (rows.length > 0) {
      console.log("✅ Tableau détecté après attente");
      clearInterval(interval);
      initWidget();
    } else {
      tries++;
      console.log(`⏳ Attente du tableau... (${tries}/${maxTries})`);
      if (tries >= maxTries) {
        console.log("❌ Tableau non détecté après délai");
        clearInterval(interval);
      }
    }
  }, 500);
}

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    console.log("⏳ DOM complet, démarrage de la boucle de détection");
    waitForTable();
  }
});
