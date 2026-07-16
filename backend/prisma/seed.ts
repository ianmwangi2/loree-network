import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

const CATEGORIES = [
  { id: 'surveillance', label: 'Security & Surveillance' },
  { id: 'access', label: 'Access Control & Monitoring' },
  { id: 'screening', label: 'Screening & Detection' },
  { id: 'automation', label: 'Automation & Infrastructure' },
  { id: 'electrical', label: 'Electrical Engineering' }
];

const SERVICES = [
  {
    slug: 'cctv-systems',
    categoryId: 'surveillance',
    title: 'Closed-Circuit Television (CCTV) Systems',
    shortDesc: 'End-to-end CCTV design, supply, and installation for residential, commercial, and industrial sites.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    overview: 'Our CCTV solutions deliver 24/7 surveillance coverage using the latest IP-based and HD-analogue technology. From single-camera domestic setups to multi-site enterprise networks, we design and install systems that give you clear, reliable footage exactly where you need it.',
    details: [
      { heading: 'System Design & Consultation', body: 'Our engineers perform a full site survey to determine optimal camera placement, field-of-view coverage, and lighting conditions. We produce a detailed layout plan and bill of materials before a single cable is run.' },
      { heading: 'IP & HD-Analogue Cameras', body: 'We supply and install cameras from leading brands including Hikvision, Dahua, and Axis. Options range from 2MP dome cameras for indoor use to 4K PTZ cameras for large perimeter coverage, including varifocal, fisheye, and thermal variants.' },
      { heading: 'Network Video Recorders (NVRs)', body: 'Central recording is handled by enterprise-grade NVRs with H.265+ compression, RAID storage support, and remote viewing capability via web browser or mobile app. We configure retention schedules to meet regulatory requirements.' },
      { heading: 'Night Vision & Low-Light Performance', body: 'ColorVu and DarkFighter technologies ensure full-colour images in near-zero light conditions, eliminating the grainy monochrome footage of older systems. IR illuminators extend detection ranges to 100 m and beyond.' },
      { heading: 'Remote Monitoring & Alerts', body: 'All systems are integrated with cloud platforms and mobile apps for real-time alerts, event playback, and live view from any device, anywhere in the world. AI-driven motion analytics reduce false alarms by up to 95%.' },
      { heading: 'Maintenance & Support', body: 'We offer 12-month and 24-month service-level agreements (SLAs) covering preventive maintenance visits, software updates, health checks, and priority call-out response within 4 hours.' }
    ],
    features: ['4K & H.265+ compression', 'AI-powered motion analytics', 'Remote mobile & web access', 'IR range up to 100 m', 'RAID storage redundancy', 'SLA maintenance contracts']
  },
  {
    slug: 'wireless-alarm-systems',
    categoryId: 'surveillance',
    title: 'Wireless Alarm Systems',
    shortDesc: 'Fully wireless, app-controlled intruder alarm systems with instant alert notifications.',
    heroImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80',
    overview: 'Our wireless alarm solutions eliminate the mess and cost of traditional cable runs while delivering the same security performance. Using encrypted 433 MHz and Z-Wave radio protocols, devices communicate reliably over 200 m and are immune to line cutting.',
    details: [
      { heading: 'Wireless Architecture', body: 'All sensors, keypads, and sirens communicate wirelessly to a central control panel, enabling rapid installation without wall chasing. Battery-backed devices maintain operation during power cuts.' },
      { heading: 'Sensor Suite', body: 'We deploy PIR motion sensors, door/window magnetic contacts, glass-break detectors, vibration sensors, and panic buttons tailored to the threat profile of your premises.' },
      { heading: 'Smart App Control', body: 'Arm, disarm, and check system status from your smartphone. Push notifications alert you the moment an intrusion is detected, with event logs and live camera integration available within the same app.' },
      { heading: 'Professional Monitoring', body: 'Optional 24/7 central station monitoring with police or private-response dispatch is available through our partner monitoring centres, providing an additional layer of protection when you are away.' }
    ],
    features: ['No cable runs required', 'Encrypted radio communication', 'Smart app control & alerts', 'Battery backup (up to 72 h)', 'Optional 24/7 central monitoring', 'Pet-immune PIR sensors']
  },
  {
    slug: 'fire-detection-alarm-systems',
    categoryId: 'surveillance',
    title: 'Fire Detection and Alarm Systems',
    shortDesc: 'Addressable and conventional fire detection systems, BS EN 54 compliant, designed and installed by certified engineers.',
    heroImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
    overview: 'Life safety is our highest priority. We design, supply, install, commission, and maintain fire detection and alarm systems in compliance with BS EN 54 and local fire authority requirements. Our systems protect people, assets, and business continuity.',
    details: [
      { heading: 'Addressable vs. Conventional Systems', body: 'We help you choose between addressable systems (each device has a unique address, pinpointing the exact fire location) and conventional zone-based systems depending on building size, budget, and complexity.' },
      { heading: 'Detector Types', body: 'Our portfolio includes optical smoke detectors, heat detectors, multi-sensor detectors, flame detectors, beam detectors for open atriums, and aspirating smoke detection (ASD) systems for high-sensitivity environments such as data centres.' },
      { heading: 'Control Panels & Repeaters', body: 'We install control panels from Notifier, Hochiki, and Apollo, supporting 1 to 32 loops and hundreds of addressable devices. Remote repeater panels provide status monitoring from staffed areas such as reception desks.' },
      { heading: 'Cause & Effect Programming', body: 'Complex cause-and-effect matrices are programmed so that detection in one zone triggers specific outputs — closing fire doors, activating extract fans, releasing suppression systems, or calling lifts to ground — exactly as required by your fire strategy.' },
      { heading: 'Commissioning & Certification', body: 'On completion, we provide a full commissioning report, site-specific cause-and-effect schedule, as-built drawings, and a certificate of compliance ready for submission to the fire authority.' }
    ],
    features: ['BS EN 54 compliant', 'Addressable & conventional options', 'Aspirating smoke detection (ASD)', 'Cause & effect programming', 'Full commissioning documentation', 'Annual service contracts']
  },
  {
    slug: 'explosives-detection-systems',
    categoryId: 'surveillance',
    title: 'Explosives Detection Systems',
    shortDesc: 'Trace and bulk explosives detection technology for high-security checkpoints and critical infrastructure.',
    heroImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&q=80',
    overview: 'For environments requiring the highest level of threat mitigation, we supply and integrate explosives detection equipment from world-leading manufacturers. Our solutions are deployed at airports, government buildings, courts, and large public venues.',
    details: [
      { heading: 'Trace Detection', body: 'Ion Mobility Spectrometry (IMS) trace detectors analyse swabs or air samples for a comprehensive library of military and commercial explosives, narcotics, and chemical warfare agents within seconds.' },
      { heading: 'Bulk Detection', body: 'Advanced X-ray and CT scanning systems detect bulk explosives hidden inside luggage, vehicles, or cargo containers through anomaly detection algorithms and material discrimination.' },
      { heading: 'Integration with Access Control', body: 'We integrate explosives detection equipment with access control and CCTV platforms so that alarms automatically lock doors, capture facial images, and alert security personnel simultaneously.' }
    ],
    features: ['IMS trace detection', 'Bulk CT & X-ray scanning', 'Multi-threat library updates', 'Integrated alarm management', 'Operator training included', 'Manufacturer-certified installation']
  },
  {
    slug: 'time-attendance-management',
    categoryId: 'access',
    title: 'Time and Attendance Management Systems',
    shortDesc: 'Biometric and RFID time-and-attendance platforms that integrate directly with HR and payroll software.',
    heroImage: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&q=80',
    overview: 'Accurate workforce data starts at the door. Our time-and-attendance systems capture clock-in and clock-out events using fingerprint, face recognition, or RFID card, generating reports that feed directly into your payroll and HR systems.',
    details: [
      { heading: 'Biometric Terminals', body: 'ZKTeco, Suprema, and Hikvision terminals offer fingerprint, palm vein, face recognition, and card reader options. Each terminal stores thousands of templates locally and syncs events to a central server in real time.' },
      { heading: 'Shift & Schedule Management', body: 'Configure unlimited shift patterns, grace periods, overtime rules, and public holiday calendars. The software flags exceptions such as late arrivals, early departures, and absent employees automatically.' },
      { heading: 'Payroll Integration', body: 'Export attendance data in formats compatible with QuickBooks, Sage, SAP, and other leading payroll platforms. Custom API integrations are available for bespoke HR systems.' },
      { heading: 'Reports & Analytics', body: 'Generate daily, weekly, or monthly reports per employee, department, or site. Heat-map dashboards reveal attendance trends and help managers optimise staffing levels.' }
    ],
    features: ['Fingerprint, face & RFID options', 'Unlimited shift patterns', 'Payroll software integration', 'Real-time cloud sync', 'Mobile app for employees', 'Multi-site management']
  },
  {
    slug: 'access-control-systems',
    categoryId: 'access',
    title: 'Access Control Systems',
    shortDesc: 'Granular door-by-door access permissions with smart cards, biometrics, and mobile credentials.',
    heroImage: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=1200&q=80',
    overview: 'We design and install access control solutions that let the right people through the right doors at the right times — and keep everyone else out. From standalone door controllers to enterprise-wide platforms managing thousands of doors across multiple sites, our systems scale with your organisation.',
    details: [
      { heading: 'Controller Architecture', body: 'IP-based controllers connect over your existing network infrastructure, eliminating the need for dedicated cabling. Each controller manages multiple readers and supports offline fallback mode if network connectivity is lost.' },
      { heading: 'Credential Technologies', body: 'We support MIFARE DESFire EV3, HID iCLASS, and mobile Bluetooth/NFC credentials via smartphone apps. Smart cards are encoded with encrypted sector data to prevent cloning.' },
      { heading: 'Access Levels & Schedules', body: 'Role-based access levels restrict areas by employee group, time of day, and day of week. Anti-passback rules prevent credential sharing, and dual-person authorisation (man-trap) can be enforced at high-security areas.' },
      { heading: 'Emergency Override', body: 'Integration with the fire alarm panel allows automatic unlocking of all fire exits on alarm activation. Manual override switches and a web dashboard give administrators instant control in emergencies.' }
    ],
    features: ['IP-networked controllers', 'Mobile Bluetooth/NFC credentials', 'Role-based access levels', 'Anti-passback & man-trap', 'Fire alarm integration', 'Audit trail & reporting']
  },
  {
    slug: 'under-vehicle-surveillance',
    categoryId: 'access',
    title: 'Under Vehicle Surveillance Systems (UVSS)',
    shortDesc: 'High-resolution under-vehicle scanning systems for perimeter security at checkpoints and car parks.',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80',
    overview: 'Under vehicle surveillance systems provide automatic, high-resolution inspection of vehicle undersides without requiring drivers to stop for manual checks. Our systems are widely deployed at embassies, military bases, hotels, and corporate campuses.',
    details: [
      { heading: 'Automated Scanning', body: 'Vehicles drive over a line-scan camera array at speeds up to 30 km/h. The system stitches individual frames into a single high-resolution composite image of the entire undercarriage in real time.' },
      { heading: 'AI Threat Detection', body: 'Machine learning algorithms compare each scan against a baseline clean image of the same vehicle model, highlighting anomalies such as attached packages, modified fuel tanks, or foreign objects.' },
      { heading: 'Licence Plate Recognition', body: 'Integrated ANPR cameras capture front and rear plates simultaneously, automatically linking each scan to a vehicle record in the access control database.' }
    ],
    features: ['Up to 30 km/h drive-through speed', 'AI baseline comparison', 'ANPR integration', '3,000+ DPI resolution', 'All-weather operation', 'Centralised management dashboard']
  },
  {
    slug: 'xray-luggage-inspection',
    categoryId: 'access',
    title: 'X-ray Luggage Inspection Systems',
    shortDesc: 'Tunnel X-ray scanners for baggage and parcel screening at airports, hotels, and high-security facilities.',
    heroImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
    overview: 'We supply, install, and maintain X-ray baggage scanners from leading manufacturers. Our systems generate multi-energy, dual-view images that allow trained operators to quickly identify prohibited items, weapons, and contraband.',
    details: [
      { heading: 'Dual-Energy Imaging', body: 'Dual-energy X-ray differentiates between organic, inorganic, and metallic materials using colour-coded overlays, dramatically improving operator detection rates compared to single-energy systems.' },
      { heading: 'Tunnel Sizes', body: 'We offer tunnels from small parcel scanners (400 mm × 300 mm aperture) to large baggage and cargo scanners (1,000 mm × 1,000 mm) capable of handling oversized items and pallets.' },
      { heading: 'Operator Training', body: 'All systems include built-in threat image projection (TIP) training modules that superimpose library threat images onto real bags during live screening to keep operators sharp.' }
    ],
    features: ['Dual-energy colour imaging', 'Multiple tunnel sizes', 'Threat Image Projection (TIP)', 'Network image archiving', 'Automatic explosive detection', 'Operator performance tracking']
  },
  {
    slug: 'handheld-metal-detectors',
    categoryId: 'screening',
    title: 'Handheld Metal Detectors',
    shortDesc: 'Professional handheld wands for rapid, precise metal detection at checkpoints, events, and prisons.',
    heroImage: 'https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=1200&q=80',
    overview: 'Handheld metal detectors provide a secondary screening tool that complements walk-through portals. Our range includes entry-level wands for events through to high-sensitivity security-grade devices used in prisons and courthouses.',
    details: [
      { heading: 'Detection Technology', body: 'All units use balanced-coil technology for uniform detection across the entire sensor head. High-sensitivity models can detect a small steel blade at 10 cm even through thick clothing.' },
      { heading: 'Vibration & Audio Alerts', body: 'Silent vibration alert mode allows discreet screening without alerting the subject. Combined audio-visual and vibration alerts are used in noisy environments such as concerts and stadiums.' },
      { heading: 'Ergonomics & Battery Life', body: 'Lightweight ergonomic handles reduce operator fatigue during long shifts. Rechargeable lithium-ion batteries provide 100+ hours of continuous use on a single charge.' }
    ],
    features: ['Balanced-coil sensor technology', 'Silent vibration mode', '100+ hour battery life', 'IP54 dust & splash resistant', 'Lightweight ergonomic design', 'LED & audio alarm indicators']
  },
  {
    slug: 'walk-through-metal-detectors',
    categoryId: 'screening',
    title: 'Walk-Through Metal Detectors',
    shortDesc: 'Multi-zone walk-through portals with pinpoint location accuracy for airports, courts, and large venues.',
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    overview: 'Our walk-through metal detector portals offer up to 33 independent detection zones, allowing security personnel to pinpoint the exact location of a concealed metal object on the body without the need for a physical pat-down.',
    details: [
      { heading: 'Multi-Zone Detection', body: 'Up to 33 overlapping zones across the portal cross-section means the system can indicate whether a threat item is at ankle, waist, or shoulder height on the left or right side of the body.' },
      { heading: 'Discrimination Technology', body: 'Advanced discrimination algorithms distinguish between harmless items (belt buckles, keys, coins) and genuine threat items (knives, firearms), reducing false-alarm rates and improving throughput.' },
      { heading: 'Throughput & Counting', body: 'Integrated people counters log the number of persons screened per hour. Speed recommendations are enforced via audible guidance, and data is exported to management dashboards for KPI reporting.' },
      { heading: 'Environmental Immunity', body: 'Shielded coil design and digital signal processing make our portals immune to interference from nearby metal structures, motors, fluorescent lighting, and radio transmitters.' }
    ],
    features: ['Up to 33 detection zones', 'Left/right body location', 'Discrimination technology', 'People counter integration', 'Environmental interference immunity', 'Compact footprint options']
  },
  {
    slug: 'automated-gate-systems',
    categoryId: 'automation',
    title: 'Automated Gate Systems',
    shortDesc: 'Swing, sliding, and barrier gate automation with remote control, ANPR, and intercom integration.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    overview: 'Our automated gate solutions control vehicle and pedestrian access at the perimeter of your property. From residential swing gates to heavy-duty industrial sliding gates, we supply, install, and maintain automation systems that are reliable, safe, and easy to operate.',
    details: [
      { heading: 'Gate Types', body: 'We automate swing gates (single and double leaf), sliding gates (rack-driven and underground), rising arm barriers, and bollard systems for high-security perimeters. Marine-grade stainless steel and powder-coated steel options are available.' },
      { heading: 'Access Triggers', body: 'Gates can be triggered by remote controls, RFID cards, PIN pads, intercoms, ANPR cameras, loop detectors, or smartphone apps. Multi-factor triggers are available for the highest security requirements.' },
      { heading: 'Safety Features', body: 'Photocell obstacle detection, inductive loop detection, and torque-limiting motor controls ensure the gate stops and reverses if an obstruction is detected, preventing injury or vehicle damage.' },
      { heading: 'Integration', body: 'Gate controllers integrate with access control platforms, CCTV systems, and intercom panels to provide a complete perimeter management solution with centralised audit trails.' }
    ],
    features: ['Swing, sliding & barrier types', 'ANPR & app-based access', 'Photocell obstacle detection', 'Battery backup operation', 'Access control integration', 'UPS failsafe operation']
  },
  {
    slug: 'car-parking-management',
    categoryId: 'automation',
    title: 'Car Parking Management Systems',
    shortDesc: 'Automated parking barriers, ANPR-based ticketless parking, and revenue management platforms.',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    overview: 'Our parking management systems maximise revenue, reduce operational costs, and improve user experience at commercial car parks, hospitals, shopping centres, and airports. From simple barrier-and-ticket systems to fully ticketless ANPR solutions, we cover the full spectrum.',
    details: [
      { heading: 'ANPR Ticketless Parking', body: 'Cameras capture licence plates on entry and exit, calculating parking duration automatically. Payments are made via app, web, or pay-station. No physical ticket means no lost-ticket fees and a seamless user experience.' },
      { heading: 'Revenue Management', body: 'A cloud-based back-office platform provides real-time occupancy dashboards, transaction reports, revenue analysis, and ANPR enforcement for overstays or non-payers.' },
      { heading: 'Pay Stations & Validation', body: "Multi-payment pay stations accept cash, card, and QR-code payments. Merchant validation terminals allow retailers to offer free or discounted parking periods that are automatically deducted from the customer's bill." }
    ],
    features: ['Ticketless ANPR entry/exit', 'App & web payment', 'Real-time occupancy display', 'Revenue management dashboard', 'Permit & season-ticket management', 'Enforcement & overstay alerts']
  },
  {
    slug: 'electrical-products-supply',
    categoryId: 'electrical',
    title: 'Supply of High-Quality Electrical Products',
    shortDesc: 'Cables, switchgear, distribution boards, UPS systems, and lighting from leading manufacturers.',
    heroImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80',
    overview: 'We are an authorised distributor of a comprehensive range of electrical products suitable for residential, commercial, and industrial applications. All products are sourced from certified manufacturers and are compliant with IEC, BS, and local electrical standards.',
    details: [
      { heading: 'Cables & Wiring', body: 'Our cable range covers PVC/XLPE armoured and unarmoured cables from 1.5 mm² to 400 mm² in single and multi-core configurations. Fire-resistant and LSZH variants are available for life-safety applications.' },
      { heading: 'Switchgear & Protection', body: 'We supply MCBs, RCCBs, RCBOs, isolators, and moulded-case circuit breakers (MCCBs) from ABB, Schneider Electric, and Legrand. Distribution boards are supplied in surface-mounted and flush-mounted configurations for domestic and industrial use.' },
      { heading: 'UPS & Power Conditioning', body: 'Uninterruptible power supplies from 500VA to 500kVA protect critical equipment from power outages and voltage disturbances. We offer online double-conversion, line-interactive, and standby topologies.' },
      { heading: 'Lighting', body: 'Energy-efficient LED luminaires for office, warehouse, street, and emergency applications. All luminaires carry KEBS certification and qualify for energy-efficiency incentives.' }
    ],
    features: ['IEC & BS certified products', 'Cables 1.5 mm² – 400 mm²', 'ABB, Schneider, Legrand brands', 'UPS 500 VA – 500 kVA', 'LED & emergency lighting', 'Fast-track procurement']
  },
  {
    slug: 'electrical-installation-services',
    categoryId: 'electrical',
    title: 'Professional Electrical Installation Services',
    shortDesc: 'Licensed electrical contractors for new builds, fit-outs, industrial plants, and infrastructure projects.',
    heroImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&q=80',
    overview: 'Our team of licensed electrical engineers and technicians handles complete electrical installation projects from design and permit application through to final inspection and certification. We work across residential, commercial, and heavy industrial sectors.',
    details: [
      { heading: 'Design & Engineering', body: 'We prepare full electrical design packages including single-line diagrams, load schedules, cable sizing calculations, protection coordination studies, and lighting design in accordance with IEE Wiring Regulations (BS 7671) and the Kenya Electrical Wiring Code.' },
      { heading: 'Power Distribution', body: 'We install main LV switchboards, distribution boards, busbar trunking, cable tray and trunking systems, and earthing and lightning protection in compliance with IEC 62305.' },
      { heading: 'Generator & UPS Integration', body: 'We install, commission, and maintain standby generator sets from 10 kVA to 2,000 kVA with automatic transfer switching (ATS). UPS systems are integrated with generator start sequences for seamless power continuity.' },
      { heading: 'Energy Efficiency & Solar', body: 'We conduct energy audits and implement efficiency measures including variable speed drives, power factor correction, LED retrofits, and grid-tied or off-grid solar photovoltaic systems.' },
      { heading: 'Testing & Certification', body: 'On completion, we carry out full IEE installation testing including insulation resistance, earth continuity, loop impedance, and RCD testing. Certificates of compliance are issued and submitted to the Energy and Petroleum Regulatory Authority (EPRA).' }
    ],
    features: ['BS 7671 & Kenya Wiring Code', 'LV switchboard installation', 'Generator & ATS commissioning', 'IEC 62305 lightning protection', 'Solar PV grid-tied & off-grid', 'EPRA certified testing']
  }
];

