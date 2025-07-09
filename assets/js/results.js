// Results Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeFilters();
    initializeSorting();
    initializeFavorites();
    initializeComparison();
    initializeTabs();
    initializePropertyCards();
    loadUserPreferences();
});

// Filter System
function initializeFilters() {
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinDisplay = document.getElementById('price-min-display');
    const priceMaxDisplay = document.getElementById('price-max-display');
    const clearFiltersBtn = document.getElementById('clear-filters');

    // Price range filters
    if (priceMin && priceMax) {
        function updatePriceDisplay() {
            const min = parseInt(priceMin.value);
            const max = parseInt(priceMax.value);
            
            priceMinDisplay.textContent = min.toLocaleString('en-IN');
            priceMaxDisplay.textContent = max.toLocaleString('en-IN');
            
            filterProperties();
        }

        priceMin.addEventListener('input', function() {
            if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                priceMax.value = priceMin.value;
            }
            updatePriceDisplay();
        });

        priceMax.addEventListener('input', function() {
            if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
                priceMin.value = priceMax.value;
            }
            updatePriceDisplay();
        });

        updatePriceDisplay();
    }

    // Property type filters
    const propertyTypeFilters = document.querySelectorAll('input[id^="filter-"]');
    propertyTypeFilters.forEach(filter => {
        filter.addEventListener('change', filterProperties);
    });

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function filterProperties() {
    const propertyCards = document.querySelectorAll('.property-card');
    const priceMin = parseInt(document.getElementById('price-min').value);
    const priceMax = parseInt(document.getElementById('price-max').value);
    
    // Get active filters
    const activeFilters = {
        flat: document.getElementById('filter-flat').checked,
        house: document.getElementById('filter-house').checked,
        villa: document.getElementById('filter-villa').checked,
        pg: document.getElementById('filter-pg').checked,
        '1bhk': document.getElementById('filter-1bhk').checked,
        '2bhk': document.getElementById('filter-2bhk').checked,
        '3bhk': document.getElementById('filter-3bhk').checked,
        '4bhk': document.getElementById('filter-4bhk').checked,
        unfurnished: document.getElementById('filter-unfurnished').checked,
        semi: document.getElementById('filter-semi').checked,
        furnished: document.getElementById('filter-furnished').checked
    };

    // Load user preferences for enhanced filtering
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

    propertyCards.forEach(card => {
        let showCard = true;
        let matchScore = 0;
        
        // Price filter
        const rentText = card.querySelector('.property-rent').textContent;
        const rent = parseInt(rentText.replace(/[^\d]/g, ''));
        if (rent < priceMin || rent > priceMax) {
            showCard = false;
        } else {
            matchScore += 20; // Price match
        }

        // Location filter (if user specified location)
        if (preferences.location && preferences.location.city) {
            const locationText = card.querySelector('.property-location span').textContent;
            if (locationText.toLowerCase().includes(preferences.location.city.toLowerCase())) {
                matchScore += 25; // Location match
            }
        }

        // Property type filter
        const propertyName = card.querySelector('.property-name').textContent.toLowerCase();
        if (preferences.housing && preferences.housing.type) {
            const housingType = preferences.housing.type.toLowerCase();
            if (propertyName.includes(housingType) || 
                (housingType === 'flat' && propertyName.includes('apartment')) ||
                (housingType === 'house' && propertyName.includes('house'))) {
                matchScore += 15; // Type match
            }
        }

        // Bedroom filter
        if (preferences.housing && preferences.housing.bedrooms) {
            const bedroomText = card.querySelector('.detail-item span').textContent;
            if (bedroomText.includes(preferences.housing.bedrooms)) {
                matchScore += 15; // Bedroom match
            }
        }

        // Amenities filter
        if (preferences.amenities && Array.isArray(preferences.amenities)) {
            const amenitiesList = card.querySelectorAll('.amenity-tag');
            preferences.amenities.forEach(preferredAmenity => {
                amenitiesList.forEach(amenity => {
                    if (amenity.textContent.toLowerCase().includes(preferredAmenity.toLowerCase())) {
                        matchScore += 5; // Each amenity match
                    }
                });
            });
        }

        // Pet filter
        if (preferences.pets && preferences.pets.hasPets !== 'none') {
            const petAmenities = card.querySelectorAll('.amenity-tag');
            let hasPetAmenity = false;
            petAmenities.forEach(amenity => {
                if (amenity.textContent.toLowerCase().includes('pet')) {
                    hasPetAmenity = true;
                }
            });
            if (hasPetAmenity) {
                matchScore += 10; // Pet friendly match
            }
        }

        // Update match badge
        const matchBadge = card.querySelector('.match-badge');
        if (matchBadge) {
            const matchPercentage = Math.min(95, Math.max(60, matchScore));
            matchBadge.textContent = `${matchPercentage}% Match`;
        }

        if (showCard) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });

    updateMatchCount();
}

