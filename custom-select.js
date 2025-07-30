/**
 * Apple-inspired custom select dropdowns
 * Provides elegant, animated dropdown functionality with keyboard accessibility
 */

class CustomSelect {
    constructor(element) {
        this.element = element;
        this.selectWrapper = element.closest('.custom-select-wrapper');
        this.trigger = element.querySelector('.custom-select__trigger');
        this.options = element.querySelectorAll('.custom-option');
        this.hiddenInput = this.selectWrapper.querySelector('input[type="hidden"]');
        this.selectedOption = null;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Toggle dropdown
        this.trigger.addEventListener('click', () => this.toggleDropdown());
        
        // Click outside to close
        document.addEventListener('click', e => {
            if (!this.element.contains(e.target)) {
                this.close();
            }
        });
        
        // Setup option click events
        this.options.forEach(option => {
            option.addEventListener('click', () => this.selectOption(option));
        });
        
        // Keyboard navigation
        this.element.addEventListener('keydown', e => this.handleKeyboard(e));
        
        // Set tabindex for keyboard accessibility
        this.trigger.setAttribute('tabindex', '0');
        this.options.forEach(option => option.setAttribute('tabindex', '0'));
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        // Close any other open selects first
        document.querySelectorAll('.custom-select.open').forEach(select => {
            if (select !== this.element) {
                select.classList.remove('open');
            }
        });
        
        this.element.classList.add('open');
        this.isOpen = true;
        
        // Add ripple effect
        this.addRipple();
    }
    
    close() {
        this.element.classList.remove('open');
        this.isOpen = false;
    }
    
    selectOption(option) {
        // Update selected state
        this.options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedOption = option;
        
        // Update trigger text
        this.trigger.querySelector('span').textContent = option.textContent;
        
        // Update hidden input value
        if (this.hiddenInput) {
            this.hiddenInput.value = option.dataset.value;
            
            // Trigger change event
            const event = new Event('change');
            this.hiddenInput.dispatchEvent(event);
        }
        
        // Close dropdown
        this.close();
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                if (document.activeElement === this.trigger) {
                    e.preventDefault();
                    this.toggleDropdown();
                } else if (this.isOpen && document.activeElement.classList.contains('custom-option')) {
                    e.preventDefault();
                    this.selectOption(document.activeElement);
                }
                break;
            case 'Escape':
                if (this.isOpen) {
                    e.preventDefault();
                    this.close();
                    this.trigger.focus();
                }
                break;
            case 'ArrowDown':
                if (this.isOpen) {
                    e.preventDefault();
                    this.navigateOptions('next');
                }
                break;
            case 'ArrowUp':
                if (this.isOpen) {
                    e.preventDefault();
                    this.navigateOptions('prev');
                }
                break;
        }
    }
    
    navigateOptions(direction) {
        const activeElement = document.activeElement;
        
        if (!activeElement.classList.contains('custom-option')) {
            // Focus the first option if none is focused
            this.options[0].focus();
        } else {
            // Find current index
            let currentIndex = Array.from(this.options).indexOf(activeElement);
            
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % this.options.length;
            } else {
                currentIndex = (currentIndex - 1 + this.options.length) % this.options.length;
            }
            
            this.options[currentIndex].focus();
        }
    }
    
    addRipple() {
        const trigger = this.trigger;
        const ripple = document.createElement('span');
        ripple.classList.add('select-ripple');
        trigger.appendChild(ripple);
        
        const rect = trigger.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = '0px';
        ripple.style.top = '0px';
        
        ripple.style.animation = 'select-ripple 0.6s ease-out';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize all custom selects when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(select => new CustomSelect(select));
    
    // Add ripple animation styles
    document.head.insertAdjacentHTML('beforeend', `
        <style>
        @keyframes select-ripple {
            from {
                transform: scale(0);
                opacity: 0.4;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .select-ripple {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 102, 204, 0.1);
            border-radius: 10px;
            transform: scale(0);
            pointer-events: none;
        }
        </style>
    `);
});
