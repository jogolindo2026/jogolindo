import React from 'react';
import LessonList from './LessonList';

const Techniques: React.FC = () => {
  return (
    <LessonList
      module="technique"
      title="Técnicas"
      description="Aprenda e aperfeiçoe os fundamentos técnicos do futebol: domínio, passe, finalização, drible e muito mais."
    />
  );
};

export default Techniques;