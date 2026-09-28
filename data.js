/* =====================================================================
   DONNÉES DU PORTFOLIO — c'est le SEUL fichier à modifier au quotidien.
   Ajoute un projet, une certif ou une compétence ici : la page se met à
   jour toute seule. Respecte les virgules entre les éléments { ... },
   ========================================================================= */

window.PORTFOLIO = {

  profil: {
    nom: "Stephen Akiyemi",
    age: 20,
    niveau: "L3 Cybersécurité",
    ecole: "ESGIS Bénin",
    ville: "Cotonou, Bénin",
    statut: "Recherche de stage en cybersécurité",   // ou "Disponible pour une alternance", etc.
    email: "akiyemistephen@gmail.com",
    github: "https://github.com/akis01",
    linkedin: "",          // colle ici l'URL de ton profil LinkedIn (laisse "" pour masquer le bouton)
    tryhackme: "",         // idem pour TryHackMe / Root-Me / HackTheBox
    cv: ""                 // chemin d'un CV PDF, ex. "cv/stephen-akiyemi-cv.pdf"
  },

  /* ---------- COMPÉTENCES ----------
     niveau : 1 = découverte, 2 = pratiqué en lab, 3 = à l'aise          */
  competences: [
    { groupe: "Pentest web", items: [
      { nom: "Burp Suite", niveau: 2 },
      { nom: "Injection SQL", niveau: 2 },
      { nom: "XSS", niveau: 2 },
      { nom: "ffuf", niveau: 2 },
      { nom: "Gobuster", niveau: 2 }
    ]},
    { groupe: "Réseau & exploitation", items: [
      { nom: "Nmap", niveau: 2 },
      { nom: "Wireshark", niveau: 2 },
      { nom: "Metasploit", niveau: 1 },
      { nom: "Linux (Kali)", niveau: 2 }
    ]},
    { groupe: "Dev & automatisation", items: [
      { nom: "HTML / CSS / JS", niveau: 3 },
      { nom: "PHP", niveau: 2 },
      { nom: "Python", niveau: 1 },
      { nom: "n8n (workflows)", niveau: 2 },
      { nom: "Agents IA / Claude Code", niveau: 2 }
    ]}
  ],

  /* ---------- CERTIFICATIONS ----------
     verrouille: true  → s'affiche comme « succès à débloquer » (certif en préparation) */
  certifications: [
    {
      titre: "Introduction à la cybersécurité",
      emetteur: "Cisco Networking Academy",
      date: "Mars 2026",
      pdf: "certificats/cisco-introduction-cybersecurite.pdf",
      verifier: ""
    },
    {
      titre: "Claude Code in Action",
      emetteur: "Anthropic",
      date: "Mars 2026",
      pdf: "certificats/anthropic-claude-code-in-action.pdf",
      verifier: "https://verify.skilljar.com/c/gj59n66xdjqr"
    },
    {
      titre: "AI Fluency: Framework & Foundations",
      emetteur: "Anthropic",
      date: "Mars 2026",
      pdf: "certificats/anthropic-ai-fluency.pdf",
      verifier: ""
    },
    {
      titre: "Prochaine certification",
      emetteur: "En préparation",
      verrouille: true
    }
  ],

  /* ---------- PROJETS ----------
     categorie : "cyber", "web" ou "ia"   (ce sont les onglets de la section Projets)
     statut    : "termine" ou "en-cours"
     Copie ce modèle pour ajouter un projet :
     {
       titre: "Scanner de ports en Python",
       categorie: "cyber",
       statut: "en-cours",
       annee: "2026",
       resume: "Une ou deux phrases : le problème, ce que tu as fait, le résultat.",
       stack: ["Python", "socket", "Nmap"],
       liens: { code: "https://github.com/akis01/...", demo: "", rapport: "" }
     },
  */
  projets: [
  ],

  /* ---------- PARCOURS ---------- */
  parcours: [
    { periode: "2025 – aujourd'hui", titre: "Licence 3 Cybersécurité", lieu: "ESGIS Bénin",
      texte: "Sécurité des réseaux, tests d'intrusion, cryptographie et administration système." },
    { periode: "2024 – aujourd'hui", titre: "Automatisation & agents IA", lieu: "Projets personnels",
      texte: "Workflows n8n et agents IA pour automatiser des tâches répétitives." },
    { periode: "2024", titre: "Assistant virtuel (stage)", lieu: "Agence digitale",
      texte: "Gestion de projets digitaux, communication client et optimisation des processus." },
    { periode: "2023 – aujourd'hui", titre: "Création de sites web", lieu: "Freelance",
      texte: "Sites vitrines optimisés pour le référencement, du design à la mise en ligne." },
    { periode: "2023 – 2025", titre: "Licence Informatique (L1 – L2)", lieu: "ESGIS Bénin",
      texte: "Bases de la programmation, des bases de données et des réseaux." }
  ]
};
