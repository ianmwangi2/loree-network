import React from 'react';
import { Link } from 'react-router-dom';
import { homeStats, whyChooseUsList2, servicesSummaries, testimonials } from '../data/mockData';
import { LucideIcon } from '../components/LucideIcon';

export const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-gradient" />
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80"
            alt="Security infrastructure"
            className="hero-bg-img"
          />
        </div>
        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-eyebrow">Kenya's Trusted Security Partner</span>
            <h1 className="hero-title">
              Comprehensive Security &
              <br />
              <span className="hero-title-accent">Infrastructure Solutions</span>
            </h1>
            <p className="hero-desc">
              From cutting-edge surveillance systems to professional electrical installations — we design, supply, install, and support technology that protects what matters most.
            </p>
            <div className="hero-cta">
              <Link to="/services" className="btn-primary hero-btn">
                Explore Services <LucideIcon name="ArrowRight" size={16} />
              </Link>
              <Link to="/contact" className="hero-btn-ghost">
                Request a quote
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            {homeStats.map(stat => (
              <div className="hero-stat" key={stat.label}>
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="trust-bar">
        <div className="trust-bar-inner container">
          {whyChooseUsList2.map(item => (
            <div className="trust-badge" key={item}>
              <LucideIcon name="CircleCheckBig" size={15} className="trust-badge-icon" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section container">
        <div className="section-header">
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-title">End-to-End Security & Infrastructure</h2>
          <p className="section-subtitle">
            We design, install, and support the full lifecycle of your security and infrastructure needs.
          </p>
        </div>
        <div className="services-grid">
          {servicesSummaries.map(svc => (
            <Link to={`/services/${svc.slug}`} className="service-card" key={svc.label}>
              <div className="service-icon-wrap">
                <LucideIcon name={svc.icon} size={26} strokeWidth={1.8} />
              </div>
              <div className="service-card-body">
                <h3 className="service-card-title">{svc.label}</h3>
                <p className="service-card-desc">{svc.desc}</p>
              </div>
              <LucideIcon name="ChevronRight" size={18} className="service-arrow" />
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/services" className="btn-outline">
            View all services <LucideIcon name="ArrowRight" size={15} />
          </Link>
        </div>
      </section>

      <section className="why-section section">
        <div className="container why-inner">
          <div className="why-text">
            <span className="section-eyebrow">Why Choose Us</span>
            <h2 className="section-title">Built on trust, delivered on time</h2>
            <p className="why-desc">
              We've been protecting businesses and infrastructure across Kenya for over 15 years. Every solution we deliver is designed by certified engineers and backed by comprehensive after-sales support.
            </p>
            <ul className="why-list">
              {[
                'Genuine products with full manufacturer warranties',
                'Certified engineers with factory training',
                'After-sales support — not just sales',
                'VAT-registered, official invoicing',
                'Free site surveys for all projects',
                'Rapid response SLA maintenance contracts'
              ].map(item => (
                <li className="why-list-item" key={item}>
                  <LucideIcon name="CircleCheckBig" size={17} className="why-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-primary" style={{ marginTop: 24, alignSelf: 'flex-start' }}>
              Learn more about us <LucideIcon name="ArrowRight" size={15} />
            </Link>
          </div>
          <div className="why-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=700&q=80"
              alt="Engineers working on security system"
              className="why-img"
            />
            <div className="why-img-badge">
              <span className="why-badge-number">15+</span>
              <span className="why-badge-label">Years of excellence</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <span className="section-eyebrow">Client Stories</span>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card" key={t.name}>
              <div className="testimonial-stars">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <LucideIcon key={idx} name="Star" size={14} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <div className="cta-banner-text">
            <h2 className="cta-banner-title">Need a custom security solution?</h2>
            <p className="cta-banner-desc">
              Send us your project requirements and we'll get back within 48 hours with a full proposal.
            </p>
          </div>
          <div className="cta-banner-actions">
            <Link to="/contact" className="btn-primary cta-banner-btn">
              Request a quote <LucideIcon name="ArrowRight" size={15} />
            </Link>
            <a href="tel:+254700123456" className="cta-call-link">
              or call +254 700 123 456
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
