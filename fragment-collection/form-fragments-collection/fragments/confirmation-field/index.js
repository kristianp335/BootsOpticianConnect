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
                
                // Password visibility toggle functionality
                const toggleButtons = fragmentElement.querySelectorAll('.password-toggle');
                
                toggleButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                                e.preventDefault();
                                
                                const targetId = button.getAttribute('data-target');
                                const targetInput = fragmentElement.querySelector(`#${targetId}`);
                                const eyeIcon = button.querySelector('.eye-icon');
                                const eyeSlashIcon = button.querySelector('.eye-slash-icon');
                                
                                if (targetInput && eyeIcon && eyeSlashIcon) {
                                        if (targetInput.type === 'password') {
                                                // Show password
                                                targetInput.type = 'text';
                                                eyeIcon.style.display = 'none';
                                                eyeSlashIcon.style.display = 'block';
                                                button.setAttribute('aria-label', 'Hide password');
                                        } else {
                                                // Hide password
                                                targetInput.type = 'password';
                                                eyeIcon.style.display = 'block';
                                                eyeSlashIcon.style.display = 'none';
                                                button.setAttribute('aria-label', 'Show password');
                                        }
                                }
                        });
                });
        }
}