function clearAllFilters() {
    // Reset price range
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    priceMin.value = 10000;
    priceMax.value = 50000;
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset to default selections
    document.getElementById('filter-flat').checked = true;
    document.getElementById('filter-2bhk').checked = true;
    document.getElementById('filter-semi').checked = true;
    
    // Show all properties
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease';
    });
    
    updateMatchCount();
    updatePriceDisplay();
}

function updatePriceDisplay() {
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinDisplay = document.getElementById('price-min-display');
    const priceMaxDisplay = document.getElementById('price-max-display');
    
    if (priceMin && priceMax && priceMinDisplay && priceMaxDisplay) {
        priceMinDisplay.textContent = parseInt(priceMin.value).toLocaleString('en-IN');
        priceMaxDisplay.textContent = parseInt(priceMax.value).toLocaleString('en-IN');
    }
}

// Sorting System
function initializeSorting() {
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProperties);
    }
}

function sortProperties() {
    const sortBy = document.getElementById('sort-by').value;
    const resultsGrid = document.getElementById('results-grid');
    const propertyCards = Array.from(document.querySelectorAll('.property-card'));

    propertyCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                const rentA = parseInt(a.querySelector('.property-rent').textContent.replace(/[^\d]/g, ''));
                const rentB = parseInt(b.querySelector('.property-rent').textContent.replace(/[^\d]/g, ''));
                return rentA - rentB;
            
            case 'price-high':
                const rentAHigh = parseInt(a.querySelector('.property-rent').textContent.replace(/[^\d]/g, ''));
                const rentBHigh = parseInt(b.querySelector('.property-rent').textContent.replace(/[^\d]/g, ''));
                return rentBHigh - rentAHigh;
            
            case 'distance':
                const distanceA = parseFloat(a.querySelector('.distance').textContent.match(/\d+\.?\d*/)[0]);
                const distanceB = parseFloat(b.querySelector('.distance').textContent.match(/\d+\.?\d*/)[0]);
                return distanceA - distanceB;
            
            case 'amenities':
                const amenitiesA = a.querySelectorAll('.amenity-tag.matched').length;
                const amenitiesB = b.querySelectorAll('.amenity-tag.matched').length;
                return amenitiesB - amenitiesA;
            
            default: // relevance (match percentage)
                const matchA = parseInt(a.querySelector('.match-badge').textContent);
                const matchB = parseInt(b.querySelector('.match-badge').textContent);
                return matchB - matchA;
        }
    });

    // Reorder DOM elements
    propertyCards.forEach(card => {
        resultsGrid.appendChild(card);
    });
}

// Favorites System
function initializeFavorites() {
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const propertyId = this.dataset.propertyId;
            toggleFavorite(propertyId, this);
        });
    });
}

