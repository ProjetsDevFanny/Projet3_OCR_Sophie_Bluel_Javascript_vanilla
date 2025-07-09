const loginForm = document.getElementById("login");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Récupération des données de l'utilisateur (on envoie une requête POST à l'API) (await = on attend la réponse de l'API)
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Si la requête est réussie, on affiche un message de succès et on redirige vers la page protégée
      if (response.status === 200) {
        const data = await response.json();
        console.log("Connexion réussie ✅");
        console.log("Token JWT :", data.token);

        // Stocke le token et l'id de l'utilisateur dans le localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // Redirection vers la page protégée
        window.location.href = "HomePage.html";

        // Affiche le message selon le type d'erreur retourné par l'API
      } else if (response.status === 401) {
        errorMessage.textContent = "Mot de passe incorrect";
      } else if (response.status === 404) {
        errorMessage.textContent = "Utilisateur non trouvé";
      } else {
        errorMessage.textContent = "Erreur inconnue";
      }
      // Si la requête échoue totalement (ex : backend éteint, coupure internet), on affiche une erreur dans la console et à l’écran.
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      errorMessage.textContent = "Impossible de se connecter au serveur";
    }
  });
}
