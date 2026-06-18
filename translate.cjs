const fs = require('fs');
const keys = {
    "profile.classRecruit": ["Recluta Novato ??", "Rookie Recruit ??", "Recruta Novato ??", "Recrue Novice ??", "Recluta Novellino ??", "Rekrut Anfänger ??"],
    "profile.classAspirant": ["Aspirante Activo ?", "Active Aspirant ?", "Aspirante Ativo ?", "Aspirant Actif ?", "Aspirante Attivo ?", "Aktiver Anwärter ?"],
    "profile.classWarrior": ["Guerrero del Fitness ??????", "Fitness Warrior ??????", "Guerreiro Fitness ??????", "Guerrier Fitness ??????", "Guerriero Fitness ??????", "Fitness Krieger ??????"],
    "profile.classMaster": ["Maestro del Match ??", "Match Master ??", "Mestre da Partida ??", "Maître du Match ??", "Maestro del Match ??", "Match-Meister ??"],
    "profile.classLegend": ["Leyenda de Caracas ??", "Caracas Legend ??", "Lenda de Caracas ??", "Légende de Caracas ??", "Leggenda di Caracas ??", "Legende von Caracas ??"],
    "profile.rarityNovice": ["Novato", "Novice", "Novato", "Novice", "Novellino", "Anfänger"],
    "profile.rarityCommon": ["Común", "Common", "Comum", "Commun", "Comune", "Gewöhnlich"],
    "profile.rarityRare": ["Raro", "Rare", "Raro", "Rare", "Raro", "Selten"],
    "profile.rarityEpic": ["Épico", "Epic", "Épico", "Épique", "Epico", "Episch"],
    "profile.rarityLegendary": ["Legendario", "Legendary", "Lendário", "Légendaire", "Leggendario", "Legendär"],
    "profile.achievementsListTitle": ["Lista de Logros y Trofeos", "Achievements and Trophies", "Lista de Conquistas", "Liste des Succès", "Lista degli Obiettivi", "Erfolgsliste"],
    "profile.active": ["Activos", "Active", "Ativos", "Actifs", "Attivi", "Aktiv"],
    "profile.adventureLog": ["Registro de Aventuras (XP Log)", "Adventure Log (XP Log)", "Diário de Aventuras (XP Log)", "Journal d'Aventure (XP Log)", "Diario delle Avventure (XP Log)", "Abenteuer-Logbuch (XP Log)"],
    "profile.bronze": ["Bronce ??", "Bronze ??", "Bronze ??", "Bronze ??", "Bronzo ??", "Bronze ??"],
    "profile.code": ["Código:", "Code:", "Código:", "Code :", "Codice:", "Code:"],
    "profile.createFreeAccount": ["Crear Cuenta Gratis", "Create Free Account", "Criar Conta Grátis", "Créer un Compte Gratuit", "Crea Account Gratuito", "Kostenloses Konto erstellen"],
    "profile.emptyChest": ["Cofre Vacío", "Empty Chest", "Baú Vazio", "Coffre Vide", "Forziere Vuoto", "Leere Truhe"],
    "profile.emptyChestDesc": ["No tienes cupones. ¡Organiza eventos (+25 XP), únete a partidos (+15 XP) o usa la app diariamente para ganar cofres sorpresa!", "You have no coupons. Organize events (+25 XP), join matches (+15 XP) or use the app daily to earn surprise chests!", "Você não tem cupons. Organize eventos (+25 XP) ou participe de partidas (+15 XP) para ganhar baús!", "Vous n'avez pas de coupons. Organisez des événements (+25 XP) ou rejoignez des matchs (+15 XP) pour gagner des coffres !", "Non hai coupon. Organizza eventi (+25 XP) o unisciti a partite (+15 XP) per guadagnare forzieri!", "Sie haben keine Gutscheine. Organisieren Sie Events (+25 XP) oder nehmen Sie an Spielen teil (+15 XP), um Truhen zu verdienen!"],
    "profile.epicItem": ["Objeto Épico ??", "Epic Item ??", "Item Épico ??", "Objet Épique ??", "Oggetto Epico ??", "Epischer Gegenstand ??"],
    "profile.eventsPerMonth": ["Eventos/mes", "Events/month", "Eventos/mês", "Événements/mois", "Eventi/mese", "Events/Monat"],
    "profile.gold": ["Oro ??", "Gold ??", "Ouro ??", "Or ??", "Oro ??", "Gold ??"],
    "profile.guestDesc": ["Explora la app libremente. Crea tu cuenta para desbloquear todo.", "Explore the app freely. Create your account to unlock everything.", "Explore livremente. Crie uma conta para desbloquear tudo.", "Explorez librement. Créez un compte pour tout débloquer.", "Esplora liberamente. Crea un account per sbloccare tutto.", "Frei erkunden. Konto erstellen, um alles freizuschalten."],
    "profile.guestDisclaimer": ["Tu cuenta es 100% gratuita. Puedes explorar el mapa, ver eventos y canchas sin necesidad de registrarte.", "Your account is 100% free. You can explore the map, see events and courts without registering.", "Sua conta é 100% grátis.", "Votre compte est 100% gratuit.", "Il tuo account è gratuito al 100%.", "Ihr Konto ist 100% kostenlos."],
    "profile.guestTitle": ["Perfil de Invitado", "Guest Profile", "Perfil de Visitante", "Profil Invité", "Profilo Ospite", "Gastprofil"],
    "profile.itemClaimed": ["¡Objeto Canjeado! ??", "Item Claimed! ??", "Item Resgatado! ??", "Objet Réclamé ! ??", "Oggetto Riscattato! ??", "Gegenstand beansprucht! ??"],
    "profile.itemClaimedDesc": ["El beneficio de **{discount}** ha sido activado con éxito para tu próxima reserva de cancha o partido.", "The **{discount}** benefit has been successfully activated for your next court or match reservation.", "O benefício **{discount}** foi ativado.", "L'avantage **{discount}** a été activé.", "Il vantaggio **{discount}** è stato attivato.", "Der Vorteil **{discount}** wurde aktiviert."],
    "profile.joinCommunity": ["Únete a la comunidad", "Join the community", "Junte-se à comunidade", "Rejoignez la communauté", "Unisciti alla comunità", "Tritt der Community bei"],
    "profile.joinDesc": ["Accede a todo TeamMatch gratis", "Access all TeamMatch for free", "Acesse tudo grátis", "Accédez à tout gratuitement", "Accedi a tutto gratis", "Kostenloser Zugriff auf alles"],
    "profile.legendaryItem": ["Objeto Legendario ??", "Legendary Item ??", "Item Lendário ??", "Objet Légendaire ??", "Oggetto Leggendario ??", "Legendärer Gegenstand ??"],
    "profile.locked": ["Bloqueado", "Locked", "Bloqueado", "Verrouillé", "Bloccato", "Gesperrt"],
    "profile.loginExisting": ["Ya tengo cuenta - Iniciar Sesión", "I already have an account - Log In", "Já tenho conta - Entrar", "J'ai déjà un compte - Connexion", "Ho già un account - Accedi", "Ich habe bereits ein Konto - Anmelden"],
    "profile.magicChest": ["Cofre de Objetos Mágicos", "Magic Item Chest", "Baú Mágico", "Coffre Magique", "Forziere Magico", "Magische Truhe"],
    "profile.noXp": ["Aún no has ganado experiencia. ¡Explora el mapa y únete a un partido!", "You haven't earned any experience yet. Explore the map and join a match!", "Sem experiência ainda.", "Pas encore d'expérience.", "Ancora nessuna esperienza.", "Noch keine Erfahrung."],
    "profile.platinum": ["Platino ??", "Platinum ??", "Platina ??", "Platine ??", "Platino ??", "Platin ??"],
    "profile.players": ["Jugadores", "Players", "Jogadores", "Joueurs", "Giocatori", "Spieler"],
    "profile.rating": ["Rating", "Rating", "Avaliação", "Évaluation", "Valutazione", "Bewertung"],
    "profile.silver": ["Plata ??", "Silver ??", "Prata ??", "Argent ??", "Argento ??", "Silber ??"],
    "profile.unlocked": ["Obtenido", "Unlocked", "Desbloqueado", "Débloqué", "Sbloccato", "Freigeschaltet"],
    "profile.xpForNextLevel": ["+{xp} XP para Nivel {level}", "+{xp} XP for Level {level}", "+{xp} XP para Nível {level}", "+{xp} XP pour le Niveau {level}", "+{xp} XP per il Livello {level}", "+{xp} XP für Level {level}"],
    "canchas.location": ["Ubicación", "Location", "Localização", "Emplacement", "Posizione", "Ort"],
    "canchas.locationSelected": ["Ubicación seleccionada", "Location selected", "Localização selecionada", "Emplacement sélectionné", "Posizione selezionata", "Ort ausgewählt"],
    "createEvent.intensity.principiante": ["Principiante", "Beginner", "Iniciante", "Débutant", "Principiante", "Anfänger"],
    "createEvent.intensity.intermedio": ["Intermedio", "Intermediate", "Intermediário", "Intermédiaire", "Intermedio", "Mittelstufe"],
    "createEvent.intensity.pro": ["Pro", "Pro", "Pró", "Pro", "Pro", "Profi"]
};

