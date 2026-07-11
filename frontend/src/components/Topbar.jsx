import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { marqueeItems } from '../data/mockData';

export const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-marquee-wrapper">
        <div className="topbar-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span className="topbar-marquee-item" key={idx}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="topbar-info container">
        <a href="tel:+254700123456" className="topbar-info-item">
          <Phone size={13} strokeWidth={2.2} />
          <span>Call us: +254700123456</span>
        </a>
        <a href="mailto:info@loreenetworks.co.ke" className="topbar-info-item">
          <Mail size={13} strokeWidth={2.2} />
          <span>info@loreenetworks.co.ke</span>
        </a>
      </div>
    </div>
  );
};
