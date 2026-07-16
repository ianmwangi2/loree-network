import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contactDetails } from '../data/mockData';
import { LucideIcon } from '../components/LucideIcon';
import { api } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

const TOPIC_OPTIONS = [
  { value: 'PRODUCT_ENQUIRY', label: 'Product enquiry' },
  { value: 'QUOTE_REQUEST', label: 'Request a quote' },
  { value: 'TECHNICAL_SUPPORT', label: 'Technical support' },
  { value: 'INSTALLATION_BOOKING', label: 'Installation booking' },
  { value: 'PARTNERSHIP', label: 'Partnership / reseller' },
  { value: 'OTHER', label: 'Other' }
];

export const Contact = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contextService, setContextService] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const slug = searchParams.get('service');
    if (!slug) return;

    api
      .get(`/services/${slug}`)
      .then(service => {
        setContextService(service);
        setFormData(prev => ({ ...prev, subject: 'QUOTE_REQUEST' }));
      })
      .catch(() => {});
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { subject, ...rest } = formData;
      await api.post(
        '/contact',
        { ...rest, topic: subject, serviceId: contextService?.id },
        token
      );
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content container">
          <span className="section-eyebrow" style={{ color: '#a7f3d0' }}>
            Get in Touch
          </span>
          <h1 className="contact-hero-title">Let's Talk About Your Project</h1>
          <p className="contact-hero-desc">
            Whether you need a quote, technical advice, or just want to know if a product fits your setup — we're here and happy to help.
          </p>
        </div>
      </div>

      <div className="contact-cards-row container">
        {contactDetails.map(item => {
          const cardContent = (
            <>
              <div className="contact-card-icon-wrap">
                <LucideIcon name={item.icon} size={22} />
              </div>
              <div>
                <div className="contact-card-label">{item.label}</div>
                <div className="contact-card-value">{item.value}</div>
                <div className="contact-card-sub">{item.sub}</div>
              </div>
            </>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              className="contact-card"
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              {cardContent}
            </a>
          ) : (
            <div key={item.label} className="contact-card">
              {cardContent}
            </div>
          );
        })}
      </div>

      <section className="contact-main section container">
        <div className="contact-form-wrap">
          <div className="contact-form-header">
            <LucideIcon name="MessageSquare" size={20} className="contact-form-icon" />
            <h2 className="contact-form-title">Send us a message</h2>
          </div>

          {contextService && !submitted && (
            <div className="contact-service-context">
              Regarding: <strong>{contextService.title}</strong>
            </div>
          )}

          {submitted ? (
            <div className="contact-success">
              <LucideIcon name="CircleCheck" size={48} className="contact-success-icon" />
              <h3>Message received!</h3>
              <p>
                Thanks for reaching out. A member of our team will get back to you within 4 business hours.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  setContextService(null);
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="auth-error">
                  <LucideIcon name="AlertCircle" size={15} />
                  <span>{error}</span>
                </div>
              )}
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">
                    Full name <span className="req">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Mwangi"
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">
                    Email address <span className="req">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.co.ke"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-phone">Phone number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 7xx xxx xxx"
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-subject">
                    Subject <span className="req">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject…</option>
                    {TOPIC_OPTIONS.map(topic => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">
                  Message <span className="req">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, what you need, or any questions you have…"
                  required
                />
              </div>

              <button type="submit" className="btn-primary contact-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="contact-spinner" />
                ) : (
                  <>
                    <LucideIcon name="Send" size={15} />
                    <span>Send message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <aside className="contact-sidebar">
          <div className="contact-sidebar-card">
            <h3 className="contact-sidebar-title">Quick help</h3>
            <ul className="contact-faq">
              <li>
                <strong>Need a product fast?</strong>
                <p>Call us directly — we can confirm stock and arrange same-day dispatch for Nairobi orders.</p>
              </li>
              <li>
                <strong>Requesting a site survey?</strong>
                <p>Fill the form with your location and a brief description. We'll schedule within 48 hours.</p>
              </li>
              <li>
                <strong>After-sales / warranty issue?</strong>
                <p>Email with your order number and we'll connect you with our technical team the same day.</p>
              </li>
            </ul>
          </div>

          <div className="contact-map-card">
            <div className="contact-map-placeholder">
              <LucideIcon name="MapPin" size={32} className="contact-map-pin" />
              <span>Westlands, Nairobi</span>
              <a
                href="https://maps.google.com/?q=Westlands+Nairobi"
                target="_blank"
                rel="noreferrer"
                className="btn-outline contact-map-btn"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
export default Contact;