function toggleFavorite(propertyId, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(propertyId)) {
        favorites = favorites.filter(id => id !== propertyId);
        button.textContent = '🤍';
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(propertyId);
        button.textContent = '❤️';
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Comparison System
function initializeComparison() {
    const compareBtn = document.getElementById('compare-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    
    // Add selection checkboxes to property cards
    propertyCards.forEach(card => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'compare-checkbox';
        checkbox.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            transform: scale(1.2);
        `;
        card.style.position = 'relative';
        card.appendChild(checkbox);
    });

    if (compareBtn) {
        compareBtn.addEventListener('click', showComparison);
    }
}

function showComparison() {
    const selectedCards = document.querySelectorAll('.compare-checkbox:checked');
    
    if (selectedCards.length < 2) {
        showNotification('Please select at least 2 properties to compare', 'error');
        return;
    }
    
    if (selectedCards.length > 4) {
        showNotification('You can compare up to 4 properties at a time', 'error');
        return;
    }

    // Create comparison modal
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.innerHTML = `
        <div class="comparison-content">
            <div class="comparison-header">
                <h2>Property Comparison</h2>
                <button class="close-comparison">&times;</button>
            </div>
            <div class="comparison-grid">
                ${Array.from(selectedCards).map(checkbox => {
                    const card = checkbox.closest('.property-card');
                    return `
                        <div class="comparison-item">
                            <img src="${card.querySelector('.property-img').src}" alt="Property">
                            <h3>${card.querySelector('.property-name').textContent}</h3>
                            <div class="comparison-details">
                                <p><strong>Rent:</strong> ${card.querySelector('.property-rent').textContent}</p>
                                <p><strong>Location:</strong> ${card.querySelector('.property-location span:nth-child(2)').textContent}</p>
                                <p><strong>Match:</strong> ${card.querySelector('.match-badge').textContent}</p>
                                <p><strong>Distance:</strong> ${card.querySelector('.distance').textContent}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const content = modal.querySelector('.comparison-content');
    content.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 20px;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
    `;

    document.body.appendChild(modal);

    // Close functionality
    const closeBtn = modal.querySelector('.close-comparison');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Tab System
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Property Cards Interactions
function initializePropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        // Quick view functionality
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showQuickView(card);
            });
        }

        // Contact owner functionality
        const contactBtn = card.querySelector('.btn-primary');
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                contactOwner(card);
            });
        }

        // View details functionality
        const detailsBtn = card.querySelector('.btn-secondary');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                viewDetails(card);
            });
        }
    });
}

function showQuickView(card) {
    const propertyName = card.querySelector('.property-name').textContent;
    const propertyRent = card.querySelector('.property-rent').textContent;
    const propertyLocation = card.querySelector('.property-location span:nth-child(2)').textContent;
    
    showNotification(`Quick view: ${propertyName} - ${propertyRent} in ${propertyLocation}`, 'info');
}

function contactOwner(card) {
    const propertyName = card.querySelector('.property-name').textContent;
    showNotification(`Contacting owner for ${propertyName}...`, 'success');
    
    // Simulate contact process
    setTimeout(() => {
        showNotification('Owner contacted successfully! You will receive a response soon.', 'success');
    }, 2000);
}

function viewDetails(card) {
    const propertyName = card.querySelector('.property-name').textContent;
    showNotification(`Loading detailed information for ${propertyName}...`, 'info');
    
    // Simulate loading details
    setTimeout(() => {
        showNotification('Detailed view opened in new window', 'success');
    }, 1000);
}

// Load User Preferences
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    if (Object.keys(preferences).length > 0) {
        console.log('Loading user preferences:', preferences);
        
        // Update filter tags based on preferences
        updateFilterTags(preferences);
        
        // Generate dynamic properties based on preferences
        generateDynamicProperties(preferences);
        
        // Update match count
        updateMatchCount();
        
        // Apply initial filters based on preferences
        applyPreferenceFilters(preferences);
    } else {
        console.log('No user preferences found');
    }
}

