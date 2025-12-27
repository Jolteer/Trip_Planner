// Trip Planner JavaScript - Main Application File

// ============================================
// CONSTANTS
// ============================================
const STORAGE_KEYS = {
  TRIP_DATA: 'tripPlannerData',
  FLIGHTS: 'tripPlannerFlights',
  HOTELS: 'tripPlannerHotels',
  BOOKINGS: 'tripPlannerBookings'
};

const SELECTORS = {
  TRIP_FORM: '.trip-form form',
  BUDGET_INPUTS: '.budget-item',
  FLIGHTS_CONTAINER: '.flights-container',
  HOTELS_CONTAINER: '.hotels-container',
  BOOKINGS_CONTAINER: '.bookings-container',
  ITINERARY_CONTAINER: '.itinerary-container'
};

const DATE_FORMAT_OPTIONS = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
};

const EMPTY_MESSAGES = {
  flights: '<div class="alert alert-info"><i class="bi bi-info-circle"></i> Click "Add Flight" to track your flights</div>',
  hotels: '<div class="alert alert-warning"><i class="bi bi-info-circle"></i> Click "Add Hotel" to track your accommodations</div>',
  bookings: '<div class="alert alert-secondary"><i class="bi bi-info-circle"></i> Track car rentals, tours, restaurants, and other reservations</div>'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Safely query DOM element
 * @param {string} selector - CSS selector
 * @returns {Element|null}
 */
const getElement = (selector) => document.querySelector(selector);

/**
 * Safely query all DOM elements
 * @param {string} selector - CSS selector
 * @returns {NodeList}
 */
const getElements = (selector) => document.querySelectorAll(selector);

/**
 * Calculate days between two dates
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {number} Number of days
 */
const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  } catch {
    return '';
  }
};

/**
 * Save data to localStorage safely
 * @param {string} key - Storage key
 * @param {*} data - Data to store
 */
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error.message}`);
  }
};

/**
 * Load data from localStorage safely
 * @param {string} key - Storage key
 * @returns {*|null} Parsed data or null
 */
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error.message}`);
    return null;
  }
};

/**
 * Update element text content and optionally remove muted class
 * @param {string} selector - Element selector
 * @param {string|number} text - Text to set
 * @param {boolean} removeMuted - Whether to remove text-muted class
 */
const updateElementText = (selector, text, removeMuted = true) => {
  const element = getElement(selector);
  if (element) {
    element.textContent = text;
    if (removeMuted) {
      element.classList.remove('text-muted');
    }
  }
};

// ============================================
// NAVIGATION & SMOOTH SCROLLING
// ============================================

/**
 * Initialize smooth scrolling for anchor links
 */
const initSmoothScrolling = () => {
  getElements('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = getElement(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

// ============================================
// TRIP FORM HANDLING
// ============================================

/**
 * Initialize trip form submission handler
 */
const initTripForm = () => {
  const tripForm = getElement(SELECTORS.TRIP_FORM);
  if (!tripForm) return;

  tripForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const destination = getElement('#destination')?.value;
    const startDate = getElement('#start-date')?.value;
    const endDate = getElement('#end-date')?.value;
    const travelers = getElement('#travelers')?.value;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      alert('End date must be after start date!');
      return;
    }

    const duration = calculateDaysBetween(startDate, endDate);
    alert(`Trip created!\nDestination: ${destination}\nDuration: ${duration} days\nTravelers: ${travelers}`);

    generateItinerary(duration);
    updateOverviewDashboard();
  });
};

/**
 * Initialize trip details input listeners
 */
const initTripDetailsListeners = () => {
  const inputIds = ['destination', 'start-date', 'end-date', 'travelers'];
  inputIds.forEach(id => {
    const input = getElement(`#${id}`);
    if (input) {
      input.addEventListener('input', updateOverviewDashboard);
    }
  });
};

/**
 * Save trip data to localStorage
 */
