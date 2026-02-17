import React from 'react';
import LessonList from './LessonList';

const Citizenship: React.FC = () => {
  return (
    <LessonList
      module="citizenship"
      title="Cidadania"
      description="Desenvolva valores éticos, fair play e trabalho em equipe através do futebol. Aprenda como o esporte pode contribuir para uma sociedade melhor."
    />
  );
};

export default Citizenship;