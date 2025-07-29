/**
 * Apple-style Liquid Glass effects
 * Implements interactive cursor effects and smooth animations
 */

// Initialize liquid glass effects
function initLiquidGlass() {
    // Cursor elements
    const cursor = document.querySelector('.liquid-cursor');
    const follower = document.querySelector('.liquid-cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Smooth cursor movement with requestAnimationFrame
    function updateCursorPosition() {
        const deltaX = mouseX - cursorX;
        const deltaY = mouseY - cursorY;
        
        cursorX += deltaX * 0.2;
        cursorY += deltaY * 0.2;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        const followerDeltaX = mouseX - followerX;
        const followerDeltaY = mouseY - followerY;
        
        followerX += followerDeltaX * 0.1;
        followerY += followerDeltaY * 0.1;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(updateCursorPosition);
    }
    
    // Mouse movement
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Initial position
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    cursorX = mouseX;
    cursorY = mouseY;
    followerX = mouseX;
    followerY = mouseY;
    
    // Start the animation loop
    updateCursorPosition();
    
    // Interaction with elements
    const interactiveElements = document.querySelectorAll('a, button, .event-card, input, select, .card-link, .navbar__links');
    
    interactiveElements.forEach(el => {
        // Add hover effect
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            follower.classList.add('follower-hover');
            
            // Create ripple effect for buttons and links
            if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.classList.contains('card-link')) {
                el.classList.add('ripple-effect');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('follower-hover');
            el.classList.remove('ripple-effect');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'liquid-ripple';
        cursor.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
            cursor.classList.remove('cursor-click');
        }, 700);
    });
    
    // Make sure cursor disappears when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
    
    // Disable on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
    }
}

// Add smooth scrolling effect
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 60, // Adjust for navbar height
                behavior: 'smooth'
            });
        });
    });
}

// Add parallax effect to background elements
function initParallaxEffect() {
    const shapes = document.querySelectorAll('.liquid-shape');
    
    window.addEventListener('mousemove', e => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach(shape => {
            const shiftValue = shape.getAttribute('data-shift') || 50;
            const x = (mouseX - 0.5) * shiftValue;
            const y = (mouseY - 0.5) * shiftValue;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    initLiquidGlass();
    initSmoothScroll();
    initParallaxEffect();
    
    // Add parallax attribute to shapes
    document.querySelector('.liquid-shape-1')?.setAttribute('data-shift', '30');
    document.querySelector('.liquid-shape-2')?.setAttribute('data-shift', '20');
});

// Add additional CSS classes for effects
document.head.insertAdjacentHTML('beforeend', `
<style>
.cursor-hover {
    transform: scale(1.5) translate(-33%, -33%);
    background-color: rgba(0, 102, 204, 0.3);
    mix-blend-mode: exclusion;
}

.follower-hover {
    width: 24px !important;
    height: 24px !important;
    opacity: 0.5;
}

.cursor-click {
    transform: scale(0.9) translate(-55%, -55%);
}

.ripple-effect {
    position: relative;
    overflow: hidden;
}

@keyframes button-ripple {
    from {
        transform: scale(0);
        opacity: 0.8;
    }
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.ripple-effect::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    opacity: 0.8;
    animation: button-ripple 0.6s ease-out;
    pointer-events: none;
}
</style>
`);
