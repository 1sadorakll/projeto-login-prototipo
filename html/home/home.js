// home.js

/**
 * Detecta o usuário autenticado e redireciona para a rota correta.
 * Usa location.origin para garantir caminhos absolutos seguros
 * em qualquer ambiente (localhost, GitHub Pages, hospedagem).
 */

document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log("[AUTH] Usuário não autenticado → redirecionando para login...");
            window.location.replace(`${location.origin}/projetoGamificaEduk/html/login/login.html`);
            return;
        }

        console.log("[AUTH] Usuário autenticado:", user.email);

        // Aqui está preparado para identificar o perfil no Firestore
        // e redirecionar conforme papel (role) do usuário.

        const db = firebase.firestore();

        db.collection("users").doc(user.uid).get()
            .then(doc => {
                if (!doc.exists) {
                    console.warn("[AUTH] Usuário logado, mas sem documento no Firestore.");
                    return;
                }

                const data = doc.data();
                const role = data.role || "player"; // padrão

                console.log(`[AUTH] Perfil detectado: ${role}`);

                switch (role) {
                    case "player":
                        // já está na home do player
                        break;

                    case "host":
                        window.location.replace(`${location.origin}/projetoGamificaEduk/html/host/home-host.html`);
                        break;

                    case "admin":
                        window.location.replace(`${location.origin}/projetoGamificaEduk/html/admin/dashboard.html`);
                        break;

                    default:
                        console.warn("[AUTH] Perfil desconhecido. Nenhum redirecionamento aplicado.");
                }
            })
            .catch(err => {
                console.error("[AUTH] Erro ao buscar perfil:", err);
            });
    });
});