const saveTripData = () => {
  const tripData = {
    destination: getElement('#destination')?.value || '',
    startDate: getElement('#start-date')?.value || '',
    endDate: getElement('#end-date')?.value || '',
    travelers: getElement('#travelers')?.value || 1,
    budget: {}
  };

  // Save budget items
  const budgetInputs = getElements(SELECTORS.BUDGET_INPUTS);
  budgetInputs.forEach((input, index) => {
    const label = input.closest('.col-md-6')?.querySelector('.form-label')?.textContent.replace(':', '') || `Item${index}`;
    tripData.budget[label] = input.value;
  });

  saveToStorage(STORAGE_KEYS.TRIP_DATA, tripData);
};

/**
 * Load trip data from localStorage
 */
const loadTripData = () => {
  const tripData = loadFromStorage(STORAGE_KEYS.TRIP_DATA);
  if (!tripData) return;

  const fields = {
    destination: tripData.destination,
    'start-date': tripData.startDate,
    'end-date': tripData.endDate,
    travelers: tripData.travelers
  };

  // Populate form fields
  Object.entries(fields).forEach(([id, value]) => {
    const element = getElement(`#${id}`);
    if (element && value) {
      element.value = value;
    }
  });

  // Load budget items
  const budgetInputs = getElements(SELECTORS.BUDGET_INPUTS);
  budgetInputs.forEach((input, index) => {
    const label = input.closest('.col-md-6')?.querySelector('.form-label')?.textContent.replace(':', '') || `Item${index}`;
    if (tripData.budget?.[label]) {
      input.value = tripData.budget[label];
    }
  });

  calculateBudgetTotal();
};

// ============================================
// ITINERARY MANAGEMENT
// ============================================

/**
 * Generate itinerary days
 * @param {number} days - Number of days
 */
const generateItinerary = (days) => {
  const container = getElement(SELECTORS.ITINERARY_CONTAINER);
  if (!container) return;

  container.innerHTML = '';
  for (let i = 1; i <= days; i++) {
    container.appendChild(createDayPlan(i));
  }
};

/**
 * Create activity item HTML
 * @param {string} icon - Bootstrap icon name
 * @param {string} label - Time of day label
 * @returns {string} HTML string
 */
const createActivityItem = (icon, label) => `
  <li class="d-flex align-items-center mb-2">
    <i class="bi bi-${icon} me-2"></i>
    <span>${label}:</span>
    <input type="text" class="form-control form-control-sm ms-2" placeholder="Add activity">
  </li>
`;

/**
 * Create a day plan card
 * @param {number} dayNumber - Day number
 * @returns {HTMLElement}
 */
const createDayPlan = (dayNumber) => {
  const dayDiv = document.createElement('div');
  dayDiv.className = 'col-md-6 col-lg-4';
  dayDiv.innerHTML = `
    <div class="card day-plan h-100 shadow-sm">
      <div class="card-header bg-info text-white">
        <h3 class="h5 mb-0">Day ${dayNumber}</h3>
      </div>
      <div class="card-body">
        <ul class="activity-list list-unstyled">
          ${createActivityItem('sunrise', 'Morning')}
          ${createActivityItem('sun', 'Afternoon')}
          ${createActivityItem('moon-stars', 'Evening')}
        </ul>
        <button class="btn btn-sm btn-outline-info add-activity">+ Add Activity</button>
      </div>
    </div>
  `;

  // Add activity button handler
  const addActivityBtn = dayDiv.querySelector('.add-activity');
  addActivityBtn.addEventListener('click', () => {
    const activityList = dayDiv.querySelector('.activity-list');
    const newActivity = document.createElement('li');
    newActivity.className = 'd-flex align-items-center mb-2';
    newActivity.innerHTML = '<input type="text" class="form-control form-control-sm" placeholder="Add activity">';
    activityList.appendChild(newActivity);
  });

  return dayDiv;
};

/**
 * Initialize add day button
 */
const initAddDayButton = () => {
  const addDayBtn = getElement('.add-day');
  if (!addDayBtn) return;

  addDayBtn.addEventListener('click', () => {
    const container = getElement(SELECTORS.ITINERARY_CONTAINER);
    const currentDays = container.querySelectorAll('.day-plan').length;
    container.appendChild(createDayPlan(currentDays + 1));
  });
};

// ============================================
// BUDGET CALCULATOR
// ============================================

/**
 * Calculate and display total budget
 */
