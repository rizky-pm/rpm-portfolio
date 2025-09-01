import { TypographyH1, TypographyH2 } from './components/ui/typography';

const FULL_NAME = 'RIZKY PUTRA MAHENDRA';

function App() {
  return (
    <section className='w-6xl p-16 flex flex-col gap-24'>
      <div className='flex flex-col gap-8'>
        <div className='flex justify-between'>
          <div className='w-80 h-96 bg-red-200' />

          <ul className='text-right'>
            <li>About Me</li>
            <li>Skills</li>
            <li>Experiences</li>
            <li>Projects</li>
            <li>Educations</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className='flex flex-col'>
          <TypographyH1 className='text-left text-6xl tracking-wider font-normal'>
            {FULL_NAME}
          </TypographyH1>
        </div>
      </div>

      <div className='flex flex-col items-end'>
        <TypographyH2 className='font-normal uppercase tracking-wide'>
          Front End Developer
        </TypographyH2>
        <p className='w-2/4 text-right'>
          Frontend Developer with 3+ years of experience building
          high-performance, scalable, and user-friendly web applications.
          Skilled in UI optimization, seamless API integration, and performance
          enhancement. Experienced in full-stack development through personal
          projects, focusing on secure data handling and PWA-enabled apps.
          Collaborative team player, working closely with backend engineers, QA,
          and stakeholders to deliver solutions aligned with business goals.
          Passionate about continuous learning and creating impactful digital
          products.
        </p>
      </div>

      <div className='flex flex-col'>
        <TypographyH2 className='font-normal uppercase tracking-wide'>
          Skills
        </TypographyH2>
        <p className='w-2/4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo eum
          atque eius, omnis dolorum commodi pariatur incidunt beatae nisi rerum
          optio, aperiam blanditiis placeat veniam obcaecati explicabo odio quos
          consectetur.
        </p>
      </div>

      <div className='flex flex-col items-end'>
        <TypographyH2 className='font-normal uppercase tracking-wide'>
          Experiences
        </TypographyH2>
        <p className='w-2/4 text-right'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed animi,
          provident, recusandae voluptatibus velit numquam sapiente
          reprehenderit ipsa inventore unde laborum quibusdam quas totam amet in
          accusantium veritatis consectetur quae.
        </p>
      </div>

      <div className='flex flex-col'>
        <TypographyH2 className='font-normal uppercase tracking-wide'>
          Personal Projects
        </TypographyH2>
        <p className='w-2/4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo eum
          atque eius, omnis dolorum commodi pariatur incidunt beatae nisi rerum
          optio, aperiam blanditiis placeat veniam obcaecati explicabo odio quos
          consectetur.
        </p>
      </div>

      <div className='flex flex-col items-end'>
        <TypographyH2 className='font-normal uppercase tracking-wide'>
          Contact
        </TypographyH2>
        <p className='w-2/4 text-right'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed animi,
          provident, recusandae voluptatibus velit numquam sapiente
          reprehenderit ipsa inventore unde laborum quibusdam quas totam amet in
          accusantium veritatis consectetur quae.
        </p>
      </div>
    </section>
  );
}

export default App;
