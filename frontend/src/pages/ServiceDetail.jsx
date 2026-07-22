import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { LucideIcon } from '../components/LucideIcon';

export const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    (async () => {
      try {
        const [svc, all] = await Promise.all([api.get(`/services/${slug}`), api.get('/services')]);
        if (cancelled) return;
        setService(svc);
        setAllServices(all);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return null;

  if (notFound || !service) {
    return (
      <div className="svc-not-found container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1>Service not found</h1>
        <button className="btn-primary" onClick={() => navigate('/services')} style={{ marginTop: '20px' }}>
          Back to Services
        </button>
      </div>
    );
  }

  const sameCategoryImages = allServices
    .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
    .map(s => s.heroImage);
  const otherCategoryImages = allServices
    .filter(s => s.categoryId !== service.categoryId)
    .map(s => s.heroImage);
  const galleryImages = service.gallery && service.gallery.length > 0
    ? service.gallery
    : [service.heroImage, ...sameCategoryImages, ...otherCategoryImages].slice(0, 4);

  return (
    <div className="svc-detail-page">
      <div className="section-header container">
        <span className="section-eyebrow">{service.category?.label}</span>
        <h1 className="section-title">{service.title}</h1>
        <p className="section-subtitle">{service.shortDesc}</p>
      </div>

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
              <Link to={`/contact?service=${service.slug}`} className="btn-primary svc-contact-btn">
                Send an Enquiry <LucideIcon name="ArrowRight" size={14} />
              </Link>
              <a href="tel:+254111244747" className="svc-phone-link">
                <LucideIcon name="Phone" size={14} /> 0111 244747 / 0725 300350
              </a>
            </div>

            <Link to="/services" className="svc-back-link">
              <LucideIcon name="ArrowLeft" size={14} /> <span>All Services</span>
            </Link>
          </aside>
        </div>
      </div>

      {galleryImages.length > 0 && (
        <section className="svc-gallery">
          <div className="container">
            <h2 className="svc-gallery-title">Gallery</h2>
            <div className="svc-gallery-grid">
              {galleryImages.map((src, idx) => (
                <div className="svc-gallery-item" key={idx}>
                  <img src={src} alt={`${service.title} ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default ServiceDetail;
