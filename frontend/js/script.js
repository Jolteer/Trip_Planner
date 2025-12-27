// Trip Planner JavaScript

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Trip Details Form Handler
const tripForm = document.querySelector('.trip-form form');
if (tripForm) {
    tripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const destination = document.getElementById('destination').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const travelers = document.getElementById('travelers').value;
        
        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            alert('End date must be after start date!');
            return;
        }
        
        // Calculate trip duration
        const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        
        alert(`Trip created!\nDestination: ${destination}\nDuration: ${duration} days\nTravelers: ${travelers}`);
        
        // Generate itinerary days
        generateItinerary(duration);
        
        // Update overview dashboard
        updateOverviewDashboard();
    });
}

// Generate Itinerary Days
function generateItinerary(days) {
    const itineraryContainer = document.querySelector('.itinerary-container');
    itineraryContainer.innerHTML = '';
    
    for (let i = 1; i <= days; i++) {
        const dayPlan = createDayPlan(i);
        itineraryContainer.appendChild(dayPlan);
    }
}

// Create Day Plan Element
function createDayPlan(dayNumber) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'col-md-6 col-lg-4';
    dayDiv.innerHTML = `
        <div class="card day-plan h-100 shadow-sm">
            <div class="card-header bg-info text-white">
                <h3 class="h5 mb-0">Day ${dayNumber}</h3>
            </div>
            <div class="card-body">
                <ul class="activity-list list-unstyled">
                    <li class="d-flex align-items-center mb-2">
                        <i class="bi bi-sunrise me-2"></i>
                        <span>Morning:</span>
                        <input type="text" class="form-control form-control-sm ms-2" placeholder="Add activity">
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <i class="bi bi-sun me-2"></i>
                        <span>Afternoon:</span>
                        <input type="text" class="form-control form-control-sm ms-2" placeholder="Add activity">
                    </li>
                    <li class="d-flex align-items-center mb-2">
                        <i class="bi bi-moon-stars me-2"></i>
                        <span>Evening:</span>
                        <input type="text" class="form-control form-control-sm ms-2" placeholder="Add activity">
                    </li>
                </ul>
                <button class="btn btn-sm btn-outline-info add-activity">+ Add Activity</button>
            </div>
        </div>
    `;
    
    // Add activity button handler
    const addActivityBtn = dayDiv.querySelector('.add-activity');
    addActivityBtn.addEventListener('click', function() {
        const activityList = dayDiv.querySelector('.activity-list');
        const newActivity = document.createElement('li');
        newActivity.className = 'd-flex align-items-center mb-2';
        newActivity.innerHTML = '<input type="text" class="form-control form-control-sm" placeholder="Add activity">';
        activityList.appendChild(newActivity);
    });
    
    return dayDiv;
}

// Add Day Button Handler
const addDayBtn = document.querySelector('.add-day');
if (addDayBtn) {
    addDayBtn.addEventListener('click', function() {
        const itineraryContainer = document.querySelector('.itinerary-container');
        const currentDays = itineraryContainer.querySelectorAll('.day-plan').length;
        const newDay = createDayPlan(currentDays + 1);
        itineraryContainer.appendChild(newDay);
    });
}

// Budget Calculator
const budgetInputs = document.querySelectorAll('.budget-item');
const totalBudgetSpan = document.getElementById('total-budget');

function calculateTotal() {
    let total = 0;
    budgetInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    if (totalBudgetSpan) {
        totalBudgetSpan.textContent = `$${total.toFixed(2)}`;
    }
    updateOverviewBudget();
}

budgetInputs.forEach(input => {
    input.addEventListener('input', calculateTotal);
});

// Packing Checklist
const packingChecklist = document.querySelector('.checklist');
const addItemBtn = document.querySelector('.packing .add-item');

if (addItemBtn) {
    addItemBtn.addEventListener('click', function() {
        const itemName = prompt('Enter item name:');
        if (itemName && itemName.trim() !== '') {
            addChecklistItem(itemName);
        }
    });
}

function addChecklistItem(itemName) {
    const checklist = document.querySelector('.checklist');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'form-check mb-2 checklist-item';
    
    const itemId = 'item-' + Date.now();
    itemDiv.innerHTML = `
        <input type="checkbox" class="form-check-input" id="${itemId}">
        <label class="form-check-label" for="${itemId}">${itemName}</label>
        <button class="remove-item">×</button>
    `;
    
    // Remove item button
    const removeBtn = itemDiv.querySelector('.remove-item');
    removeBtn.addEventListener('click', function() {
        itemDiv.remove();
    });
    
    checklist.insertBefore(itemDiv, addItemBtn);
}

