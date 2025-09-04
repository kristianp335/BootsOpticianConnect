const inputEl = fragmentElement.querySelector(`#${fragmentNamespace}-text-input`);
const inputConfirmationEl = fragmentElement.querySelector(`#${fragmentNamespace}-text-confirmation-input`);

if (inputEl && inputConfirmationEl) {
        if (layoutMode === 'edit') {
                inputEl.setAttribute('disabled', true);
                inputConfirmationEl.setAttribute('disabled', true);
        } else {
                const feedbackGroup = fragmentElement.querySelector('.form-feedback-group');
                
                // Validation function to compare field values
                const validateConfirmation = () => {
                        const originalValue = inputEl.value.trim();
                        const confirmationValue = inputConfirmationEl.value.trim();
                        
                        if (feedbackGroup) {
                                if (originalValue !== '' && confirmationValue !== '' && originalValue !== confirmationValue) {
                                        // Show error when values don't match
                                        if (feedbackGroup.classList.contains('form-feedback-group-visibility')) {
                                                feedbackGroup.style.visibility = 'visible';
                                        } else if (feedbackGroup.classList.contains('form-feedback-group-display')) {
                                                feedbackGroup.style.display = 'block';
                                        }
                                } else {
                                        // Hide error when values match or fields are empty
                                        if (feedbackGroup.classList.contains('form-feedback-group-visibility')) {
                                                feedbackGroup.style.visibility = 'hidden';
                                        } else if (feedbackGroup.classList.contains('form-feedback-group-display')) {
                                                feedbackGroup.style.display = 'none';
                                        }
                                }
                        }
                };
                
                // Add validation listeners
                inputEl.addEventListener('input', validateConfirmation);
                inputEl.addEventListener('blur', validateConfirmation);
                inputConfirmationEl.addEventListener('input', validateConfirmation);
                inputConfirmationEl.addEventListener('blur', validateConfirmation);
        }
}