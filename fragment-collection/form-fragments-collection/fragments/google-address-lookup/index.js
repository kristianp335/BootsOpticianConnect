/**
 * Google Address Lookup Fragment
 * Integrates with Google Places API for address autocomplete and field population
 */

(function() {
  'use strict';
  
  // Fragment-scoped variables
  let autocompleteInstance = null;
  let inputElement = null;
  let loadingIndicator = null;
  let errorMessage = null;
  let isApiLoaded = false;
  
  // Configuration from Liferay - will be populated by loadFragmentConfiguration()
  const config = {
    apiKey: '',
    fieldName: 'addressLine1',
    addressLine2Field: 'branchAddressLine2',
    cityField: 'city', 
    postcodeField: 'postcode'
  };
  
  /**
   * Initialize the Google Address Lookup functionality
   */
  function initializeAddressLookup() {
    try {
      // Get DOM elements
      inputElement = fragmentElement.querySelector('.address-lookup-input');
      loadingIndicator = fragmentElement.querySelector('.address-loading-indicator');
      errorMessage = fragmentElement.querySelector('.address-error-message');
      
      if (!inputElement) {
        console.error('Google Address Lookup: Input element not found');
        return;
      }
      
      // Load configuration from fragment configuration
      loadFragmentConfiguration();
      
      // Check if API key is configured
      if (!config.apiKey) {
        showError('Google Places API key not configured');
        return;
      }
      
      // Load Google Places API
      loadGooglePlacesAPI();
      
    } catch (error) {
      console.error('Google Address Lookup: Initialization failed', error);
      showError('Failed to initialize address lookup');
    }
  }
  
  /**
   * Load fragment configuration from Liferay configuration
   */
  function loadFragmentConfiguration() {
    try {
      // Access Liferay fragment configuration object
      if (typeof configuration !== 'undefined') {
        // Use Liferay's configuration object
        config.apiKey = configuration.googleApiKey || '';
        config.fieldName = configuration.fieldName || 'addressLine1';
        config.addressLine2Field = configuration.addressLine2Field || 'branchAddressLine2';
        config.cityField = configuration.cityField || 'city';
        config.postcodeField = configuration.postcodeField || 'postcode';
      }
      
      // Also get field name from the input element itself
      const inputElement = fragmentElement.querySelector('.address-lookup-input');
      if (inputElement && inputElement.getAttribute('name')) {
        config.fieldName = inputElement.getAttribute('name');
      }
      
      console.log('Google Address Lookup: Configuration loaded', {
        hasApiKey: !!config.apiKey,
        fieldName: config.fieldName,
        targetFields: {
          addressLine2: config.addressLine2Field,
          city: config.cityField,
          postcode: config.postcodeField
        }
      });
      
    } catch (error) {
      console.warn('Google Address Lookup: Could not load configuration, using defaults', error);
    }
  }
  
  /**
   * Load Google Places API dynamically
   */
  function loadGooglePlacesAPI() {
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
      return;
    }
    
    if (isApiLoaded) {
      return;
    }
    
    showLoading(true);
    isApiLoaded = true;
    
    // Create script element for Google Places API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places&callback=initGoogleAddressLookup`;
    script.async = true;
    script.defer = true;
    
    // Global callback for Google API
    window.initGoogleAddressLookup = function() {
      showLoading(false);
      initializeAutocomplete();
    };
    
    script.onerror = function() {
      showLoading(false);
      showError('Failed to load Google Places API');
    };
    
    document.head.appendChild(script);
  }
  
  /**
   * Initialize Google Places Autocomplete
   */
  function initializeAutocomplete() {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        showError('Google Places API not available');
        return;
      }
      
      // Create autocomplete instance
      autocompleteInstance = new window.google.maps.places.Autocomplete(inputElement, {
        types: ['address'],
        componentRestrictions: { country: ['gb', 'us', 'ca', 'au'] }, // Adjust countries as needed
        fields: ['address_components', 'formatted_address', 'name']
      });
      
      // Listen for place selection
      autocompleteInstance.addListener('place_changed', onPlaceSelected);
      
      hideError();
      
    } catch (error) {
      console.error('Google Address Lookup: Autocomplete initialization failed', error);
      showError('Failed to initialize address autocomplete');
    }
  }
  
  /**
   * Handle place selection from Google Places
   */
  function onPlaceSelected() {
    try {
      const place = autocompleteInstance.getPlace();
      
      if (!place || !place.address_components) {
        console.warn('Google Address Lookup: No address components found');
        return;
      }
      
      // Parse address components
      const addressData = parseAddressComponents(place.address_components);
      
      // Populate the main address field (this fragment's input)
      const addressLine1 = buildAddressLine1(addressData);
      inputElement.value = addressLine1;
      
      // Populate other fields on the page
      populateTargetFields(addressData);
      
      // Trigger change events
      triggerChangeEvent(inputElement);
      
    } catch (error) {
      console.error('Google Address Lookup: Place selection failed', error);
      showError('Failed to process selected address');
    }
  }
  
  /**
   * Parse Google address components into usable data
   */
  function parseAddressComponents(components) {
    const addressData = {
      streetNumber: '',
      route: '',
      locality: '',
      postalCode: '',
      subpremise: '',
      administrativeAreaLevel1: '',
      administrativeAreaLevel2: '',
      country: ''
    };
    
    components.forEach(component => {
      const types = component.types;
      const value = component.long_name;
      
      if (types.includes('street_number')) {
        addressData.streetNumber = value;
      } else if (types.includes('route')) {
        addressData.route = value;
      } else if (types.includes('locality')) {
        addressData.locality = value;
      } else if (types.includes('postal_code')) {
        addressData.postalCode = value;
      } else if (types.includes('subpremise')) {
        addressData.subpremise = value;
      } else if (types.includes('administrative_area_level_1')) {
        addressData.administrativeAreaLevel1 = value;
      } else if (types.includes('administrative_area_level_2')) {
        addressData.administrativeAreaLevel2 = value;
      } else if (types.includes('country')) {
        addressData.country = value;
      }
    });
    
    return addressData;
  }
  
  /**
   * Build the first line of address (house number + street name)
   */
  function buildAddressLine1(addressData) {
    const parts = [];
    
    if (addressData.streetNumber) {
      parts.push(addressData.streetNumber);
    }
    
    if (addressData.route) {
      parts.push(addressData.route);
    }
    
    return parts.join(' ');
  }
  
  /**
   * Populate target fields on the page
   */
  function populateTargetFields(addressData) {
    try {
      // Address Line 2 (apartment/unit info)
      if (config.addressLine2Field && addressData.subpremise) {
        const addressLine2Field = document.querySelector(`[name="${config.addressLine2Field}"]`);
        if (addressLine2Field) {
          addressLine2Field.value = addressData.subpremise;
          triggerChangeEvent(addressLine2Field);
        }
      }
      
      // City
      if (config.cityField && addressData.locality) {
        const cityField = document.querySelector(`[name="${config.cityField}"]`);
        if (cityField) {
          cityField.value = addressData.locality;
          triggerChangeEvent(cityField);
        }
      }
      
      // Postcode
      if (config.postcodeField && addressData.postalCode) {
        const postcodeField = document.querySelector(`[name="${config.postcodeField}"]`);
        if (postcodeField) {
          postcodeField.value = addressData.postalCode;
          triggerChangeEvent(postcodeField);
        }
      }
      
    } catch (error) {
      console.error('Google Address Lookup: Field population failed', error);
    }
  }
  
  /**
   * Trigger change event on an element
   */
  function triggerChangeEvent(element) {
    const event = new Event('change', { bubbles: true });
    element.dispatchEvent(event);
  }
  
  /**
   * Show/hide loading indicator
   */
  function showLoading(show) {
    if (loadingIndicator) {
      loadingIndicator.style.display = show ? 'block' : 'none';
    }
  }
  
  /**
   * Show error message
   */
  function showError(message) {
    if (errorMessage) {
      errorMessage.querySelector('.error-text').textContent = message;
      errorMessage.style.display = 'block';
    }
    console.error('Google Address Lookup:', message);
  }
  
  /**
   * Hide error message
   */
  function hideError() {
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  }
  
  /**
   * Cleanup function for fragment destruction
   */
  function cleanup() {
    if (autocompleteInstance) {
      window.google.maps.event.clearInstanceListeners(autocompleteInstance);
      autocompleteInstance = null;
    }
    
    if (window.initGoogleAddressLookup) {
      delete window.initGoogleAddressLookup;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAddressLookup);
  } else {
    initializeAddressLookup();
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
})();