const calculateBudgetTotal = () => {
  const budgetInputs = getElements(SELECTORS.BUDGET_INPUTS);
  let total = 0;

  budgetInputs.forEach(input => {
    const value = parseFloat(input.value) || 0;
    total += value;
  });

  const totalBudgetSpan = getElement('#total-budget');
  if (totalBudgetSpan) {
    totalBudgetSpan.textContent = `$${total.toFixed(2)}`;
  }

  updateOverviewBudget();
};

/**
 * Initialize budget calculator
 */
const initBudgetCalculator = () => {
  const budgetInputs = getElements(SELECTORS.BUDGET_INPUTS);
  budgetInputs.forEach(input => {
    input.addEventListener('input', calculateBudgetTotal);
  });
};

// ============================================
// GENERIC CARD CREATOR (DRY principle)
// ============================================

/**
 * Generic function to create card elements for flights, hotels, bookings
 * @param {string} type - Type of card ('flight', 'hotel', 'booking')
 * @param {Object} config - Configuration object
 * @returns {HTMLElement}
 */
const createCard = (type, config) => {
  const card = document.createElement('div');
  card.className = `mb-3 ${type}-card`;
  card.innerHTML = `
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">
            <i class="bi ${config.icon}"></i> ${config.title}
          </h5>
          <button class="btn btn-sm btn-danger remove-${type}" aria-label="Remove ${type}">×</button>
        </div>
        <div class="row g-3">
          ${config.fields}
        </div>
      </div>
    </div>
  `;

  return card;
};

/**
 * Generic function to add card to container
 * @param {string} type - Type of card
 * @param {string} containerSelector - Container selector
 * @param {Function} createCardFn - Function to create card
 * @param {Function} saveFn - Function to save data
 * @param {string} emptyMessage - Message to show when no cards
 */
const addCardToContainer = (type, containerSelector, createCardFn, saveFn, emptyMessage) => {
  const container = getElement(containerSelector);
  if (!container) return;

  const card = createCardFn();

  // Remove initial alert if exists
  const alert = container.querySelector('.alert');
  if (alert) alert.remove();

  container.appendChild(card);

  // Add remove handler
  card.querySelector(`.remove-${type}`).addEventListener('click', () => {
    card.remove();
    if (container.children.length === 0) {
      container.innerHTML = emptyMessage;
    }
    saveFn();
  });

  // Add input listeners for auto-save
  card.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', saveFn);
  });

  saveFn();
};

/**
 * Generic function to save card data to localStorage
 * @param {string} cardClass - Card class selector
 * @param {string} storageKey - Storage key
 */
const saveCardData = (cardClass, storageKey) => {
  const cards = [];
  getElements(cardClass).forEach(card => {
    const inputs = card.querySelectorAll('input, textarea, select');
    const cardData = {};
    inputs.forEach((input, index) => {
      cardData[`field${index}`] = input.value;
    });
    cards.push(cardData);
  });
  saveToStorage(storageKey, cards);
  updateOverviewDashboard();
};

/**
 * Generic function to load card data from localStorage
 * @param {string} storageKey - Storage key
 * @param {string} type - Card type
 * @param {string} containerSelector - Container selector
 * @param {Function} addCardFn - Function to add card
 */
const loadCardData = (storageKey, type, containerSelector, addCardFn) => {
  const cards = loadFromStorage(storageKey);
  if (!cards) return;

  const container = getElement(containerSelector);
  if (!container) return;

  cards.forEach(cardData => {
    addCardFn();
    const lastCard = container.lastElementChild;
    const inputs = lastCard.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      if (cardData[`field${index}`]) {
        input.value = cardData[`field${index}`];
      }
    });
  });
};

// ============================================
// FLIGHTS TRACKER
// ============================================

/**
 * Create flight card HTML
 * @returns {HTMLElement}
 */