const PRODUCTS = [
  { name: 'TP-Link TL-SF1008P 8-Port PoE Switch', sku: 'TP-SF1008P', categoryId: 'surveillance', price: 8500, inStock: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80', description: '8-Port 10/100Mbps Desktop Switch with 4-Port PoE' },
  { name: 'CAT6 Ethernet Cable 10m', sku: 'CAT6-10M', categoryId: 'automation', price: 1200, inStock: true, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=80&q=80', description: 'High quality copper CAT6 patch cord 10 meters' },
  { name: 'Mikrotik RB750Gr3 Router', sku: 'RB750GR3', categoryId: 'automation', price: 24000, inStock: true, image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=80&q=80', description: 'hEX 5-Port Gigabit Ethernet Router with Dual Core 880MHz CPU' },
  { name: 'Ubiquiti UniFi AP AC LR', sku: 'UAP-AC-LR', categoryId: 'automation', price: 26000, inStock: true, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&q=80', description: '802.11ac Long Range Access Point' },
  { name: 'RJ45 Crimping Tool Kit', sku: 'RJ45-TOOL', categoryId: 'automation', price: 3500, inStock: true, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&q=80', description: 'All-in-one crimp tool for RJ45, RJ12, RJ11 connectors' },
  { name: 'Network Cable Tester', sku: 'NET-TESTER', categoryId: 'automation', price: 15000, inStock: true, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&q=80', description: 'Professional multi-functional network wire tracker and tester' }
];

async function main() {
  for (const category of CATEGORIES) {
    await prisma.serviceCategory.upsert({ where: { id: category.id }, update: category, create: category });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);

  for (const service of SERVICES) {
    await prisma.service.upsert({ where: { slug: service.slug }, update: service, create: service });
  }
  console.log(`Seeded ${SERVICES.length} services.`);

  for (const product of PRODUCTS) {
    await prisma.product.upsert({ where: { sku: product.sku }, update: product, create: product });
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      shopName: 'Loree Networks',
      email: 'info@loreenetworks.co.ke',
      phone: '+254 700 123 456',
      currency: 'KES',
      taxRate: 16
    }
  });
  console.log('Seeded store settings.');

  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set — skipping admin account seed.');
  } else if (adminPassword === 'Loree@2025') {
    throw new Error(
      'Refusing to seed the admin account with the old hardcoded password (Loree@2025) — it was exposed in public JS source. Set ADMIN_SEED_PASSWORD to a fresh, strong password.'
    );
  } else {
    const passwordHash = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { passwordHash, role: 'ADMIN' },
      create: { name: 'Admin', email: adminEmail.toLowerCase(), passwordHash, role: 'ADMIN' }
    });
    console.log(`Seeded admin account for ${adminEmail}.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
