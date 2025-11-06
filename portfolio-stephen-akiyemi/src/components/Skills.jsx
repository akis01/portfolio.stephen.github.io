import React from 'react';

const Skills = () => {
    const skills = [
        'PHP',
        'HTML',
        'CSS',
        'Python',
        'JavaScript',
        'Création d\'agents IA',
        'SEO'
    ];

    return (
        <section id="skills">
            <h2>Compétences</h2>
            <ul>
                {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </section>
    );
};

export default Skills;