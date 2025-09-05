import CMSAboutMe from './components/AboutMe';
import CMSSkills from './components/Skills';

const DashboardPage = () => {
  return (
    <section className='w-2xl py-2 space-y-8'>
      <CMSAboutMe />
      <CMSSkills />
    </section>
  );
};

export default DashboardPage;
