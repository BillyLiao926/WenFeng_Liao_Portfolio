const header = document.querySelector(".site-header");
const intro = document.querySelector(".intro");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const finishIntro = () => {
  document.body.classList.remove("is-loading");
  intro?.setAttribute("aria-hidden", "true");
};

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  finishIntro();
} else {
  window.setTimeout(finishIntro, 2050);
  window.setTimeout(() => intro?.remove(), 3100);
  intro?.addEventListener("animationend", (event) => {
    if (event.animationName === "introExit") {
      intro.remove();
    }
  });
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  header.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    header.classList.remove("menu-open");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`,
      );
    });
  },
  {
    threshold: [0.25, 0.4, 0.6],
    rootMargin: "-18% 0px -46% 0px",
  },
);

sections.forEach((section) => sectionObserver.observe(section));

const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.categories?.split(" ") ?? [];
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

const caseStudies = {
  internship: {
    title: "Cross-Border E-Commerce Backend Internship",
    summary:
      "A Junior Java Development Engineer internship at ShenZhen Shentai Chuangjian Technology Co., Ltd, focused on cross-border e-commerce supervision modules, station systems, backend API development, SQL query optimization, interface debugging, and documentation.",
    role: "Junior Java Development Engineer Intern",
    stack: "Java, Spring Boot, Spring Framework, Spring Security, MyBatis, MySQL, Redis, Vue, ApiFox, Swagger",
    report: {
      label: "Download internship report",
      href: "assets/wenfeng-liao-internship-report.pdf",
    },
    impacts: [
      "Worked on functional modules for a cross-border e-commerce supervision system and collaborated with the team on business requirement analysis.",
      "Developed terminal vehicle management features and exposed real-time vehicle status updates through backend APIs and web interface support.",
      "Built and adjusted APIs for document upload, vehicle trajectory image upload, station information queries, and vehicle deletion-reason updates.",
      "Optimized SQL query logic, participated in database design and optimization, and learned about indexing and query performance.",
      "Used interface debugging and documentation tools such as ApiFox and Swagger to support frontend-backend collaboration and subsequent maintenance.",
      "Gained exposure to Redis cache design and optimization concepts, including hotspot data caching and distributed lock implementation.",
    ],
  },
  capstone: {
    title: "Hokohoko Campus Marketplace",
    summary:
      "A capstone second-hand goods exchange platform for campus users. This is my second core showcase after the Shenzhen internship, with major responsibility across backend setup, database/entity design, API development, Stripe payment flows, and front-end page refinement.",
    role: "Backend-heavy full-stack contributor",
    stack: ".NET 9, MongoDB, React, TypeScript, Vite, SignalR, Stripe, REST APIs",
    impacts: [
      "Set up the backend environment, configuration flow, repository pattern, dependency injection, Swagger, CORS, authentication, and deployment-oriented runtime settings.",
      "Designed the database structure and backend entities for products, users, offers, orders, watchlists, conversations, messages, exchange locations, and categories.",
      "Implemented APIs for marketplace workflows including product management, offers, orders, watchlists, users, categories, exchange locations, and payment-related flows.",
      "Developed Stripe Connect onboarding and PaymentIntent-based checkout so accepted offers could move into secure payment and order tracking.",
      "Improved front-end pages and UI presentation, including the marketplace landing experience and payment page polish.",
    ],
  },
  survey: {
    title: "AI-Powered Survey Analysis Platform",
    summary:
      "A supporting full-stack project that extends my backend/API experience into .NET, React, SQL modeling, and OpenAI-powered survey response analysis.",
    role: "Individual full-stack developer",
    stack: "C#, .NET, React, OpenAI API, SQL, REST APIs",
    impacts: [
      "Designed data models for forms, questions, answers, and retrieval flows.",
      "Built RESTful API boundaries between React UI and .NET backend services.",
      "Integrated OpenAI API to turn raw natural language responses into summaries.",
      "Focused on scalable communication patterns and a clean user submission flow.",
    ],
  },
  podcast: {
    title: "Podcast Streaming Web App",
    summary:
      "A team-built web application for browsing podcast categories, streaming audio, and tracking episodes through a Flask and SQLite backend.",
    role: "Team leader for a 3-person course project",
    stack: "Flask, Jinja2, HTML/CSS, SQLite, Git",
    impacts: [
      "Coordinated planning, task allocation, Git collaboration, and delivery rhythm.",
      "Built backend logic for audio streaming, categories, and episode tracking.",
      "Facilitated code reviews and maintained technical documentation.",
      "Balanced practical implementation work with team communication.",
    ],
  },
};

const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalSummary = document.querySelector("#modalSummary");
const modalRole = document.querySelector("#modalRole");
const modalStack = document.querySelector("#modalStack");
const modalImpacts = document.querySelector("#modalImpacts");
const modalActions = document.querySelector("#modalActions");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const study = caseStudies[button.dataset.project];

    if (!study || !modal) {
      return;
    }

    modalTitle.textContent = study.title;
    modalSummary.textContent = study.summary;
    modalRole.textContent = study.role;
    modalStack.textContent = study.stack;
    modalImpacts.replaceChildren(
      ...study.impacts.map((impact) => {
        const item = document.createElement("li");
        item.textContent = impact;
        return item;
      }),
    );
    modalActions?.replaceChildren();

    if (study.report && modalActions) {
      const reportLink = document.createElement("a");
      reportLink.className = "text-action";
      reportLink.href = study.report.href;
      reportLink.download = "";
      reportLink.textContent = study.report.label;
      modalActions.append(reportLink);
    }

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  });
});

modalClose?.addEventListener("click", () => modal?.close());
modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

const stackContent = {
  backend: {
    label: "Internship focus",
    title: "Java backend and API systems",
    copy: "Java, Spring Boot, Spring Framework, MyBatis, MySQL, Redis, Swagger, ApiFox, interface debugging, and documentation from internship work.",
    bullets: [
      "Develop APIs for cross-border e-commerce supervision and station workflows.",
      "Optimize SQL query logic, indexing, and data access behavior.",
      "Use ApiFox, Postman-style testing, and Swagger documentation for interface collaboration.",
    ],
  },
  frontend: {
    label: "User experience",
    title: "Frontend interfaces",
    copy: "React, HTML, CSS, Jinja2 templates, responsive layouts, dynamic form experiences.",
    bullets: [
      "Build responsive pages that communicate backend state clearly.",
      "Create dynamic form flows for data collection and submission.",
      "Keep interfaces simple enough for repeated use.",
    ],
  },
  data: {
    label: "Data foundation",
    title: "Database and cloud fundamentals",
    copy: "MongoDB data model design in the capstone project, plus MySQL, SQLite, SQL modeling, and Microsoft Azure Fundamentals AZ-900.",
    bullets: [
      "Design backend entities and MongoDB collections for marketplace workflows.",
      "Model relational records for forms, questions, answers, podcasts, and episodes.",
      "Use SQL for efficient storage and retrieval flows.",
    ],
  },
  workflow: {
    label: "Delivery style",
    title: "Team workflow",
    copy: "Git collaboration, agile stand-ups, sprint planning, code reviews, documentation, teamwork.",
    bullets: [
      "Contribute in agile routines with clear communication.",
      "Coordinate tasks and reviews in team projects.",
      "Document decisions so future improvements are easier.",
    ],
  },
};

const stackDetail = document.querySelector("#stackDetail");
document.querySelectorAll(".stack-tab").forEach((tabButton) => {
  tabButton.addEventListener("click", () => {
    const content = stackContent[tabButton.dataset.stack];

    if (!content || !stackDetail) {
      return;
    }

    document.querySelectorAll(".stack-tab").forEach((item) => {
      const isActive = item === tabButton;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    stackDetail.innerHTML = `
      <div>
        <span class="detail-label">${content.label}</span>
        <h3>${content.title}</h3>
        <p>${content.copy}</p>
      </div>
      <ul class="capability-list">
        ${content.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
    `;
  });
});

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = {
    name: contactForm.elements.name,
    email: contactForm.elements.email,
    message: contactForm.elements.message,
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  Object.values(fields).forEach((field) => field.classList.remove("is-invalid"));

  const invalidFields = Object.values(fields).filter((field) => {
    if (!field.value.trim()) {
      return true;
    }

    if (field.name === "email" && !emailPattern.test(field.value.trim())) {
      return true;
    }

    return false;
  });

  if (invalidFields.length) {
    invalidFields.forEach((field) => field.classList.add("is-invalid"));
    formStatus.textContent = "Please complete the form with a valid email address.";
    invalidFields[0].focus();
    return;
  }

  const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name.value.trim()}`);
  const body = encodeURIComponent(
    `${fields.message.value.trim()}\n\nFrom: ${fields.name.value.trim()}\nEmail: ${fields.email.value.trim()}`,
  );

  formStatus.textContent = "Opening your email app with the message ready to send.";
  window.location.href = `mailto:billyliao0@gmail.com?subject=${subject}&body=${body}`;
});

const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}