const createFlightCard = () => {
  return createCard('flight', {
    icon: 'bi-airplane-fill',
    title: 'Flight Details',
    fields: `
      <div class="col-md-6">
        <label class="form-label">Airline</label>
        <input type="text" class="form-control" placeholder="e.g., Delta, United">
      </div>
      <div class="col-md-6">
        <label class="form-label">Flight Number</label>
        <input type="text" class="form-control" placeholder="e.g., DL123">
      </div>
      <div class="col-md-6">
        <label class="form-label">Departure Airport</label>
        <input type="text" class="form-control" placeholder="e.g., JFK">
      </div>
      <div class="col-md-6">
        <label class="form-label">Arrival Airport</label>
        <input type="text" class="form-control" placeholder="e.g., LAX">
      </div>
      <div class="col-md-6">
        <label class="form-label">Departure Date & Time</label>
        <input type="datetime-local" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">Arrival Date & Time</label>
        <input type="datetime-local" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">Confirmation Number</label>
        <input type="text" class="form-control" placeholder="Booking reference">
      </div>
      <div class="col-md-6">
        <label class="form-label">Seat</label>
        <input type="text" class="form-control" placeholder="e.g., 12A">
      </div>
      <div class="col-12">
        <label class="form-label">Notes</label>
        <textarea class="form-control" rows="2" placeholder="Gate info, baggage details, etc."></textarea>
      </div>
    `
  });
};

const saveFlightsData = () => saveCardData('.flight-card', STORAGE_KEYS.FLIGHTS);

const loadFlightsData = () => {
  loadCardData(STORAGE_KEYS.FLIGHTS, 'flight', SELECTORS.FLIGHTS_CONTAINER, () => {
    addCardToContainer('flight', SELECTORS.FLIGHTS_CONTAINER, createFlightCard, saveFlightsData, EMPTY_MESSAGES.flights);
  });
};

const initFlightsTracker = () => {
  const addFlightBtn = getElement('.add-flight');
  if (!addFlightBtn) return;

  addFlightBtn.addEventListener('click', () => {
    addCardToContainer('flight', SELECTORS.FLIGHTS_CONTAINER, createFlightCard, saveFlightsData, EMPTY_MESSAGES.flights);
  });
};

// ============================================
// HOTELS TRACKER
// ============================================

/**
 * Create hotel card HTML
 * @returns {HTMLElement}
 */
const createHotelCard = () => {
  return createCard('hotel', {
    icon: 'bi-building-fill',
    title: 'Accommodation Details',
    fields: `
      <div class="col-md-12">
        <label class="form-label">Hotel/Property Name</label>
        <input type="text" class="form-control" placeholder="e.g., Hilton Downtown">
      </div>
      <div class="col-md-12">
        <label class="form-label">Address</label>
        <input type="text" class="form-control" placeholder="Full address">
      </div>
      <div class="col-md-6">
        <label class="form-label">Check-in Date</label>
        <input type="date" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">Check-out Date</label>
        <input type="date" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">Confirmation Number</label>
        <input type="text" class="form-control" placeholder="Booking reference">
      </div>
      <div class="col-md-6">
        <label class="form-label">Room Type</label>
        <input type="text" class="form-control" placeholder="e.g., Deluxe King">
      </div>
      <div class="col-md-6">
        <label class="form-label">Phone Number</label>
        <input type="tel" class="form-control" placeholder="Hotel contact">
      </div>
      <div class="col-md-6">
        <label class="form-label">Total Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input type="number" class="form-control" placeholder="0.00">
        </div>
      </div>
      <div class="col-12">
        <label class="form-label">Notes</label>
        <textarea class="form-control" rows="2" placeholder="Amenities, parking info, special requests, etc."></textarea>
      </div>
    `
  });
};

const saveHotelsData = () => saveCardData('.hotel-card', STORAGE_KEYS.HOTELS);

const loadHotelsData = () => {
  loadCardData(STORAGE_KEYS.HOTELS, 'hotel', SELECTORS.HOTELS_CONTAINER, () => {
    addCardToContainer('hotel', SELECTORS.HOTELS_CONTAINER, createHotelCard, saveHotelsData, EMPTY_MESSAGES.hotels);
  });
};

const initHotelsTracker = () => {
  const addHotelBtn = getElement('.add-hotel');
  if (!addHotelBtn) return;

  addHotelBtn.addEventListener('click', () => {
    addCardToContainer('hotel', SELECTORS.HOTELS_CONTAINER, createHotelCard, saveHotelsData, EMPTY_MESSAGES.hotels);
  });
};