// Contact Form Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        alert(`Message sent!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        
        // Reset form
        this.reset();
    });
}

// Destination Cards Click Handler
const destinationCards = document.querySelectorAll('.destination-card');
destinationCards.forEach(card => {
    card.addEventListener('click', function() {
        const destinationName = this.querySelector('h3').textContent;
        document.getElementById('destination').value = destinationName;
        
        // Scroll to trip details
        document.getElementById('trip-details').scrollIntoView({ behavior: 'smooth' });
    });
});

// CTA Button Handler
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    });
}

// Local Storage - Save Trip Data
function saveTripData() {
    const tripData = {
        destination: document.getElementById('destination')?.value || '',
        startDate: document.getElementById('start-date')?.value || '',
        endDate: document.getElementById('end-date')?.value || '',
        travelers: document.getElementById('travelers')?.value || 1,
        budget: {}
    };
    
    // Save budget items
    budgetInputs.forEach((input, index) => {
        const label = input.closest('.col-md-6')?.querySelector('.form-label')?.textContent.replace(':', '') || `Item${index}`;
        tripData.budget[label] = input.value;
    });
    
    localStorage.setItem('tripPlannerData', JSON.stringify(tripData));
}

// Load Trip Data from Local Storage
function loadTripData() {
    const savedData = localStorage.getItem('tripPlannerData');
    if (savedData) {
        const tripData = JSON.parse(savedData);
        
        if (document.getElementById('destination')) {
            document.getElementById('destination').value = tripData.destination || '';
        }
        if (document.getElementById('start-date')) {
            document.getElementById('start-date').value = tripData.startDate || '';
        }
        if (document.getElementById('end-date')) {
            document.getElementById('end-date').value = tripData.endDate || '';
        }
        if (document.getElementById('travelers')) {
            document.getElementById('travelers').value = tripData.travelers || 1;
        }
        
        // Load budget items
        budgetInputs.forEach((input, index) => {
            const label = input.closest('.col-md-6')?.querySelector('.form-label')?.textContent.replace(':', '') || `Item${index}`;
            if (tripData.budget[label]) {
                input.value = tripData.budget[label];
            }
        });
        
        calculateTotal();
    }
}

// Auto-save on input changes
document.addEventListener('input', function() {
    saveTripData();
});

// Update overview when trip details change
const tripDetailsInputs = ['destination', 'start-date', 'end-date', 'travelers'];
tripDetailsInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', updateOverviewDashboard);
    }
});

// Load data on page load
window.addEventListener('load', function() {
    loadTripData();
});

// Set minimum date to today for date inputs
const today = new Date().toISOString().split('T')[0];
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

if (startDateInput) {
    startDateInput.setAttribute('min', today);
}

if (endDateInput) {
    endDateInput.setAttribute('min', today);
}

// Update end date minimum when start date changes
if (startDateInput) {
    startDateInput.addEventListener('change', function() {
        endDateInput.setAttribute('min', this.value);
    });
}

console.log('Trip Planner initialized successfully!');

// ===== FLIGHTS TRACKER =====
const addFlightBtn = document.querySelector('.add-flight');
const flightsContainer = document.querySelector('.flights-container');

if (addFlightBtn) {
    addFlightBtn.addEventListener('click', function() {
        addFlightCard();
    });
}

