/**
 * PYB – Prachar Your Brand
 * Comprehensive Client-Side Script
 * Navigation, WhatsApp Integrations, Quotation Engine, PDF Generator & Media Controls
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. ACTIVE NAVIGATION LINK DETECTION
     ------------------------------------------------------------------------ */
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const navLinks = document.querySelectorAll('.nav-item-link, .mobile-menu-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normHref = href.replace(/\/index\.html$/, '/');

    const isHome = (normHref === '/' || normHref === '/index.html' || normHref === '#') &&
                   (currentPath === '/' || currentPath === '' || currentPath.endsWith('/index.html'));
    const isMatch = normHref !== '/' && normHref !== '#' && currentPath.includes(normHref.replace(/\/$/, ''));

    if (isHome || isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ------------------------------------------------------------------------
     2. STICKY NAVBAR SCROLL EFFECT
     ------------------------------------------------------------------------ */
  const siteNav = document.querySelector('.site-nav');
  function handleNavScroll() {
    if (!siteNav) return;
    if (window.scrollY > 20) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ------------------------------------------------------------------------
     3. MOBILE DRAWER TOGGLE
     ------------------------------------------------------------------------ */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('active');
      mobileBtn.setAttribute('aria-expanded', mobileDrawer.classList.contains('active'));
    });

    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('active') && !mobileDrawer.contains(e.target) && !mobileBtn.contains(e.target)) {
        mobileDrawer.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. FLOATING WHATSAPP BUTTON INJECTION
     ------------------------------------------------------------------------ */
  if (!document.getElementById('floatingWhatsAppBtn')) {
    const waWrap = document.createElement('div');
    waWrap.className = 'floating-whatsapp-wrap';
    waWrap.id = 'floatingWhatsAppBtn';
    waWrap.innerHTML = `
      <span class="whatsapp-tooltip">Chat with PYB on WhatsApp</span>
      <a href="https://wa.me/916267458029?text=Hello%20PYB%20Team!%20I%20would%20like%20to%20discuss%20a%20new%20marketing%20project." 
         target="_blank" rel="noopener noreferrer" class="floating-whatsapp-btn" aria-label="Chat on WhatsApp">
        <span class="whatsapp-pulse-ring"></span>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.981-1.306C8.423 21.536 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
      </a>
    `;
    document.body.appendChild(waWrap);
  }

  /* ------------------------------------------------------------------------
     5. CONTACT FORM (OFFICIAL WHATSAPP MESSAGE FORMAT)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName') ? document.getElementById('formName').value.trim() : '';
      const phone = document.getElementById('formPhone') ? document.getElementById('formPhone').value.trim() : '';
      const email = document.getElementById('formEmail') ? document.getElementById('formEmail').value.trim() : 'Not provided';
      const business = document.getElementById('formBusiness') ? document.getElementById('formBusiness').value.trim() : 'Not provided';
      const service = document.getElementById('formService') ? document.getElementById('formService').value : 'Digital Marketing';
      const message = document.getElementById('formMessage') ? document.getElementById('formMessage').value.trim() : '';

      const alertBox = document.getElementById('formAlert');

      // Validation
      if (!name || !phone || !message) {
        if (alertBox) {
          alertBox.className = 'form-status-alert error';
          alertBox.textContent = 'Please fill out your Name, Phone Number, and Project Details.';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Exact prompt requested format:
      // Hello PYB Team!
      // I would like to discuss a new project.
      // Name: [Name]
      // Phone: [Phone]
      // Email: [Email]
      // Business: [Business Name]
      // Service Required: [Selected Service]
      // Project Details: [Project Description]
      // Please contact me regarding the next steps.

      const textBody = 
        `Hello PYB Team!\n` +
        `I would like to discuss a new project.\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Business: ${business}\n` +
        `Service Required: ${service}\n` +
        `Project Details: ${message}\n` +
        `Please contact me regarding the next steps.`;

      const waUrl = `https://wa.me/916267458029?text=${encodeURIComponent(textBody)}`;

      if (alertBox) {
        alertBox.className = 'form-status-alert success';
        alertBox.innerHTML = `<strong>Enquiry Form Ready!</strong> Opening WhatsApp with your pre-filled project enquiry details for <strong>PYB (+91 6267458029)</strong>.<br><small style="margin-top:6px;display:block;">If WhatsApp did not open automatically, <a href="${waUrl}" target="_blank" style="text-decoration:underline;color:inherit;font-weight:700;">click here to send via WhatsApp</a> or <a href="mailto:pracharyourbrand@gmail.com?subject=Enquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(textBody)}" style="text-decoration:underline;color:inherit;font-weight:700;">send via Email</a>.</small>`;
      }

      window.open(waUrl, '_blank');
    });
  }

  /* ------------------------------------------------------------------------
     6. QUOTATION BUILDER & PDF GENERATION ENGINE
     ------------------------------------------------------------------------ */
  const quoteForm = document.getElementById('quotationForm');
  if (quoteForm) {
    const packages = {
      start: {
        id: 'start',
        name: 'Prachar Start',
        monthly: 7999,
        deliverables: [
          '12 creative social media posts per month',
          '2 promotional video reels per month',
          'Instagram & Facebook page management',
          'Audience captions and researched hashtags',
          'Monthly performance and reach report'
        ]
      },
      grow: {
        id: 'grow',
        name: 'Prachar Grow (Most Popular)',
        monthly: 14999,
        deliverables: [
          '15 creative social media posts per month',
          '4 professional video reels per month',
          'Social media account management',
          'Meta Ads campaign management (FB & IG)',
          'Content planning & brand strategy',
          'Monthly performance report & review'
        ]
      },
      pro: {
        id: 'pro',
        name: 'Prachar Pro',
        monthly: 24999,
        deliverables: [
          '20 premium social media creatives',
          '6 high-impact promotional reels',
          'Reel concepts, scripting, filming & editing',
          'Creative content & strategic storytelling',
          'Instagram & Facebook complete management',
          'Meta Ads setup, monitoring & optimization',
          'Brand growth & market promotion strategy',
          'Comprehensive monthly growth reports'
        ]
      },
      custom: {
        id: 'custom',
        name: 'Custom Tailored Solution',
        monthly: 35000,
        deliverables: [
          'Comprehensive bespoke marketing scope',
          'Dedicated creative director & video shoot team',
          'Full-funnel ads, lead generation & web support',
          'Tailored to your specific business milestones'
        ]
      }
    };

    let selectedPkgKey = 'grow';
    const urlParams = new URLSearchParams(window.location.search);
    const paramPkg = (urlParams.get('package') || '').toLowerCase();
    if (paramPkg && packages[paramPkg]) {
      selectedPkgKey = paramPkg;
    }

    const pillBtns = document.querySelectorAll('.package-pill-btn');
    function selectPackage(key) {
      if (!packages[key]) key = 'grow';
      selectedPkgKey = key;
      pillBtns.forEach(btn => {
        if (btn.getAttribute('data-package') === key) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      recalculate();
    }

    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        selectPackage(btn.getAttribute('data-package'));
      });
    });

    // Elements
    const durationSelect = document.getElementById('qtnDuration');
    const gstCheck = document.getElementById('qtnGst');
    const dateInput = document.getElementById('qtnDate');

    // Default date to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    if (dateInput) dateInput.value = formattedToday;

    // Generate unique Quotation ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const quoteId = `PYB-QTN-${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2,'0')}-${randomCode}`;

    function recalculate() {
      const pkg = packages[selectedPkgKey];
      const durationMonths = parseInt(durationSelect ? durationSelect.value : '1', 10) || 1;
      const includeGst = gstCheck ? gstCheck.checked : false;

      const subtotal = pkg.monthly * durationMonths;
      const gstAmount = includeGst ? Math.round(subtotal * 0.18) : 0;
      const grandTotal = subtotal + gstAmount;

      // Update live preview elements
      const idEl = document.getElementById('docQuoteId');
      if (idEl) idEl.textContent = quoteId;

      const dateEl = document.getElementById('docQuoteDate');
      if (dateEl) {
        const dVal = dateInput && dateInput.value ? new Date(dateInput.value) : today;
        dateEl.textContent = dVal.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      }

      const pkgNameEl = document.getElementById('docPkgName');
      if (pkgNameEl) pkgNameEl.textContent = pkg.name;

      const pkgDeliverablesEl = document.getElementById('docPkgDeliverables');
      if (pkgDeliverablesEl) {
        pkgDeliverablesEl.innerHTML = pkg.deliverables.map(item => `&bull; ${item}`).join('<br>');
      }

      const durationEl = document.getElementById('docDuration');
      if (durationEl) durationEl.textContent = `${durationMonths} Month${durationMonths > 1 ? 's' : ''}`;

      const rateEl = document.getElementById('docRate');
      if (rateEl) rateEl.textContent = `₹${pkg.monthly.toLocaleString('en-IN')}/mo`;

      const subtotalEl = document.getElementById('docSubtotal');
      if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

      const subtotalSummaryEl = document.getElementById('docSubtotalSummary');
      if (subtotalSummaryEl) subtotalSummaryEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

      const gstLabelEl = document.getElementById('docGstLabel');
      if (gstLabelEl) gstLabelEl.textContent = includeGst ? 'GST (18% Included):' : 'GST:';

      const gstAmountEl = document.getElementById('docGstAmount');
      if (gstAmountEl) gstAmountEl.textContent = includeGst ? `₹${gstAmount.toLocaleString('en-IN')}` : 'Extra as applicable';

      const grandTotalEl = document.getElementById('docGrandTotal');
      if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

      return {
        pkg,
        durationMonths,
        includeGst,
        subtotal,
        gstAmount,
        grandTotal,
        quoteId
      };
    }

    // Bind input listeners
    if (durationSelect) durationSelect.addEventListener('change', recalculate);
    if (gstCheck) gstCheck.addEventListener('change', recalculate);
    if (dateInput) dateInput.addEventListener('change', recalculate);

    // Initial calculation
    selectPackage(selectedPkgKey);

    // Handle Generate Quotation Form Submit
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('qtnClientName').value.trim();
      const contactPerson = document.getElementById('qtnContactPerson').value.trim();
      const email = document.getElementById('qtnEmail').value.trim();
      const phone = document.getElementById('qtnPhone').value.trim();
      const notes = document.getElementById('qtnNotes') ? document.getElementById('qtnNotes').value.trim() : '';

      const alertBox = document.getElementById('qtnAlert');

      if (!clientName || !contactPerson || !email || !phone) {
        if (alertBox) {
          alertBox.className = 'form-status-alert error';
          alertBox.textContent = 'Please fill out Business Name, Contact Person, Email, and Phone Number.';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Update client block on document
      const docClientName = document.getElementById('docClientName');
      if (docClientName) docClientName.textContent = clientName;

      const docClientContact = document.getElementById('docClientContact');
      if (docClientContact) {
        docClientContact.innerHTML = `<strong>Attn:</strong> ${contactPerson}<br><strong>Email:</strong> ${email}<br><strong>Phone:</strong> ${phone}`;
      }

      const docNotes = document.getElementById('docNotesRow');
      if (docNotes) {
        if (notes) {
          docNotes.style.display = 'block';
          docNotes.innerHTML = `<strong>Project Notes:</strong> ${notes}`;
        } else {
          docNotes.style.display = 'none';
        }
      }

      // Show document & actions
      const actionsPanel = document.getElementById('quotationActionsPanel');
      if (actionsPanel) actionsPanel.style.display = 'flex';

      const docWrapper = document.getElementById('quotationDocWrapper');
      if (docWrapper) {
        docWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (alertBox) {
        alertBox.className = 'form-status-alert success';
        alertBox.innerHTML = `<strong>Quotation Generated Successfully!</strong> Reference ID: <strong>${quoteId}</strong>. You can now download the official PDF, print it, or share directly on WhatsApp.`;
      }
    });

    // Reset button
    const resetBtn = document.getElementById('qtnResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        quoteForm.reset();
        if (dateInput) dateInput.value = formattedToday;
        selectPackage('grow');
        const alertBox = document.getElementById('qtnAlert');
        if (alertBox) alertBox.style.display = 'none';
      });
    }

    // Share via WhatsApp Button
    const waShareBtn = document.getElementById('qtnShareWaBtn');
    if (waShareBtn) {
      waShareBtn.addEventListener('click', () => {
        const clientName = document.getElementById('qtnClientName').value.trim() || 'Valued Client';
        const contactPerson = document.getElementById('qtnContactPerson').value.trim() || 'Client';
        const phone = document.getElementById('qtnPhone').value.trim() || '';
        const calc = recalculate();

        const waText = 
          `*OFFICIAL PROPOSAL & QUOTATION - PYB*\n` +
          `--------------------------------\n` +
          `*Quotation No:* ${calc.quoteId}\n` +
          `*Date:* ${today.toLocaleDateString('en-IN')}\n` +
          `*Business Name:* ${clientName}\n` +
          `*Contact Person:* ${contactPerson}\n` +
          `*Phone:* ${phone}\n` +
          `--------------------------------\n` +
          `*Selected Package:* ${calc.pkg.name}\n` +
          `*Duration:* ${calc.durationMonths} Month(s)\n` +
          `*Monthly Fee:* ₹${calc.pkg.monthly.toLocaleString('en-IN')}\n` +
          `*Subtotal:* ₹${calc.subtotal.toLocaleString('en-IN')}\n` +
          `*GST (18%):* ${calc.includeGst ? '₹' + calc.gstAmount.toLocaleString('en-IN') : 'Extra as applicable'}\n` +
          `*GRAND TOTAL:* ₹${calc.grandTotal.toLocaleString('en-IN')}\n` +
          `--------------------------------\n` +
          `Prepared by PYB – Prachar Your Brand (Raipur, CG)\n` +
          `Email: pracharyourbrand@gmail.com | Phone: 6267458029`;

        const waUrl = `https://wa.me/916267458029?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank');
      });
    }

    // Print Button
    const printBtn = document.getElementById('qtnPrintBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Download Standalone PDF Button
    const downloadPdfBtn = document.getElementById('qtnDownloadPdfBtn');
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        downloadPureJsPdf();
      });
    }

    /**
     * Pure JavaScript PDF Generator
     * Generates a bona-fide, compliant PDF file formatted as a corporate proposal document
     */
    function downloadPureJsPdf() {
      const clientName = document.getElementById('qtnClientName').value.trim() || 'Client';
      const contactPerson = document.getElementById('qtnContactPerson').value.trim() || 'Representative';
      const email = document.getElementById('qtnEmail').value.trim() || 'N/A';
      const phone = document.getElementById('qtnPhone').value.trim() || 'N/A';
      const calc = recalculate();

      // Clean lines of deliverables
      const deliverableLines = calc.pkg.deliverables.map(d => ` - ${d}`).join('\n');

      // Construct a clean, compliant text-based PDF document
      const pdfDate = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      
      const pdfContent = 
`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 2000 >>
stream
BT
/F2 18 Tf
40 800 Td
(PYB - PRACHAR YOUR BRAND) Tj
/F1 9 Tf
0 -15 Td
(Full-Service Digital Marketing Agency | Raipur, Chhattisgarh) Tj
0 -12 Td
(Email: pracharyourbrand@gmail.com | Phone: +91 6267458029) Tj
/F2 13 Tf
340 27 Td
(OFFICIAL QUOTATION) Tj
/F1 9 Tf
0 -14 Td
(Quotation No: ${calc.quoteId}) Tj
0 -12 Td
(Date: ${pdfDate}) Tj
ET

0 740 595 2 re
0 0.28 1 rg
f

BT
/F2 11 Tf
40 715 Td
(QUOTATION ISSUED TO:) Tj
/F1 10 Tf
0 -16 Td
(Business: ${clientName}) Tj
0 -14 Td
(Contact Person: ${contactPerson}) Tj
0 -14 Td
(Phone: ${phone} | Email: ${email}) Tj
ET

0 655 515 22 re
0.95 0.95 0.95 rg
f

BT
/F2 10 Tf
48 662 Td
(SERVICE PACKAGE / DELIVERABLES) Tj
260 0 Td
(DURATION) Tj
80 0 Td
(RATE) Tj
85 0 Td
(AMOUNT) Tj
ET

BT
/F2 10 Tf
48 630 Td
(${calc.pkg.name}) Tj
/F1 8.5 Tf
0 -14 Td
${calc.pkg.deliverables.map(d => `( - ${d.replace(/\(|\)/g, '')}) Tj\n0 -12 Td`).join('\n')}
ET

BT
/F1 10 Tf
308 630 Td
(${calc.durationMonths} Month\\(s\\)) Tj
80 0 Td
(INR ${calc.pkg.monthly.toLocaleString('en-IN')}) Tj
85 0 Td
(INR ${calc.subtotal.toLocaleString('en-IN')}) Tj
ET

0 440 515 1 re
0.8 0.8 0.8 rg
f

BT
/F1 10 Tf
340 415 Td
(Subtotal:) Tj
100 0 Td
(INR ${calc.subtotal.toLocaleString('en-IN')}) Tj
ET

BT
/F1 10 Tf
340 395 Td
(${calc.includeGst ? 'GST \\(18% Included\\):' : 'GST \\(Extra\\):'}) Tj
100 0 Td
(${calc.includeGst ? 'INR ' + calc.gstAmount.toLocaleString('en-IN') : 'As applicable'}) Tj
ET

0 375 515 2 re
0 0.28 1 rg
f

BT
/F2 12 Tf
340 355 Td
(TOTAL AMOUNT:) Tj
100 0 Td
(INR ${calc.grandTotal.toLocaleString('en-IN')}) Tj
ET

BT
/F2 9 Tf
40 300 Td
(IMPORTANT TERMS & CONDITIONS:) Tj
/F1 8 Tf
0 -14 Td
(1. Advertising budget for Meta/Google is paid directly by client and separate from agency fees.) Tj
0 -12 Td
(2. Quotation is valid for 30 calendar days from issue date.) Tj
0 -12 Td
(3. Invoices are generated monthly in advance; deliverables are tracked on structured calendars.) Tj
0 -12 Td
(4. Additional shoots, bespoke software or offline campaigns are quoted separately.) Tj
ET

BT
/F2 10 Tf
40 180 Td
(Authorized Signatory) Tj
/F1 9 Tf
0 -14 Td
(PYB - Prachar Your Brand Creative Direction) Tj
0 -12 Td
(Raipur, Chhattisgarh, India | Contact: +91 6267458029) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000243 00000 n 
0000002300 00000 n 
0000002377 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
2457
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${calc.quoteId}_${clientName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  /* ------------------------------------------------------------------------
     7. 3D HERO ORBIT ENGINE (HOME PAGE)
     ------------------------------------------------------------------------ */
  const orbitalStage = document.getElementById('orbitalStage');
  const orbitingCards = Array.from(document.querySelectorAll('.orbiting-card'));
  if (orbitalStage && orbitingCards.length > 0) {
    const CARD_COUNT = orbitingCards.length;
    let currentAngle = 0;
    const orbitSpeed = 0.0035;

    function getRadii() {
      const stageW = orbitalStage.offsetWidth || 480;
      const rx = Math.min(stageW * 0.44, 215);
      const ry = rx * 0.42;
      return { rx, ry };
    }

    function updateOrbit() {
      const { rx, ry } = getRadii();
      // Continuous circular rotation
      currentAngle += orbitSpeed;

      orbitingCards.forEach((card, i) => {
        const angle = currentAngle + (i * (2 * Math.PI / CARD_COUNT));
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const x = cosA * rx;
        const y = sinA * ry;
        const z = sinA;

        // Hover & focus accessibility scale enhancement
        const isCardHovered = card.matches(':hover') || (document.activeElement === card);
        const hoverMultiplier = isCardHovered ? 1.08 : 1.0;

        let scale, zIndex, opacity;
        if (z >= 0) {
          scale = (0.94 + (z * 0.12)) * hoverMultiplier;
          zIndex = isCardHovered ? 60 : Math.round(20 + z * 10);
          opacity = 1;
        } else {
          scale = (0.94 + (z * 0.14)) * hoverMultiplier;
          zIndex = isCardHovered ? 50 : Math.round(5 + z * 4);
          opacity = isCardHovered ? 1 : 0.65 + ((1 + z) * 0.25);
        }

        card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
      });

      requestAnimationFrame(updateOrbit);
    }

    requestAnimationFrame(updateOrbit);
  }

  /* ------------------------------------------------------------------------
     8. PORTFOLIO FILTER CATEGORIES
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterBtns.length > 0 && portfolioCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
          const categories = card.getAttribute('data-category') || '';
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Carnival spotlight audio toggle
  const carnivalSpotlight = document.getElementById('carnivalSpotlightVideo');
  const carnivalAudioBtn = document.getElementById('carnivalAudioToggle');
  const audioStatusText = document.getElementById('audioStatusText');

  if (carnivalSpotlight && carnivalAudioBtn) {
    carnivalAudioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (carnivalSpotlight.muted) {
        carnivalSpotlight.muted = false;
        carnivalSpotlight.play();
        if (audioStatusText) audioStatusText.textContent = 'Mute Audio';
        carnivalAudioBtn.style.background = '#0047ff';
        carnivalAudioBtn.style.color = '#ffffff';
      } else {
        carnivalSpotlight.muted = true;
        if (audioStatusText) audioStatusText.textContent = 'Tap for Sound';
        carnivalAudioBtn.style.background = '';
        carnivalAudioBtn.style.color = '';
      }
    });
  }

  // Video hover/click play toggles
  document.querySelectorAll('.portfolio-media-box').forEach(box => {
    const video = box.querySelector('video');
    if (!video) return;
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.muted = false;
        video.play();
      } else {
        video.pause();
      }
    });
  });

  /* ------------------------------------------------------------------------
     9. AMBIENT BACKGROUND CANVAS SCROLL-BASED VIDEO SCRUBBING ENGINE
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('animationCanvas');
  if (canvas) {
    const TOTAL_FRAMES = 296;
    const FRAME_PATH = (idx) =>
      `/PYB_all_video_frames_30fps_under20MB/frame_${String(idx).padStart(4, '0')}.jpg`;

    const ctx = canvas.getContext('2d', { alpha: false });
    const images = new Array(TOTAL_FRAMES);
    const isLoaded = new Array(TOTAL_FRAMES).fill(false);
    let targetProgress = 0;
    let smoothProgress = 0;
    const LERP_FACTOR = 0.08;
    let lastDrawnIndex = -1;
    let isCanvasSized = false;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      isCanvasSized = true;
      if (lastDrawnIndex >= 0) drawFrame(lastDrawnIndex);
    }

    function drawFrame(frameIdx) {
      if (!isCanvasSized) resizeCanvas();

      let img = images[frameIdx];

      if (!img || !isLoaded[frameIdx]) {
        let found = -1;
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const p = frameIdx - offset;
          const n = frameIdx + offset;
          if (p >= 0 && isLoaded[p]) { found = p; break; }
          if (n < TOTAL_FRAMES && isLoaded[n]) { found = n; break; }
        }
        if (found !== -1) img = images[found];
        else return;
      }

      const cw = canvas.width;
      const ch = canvas.height;
      const nw = img.naturalWidth || 910;
      const nh = img.naturalHeight || 512;

      const imgRatio = nw / nh;
      const canvasRatio = cw / ch;

      let dw, dh, dx, dy;
      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * imgRatio;
        dx = (cw - dw) / 2;
        dy = 0;
      }

      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndex = frameIdx;
    }

    function updateScroll() {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const curY = window.pageYOffset || document.documentElement.scrollTop || 0;
      targetProgress = docH > 0 ? Math.max(0, Math.min(1, curY / docH)) : 0;
    }

    function tickScroll() {
      smoothProgress += (targetProgress - smoothProgress) * LERP_FACTOR;
      if (Math.abs(targetProgress - smoothProgress) < 0.0001) {
        smoothProgress = targetProgress;
      }

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(smoothProgress * (TOTAL_FRAMES - 1)))
      );

      if (frameIdx !== lastDrawnIndex) {
        drawFrame(frameIdx);
      }

      requestAnimationFrame(tickScroll);
    }

    function preloadFrames() {
      const first = new Image();
      first.src = FRAME_PATH(1);
      images[0] = first;
      first.onload = () => {
        isLoaded[0] = true;
        drawFrame(0);
        loadRemaining();
      };
      first.onerror = () => loadRemaining();
    }

    function loadRemaining() {
      const CONCURRENCY = 12;
      let next = 1;
      function loadNext() {
        if (next >= TOTAL_FRAMES) return;
        const idx = next++;
        const img = new Image();
        img.src = FRAME_PATH(idx + 1);
        images[idx] = img;
        img.onload = () => { isLoaded[idx] = true; loadNext(); };
        img.onerror = () => loadNext();
      }
      for (let i = 0; i < CONCURRENCY; i++) loadNext();
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });

    resizeCanvas();
    updateScroll();
    preloadFrames();
    requestAnimationFrame(tickScroll);
  }
});
