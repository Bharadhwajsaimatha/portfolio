const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Event Listeners: Handling toggle event
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

toggleSwitch.addEventListener("change", switchTheme, false);

//  Store color theme for future visits

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark"); //add this
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light"); //add this
  }
}

// Save user preference on load

const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

//Adding date

let myDate = document.querySelector("#datee");

const yes = new Date().getFullYear();
myDate.innerHTML = yes;

// Project Search and Filter Functionality
const projectSearchInput = document.getElementById('project-search');
const projectClearBtn = document.getElementById('search-clear');
const projectList = document.querySelectorAll('.project-item');
const filterButtons = document.querySelectorAll('.filter-btn');
let activeFilter = 'all';

// Search functionality
projectSearchInput.addEventListener('input', filterProjects);
projectClearBtn.addEventListener('click', clearSearch);

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    filterProjects();
  });
});

function filterProjects() {
  const searchTerm = projectSearchInput.value.toLowerCase();
  const hasSearchTerm = searchTerm.length > 0;
  
  // Show/hide clear button
  if (hasSearchTerm) {
    projectClearBtn.classList.add('visible');
  } else {
    projectClearBtn.classList.remove('visible');
  }

  const projectContainer = document.querySelector('.project-list');
  let visibleCount = 0;
  let noResultsDiv = document.querySelector('.no-results');

  projectList.forEach(project => {
    const title = project.querySelector('.project-details h3').textContent.toLowerCase();
    const description = project.querySelector('.project-description').textContent.toLowerCase();
    const tech = project.querySelector('.project-tech').textContent.toLowerCase();
    const tags = Array.from(project.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());

    let matchesSearch = true;
    if (hasSearchTerm) {
      matchesSearch = title.includes(searchTerm) || 
                      description.includes(searchTerm) || 
                      tech.includes(searchTerm) || 
                      tags.some(tag => tag.includes(searchTerm));
    }

    let matchesFilter = true;
    if (activeFilter !== 'all') {
      matchesFilter = tags.some(tag => tag.includes(activeFilter.toLowerCase()));
    }

    if (matchesSearch && matchesFilter) {
      project.style.display = 'flex';
      project.style.animation = 'fadeIn 0.3s ease';
      visibleCount++;
    } else {
      project.style.display = 'none';
    }
  });

  // Show no results message
  if (visibleCount === 0) {
    if (!noResultsDiv) {
      noResultsDiv = document.createElement('div');
      noResultsDiv.className = 'no-results';
      noResultsDiv.innerHTML = '<i class="fas fa-search"></i><p>No projects found matching your search.</p>';
      projectContainer.appendChild(noResultsDiv);
    }
    noResultsDiv.style.display = 'block';
  } else {
    if (noResultsDiv) {
      noResultsDiv.style.display = 'none';
    }
  }
}

