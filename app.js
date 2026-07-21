;(function () {
  const e = React
  const { useEffect, useState } = React
  const ReactDOM = window.ReactDOM

  const API_BASE_URL = window.API_BASE_URL || ''

  function typedTextHook(text) {
    const [value, setValue] = useState('')
    useEffect(() => {
      if (!text) return
      let index = 0
      const interval = setInterval(() => {
        index += 1
        if (index > text.length) {
          clearInterval(interval)
          setValue(text)
          return
        }
        setValue(text.slice(0, index))
      }, 45)
      return () => clearInterval(interval)
    }, [text])
    return value
  }

  function HeroMedia({ profile }) {
    return e.createElement(
      'section',
      { id: 'hero', className: 'media-hero-section' },
      e.createElement(
        'div',
        { className: 'hero-media-frame' },
        profile?.photo
          ? e.createElement(MediaCarousel, {
              videoSrc: './assets/linked_video.mp4',
              imageSrc: profile.photo,
            })
          : null
      )
    )
  }

  function Hero({ profile, openLightbox }) {
    const subtitle =
      profile?.hero_subtitle ||
      'Full-Stack Engineer · Python · Django · React · Laravel'
    const typed = typedTextHook(subtitle)

    const stats = [
      {
        label: 'Projects Completed',
        value:
          profile?.projects_completed != null ? profile.projects_completed : 25,
      },
      {
        label: 'Years of Experience',
        value:
          profile?.years_experience != null ? profile.years_experience : 7,
      },
      {
        label: 'Organizations Worked',
        value:
          profile?.organizations_worked != null
            ? profile.organizations_worked
            : 5,
      },
    ]

    const summaryText = profile?.summary ||
      'AI Software Engineer with 7+ years of experience in IT environments, SaaS/IaC architecture. Expertise in Web development (back-end and front-end) using HTML5, CSS, JavaScript, React, Python, and PHP. Certified Multi-agent Builder using Langchain, Langraph, CrewAI, and AutoGen. Extensive experience in database administration (SQL, PostgreSQL, MySQL, KQL, Apache Spark, Kafka). Proficient in Agile methodologies and prompt engineering for LLMs/NLP personalization with RAG and LoRA Fine-tuning. Bilingual (French/English) with strong communication skills.'
    const summaryPoints = summaryText.split(/\.\s+/).filter(function(s) { return s.trim().length > 0 }).map(function(s) { return s.trim().replace(/\.$/, '') })

    return e.createElement(
      e.Fragment,
      null,
      e.createElement(HeroMedia, { profile }),
      e.createElement(
        'section',
        { id: 'about', className: 'section intro-section' },
        e.createElement(
          'div',
          { className: 'container' },
          e.createElement(
            'div',
            { className: 'card presentation-card' },
            e.createElement(
              'div',
              { className: 'presentation-header' },
              profile?.badge_photo
                ? e.createElement('img', {
                    src: profile.badge_photo,
                    alt: profile?.name || 'Fouad Hammani',
                    className: 'hero-badge-photo presentation-photo',
                  })
                : null,
              e.createElement(
                'div',
                { className: 'presentation-copy' },
                e.createElement(
                  'div',
                  { className: 'hero-eyebrow' },
                  'Presentation'
                ),
                e.createElement(
                  'h1',
                  { className: 'hero-title' },
                  "Hi, I'm ",
                  profile?.name || 'Fouad Hammani'
                ),
                e.createElement(
                  'div',
                  { className: 'hero-typed-line' },
                  e.createElement('span', null, '$'),
                  e.createElement('span', null, typed),
                  e.createElement('span', { className: 'hero-typed-cursor' })
                )
              )
            ),
            e.createElement(
              'ul',
              { className: 'about-bullets hero-summary' },
              summaryPoints.map(function (item, i) {
                return e.createElement('li', { key: i }, item)
              })
            ),
            e.createElement(
              'div',
              { className: 'hero-meta' },
              e.createElement(
                'span',
                null,
                profile?.availability ||
                  'Relocating to Anywhere in Canada · Open to Opportunities in Toronto/Vancouver/Montreal'
              )
            ),
            e.createElement(
              'div',
              { className: 'hero-actions' },
              e.createElement(
                'a',
                {
                  href: '#projects',
                  className: 'btn btn-primary',
                },
                'View Projects'
              ),
              e.createElement(
                'a',
                {
                  href: '#contact',
                  className: 'btn btn-outline',
                },
                'Get In Touch'
              ),
              profile?.resume_url
                ? e.createElement(
                    'a',
                    {
                      href: profile.resume_url,
                      className: 'btn btn-outline',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      download: true,
                    },
                    'Download Resume'
                  )
                : null
            ),
            e.createElement(
              'div',
              { className: 'hero-stats compact-stats' },
              stats.map(function (s, i) {
                return e.createElement(
                  'div',
                  { key: i, className: 'hero-stat' },
                  e.createElement('div', { className: 'hero-stat-value' }, s.value, '+'),
                  e.createElement('div', { className: 'hero-stat-label' }, s.label)
                )
              })
            )
          )

        )
      )
    )
  }

  function MediaCarousel({ videoSrc, imageSrc }) {
    const [showVideo, setShowVideo] = useState(true)
    const videoRef = React.useRef(null)
    const imageTimerRef = React.useRef(null)

    useEffect(() => {
      if (!showVideo) {
        imageTimerRef.current = window.setTimeout(() => {
          setShowVideo(true)
        }, 15000)
        return () => {
          if (imageTimerRef.current) {
            window.clearTimeout(imageTimerRef.current)
            imageTimerRef.current = null
          }
        }
      }

      const video = videoRef.current
      if (!video) return undefined

      const handleVideoEnd = () => {
        setShowVideo(false)
      }

      video.currentTime = 0
      video.play().catch(() => {})
      video.addEventListener('ended', handleVideoEnd)

      return () => {
        video.removeEventListener('ended', handleVideoEnd)
      }
    }, [showVideo])

    return e.createElement(
      'div',
      { className: 'media-carousel' },
      showVideo
        ? e.createElement('video', {
            ref: videoRef,
            src: videoSrc,
            className: 'carousel-video active',
            controls: false,
            autoPlay: true,
            muted: true,
            playsInline: true,
            preload: 'auto',
            style: { cursor: 'default' }
          })
        : e.createElement('img', {
            src: imageSrc,
            alt: 'Profile',
            className: 'carousel-image active',
            style: { cursor: 'default' }
          })
    )
  }

  function HeroIllustration({ profile, openLightbox }) {
    const stats = [
      {
        label: 'Projects Completed',
        value:
          profile?.projects_completed != null ? profile.projects_completed : 25,
      },
      {
        label: 'Years of Experience',
        value:
          profile?.years_experience != null ? profile.years_experience : 7,
      },
      {
        label: 'Organizations Worked',
        value:
          profile?.organizations_worked != null
            ? profile.organizations_worked
            : 5,
      },
    ]

    return e.createElement(
      'aside',
      { className: 'hero-illustration-card' },
      e.createElement(
        'div',
        { className: 'hero-illustration-avatar' },
        profile?.photo 
          ? e.createElement(MediaCarousel, { 
              videoSrc: './assets/linked_video.mp4',
              imageSrc: profile.photo
            })
          : 'FH'
      ),
      e.createElement(
        'div',
        { className: 'hero-illustration-name' },
        profile?.name || 'Fouad Hammani'
      ),
      e.createElement(
        'div',
        { className: 'hero-illustration-role' },
        profile?.headline || 'Software Engineer · Full-Stack & Backend'
      ),
      e.createElement(
        'div',
        { className: 'pill-row' },
        e.createElement(
          'span',
          { className: 'pill' },
          'Python · Django · React · Laravel'
        )
      ),
      e.createElement(
        'div',
        { className: 'hero-stats' },
        stats.map(function (s, i) {
          return e.createElement(
            'div',
            { key: i, className: 'hero-stat' },
            e.createElement('div', { className: 'hero-stat-value' }, s.value, '+'),
            e.createElement('div', { className: 'hero-stat-label' }, s.label)
          )
        })
      )
    )
  }

  function AboutSection({ awards, embedded }) {
    const content = e.createElement(AboutAwards, { awards })

    if (embedded) {
      return e.createElement('div', { className: 'section-pane' }, content)
    }

    return e.createElement(
      'section',
      { className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
        content
      )
    )
  }

  function AboutAwards({ awards }) {
    const aboutItems = [
      "Over 7 years of experience in IT environment SaaS/IaC architecture environments",
      "Expertise in Web development back-end and front-end using HTML5/ CSS/Javascript/React/Python and Php libraries",
      "Certified Multi agent Builder using tools/libraries like Langchain/Langraph/CrewIA/AutoGen",
      "Extensive experience in database administration and management (SQL, PostegresSQL, MySQL,KQL,Apache spark,Kafka for big data)",
      "Proficient in Agile methodologies and project management tools certified",
      "Expertise in prompt engineer LLMs/NLP and IA personalization RAG and LoRA Finetunning",
      "Software user trainer/teacher didactic of software integration",
      "Bilingual with excellent written and verbal communication skills in both French and English"
    ]

    const list =
      awards && awards.length
        ? awards.map(function (a) {
            const year = a.year ? ' ' + a.year : ''
            const issuer = a.issuer ? ' – ' + a.issuer : ''
            return a.title + issuer + year
          })
        : []

    return e.createElement(
      'div',
      null,
      e.createElement(
        'div',
        { className: 'section-header' },
        e.createElement(
          'h2',
          { className: 'section-title' },
          'About Me'
        )
      ),
      e.createElement(
        'div',
        { className: 'card' },
        e.createElement(
          'ul',
          { className: 'about-bullets' },
          aboutItems.map(function (t, i) {
            return e.createElement('li', { key: i }, t)
          })
        )
      ),
      e.createElement(
        'div',
        { style: { marginTop: '2rem' } },
        e.createElement(
          'div',
          { className: 'section-header' },
          e.createElement(
            'h2',
            { className: 'section-title' },
            'Awards & Certifications'
          )
        ),
        e.createElement(
          'div',
          { className: 'card' },
          e.createElement(
            'ul',
            { className: 'about-bullets' },
            list.map(function (t, i) {
              return e.createElement('li', { key: i }, t)
            })
          )
        )
      )
    )
  }

  function EducationSection({ education, embedded }) {
    const list =
      education && education.length
        ? education
        : [
            {
              id: 1,
              institution: 'GoMyCode School / Woolf University',
              program: 'MSc in Software Engineering',
              start: 'Expected 2026',
              end: '',
              description: '',
            },
            {
              id: 2,
              institution: 'INSFPTB – Algeria',
              program: 'Bachelor in Computer Science – Relational Databases',
              start: '2018',
              end: '2021',
              description: '',
            },
          ]

    const content = e.createElement(
      e.Fragment,
      null,
      e.createElement(
        'div',
        { className: 'section-header' },
        e.createElement('h2', { className: 'section-title' }, 'Education')
      ),
      e.createElement(
        'div',
        { className: 'card timeline' },
        list.map(function (edu) {
          return e.createElement(
            'div',
            { key: edu.id || edu.program, className: 'timeline-item' },
            e.createElement(
              'div',
              { className: 'timeline-title' },
              edu.program
            ),
            e.createElement(
              'div',
              { className: 'timeline-sub' },
              edu.institution
            ),
            e.createElement(
              'div',
              { className: 'timeline-meta' },
              [edu.start, edu.end].filter(Boolean).join(' – ')
            )
          )
        })
      )
    )

    if (embedded) {
      return e.createElement('div', { className: 'section-pane' }, content)
    }

    return e.createElement(
      'section',
      { id: 'education', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
        content
      )
    )
  }

  function ExperienceSection({ experiences, embedded }) {
    const list =
      experiences && experiences.length
        ? experiences
        : [
            {
              id: 1,
              company: 'Garden Algérie / ACI',
              role: 'Full-Stack Developer',
              location: 'Algeria',
              start: 'Jan 2025',
              end: 'Present',
              description:
                'Designed, developed, and deployed a full ERP and SharePoint solution (Laravel, React, Inertia.js, MySQL, Docker), improving operational efficiency and inventory management.',
              technologies:
                'Laravel, React, Inertia.js, MySQL, Docker, Microservices',
            },
            {
              id: 2,
              company: 'Freelance',
              role: 'Full-Stack Developer',
              location: 'Remote',
              start: 'Jan 2024',
              end: 'Present',
              description:
                'Built data-driven dashboards, secure e-commerce platforms in Django, and local AI agents using Kivy and Ollama; deployed containerized apps to Linux servers with SSL.',
              technologies:
                'Django, DRF, React, Streamlit, Kivy, Ollama, Docker, PostgreSQL',
            },
          ]

    const content = e.createElement(
      e.Fragment,
      null,
      e.createElement(
        'div',
        { className: 'section-header' },
        e.createElement('h2', { className: 'section-title' }, 'Experience')
      ),
      e.createElement(
        'div',
        { className: 'card timeline' },
        list.map(function (exp) {
          const tech = (exp.technologies || '')
            .split(',')
            .map(function (s) {
              return s.trim()
            })
            .filter(Boolean)
          const accomplishments =
            exp.accomplishments && exp.accomplishments.length
              ? exp.accomplishments
              : (exp.description || '')
                  .split('. ')
                  .map(function (item) {
                    return item.trim().replace(/\.$/, '')
                  })
                  .filter(Boolean)
          return e.createElement(
            'div',
            { key: exp.id || exp.company + exp.role, className: 'timeline-item' },
            e.createElement(
              'div',
              { className: 'timeline-title' },
              exp.role
            ),
            e.createElement(
              'div',
              { className: 'timeline-sub' },
              exp.company
            ),
            e.createElement(
              'div',
              { className: 'timeline-meta' },
              [exp.location, [exp.start, exp.end].filter(Boolean).join(' – ')]
                .filter(Boolean)
                .join(' · ')
            ),
            accomplishments.length
              ? e.createElement(
                  'ul',
                  { className: 'timeline-accomplishments' },
                  accomplishments.map(function (item, index) {
                    return e.createElement('li', { key: exp.role + index }, item)
                  })
                )
              : null,
            tech.length
              ? e.createElement(
                  'div',
                  { className: 'badge-row' },
                  tech.map(function (t) {
                    return e.createElement(
                      'span',
                      { key: t, className: 'badge' },
                      t
                    )
                  })
                )
              : null
          )
        })
      )
    )

    if (embedded) {
      return e.createElement('div', { className: 'section-pane' }, content)
    }

    return e.createElement(
      'section',
      { id: 'experience', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
        content
      )
    )
  }

  function ProjectsSection({ projects, openLightbox }) {
    const [tab, setTab] = useState('all')

    const mapped =
      projects && projects.length
        ? projects
        : [
            {
              id: 1,
              title: 'ERP & SharePoint Integration',
              subtitle: 'Garden Algérie / ACI',
              description:
                'End-to-end ERP and SharePoint solution using Laravel, React, Inertia.js, and MySQL, containerized with Docker and integrated with existing infrastructure.',
              tech_stack:
                'Laravel, React, Inertia.js, MySQL, Docker, Microservices',
              image_url: '',
              live_url: '',
              code_url: '',
              project_type: 'personal',
            },
          ]

    const filtered = mapped.filter(function (p) {
      if (tab === 'all') return true
      return p.project_type === tab
    })

    return e.createElement(
      'section',
      { id: 'projects', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
        e.createElement(
          'div',
          { className: 'section-header' },
          e.createElement('h2', { className: 'section-title' }, 'Projects'),
          e.createElement(
            'div',
            { className: 'section-subtitle' },
            'Highlights from personal and school projects.'
          )
        ),
        e.createElement(
          'div',
          { style: { marginBottom: '1rem' } },
          e.createElement(
            'div',
            { className: 'tabs' },
            e.createElement(
              'button',
              {
                type: 'button',
                className: 'tab ' + (tab === 'all' ? 'tab-active' : ''),
                onClick: function () {
                  setTab('all')
                },
              },
              'All'
            ),
            e.createElement(
              'button',
              {
                type: 'button',
                className: 'tab ' + (tab === 'personal' ? 'tab-active' : ''),
                onClick: function () {
                  setTab('personal')
                },
              },
              'Personal'
            ),
            e.createElement(
              'button',
              {
                type: 'button',
                className: 'tab ' + (tab === 'school' ? 'tab-active' : ''),
                onClick: function () {
                  setTab('school')
                },
              },
              'School'
            )
          )
        ),
        e.createElement(
          'div',
          { className: 'projects-grid' },
          filtered.map(function (p) {
            const techs = (p.tech_stack || '')
              .split(',')
              .map(function (s) {
                return s.trim()
              })
              .filter(Boolean)
            
            const projectImages = p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : [])
            const mainImage = projectImages.length > 0 ? projectImages[0] : null

            return e.createElement(
              'article',
              { key: p.id || p.title, className: 'project-card' },
              e.createElement(
                'div',
                { className: 'project-media-wrap' },
                p.video 
                  ? e.createElement('video', {
                      src: p.video,
                      controls: true,
                      className: 'project-video',
                      style: { width: '100%', borderRadius: '8px 8px 0 0' }
                    })
                  : (mainImage
                      ? e.createElement('div', {
                          className: 'project-image-wrap',
                          style: { cursor: 'pointer', position: 'relative' },
                          onClick: () => openLightbox(projectImages, 0)
                        },
                        e.createElement('img', {
                          src: mainImage,
                          alt: p.title,
                          className: 'project-image',
                        }),
                        projectImages.length > 1 
                          ? e.createElement('div', {
                              style: {
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                              }
                            }, `+${projectImages.length - 1} more`)
                          : null
                        )
                      : null)
              ),
              e.createElement(
                'div',
                { className: 'project-body' },
                e.createElement(
                  'div',
                  { className: 'project-title' },
                  p.title
                ),
                p.subtitle
                  ? e.createElement(
                      'div',
                      { className: 'project-subtitle' },
                      p.subtitle
                    )
                  : null,
                e.createElement(
                  'p',
                  { className: 'project-description' },
                  p.description
                ),
                techs.length
                  ? e.createElement(
                      'div',
                      { className: 'project-tech' },
                      techs.map(function (t) {
                        return e.createElement('span', { key: t }, t)
                      })
                    )
                  : null,
                e.createElement(
                  'div',
                  { className: 'project-links' },
                  projectImages.length > 1
                    ? e.createElement(
                        'button',
                        {
                          className: 'project-link',
                          style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' },
                          onClick: () => openLightbox(projectImages, 0)
                        },
                        'View Gallery'
                      )
                    : null,
                  p.live_url
                    ? e.createElement(
                        'a',
                        {
                          href: p.live_url,
                          target: '_blank',
                          rel: 'noreferrer',
                          className: 'project-link',
                        },
                        'Live Demo'
                      )
                    : null,
                  p.code_url
                    ? e.createElement(
                        'a',
                        {
                          href: p.code_url,
                          target: '_blank',
                          rel: 'noreferrer',
                          className: 'project-link',
                        },
                        'View Code'
                      )
                    : null
                )
              )
            )
          })
        )
      )
    )
  }

  function SkillsSection({ skills, embedded }) {
    const skillLogos = {
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      'ES6': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg',
      'Django / Django REST': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg',
      'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
      'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Electron': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg',
      'Inertia.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
      'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      'Streamlit': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      'WCAG': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'Kivy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Langchain': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Langraph': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'CrewAI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'AutoGen': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Ollama (Local LLMs)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Hugging Face': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'RAG (Retrieval-Augmented Generation)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'LoRA Fine-tuning': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Scikit-Learn': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
      'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      'Transformers': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'IBM WatsonAI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'NLP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Machine Learning': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'SQLite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
      'NoSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'SQLAlchemy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Pandas': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
      'Json': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'KQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Kafka': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
      'RabbitMQ': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg',
      'Apache Spark': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg',
      'Selenium': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg',
      'Playwright': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'Web Scraping': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Web Crawling': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
      'Bash': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
      'Nginx': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
      'Gunicorn': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'CI/CD': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'REST APIs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
      'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
      'Microsoft Fabric': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg',
      'JWT': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'OAuth2': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'OWASP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/security/security-original.svg',
      'CSRF/XSS Protection': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/security/security-original.svg',
      'MVC': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'Microservices': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Agile/Scrum': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-original.svg',
      'Jira': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg'
    }

    let groups = []
    if (skills && !Array.isArray(skills)) {
      groups = Object.keys(skills).map(function(key) {
        return {
          name: key,
          skills: skills[key]
        }
      })
    } else if (skills && Array.isArray(skills)) {
      groups = skills.map(function (c) {
        return {
          name: c.name,
          skills: (c.skills || []).map(function (s) {
            return typeof s === 'string' ? s : s.name
          }),
        }
      })
    } else {
        groups = [
            {
                name: 'Programming Languages',
                skills: ['Python', 'JavaScript', 'TypeScript', 'PHP'],
            },
        ]
    }

    const content = e.createElement(
      e.Fragment,
      null,
      e.createElement(
        'div',
        { className: 'section-header' },
        e.createElement('h2', { className: 'section-title' }, 'Skills')
      ),
      e.createElement(
        'div',
        { className: 'card skills-groups' },
        groups.map(function (g) {
          return e.createElement(
            'div',
            { key: g.name },
            e.createElement(
              'div',
              { className: 'skills-group-title' },
              g.name
            ),
            e.createElement(
              'div',
              { className: 'skills-chips' },
              g.skills.map(function (s) {
                const logoUrl = skillLogos[s]
                return e.createElement(
                  'span',
                  { key: g.name + s, className: 'skill-chip' },
                  logoUrl ? e.createElement('img', {
                    src: logoUrl,
                    alt: s,
                    className: 'skill-logo',
                    onError: (e) => { e.target.style.display = 'none' }
                  }) : null,
                  s
                )
              })
            )
          )
        })
      )
    )

    if (embedded) {
      return e.createElement('div', { className: 'section-pane' }, content)
    }

    return e.createElement(
      'section',
      { id: 'skills', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
        content
      )
    )
  }

  function ContactSection({ profile, languages, interests }) {
    const langs =
      languages && languages.length
        ? languages.map(function (l) {
            return l.level ? l.name + ' – ' + l.level : l.name
          })
        : ['English – Upper Intermediate', 'French – Native', 'Arabic – Native']

    const inter =
      interests && interests.length
        ? interests.map(function (i) {
            return i.name
          })
        : [
            'Basketball',
            'Ping-Pong',
            'OSINT (Open-Source Intelligence)',
            'Emerging Technologies',
            'Music',
            'Philosophy',
            'History',
          ]

    return e.createElement(
      'section',
      { id: 'contact', className: 'section' },
      e.createElement(
        'div',
        { className: 'container contact-grid' },
        e.createElement(
          'div',
          null,
          e.createElement(
            'div',
            { className: 'section-header' },
            e.createElement('h2', { className: 'section-title' }, 'Get In Touch')
          ),
          e.createElement(
            'div',
            { className: 'card contact-list' },
            e.createElement(
              'div',
              null,
              e.createElement('div', { className: 'contact-label' }, 'Location'),
              e.createElement(
                'div',
                { className: 'contact-value' },
                profile?.location || 'Relocating to Anywhere in Canada'
              )
            ),
            e.createElement(
              'div',
              null,
              e.createElement('div', { className: 'contact-label' }, 'Email'),
              e.createElement(
                'div',
                { className: 'contact-value' },
                profile?.email || 'fouadhammani94@gmail.com'
              )
            ),
            e.createElement(
              'div',
              null,
              e.createElement('div', { className: 'contact-label' }, 'Phone'),
              e.createElement(
                'div',
                { className: 'contact-value' },
                profile?.phone ||
                  '+16133026686 (Ottawa, Ontario, Canada (available for relocation))'
              )
            ),
            e.createElement(
              'div',
              null,
              e.createElement('div', { className: 'contact-label' }, 'Languages'),
              e.createElement(
                'div',
                { className: 'contact-value' },
                langs.join(' · ')
              )
            ),
            e.createElement(
              'div',
              null,
              e.createElement('div', { className: 'contact-label' }, 'Interests'),
              e.createElement(
                'div',
                { className: 'contact-value' },
                inter.join(' · ')
              )
            ),
            e.createElement(
              'div',
              { className: 'social-links' },
              profile?.linkedin_url
                ? e.createElement(
                    'a',
                    {
                      href: profile.linkedin_url,
                      target: '_blank',
                      rel: 'noreferrer',
                      className: 'social-pill',
                    },
                    'LinkedIn'
                  )
                : e.createElement(
                    'a',
                    {
                      href:
                        'https://linkedin.com/in/fouad-hammani-software-engineer',
                      target: '_blank',
                      rel: 'noreferrer',
                      className: 'social-pill',
                    },
                    'LinkedIn'
                  ),
              profile?.github_url
                ? e.createElement(
                    'a',
                    {
                      href: profile.github_url,
                      target: '_blank',
                      rel: 'noreferrer',
                      className: 'social-pill',
                    },
                    'GitHub'
                  )
                : e.createElement(
                    'a',
                    {
                      href: 'https://github.com/Fouja',
                      target: '_blank',
                      rel: 'noreferrer',
                      className: 'social-pill',
                    },
                    'GitHub'
                  )
            )
          )
        ),
        e.createElement(
          'div',
          null,
          e.createElement(
            'div',
            { className: 'section-header' },
            e.createElement(
              'h2',
              { className: 'section-title' },
              "Let’s Build Something"
            )
          ),
          e.createElement(
            'div',
            { className: 'card about-text' },
            'If you are looking for a full-stack engineer who can move from architecture and backend design to clean, production-ready frontends,AI agents integration into your SaaS applications, I would be happy to talk.',
            e.createElement('br'),
            e.createElement('br'),
            'Feel free to reach out by email or LinkedIn—I’d love to hear about what you are building.'
          )
        )
      )
    )
  }

  function ChatBotButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    function parseFormatted(text) {
      if (!text) return null
      var lines = text.split('\n')
      var elements = []
      var key = 0
      for (var i = 0; i < lines.length; i++) {
        var trimmed = lines[i].trim()
        if (!trimmed) { elements.push(e.createElement('div', { key: key++, style: { height: '6px' } })); continue }
        if (/^[A-Z][A-Za-z\s&/()']+$/.test(trimmed) && trimmed.endsWith(':')) {
          elements.push(e.createElement('div', { key: key++, style: { fontWeight: '700', color: '#22d3ee', fontSize: '0.8rem', marginTop: '8px', marginBottom: '2px', letterSpacing: '0.04em' } }, trimmed)); continue
        }
        if (/^[•\-\*]\s/.test(trimmed)) {
          var content = trimmed.replace(/^[\•\-\*]\s+/, '')
          elements.push(e.createElement('div', { key: key++, style: { display: 'flex', gap: '6px', paddingLeft: '4px', lineHeight: '1.4' } },
            e.createElement('span', { style: { color: '#06b6d4', fontWeight: 'bold', flexShrink: 0 } }, '\u203A'),
            e.createElement('span', { style: { flex: 1 } }, parseInline(content))
          )); continue
        }
        elements.push(e.createElement('div', { key: key++, style: { lineHeight: '1.45', paddingLeft: '2px' } }, parseInline(trimmed)))
      }
      return elements
    }

    function parseInline(text) {
      var parts = []
      var rem = text
      var pk = 0
      while (rem.length > 0) {
        var boldM = rem.match(/\*\*(.+?)\*\*/)
        var urlM = rem.match(/(https?:\/\/[^\\s,)]+)/)
        var next = rem.length; var mt = null; var m = null
        if (boldM && rem.indexOf(boldM[0]) < next) { next = rem.indexOf(boldM[0]); mt = 'b'; m = boldM }
        if (urlM && rem.indexOf(urlM[0]) < next) { next = rem.indexOf(urlM[0]); mt = 'u'; m = urlM }
        if (!m) { parts.push(rem); break }
        if (next > 0) parts.push(rem.substring(0, next))
        if (mt === 'b') { parts.push(e.createElement('strong', { key: 'b' + pk++, style: { color: '#e5e7eb' } }, m[1])); rem = rem.substring(next + m[0].length) }
        else { parts.push(e.createElement('a', { key: 'a' + pk++, href: m[1], target: '_blank', rel: 'noopener noreferrer', style: { color: '#38bdf8', textDecoration: 'underline' } }, m[1].length > 40 ? m[1].substring(0, 37) + '...' : m[1])); rem = rem.substring(next + m[0].length) }
      }
      return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
    }

    function generateLocalReply(query) {
      const d = window.PORTFOLIO_DATA || {}
      const p = d.profile || {}
      const q = query.toLowerCase()
      const hits = []

      // Greeting
      if (/^(hi|hello|hey|yo|sup|bonjour|salut|howdy|hola)/.test(q)) {
        return "Hey! I'm Fouad's portfolio assistant. Ask me about his skills, experience, projects, education, or how to contact him."
      }

      // Contact
      if (/contact|email|phone|reach|hire|available|collaborat|work with/.test(q)) {
        return `You can reach Fouad at:\n\nEmail: ${p.email || 'Fouadhammani94@gmail.com'}\nPhone: ${p.phone || '(613) 451-0031'}\nLinkedIn: ${p.linkedin_url || ''}\nGitHub: ${p.github_url || ''}\n\nHe's based in ${p.location || 'Ontario, Canada'} and open for opportunities!`
      }

      // Skills
      if (/skill|tech|stack|know|language|framework|tool|proficien/.test(q)) {
        const cats = Object.entries(d.skills || {}).map(([cat, list]) => `• ${cat}: ${list.join(', ')}`)
        return `Fouad's technical skills:\n\n${cats.join('\n')}\n\nHe's strongest in Python, JavaScript, React, Django, and AI/ML toolchains.`
      }

      // Experience
      if (/experience|work|job|career|role|position|employ|company/.test(q)) {
        const exps = (d.experience || []).map(e => `• ${e.role} at ${e.company} (${e.start}–${e.end})`)
        return `Fouad's work experience:\n\n${exps.join('\n')}\n\nTotal: ${p.years_experience || 7}+ years across ${p.organizations_worked || 5} organizations. Ask me about a specific role for details!`
      }

      // Specific experience
      if (/aci|agro|erp/.test(q)) {
        const e = (d.experience || []).find(e => e.company && e.company.includes('ACI'))
        return e ? `${e.role} at ${e.company} (${e.start}–${e.end}):\n\n${e.description}\n\nTechnologies: ${e.technologies || 'Laravel, React, Inertia.js, MySQL, Docker, Electron'}` : 'ACI experience info not found.'
      }
      if (/techflow|fastapi/.test(q)) {
        const e = (d.experience || []).find(e => e.company && e.company.includes('TechFlow'))
        return e ? `${e.role} at ${e.company} (${e.start}–${e.end}):\n\n${e.description}\n\nTechnologies: ${e.technologies || 'Python, FastAPI, PostgreSQL, LangChain, Redis'}` : 'TechFlow info not found.'
      }
      if (/startup|paris|django react 50k/.test(q)) {
        const e = (d.experience || []).find(e => e.company && e.company.includes('StartUp'))
        return e ? `${e.role} at ${e.company} (${e.start}–${e.end}):\n\n${e.description}` : 'StartUp Hub info not found.'
      }

      // Projects
      if (/project|portfolio|build|develop|creat|app|application|product/.test(q)) {
        const projs = (d.projects || []).slice(0, 5).map(pr => `• ${pr.title}: ${pr.description ? pr.description.substring(0, 120) + '...' : ''}`)
        return `Key projects:\n\n${projs.join('\n')}\n\nAsk about a specific project for more details!`
      }

      // Specific projects
      if (/ecommerce|e-commerce|django.*react|secure/.test(q)) {
        const pr = (d.projects || []).find(p => /ecommerce|e-commerce/i.test(p.title))
        return pr ? `${pr.title}:\n\n${pr.description}\n\nStack: ${pr.tech_stack || 'Django, React, PostgreSQL'}` : 'E-commerce project info not found.'
      }
      if (/streamlit|statistics|map|global|indicator/.test(q)) {
        const pr = (d.projects || []).find(p => /statistic|streamlit|global/i.test(p.title))
        return pr ? `${pr.title}:\n\n${pr.description}\n\nStack: ${pr.tech_stack || 'Streamlit, Python, Pandas'}` : 'Statistics project info not found.'
      }
      if (/ai agent|kivy|ollama|local ai/.test(q)) {
        const pr = (d.projects || []).find(p => /agent|kivy|ollama/i.test(p.title))
        return pr ? `${pr.title}:\n\n${pr.description}\n\nStack: ${pr.tech_stack || 'Kivy, Python, Ollama'}` : 'AI Agent project info not found.'
      }
      if (/mobile|react native|expo/.test(q)) {
        const pr = (d.projects || []).find(p => /mobile|react native/i.test(p.title))
        return pr ? `${pr.title}:\n\n${pr.description}\n\nStack: ${pr.tech_stack || 'React Native, Expo, Django'}` : 'Mobile project info not found.'
      }

      // Education
      if (/education|degree|diploma|school|university|college|study|wes/.test(q)) {
        const edu = (d.education || []).map(e => `• ${e.degree || e.title} — ${e.school || e.institution || ''} (${e.dates || e.start || ''})`)
        return `Fouad's education:\n\n${edu.join('\n') || 'Education details in data.'}`
      }

      // AI/ML
      if (/ai|machine learning|ml|deep learning|langchain|rag|nlp|llm/.test(q)) {
        return "Fouad is certified in AI Multi-Agent Building (IBM SkillsBuild) and has hands-on experience with:\n\n• LangChain, LangGraph, CrewAI, AutoGen\n• RAG systems (built production RAG for document processing)\n• LoRA Fine-tuning, Prompt Engineering\n• Ollama for local LLM deployment\n• Scikit-Learn, TensorFlow, Transformers\n• NLP and Machine Learning\n\nHe's particularly strong in building multi-agent AI systems and integrating LLMs into production applications."
      }

      // DevOps
      if (/devops|docker|kubernetes|ci\/cd|aws|azure|deploy|cloud|linux/.test(q)) {
        return "Fouad's DevOps & Cloud skills:\n\n• Docker & Kubernetes for containerization\n• CI/CD with GitHub Actions\n• AWS & Azure cloud platforms\n• Linux server administration\n• Nginx, Gunicorn for deployment\n• Microsoft Fabric\n\nHe has experience deploying Dockerized apps on Linux VPS with SSH/SSL."
      }

      // Certifications
      if (/certif|badge|credential/.test(q)) {
        return "Fouad's certifications:\n\n• AI Multi-agent Builder – IBM SkillsBuild\n• Agile Management – IBM SkillsBuild\n• Python & Django – W3Schools\n• B2 English – Islington Centre of English\n• Azure & Microsoft Fabric – Microsoft Learn\n• Machine Learning – Kaggle\n• Big Data Foundations Level 2"
      }

      // Languages
      if (/language|french|english|arabic|bilingual/.test(q)) {
        return "Fouad speaks:\n\n• French: Native\n• Arabic: Native\n• English: Upper Intermediate (B2)\n\nHe's bilingual French-English with strong communication skills."
      }

      // About / summary
      if (/about|summary|who|tell me about|background|overview|introduce/.test(q)) {
        return `${p.name || 'Fouad Hammani'} — ${p.headline || 'AI Software Engineer'}\n\n${p.summary || 'AI Software Engineer with 7+ years of experience in full-stack development, AI/ML, and data engineering.'}\n\nKey highlights:\n${(p.highlights || []).map(h => '• ' + h).join('\n')}`
      }

      // Location
      if (/where|location|city|country|canada|ontario|algeria|paris/.test(q)) {
        return `Fouad is based in ${p.location || 'Ontario, Canada'}. He has worked in Algiers (Algeria), Paris (France), and remotely. He's open for opportunities and available for remote work.`
      }

      // Philosophy / interests
      if (/hobby|interest|free time|philosoph|music|sport|basketball/.test(q)) {
        return "Outside of tech, Fouad is interested in:\n\nBasketball, Ping-Pong, OSINT, Emerging Technologies, Music, Philosophy, and History."
      }

      // Default
      return "I can help you learn about Fouad's:\n\n• Skills & tech stack\n• Work experience\n• Projects\n• Education & certifications\n• AI/ML expertise\n• How to contact him\n\nTry asking something like \"What are Fouad's skills?\" or \"Tell me about his projects!\""
    }

    const sendMessage = async (overrideQuestion) => {
      const question = overrideQuestion || input
      if (!question.trim()) return

      const userMessage = { role: 'user', content: question }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      try {
        // Try Pollinations API first (short prompt, fast)
        const shortPrompt = `You are Fouad Hammani's portfolio AI assistant. Fouad is an AI Software Engineer in Ontario. Skills: Python, JS, TS, React, Django, Laravel, Langchain, PostgreSQL, Docker. Answer concisely. Question: ${question}`
        const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(shortPrompt)}`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        try {
          const apiResponse = await fetch(apiUrl, { signal: controller.signal })
          clearTimeout(timeoutId)
          if (apiResponse.ok) {
            const reply = (await apiResponse.text()).trim()
            if (reply && reply.length > 5 && !reply.includes('error')) {
              setMessages((prev) => [...prev, { role: 'bot', content: reply }])
              return
            }
          }
        } catch (apiErr) {
          // API failed, fall through to local
        }

        // Fallback: smart local response from portfolio data
        const localReply = generateLocalReply(question)
        setMessages((prev) => [...prev, { role: 'bot', content: localReply }])
      } catch (error) {
        setMessages((prev) => [...prev, { role: 'bot', content: generateLocalReply(question) }])
      } finally {
        setIsLoading(false)
      }
    }

    return e.createElement(
      e.Fragment, null,
      e.createElement('button', {
        onClick: () => setIsOpen(!isOpen),
        title: 'Chat with me about what I can do',
        style: {
          position: 'fixed', bottom: '80px', right: '20px', height: '50px',
          borderRadius: '25px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', color: '#fff',
          fontSize: '14px', cursor: 'pointer', zIndex: 99, boxShadow: '0 4px 15px rgba(6,182,212,0.4)',
          transition: 'all 0.3s ease', animation: 'pulse 2s infinite',
          display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', fontWeight: '600', fontFamily: 'Inter, sans-serif'
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2, #0e7490)'; e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(6,182,212,0.5)' },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #06b6d4, #0891b2)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(6,182,212,0.4)' }
      },
        e.createElement('span', { style: { fontSize: '20px' } }, '\uD83D\uDCAC'),
        e.createElement('span', null, 'Chat with me')
      ),
      isOpen ? e.createElement('div', {
        style: {
          position: 'fixed', bottom: '140px', right: '20px', width: '380px', height: '520px',
          background: '#0b1120', borderRadius: '16px', border: '1px solid rgba(6,182,212,0.3)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.1)', zIndex: 99,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Inter, sans-serif'
        }
      },
        e.createElement('div', {
          style: { background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#000', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
          e.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            e.createElement('span', { style: { fontSize: '20px' } }, '\uD83E\uDD16'),
            e.createElement('div', null,
              e.createElement('div', { style: { fontWeight: 'bold', fontSize: '0.95rem' } }, 'Fouad\u2019s Assistant'),
              e.createElement('div', { style: { fontSize: '0.72rem', opacity: 0.8 } }, 'Ask me about skills, projects, experience...')
            )
          ),
          e.createElement('button', {
            onClick: () => { setIsOpen(false); setMessages([]) },
            style: { background: 'rgba(0,0,0,0.15)', border: 'none', color: '#000', fontSize: '18px', cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          }, '\u00D7')
        ),
        e.createElement('div', {
          style: { flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#0b1120' }
        },
          messages.length === 0 ? e.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: '#9ca3af', textAlign: 'center', padding: '0 20px' } },
            e.createElement('div', { style: { fontSize: '36px' } }, '\uD83E\uDD16'),
            e.createElement('div', { style: { fontWeight: '600', color: '#e5e7eb', fontSize: '0.95rem' } }, 'Hi! I\u2019m Fouad\u2019s AI Assistant'),
            e.createElement('div', { style: { fontSize: '0.8rem', lineHeight: '1.5', color: '#9ca3af' } }, 'I can tell you about his skills, experience, projects, education, or how to reach him.'),
            e.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '4px' } },
              ['What are your skills?', 'Show me your projects', 'How can I contact you?', 'Tell me about your AI work'].map(function(q, i) {
                return e.createElement('button', {
                  key: i, onClick: function() { sendMessage(q) },
                  style: { background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee', borderRadius: '16px', padding: '5px 12px', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' },
                  onMouseEnter: function(ev) { ev.currentTarget.style.background = 'rgba(6,182,212,0.25)' },
                  onMouseLeave: function(ev) { ev.currentTarget.style.background = 'rgba(6,182,212,0.12)' }
                }, q)
              })
            )
          ) : messages.map(function(msg, idx) {
            return e.createElement('div', { key: idx, style: { display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' } },
              e.createElement('div', {
                style: {
                  maxWidth: '85%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : '#141b2d',
                  color: msg.role === 'user' ? '#000' : '#d1d5db', fontSize: '0.85rem', wordWrap: 'break-word',
                  border: msg.role === 'bot' ? '1px solid rgba(6,182,212,0.15)' : 'none',
                  lineHeight: '1.5'
                }
              }, msg.role === 'bot' ? parseFormatted(msg.content) : msg.content)
            )
          }),
          isLoading ? e.createElement('div', { style: { display: 'flex', gap: '4px', padding: '8px 14px', background: '#141b2d', borderRadius: '14px', width: 'fit-content', border: '1px solid rgba(6,182,212,0.15)' } },
            e.createElement('span', { style: { animation: 'blink 1.4s infinite both', color: '#06b6d4', fontSize: '0.8rem' } }, '\u25CF'),
            e.createElement('span', { style: { animation: 'blink 1.4s infinite 0.2s both', color: '#06b6d4', fontSize: '0.8rem' } }, '\u25CF'),
            e.createElement('span', { style: { animation: 'blink 1.4s infinite 0.4s both', color: '#06b6d4', fontSize: '0.8rem' } }, '\u25CF')
          ) : null
        ),
        e.createElement('div', {
          style: { padding: '12px', borderTop: '1px solid rgba(6,182,212,0.15)', display: 'flex', gap: '8px', background: '#0b1120' }
        },
          e.createElement('input', {
            type: 'text', value: input, onChange: function(evt) { setInput(evt.target.value) },
            onKeyPress: function(evt) { if (evt.key === 'Enter' && !evt.shiftKey) { evt.preventDefault(); sendMessage() } },
            placeholder: 'Ask me anything...', disabled: isLoading,
            style: { flex: 1, background: '#141b2d', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '10px', color: '#e5e7eb', padding: '10px 14px', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' },
            onFocus: function(ev) { ev.target.style.borderColor = '#06b6d4' },
            onBlur: function(ev) { ev.target.style.borderColor = 'rgba(6,182,212,0.25)' }
          }),
          e.createElement('button', {
            onClick: sendMessage, disabled: isLoading,
            style: { background: isLoading ? 'rgba(6,182,212,0.3)' : 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', color: '#000', width: '38px', height: '38px', borderRadius: '10px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }
          }, isLoading ? '\u2026' : '\u2192')
        )
      ) : null
    )
  }

  function MusicButton({ isMuted, onToggle }) {
    return e.createElement(
      'button',
      {
        onClick: onToggle,
        className: 'music-button',
        title: isMuted ? 'Unmute Music' : 'Mute Music',
        style: {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: isMuted ? '#ef4444' : '#22c55e',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }
      },
      isMuted ? '🔇' : '🎵'
    )
  }

  function CoursesModal({ isOpen, onClose, selectedCourse, onSelectCourse, courses: dataCourses }) {
    const fallbackCourses = [
      { id: 'html-basics', name: 'HTML Basics', file: './courses/html-basics.html', image: 'https://cdn-icons-png.flaticon.com/512/732/732212.png' },
      { id: 'css-styling', name: 'CSS Styling', file: './courses/css-styling.html', image: 'https://cdn-icons-png.flaticon.com/512/732/732190.png' },
      { id: 'javascript-fundamentals', name: 'JavaScript Fundamentals', file: './courses/javascript-fundamentals.html', image: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png' },
    ]
    const [courses, setCourses] = useState(dataCourses || fallbackCourses)

    useEffect(() => {
      if (dataCourses && dataCourses.length > 0) {
        setCourses(dataCourses)
      }
    }, [dataCourses])

    if (!isOpen) return null

    return e.createElement(
      'div',
      {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          overflowY: 'auto'
        },
        onClick: (evt) => {
          if (evt.target === evt.currentTarget) onClose()
        }
      },
      e.createElement(
        'div',
        {
          style: {
            background: '#0b1120',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #38bdf8',
            color: '#e5e7eb',
            margin: 'auto'
          }
        },
        selectedCourse
          ? e.createElement(
              e.Fragment,
              null,
              e.createElement(
                'button',
                {
                  onClick: () => onSelectCourse(null),
                  style: {
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '18px',
                    marginBottom: '1rem'
                  }
                },
                '← Back to Courses'
              ),
              e.createElement('iframe', {
                src: selectedCourse.file,
                style: {
                  width: '100%',
                  height: '500px',
                  border: 'none',
                  borderRadius: '8px'
                }
              })
            )
          : e.createElement(
              e.Fragment,
              null,
              e.createElement(
                'h2',
                { style: { color: '#38bdf8', marginBottom: '1.5rem' } },
                '🎓 Available Courses'
              ),
              e.createElement(
                'div',
                { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' } },
                courses.map((course) =>
                  e.createElement(
                    'button',
                    {
                      key: course.id,
                      onClick: () => onSelectCourse(course),
                      style: {
                        background: '#1a1f2e',
                        border: '1px solid #38bdf8',
                        color: '#e5e7eb',
                        padding: '1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem'
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.background = '#38bdf8'
                        e.currentTarget.style.color = '#000'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.background = '#1a1f2e'
                        e.currentTarget.style.color = '#e5e7eb'
                        e.currentTarget.style.transform = 'scale(1)'
                      }
                    },
                    course.image ? e.createElement('img', {
                      src: course.image,
                      alt: course.name,
                      style: { width: '50px', height: '50px', objectFit: 'contain' }
                    }) : null,
                    e.createElement('div', { style: { fontWeight: 'bold' } }, course.name),
                    e.createElement('div', { style: { fontSize: '0.85rem', opacity: 0.8 } }, course.description)
                  )
                )
              ),
              e.createElement(
                'button',
                {
                  onClick: onClose,
                  style: {
                    background: '#ef4444',
                    border: 'none',
                    color: '#fff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '1.5rem',
                    width: '100%'
                  }
                },
                'Close'
              )
            )
      )
    )
  }

  function App() {
    const [data] = useState(window.PORTFOLIO_DATA || {})
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 })
    const [musicMuted, setMusicMuted] = useState(false)
    const [coursesOpen, setCoursesOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const audioRef = React.useRef(null)

    useEffect(() => {
      if (!audioRef.current) {
        const audio = new Audio('./assets/malice%20mizer%20-%20gekka%20no%20yasoukyoku%20(instrumental%2Bsped%20up).mp3')
        audio.loop = true
        audio.volume = 0.3
        audio.muted = musicMuted
        audioRef.current = audio

        const playAudio = () => {
          audio.play().catch(() => {})
          document.removeEventListener('click', playAudio)
          document.removeEventListener('keydown', playAudio)
          document.removeEventListener('touchstart', playAudio)
        }

        document.addEventListener('click', playAudio)
        document.addEventListener('keydown', playAudio)
        document.addEventListener('touchstart', playAudio)

        audio.play().catch(() => {})

        return () => {
          document.removeEventListener('click', playAudio)
          document.removeEventListener('keydown', playAudio)
          document.removeEventListener('touchstart', playAudio)
          audio.pause()
        }
      } else {
        audioRef.current.muted = musicMuted
      }
      return undefined
    }, [])

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.muted = musicMuted
      }
    }, [musicMuted])

    useEffect(() => {
      // Expose global function for rpg-runner.js to open courses modal
      window.openCoursesModal = () => setCoursesOpen(true)
      return () => {
        delete window.openCoursesModal
      }
    }, [])

    const openLightbox = (images, index) => {
      setLightbox({ isOpen: true, images, index })
    }

    const closeLightbox = () => {
      setLightbox({ ...lightbox, isOpen: false })
    }

    const nextImage = (e) => {
      e.stopPropagation()
      setLightbox((prev) => ({
        ...prev,
        index: (prev.index + 1) % prev.images.length,
      }))
    }

    const prevImage = (e) => {
      e.stopPropagation()
      setLightbox((prev) => ({
        ...prev,
        index: (prev.index - 1 + prev.images.length) % prev.images.length,
      }))
    }

    const profile = data.profile || null

    return e.createElement(
      e.Fragment,
      null,
      e.createElement(Hero, { profile, openLightbox }),
      e.createElement(
        'section',
        { className: 'section' },
        e.createElement(
          'div',
          { className: 'container' },
          e.createElement(ExperienceSection, { experiences: data.experience, embedded: false })
        )
      ),
      e.createElement(
        'section',
        { className: 'section' },
        e.createElement(
          'div',
          { className: 'container' },
          e.createElement(EducationSection, { education: data.education, embedded: false })
        )
      ),
      e.createElement(
        'section',
        { className: 'section' },
        e.createElement(
          'div',
          { className: 'container' },
          e.createElement(SkillsSection, { skills: data.skills, embedded: false })
        )
      ),
      e.createElement(ProjectsSection, { projects: data.projects, openLightbox }),
      e.createElement(ContactSection, {
        profile,
        languages: data.languages,
        interests: data.interests,
      }),
      e.createElement(MusicButton, { isMuted: musicMuted, onToggle: () => setMusicMuted(!musicMuted) }),
      e.createElement(ChatBotButton),
      e.createElement(CoursesModal, { 
        isOpen: coursesOpen, 
        onClose: () => setCoursesOpen(false),
        selectedCourse,
        onSelectCourse: setSelectedCourse,
        courses: data.courses
      }),
      lightbox.isOpen && e.createElement(
          'div',
          {
            className: 'lightbox-overlay',
            style: {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.9)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            },
            onClick: closeLightbox
          },
          e.createElement('button', {
            onClick: closeLightbox,
            style: {
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer'
            }
          }, '×'),
          e.createElement('div', {
            style: { position: 'relative', maxWidth: '90%', maxHeight: '80%' },
            onClick: (e) => e.stopPropagation()
          },
            lightbox.images.length > 1 && e.createElement('button', {
              onClick: prevImage,
              style: {
                position: 'absolute',
                left: '-50px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '50%'
              }
            }, '‹'),
            e.createElement('img', {
              src: lightbox.images[lightbox.index],
              style: { maxWidth: '100%', maxHeight: '80vh', borderRadius: '4px' }
            }),
            lightbox.images.length > 1 && e.createElement('button', {
              onClick: nextImage,
              style: {
                position: 'absolute',
                right: '-50px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '50%'
              }
            }, '›')
          ),
          e.createElement('div', {
            style: { color: '#fff', marginTop: '10px' }
          }, `${lightbox.index + 1} / ${lightbox.images.length}`)
        )
    )
  }

  const root = document.getElementById('root')
  if (root) {
    const r = ReactDOM.createRoot(root)
    r.render(e.createElement(App))
  }
})()