// ============================================
// OTHER BOOKINGS TRACKER
// ============================================

/**
 * Create booking card HTML
 * @returns {HTMLElement}
 */
const createBookingCard = () => {
  return createCard('booking', {
    icon: 'bi-calendar-check-fill',
    title: 'Booking Details',
    fields: `
      <div class="col-md-6">
        <label class="form-label">Booking Type</label>
        <select class="form-select">
          <option value="">Select type</option>
          <option value="car">Car Rental</option>
          <option value="tour">Tour/Activity</option>
          <option value="restaurant">Restaurant</option>
          <option value="transportation">Transportation</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="col-md-6">
        <label class="form-label">Provider/Vendor</label>
        <input type="text" class="form-control" placeholder="e.g., Enterprise, Viator">
      </div>
      <div class="col-md-12">
        <label class="form-label">Description</label>
        <input type="text" class="form-control" placeholder="e.g., Full-day city tour, Dinner reservation">
      </div>
      <div class="col-md-6">
        <label class="form-label">Date</label>
        <input type="date" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">Time</label>
        <input type="time" class="form-control">
      </div>
      <div class="col-md-6">
        <label class="form-label">Confirmation Number</label>
        <input type="text" class="form-control" placeholder="Booking reference">
      </div>
      <div class="col-md-6">
        <label class="form-label">Cost</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input type="number" class="form-control" placeholder="0.00">
        </div>
      </div>
      <div class="col-12">
        <label class="form-label">Notes</label>
        <textarea class="form-control" rows="2" placeholder="Additional details, contact info, etc."></textarea>
      </div>
    `
  });
};

const saveBookingsData = () => saveCardData('.booking-card', STORAGE_KEYS.BOOKINGS);

const loadBookingsData = () => {
  loadCardData(STORAGE_KEYS.BOOKINGS, 'booking', SELECTORS.BOOKINGS_CONTAINER, () => {
    addCardToContainer('booking', SELECTORS.BOOKINGS_CONTAINER, createBookingCard, saveBookingsData, EMPTY_MESSAGES.bookings);
  });
};

const initBookingsTracker = () => {
  const addBookingBtn = getElement('.add-booking');
  if (!addBookingBtn) return;

  addBookingBtn.addEventListener('click', () => {
    addCardToContainer('booking', SELECTORS.BOOKINGS_CONTAINER, createBookingCard, saveBookingsData, EMPTY_MESSAGES.bookings);
  });
};

// ============================================
// OVERVIEW DASHBOARD
// ============================================

/**
 * Update overview dashboard with current data
 */
const updateOverviewDashboard = () => {
  // Update counts
  updateElementText('#flights-count', getElements('.flight-card').length);
  updateElementText('#hotels-count', getElements('.hotel-card').length);
  updateElementText('#bookings-count', getElements('.booking-card').length);

  // Update destination display
  const destination = getElement('#destination')?.value;
  if (destination) {
    updateElementText('#trip-destination-display', `Your trip to ${destination}`);
  }

  // Update date displays
  const startDate = getElement('#start-date')?.value;
  const endDate = getElement('#end-date')?.value;
  const travelers = getElement('#travelers')?.value;

  if (startDate) {
    updateElementText('#overview-start-date', formatDate(startDate), false);
  }

  if (endDate) {
    updateElementText('#overview-end-date', formatDate(endDate), false);
  }

  if (travelers) {
    updateElementText('#overview-travelers', travelers, false);
  }

  updateOverviewBudget();
};

/**
 * Update overview budget display
 */
const updateOverviewBudget = () => {
  const budgetInputs = getElements(SELECTORS.BUDGET_INPUTS);
  let total = 0;

  budgetInputs.forEach(input => {
    total += parseFloat(input.value) || 0;
  });

  updateElementText('#overview-budget', `$${total.toFixed(0)}`);
};

// ============================================
// DATE INPUT SETUP
// ============================================

/**
 * Initialize date inputs with minimum dates
 */