function addFlightCard() {
    const flightId = 'flight-' + Date.now();
    const flightCard = document.createElement('div');
    flightCard.className = 'mb-3 flight-card';
    flightCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0"><i class="bi bi-airplane-fill"></i> Flight Details</h5>
                    <button class="btn btn-sm btn-danger remove-flight">×</button>
                </div>
                <div class="row g-3">
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
                </div>
            </div>
        </div>
    `;
    
    // Remove initial alert if exists
    const alert = flightsContainer.querySelector('.alert');
    if (alert) alert.remove();
    
    flightsContainer.appendChild(flightCard);
    
    // Add remove handler
    flightCard.querySelector('.remove-flight').addEventListener('click', function() {
        flightCard.remove();
        if (flightsContainer.children.length === 0) {
            flightsContainer.innerHTML = '<div class="alert alert-info"><i class="bi bi-info-circle"></i> Click "Add Flight" to track your flights</div>';
        }
        saveFlightsData();
    });
    
    // Add input listeners for auto-save
    flightCard.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', saveFlightsData);
    });
    
    saveFlightsData();
}

// ===== HOTELS TRACKER =====
const addHotelBtn = document.querySelector('.add-hotel');
const hotelsContainer = document.querySelector('.hotels-container');

if (addHotelBtn) {
    addHotelBtn.addEventListener('click', function() {
        addHotelCard();
    });
}

function addHotelCard() {
    const hotelCard = document.createElement('div');
    hotelCard.className = 'mb-3 hotel-card';
    hotelCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0"><i class="bi bi-building-fill"></i> Accommodation Details</h5>
                    <button class="btn btn-sm btn-danger remove-hotel">×</button>
                </div>
                <div class="row g-3">
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
                </div>
            </div>
        </div>
    `;
    
    // Remove initial alert if exists
    const alert = hotelsContainer.querySelector('.alert');
    if (alert) alert.remove();
    
    hotelsContainer.appendChild(hotelCard);
    
    // Add remove handler
    hotelCard.querySelector('.remove-hotel').addEventListener('click', function() {
        hotelCard.remove();
        if (hotelsContainer.children.length === 0) {
            hotelsContainer.innerHTML = '<div class="alert alert-warning"><i class="bi bi-info-circle"></i> Click "Add Hotel" to track your accommodations</div>';
        }
        saveHotelsData();
    });
    
    // Add input listeners for auto-save
    hotelCard.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', saveHotelsData);
    });
    
    saveHotelsData();
}

// ===== OTHER BOOKINGS TRACKER =====
const addBookingBtn = document.querySelector('.add-booking');
const bookingsContainer = document.querySelector('.bookings-container');

if (addBookingBtn) {
    addBookingBtn.addEventListener('click', function() {
        addBookingCard();
    });
}

