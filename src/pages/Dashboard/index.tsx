import CMSAboutMe from './components/AboutMe';
import CMSExperiences from './components/Experiences';
import CMSSkills from './components/Skills';

const DashboardPage = () => {
  return (
    <section className='w-2xl py-2 space-y-8'>
      <CMSAboutMe />
      <CMSSkills />
      <CMSExperiences />
    </section>
  );
};

export default DashboardPage;
