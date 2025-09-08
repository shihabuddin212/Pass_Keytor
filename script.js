class PasswordGenerator {
    constructor() {
        this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
        this.numbers = '0123456789';
        this.symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        this.initializeElements();
        this.bindEvents();
        this.updateSliderBackground();
        this.generatePassword(); // Generate initial password
    }

    initializeElements() {
        this.passwordOutput = document.getElementById('passwordOutput');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.feedback = document.getElementById('feedback');
    }

    bindEvents() {
        // Length slider events
        this.lengthSlider.addEventListener('input', (e) => {
            this.lengthValue.textContent = e.target.value;
            this.updateSliderBackground();
            this.generatePassword();
        });

        // Checkbox events
        this.includeNumbers.addEventListener('change', () => {
            this.generatePassword();
        });

        this.includeSymbols.addEventListener('change', () => {
            this.generatePassword();
        });

        // Button events
        this.generateBtn.addEventListener('click', () => {
            this.generatePassword();
            this.animateButton();
        });

        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.generatePassword();
                this.animateButton();
            }
            if (e.ctrlKey && e.key === 'c' && document.activeElement === this.passwordOutput) {
                this.copyToClipboard();
            }
        });
    }

    updateSliderBackground() {
        const value = this.lengthSlider.value;
        const min = this.lengthSlider.min;
        const max = this.lengthSlider.max;
        const percentage = ((value - min) / (max - min)) * 100;
        
        this.lengthSlider.style.background = 
            `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        let charset = this.uppercase + this.lowercase;
        
        // Add selected character sets
        if (this.includeNumbers.checked) {
            charset += this.numbers;
        }
        
        if (this.includeSymbols.checked) {
            charset += this.symbols;
        }

        let password = '';
        
        // Ensure at least one character from each selected set
        let requiredChars = '';
        requiredChars += this.getRandomChar(this.uppercase);
        requiredChars += this.getRandomChar(this.lowercase);
        
        if (this.includeNumbers.checked) {
            requiredChars += this.getRandomChar(this.numbers);
        }
        
        if (this.includeSymbols.checked) {
            requiredChars += this.getRandomChar(this.symbols);
        }

        // Fill the rest of the password length
        const remainingLength = Math.max(0, length - requiredChars.length);
        
        for (let i = 0; i < remainingLength; i++) {
            password += this.getRandomChar(charset);
        }

        // Combine required chars with random chars and shuffle
        password = this.shuffleString(requiredChars + password);
        
        // Ensure exact length
        password = password.substring(0, length);
        
        this.passwordOutput.value = password;
        this.animatePasswordGeneration();
        this.evaluatePasswordStrength(password);
    }

    getRandomChar(str) {
        const randomIndex = Math.floor(Math.random() * str.length);
        return str.charAt(randomIndex);
    }

    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    evaluatePasswordStrength(password) {
        let strength = 0;
        let strengthText = '';
        let strengthColor = '';

        // Length check
        if (password.length >= 12) strength += 2;
        else if (password.length >= 8) strength += 1;

        // Character variety check
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Determine strength level
        if (strength >= 6) {
            strengthText = 'Very Strong';
            strengthColor = '#48bb78';
        } else if (strength >= 4) {
            strengthText = 'Strong';
            strengthColor = '#38a169';
        } else if (strength >= 3) {
            strengthText = 'Medium';
            strengthColor = '#ed8936';
        } else {
            strengthText = 'Weak';
            strengthColor = '#f56565';
        }

        this.showFeedback(`Password Strength: ${strengthText}`, strengthColor, 3000);
    }

    animatePasswordGeneration() {
        this.passwordOutput.style.transform = 'scale(1.02)';
        this.passwordOutput.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
        
        setTimeout(() => {
            this.passwordOutput.style.transform = 'scale(1)';
            this.passwordOutput.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 var(--shadow-light)';
        }, 200);
    }

    animateButton() {
        this.generateBtn.classList.add('loading');
        
        setTimeout(() => {
            this.generateBtn.classList.remove('loading');
        }, 500);
    }

    async copyToClipboard() {
        const password = this.passwordOutput.value;
        
        if (!password) {
            this.showFeedback('No password to copy!', '#f56565');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.showFeedback('Password copied to clipboard!', '#48bb78');
            this.animateCopyButton();
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(password);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showFeedback('Password copied to clipboard!', '#48bb78');
            this.animateCopyButton();
        } catch (err) {
            this.showFeedback('Failed to copy password', '#f56565');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    animateCopyButton() {
        this.copyBtn.style.background = '#48bb78';
        this.copyBtn.style.transform = 'translateY(-50%) scale(1.1)';
        
        setTimeout(() => {
            this.copyBtn.style.background = 'var(--primary-color)';
            this.copyBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 300);
    }

    showFeedback(message, color = '#48bb78', duration = 2000) {
        this.feedback.textContent = message;
        this.feedback.style.color = color;
        this.feedback.classList.add('show');
        
        clearTimeout(this.feedbackTimeout);
        this.feedbackTimeout = setTimeout(() => {
            this.feedback.classList.remove('show');
        }, duration);
    }

    // Utility method to check if device supports touch
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
}

// Initialize the password generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
    
    // Add some nice touch interactions for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback for buttons
        const buttons = document.querySelectorAll('button, .checkbox-group');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
});

// Add some keyboard accessibility
document.addEventListener('keydown', (e) => {
    // ESC key clears feedback
    if (e.key === 'Escape') {
        const feedback = document.getElementById('feedback');
        if (feedback.classList.contains('show')) {
            feedback.classList.remove('show');
        }
    }
});

// Add focus management for better accessibility
document.addEventListener('DOMContentLoaded', () => {
    const focusableElements = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('.password-card');
    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
    const focusableContent = modal.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
});
