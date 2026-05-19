// === DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initAccordion();
  initFadeIn();
  fetchReviews();
  initCounters();
});

// === NAV SCROLL ===
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}

// === MOBILE MENU ===
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translateY(7px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

// === ACCORDION ===
function initAccordion() {
  document.querySelectorAll('.spec-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.spec-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// === SCROLL FADE IN ===
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// === COUNTER ANIMATION ===
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 20);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// === FETCH REVIEWS (FREE – no API key needed) ===
async function fetchReviews() {
  const grid = document.getElementById('reviews-grid');
  const ratingEl = document.getElementById('rating-num');
  const totalEl = document.getElementById('rating-total');
  if (!grid) return;

  try {
    const res = await fetch('/api/reviews');
    const data = await res.json();

    // Update overall rating display
    if (ratingEl && data.rating) ratingEl.textContent = parseFloat(data.rating).toFixed(1);
    if (totalEl && data.total) totalEl.textContent = `Based on ${data.total}+ patient reviews`;

    // Add "View on Google Maps" link
    const mapsLink = document.getElementById('maps-link');
    if (mapsLink && data.maps_link) {
      mapsLink.href = data.maps_link;
      mapsLink.style.display = 'inline-flex';
    }

    const reviews = data.reviews || [];
    if (reviews.length > 0) {
      grid.innerHTML = '';
      reviews.forEach((review, i) => {
        const card = createReviewCard(review);
        card.classList.add('fade-in');
        grid.appendChild(card);
        setTimeout(() => card.classList.add('visible'), i * 100 + 100);
      });
    } else {
      grid.innerHTML = '<div class="reviews-error"><p>No reviews available at this time.</p></div>';
    }
  } catch (err) {
    console.error('Reviews fetch error:', err);
    grid.innerHTML = '<div class="reviews-error"><p>Could not load reviews. Please try again later.</p></div>';
  }
}

function createReviewCard(review) {
  const div = document.createElement('div');
  div.className = 'review-card';
  const name = review.author_name || review.name || 'Patient';
  const text = review.text || review.comment || '';
  const rating = review.rating || 5;
  const time = review.relative_time_description || review.date || '';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  div.innerHTML = `
    <div class="review-top">
      <div class="review-avatar">${initials}</div>
      <div class="review-meta">
        <div class="name">${name}</div>
        <div class="date">${time}</div>
      </div>
    </div>
    <div class="review-stars">${stars}</div>
    <p class="review-text">${text.slice(0, 220)}${text.length > 220 ? '...' : ''}</p>
  `;
  return div;
}


