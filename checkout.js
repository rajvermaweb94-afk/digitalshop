/* ═══════════════════════════════════════════════════════════
   BLOOM PLANNER — CHECKOUT JS
   3-Step Flow | Card Detection | Validation | Animation
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── PRODUCT CONFIG (edit per product for testing) ──────── */
const PRODUCT_CONFIG = {
  name: 'Bloom Digital Planner',
  subtitle: 'Complete Edition · Instant Download',
  emoji: '🌸',
  subtotal: 47.00,
  discountPercent: 43,
  discountAmount: 20.00,
  total: 27.00,
  currency: 'USD',
  includes: [
    '✦ 720+ hyperlinked PDF pages',
    '✦ Daily, weekly & monthly planners',
    '✦ 80+ bonus templates',
    '✦ 1,000+ digital stickers',
    '✦ 50+ cover themes',
    '✦ Lifetime access + free updates'
  ],
  // One or more downloadable files for this product
  downloads: [
    {
      title: 'Bloom Digital Planner',
      description: '720+ pages · 1000+ stickers · 80+ templates',
      sizeLabel: 'PDF · ~45 MB · Instant Access',
      fileName: 'BloomPlanner_DownloadConfirmation.txt',
      fileContent: () => `BLOOM PLANNER — DOWNLOAD CONFIRMATION
=====================================
Thank you for your purchase!

Order Details:
• Product: ${PRODUCT_CONFIG.name}
• Price: $${PRODUCT_CONFIG.total.toFixed(2)}
• Date: ${new Date().toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})}

In the live version, your file will download here.

Need help? support@bloomplanner.com

© ${new Date().getFullYear()} Bloom Planner. All rights reserved.
`
    }
  ]
};

