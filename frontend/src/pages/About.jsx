import React from 'react';
import { Link } from 'react-router-dom';
import { aboutStats, clienteleList, companyValues, servicesWithItems, whyChooseUsList1 } from '../data/mockData';
import { LucideIcon } from '../components/LucideIcon';

export const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay" />
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80"
          alt="LOREE Network Solutions team at work"
          className="about-hero-img"
        />
        <div className="about-hero-content container">
          <span className="section-eyebrow" style={{ color: '#a7f3d0' }}>
            Corporate Profile
          </span>
          <h1 className="about-hero-title">LOREE Network Solutions</h1>
          <p className="about-hero-desc">
            A premier provider of integrated security, surveillance, and automation systems — delivering innovative and reliable technology solutions to corporate, government, commercial, and residential clients across East Africa.
          </p>
        </div>
      </div>

      <div className="about-stats-bar container">
        {aboutStats.map(stat => (
          <div className="about-stat" key={stat.label}>
            <span className="about-stat-value">{stat.value}</span>
            <span className="about-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="section about-story container">
        <div className="about-story-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=700&q=80"
            alt="LOREE Network Solutions operations"
            className="about-story-img"
          />
        </div>
        <div className="about-story-text">
          <span className="section-eyebrow">Company Overview</span>
          <h2 className="section-title">Who We Are</h2>
          <p>
            LOREE Network Solutions is a premier provider of integrated security, surveillance, and automation systems, dedicated to delivering innovative and reliable technology solutions. We serve a diverse clientele including corporate organisations, government institutions, commercial facilities, and residential developments.
          </p>
          <p>
            With a strong focus on quality, efficiency, and customer satisfaction, we combine technical expertise with industry-leading products to design and implement systems that enhance security, streamline operations, and safeguard assets.
          </p>
          <p>
            From initial consultation through to installation and after-sales support, our approach is professional, responsive, and tailored to each client's unique requirements.
          </p>
          <div className="clientele-chips">
            {clienteleList.map(item => (
              <div className="clientele-chip" key={item.label}>
                <LucideIcon name={item.icon} size={15} /> <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section mvv-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Purpose</span>
            <h2 className="section-title">Mission, Vision & Values</h2>
          </div>
          <div className="mvv-top-row">
            <div className="mvv-card mvv-mission">
              <div className="mvv-icon-wrap">
                <LucideIcon name="Target" size={22} />
              </div>
              <h3 className="mvv-title">Our Mission</h3>
              <p className="mvv-text">
                To deliver cutting-edge, dependable, and cost-effective security and technology solutions that protect lives, secure assets, and empower our clients to operate with confidence.
              </p>
            </div>
            <div className="mvv-card mvv-vision">
              <div className="mvv-icon-wrap">
                <LucideIcon name="Eye" size={22} />
              </div>
              <h3 className="mvv-title">Our Vision</h3>
              <p className="mvv-text">
                To be a recognised leader in security and network solutions, distinguished by innovation, excellence, and an unwavering commitment to customer satisfaction.
              </p>
            </div>
          </div>
          <div className="values-grid">
            {companyValues.map(val => (
              <div className="value-card" key={val.title}>
                <div className="value-icon-wrap" style={{ background: val.bg, color: val.color }}>
                  <LucideIcon name={val.icon} size={24} />
                </div>
                <h4 className="value-title">{val.title}</h4>
                <p className="value-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What We Do</span>
            <h2 className="section-title">Our Core Services</h2>
            <p className="section-subtitle">
              Five specialised divisions covering the full spectrum of security and infrastructure needs.
            </p>
          </div>
          <div className="cp-services-grid">
            {servicesWithItems.map(svc => (
              <div className="cp-service-card" key={svc.title}>
                <div className="cp-service-icon">
                  <LucideIcon name={svc.icon} size={22} />
                </div>
                <h3 className="cp-service-title">{svc.title}</h3>
                <ul className="cp-service-list">
                  {svc.items.map(item => (
                    <li key={item}>
                      <LucideIcon name="CircleCheck" size={13} className="cp-service-check" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/services" className="btn-primary">
              Explore All Services <LucideIcon name="ArrowRight" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section why-choose-section">
        <div className="container why-choose-inner">
          <div className="why-choose-text">
            <span className="section-eyebrow">Why Choose Us</span>
            <h2 className="section-title">The LOREE Advantage</h2>
            <p className="why-choose-desc">
              We combine deep technical expertise, industry-leading products, and a client-first approach to deliver results that go beyond the brief — from initial design through to long-term support.
            </p>
            <ul className="why-list">
              {whyChooseUsList1.map(item => (
                <li className="why-list-item" key={item}>
                  <LucideIcon name="CircleCheckBig" size={17} className="why-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary" style={{ marginTop: 28, alignSelf: 'flex-start' }}>
              Get in Touch <LucideIcon name="ArrowRight" size={15} />
            </Link>
          </div>
          <div className="why-choose-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=700&q=80"
              alt="LOREE engineers at work"
              className="why-img"
            />
            <div className="why-choose-img-wrap-badge" style={{ display: 'none' }}>
              {/* Optional badge or overlay */}
            </div>
            <div className="why-img-badge">
              <span className="why-badge-number">15+</span>
              <span className="why-badge-label">Years of excellence</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta container">
        <div className="about-cta-inner">
          <div>
            <h2 className="about-cta-title">Ready to secure your premises?</h2>
            <p className="about-cta-desc">Get a no-obligation site survey and tailored proposal within 48 hours.</p>
          </div>
          <div className="about-cta-btns">
            <Link to="/contact" className="btn-primary">
              Request a Quote <LucideIcon name="ArrowRight" size={15} />
            </Link>
            <Link
              to="/services"
              className="btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
