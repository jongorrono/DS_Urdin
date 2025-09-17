/**
 * Improved Testimonial Carousel
 * Compatible with single-card layout structure
 * Features: Touch support, keyboard navigation, error handling, accessibility
 */

class TestimonialCarousel {
    constructor() {
        this.currentIndex = 0;
        this.isAnimating = false;
        this.transitionTime = 300;
        
        // DOM elements
        this.cards = document.querySelectorAll('.card-carousel');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.container = document.querySelector('.container-carousel');
        
        // Check if required elements exist
        if (!this.validateElements()) {
            console.error('TestimonialCarousel: Required elements not found');
            return;
        }
        
        this.init();
    }
    
    validateElements() {
        return this.cards.length > 0 && this.prevBtn && this.nextBtn && this.container;
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchSupport();
        this.updateSlideVisibility();
        this.updateButtonStates();
        this.updateAccessibility();
        
        console.log(`TestimonialCarousel initialized with ${this.cards.length} testimonials`);
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Pause on hover (if you want to add auto-play later)
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay?.());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay?.());
        
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.updateSlideVisibility();
        }, 250));
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard navigation when carousel is focused or visible
            if (this.isCarouselFocused()) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.cards.length - 1);
                        break;
                }
            }
        });
    }
    
    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }
    
    isCarouselFocused() {
        return document.activeElement?.closest('.section-carousel') || 
               this.container.matches(':hover');
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        if (index < 0 || index >= this.cards.length) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        this.updateSlideVisibility();
        this.updateButtonStates();
        this.updateAccessibility();
        
        // Add animation class for smooth transition
        this.addSlideAnimation();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.transitionTime);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentIndex === 0 ? this.cards.length - 1 : this.currentIndex - 1;
        this.goToSlide(prevIndex);
    }
    
    updateSlideVisibility() {
        this.cards.forEach((card, index) => {
            if (index === this.currentIndex) {
                card.classList.remove('card-inactive');
                card.classList.add('card-active');
            } else {
                card.classList.remove('card-active');
                card.classList.add('card-inactive');
            }
        });
    }
    
    updateButtonStates() {
        // Enable/disable buttons based on current position
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
        
        // Add visual feedback for button states
        this.prevBtn.classList.toggle('disabled', false);
        this.nextBtn.classList.toggle('disabled', false);
    }
    
    updateAccessibility() {
        // Update ARIA attributes for screen readers
        this.cards.forEach((card, index) => {
            card.setAttribute('aria-hidden', index !== this.currentIndex);
            card.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
        });
        
        // Update button labels
        this.prevBtn.setAttribute('aria-label', 
            `Previous testimonial (${this.currentIndex + 1} of ${this.cards.length})`);
        this.nextBtn.setAttribute('aria-label', 
            `Next testimonial (${this.currentIndex + 1} of ${this.cards.length})`);
    }
    
    addSlideAnimation() {
        const activeCard = this.cards[this.currentIndex];
        
        // Remove existing animation classes
        activeCard.classList.remove('slide-in-left', 'slide-in-right');
        
        // Add appropriate animation based on direction
        setTimeout(() => {
            activeCard.classList.add('slide-in-right');
        }, 50);
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public methods for external control
    getCurrentSlide() {
        return this.currentIndex;
    }
    
    getTotalSlides() {
        return this.cards.length;
    }
    
    destroy() {
        // Remove event listeners if needed
        // This is a basic cleanup - in production you'd want more thorough cleanup
        console.log('TestimonialCarousel destroyed');
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if carousel elements exist
    if (document.querySelector('.card-carousel')) {
        window.testimonialCarousel = new TestimonialCarousel();
        
        // Add some debugging info in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Testimonial carousel initialized successfully');
        }
    } else {
        console.warn('TestimonialCarousel: No carousel elements found');
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialCarousel;
}
