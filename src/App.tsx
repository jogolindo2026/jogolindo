import { LandingPage } from './pages/LandingPage';

function App() {
  function handleEnter() {
    alert('Em breve: entrada na pelada');
  }

  function handleCreate() {
    alert('Em breve: criação da sua pelada');
  }

  return (
    <LandingPage
      onEnter={handleEnter}
      onCreate={handleCreate}
    />
  );
}

export default App;