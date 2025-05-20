import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { Helmet } from 'react-helmet';
import './App.css';

// Utility function for debouncing (unchanged)
const debounce = (func, wait) => {
    let timeout;
    const debounced = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
};

// Reusable MenuImage component (unchanged)
const MenuImage = ({ src, alt, width, height, isDecorative = false }) => (
    <img
        src={src}
        alt={isDecorative ? '' : alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="menu-item-image"
        onError={(e) => { e.target.src = '/fallback-menu-item.jpg'; }}
        aria-hidden={isDecorative ? 'true' : undefined}
    />
);

MenuImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isDecorative: PropTypes.bool
};

// VideoBackground component (unchanged)
const VideoBackground = ({ videoSrc, children, overlay = true }) => (
    <div className="video-background-section">
        <ReactPlayer
            url={videoSrc}
            playing
            loop
            muted
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{ file: { attributes: { preload: 'metadata', 'aria-hidden': 'true' } } }}
            fallback={<div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} aria-hidden="true" />}
        />
        {overlay && <div className="video-overlay" aria-hidden="true"></div>}
        <div className="video-content">{children}</div>
    </div>
);

VideoBackground.propTypes = {
    videoSrc: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    overlay: PropTypes.bool
};

// Reusable NavLinks component (unchanged)
const NavLinks = ({ activeSection, scrollToSection, mobileNavActive, toggleMobileNav }) => {
    const links = [
        { id: 'home', label: 'Home' },
        { id: 'story', label: 'Our Story' },
        { id: 'menu', label: 'Menu' },
        { id: 'locations', label: 'Locations' },
        { id: 'order', label: 'Order Now', external: 'https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'faq', label: 'FAQ' }
    ];

    return (
        <ul className={`sakage-sidebar-nav-links ${mobileNavActive ? 'active' : ''}`} role="list">
            {links.map(({ id, label, external }) => (
                <li key={id}>
                    <a
                        href={external || `#${id}`}
                        className={activeSection === id ? 'active' : ''}
                        aria-current={activeSection === id ? 'page' : undefined}
                        onClick={(e) => {
                            if (!external) {
                                e.preventDefault();
                                scrollToSection(id);
                            }
                            if (mobileNavActive) toggleMobileNav();
                        }}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

NavLinks.propTypes = {
    activeSection: PropTypes.string.isRequired,
    scrollToSection: PropTypes.func.isRequired,
    mobileNavActive: PropTypes.bool.isRequired,
    toggleMobileNav: PropTypes.func.isRequired
};

// AI Suggestion Component
const AISuggestionBox = ({ menuData, setAiSuggestions, setShowSuggestions }) => {
    const [userRequest, setUserRequest] = useState('');

    const generateSuggestions = (request) => {
        const keywords = request.toLowerCase().split(/\s+/).filter(k => k.length > 2); // Filter out short words
        const suggestions = [];

        // Flatten menu data and search for matches
        Object.values(menuData).flat().forEach(item => {
            const itemText = `${item.name} ${item.description}`.toLowerCase();
            const matches = keywords.filter(keyword => itemText.includes(keyword));
            if (matches.length > 0) {
                suggestions.push({
                    item,
                    matchScore: matches.length,
                    matchedKeywords: matches
                });
            }
        });

        // Sort by match score and limit to 3 suggestions
        suggestions.sort((a, b) => b.matchScore - a.matchScore);
        const topSuggestions = suggestions.slice(0, 3).map(s => s.item);
        setAiSuggestions(topSuggestions);
        setShowSuggestions(true);
    };

    return (
        <section className="ai-suggestion-section" aria-labelledby="ai-suggestion-heading">
            <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_17PM.mp4">
                <div className="sakage-container">
                    <div className="sakage-section-title">
                        <h2 id="ai-suggestion-heading">Tell Us What You're Craving</h2>
                        <p>Describe your perfect meal, and our AI will craft the ideal Sakage order for you!</p>
                    </div>
                    <div className="ai-input-container">
                        <input
                            type="text"
                            value={userRequest}
                            onChange={(e) => setUserRequest(e.target.value)}
                            placeholder="e.g., 'juicy steak sandwich with sweet drink'"
                            className="ai-input"
                            aria-label="Describe your desired meal"
                        />
                        <button
                            onClick={() => generateSuggestions(userRequest)}
                            className="sakage-btn"
                            disabled={!userRequest.trim()}
                            aria-label="Generate meal suggestions"
                        >
                            Find My Meal
                        </button>
                    </div>
                </div>
            </VideoBackground>
        </section>
    );
};

AISuggestionBox.propTypes = {
    menuData: PropTypes.object.isRequired,
    setAiSuggestions: PropTypes.func.isRequired,
    setShowSuggestions: PropTypes.func.isRequired
};

// Virtual Receipt Component
const VirtualReceipt = ({ suggestions }) => (
    <section className="virtual-receipt-section" aria-labelledby="receipt-heading">
        <div className="sakage-container">
            <div className="sakage-section-title">
                <h2 id="receipt-heading">Your Sakage Order</h2>
                <p>Here's what we recommend based on your cravings</p>
            </div>
            {suggestions.length > 0 ? (
                <div className="virtual-receipt">
                    <div className="receipt-header">
                        <h3>Sakage Receipt</h3>
                        <p>Columbia, MD • {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="receipt-items">
                        {suggestions.map(item => (
                            <div key={item.id} className="receipt-item">
                                <div className="receipt-item-image">
                                    <MenuImage src={item.image} alt={item.name} width="100" height="100" />
                                </div>
                                <div className="receipt-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="sakage-price">{item.price}</p>
                                    <p>{item.description}</p>
                                    <a
                                        href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sakage-btn sakage-btn-small"
                                        aria-label={`Add ${item.name} to your order`}
                                    >
                                        Add to Order
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="receipt-footer">
                        <p>Total: ${suggestions.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2)}</p>
                        <a
                            href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sakage-btn sakage-btn-primary"
                            aria-label="Place your order now"
                        >
                            Place Order
                        </a>
                    </div>
                </div>
            ) : (
                <p>No matches found. Try a different description or browse our full menu below.</p>
            )}
        </div>
    </section>
);

VirtualReceipt.propTypes = {
    suggestions: PropTypes.array.isRequired
};

// Simplified Menu Component
const SimplifiedMenu = ({ menuCategories }) => {
    const [showAllMenu, setShowAllMenu] = useState({});

    return (
        <section id="menu" className="sakage-menu" aria-labelledby="menu-heading">
            <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_17PM.mp4">
                <div className="sakage-container">
                    <div className="sakage-section-title">
                        <h2 id="menu-heading">Our Full Menu</h2>
                        <p className="sakage-menu-tagline">Not sure what to order? Try our AI suggestion tool above!</p>
                    </div>
                    {menuCategories.map(category => (
                        <div key={category.id} className="sakage-menu-category">
                            <h3>{category.title}</h3>
                            <div className="sakage-menu-items">
                                {(showAllMenu[category.id] ? category.items : category.items.slice(0, 3)).map(item => (
                                    <div key={item.id} className="sakage-menu-item">
                                        <div className="sakage-menu-item-image">
                                            <MenuImage src={item.image} alt={item.name} width="150" height="100" />
                                        </div>
                                        <div className="sakage-menu-item-content">
                                            <h4>{item.name}</h4>
                                            <p className="sakage-price">{item.price}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {category.items.length > 3 && (
                                <button
                                    className="sakage-btn sakage-btn-outline"
                                    onClick={() => setShowAllMenu(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                                    aria-label={`View ${showAllMenu[category.id] ? 'less' : 'all'} ${category.title}`}
                                >
                                    {showAllMenu[category.id] ? `Show Less` : `View All ${category.title}`}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </VideoBackground>
        </section>
    );
};

SimplifiedMenu.propTypes = {
    menuCategories: PropTypes.array.isRequired
};

function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Menu Data (updated based on provided DoorDash menu)
    const menuData = {
        breakfastSandwiches: [
            { id: 1, name: "Flagship Sakage Sandwich", price: "$17.99", description: "A powerhouse trio of: Premium seared steak, Savory Italian sausage, Fluffy egg whites. Served on your choice of: Crusty Ciabatta, Buttery Brioche, Flaky Croissant. Cheese Crown.", image: "/sakage1.jpg", promo: "Most Ordered" },
            { id: 2, name: "Steak & Egg White Power Stack", price: "$14.99", description: "Juicy tender steak, fluffy egg whites on your choice of: Ciabatta, Brioche, Buttery Croissant. Cheese Upgrade.", image: "/steaksand1.jpg", promo: "Most Ordered" },
            { id: 3, name: "Sausage & Egg White Power Stack", price: "$11.99", description: "Savory Italian sausage, fluffy egg whites on: Toasted Ciabatta, Buttery Brioche, Flaky Croissant. Cheese Upgrade.", image: "/sausagesand.jpg", promo: "Most Ordered" },
            { id: 4, name: "The Ultimate Bacon & Cheese Stack", price: "$9.99", description: "Build-Your-Own Bacon, Egg White & Cheese Masterpiece. Crispy bacon, fluffy egg white, your choice of cheese, served on: Ciabatta, Brioche, Buttery Croissant.", image: "/baccheddar1.jpg" }
        ],
        lunchSpecials: [
            { id: 5, name: "BBQ Pork Sandwich", price: "$14.99", description: "Slow-braised pulled pork smothered in house-made tangy BBQ sauce, served on: Toasted Ciabatta, Buttery Brioche, Flaky Croissant. Cheese Melt Upgrade.", image: "/bbqporksand.jpg", promo: "Most Ordered" },
            { id: 6, name: "Sakage Signature Lean Gourmet Burger", price: "$14.99", description: "85% lean beef patty – juicy, bold flavor, grilled to perfection. Artisanal golden roll – soft, lightly toasted. Optional Upgrade: Add melted cheese. Pair it with: Crispy French fries – golden, salted, served hot.", image: "/burger.jpg" }
        ],
        sidesAndSweets: [
            { id: 7, name: "Hash Browns", price: "$7.99", description: "Crispy, golden potato bites seasoned with a hint of herbs and spices.", image: "/hashbrown.jpg", promo: "2 for $7.99" },
            { id: 8, name: "Blueberry Muffin", price: "$3.99", description: "Bursting with juicy blueberries and topped with a delightful sugar crust.", image: "/bmuf.jpg" },
            { id: 9, name: "Cinnamon Rolls", price: "$4.99", description: "Tender rolls with a luscious cinnamon-sugar swirl, baked until golden and soft.", image: "/cbun2.jpg", promo: "Most Ordered" }
        ]
    };

    const menuCategories = [
        { id: 'breakfastSandwiches', title: 'Breakfast Sandwiches', items: menuData.breakfastSandwiches },
        { id: 'lunchSpecials', title: 'Lunch Specials', items: menuData.lunchSpecials },
        { id: 'sidesAndSweets', title: 'Sides & Sweets', items: menuData.sidesAndSweets }
    ];

    // Check for mobile devices (unchanged)
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);
            if (!newIsMobile) setMobileNavActive(false);
        };
        handleResize();
        const debouncedHandleResize = debounce(handleResize, 100);
        window.addEventListener('resize', debouncedHandleResize);
        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
            debouncedHandleResize.cancel();
        };
    }, []);

    // Handle scroll to update active section (unchanged)
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            let current = activeSection;
            try {
                sections.forEach((section) => {
                    const sectionTop = section.offsetTop;
                    const id = section.getAttribute('id');
                    if (id && window.scrollY >= sectionTop - 200) {
                        current = id;
                    }
                });
                if (current && current !== activeSection) {
                    setActiveSection(current);
                }
            } catch (error) {
                console.error('Scroll handler error:', error);
            }
        };
        const debouncedHandleScroll = debounce(handleScroll, 50);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
            debouncedHandleScroll.cancel();
        };
    }, [activeSection]);

    // Prevent background scrolling when mobile menu is open (unchanged)
    useEffect(() => {
        if (mobileNavActive) {
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = 'auto';
        };
    }, [mobileNavActive]);

    // Scroll to section (unchanged)
    const scrollToSection = (sectionId) => {
        try {
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: 'smooth'
                });
                setActiveSection(sectionId);
                setMobileNavActive(false);
            }
        } catch (error) {
            console.error('Scroll to section error:', error);
        }
    };

    // Toggle mobile navigation (unchanged)
    const toggleMobileNav = () => {
        setMobileNavActive(prev => !prev);
    };

    // Current year
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Helmet>
                <title>Sakage | Premium Steak & Sausage Sandwiches</title>
                <meta name="description" content="Sakage offers premium steak and sausage sandwiches crafted with quality ingredients. Order now for delivery in Columbia, MD." />
                <meta property="og:title" content="Sakage | Premium Steak & Sausage Sandwiches" />
                <meta property="og:description" content="Experience our signature fusion of steakhouse quality and street food accessibility." />
                <meta property="og:image" content="/sakage-social.jpg" />
            </Helmet>

            {/* Sidebar (unchanged) */}
            <aside className={`sakage-sidebar ${mobileNavActive ? 'active' : ''}`} role="complementary">
                <div className="sakage-sidebar-header">
                    <a href="#" className="sakage-logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                        <MenuImage src="/1.jpg" alt="Sakage Logo" width="120" height="60" />
                    </a>
                    {isMobile && (
                        <button
                            className="sakage-mobile-nav-toggle"
                            onClick={toggleMobileNav}
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileNavActive}
                            aria-controls="primary-navigation"
                        >
                            <i className={`fas ${mobileNavActive ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    )}
                </div>
                <nav id="primary-navigation" className="sakage-sidebar-nav" role="navigation">
                    <NavLinks
                        activeSection={activeSection}
                        scrollToSection={scrollToSection}
                        mobileNavActive={mobileNavActive}
                        toggleMobileNav={toggleMobileNav}
                    />
                </nav>
            </aside>

            <main id="main-content">
                {/* Hero Section (unchanged) */}
                <section id="home" className="sakage-hero" aria-labelledby="home-heading">
                    <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_10PM.mp4" overlay={false}>
                        <div className="hero-content">
                            <h1 id="home-heading">Sakage</h1>
                            <p>Premium steak & sausage sandwiches, now on DoorDash with exclusive deals!</p>
                            <div className="hero-button-container">
                                <a
                                    href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sakage-btn"
                                >
                                    Order Now
                                </a>
                            </div>
                        </div>
                    </VideoBackground>
                </section>

                {/* AI Suggestion Section */}
                <AISuggestionBox
                    menuData={menuData}
                    setAiSuggestions={setAiSuggestions}
                    setShowSuggestions={setShowSuggestions}
                />

                {/* Virtual Receipt Section */}
                {showSuggestions && <VirtualReceipt suggestions={aiSuggestions} />}

                {/* Story Section (unchanged) */}
                <section id="story" className="sakage-story" aria-labelledby="story-heading">
                    <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_14PM.mp4">
                        <div className="sakage-container">
                            <div className="sakage-section-title">
                                <h2 id="story-heading">Our Story</h2>
                            </div>
                            <div className="sakage-story-content">
                                <div className="sakage-story-text">
                                    <p>Founded by Chef Marco, Sakage was born from a late-night epiphany. A third-generation butcher and classically trained chef, Marco wanted to merge the rich flavors of steak and sausage—two staples he had never seen together in a sandwich.</p>
                                    <p>Determined to bridge the gap between premium steakhouse quality and street food accessibility, he created the perfect fusion. The name "Sakage" is a blend of "sausage," "steak," and "sandwich," embodying his culinary vision.</p>
                                    <p>After perfecting his recipe through midnight pop-ups in food trucks in downtown LA, Sakage now delivers its signature creations straight to your door. Every sandwich reflects Marco's dedication to quality, featuring grass-fed beef, artisanal sausages, and freshly baked bread.</p>
                                </div>
                            </div>
                        </div>
                    </VideoBackground>
                </section>

                {/* Simplified Menu Section */}
                <SimplifiedMenu menuCategories={menuCategories} />

                {/* Locations Section (unchanged) */}
                <section id="locations" className="sakage-locations" aria-labelledby="locations-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="locations-heading">Our Locations</h2>
                        </div>
                        <div className="sakage-location-card">
                            <h3>Columbia, MD</h3>
                            <p>6260 Dove Sail Lane</p>
                            <p>Columbia, MD 21044</p>
                            <p>Phone: +1 (443) 420-7423</p>
                            <p>Hours: Monday - Sunday, 12:00 AM - 11:39 PM</p>
                        </div>
                    </div>
                </section>

                {/* Order Section (unchanged) */}
                <section id="order" className="sakage-order" aria-labelledby="order-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="order-heading">Order Now</h2>
                        </div>
                        <p>Enjoy our premium sandwiches delivered in ~34 minutes!</p>
                        <p className="sakage-promo-banner">
                            Add $1.01 to get 25% off (up to $8) • $0 Delivery Fee with DashPass
                        </p>
                        <div className="sakage-delivery-options">
                            <div className="sakage-delivery-option sakage-delivery-highlight">
                                <div className="sakage-delivery-icon">
                                    <MenuImage src="/doordash.jpg" alt="DoorDash" width="100" height="100" />
                                </div>
                                <h3>DoorDash Delivery</h3>
                                <p>Get Sakage delivered straight to your door through our DoorDash store (4.1 ★, 20+ reviews)</p>
                                <a
                                    href="https://www.doordash.com/store/sakage-columbia-33609701/61067346/?cursor=eyJzdG9yZV9wcmltYXJ5X3ZlcnRpY2FsX2lkcyI6WzEsNCwxMDAzMzNdfQ==&pickup=false"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sakage-btn sakage-btn-primary"
                                >
                                    Order on DoorDash
                                </a>
                            </div>
                            <div className="sakage-delivery-option">
                                <div className="sakage-delivery-icon">
                                    <MenuImage src="/online-order.jpg" alt="Online Ordering" width="100" height="100" />
                                </div>
                                <h3>Order Direct</h3>
                                <p>Order directly from us for delivery or pickup - more options available!</p>
                                <a
                                    href="https://order.online/online-ordering/business/-14132801/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sakage-btn"
                                >
                                    Order Online
                                </a>
                            </div>
                            <div className="sakage-delivery-option sakage-catering-option">
                                <div className="sakage-delivery-icon">
                                    <MenuImage src="/catering.jpg" alt="Catering" width="100" height="100" />
                                </div>
                                <h3>Catering & Events</h3>
                                <p>Perfect for office lunches, meetings, and special events. Custom menus available.</p>
                                <div className="sakage-catering-cta">
                                    <a
                                        href="mailto:admin@sakage.online?subject=Catering Inquiry&body=Hello Sakage Team,%0D%0A%0D%0AI'm interested in your catering services. Please send me more information about:%0D%0A- Event date%0D%0A- Number of guests%0D%0A- Menu preferences%0D%0A%0D%0AThank you!"
                                        className="sakage-btn sakage-btn-accent"
                                    >
                                        Request Catering Info
                                    </a>
                                    <p className="sakage-catering-note">We'll respond within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews Section (unchanged) */}
                <section id="reviews" className="sakage-reviews" aria-labelledby="reviews-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="reviews-heading">What Our Customers Say</h2>
                            <p>4.1 ★ based on 20+ DoorDash reviews</p>
                        </div>
                        <div className="sakage-reviews-grid">
                            {[
                                { id: 2, name: "Robert A", date: "4/7/25", text: "I got two steak sandwiches and a muffin—super tasty! The steak was juicy, bread fresh, and the BOGO deal was awesome." },
                                { id: 3, name: "Sonya S", date: "4/23/25", text: "Food was absolutely Amazing! I had the The Waffle Ironclad Combo. Fast, fresh and flavorful. Everything was exactly as pictured and well exceeded my expectations. This is my new GOTO spot!!" },
                                { id: 4, name: "Marcus S", date: "4/21/25", text: "The Flagship Sakage Sandwich was very tasty. Good portions." },
                                { id: 5, name: "Peter S", date: "4/20/25", text: "Absolutely loved my Steak & Egg White Power Stack. Perfectly tasty and rich. A great way to start the day!" }
                            ].map(review => (
                                <div key={review.id} className="sakage-review-card">
                                    <h4>{review.name}</h4>
                                    <p>{review.text}</p>
                                    <p className="sakage-review-date">{review.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section (unchanged) */}
                <section id="faq" className="sakage-faq" aria-labelledby="faq-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="faq-heading">Frequently Asked Questions</h2>
                        </div>
                        <div className="sakage-faq-content">
                            <div className="sakage-faq-item">
                                <h3><strong>Do you deliver?</strong></h3>
                                <p>Yes, we offer no-contact delivery via DoorDash from our Columbia location at 6260 Dove Sail Lane. Note that we are currently closed on Uber Eats as of April 21, 2025.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3><strong>Do you cater?</strong></h3>
                                <p>Yes, catering is available for office lunches and special events. Please visit our online store at <a href="https://sakage.online" target="_blank" rel="noopener noreferrer">sakage.online</a> to place a catering order.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3><strong>Are you hiring?</strong></h3>
                                <p>For career opportunities, please contact us at <a href="mailto:admin@sakage.online">admin@sakage.online</a> for more information.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3><strong>Do you have a full menu?</strong></h3>
                                <p>Yes, our full menu is available on this website, featuring breakfast sandwiches, lunch specials, sides, sweets, and beverages.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3><strong>Do you accept reservations?</strong></h3>
                                <p>No, we do not accept reservations as we currently offer no dine-in service. We focus on delivery and pickup options.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3><strong>What forms of payment are accepted?</strong></h3>
                                <p>We accept standard online payment methods through DoorDash and our online store. Please check with the delivery platform for specific options.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3><strong>For other questions (e.g., gift cards, gluten-free options, nutritional facts, merchandise, franchising):</strong></h3>
                                <p>Please reach out to us at <a href="mailto:admin@sakage.online">admin@sakage.online</a> for assistance.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer (unchanged) */}
                <footer className="sakage-footer">
                    <div className="sakage-footer-content">
                        <div className="sakage-footer-section">
                            <h3>Sakage</h3>
                            <p>Premium steak and sausage sandwiches crafted with quality ingredients and culinary expertise.</p>
                            <div className="sakage-social-icons">
                                <a href="https://www.instagram.com/sakageeats/?g=5" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://g.co/kgs/EAFDmRm" target="_blank" rel="noopener noreferrer" aria-label="Visit our Google Maps location">
                                    <i className="fab fa-google"></i>
                                </a>
                            </div>
                        </div>
                        <div className="sakage-footer-section">
                            <h3>Contact</h3>
                            <p>6260 Dove Sail Lane</p>
                            <p>Columbia, MD 21044</p>
                            <p>Phone: +1 (443) 420-7423</p>
                            <p>Email: <a href="mailto:admin@sakage.online">admin@sakage.online</a></p>
                        </div>
                        <div className="sakage-footer-section">
                            <h3>Hours</h3>
                            <p>Monday - Sunday: 12AM - 11:39PM</p>
                        </div>
                        <div className="sakage-footer-section">
                            <h3>Links</h3>
                            <ul className="sakage-footer-links">
                                <li><a href="#story" onClick={(e) => { e.preventDefault(); scrollToSection('story'); }}>Our Story</a></li>
                                <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menu</a></li>
                                <li><a href="#locations" onClick={(e) => { e.preventDefault(); scrollToSection('locations'); }}>Locations</a></li>
                                <li><a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer">Order Now</a></li>
                                <li><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a></li>
                                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
                                <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                                <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="sakage-footer-bottom">
                        <p>© {currentYear} Sakage Restaurant. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </>
    );
}

export default App;