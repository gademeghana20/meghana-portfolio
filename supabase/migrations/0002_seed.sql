-- 0002_seed.sql
-- Starting content (same as the Phase 2 placeholders). Edit it later in /admin.
-- Run after 0001_schema.sql.

insert into public.profile (id, name, designation, headline, intro, summary, career_interests, email)
values (
  1,
  'Gade Meghana',
  'Software Engineer | Full-Stack Developer | AI/ML Enthusiast',
  'Building Software. Exploring AI. Solving Real-World Problems.',
  'I''m Meghana, a Software Engineer passionate about building reliable applications and exploring intelligent technologies.',
  array[
    'I''m a Software Engineer at RealPage, where I work on enterprise application development and maintenance using Angular, C#, .NET, REST APIs and SQL Server.',
    'I hold a B.Tech in Artificial Intelligence and Data Science (2026) and have project experience in Python, machine learning, natural language processing, generative AI and computer vision.',
    'I enjoy building scalable software, solving real engineering problems, and exploring how AI can be integrated into practical applications.'
  ],
  'Full-stack and backend engineering, and applying AI/ML to practical software products.',
  'meghanagade01@gmail.com'
);

insert into public.site_settings (id, resume_path) values (1, null);

insert into public.social_links (platform, label, url, sort_order) values
  ('github', 'GitHub', 'https://github.com/gademeghana20', 1),
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/meghana-gade-a4b734345', 2);

insert into public.experiences
  (company, role, start_date, end_date, responsibilities, technologies, sort_order, is_published)
values (
  'RealPage', 'Software Developer Intern', 'Nov 2025', null,
  array[
    'Develop and maintain features in enterprise web applications using Angular and C#/.NET.',
    'Build and integrate REST APIs between front-end and back-end services.',
    'Work with SQL Server, writing and reviewing queries using SQL Server Management Studio.',
    'Debug, test and enhance existing application functionality.',
    'Collaborate through Git/TFS and Azure DevOps workflows.'
  ],
  array['Angular','C#','.NET','REST APIs','SQL Server','Git','Azure DevOps'],
  1, true
);

insert into public.education
  (degree, specialization, institution, graduation_year, sort_order, is_published)
values
  ('Bachelor of Technology (B.Tech)', 'Artificial Intelligence and Data Science', null, 2026, 1, true);

insert into public.skill_categories (slug, title, icon, sort_order) values
  ('languages', 'Programming Languages', 'code', 1),
  ('frontend', 'Frontend Development', 'layout', 2),
  ('backend', 'Backend Development', 'server', 3),
  ('databases', 'Databases', 'database', 4),
  ('ai-ml', 'AI / Machine Learning', 'brain', 5),
  ('tools', 'Tools & Technologies', 'wrench', 6);

insert into public.skills (category_id, name, level, sort_order)
select c.id, s.name, s.level, s.ord
from (values
  ('languages','C#','professional',1), ('languages','SQL','professional',2),
  ('languages','TypeScript','professional',3), ('languages','JavaScript','professional',4),
  ('languages','Python','project',5),
  ('frontend','Angular','professional',1), ('frontend','HTML5','professional',2),
  ('frontend','CSS3','professional',3), ('frontend','Responsive Web Design','professional',4),
  ('frontend','React','project',5),
  ('backend','.NET','professional',1), ('backend','ASP.NET Core','professional',2),
  ('backend','REST APIs','professional',3), ('backend','Node.js','familiar',4),
  ('backend','Express.js','familiar',5),
  ('databases','Microsoft SQL Server','professional',1), ('databases','MongoDB','familiar',2),
  ('ai-ml','Machine Learning','project',1), ('ai-ml','Computer Vision','project',2),
  ('ai-ml','Natural Language Processing','project',3), ('ai-ml','Generative AI','familiar',4),
  ('ai-ml','OpenAI / GPT','familiar',5), ('ai-ml','RAG','familiar',6),
  ('ai-ml','Semantic Embeddings','familiar',7),
  ('tools','Git','professional',1), ('tools','GitHub','professional',2),
  ('tools','Azure DevOps','professional',3), ('tools','Visual Studio','professional',4),
  ('tools','VS Code','professional',5), ('tools','SQL Server Management Studio','professional',6),
  ('tools','Postman','professional',7), ('tools','Docker','familiar',8)
) as s(cat, name, level, ord)
join public.skill_categories c on c.slug = s.cat;

insert into public.projects
  (slug, title, short_description, overview, problem, features, stack, contribution,
   implementation, status, sort_order, is_published)
values
(
  'resolveiq', 'ResolveIQ',
  'An AI-oriented incident management and resolution platform, currently under development.',
  'ResolveIQ is an incident management and resolution platform being built with a layered .NET architecture. It is an active work in progress.',
  'Incident handling often depends on manual triage and scattered knowledge. ResolveIQ aims to bring incident tracking and resolution together in one place.',
  array['Feature list will be added as capabilities are implemented and tested.'],
  array['C#','ASP.NET Core Web API','.NET 10','Entity Framework Core','SQL Server'],
  'Designing and building the application end to end.',
  array[
    'Layered architecture separating API, Domain, Infrastructure and Application concerns.',
    'Entity Framework Core for data access against SQL Server.'
  ],
  'in-development', 1, true
),
(
  'license-plate-helmet-detection',
  'Dual Detection of License Plates and Helmets Using YOLO & OCR',
  'A computer vision project that detects vehicles, license plates and helmet-related violations using YOLO and OCR.',
  'A computer vision system that detects vehicles, license plates and helmet usage, and reads plate text using OCR.',
  'Manually monitoring helmet compliance and identifying vehicles is slow and error-prone. This project explores automating detection from images and video.',
  array[
    'Detection of vehicles, license plates and helmet-related violations.',
    'OCR to read license plate text.'
  ],
  array['Python','YOLO','OpenCV','OCR'],
  'To be confirmed after repository review.',
  array['Model details, results and screenshots will be added after reviewing the repository.'],
  'completed', 2, true
);