function addBookingCard() {
    const bookingCard = document.createElement('div');
    bookingCard.className = 'mb-3 booking-card';
    bookingCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0"><i class="bi bi-calendar-check-fill"></i> Booking Details</h5>
                    <button class="btn btn-sm btn-danger remove-booking">×</button>
                </div>
                <div class="row g-3">
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
                </div>
            </div>
        </div>
    `;
    
    // Remove initial alert if exists
    const alert = bookingsContainer.querySelector('.alert');
    if (alert) alert.remove();
    
    bookingsContainer.appendChild(bookingCard);
    
    // Add remove handler
    bookingCard.querySelector('.remove-booking').addEventListener('click', function() {
        bookingCard.remove();
        if (bookingsContainer.children.length === 0) {
            bookingsContainer.innerHTML = '<div class="alert alert-secondary"><i class="bi bi-info-circle"></i> Track car rentals, tours, restaurants, and other reservations</div>';
        }
        saveBookingsData();
    });
    
    // Add input listeners for auto-save
    bookingCard.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', saveBookingsData);
    });
    
    saveBookingsData();
}

// ===== LOCAL STORAGE FOR FLIGHTS =====
function saveFlightsData() {
    const flights = [];
    document.querySelectorAll('.flight-card').forEach(card => {
        const inputs = card.querySelectorAll('input, textarea');
        const flightData = {};
        inputs.forEach((input, index) => {
            flightData[`field${index}`] = input.value;
        });
        flights.push(flightData);
    });
    localStorage.setItem('tripPlannerFlights', JSON.stringify(flights));
    updateOverviewDashboard();
}

function loadFlightsData() {
    const savedFlights = localStorage.getItem('tripPlannerFlights');
    if (savedFlights) {
        const flights = JSON.parse(savedFlights);
        flights.forEach(flightData => {
            addFlightCard();
            const lastCard = flightsContainer.lastElementChild;
            const inputs = lastCard.querySelectorAll('input, textarea');
            inputs.forEach((input, index) => {
                if (flightData[`field${index}`]) {
                    input.value = flightData[`field${index}`];
                }
            });
        });
    }
}

// ===== LOCAL STORAGE FOR HOTELS =====
function saveHotelsData() {
    const hotels = [];
    document.querySelectorAll('.hotel-card').forEach(card => {
        const inputs = card.querySelectorAll('input, textarea');
        const hotelData = {};
        inputs.forEach((input, index) => {
            hotelData[`field${index}`] = input.value;
        });
        hotels.push(hotelData);
    });
    localStorage.setItem('tripPlannerHotels', JSON.stringify(hotels));
    updateOverviewDashboard();
}

function loadHotelsData() {
    const savedHotels = localStorage.getItem('tripPlannerHotels');
    if (savedHotels) {
        const hotels = JSON.parse(savedHotels);
        hotels.forEach(hotelData => {
            addHotelCard();
            const lastCard = hotelsContainer.lastElementChild;
            const inputs = lastCard.querySelectorAll('input, textarea');
            inputs.forEach((input, index) => {
                if (hotelData[`field${index}`]) {
                    input.value = hotelData[`field${index}`];
                }
            });
        });
    }
}

// ===== LOCAL STORAGE FOR BOOKINGS =====
function saveBookingsData() {
    const bookings = [];
    document.querySelectorAll('.booking-card').forEach(card => {
        const inputs = card.querySelectorAll('input, textarea, select');
        const bookingData = {};
        inputs.forEach((input, index) => {
            bookingData[`field${index}`] = input.value;
        });
        bookings.push(bookingData);
    });
    localStorage.setItem('tripPlannerBookings', JSON.stringify(bookings));
    updateOverviewDashboard();
}

function loadBookingsData() {
    const savedBookings = localStorage.getItem('tripPlannerBookings');
    if (savedBookings) {
        const bookings = JSON.parse(savedBookings);
        bookings.forEach(bookingData => {
            addBookingCard();
            const lastCard = bookingsContainer.lastElementChild;
            const inputs = lastCard.querySelectorAll('input, textarea, select');
            inputs.forEach((input, index) => {
                if (bookingData[`field${index}`]) {
                    input.value = bookingData[`field${index}`];
                }
            });
        });
    }
}

// Load all saved data on page load
window.addEventListener('load', function() {
    loadFlightsData();
    loadHotelsData();
    loadBookingsData();
    updateOverviewDashboard();
});

// ===== OVERVIEW DASHBOARD UPDATES =====
function updateOverviewDashboard() {
    // Update flights count
    const flightsCount = document.querySelectorAll('.flight-card').length;
    const flightsCountEl = document.getElementById('flights-count');
    if (flightsCountEl) flightsCountEl.textContent = flightsCount;

    // Update hotels count
    const hotelsCount = document.querySelectorAll('.hotel-card').length;
    const hotelsCountEl = document.getElementById('hotels-count');
    if (hotelsCountEl) hotelsCountEl.textContent = hotelsCount;

    // Update bookings count
    const bookingsCount = document.querySelectorAll('.booking-card').length;
    const bookingsCountEl = document.getElementById('bookings-count');
    if (bookingsCountEl) bookingsCountEl.textContent = bookingsCount;

    // Update destination display
    const destination = document.getElementById('destination')?.value;
    const destinationDisplay = document.getElementById('trip-destination-display');
    if (destinationDisplay && destination) {
        destinationDisplay.textContent = `Your trip to ${destination}`;
    }

    // Update date displays
    const startDate = document.getElementById('start-date')?.value;
    const endDate = document.getElementById('end-date')?.value;
    const travelers = document.getElementById('travelers')?.value;
    
    const overviewStartDate = document.getElementById('overview-start-date');
    const overviewEndDate = document.getElementById('overview-end-date');
    const overviewTravelers = document.getElementById('overview-travelers');
    
    if (overviewStartDate && startDate) {
        overviewStartDate.textContent = new Date(startDate).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
        });
        overviewStartDate.classList.remove('text-muted');
    }
    
    if (overviewEndDate && endDate) {
        overviewEndDate.textContent = new Date(endDate).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
        });
        overviewEndDate.classList.remove('text-muted');
    }
    
    if (overviewTravelers && travelers) {
        overviewTravelers.textContent = travelers;
        overviewTravelers.classList.remove('text-muted');
    }

    // Update budget display in overview
    updateOverviewBudget();
}

function updateOverviewBudget() {
    let total = 0;
    budgetInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    const overviewBudget = document.getElementById('overview-budget');
    if (overviewBudget) {
        overviewBudget.textContent = `$${total.toFixed(0)}`;
    }
}

