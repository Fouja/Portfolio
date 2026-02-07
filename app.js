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

  function Hero({ profile }) {
    const subtitle =
      profile?.hero_subtitle ||
      'Full-Stack Engineer · Python · Django · React · Laravel'
    const typed = typedTextHook(subtitle)

    return e.createElement(
      'section',
      { id: 'hero', className: 'hero-section' },
      e.createElement(
        'div',
        { className: 'container hero-grid' },
        e.createElement(
          'div',
          null,
          e.createElement('div', { className: 'hero-eyebrow' }, '</> CodeCrafted'),
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
            )
          )
        ),
        e.createElement(HeroIllustration, { profile })
      )
    )
  }

  function HeroIllustration({ profile }) {
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
          ? e.createElement('img', { src: profile.photo, alt: profile.name, className: 'profile-photo' })
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

  function AboutSection({ profile, awards }) {
    const items = [
      'Full-stack engineer with strong foundations in Python, Django, React, and Laravel, building secure and scalable systems from ERP platforms to e-commerce and AI-powered agents.',
      'Experienced in microservices and monolithic architectures, testable APIs, and clean data flows across relational and NoSQL databases.',
      'Practical background in B2B/B2C environments, data analytics, and automation—delivering solutions that improve operational efficiency and decision-making.',
    ]

    return e.createElement(
      'section',
      { id: 'about', className: 'section' },
      e.createElement(
        'div',
        { className: 'container section-grid-two' },
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
            { className: 'card' },
            e.createElement(
              'p',
              { className: 'about-text' },
              profile?.summary ||
                "I’m Fouad, a solution-oriented software engineer with 7+ years of experience in full-stack development, data automation, and AI integration. I focus on crafting maintainable, secure solutions that bridge backend robustness with clean user experiences."
            ),
            e.createElement(
              'ul',
              { className: 'about-bullets' },
              items.map(function (item, i) {
                return e.createElement('li', { key: i }, item)
              })
            )
          )
        ),
        e.createElement(AboutAwards, { awards })
      )
    )
  }

  function AboutAwards({ awards }) {
    const fallback = [
      'Python & Django Certification – W3Schools (2024)',
      'Full-Stack Web Developer Training – Sonelgaz (2021)',
      'Soft Skills & Canadian Workplace Culture – SOPA Pre-Arrival Canada Program',
    ]

    const list =
      awards && awards.length
        ? awards.map(function (a) {
            const year = a.year ? ' ' + a.year : ''
            const issuer = a.issuer ? ' – ' + a.issuer : ''
            return a.title + issuer + year
          })
        : fallback

    return e.createElement(
      'div',
      null,
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
  }

  function EducationSection({ education }) {
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

    return e.createElement(
      'section',
      { id: 'education', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
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
    )
  }

  function ExperienceSection({ experiences }) {
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

    return e.createElement(
      'section',
      { id: 'experience', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
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
              exp.description
                ? e.createElement(
                    'div',
                    { className: 'timeline-body' },
                    exp.description
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
    )
  }

  function ProjectsSection({ projects }) {
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
            {
              id: 2,
              title: 'Secure E-commerce Platform',
              subtitle: 'Django + React',
              description:
                'Full e-commerce platform with JWT/OAuth2 auth, admin analytics, live messaging, and hardened XSS protection deployed on a Linux VPS with SSL.',
              tech_stack:
                'Django, DRF, React, PostgreSQL, JWT, OAuth2, Docker, Nginx',
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
            const imageUrl = p.image_url || (p.images && p.images.length > 0 ? p.images[0] : null)
            return e.createElement(
              'article',
              { key: p.id || p.title, className: 'project-card' },
              e.createElement(
                'div',
                { className: 'project-image-wrap' },
                imageUrl
                  ? e.createElement('img', {
                      src: imageUrl,
                      alt: p.title,
                      className: 'project-image',
                    })
                  : null
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

  function SkillsSection({ skills }) {
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

    return e.createElement(
      'section',
      { id: 'skills', className: 'section' },
      e.createElement(
        'div',
        { className: 'container' },
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
                  '+213797468501 (Available for Canadian relocation)'
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
            'If you are looking for a full-stack engineer who can move from architecture and backend design to clean, production-ready frontends, I would be happy to talk. I am open to opportunities across Canada, with particular interest in Toronto, Vancouver, and Montreal.',
            e.createElement('br'),
            e.createElement('br'),
            'Feel free to reach out by email or LinkedIn—I’d love to hear about what you are building.'
          )
        )
      )
    )
  }

  function App() {
    const [data] = useState(window.PORTFOLIO_DATA || {})

    const profile = data.profile || null
    return e.createElement(
      e.Fragment,
      null,
      e.createElement(Hero, { profile }),
      e.createElement(AboutSection, { profile, awards: data.awards }),
      e.createElement(EducationSection, { education: data.education }),
      e.createElement(ExperienceSection, { experiences: data.experience }), // Note: 'experiences' in API but 'experience' in data.js
      e.createElement(ProjectsSection, { projects: data.projects }),
      e.createElement(SkillsSection, { skills: data.skills }), // Note: 'skillCategories' in API but 'skills' in data.js
      e.createElement(ContactSection, {
        profile,
        languages: data.languages,
        interests: data.interests,
      })
    )
  }

  const root = document.getElementById('root')
  if (root) {
    const r = ReactDOM.createRoot(root)
    r.render(e.createElement(App))
  }
})()

