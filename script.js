document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY & SCROLLED NAVBAR ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE MENU DRAWER TOGGLE ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- SCROLL SPY ACTIVE NAV LINK ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpyOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}` || (id === 'hero' && link.getAttribute('href') === '#')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => scrollSpyObserver.observe(section));

  // --- SCROLL REVEAL ANIMATION ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // --- INTERACTIVE AI CAREER PATHFINDER DATA & LOGIC ---
  const pathfinderForm = document.getElementById('pathfinder-form');
  const pathfinderResult = document.getElementById('pathfinder-result');
  const curriculumTitle = document.getElementById('result-curriculum-title');
  const curriculumBadge = document.getElementById('result-curriculum-badge');
  const curriculumDuration = document.getElementById('result-curriculum-duration');
  const curriculumProjects = document.getElementById('result-curriculum-projects');
  const syllabusTimeline = document.getElementById('syllabus-timeline');

  // Syllabus database matching key combinations
  const curriculumData = {
    'beginner-ai': {
      title: 'Prompt Engineering & AI Foundations',
      badge: 'AI Introductory Track',
      duration: '4 Weeks',
      projects: '3 Interactive Projects',
      syllabus: [
        { title: 'Generative AI Basics', desc: 'Understand transformer models, tokenization, and fundamental system prompts.' },
        { title: 'Effective Prompt Structures', desc: 'Master few-shot learning, chain-of-thought engineering, and output parsing.' },
        { title: 'Integrating API Endpoints', desc: 'Connect frontend interfaces with OpenAI, Gemini, and Claude API models.' },
        { title: 'Final Project: AI Newsletter Bot', desc: 'Build an automated web newsletter scraper that generates customized daily briefs.' }
      ]
    },
    'intermediate-ai': {
      title: 'AI Application Developer: RAG & Orchestration',
      badge: 'AI Application Core Track',
      duration: '8 Weeks',
      projects: '4 Portfolio Projects',
      syllabus: [
        { title: 'Vector DBs & Embeddings', desc: 'Learn vector space math, cosine similarities, and index creation in Pinecone/Chroma.' },
        { title: 'Retrieval Augmented Generation (RAG)', desc: 'Design context injection pipelines with chunking strategies and metadata filters.' },
        { title: 'LangChain & Orchestration', desc: 'Coordinate multi-stage LLM prompts, chains, memory buffers, and custom tools.' },
        { title: 'Final Project: Enterprise Knowledge Copilot', desc: 'Build a private PDF search system with contextual AI answer generation.' }
      ]
    },
    'advanced-ai': {
      title: 'Enterprise AI Architect: Multi-Agent Systems',
      badge: 'AI Advanced Track',
      duration: '12 Weeks',
      projects: '5 Production Builds',
      syllabus: [
        { title: 'Agentic Architectures', desc: 'Program autonomous action loops using tools, reflection, and state managers.' },
        { title: 'Multi-Agent Orchestration', desc: 'Deploy collaborative system networks using frameworks like Autogen or CrewAI.' },
        { title: 'Fine-tuning & Local Models', desc: 'Format custom dataset JSONs and fine-tune open-source models using LoRA and QLoRA.' },
        { title: 'Final Project: Automated Dev Agent Swarm', desc: 'Deploy a software agent swarm that writes, tests, and auto-corrects codebases.' }
      ]
    },
    'beginner-web': {
      title: 'Responsive Web Development Foundations',
      badge: 'Frontend Core Track',
      duration: '6 Weeks',
      projects: '3 Responsive Sites',
      syllabus: [
        { title: 'Semantic Web Structure', desc: 'Master semantic HTML5 structures, accessible markup, and layout planning.' },
        { title: 'Modern CSS Layouts', desc: 'Deep dive into Flexbox, Grid, custom HSL color systems, and CSS variables.' },
        { title: 'Interactive Client Logic', desc: 'Learn Javascript loops, array functions, DOM manipulations, and click actions.' },
        { title: 'Final Project: Professional Developer Portfolio', desc: 'Build and deploy a responsive, animated profile layout using custom styles.' }
      ]
    },
    'intermediate-web': {
      title: 'Next-Gen Frontend Engineer: React & Frameworks',
      badge: 'Frontend Application Track',
      duration: '10 Weeks',
      projects: '4 Dynamic Apps',
      syllabus: [
        { title: 'React Core Architecture', desc: 'Understand component lifecycles, state management hooks, and side-effect handles.' },
        { title: 'Next.js Routing & SSR', desc: 'Structure apps using app router file trees, Server Components, and API routes.' },
        { title: 'State Engine Management', desc: 'Use React Context, Zustand, or Redux for advanced cross-page state structures.' },
        { title: 'Final Project: SaaS Workspace Dashboard', desc: 'Implement a multi-tab dashboard with interactive chart widgets and API integrations.' }
      ]
    },
    'advanced-web': {
      title: 'Performance-First Web Scale Architect',
      badge: 'Engineering Leadership Track',
      duration: '12 Weeks',
      projects: '4 High-Performance Apps',
      syllabus: [
        { title: 'Webpack & Vite Bundle Optimization', desc: 'Optimize code-splitting, tree shaking, dynamic imports, and asset compression.' },
        { title: 'Edge Servers & Global CDNs', desc: 'Deploy dynamic edge routing, ISR models, and server-side cache strategies.' },
        { title: 'Web Vitals & Performance Diagnostics', desc: 'Profile JS execution, layout shifts, paint times, and accessibility metrics.' },
        { title: 'Final Project: Real-time Multi-User Editor', desc: 'Build an editor with CRDT-based sync engines, running on Vercel Edge Networks.' }
      ]
    },
    'beginner-agents': {
      title: 'Logic Foundations & Script Automation',
      badge: 'Automation Basics Track',
      duration: '6 Weeks',
      projects: '2 Automations',
      syllabus: [
        { title: 'Computational Logic', desc: 'Learn standard control flows, functions, loops, and async file readers.' },
        { title: 'API Integration Basics', desc: 'Master basic fetch and axios patterns to communicate with public REST endpoints.' },
        { title: 'Automation Scripts', desc: 'Build simple Node.js scripts to rename folders, parse CSV files, and trigger webhooks.' }
      ]
    },
    'intermediate-agents': {
      title: 'Agentic System Architect: Planning & Tool Use',
      badge: 'Agent Core Engineering Track',
      duration: '10 Weeks',
      projects: '4 Complex Systems',
      syllabus: [
        { title: 'Function Calling Paradigms', desc: 'Learn JSON schemas, tool definitions, and parsing structured model outputs.' },
        { title: 'State & Memory Architecture', desc: 'Implement state manager databases, conversation histories, and vector memory pools.' },
        { title: 'Agent Reflection Loops', desc: 'Build self-correcting prompt cycles where agents test and rewrite output results.' },
        { title: 'Final Project: Multi-Tool Research Assistant', desc: 'Build an agent that queries search engines, downloads PDFs, and writes formatted reports.' }
      ]
    },
    'advanced-agents': {
      title: 'Autonomous Multi-Agent Systems & Orchestrators',
      badge: 'Agent Systems Expert Track',
      duration: '14 Weeks',
      projects: '6 Enterprise Pipelines',
      syllabus: [
        { title: 'Decentralized Task Routing', desc: 'Design dynamic systems that evaluate complex tasks and delegate components to subagents.' },
        { title: 'Concerted Multi-Agent Systems', desc: 'Define hierarchies, consensus mechanisms, and inter-agent message queues.' },
        { title: 'Agentic Safety & Guardrails', desc: 'Configure LLM query cost monitors, rate limit managers, and code execution sandboxes.' },
        { title: 'Final Project: Autonomous Product Team', desc: 'Build a system containing a PM agent, developer agent, and QA agent that auto-creates simple sites.' }
      ]
    },
    'beginner-design': {
      title: 'UI/UX Interface & Aesthetic Design Basics',
      badge: 'Design Starter Track',
      duration: '4 Weeks',
      projects: '3 Figma Mockups',
      syllabus: [
        { title: 'Visual Hierarchy Basics', desc: 'Master visual scales, grids, modern sans-serif typography, and alignment.' },
        { title: 'Modern Color Theory', desc: 'Implement accessible contrast rules, HSL color models, and dark/light color modes.' },
        { title: 'Figma Layout & Prototyping', desc: 'Build modular design components, auto-layouts, and simple slide transitions.' }
      ]
    },
    'intermediate-design': {
      title: 'Interactive Frontend UX & Creative Styling',
      badge: 'Creative Frontend Design Track',
      duration: '8 Weeks',
      projects: '4 Custom CSS Builds',
      syllabus: [
        { title: 'Advanced CSS Aesthetics', desc: 'Master glassmorphism, glowing backdrop filters, multi-stop gradients, and box-shadow layers.' },
        { title: 'Web Animations & Transitions', desc: 'Use CSS keyframes, transition variables, cubic-bezier timing functions, and SVG animations.' },
        { title: 'Layout Interaction Engines', desc: 'Implement interactive tabs, expandable drawers, slide sheets, and custom selectors.' },
        { title: 'Final Project: Immersive Landing Page', desc: 'Develop a highly interactive UI/UX presentation showing dynamic hover responses.' }
      ]
    },
    'advanced-design': {
      title: 'Scale-Free Design Systems & UI Engines',
      badge: 'Design System Architect Track',
      duration: '12 Weeks',
      projects: '5 Core Libraries',
      syllabus: [
        { title: 'Design System Tokens', desc: 'Organize design systems using JSON tokens for spacing, typography, and motion paths.' },
        { title: 'Component Library Engineering', desc: 'Construct clean, reusable web components utilizing state-driven animation tokens.' },
        { title: 'Motion Physics & Micro-Interactions', desc: 'Design high-end feedback systems that simulate physics-based drag-and-drop structures.' },
        { title: 'Final Project: Enterprise Component Workspace', desc: 'Publish a modular CSS/JS UI framework containing premium micro-animations.' }
      ]
    }
  };

  if (pathfinderForm) {
    pathfinderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const expLevel = document.getElementById('experience-level').value;
      const trackVal = document.getElementById('interest-track').value;
      const key = `${expLevel}-${trackVal}`;
      const data = curriculumData[key];

      if (data) {
        // Set metadata
        curriculumTitle.textContent = data.title;
        curriculumBadge.textContent = data.badge;
        curriculumDuration.textContent = data.duration;
        curriculumProjects.textContent = data.projects;

        // Clear timeline
        syllabusTimeline.innerHTML = '';

        // Inject steps
        data.syllabus.forEach((step, idx) => {
          const stepDiv = document.createElement('div');
          stepDiv.className = 'syllabus-step';
          stepDiv.innerHTML = `
            <div class="step-num">${idx + 1}</div>
            <div class="step-info">
              <h5>${step.title}</h5>
              <p>${step.desc}</p>
            </div>
          `;
          syllabusTimeline.appendChild(stepDiv);
        });

        // Reveal panel
        pathfinderResult.style.display = 'block';

        // Smooth scroll to results
        setTimeout(() => {
          pathfinderResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  }

  // --- CONTACT FORM VALIDATION & SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameField = document.getElementById('contact-name');
      const emailField = document.getElementById('contact-email');
      const messageField = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');

      // Clear previous styles/messages
      formFeedback.className = 'form-message';
      formFeedback.style.display = 'none';

      // Check fields
      if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
        showFeedback('Please fill out all fields before submitting.', 'error');
        return;
      }

      if (!validateEmail(emailField.value)) {
        showFeedback('Please enter a valid email address.', 'error');
        return;
      }

      // POST to Express backend
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            message: messageField.value.trim(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          showFeedback(data.message, 'success');
          contactForm.reset();
        } else {
          const errMsg = data.errors ? data.errors.map(e => e.msg).join(', ') : (data.error || 'Something went wrong.');
          showFeedback(errMsg, 'error');
        }
      } catch (networkErr) {
        showFeedback('Network error. Please check your connection and try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  // Helper validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showFeedback(msg, type) {
    formFeedback.textContent = msg;
    formFeedback.style.display = 'block';
    if (type === 'success') {
      formFeedback.classList.add('success');
      formFeedback.style.border = '1px solid rgba(16, 185, 129, 0.2)';
      formFeedback.style.color = '#34d399';
      formFeedback.style.background = 'rgba(16, 185, 129, 0.1)';
    } else {
      formFeedback.style.border = '1px solid rgba(244, 63, 94, 0.2)';
      formFeedback.style.color = '#f43f5e';
      formFeedback.style.background = 'rgba(244, 63, 94, 0.1)';
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --- NEWSLETTER SIMULATION ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-input');
      const btn   = document.getElementById('newsletter-submit-btn');
      if (!input || !input.value.trim()) return;

      btn.disabled = true;

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: input.value.trim() }),
        });
        const data = await response.json();
        // Show a small toast-style alert in the footer
        const msg = data.message || (data.success ? 'Subscribed! 🎉' : (data.error || 'Error subscribing.'));
        alert(msg);
        if (data.success) newsletterForm.reset();
      } catch {
        alert('Network error. Please try again.');
      } finally {
        btn.disabled = false;
      }
    });
  }
});
