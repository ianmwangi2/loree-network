import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { services, serviceCategories } from '../data/mockData';
import { LucideIcon } from '../components/LucideIcon';

const categoryIcons = {
  all: 'Shield',
  surveillance: 'Camera',
  access: 'Lock',
  screening: 'Search',
  automation: 'Settings',
  electrical: 'Zap'
};

export const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const service = services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="svc-not-found container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1>Service not found</h1>
        <button className="btn-primary" onClick={() => navigate('/services')} style={{ marginTop: '20px' }}>
          Back to Services
        </button>
      </div>
    );
  }

  // Get related services (same category, excluding this one)
  const relatedServices = services
    .filter(s => s.category === service.category && s.id !== service.id)
    .slice(0, 3);

  const categoryLabel = serviceCategories.find(c => c.id === service.category)?.label;
  const iconName = categoryIcons[service.category] || 'Shield';

  return (
    <div className="svc-detail-page">
      <section className="svc-hero" style={{ backgroundImage: `url(${service.heroImage})` }}>
        <div className="svc-hero-overlay" />
        <div className="container svc-hero-content">
          <nav className="svc-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>{service.title}</span>
          </nav>
          <span className="svc-category-badge">{categoryLabel}</span>
          <h1 className="svc-hero-title">
            <span className="svc-hero-icon">
              <LucideIcon name={iconName} size={28} />
            </span>
            {service.title}
          </h1>
          <p className="svc-hero-desc">{service.shortDesc}</p>
          <div className="svc-hero-actions">
            <Link to="/contact" className="btn-primary svc-hero-btn">
              Get a Quote <LucideIcon name="ArrowRight" size={15} />
            </Link>
            <a href="tel:+254700123456" className="svc-call-btn">
              <LucideIcon name="Phone" size={15} /> Call Us Now
            </a>
          </div>
        </div>
      </section>

      <div className="container svc-main">
        <div className="svc-layout">
          <div className="svc-content">
            <section className="svc-section">
              <h2 className="svc-section-title">Service Overview</h2>
              <p className="svc-overview-text">{service.overview}</p>
            </section>
            <section className="svc-section">
              <h2 className="svc-section-title">What We Deliver</h2>
              <div className="svc-details-list">
                {service.details.map((detail, idx) => (
                  <div className="svc-detail-item" key={idx}>
                    <div className="svc-detail-number">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="svc-detail-body">
                      <h3 className="svc-detail-heading">{detail.heading}</h3>
                      <p className="svc-detail-text">{detail.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="svc-sidebar">
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">Key Features</h3>
              <ul className="svc-features-list">
                {service.features.map(feat => (
                  <li className="svc-feature-item" key={feat}>
                    <LucideIcon name="CircleCheck" size={16} className="svc-feature-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="svc-sidebar-card svc-contact-card">
              <h3 className="svc-sidebar-title">Enquire About This Service</h3>
              <p className="svc-contact-text">
                Our team will get back to you within 2 business hours.
              </p>
              <Link to="/contact" className="btn-primary svc-contact-btn">
                Send an Enquiry <LucideIcon name="ArrowRight" size={14} />
              </Link>
              <a href="tel:+254700123456" className="svc-phone-link">
                <LucideIcon name="Phone" size={14} /> +254 700 123 456
              </a>
            </div>

            <Link to="/services" className="svc-back-link">
              <LucideIcon name="ArrowLeft" size={14} /> <span>All Services</span>
            </Link>
          </aside>
        </div>
      </div>

      {relatedServices.length > 0 && (
        <section className="svc-related">
          <div className="container">
            <h2 className="svc-related-title">Related Services</h2>
            <div className="svc-related-grid">
              {relatedServices.map(rel => {
                const relIconName = categoryIcons[rel.category] || 'Shield';
                return (
                  <Link to={`/services/${rel.slug}`} className="svc-related-card" key={rel.id}>
                    <div className="svc-related-image-wrap">
                      <img src={rel.heroImage} alt={rel.title} loading="lazy" />
                      <div className="svc-related-overlay" />
                      <span className="svc-related-icon">
                        <LucideIcon name={relIconName} size={18} />
                      </span>
                    </div>
                    <div className="svc-related-body">
                      <h4>{rel.title}</h4>
                      <p>{rel.shortDesc}</p>
                      <span className="svc-related-link">
                        Learn more <LucideIcon name="ArrowRight" size={13} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default ServiceDetail;
