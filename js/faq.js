// FAQ Page Interactive Functionality

class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.searchInput = document.getElementById('faqSearch');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSearch();
    }

    setupEventListeners() {
        // FAQ item toggles
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
        });

        // Category tabs
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.filterByCategory(button));
        });

        // Keyboard support for FAQ items
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFAQ(item);
                }
            });
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items (accordion behavior)
        this.faqItems.forEach(faqItem => {
            if (faqItem !== item) {
                faqItem.classList.remove('active');
            }
        });

        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
            
            // Scroll to item if it's not fully visible
            setTimeout(() => {
                const rect = item.getBoundingClientRect();
                if (rect.top < 100 || rect.bottom > window.innerHeight) {
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 300);
        }
    }

    filterByCategory(activeButton) {
        const category = activeButton.getAttribute('data-category');
        
        // Update active tab
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');

        // Filter FAQ items
        this.faqItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.style.display = 'block';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
                item.classList.remove('active'); // Close if open
            }
        });

        // Update search if active
        if (this.searchInput.value) {
            this.performSearch(this.searchInput.value);
        }
    }

    setupSearch() {
        if (!this.searchInput) return;

        let searchTimeout;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    performSearch(searchTerm) {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        
        if (!normalizedSearchTerm) {
            this.showAllItems();
            return;
        }

        let hasResults = false;

        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            // Check if search term is in question or answer
            const isMatch = question.includes(normalizedSearchTerm) || 
                           answer.includes(normalizedSearchTerm);
            
            if (isMatch && !item.classList.contains('hidden')) {
                item.style.display = 'block';
                this.highlightSearchTerm(item, searchTerm);
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show no results message
        this.toggleNoResultsMessage(!hasResults);
    }

    highlightSearchTerm(item, searchTerm) {
        if (!searchTerm) return;

        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer');
        
        // Remove existing highlights
        this.removeHighlights(question);
        this.removeHighlights(answer);
        
        // Add new highlights
        this.addHighlights(question, searchTerm);
        this.addHighlights(answer, searchTerm);
    }

    addHighlights(element, searchTerm) {
        const text = element.innerHTML;
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
        const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        element.innerHTML = highlightedText;
    }

    removeHighlights(element) {
        const text = element.innerHTML;
        const cleanText = text.replace(/<mark class="search-highlight">(.*?)<\/mark>/g, '$1');
        element.innerHTML = cleanText;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    clearSearch() {
        this.searchInput.value = '';
        this.showAllItems();
        this.removeAllHighlights();
        this.toggleNoResultsMessage(false);
    }

    showAllItems() {
        const activeCategory = document.querySelector('.tab-button.active').getAttribute('data-category');
        
        this.faqItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (activeCategory === 'all' || itemCategory === activeCategory) {
                item.style.display = 'block';
            }
        });
    }

    removeAllHighlights() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.faq-answer');
            this.removeHighlights(question);
            this.removeHighlights(answer);
        });
    }

    toggleNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try adjusting your search terms or browse by category.</p>
                    <button onclick="faqManager.clearSearch()" class="btn btn-outline">Clear Search</button>
                </div>
            `;
            
            const faqGrid = document.querySelector('.faq-grid');
            faqGrid.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// Add styles for search highlights and no results
const faqStyles = document.createElement('style');
faqStyles.textContent = `
    .search-highlight {
        background: var(--primary-color);
        color: var(--dark-color);
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }

    .no-results-message {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-light);
    }

    .no-results-content i {
        font-size: 3rem;
        margin-bottom: 20px;
        color: var(--border-color);
    }

    .no-results-content h3 {
        margin-bottom: 15px;
        color: var(--text-color);
    }

    .no-results-content p {
        margin-bottom: 30px;
        font-size: 1.1rem;
    }
`;

document.head.appendChild(faqStyles);

// Initialize FAQ functionality when page loads
let faqManager;
document.addEventListener('DOMContentLoaded', () => {
    faqManager = new FAQManager();
});

// Export for global access
window.faqManager = faqManager;