const initDateInputs = () => {
  const today = new Date().toISOString().split('T')[0];
  const startDateInput = getElement('#start-date');
  const endDateInput = getElement('#end-date');

  if (startDateInput) {
    startDateInput.setAttribute('min', today);
    
    // Update end date minimum when start date changes
    startDateInput.addEventListener('change', () => {
      if (endDateInput) {
        endDateInput.setAttribute('min', startDateInput.value);
      }
    });
  }

  if (endDateInput) {
    endDateInput.setAttribute('min', today);
  }
};

// ============================================
// DESTINATION CARDS
// ============================================

/**
 * Initialize destination card click handlers
 */
const initDestinationCards = () => {
  const destinationCards = getElements('.destination-card');
  destinationCards.forEach(card => {
    card.addEventListener('click', () => {
      const destinationName = card.querySelector('h3')?.textContent;
      const destinationInput = getElement('#destination');
      
      if (destinationInput && destinationName) {
        destinationInput.value = destinationName;
      }

      const tripDetailsSection = getElement('#trip-details');
      if (tripDetailsSection) {
        tripDetailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
};

// ============================================
// CTA BUTTON
// ============================================

/**
 * Initialize CTA button click handler
 */
const initCtaButton = () => {
  const ctaButton = getElement('.cta-button');
  if (!ctaButton) return;

  ctaButton.addEventListener('click', () => {
    const destinationsSection = getElement('#destinations');
    if (destinationsSection) {
      destinationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

// ============================================
// CONTACT FORM
// ============================================

/**
 * Initialize contact form submission handler
 */
const initContactForm = () => {
  const contactForm = getElement('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[type="text"]')?.value;
    const email = contactForm.querySelector('input[type="email"]')?.value;
    const message = contactForm.querySelector('textarea')?.value;

    alert(`Message sent!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    contactForm.reset();
  });
};

// ============================================
// PACKING CHECKLIST
// ============================================

/**
 * Initialize packing checklist
 */
const initPackingChecklist = () => {
  const addItemBtn = getElement('.packing .add-item');
  if (!addItemBtn) return;

  addItemBtn.addEventListener('click', () => {
    const itemName = prompt('Enter item name:');
    if (itemName?.trim()) {
      addChecklistItem(itemName);
    }
  });
};

/**
 * Add item to packing checklist
 * @param {string} itemName - Name of item to add
 */
const addChecklistItem = (itemName) => {
  const checklist = getElement('.checklist');
  const addItemBtn = getElement('.packing .add-item');
  if (!checklist || !addItemBtn) return;

  const itemDiv = document.createElement('div');
  itemDiv.className = 'form-check mb-2 checklist-item';

  const itemId = `item-${Date.now()}`;
  itemDiv.innerHTML = `
    <input type="checkbox" class="form-check-input" id="${itemId}">
    <label class="form-check-label" for="${itemId}">${itemName}</label>
    <button class="remove-item" aria-label="Remove ${itemName}">×</button>
  `;

  // Remove item button handler
  const removeBtn = itemDiv.querySelector('.remove-item');
  removeBtn.addEventListener('click', () => {
    itemDiv.remove();
  });

  checklist.insertBefore(itemDiv, addItemBtn);
};

// ============================================
// AUTO-SAVE
// ============================================

/**
 * Initialize auto-save on input changes
 */
const initAutoSave = () => {
  document.addEventListener('input', saveTripData);
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all application features
 */
const initApp = () => {
  // Navigation & UI
  initSmoothScrolling();
  initDestinationCards();
  initCtaButton();

  // Forms
  initTripForm();
  initTripDetailsListeners();
  initContactForm();

  // Date inputs
  initDateInputs();

  // Itinerary
  initAddDayButton();

  // Budget
  initBudgetCalculator();

  // Trackers
  initFlightsTracker();
  initHotelsTracker();
  initBookingsTracker();

  // Packing
  initPackingChecklist();

  // Auto-save
  initAutoSave();

  // Load saved data
  loadTripData();
  loadFlightsData();
  loadHotelsData();
  loadBookingsData();
  updateOverviewDashboard();

  console.log('Trip Planner initialized successfully!');
};

// ============================================
// START APPLICATION
// ============================================

// Initialize when DOM is fully loaded
window.addEventListener('load', initApp);

