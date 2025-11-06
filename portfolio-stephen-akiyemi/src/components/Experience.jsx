import React from 'react';

const Experience = () => {
    return (
        <section id="experience">
            <h2>Expériences Professionnelles</h2>
            <div className="experience-item">
                <h3>Assistant Virtuel (Stage)</h3>
                <p><strong>Entreprise :</strong> Nom de l'entreprise</p>
                <p><strong>Durée :</strong> Mois Année - Mois Année</p>
                <p>
                    Description des responsabilités et des tâches effectuées pendant le stage, 
                    mettant en avant les compétences développées et les projets réalisés.
                </p>
            </div>
            {/* Ajoutez d'autres expériences professionnelles ici */}
        </section>
    );
};

export default Experience;