function updateFilterTags(preferences) {
    const filterTags = document.getElementById('filter-tags');
    if (!filterTags) return;

    // Clear existing tags
    filterTags.innerHTML = '';

    // Add tags based on preferences
    if (preferences.budget && preferences.budget.range) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = `Budget: ${preferences.budget.range}`;
        filterTags.appendChild(tag);
    }

    if (preferences.location && preferences.location.city) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = `Location: ${preferences.location.city.charAt(0).toUpperCase() + preferences.location.city.slice(1)}`;
        filterTags.appendChild(tag);
    }

    if (preferences.housing && preferences.housing.type) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = `Type: ${preferences.housing.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
        filterTags.appendChild(tag);
    }

    if (preferences.housing && preferences.housing.bedrooms) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = `${preferences.housing.bedrooms} BHK`;
        filterTags.appendChild(tag);
    }

    // Add amenity tags
    if (preferences.amenities && Array.isArray(preferences.amenities)) {
        preferences.amenities.slice(0, 2).forEach(amenity => {
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.textContent = amenity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            filterTags.appendChild(tag);
        });
    }

    // Add pet preference tag
    if (preferences.pets && preferences.pets.hasPets) {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = preferences.pets.hasPets === 'has' ? 'Have Pets' : 
                         preferences.pets.hasPets === 'want' ? 'Want Pets' : 'Pet Friendly';
        filterTags.appendChild(tag);
    }
}

function applyPreferenceFilters(preferences) {
    console.log('Applying preference filters:', preferences);
    
    // Apply budget filters
    if (preferences.budget && preferences.budget.range) {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        if (priceMin && priceMax) {
            // Parse budget range (e.g., "5000-15000" or "100000+")
            const budgetRange = preferences.budget.range;
            if (budgetRange.includes('-')) {
                const [min, max] = budgetRange.split('-').map(Number);
                priceMin.value = min;
                priceMax.value = max;
            } else if (budgetRange.includes('+')) {
                const min = parseInt(budgetRange.replace('+', ''));
                priceMin.value = min;
                priceMax.value = 200000; // Set a high max for "Above" ranges
            }
            updatePriceDisplay();
        }
    }

    // Apply property type filters
    if (preferences.housing && preferences.housing.type) {
        const typeMap = {
            'flat': 'filter-flat',
            'house': 'filter-house',
            'villa': 'filter-villa',
            'pg-hostel': 'filter-pg',
            'shared-apartment': 'filter-flat',
            'independent-house': 'filter-house',
            'studio': 'filter-flat'
        };
        
        const filterId = typeMap[preferences.housing.type];
        if (filterId) {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.checked = true;
            }
        }
    }

    // Apply bedroom filters
    if (preferences.housing && preferences.housing.bedrooms) {
        const bedroomMap = {
            '1': 'filter-1bhk',
            '2': 'filter-2bhk',
            '3': 'filter-3bhk',
            '4': 'filter-4bhk',
            '5+': 'filter-4bhk'
        };
        
        const filterId = bedroomMap[preferences.housing.bedrooms];
        if (filterId) {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.checked = true;
            }
        }
    }

    // Apply furnishing filters
    if (preferences.housing && preferences.housing.furnishing) {
        const furnishingMap = {
            'unfurnished': 'filter-unfurnished',
            'semi-furnished': 'filter-semi',
            'fully-furnished': 'filter-furnished'
        };
        
        const filterId = furnishingMap[preferences.housing.furnishing];
        if (filterId) {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.checked = true;
            }
        }
    }

    // Apply filters to show matching properties
    filterProperties();
}

function updateMatchCount() {
    const visibleCards = document.querySelectorAll('.property-card[style*="display: block"], .property-card:not([style*="display: none"])');
    const matchCount = document.getElementById('match-count');
    
    if (matchCount) {
        matchCount.textContent = visibleCards.length;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00C851' : '#33b5e5'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .comparison-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
    }
    
    .comparison-item img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    
    .comparison-details p {
        margin: 5px 0;
        font-size: 14px;
    }
    
    .comparison-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .close-comparison {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.forEach(propertyId => {
        const btn = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (btn) {
            btn.textContent = '❤️';
        }
    });
});

// Generate dynamic properties based on user preferences
function generateDynamicProperties(preferences) {
    const resultsGrid = document.getElementById('results-grid');
    if (!resultsGrid) return;

    // Property data based on preferences
    const propertyData = generatePropertyData(preferences);
    
    // Add new properties to the grid
    propertyData.forEach((property, index) => {
        const propertyCard = createPropertyCard(property, index + 4); // Start after existing cards
        resultsGrid.appendChild(propertyCard);
    });
}

function generatePropertyData(preferences) {
    const properties = [];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];
    const areas = {
        'Mumbai': ['Bandra West', 'Andheri West', 'Worli', 'Juhu', 'Powai'],
        'Delhi': ['Connaught Place', 'Dwarka', 'Saket', 'Vasant Vihar'],
        'Bangalore': ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield'],
        'Pune': ['Baner', 'Kharadi', 'Koregaon Park', 'Viman Nagar'],
        'Hyderabad': ['Banjara Hills', 'Gachibowli', 'Jubilee Hills', 'Madhapur']
    };

    // Generate 3-5 properties based on preferences
    const numProperties = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < numProperties; i++) {
        const city = preferences.location?.city || cities[Math.floor(Math.random() * cities.length)];
        const cityAreas = areas[city] || areas['Mumbai'];
        const area = cityAreas[Math.floor(Math.random() * cityAreas.length)];
        
        // Calculate budget range
        let rent = 25000;
        if (preferences.budget?.range) {
            const budgetRange = preferences.budget.range;
            if (budgetRange.includes('-')) {
                const [min, max] = budgetRange.split('-').map(Number);
                rent = Math.floor(Math.random() * (max - min)) + min;
            } else if (budgetRange.includes('+')) {
                const min = parseInt(budgetRange.replace('+', ''));
                rent = min + Math.floor(Math.random() * 20000);
            }
        }

        // Determine property type and name
        let propertyType = 'Flat';
        let propertyName = '';
        if (preferences.housing?.type) {
            const type = preferences.housing.type;
            if (type.includes('flat')) {
                propertyType = 'Flat';
                propertyName = `${area} Heights - ${preferences.housing.bedrooms || '2'}BHK`;
            } else if (type.includes('house')) {
                propertyType = 'House';
                propertyName = `${area} Villa - ${preferences.housing.bedrooms || '3'}BHK`;
            } else if (type.includes('pg')) {
                propertyType = 'PG';
                propertyName = `${area} PG - Premium`;
            } else if (type.includes('villa')) {
                propertyType = 'Villa';
                propertyName = `${area} Luxury Villa`;
            }
        } else {
            propertyName = `${area} Residences - 2BHK`;
        }

        // Generate amenities based on preferences
        const amenities = [];
        if (preferences.amenities) {
            const amenityMap = {
                'walkability': '🚶 Walkability',
                'public-transport': '🚇 Public Transport',
                'restaurants': '🍽️ Restaurants',
                'shopping': '🛍️ Shopping',
                'schools': '🏫 Schools',
                'healthcare': '🏥 Healthcare',
                'safety': '🛡️ Security',
                'parking': '🚗 Parking',
                'pet-friendly': '🐕 Pet Friendly',
                'internet': '📶 Internet'
            };
            
            preferences.amenities.forEach(amenity => {
                if (amenityMap[amenity]) {
                    amenities.push(amenityMap[amenity]);
                }
            });
        }

        // Add some default amenities
        if (amenities.length < 3) {
            amenities.push('🏊 Pool', '🏋️ Gym', '🌳 Garden');
        }

        properties.push({
            id: 100 + i,
            name: propertyName,
            rent: rent,
            location: `${area}, ${city}`,
            bedrooms: preferences.housing?.bedrooms || '2',
            area: Math.floor(Math.random() * 500) + 800,
            floor: Math.floor(Math.random() * 20) + 1,
            parking: Math.random() > 0.5 ? 'Covered Parking' : 'Street Parking',
            amenities: amenities,
            matchScore: Math.floor(Math.random() * 20) + 75,
            image: `https://images.pexels.com/photos/${1571460 + i}/pexels-photo-${1571460 + i}.jpeg?auto=compress&cs=tinysrgb&w=800`
        });
    }

    return properties;
}

