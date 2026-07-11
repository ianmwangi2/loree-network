import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceCategories, services } from '../data/mockData';
import { LucideIcon } from '../components/LucideIcon';

const categoryIcons = {
  all: 'Shield',
  surveillance: 'Camera',
  access: 'Lock',
  screening: 'Search',
  automation: 'Settings',
  electrical: 'Zap'
};

const ServiceCard = ({ service, delay }) => {
  const categoryLabel = serviceCategories.find(c => c.id === service.category)?.label;
  const iconName = categoryIcons[service.category] || 'Shield';

  return (
    <Link
      to={`/services/${service.slug}`}
      className="service-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="service-card-image-wrap">
        <img
          src={service.heroImage}
          alt={service.title}
          className="service-card-image"
          loading="lazy"
        />
        <div className="service-card-overlay" />
        <span className="service-card-icon">
          <LucideIcon name={iconName} size={22} />
        </span>
        <span className="service-card-category-badge">{categoryLabel}</span>
      </div>
      <div className="service-card-body">
        <h3 className="service-card-title">{service.title}</h3>
        <p className="service-card-desc">{service.shortDesc}</p>
        <div className="service-card-features">
          {service.features.slice(0, 3).map(feature => (
            <span className="service-feature-tag" key={feature}>
              {feature}
            </span>
          ))}
        </div>
        <span className="service-card-link">
          View Details <LucideIcon name="ArrowRight" size={14} />
        </span>
      </div>
    </Link>
  );
};

export const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-overlay" />
        <div className="container services-hero-content">
          <span className="services-hero-badge">Our Services</span>
          <h1 className="services-hero-title">
            Comprehensive Security &
            <br className="desktop-br" />
            Infrastructure Solutions
          </h1>
          <p className="services-hero-desc">
            From cutting-edge surveillance systems to professional electrical installations — Loree Networks delivers end-to-end solutions that protect what matters most.
          </p>
          <div className="services-hero-stats">
            <div className="stat-item">
              <span className="stat-number">14+</span>
              <span className="stat-label">Core Services</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      <div className="services-tabs-wrap">
        <div className="container">
          <div className="services-tabs">
            {serviceCategories.map(cat => {
              const iconName = categoryIcons[cat.id] || 'Shield';
              return (
                <button
                  key={cat.id}
                  className={`services-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="tab-icon">
                    <LucideIcon name={iconName} size={18} />
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container services-body">
        <div className="services-count-bar">
          <span className="services-count">
            Showing <strong>{filteredServices.length}</strong>{' '}
            {filteredServices.length === 1 ? 'service' : 'services'}
          </span>
          <span className="services-count-desc">Click any card for full details</span>
        </div>
        <div className="services-grid">
          {filteredServices.map((service, idx) => (
            <ServiceCard key={service.id} service={service} delay={idx * 40} />
          ))}
        </div>
      </div>

      <section className="services-cta">
        <div className="container services-cta-inner">
          <div className="services-cta-text">
            <h2>Ready to secure your premises?</h2>
            <p>
              Our engineers are on hand to assess your needs and design a bespoke solution. Get in touch for a free consultation.
            </p>
          </div>
          <div className="services-cta-actions">
            <Link to="/contact" className="btn-primary services-cta-btn">
              Get a Free Quote <LucideIcon name="ArrowRight" size={16} />
            </Link>
            <a
              href="https://wa.me/254700123456"
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp services-cta-btn"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Services;
