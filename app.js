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

    const aboutItems =
      profile?.highlights && profile.highlights.length
        ? profile.highlights
        : [
            'Full-stack engineer with strong foundations in Python, Django, React, and Laravel, building secure and scalable systems from ERP platforms to e-commerce and AI-powered agents.',
            'Experienced in microservices and monolithic architectures, testable APIs, and clean data flows across relational and NoSQL databases.',
            'Practical background in B2B/B2C environments, data analytics, and automation that improves operational efficiency and decision-making.',
          ]

    return e.createElement(
      e.Fragment,
      null,
      e.createElement(HeroMedia, { profile }),
      e.createElement(
        'section',
        { id: 'about', className: 'section intro-section' },
        e.createElement(
          'div',
          { className: 'container intro-grid' },
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
              'p',
              { className: 'hero-summary' },
              profile?.summary ||
                'Solution-oriented Software Engineer with 7+ years in full-stack development, data automation, and AI integration. I build secure, scalable web and mobile solutions across B2B/B2C environments, from ERPs and e-commerce to AI-powered agents.'
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
          ),
          e.createElement(
            'div',
            null,
            e.createElement(
              'div',
              { className: 'section-header' },
              e.createElement('h2', { className: 'section-title' }, 'About Me')
            ),
            e.createElement(
              'div',
              { className: 'card about-intro-card' },
              e.createElement(
                'ul',
                { className: 'about-bullets' },
                aboutItems.map(function (item, i) {
                  return e.createElement('li', { key: i }, item)
                })
              )
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
    let groups = []
    if (skills && !Array.isArray(skills)) {
      // Handle object format from data.js
      groups = Object.keys(skills).map(function(key) {
        return {
          name: key,
          skills: skills[key]
        }
      })
    } else if (skills && Array.isArray(skills)) {
      // Handle array format if we kept that
      groups = skills.map(function (c) {
        return {
          name: c.name,
          skills: (c.skills || []).map(function (s) {
            return typeof s === 'string' ? s : s.name
          }),
        }
      })
    } else {
        // Fallback
        groups = [
            {
                name: 'Programming Languages',
                skills: ['Python', 'JavaScript', 'TypeScript', 'PHP'],
            },
            // ... (rest of fallback)
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
                return e.createElement('span', { key: g.name + s }, s)
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
    const [showKeyPrompt, setShowKeyPrompt] = useState(false)
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')

    const sendMessage = async () => {
      if (!input.trim()) return

      if (!apiKey) {
        setShowKeyPrompt(true)
        return
      }

      const userMessage = { role: 'user', content: input }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      try {
        const coursesContext = window.PORTFOLIO_DATA?.courses
          ?.map((c) => `${c.name}: ${c.description}`)
          .join(', ')
        const resumeContext = window.PORTFOLIO_DATA?.profile?.summary || ''

        const context = `You are an AI assistant for Fouad Hammani's portfolio. You can answer questions about:
1. Available courses: ${coursesContext}
2. Experience and resume: ${resumeContext}
3. Skills and expertise
4. Projects and work experience

Please provide helpful, concise answers related to these topics.`

        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
            apiKey,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: context + '\n\nUser question: ' + input,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                maxOutputTokens: 500,
              },
            }),
          }
        )

        if (!response.ok) throw new Error('API Error')

        const data = await response.json()
        const botMessage = {
          role: 'bot',
          content:
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            'I could not process your request. Please try again.',
        }
        setMessages((prev) => [...prev, botMessage])
      } catch (error) {
        const errorMessage = {
          role: 'bot',
          content: 'Sorry, I encountered an error. Please try again later or add a valid API key.',
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }

    const handleSaveApiKey = () => {
      if (apiKey.trim()) {
        localStorage.setItem('gemini_api_key', apiKey)
        setShowKeyPrompt(false)
      }
    }

    return e.createElement(
      e.Fragment,
      null,
      e.createElement(
        'button',
        {
          onClick: () => setIsOpen(!isOpen),
          title: 'Chat with AI Assistant',
          style: {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#06b6d4',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 99,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = '#0891b2'
            e.currentTarget.style.transform = 'scale(1.1)'
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = '#06b6d4'
            e.currentTarget.style.transform = 'scale(1)'
          },
        },
        '💬'
      ),
      isOpen
        ? e.createElement(
            'div',
            {
              style: {
                position: 'fixed',
                bottom: '140px',
                right: '20px',
                width: '350px',
                height: '500px',
                background: '#0b1120',
                borderRadius: '12px',
                border: '2px solid #06b6d4',
                boxShadow: '0 8px 24px rgba(6,182,212,0.3)',
                zIndex: 99,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              },
            },
            e.createElement(
              'div',
              {
                style: {
                  background: '#06b6d4',
                  color: '#000',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              },
              e.createElement('div', { style: { fontWeight: 'bold' } }, '🤖 Speak with me'),
              e.createElement(
                'button',
                {
                  onClick: () => {
                    setIsOpen(false)
                    setMessages([])
                  },
                  style: {
                    background: 'none',
                    border: 'none',
                    color: '#000',
                    fontSize: '20px',
                    cursor: 'pointer',
                  },
                },
                '×'
              )
            ),
            showKeyPrompt
              ? e.createElement(
                  'div',
                  {
                    style: {
                      flex: 1,
                      overflow: 'auto',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      justifyContent: 'center',
                    },
                  },
                  e.createElement(
                    'div',
                    { style: { color: '#9ca3af', fontSize: '0.9rem' } },
                    'To use the AI chatbot, please add your Google Gemini API key:'
                  ),
                  e.createElement('input', {
                    type: 'password',
                    value: apiKey,
                    onChange: (evt) => setApiKey(evt.target.value),
                    placeholder: 'Enter your Gemini API key...',
                    style: {
                      background: '#1a1f2e',
                      border: '1px solid #38bdf8',
                      borderRadius: '6px',
                      color: '#e5e7eb',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                    },
                  }),
                  e.createElement(
                    'button',
                    {
                      onClick: handleSaveApiKey,
                      style: {
                        background: '#06b6d4',
                        border: 'none',
                        color: '#000',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      },
                    },
                    'Save API Key'
                  ),
                  e.createElement(
                    'div',
                    { style: { color: '#60a5fa', fontSize: '0.75rem', textAlign: 'center' } },
                    'Get your free API key from console.cloud.google.com'
                  )
                )
              : e.createElement(
                  e.Fragment,
                  null,
                  e.createElement(
                    'div',
                    {
                      style: {
                        flex: 1,
                        overflow: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      },
                    },
                    messages.length === 0
                      ? e.createElement(
                          'div',
                          {
                            style: {
                              color: '#9ca3af',
                              fontSize: '0.9rem',
                              textAlign: 'center',
                              marginTop: '2rem',
                            },
                          },
                          'Ask me about my courses, experience, or skills!'
                        )
                      : messages.map((msg, idx) =>
                          e.createElement(
                            'div',
                            {
                              key: idx,
                              style: {
                                display: 'flex',
                                justifyContent:
                                  msg.role === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: '0.5rem',
                              },
                            },
                            e.createElement(
                              'div',
                              {
                                style: {
                                  maxWidth: '80%',
                                  padding: '0.75rem 1rem',
                                  borderRadius: '8px',
                                  background:
                                    msg.role === 'user' ? '#06b6d4' : '#1a1f2e',
                                  color:
                                    msg.role === 'user' ? '#000' : '#e5e7eb',
                                  fontSize: '0.9rem',
                                  wordWrap: 'break-word',
                                },
                              },
                              msg.content
                            )
                          )
                        )
                  ),
                  e.createElement(
                    'div',
                    {
                      style: {
                        padding: '1rem',
                        borderTop: '1px solid #1f2933',
                        display: 'flex',
                        gap: '0.5rem',
                      },
                    },
                    e.createElement('input', {
                      type: 'text',
                      value: input,
                      onChange: (evt) => setInput(evt.target.value),
                      onKeyPress: (evt) => {
                        if (evt.key === 'Enter' && !evt.shiftKey) {
                          evt.preventDefault()
                          sendMessage()
                        }
                      },
                      placeholder: 'Ask me something...',
                      disabled: isLoading,
                      style: {
                        flex: 1,
                        background: '#1a1f2e',
                        border: '1px solid #38bdf8',
                        borderRadius: '6px',
                        color: '#e5e7eb',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        outline: 'none',
                      },
                    }),
                    e.createElement(
                      'button',
                      {
                        onClick: sendMessage,
                        disabled: isLoading,
                        style: {
                          background: '#06b6d4',
                          border: 'none',
                          color: '#000',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold',
                          opacity: isLoading ? 0.6 : 1,
                        },
                      },
                      isLoading ? '...' : '→'
                    )
                  )
                )
            )
          )
        : null
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
        const audio = new Audio('./assets/Ayla.mpga')
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
          { className: 'container section-grid-two paired-section-grid' },
          e.createElement(EducationSection, { education: data.education, embedded: true }),
          e.createElement(AboutSection, { awards: data.awards, embedded: true })
        )
      ),
      e.createElement(
        'section',
        { className: 'section' },
        e.createElement(
          'div',
          { className: 'container section-grid-two paired-section-grid' },
          e.createElement(ExperienceSection, { experiences: data.experience, embedded: true }),
          e.createElement(SkillsSection, { skills: data.skills, embedded: true })
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