function createPropertyCard(property, cardId) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', cardId);
    
    card.innerHTML = `
        <div class="property-image">
            <img src="${property.image}" alt="${property.name}" class="property-img">
            <div class="match-badge">${property.matchScore}% Match</div>
            <button class="favorite-btn" data-property-id="${cardId}">🤍</button>
            <div class="property-overlay">
                <button class="quick-view-btn">Quick View</button>
            </div>
        </div>
        <div class="property-content">
            <div class="property-header">
                <h3 class="property-name">${property.name}</h3>
                <span class="property-rent">₹${property.rent.toLocaleString('en-IN')}</span>
            </div>
            <div class="property-location">
                <span class="location-icon">📍</span>
                <span>${property.location}</span>
                <span class="distance">${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} km from work</span>
            </div>
            <div class="property-details">
                <div class="detail-item">
                    <span class="detail-icon">🛏️</span>
                    <span>${property.bedrooms} BHK</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📏</span>
                    <span>${property.area} sq ft</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🏢</span>
                    <span>${property.floor}${getOrdinalSuffix(property.floor)} Floor</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🚗</span>
                    <span>${property.parking}</span>
                </div>
            </div>
            <div class="property-amenities">
                <h4>Key Amenities</h4>
                <div class="amenities-list">
                    ${property.amenities.map(amenity => `<span class="amenity-tag matched">${amenity}</span>`).join('')}
                </div>
            </div>
            <div class="neighborhood-score">
                <div class="score-item">
                    <span class="score-label">Safety</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${Math.floor(Math.random() * 20) + 75}%"></div>
                    </div>
                    <span class="score-value">${(Math.random() * 2 + 7).toFixed(1)}/10</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Connectivity</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${Math.floor(Math.random() * 20) + 75}%"></div>
                    </div>
                    <span class="score-value">${(Math.random() * 2 + 7).toFixed(1)}/10</span>
                </div>
            </div>
            <div class="property-actions">
                <button class="action-btn btn-primary">Contact Owner</button>
                <button class="action-btn btn-secondary">View Details</button>
            </div>
        </div>
    `;
    
    return card;
}

function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}