function clearSearch() {
  projectSearchInput.value = '';
  projectClearBtn.classList.remove('visible');
  filterProjects();
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// GitHub Stats Fetching
const GITHUB_USERNAME = 'Bharadhwajsaimatha';

async function fetchGitHubStats() {
  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    const userData = await userResponse.json();

    // Update stats
    document.getElementById('github-repos').textContent = userData.public_repos;
    document.getElementById('github-followers').textContent = userData.followers;

    // Fetch repositories to calculate stars
    const reposResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=100`
    );
    const repos = await reposResponse.json();
    
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    document.getElementById('github-stars').textContent = totalStars;

    // Create simple contribution visualization
    createContributionVisualization(repos);
  } catch (error) {
    console.log('GitHub API limit reached, showing fallback stats');
    // Fallback values
    document.getElementById('github-repos').textContent = '30+';
    document.getElementById('github-followers').textContent = '50+';
    document.getElementById('github-stars').textContent = '100+';
  }
}

function createContributionVisualization(repos) {
  const topRepos = repos.slice(0, 10);
  const svg = document.getElementById('contribution-graph');
  
  if (!svg) return;

  svg.innerHTML = '';
  
  const maxStars = Math.max(...topRepos.map(r => r.stargazers_count), 1);
  const barWidth = Math.floor((500 - 40) / topRepos.length);
  const maxHeight = 80;

  topRepos.forEach((repo, index) => {
    const barHeight = (repo.stargazers_count / maxStars) * maxHeight;
    const x = 20 + index * barWidth;
    const y = 100 - barHeight;

    // Bar
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth - 4);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', 'currentColor');
    rect.setAttribute('opacity', '0.6');
    rect.setAttribute('rx', '2');
    rect.style.transition = 'opacity 0.3s ease';
    
    rect.addEventListener('mouseenter', () => {
      rect.setAttribute('opacity', '1');
      titleText.style.opacity = '1';
    });
    rect.addEventListener('mouseleave', () => {
      rect.setAttribute('opacity', '0.6');
      titleText.style.opacity = '0';
    });

    svg.appendChild(rect);

    // Tooltip
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleText.textContent = `${repo.name}: ${repo.stargazers_count} ⭐`;
    rect.appendChild(titleText);
  });

  // Add label
  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', '250');
  label.setAttribute('y', '20');
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('font-size', '12');
  label.setAttribute('fill', 'currentColor');
  label.setAttribute('opacity', '0.7');
  label.textContent = `Top 10 repositories by stars`;
  svg.appendChild(label);
}

// Launch GitHub stats on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchGitHubStats);
} else {
  fetchGitHubStats();
}

// Scroll Animations with Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add animation classes based on element type
      if (entry.target.classList.contains('project-item')) {
        entry.target.classList.add('slide-in-left');
      } else if (entry.target.classList.contains('skill-category')) {
        entry.target.classList.add('scale-in');
      } else if (entry.target.classList.contains('achievement-card')) {
        entry.target.classList.add('fade-in');
      } else if (entry.target.classList.contains('publication-item')) {
        entry.target.classList.add('slide-in-right');
      } else if (entry.target.classList.contains('timeline-item')) {
        entry.target.classList.add('fade-in');
      } else if (entry.target.classList.contains('document-card')) {
        entry.target.classList.add('scale-in');
      } else if (entry.target.classList.contains('space-card')) {
        entry.target.classList.add('fade-in');
      } else if (entry.target.classList.contains('github-card')) {
        entry.target.classList.add('slide-in-left');
      } else {
        entry.target.classList.add('fade-in');
      }
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements that should animate
const elementsToObserve = document.querySelectorAll(
  '.project-item, .skill-category, .achievement-card, .publication-item, ' +
  '.timeline-item, .document-card, .space-card, .github-card, ' +
  '.division, .content-text h2, .contact-item'
);

elementsToObserve.forEach(element => {
  // Initial opacity for animation
  element.style.opacity = '0';
  observer.observe(element);
  
  // Ensure animation completes
  element.addEventListener('animationend', () => {
    element.style.opacity = '1';
  }, { once: true });
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
  // Add loading="lazy" to all project, publication, and space images
  const projectImages = document.querySelectorAll(
    '.project-image img, .publication-image img, .space-preview img'
  );
  
  projectImages.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
      img.style.transition = 'opacity 0.3s ease';
    }
  });

  // Fallback for browsers that don't support native lazy loading
  if ('IntersectionObserver' in window && !('loading' in HTMLImageElement.prototype)) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src && !img.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// Fetch Recent Blog Posts
async function fetchBlogPosts() {
  try {
    const response = await fetch(
      'https://loose0ends.wordpress.com/wp-json/wp/v2/posts?per_page=3&orderby=date&order=desc&_embed=true'
    );
    const posts = await response.json();
    
    const blogPostsContainer = document.getElementById('blog-posts');
    if (!blogPostsContainer) return;

    blogPostsContainer.innerHTML = '';

    if (posts.length === 0) {
      blogPostsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6; padding: 2rem;">No posts available...</p>';
      return;
    }

    posts.forEach(post => {
      const postDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E';

      // Clean HTML from excerpt
      const excerpt = post.excerpt.rendered
        .replace(/<[^>]*>/g, '')
        .substring(0, 150) + '...';

      const blogCard = document.createElement('article');
      blogCard.className = 'blog-card';
      blogCard.innerHTML = `
        <img src="${featuredImage}" alt="${post.title.rendered}" class="blog-featured-image" loading="lazy" />
        <div class="blog-content">
          <div class="blog-category">Article</div>
          <h3 class="blog-title">${post.title.rendered}</h3>
          <p class="blog-excerpt">${excerpt}</p>
          <div class="blog-meta">
            <div class="blog-date">
              <i class="fas fa-calendar"></i>
              <span>${postDate}</span>
            </div>
            <a href="${post.link}" target="_blank" class="blog-read-more">
              Read <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
      blogPostsContainer.appendChild(blogCard);
    });
  } catch (error) {
    console.log('Blog posts could not be loaded');
    const blogPostsContainer = document.getElementById('blog-posts');
    if (blogPostsContainer) {
      blogPostsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
          <p>Visit my <a href="https://loose0ends.wordpress.com/" target="_blank" style="color: var(--primary-color);">blog</a> for latest articles</p>
        </div>
      `;
    }
  }
}

// Load blog posts on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchBlogPosts);
} else {
  fetchBlogPosts();
}
