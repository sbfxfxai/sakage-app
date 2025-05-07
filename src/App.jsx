import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [orderTotal, setOrderTotal] = useState(20); // Default order total for savings widget

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
        document.body.style.overflow = mobileNavActive ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileNavActive]);

    // Scroll to section when clicking nav links (excluding Order Now)
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
        setMobileNavActive(!mobileNavActive);
    };

    // Calculate savings for direct ordering vs DoorDash
    const calculateSavings = (total) => {
        const doorDashCommission = total * 0.20; // 20% commission
        const directProcessingFee = total * 0.029 + 0.30; // 2.9% + $0.30
        const savings = doorDashCommission - directProcessingFee;
        return savings > 0 ? savings.toFixed(2) : 0;
    };

    // Menu Items
    const menuData = {
        breakfastSandwiches: [
            { id: 1, name: "Egg White Delight", price: "$5.99", description: "Fluffy egg whites served on your choice of: Artisan Ciabatta | Buttery Brioche | Golden Croissant. Cheese Upgrade available.", image: "/eggwhitsand.jpg", promo: "Most Ordered" },
            { id: 2, name: "Steak & Egg White Power Stack", price: "$12.99", description: "Tender premium steak, fluffy egg whites, melted cheese, and grilled onions on ciabatta.", image: "/steaksand1.jpg", promo: "Most Ordered" },
            { id: 3, name: "Sausage & Egg White Power Stack", price: "$9.99", description: "Gourmet Italian sausage, fluffy egg whites, and melted cheese on ciabatta.", image: "/sausagesand.jpg", promo: "Most Ordered" },
            { id: 4, name: "Flagship Sakage Sandwich", price: "$16.99", description: "Signature blend of premium steak, Italian sausage, and fluffy egg whites on ciabatta.", image: "/sakage1.jpg", promo: "Most Ordered" },
            { id: 5, name: "Bacon & Cheddar Sandwich", price: "$8.00", description: "Crispy bacon and sharp cheddar on a toasted ciabatta roll.", image: "/baccheddar1.jpg" },
            { id: 6, name: "Veggie Delight Sandwich", price: "$8.00", description: "Grilled zucchini, bell peppers, mushrooms, and melted Swiss cheese on ciabatta.", image: "/veggiesand.jpg" },
            { id: 7, name: "Ham & Swiss Sandwich", price: "$8.00", description: "Smoked ham and Swiss cheese layered in a buttery croissant.", image: "/hamswisssand1.jpg" },
            { id: 8, name: "Turkey Avocado Wrap", price: "$8.00", description: "Sliced turkey, avocado, spinach, and tomato in a spinach tortilla.", image: "/turkeyavocado1.jpg" }
        ],
        lunchSpecials: [
            { id: 9, name: "Cheesy Pulled Chicken", price: "$14.99", description: "Juicy pulled chicken rubbed with smoked paprika, garlic & cayenne. Double-cheesed with melted cheddar and mozzarella. Spicy kick with gooey cheese blend.", image: "/chickensand.jpg", promo: "Most Ordered" },
            { id: 10, name: "BBQ Pork Sandwich", price: "$11.99", description: "Slow-braised pulled pork smothered in house-made tangy BBQ sauce, served on: Toasted Ciabatta | Buttery Brioche | Flaky Croissant. Cheese Melt Upgrade.", image: "/bbqporksand.jpg", promo: "Most Ordered" },
            { id: 11, name: "Spicy Beef Sandwich", price: "$13.00", description: "Spicy seasoned beef with a kick, grilled and served with melted cheese on ciabatta.", image: "/beefsand.jpg" },
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
            { id: 21, name: "Ciabatta Garlic Bread", price: "$5.00", description: "Warm ciabatta brushed with garlic butter and herbs.", image: "/gbread.jpg" },
            { id: 22, name: "Cinnamon Rolls", price: "$5.99", description: "Tender rolls with a luscious cinnamon-sugar swirl, baked until golden and soft.", image: "/cbun2.jpg", promo: "Most Ordered" },
            { id: 23, name: "Cinnamon French Toast Fiesta", price: "$6.99", description: "Sweet French toast sticks dusted with cinnamon and powdered sugar, with optional walnuts, strawberry drizzle, hearty steak, or sausage.", image: "/fts.jpg" },
            { id: 24, name: "Cheesecake Delight", price: "$5.99", description: "Creamy cheesecake with a graham cracker crust.", image: "/588.jpg" }
        ],
        beverages: [
            { id: 25, name: "Coffee", price: "$2.99", description: "Rich, aromatic brew from premium ethically sourced beans. Choose Black, Light, or Light & Sweet.", image: "/coffee.jpg" },
            { id: 26, name: "Latte", price: "$5.00", description: "Creamy blend of espresso and steamed milk. Flavors: Vanilla, Caramel, Hazelnut.", image: "/latte.jpg" },
            { id: 27, name: "Water", price: "$2.00", description: "Refreshing bottled water.", image: "/water.jpg" }
        ]
    };

    // Customize Options
    const customizeOptions = {
        sandwichOptions: ["No egg white", "No butter"],
        cheeseOptions: ["Muenster", "Pepper Jack", "Swiss", "Provolone", "Sharp Cheddar", "Mozzarella", "Colby Jack"],
        coffeeOptions: ["Black", "Light", "Light & Sweet"],
        garlicBreadAddOn: ["Add Cheese (+$2.00)"]
    };

    // Reviews
    const reviews = [
        { id: 1, name: "Felisa R", date: "4/15/25", text: "Flagship Sakage Sandwich is very tasty, Hash Browns is very small and not worth it. Cheesecake Delight is very tasty but very small." },
        { id: 2, name: "Robert A", date: "4/7/25", text: "I got two steak sandwiches and a muffin—super tasty! The steak was juicy, bread fresh, and the BOGO deal was awesome." },
        { id: 3, name: "Sonya S", date: "4/23/25", text: "Food was absolutely Amazing! I had the The Waffle Ironclad Combo. Fast, fresh and flavorful. Everything was exactly as pictured and well exceeded my expectations. This is my new GOTO spot!!" },
        { id: 4, name: "Marcus S", date: "4/21/25", text: "The Flagship Sakage Sandwich was very tasty. Good portions." },
        { id: 5, name: "Peter S", date: "4/20/25", text: "Absolutely loved my Steak & Egg White Power Stack. Perfectly tasty and rich. A great way to start the day!" }
    ];

    // Current year for footer copyright
    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* Skip Links */}
            <a href="#main-content" className="skip-link">Skip to content</a>
            <a href="#primary-navigation" className="skip-link">Skip to primary navigation</a>

            {/* Sidebar */}
            <aside className="sakage-sidebar">
                <nav id="primary-navigation" className="sakage-sidebar-nav">
                    <ul>
                        <li><a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                        <li><a href="#story" className={activeSection === 'story' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('story'); }}>Our Story</a></li>
                        <li><a href="#menu" className={activeSection === 'menu' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menu</a></li>
                        <li><a href="#locations" className={activeSection === 'locations' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('locations'); }}>Locations</a></li>
                        <li><a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className={activeSection === 'order' ? 'active' : ''}>Order Now</a></li>
                        <li><a href="#reviews" className={activeSection === 'reviews' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a></li>
                        <li><a href="#faq" className={activeSection === 'faq' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main id="main-content">
                {/* Savings Widget Section */}
                <section id="savings" className="sakage-savings" aria-labelledby="savings-heading">
                    <div className="sakage-savings-widget">
                        <h2 id="savings-heading">Save More by Ordering Direct!</h2>
                        <p>Order through our website to avoid DoorDash commission fees and save big!</p>
                        <div className="sakage-savings-input">
                            <label htmlFor="order-total" className="sr-only">Enter your order total</label>
                            <input
                                id="order-total"
                                type="number"
                                min="0"
                                step="0.01"
                                value={orderTotal}
                                onChange={(e) => setOrderTotal(Number(e.target.value))}
                                aria-label="Enter your order total to calculate savings"
                            />
                            <span>$</span>
                        </div>
                        <p className="sakage-savings-result" aria-live="polite">
                            Save ${calculateSavings(orderTotal)} on a ${orderTotal.toFixed(2)} order!
                        </p>
                        <p className="sakage-savings-note">
                            Direct orders have no commission fees, just a 2.9% + $0.30 payment processing fee. DoorDash orders include a 20% commission.
                        </p>
                        <a
                            href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sakage-btn"
                        >
                            Order Direct & Save
                        </a>
                    </div>
                </section>

                {/* Header */}
                <header className="sakage-header">
                    <nav className="sakage-nav">
                        <a href="#" className="sakage-logo">
                            <img src="/1.jpg" alt="Sakage Logo" width="120" height="60" loading="lazy" decoding="async" />
                        </a>
                        <button
                            className="sakage-mobile-nav-toggle"
                            onClick={toggleMobileNav}
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileNavActive}
                            aria-controls="primary-navigation"
                        >
                            <i className={`fas ${mobileNavActive ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                        <ul className={`sakage-nav-links ${mobileNavActive ? 'active' : ''}`}>
                            <li><a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                            <li><a href="#story" className={activeSection === 'story' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('story'); }}>Our Story</a></li>
                            <li><a href="#menu" className={activeSection === 'menu' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menu</a></li>
                            <li><a href="#locations" className={activeSection === 'locations' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('locations'); }}>Locations</a></li>
                            <li><a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className={activeSection === 'order' ? 'active' : ''}>Order Now</a></li>
                            <li><a href="#reviews" className={activeSection === 'reviews' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a></li>
                            <li><a href="#faq" className={activeSection === 'faq' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a></li>
                        </ul>
                    </nav>
                </header>

                {/* Hero Section */}
                <section id="home" className="sakage-hero" aria-labelledby="home-heading">
                    <div className="mui-18hlwal-fullSize"></div>
                    <h1 id="home-heading">Sakage</h1>
                    <p>Premium steak & sausage sandwiches, now on DoorDash with exclusive deals!</p>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <a
                            href="https://sakage.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sakage-btn"
                            style={{ position: 'relative' }}
                        >
                            Order Now
                        </a>
                    </div>
                </section>

                {/* Story Section */}
                <section id="story" className="sakage-story" aria-labelledby="story-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="story-heading">Our Story</h2>
                        </div>
                        <div className="sakage-story-content">
                            <div className="sakage-story-text">
                                <p>Founded by Chef Marco, Sakage was born from a late-night epiphany. A third-generation butcher and classically trained chef, Marco wanted to merge the rich flavors of steak and sausage—two staples he had never seen together in a sandwich.</p>
                                <p>Determined to bridge the gap between premium steakhouse quality and street food accessibility, he created the perfect fusion. The name "Sakage" is a blend of "sausage," "steak," and "sandwich," embodying his culinary vision.</p>
                                <p>After perfecting his recipe through midnight pop-ups in food trucks in downtown LA, Sakage now delivers its signature creations straight to your door via DoorDash. Every sandwich reflects Marco's dedication to quality, featuring grass-fed beef, artisanal sausages, and freshly baked bread.</p>
                            </div>
                            <img src="/chefmarco.jpg" alt="Chef Marco preparing a sandwich" width="400" height="300" loading="lazy" decoding="async" style={{ maxWidth: '400px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                </section>

                {/* Menu Section */}
                <section id="menu" className="sakage-menu" aria-labelledby="menu-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="menu-heading">Our Menu</h2>
                            <p className="sakage-menu-tagline">Fresh • Flavorful • Crafted with Care</p>
                        </div>
                        {Object.entries(menuData).map(([category, items]) => (
                            <div key={category} className="sakage-menu-category">
                                <h3>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                                <div className="sakage-menu-items">
                                    {items.map(item => (
                                        <div key={item.id} className="sakage-menu-item">
                                            <div className="sakage-menu-item-image">
                                                <img src={item.image} alt={item.name} width="300" height="220" loading="lazy" decoding="async" />
                                            </div>
                                            <div className="sakage-menu-item-content">
                                                <h4>{item.name}</h4>
                                                <p className="sakage-price">{item.price}</p>
                                                {item.promo && <p className="sakage-promo">{item.promo}</p>}
                                                <p className="sakage-description">{item.description}</p>
                                                <a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className="sakage-btn">Order Now</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="sakage-menu-category sakage-customize-section">
                            <h3>Customize Your Meal</h3>
                            <div className="sakage-customize-options">
                                <div className="sakage-customize-option">
                                    <h4>Sandwich Options</h4>
                                    <ul>
                                        {customizeOptions.sandwichOptions.map((option, index) => (
                                            <li key={index}>{option}</li>
                                        ))}
                                    </ul>
                                    <h4>Add Cheese (+$2.00)</h4>
                                    <ul className="sakage-cheese-options">
                                        {customizeOptions.cheeseOptions.map((option, index) => (
                                            <li key={index}>{option}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="sakage-customize-option">
                                    <h4>Coffee Options</h4>
                                    <ul>
                                        <li>Flavors: {customizeOptions.coffeeOptions.join(' | ')}</li>
                                    </ul>
                                </div>
                                <div className="sakage-customize-option">
                                    <h4>Ciabatta Garlic Bread Add-On</h4>
                                    <ul>
                                        {customizeOptions.garlicBreadAddOn.map((option, index) => (
                                            <li key={index}>{option}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="sakage-menu-note">
                                <p>All sandwiches served on freshly baked ciabatta unless stated otherwise.</p>
                                <p>Ask about pairing your meal with our premium coffee for the ultimate experience! ☕️</p>
                            </div>
                        </div>
                    </div>
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
                <section id="order" className="sakage-order" aria-labelledby="order-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="order-heading">Order Now</h2>
                        </div>
                        <p>Enjoy our premium sandwiches delivered in ~34 minutes from our Columbia location (1.5 mi away)!</p>
                        <p style={{ color: '#E54C2E', fontWeight: 'bold', marginBottom: '20px' }}>
                            Add $8.01 to get 20% off (up to $6) • $0 Delivery Fee with DashPass
                        </p>
                        <div className="sakage-delivery-options">
                            <div className="sakage-delivery-option">
                                <img src="/doordash.jpg" alt="DoorDash delivery option" width="100" height="100" loading="lazy" decoding="async" />
                                <h3>DoorDash</h3>
                                <p>Order through our DoorDash virtual store (4.1 ★, 20+ reviews)</p>
                                <a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className="sakage-btn">Order on DoorDash</a>
                            </div>
                            <div className="sakage-delivery-option">
                                <img src="/pickup.jpg" alt="Pickup option" width="100" height="100" loading="lazy" decoding="async" />
                                <h3>Pickup</h3>
                                <p>Order ahead and pick up at our Columbia location</p>
                                <a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className="sakage-btn">Order Pickup</a>
                            </div>
                            <div className="sakage-delivery-option">
                                <img src="/catering.jpg" alt="Catering option" width="100" height="100" loading="lazy" decoding="async" />
                                <h3>Catering</h3>
                                <p>Perfect for office lunches and special events</p>
                                <a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className="sakage-btn">Order Catering</a>
                            </div>
                            <div className="sakage-delivery-option">
                                <a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer" className="sakage-btn">
                                    <img src="https://ubr.to/order-online-black" alt="Order Online button" style={{ height: '48px' }} loading="lazy" decoding="async" />
                                </a>
                                <h3>Order Online</h3>
                                <p>Order directly through our online store</p>
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
                <section id="faq" className="sakage-faq" aria-labelledby="faq-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="faq-heading">Frequently Asked Questions</h2>
                        </div>
                        <div className="sakage-faq-content">
                            <div className="sakage-faq-item">
                                <h3>Do you deliver?</h3>
                                <p>Yes, we offer no-contact delivery via DoorDash from our Columbia location at 6260 Dove Sail Lane. Note that we are currently closed on Uber Eats as of April 21, 2025.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3>Do you cater?</h3>
                                <p>Yes, catering is available for office lunches and special events. Please visit our online store at <a href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true" target="_blank" rel="noopener noreferrer">sakage.online</a> to place a catering order.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3>Are you hiring?</h3>
                                <p>For career opportunities, please contact us at <a href="mailto:info@sakage.com">info@sakage.com</a> for more information.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3>Do you have a full menu?</h3>
                                <p>Yes, our full menu is available on this website, featuring breakfast sandwiches, lunch specials, combo meals, sides, sweets, and beverages.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3>Do you accept reservations?</h3>
                                <p>No, we do not accept reservations as we currently offer no dine-in service. We focus on delivery and pickup options.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3>What forms of payment are accepted?</h3>
                                <p>We accept standard online payment methods through DoorDash and our online store. Please check with the delivery platform for specific options.</p>
                            </div>
                            <div className="sakage-faq-item">
                                <h3>For other questions (e.g., gift cards, gluten-free options, nutritional facts, merchandise, franchising):</h3>
                                <p>Please reach out to us at <a href="mailto:info@sakage.com">info@sakage.com</a> for assistance.</p>
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
                                <a href="#" aria-label="Visit our Facebook page"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" aria-label="Visit our Instagram page"><i className="fab fa-instagram"></i></a>
                                <a href="#" aria-label="Visit our Twitter page"><i className="fab fa-twitter"></i></a>
                            </div>
                        </div>
                        <div className="sakage-footer-section">
                            <h3>Contact</h3>
                            <p>6260 Dove Sail Lane</p>
                            <p>Columbia, MD 21044</p>
                            <p>Phone: +1 (443) 420-7423</p>
                            <p>Email: <a href="mailto:info@sakage.com">info@sakage.com</a></p>
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