function renderProductSummary() {
  const nameEls = document.querySelectorAll('.co-summary__product-name, .download-card__info h3, #step3-product-name');
  document.querySelectorAll('.co-summary__product-name').forEach(el => el.textContent = PRODUCT_CONFIG.name);
  document.querySelectorAll('.co-summary__product-sub').forEach(el => el.textContent = PRODUCT_CONFIG.subtitle);
  document.querySelectorAll('.co-summary__thumb').forEach(el => el.textContent = PRODUCT_CONFIG.emoji);

  const subtotalEl = document.querySelector('.co-summary__line span:last-child');
  const lines = document.querySelectorAll('.co-summary__line');
  if (lines[0]) lines[0].querySelector('span:last-child').textContent = '$' + PRODUCT_CONFIG.subtotal.toFixed(2);
  if (lines[1]) {
    lines[1].querySelector('span:first-child').textContent = `💰 Discount (${PRODUCT_CONFIG.discountPercent}%)`;
    lines[1].querySelector('span:last-child').textContent = '−$' + PRODUCT_CONFIG.discountAmount.toFixed(2);
  }
  const totalEl = document.querySelector('.co-summary__total span:last-child');
  if (totalEl) totalEl.textContent = '$' + PRODUCT_CONFIG.total.toFixed(2);

  const includesList = document.querySelector('.co-summary__includes ul');
  if (includesList) {
    includesList.innerHTML = PRODUCT_CONFIG.includes.map(i => `<li>${i}</li>`).join('');
  }

  // Pay button amount
  const payBtn = document.getElementById('step2-pay');
  if (payBtn) {
    payBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      Pay $${PRODUCT_CONFIG.total.toFixed(2)} Securely`;
  }
}

function renderDownloadProducts() {
  const container = document.getElementById('download-products');
  if (!container) return;
  container.innerHTML = '';

  PRODUCT_CONFIG.downloads.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'download-card';
    card.innerHTML = `
      <div class="download-card__icon" aria-hidden="true">${PRODUCT_CONFIG.emoji}</div>
      <div class="download-card__info">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="download-card__size">${item.sizeLabel}</p>
      </div>
    `;
    container.appendChild(card);

    const btn = document.createElement('a');
    btn.href = '#';
    btn.className = 'btn-download';
    btn.setAttribute('download', '');
    btn.setAttribute('aria-label', `Download ${item.title}`);
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v13M5 14l7 7 7-7"/><line x1="3" y1="21" x2="21" y2="21"/></svg>
      Download Now${PRODUCT_CONFIG.downloads.length > 1 ? ` (${idx + 1})` : ''}
    `;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const original = this.innerHTML;
      this.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        Download Started!`;
      this.style.background = '#237A3F';
      setTimeout(() => {
        this.innerHTML = original;
        this.style.background = '';
      }, 3000);

      const content = typeof item.fileContent === 'function' ? item.fileContent() : (item.fileContent || '');
      const blob = new Blob([content], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = item.fileName || 'download.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
    container.appendChild(btn);
  });
}

renderProductSummary();
renderDownloadProducts();

/* ─── CARD TYPE DETECTION ────────────────────────────────── */
const CARD_TYPES = {
  visa: {
    pattern: /^4/,
    digitLength: 16,
    cvvLength: 3,
    gaps: [4, 8, 12],
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" width="48" height="32" role="img" aria-label="Visa">
      <rect width="48" height="32" rx="5" fill="#1A1F71"/>
      <text x="24" y="21" font-family="Arial,sans-serif" font-size="14" font-weight="900" font-style="italic"
        fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">VISA</text>
    </svg>`,
    color: '#1A1F71',
    label: 'Visa'
  },
  mastercard: {
    pattern: /^(5[1-5]|2[2-7])/,
    digitLength: 16,
    cvvLength: 3,
    gaps: [4, 8, 12],
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" width="48" height="32" role="img" aria-label="Mastercard">
      <rect width="48" height="32" rx="5" fill="#252525"/>
      <circle cx="20" cy="16" r="9" fill="#EB001B"/>
      <circle cx="28" cy="16" r="9" fill="#F79E1B"/>
      <path d="M24 9.3a9 9 0 010 13.4 9 9 0 010-13.4z" fill="#FF5F00"/>
    </svg>`,
    color: '#252525',
    label: 'Mastercard'
  },
  amex: {
    pattern: /^3[47]/,
    digitLength: 15,
    cvvLength: 4,
    gaps: [4, 10],
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" width="48" height="32" role="img" aria-label="American Express">
      <rect width="48" height="32" rx="5" fill="#2E77BC"/>
      <text x="24" y="20" font-family="Arial,sans-serif" font-size="10" font-weight="800"
        fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">AMEX</text>
    </svg>`,
    color: '#2E77BC',
    label: 'American Express'
  },
  discover: {
    pattern: /^(6011|65|64[4-9]|622)/,
    digitLength: 16,
    cvvLength: 3,
    gaps: [4, 8, 12],
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 32" width="48" height="32" role="img" aria-label="Discover">
      <rect width="48" height="32" rx="5" fill="#1A1A1A"/>
      <text x="20" y="20" font-family="Arial,sans-serif" font-size="9" font-weight="800" font-style="italic"
        fill="#FFFFFF" text-anchor="middle">Discover</text>
      <circle cx="40" cy="16" r="8" fill="#F58220"/>
    </svg>`,
    color: '#1A1A1A',
    label: 'Discover'
  }
};

function detectCardType(number) {
  const clean = number.replace(/\s/g, '');
  for (const [type, data] of Object.entries(CARD_TYPES)) {
    if (data.pattern.test(clean)) return { type, ...data };
  }
  return null;
}

/* Group digits according to a card type's gap layout (e.g. Amex 4-6-5) */
function formatByGaps(digits, gaps) {
  const groups = [];
  let start = 0;
  for (const gapPos of gaps) {
    if (start >= digits.length) break;
    groups.push(digits.slice(start, gapPos));
    start = gapPos;
  }
  if (start < digits.length) groups.push(digits.slice(start));
  return groups.filter(Boolean);
}

/* ─── DOM REFS ───────────────────────────────────────────── */
const step1El   = document.getElementById('step-1');
const step2El   = document.getElementById('step-2');
const step3El   = document.getElementById('step-3');
const pstep1    = document.getElementById('pstep-1');
const pstep2    = document.getElementById('pstep-2');
const pstep3    = document.getElementById('pstep-3');
const fillBar   = document.getElementById('progress-fill');
const overlay   = document.getElementById('processing-overlay');
const summaryEl = document.getElementById('co-summary');

// Card preview elements
const cardInner       = document.getElementById('card-inner');
const cardDisplayNum  = document.getElementById('card-display-number');
const cardDisplayName = document.getElementById('card-display-name');
const cardDisplayExp  = document.getElementById('card-display-expiry');
const cardDisplayCvv  = document.getElementById('card-display-cvv');
const cardLogo        = document.getElementById('card-logo');
const cardBackLogo    = document.getElementById('card-back-logo');
const cardTypeBadge   = document.getElementById('card-type-badge');
const cardTypeIcon    = document.getElementById('card-type-icon');

// Form fields
const nameInput   = document.getElementById('full-name');
const emailInput  = document.getElementById('email');
const mobileInput = document.getElementById('mobile');
const cardNum     = document.getElementById('card-number');
const cardName    = document.getElementById('card-name');
const cardExpiry  = document.getElementById('card-expiry');
const cardCvv     = document.getElementById('card-cvv');

/* ─── PROGRESS BAR UPDATE ────────────────────────────────── */
function setProgress(step) {
  // step: 1 | 2 | 3
  // Fill: 0% at step1, 50% at step2, 100% at step3
  const fills  = { 1: '0%', 2: '50%', 3: '100%' };
  fillBar.style.width = fills[step];

  [pstep1, pstep2, pstep3].forEach((el, i) => {
    el.classList.remove('progress-step--active', 'progress-step--done');
    el.removeAttribute('aria-current');
  });

  const steps = [pstep1, pstep2, pstep3];
  for (let i = 0; i < step - 1; i++) {
    steps[i].classList.add('progress-step--done');
  }
  steps[step - 1].classList.add('progress-step--active');
  steps[step - 1].setAttribute('aria-current', 'step');
}

setProgress(1);
if (summaryEl) summaryEl.classList.remove('co-summary--hidden');

/* ─── STEP TRANSITIONS ───────────────────────────────────── */
function showStep(n) {
  [step1El, step2El, step3El].forEach(el => {
    el.classList.add('co-step--hidden');
  });
  const map = { 1: step1El, 2: step2El, 3: step3El };
  const target = map[n];
  target.classList.remove('co-step--hidden');
  // Remove + re-add animation class
  target.style.animation = 'none';
  target.offsetHeight; // reflow
  target.style.animation = '';
  setProgress(n);

  // Order summary only visible on step 1
  if (summaryEl) {
    summaryEl.classList.toggle('co-summary--hidden', n !== 1);
  }
  document.querySelector('.co-layout').classList.toggle('co-layout--full', n !== 1);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── VALIDATION HELPERS ─────────────────────────────────── */
function showError(inputEl, errEl, msg) {
  inputEl.classList.add('error');
  inputEl.classList.remove('valid');
  errEl.textContent = msg;
}

function clearError(inputEl, errEl) {
  inputEl.classList.remove('error');
  inputEl.classList.add('valid');
  errEl.textContent = '';
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validatePhone(v) {
  return v.replace(/\D/g,'').length >= 7;
}

/* ─── STEP 1 FORM ────────────────────────────────────────── */
document.getElementById('form-step1').addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    showError(nameInput, document.getElementById('err-name'), '⚠ Please enter your full name');
    valid = false;
  } else {
    clearError(nameInput, document.getElementById('err-name'));
  }

  if (!validateEmail(emailInput.value)) {
    showError(emailInput, document.getElementById('err-email'), '⚠ Please enter a valid email address');
    valid = false;
  } else {
    clearError(emailInput, document.getElementById('err-email'));
  }

  if (!validatePhone(mobileInput.value)) {
    showError(mobileInput, document.getElementById('err-mobile'), '⚠ Please enter a valid phone number');
    valid = false;
  } else {
    clearError(mobileInput, document.getElementById('err-mobile'));
  }

  if (valid) {
    // Pre-fill card name from full name
    if (!cardName.value) {
      cardName.value = nameInput.value.trim().toUpperCase();
      cardDisplayName.textContent = cardName.value;
    }
    // Store email for success page
    document.getElementById('success-name').textContent = nameInput.value.trim().split(' ')[0];
    document.getElementById('success-email').textContent = emailInput.value.trim();
    showStep(2);
  }
});

/* ─── CARD NUMBER FORMATTING & DETECTION ─────────────────── */
let currentCardType = null;

cardNum.addEventListener('input', function (e) {
  // Capture caret position before we reformat
  const selStart = this.selectionStart;
  const prevLen  = this.value.length;

  // Detect type early from raw digits (so formatting/length adapts mid-typing)
  let digits = this.value.replace(/\D/g, '');
  const detected = detectCardType(digits);
  const maxDigits = detected ? detected.digitLength : 16;
  digits = digits.slice(0, maxDigits);

  // Re-format using the card type's grouping (Amex = 4-6-5, others = 4-4-4-4)
  const gaps = detected ? detected.gaps : [4, 8, 12];
  const groups = formatByGaps(digits, gaps);
  const formatted = groups.join(' ');
  this.value = formatted;

  // Restore caret — account for added/removed spaces
  const newLen = formatted.length;
  const diff   = newLen - prevLen;
  const newPos = Math.max(0, selStart + diff);
  try { this.setSelectionRange(newPos, newPos); } catch(err){}

  // Update card preview number display
  const padded  = digits.padEnd(maxDigits, '•');
  const display = formatByGaps(padded, gaps).join('  ');
  cardDisplayNum.textContent = display;

  // Apply / clear card type
  if (detected && (!currentCardType || currentCardType.type !== detected.type)) {
    currentCardType = detected;
    applyCardType(detected);
  } else if (!detected && currentCardType) {
    currentCardType = null;
    clearCardType();
  } else if (detected) {
    currentCardType = detected; // keep in sync (e.g. amex max length)
  }

  // Adjust CVV input + preview for current card type's CVV length
  const cvvLen = detected ? detected.cvvLength : 3;
  cardCvv.maxLength = cvvLen;
  cardCvv.placeholder = '•'.repeat(cvvLen);
  cardCvv.setAttribute('autocomplete', 'cc-csc');
  if (cardCvv.value.length > cvvLen) {
    cardCvv.value = cardCvv.value.slice(0, cvvLen);
  }
  cardDisplayCvv.textContent = cardCvv.value
    ? '•'.repeat(cardCvv.value.length)
    : '•'.repeat(cvvLen);
  cardDisplayCvv.parentElement.classList.toggle('card-preview__cvv-box--wide', cvvLen > 3);
});

function applyCardType(card) {
  // Logo on card preview front
  cardLogo.innerHTML = `<div class="${card.type}-logo" aria-label="${card.label} card">${card.logo}</div>`;
  // Logo on card back
  cardBackLogo.innerHTML = `<div class="${card.type}-logo" style="opacity:0.6">${card.logo}</div>`;
  // Badge next to input
  cardTypeBadge.innerHTML = `
    <div class="${card.type}-logo" style="display:flex;align-items:center" aria-label="${card.label}">
      ${card.logo}
    </div>`;
  // Hide default icon
  cardTypeIcon.style.opacity = '0';
  // Animate card
  cardInner.style.transform = 'rotateY(5deg)';
  setTimeout(() => { cardInner.style.transform = ''; }, 400);
}

function clearCardType() {
  cardLogo.innerHTML = `<div class="card-logo-placeholder">
    <svg width="40" height="26" viewBox="0 0 40 26" fill="none">
      <rect width="40" height="26" rx="4" fill="rgba(255,255,255,0.15)"/>
      <path d="M8 13h24M20 7v12" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>`;
  cardBackLogo.innerHTML = '';
  cardTypeBadge.innerHTML = '';
  cardTypeIcon.style.opacity = '1';
}

/* ─── CARD NAME ──────────────────────────────────────────── */
cardName.addEventListener('input', function () {
  const val = this.value.toUpperCase() || 'FULL NAME';
  cardDisplayName.textContent = val || 'FULL NAME';
});

/* ─── EXPIRY FORMATTING ──────────────────────────────────── */
cardExpiry.addEventListener('keydown', function (e) {
  // Allow backspace to cleanly delete the separator
  if (e.key === 'Backspace' && this.value.endsWith(' / ')) {
    e.preventDefault();
    this.value = this.value.slice(0, -3);
    cardDisplayExp.textContent = this.value || 'MM / YY';
  }
});

cardExpiry.addEventListener('input', function () {
  let raw = this.value.replace(/\D/g, '').slice(0, 4);

  // Clamp month to 01–12
  if (raw.length >= 1) {
    const m1 = parseInt(raw[0]);
    if (m1 > 1) raw = '0' + raw; // e.g. '6' → '06'
    raw = raw.slice(0, 4);
  }

  let formatted = raw;
  if (raw.length >= 3) {
    formatted = raw.slice(0, 2) + ' / ' + raw.slice(2);
  } else if (raw.length === 2) {
    formatted = raw + ' / ';
  }

  this.value = formatted;
  cardDisplayExp.textContent = formatted || 'MM / YY';
});

/* ─── CVV: flip card ─────────────────────────────────────── */
cardCvv.addEventListener('focus', () => {
  cardInner.classList.add('flipped');
});

cardCvv.addEventListener('blur', () => {
  cardInner.classList.remove('flipped');
});

cardCvv.addEventListener('input', function () {
  const cvvLen = currentCardType ? currentCardType.cvvLength : 4;
  // Only allow digits, max per card type
  const digits = this.value.replace(/\D/g, '').slice(0, cvvLen);
  if (this.value !== digits) this.value = digits;
  cardDisplayCvv.textContent = digits ? '•'.repeat(digits.length) : '•'.repeat(cvvLen);
});

/* ─── CVV HELP TOOLTIP ───────────────────────────────────── */
const cvvHelpBtn = document.getElementById('cvv-help-btn');
const cvvTooltip = document.getElementById('cvv-tooltip');

cvvHelpBtn.addEventListener('click', () => {
  const hidden = cvvTooltip.hidden;
  cvvTooltip.hidden = !hidden;
});

document.addEventListener('click', e => {
  if (!cvvHelpBtn.contains(e.target) && !cvvTooltip.contains(e.target)) {
    cvvTooltip.hidden = true;
  }
});

/* ─── LIVE INPUT VALIDATION (Step 1) ─────────────────────── */
[nameInput, emailInput, mobileInput].forEach(input => {
  input.addEventListener('blur', () => {
    if (!input.value.trim()) return;
    if (input === emailInput && !validateEmail(input.value)) {
      showError(input, document.getElementById('err-email'), '⚠ Please enter a valid email address');
    } else if (input === mobileInput && !validatePhone(input.value)) {
      showError(input, document.getElementById('err-mobile'), '⚠ Please enter a valid phone number');
    } else {
      const errId = input === nameInput ? 'err-name' : input === emailInput ? 'err-email' : 'err-mobile';
      clearError(input, document.getElementById(errId));
    }
  });
});

/* ─── MOBILE NUMBER FORMATTING ───────────────────────────── */
mobileInput.addEventListener('input', function () {
  let val = this.value.replace(/\D/g, '').slice(0, 10);
  if (val.length > 6) {
    val = '(' + val.slice(0,3) + ') ' + val.slice(3,6) + '-' + val.slice(6);
  } else if (val.length > 3) {
    val = '(' + val.slice(0,3) + ') ' + val.slice(3);
  }
  this.value = val;
});

/* ─── STEP 2 FORM ────────────────────────────────────────── */
document.getElementById('form-step2').addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  // Validate card number
  const rawNum = cardNum.value.replace(/\s/g, '');
  if (!currentCardType) {
    showError(cardNum, document.getElementById('err-cardnum'), '⚠ We accept Visa, Mastercard, American Express & Discover');
    valid = false;
  } else if (rawNum.length < currentCardType.digitLength) {
    showError(cardNum, document.getElementById('err-cardnum'), `⚠ Please enter a valid ${currentCardType.digitLength}-digit card number`);
    valid = false;
  } else {
    clearError(cardNum, document.getElementById('err-cardnum'));
  }

  // Validate name on card
  if (!cardName.value.trim() || cardName.value.trim().length < 2) {
    showError(cardName, document.getElementById('err-cardname'), '⚠ Please enter the name on your card');
    valid = false;
  } else {
    clearError(cardName, document.getElementById('err-cardname'));
  }

  // Validate expiry
  const expiryRaw = cardExpiry.value.replace(/\D/g, '');
  const month = parseInt(expiryRaw.slice(0,2));
  const year  = parseInt('20' + expiryRaw.slice(2,4));
  const now   = new Date();
  const expDate = new Date(year, month - 1);
  if (expiryRaw.length < 4 || month < 1 || month > 12 || expDate < new Date(now.getFullYear(), now.getMonth())) {
    showError(cardExpiry, document.getElementById('err-expiry'), '⚠ Please enter a valid expiry date');
    valid = false;
  } else {
    clearError(cardExpiry, document.getElementById('err-expiry'));
  }

  // Validate CVV
  const expectedCvvLen = currentCardType ? currentCardType.cvvLength : 3;
  if (cardCvv.value.length < expectedCvvLen) {
    showError(cardCvv, document.getElementById('err-cvv'), `⚠ Please enter your ${expectedCvvLen}-digit CVV`);
    valid = false;
  } else {
    clearError(cardCvv, document.getElementById('err-cvv'));
  }

  if (valid) {
    processPayment();
  }
});

/* ─── SUPABASE ORDER SAVE ─────────────────────────────────── */
async function saveOrderToSupabase(order) {
  try {
    const { error } = await supabaseClient.from('orders').insert([order]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Could not save order to Supabase:', err);
    return false;
  }
}

/* ─── PAYMENT PROCESSING SIMULATION ─────────────────────── */
function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'BP-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function processPayment() {
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';

  // Animated step messages in overlay
  const processingText = document.querySelector('.processing-text');
  const steps = [
    'Verifying payment…',
    'Securing your order…',
    'Preparing your download…',
    'Almost done…'
  ];
  let msgIdx = 0;
  const msgTimer = setInterval(() => {
    msgIdx = (msgIdx + 1) % steps.length;
    if (processingText) processingText.textContent = steps[msgIdx];
  }, 600);

  // Simulate 2.8s processing delay
  setTimeout(async () => {
    clearInterval(msgTimer);
    overlay.hidden = true;

    // ── SAVE ORDER TO SUPABASE ───────────────────────────────
    const orderNum = generateOrderNumber();
    const cardTypeLabel = currentCardType ? currentCardType.label : 'Unknown';
    const rawDigits = cardNum.value.replace(/\D/g, '');
    const last4 = rawDigits.slice(-4);
    const maskedCard = '••••  ••••  ••••  ' + last4;

    const order = {
      id: orderNum,
      date: new Date().toISOString(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      mobile: mobileInput.value.trim(),
      country: document.getElementById('country').value,
      amount: PRODUCT_CONFIG.total,
      currency: PRODUCT_CONFIG.currency,
      product: PRODUCT_CONFIG.name + ' — ' + PRODUCT_CONFIG.subtitle,
      card_type: cardTypeLabel,
      card_masked: maskedCard,
      card_holder: cardName.value.trim(),
      notes: '',
      status: 'completed',
    };

    const saved = await saveOrderToSupabase(order);
    if (!saved) {
      // Fallback to localStorage if Supabase fails
      try {
        const existing = JSON.parse(localStorage.getItem('bloom_orders') || '[]');
        existing.unshift(order);
        localStorage.setItem('bloom_orders', JSON.stringify(existing));
      } catch (e) {}
    }
    // ──────────────────────────────────────────────────────────
    document.body.style.overflow = '';

    // Set order number on success page
    const orderNumEl = document.getElementById('order-number');
    if (orderNumEl) orderNumEl.textContent = orderNum;

    showStep(3);
    launchConfetti();

    // Show toast after 1s
    setTimeout(() => showToast('🎉 Payment confirmed! Check your email for the receipt.', 'success'), 1200);
  }, 2800);
}

/* ─── TOAST NOTIFICATION ─────────────────────────────────── */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.getElementById('bloom-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'bloom-toast';
  const bgColor = type === 'success' ? '#2C8A4A' : '#C0392B';
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${bgColor};
    color: #fff;
    padding: 0.9rem 1.75rem;
    border-radius: 9999px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.22);
    z-index: 999;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  `;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ─── CONFETTI EFFECT ────────────────────────────────────── */
function launchConfetti() {
  const colors = ['#E8C4B8', '#C4A98A', '#B8C9B0', '#2C1F14', '#FAF7F2', '#D4A090'];
  const container = document.createElement('div');
  container.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    pointer-events:none; z-index:998; overflow:hidden;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    const size  = Math.random() * 10 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left  = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const dur   = Math.random() * 1.5 + 2;
    const rotate = Math.random() * 720;
    const isCircle = Math.random() > 0.5;

    piece.style.cssText = `
      position: absolute;
      top: -20px;
      left: ${left}%;
      width: ${size}px;
      height: ${isCircle ? size : size * 0.6}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      animation: confettiFall ${dur}s ${delay}s ease-in forwards;
    `;
    container.appendChild(piece);
  }

  // Add confetti keyframes if not present
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity:1; }
        80%  { opacity: 1; }
        100% { transform: translateY(105vh) rotate(${Math.random()*720}deg); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 4000);
}

/* ─── STEP 2 BACK BUTTON ─────────────────────────────────── */
document.getElementById('step2-back').addEventListener('click', () => {
  showStep(1);
});

/* Download buttons are now generated dynamically by renderDownloadProducts() */
