/* =====================================================================
   DONNÉES DU PORTFOLIO — c'est le SEUL fichier à modifier au quotidien.
   Ajoute un projet, une certif ou une compétence ici : la page se met à
   jour toute seule.

   TEXTES BILINGUES : un texte peut s'écrire
     - soit simplement :     "Burp Suite"                  (même texte en FR et EN)
     - soit en deux langues : { fr: "Terminé", en: "Done" }
   ========================================================================= */

window.PORTFOLIO = {

  profil: {
    nom: "Stephen Akiyemi",
    age: 20,
    niveau: { fr: "L3 Sécurité Informatique", en: "3rd year, IT Security" },
    ecole: "ESGIS Bénin",
    ville: { fr: "Cotonou, Bénin", en: "Cotonou, Benin" },
    email: "akiyemistephen@gmail.com",
    telephone: "+229 01 52 81 23 83",
    whatsapp: "2290152812383",          // numéro sans espaces ni « + », pour le lien WhatsApp
    github: "https://github.com/akis01",
    instagram: "https://www.instagram.com/stephen.akis/",
    linkedin: "",          // colle ici l'URL de ton profil LinkedIn (laisse "" pour masquer le bouton)
    tryhackme: "",         // idem pour TryHackMe / Root-Me / HackTheBox
    cv: ""                 // chemin d'un CV PDF, ex. "cv/stephen-akiyemi-cv.pdf"
  },

  /* ---------- COMPÉTENCES ----------
     niveau : 1 = découverte, 2 = pratiqué, 3 = à l'aise                  */
  competences: [
    { groupe: { fr: "Pentest web", en: "Web pentesting" }, items: [
      { nom: "Burp Suite", niveau: 2 },
      { nom: { fr: "Injection SQL", en: "SQL injection" }, niveau: 2 },
      { nom: "XSS", niveau: 2 },
      { nom: "ffuf", niveau: 2 },
      { nom: "Gobuster", niveau: 2 }
    ]},
    { groupe: { fr: "Réseau & exploitation", en: "Network & exploitation" }, items: [
      { nom: "Nmap", niveau: 2 },
      { nom: "Wireshark", niveau: 2 },
      { nom: "Metasploit", niveau: 1 },
      { nom: "Linux (Kali)", niveau: 2 }
    ]},
    { groupe: { fr: "Web & automatisation", en: "Web & automation" }, items: [
      { nom: { fr: "Front-end (HTML, CSS, JS)", en: "Front-end (HTML, CSS, JS)" }, niveau: 3 },
      { nom: { fr: "Back-end (PHP)", en: "Back-end (PHP)" }, niveau: 2 },
      { nom: "Python", niveau: 1 },
      { nom: "n8n (workflows)", niveau: 2 },
      { nom: { fr: "Agents IA / Claude Code", en: "AI agents / Claude Code" }, niveau: 2 }
    ]}
  ],

  /* ---------- CERTIFICATIONS ----------
     verrouille: true  → s'affiche comme « succès à débloquer » (certif en préparation) */
  certifications: [
    {
      titre: { fr: "Introduction à la cybersécurité", en: "Introduction to Cybersecurity" },
      emetteur: "Cisco Networking Academy",
      date: { fr: "Mars 2026", en: "March 2026" },
      pdf: "certificats/cisco-introduction-cybersecurite.pdf",
      verifier: ""
    },
    {
      titre: "Claude Code in Action",
      emetteur: "Anthropic",
      date: { fr: "Mars 2026", en: "March 2026" },
      pdf: "certificats/anthropic-claude-code-in-action.pdf",
      verifier: "https://verify.skilljar.com/c/gj59n66xdjqr"
    },
    {
      titre: "AI Fluency: Framework & Foundations",
      emetteur: "Anthropic",
      date: { fr: "Mars 2026", en: "March 2026" },
      pdf: "certificats/anthropic-ai-fluency.pdf",
      verifier: ""
    },
    {
      titre: { fr: "Prochaine certification", en: "Next certification" },
      emetteur: { fr: "En préparation", en: "In progress" },
      verrouille: true
    }
  ],

  /* ---------- PROJETS ----------
     categorie : "cyber", "web" ou "ia"   (ce sont les onglets de la section Projets)
     statut    : "termine" ou "en-cours"
     Copie ce modèle pour ajouter un projet :
     {
       titre: { fr: "Scanner de ports en Python", en: "Python port scanner" },
       categorie: "cyber",
       statut: "en-cours",
       annee: "2026",
       resume: { fr: "Le problème, ce que tu as fait, le résultat.", en: "The problem, what you did, the result." },
       stack: ["Python", "socket", "Nmap"],
       liens: { code: "https://github.com/akis01/...", demo: "", rapport: "" }
     },
  */
  projets: [
  ],

  /* ---------- PARCOURS (formation) ----------
     Du plus ancien au plus récent. en_cours: true → niveau actuel.      */
  parcours: [
    { annee: "2023", titre: { fr: "Baccalauréat", en: "High school diploma (Baccalauréat)" },
      lieu: { fr: "Bénin", en: "Benin" },
      texte: { fr: "Diplôme obtenu, début de l'aventure informatique.", en: "Diploma obtained, the start of my IT journey." } },
    { annee: "2023 – 2024", titre: { fr: "Licence 1 · Systèmes Informatiques et Logiciels (SIL)", en: "1st year · Computer Systems & Software (SIL)" },
      lieu: "HECM",
      texte: { fr: "Bases de la programmation, de l'algorithmique et des systèmes.", en: "Programming, algorithms and systems fundamentals." } },
    { annee: "2024 – 2025", titre: { fr: "Licence 1 · Informatique, Réseaux et Télécoms (IRT)", en: "1st year · IT, Networks & Telecoms (IRT)" },
      lieu: "ESGIS Bénin",
      texte: { fr: "Réorientation vers les réseaux : TCP/IP, adressage, premiers pas en sécurité.", en: "Switched to networking: TCP/IP, addressing, first steps in security." } },
    { annee: "2025 – 2026", titre: { fr: "Licence 2 · Sécurité Informatique (SI)", en: "2nd year · IT Security (SI)" },
      lieu: "ESGIS Bénin",
      texte: { fr: "Pentest web, analyse réseau et premières certifications (Cisco, Anthropic).", en: "Web pentesting, network analysis and first certifications (Cisco, Anthropic)." } },
    { annee: "2026 – 2027", titre: { fr: "Licence 3 · Sécurité Informatique (SI)", en: "3rd year · IT Security (SI)" },
      lieu: "ESGIS Bénin", en_cours: true,
      texte: { fr: "Tests d'intrusion, sécurité des systèmes et projets pratiques.", en: "Penetration testing, systems security and hands-on projects." } }
  ],

  /* ---------- EXPÉRIENCES ---------- */
  experiences: [
    { periode: { fr: "2023 – aujourd'hui", en: "2023 – present" }, titre: { fr: "Création de sites web (front & back)", en: "Web development (front & back)" },
      lieu: "Freelance" },
    { periode: { fr: "2024 – aujourd'hui", en: "2024 – present" }, titre: { fr: "Automatisation & agents IA", en: "Automation & AI agents" },
      lieu: { fr: "Projets personnels", en: "Personal projects" } },
    { periode: "2024", titre: { fr: "Assistant virtuel (stage)", en: "Virtual assistant (internship)" },
      lieu: { fr: "Agence digitale", en: "Digital agency" } }
  ]
};
