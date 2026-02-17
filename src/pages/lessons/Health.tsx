import React from 'react';
import LessonList from './LessonList';

const Health: React.FC = () => {
  return (
    <LessonList
      module="health"
      title="Saúde"
      description="Aprenda sobre nutrição esportiva, preparação física, prevenção de lesões e cuidados com o corpo para maximizar seu desempenho."
    />
  );
};

export default Health;