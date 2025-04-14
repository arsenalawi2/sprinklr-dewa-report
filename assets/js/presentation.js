// Presentation Mode JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add presentation mode stylesheet link
    const head = document.head;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/presentation.css';
    head.appendChild(link);
    
    // Create presentation controls
    const controls = document.createElement('div');
    controls.className = 'presentation-controls';
    
    // Previous button
    const prevButton = document.createElement('div');
    prevButton.className = 'control-button prev-button';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    controls.appendChild(prevButton);
    
    // Next button
    const nextButton = document.createElement('div');
    nextButton.className = 'control-button next-button';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    controls.appendChild(nextButton);
    
    // Fullscreen button
    const fullscreenButton = document.createElement('div');
    fullscreenButton.className = 'control-button fullscreen-button';
    fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    controls.appendChild(fullscreenButton);
    
    document.body.appendChild(controls);
    
    // Create progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator';
    document.body.appendChild(progressBar);
    
    // Create section indicator
    const sectionIndicator = document.createElement('div');
    sectionIndicator.className = 'section-indicator';
    document.body.appendChild(sectionIndicator);
    
    // Create quick navigation
    const quickNav = document.createElement('div');
    quickNav.className = 'quick-nav';
    document.body.appendChild(quickNav);
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    const totalSections = sections.length;
    
    // Create navigation dots
    sections.forEach((section, index) => {
        if (section.id) {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            dot.setAttribute('data-section', section.querySelector('h2') ? section.querySelector('h2').textContent : '');
            dot.setAttribute('data-target', '#' + section.id);
            
            dot.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
            
            quickNav.appendChild(dot);
        }
    });
    
    // Update active section on scroll
    function updateActiveSection() {
        let currentSectionIndex = 0;
        const scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop - 200) {
                currentSectionIndex = index;
                
                // Update section indicator
                if (section.querySelector('h2')) {
                    sectionIndicator.textContent = section.querySelector('h2').textContent;
                }
            }
        });
        
        // Update progress bar
        const scrollPercentage = (currentSectionIndex / (totalSections - 1)) * 100;
        progressBar.style.width = scrollPercentage + '%';
        
        // Update active nav dot
        const navDots = document.querySelectorAll('.nav-dot');
        navDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSectionIndex - 1) { // -1 because hero section doesn't have a dot
                dot.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call
    
    // Navigation buttons functionality
    prevButton.addEventListener('click', function() {
        const currentSection = getCurrentSection();
        if (currentSection > 0) {
            scrollToSection(currentSection - 1);
        }
    });
    
    nextButton.addEventListener('click', function() {
        const currentSection = getCurrentSection();
        if (currentSection < totalSections - 1) {
            scrollToSection(currentSection + 1);
        }
    });
    
    function getCurrentSection() {
        const scrollPosition = window.scrollY;
        let currentSectionIndex = 0;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop - 200) {
                currentSectionIndex = index;
            }
        });
        
        return currentSectionIndex;
    }
    
    function scrollToSection(index) {
        if (sections[index]) {
            window.scrollTo({
                top: sections[index].offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
    
    // Fullscreen functionality
    fullscreenButton.addEventListener('click', function() {
        document.body.classList.toggle('fullscreen-mode');
        
        if (document.body.classList.contains('fullscreen-mode')) {
            this.innerHTML = '<i class="fas fa-compress"></i>';
            
            // Add animation classes to elements
            document.querySelectorAll('.section-header').forEach(el => {
                el.classList.add('fade-in');
            });
            
            document.querySelectorAll('.content-box').forEach(el => {
                el.classList.add('slide-in-up');
            });
            
            // Request fullscreen if supported
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        } else {
            this.innerHTML = '<i class="fas fa-expand"></i>';
            
            // Remove animation classes
            document.querySelectorAll('.fade-in, .slide-in-right, .slide-in-left, .slide-in-up').forEach(el => {
                el.classList.remove('fade-in', 'slide-in-right', 'slide-in-left', 'slide-in-up');
            });
            
            // Exit fullscreen if supported
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            const currentSection = getCurrentSection();
            if (currentSection < totalSections - 1) {
                scrollToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            const currentSection = getCurrentSection();
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        } else if (e.key === 'f' || e.key === 'F') {
            fullscreenButton.click();
        }
    });
});