let content = fs.readFileSync('src/lib/SettingsContext.tsx', 'utf8');

function injectTranslations(langCode, arrayIndex, marker, startFromLine = 0) {
    const lines = content.split('\n');
    let idx = lines.findIndex((l, index) => index >= startFromLine && l.includes(marker));
    if (idx !== -1) {
        let toInsert = [];
        for (let k in keys) {
            toInsert.push(`    "${k}": "${keys[k][arrayIndex]}",`);
        }
        lines.splice(idx + 1, 0, ...toInsert);
        content = lines.join('\n');
        return idx + toInsert.length; // return new index to start searching for next block
    }
    return startFromLine;
}

// Ensure correct block targeting using line numbers
// es is around line 80
injectTranslations('es', 0, '"profile.campaignDesc":', 0);
// en is around line 500
injectTranslations('en', 1, '"profile.campaignDesc":', 300);
// pt is around line 1000
injectTranslations('pt', 2, '"profile.editProfile": "Editar Perfil"', 900);
// fr is around line 1050
injectTranslations('fr', 3, '"profile.editProfile": "Modifier le Profil"', 900);
// it is around line 1100
injectTranslations('it', 4, '"profile.editProfile": "Modifica Profilo"', 900);
// de is around line 1150
injectTranslations('de', 5, '"profile.editProfile": "Profil Bearbeiten"', 900);

fs.writeFileSync('src/lib/SettingsContext.tsx', content);
console.log('Translations successfully injected for all languages!');
