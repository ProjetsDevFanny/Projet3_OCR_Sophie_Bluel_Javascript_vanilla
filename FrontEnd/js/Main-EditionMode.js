// ************** Edition Mode **************************

document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js chargé");
  const token = localStorage.getItem("token");

  // Si le token est présent, on charge le JS en mode édition
  if (token) {
    console.log("Token détecté, chargement de HomePageEdit.js");
    const script = document.createElement("script");
    script.src = "../assets/js/HomePageEdit.js";

    // On attend que le script soit chargé et on appelle la fonction editPage
    script.onload = () => {
      console.log("HomePageEdit.js chargé");
      if (typeof editPage === "function") {
        editPage();
      } else {
        console.error("editPage n'est pas définie");
      }
    };

    document.body.appendChild(script);
  } else {
    console.log("Pas de token, mode normal");
  }
});
