import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

// Reusable MenuImage component
const MenuImage = ({ src, alt, width, height }) => (
    <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="menu-item-image"
    />
);

// VideoBackground component
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
        />
        {overlay && <div className="video-overlay"></div>}
        <div className="video-content">{children}</div>
    </div>
);

// Reusable NavLinks component
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
        <ul className={`sakage-sidebar-nav-links ${mobileNavActive ? 'active' : ''}`}>
            {links.map(({ id, label, external }) => (
                <li key={id}>
                    <a
                        href={external || `#${id}`}
                        className={activeSection === id ? 'active' : ''}
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

function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Check for mobile devices
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);
            if (!newIsMobile) setMobileNavActive(false); // Reset on desktop
            console.log('isMobile:', newIsMobile, 'mobileNavActive:', mobileNavActive);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileNavActive]);

    // Handle scroll to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            if (current !== '' && current !== activeSection) {
                setActiveSection(current);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    // Prevent background scrolling when mobile menu is open
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

    // Scroll to section
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 100,
                behavior: 'smooth'
            });
            setActiveSection(sectionId);
            setMobileNavActive(false);
        }
    };

    // Toggle mobile navigation
    const toggleMobileNav = () => {
        setMobileNavActive(prev => !prev);
        console.log('Toggled mobileNavActive to:', !mobileNavActive);
    };

    // Menu Data
    const menuData = {
        breakfastSandwiches: [
            { id: 1, name: "Egg White Delight", price: "$5.99", description: "Fluffy egg whites served on your choice of: Artisan Ciabatta | Buttery Brioche | Golden Croissant. Cheese Upgrade available.", image: "/eggwhitsand.jpg", promo: "Most Ordered" },
            { id: 2, name: "Steak & Egg White Power Stack", price: "$12.99", description: "Tender premium steak, fluffy egg whites, melted cheese, and grilled onions on ciabatta.", image: "/steaksand1.jpg", promo: "Most Ordered" },
            { id: 3, name: "Sausage & Egg White Power Stack", price: "$9.99", description: "Gourmet Italian sausage, fluffy egg whites, and melted cheese on ciabatta.", image: "/sausagesand.jpg", promo: "Most Ordered" },
            { id: 4, name: "Flagship Sakage Sandwich", price: "$16.99", description: "Signature blend of premium steak, Italian sausage, and fluffy egg whites on ciabatta.", image: "/sakage1.jpg", promo: "Most Ordered" },
            { id: 5, name: "Bacon & Cheddar Sandwich", price: "$8.00", description: "Crispy bacon and sharp cheddar on a toasted ciabatta roll.", image: "/baccheddar1.jpg" }
        ],
        lunchSpecials: [
            { id: 9, name: "Cheesy Pulled Chicken", price: "$14.99", description: "Juicy pulled chicken rubbed with smoked paprika, garlic & cayenne. Double-cheesed with melted cheddar and mozzarella. Spicy kick with gooey cheese blend.", image: "/chickensand.jpg", promo: "Most Ordered" },
            { id: 10, name: "BBQ Pork Sandwich", price: "$11.99", description: "Slow-braised pulled pork smothered in house-made tangy BBQ sauce, served on: Toasted Ciabatta | Buttery Brioche | Flaky Croissant. Cheese Melt Upgrade.", image: "/bbqporksand.jpg", promo: "Most Ordered" },
            { id: 12, name: "Fire Grilled Brioche Beef Frank", price: "$9.99", description: "Beef frank in a buttery brioche bun, enhanced with onions and tangy sauce. Optional melted cheese and crispy fries.", image: "/beeffrank.jpg" },
            { id: 13, name: "Cheesy BBQ Nugget Platter", price: "$9.99", description: "Crispy, seasoned chicken nuggets drizzled with barbecue sauce, optionally topped with melted cheese.", image: "/chicnug.jpg" },
            { id: 14, name: "Sakage Signature Lean Gourmet Burger", price: "$11.99", description: "85% lean beef patty, juicy and grilled to perfection on an artisanal golden roll. Optional cheese and crispy French fries.", image: "/burger.jpg" }
        ],
        comboMeals: [
            { id: 15, name: "The Waffle Ironclad Combo", price: "$21.99", description: "Crispy Belgian waffle topped with your choice of juicy premium steak or zesty gourmet sausage patty, served with a steaming cup of full-bodied coffee.", image: "/1232.jpg", promo: "Most Ordered" },
            { id: 16, name: "The Classic Belgian Waffle", price: "$11.99", description: "Golden crisp outside, cloud-soft inside Belgian waffle with light powdered sugar dusting. Optional strawberry syrup or toasted walnuts.", image: "/bwaff.jpg", promo: "Most Ordered" },
            { id: 17, name: "Family Feast Combo", price: "$29.99", description: "Two Flagship Sakage Sandwiches, two Hash Browns, and two Beverages.", image: "/image.jpg" }
        ],
        sidesAndSweets: [
            { id: 18, name: "Hash Browns", price: "$5.99", description: "Golden, crispy potato bites seasoned to perfection.", image: "/hashbrown.jpg", promo: "2 for $5.99" },
            { id: 19, name: "Blueberry Muffin", price: "$3.99", description: "Freshly baked with juicy blueberries and a sugar crust.", image: "/bmuf.jpg", promo: "Buy 1, get 1 free" },
            { id: 20, name: "Strawberry Sunrise Muffin", price: "$3.99", description: "Crisp English muffin with creamy butter and a vibrant layer of sweet-tart strawberry jam.", image: "/emuf.jpg" },
            { id: 22, name: "Cinnamon Rolls", price: "$5.99", description: "Tender rolls with a luscious cinnamon-sugar swirl, baked until golden and soft.", image: "/cbun2.jpg", promo: "Most Ordered" },
            { id: 23, name: "Cinnamon French Toast Fiesta", price: "$6.99", description: "Sweet French toast sticks dusted with cinnamon and powdered sugar, with optional walnuts, strawberry drizzle, hearty steak, or sausage.", image: "/fts.jpg" }
        ],
        beverages: [
            { id: 25, name: "Coffee", price: "$2.99", description: "Rich, aromatic brew from premium ethically sourced beans. Choose Black, Light, or Light & Sweet.", image: "/coffee.jpg" },
            { id: 27, name: "Water", price: "$2.00", description: "Refreshing bottled water.", image: "/water.jpg" }
        ]
    };

    // Menu Categories
    const menuCategories = [
        { id: 'breakfastSandwiches', title: 'Breakfast Sandwiches', items: menuData.breakfastSandwiches },
        { id: 'lunchSpecials', title: 'Lunch Specials', items: menuData.lunchSpecials },
        { id: 'comboMeals', title: 'Combo Meals', items: menuData.comboMeals },
        { id: 'sidesAndSweets', title: 'Sides and Sweets', items: menuData.sidesAndSweets },
        { id: 'beverages', title: 'Beverages', items: menuData.beverages }
    ];

    // Customize Options
    const customizeOptions = {
        sandwichOptions: ["No egg white", "No butter"],
        cheeseOptions: ["Muenster", "Pepper Jack", "Swiss", "Provolone", "Sharp Cheddar", "Mozzarella", "Colby Jack"],
        coffeeOptions: ["Black", "Light", "Light & Sweet"],
        garlicBreadAddOn: ["Add Cheese (+$2.00)"]
    };

    // Reviews
    const reviews = [
        { id: 2, name: "Robert A", date: "4/7/25", text: "I got two steak sandwiches and a muffin—super tasty! The steak was juicy, bread fresh, and the BOGO deal was awesome." },
        { id: 3, name: "Sonya S", date: "4/23/25", text: "Food was absolutely Amazing! I had the The Waffle Ironclad Combo. Fast, fresh and flavorful. Everything was exactly as pictured and well exceeded my expectations. This is my new GOTO spot!!" },
        { id: 4, name: "Marcus S", date: "4/21/25", text: "The Flagship Sakage Sandwich was very tasty. Good portions." },
        { id: 5, name: "Peter S", date: "4/20/25", text: "Absolutely loved my Steak & Egg White Power Stack. Perfectly tasty and rich. A great way to start the day!" }
    ];

    // Current year
    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* Sleek Sidebar */}
            <aside className={`sakage-sidebar ${mobileNavActive ? 'active' : ''}`}>
                <div className="sakage-sidebar-header">
                    <a href="#" className="sakage-logo">
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
                <nav id="primary-navigation" className="sakage-sidebar-nav">
                    <NavLinks
                        activeSection={activeSection}
                        scrollToSection={scrollToSection}
                        mobileNavActive={mobileNavActive}
                        toggleMobileNav={toggleMobileNav}
                    />
                </nav>
            </aside>

            {/* Mobile Toggle Button (Outside Sidebar for Accessibility) */}
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

            {/* Main Content */}
            <main id="main-content">
                {/* Hero Section */}
                <section id="home" className="sakage-hero" aria-labelledby="home-heading">
                    <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_10PM.mp4" overlay={false}>
                        <div className="hero-content">
                            <h1 id="home-heading">Sakage</h1>
                            <p>Premium steak & sausage sandwiches, now on DoorDash with exclusive deals!</p>
                            <div className="hero-button-container">
                                <a
                                    href="https://sakage.online"
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
                {/* Story Section */}
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
                {/* Menu Section */}
                <section id="menu" className="sakage-menu" aria-labelledby="menu-heading">
                    <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_17PM.mp4">
                        <div className="sakage-container">
                            <div className="sakage-section-title">
                                <h2 id="menu-heading">Our Menu</h2>
                                <p className="sakage-menu-tagline">Fresh • Flavorful • Crafted with Care</p>
                            </div>
                            {menuCategories.map(category => (
                                <div key={category.id} className="sakage-menu-category">
                                    <h3>{category.title}</h3>
                                    <div className="sakage-menu-items">
                                        {category.items.map(item => (
                                            <div key={item.id} className="sakage-menu-item">
                                                <div className="sakage-menu-item-image">
                                                    <MenuImage
                                                        src={item.image}
                                                        alt={item.name}
                                                        width="300"
                                                        height="220"
                                                    />
                                                </div>
                                                <div className="sakage-menu-item-content">
                                                    <h4>{item.name}</h4>
                                                    <p className="sakage-price">{item.price}</p>
                                                    {item.promo && <p className="sakage-promo">{item.promo}</p>}
                                                    <p className="sakage-description">{item.description}</p>
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
                                        ))}
                                    </div>
                                </div>
                            ))}
                           
                        </div>
                    </VideoBackground>
                </section>

                {/* Locations Section */}
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

                {/* Order Section */}
                {/* Order Section */}
                <section id="order" className="sakage-order" aria-labelledby="order-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="order-heading">Order Now</h2>
                        </div>
                        <p>Enjoy our premium sandwiches delivered in ~34 minutes!</p>
                        <p className="sakage-promo-banner">
                            Add $8.01 to get 20% off (up to $6) • $0 Delivery Fee with DashPass
                        </p>
                        <div className="sakage-delivery-options">
                            {/* DoorDash Option */}
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

                            {/* Direct Online Ordering */}
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

                            {/* Catering Option */}
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

                {/* Reviews Section */}
                <section id="reviews" className="sakage-reviews" aria-labelledby="reviews-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="reviews-heading">What Our Customers Say</h2>
                            <p>4.1 ★ based on 20+ DoorDash reviews</p>
                        </div>
                        <div className="sakage-reviews-grid">
                            {reviews.map(review => (
                                <div key={review.id} className="sakage-review-card">
                                    <h4>{review.name}</h4>
                                    <p>{review.text}</p>
                                    <p className="sakage-review-date">{review.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                {/* FAQ Section */}
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
                                <p>Yes, our full menu is available on this website, featuring breakfast sandwiches, lunch specials, combo meals, sides, sweets, and beverages.</p>
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

                {/* Footer */}
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
                                {/* Removed Facebook and Twitter since we're replacing them with Instagram and Google Maps */}
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