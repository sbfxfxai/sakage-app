import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { loadStripe } from '@stripe/stripe-js';
import MenuImage from './components/MenuImage';
import VideoBackground from './components/VideoBackground';
import NavLinks from './components/NavLinks';
import AISuggestionBox from './components/AISuggestionBox';
import VirtualReceipt from './components/VirtualReceipt';
import SimplifiedMenu from './components/SimplifiedMenu';
import PromoPopup from './components/PromoPopup';
import './App.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51R8SUvJwbxmJo9UfNaC1flIEcGEf3oLVy0Zl6cJbqfPZCcBjqkVXCcht5QCobXT2wemfi0h5HSoChizN8lk7jU1M00s4Hcz4Oo');

// Utility function for debouncing
const debounce = (func, wait) => {
    let timeout;
    const debounced = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
};

function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        instructions: '',
        tip: '3.00',
        items: []
    });
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Menu Data
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

    // Check for mobile devices
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

    // Handle scroll to update active section
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'customTip') {
            setOrderDetails(prev => ({
                ...prev,
                tip: value
            }));
        } else if (name === 'items') {
            const selectedItems = Array.from(e.target.selectedOptions, option => option.value);
            setOrderDetails(prev => ({
                ...prev,
                items: selectedItems
            }));
        } else {
            setOrderDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Format order details for email/SMS
        const orderSummary = `
        New Order Received!
        -----------------
        Name: ${orderDetails.name}
        Phone: ${orderDetails.phone}
        Email: ${orderDetails.email}
        Delivery Address: ${orderDetails.address}
        ${orderDetails.instructions ? `Instructions: ${orderDetails.instructions}` : ''}
        
        Order Items:
        ${orderDetails.items.map(itemId => {
            const item = menuCategories
                .flatMap(category => category.items)
                .find(item => item.id === parseInt(itemId));
            return item ? `- ${item.name} (${item.price})` : '';
        }).join('\n')}
        
        Subtotal: $${orderDetails.items.reduce((sum, itemId) => {
            const item = menuCategories
                .flatMap(category => category.items)
                .find(item => item.id === parseInt(itemId));
            return sum + (item ? parseFloat(item.price.replace('$', '')) : 0);
        }, 0).toFixed(2)}
        Delivery Fee: $7.99
        Tip: $${orderDetails.tip}
        Total: $${calculateTotal()}
    `;

        // Open email client
        const emailBody = encodeURIComponent(orderSummary);
        window.location.href = `mailto:admin@sakage.online?subject=New Order&body=${emailBody}`;

        // Open SMS app (on mobile)
        const smsBody = encodeURIComponent(orderSummary.substring(0, 160)); // SMS length limit
        window.location.href = `sms:+16286006451?body=${smsBody}`;

        setOrderConfirmed(true);
        setIsSubmitting(false);
    };

    const calculateTotal = () => {
        const subtotal = orderDetails.items.reduce((sum, itemId) => {
            const item = menuCategories
                .flatMap(category => category.items)
                .find(item => item.id === parseInt(itemId));
            return sum + (item ? parseFloat(item.price.replace('$', '')) : 0);
        }, 0);
        const deliveryFee = 7.99;
        const tip = parseFloat(orderDetails.tip) || 0;
        return (subtotal + deliveryFee + tip).toFixed(2);
    };

    // Handle Stripe Checkout
    const handleStripeCheckout = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const stripe = await stripePromise;
            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderDetails.items,
                    tip: orderDetails.tip,
                    deliveryFee: 7.99,
                    customerDetails: {
                        name: orderDetails.name,
                        email: orderDetails.email,
                        phone: orderDetails.phone,
                        address: orderDetails.address,
                        instructions: orderDetails.instructions
                    }
                })
            });
            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }
            const session = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            setError(`Checkout failed: ${error.message}. Please try again or contact support at admin@sakage.online.`);
            setIsSubmitting(false);
        }
    };

    // Scroll to section
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

    // Toggle mobile navigation
    const toggleMobileNav = () => {
        setMobileNavActive(prev => !prev);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestions) => {
        setSelectedSuggestion(suggestions);
        setShowOrderForm(true);
        setShowSuggestions(false);
        setOrderDetails(prev => ({
            ...prev,
            items: suggestions.map(item => item.id.toString())
        }));
        scrollToSection('order');
    };

    // Handle back to suggestions
    const handleBackToSuggestions = () => {
        setShowOrderForm(false);
        setShowSuggestions(true);
        setSelectedSuggestion(null);
        setOrderDetails(prev => ({
            ...prev,
            items: []
        }));
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
                <meta http-equiv="Content-Security-Policy" content="connect-src 'self' https://api.stripe.com;" />
            </Helmet>

            {/* Sidebar */}
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
                {/* Hero Section */}
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
                {showSuggestions && !showOrderForm && (
                    <VirtualReceipt
                        suggestions={aiSuggestions}
                        onSelect={handleSuggestionSelect}
                    />
                )}

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

                {/* Simplified Menu Section */}
                <SimplifiedMenu menuCategories={menuCategories} />

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
                        {showOrderForm ? (
                            orderConfirmed ? (
                                <div className="sakage-order-confirmation">
                                    <i className="fas fa-check-circle"></i>
                                    <h4>Order Received!</h4>
                                    <p>We've received your order details:</p>
                                    <div className="sakage-order-summary">
                                        <p><strong>Name:</strong> {orderDetails.name}</p>
                                        <p><strong>Phone:</strong> {orderDetails.phone}</p>
                                        <p><strong>Email:</strong> {orderDetails.email}</p>
                                        <p><strong>Delivery to:</strong> {orderDetails.address}</p>
                                        {orderDetails.instructions && (
                                            <p><strong>Instructions:</strong> {orderDetails.instructions}</p>
                                        )}
                                        <p><strong>Items:</strong></p>
                                        <ul>
                                            {orderDetails.items.map(itemId => {
                                                const item = menuCategories
                                                    .flatMap(category => category.items)
                                                    .find(item => item.id === parseInt(itemId));
                                                return item ? (
                                                    <li key={itemId}>{item.name} - {item.price}</li>
                                                ) : null;
                                            })}
                                        </ul>
                                        <div className="sakage-order-total">
                                            <p><strong>Subtotal:</strong> ${orderDetails.items.reduce((sum, itemId) => {
                                                const item = menuCategories
                                                    .flatMap(category => category.items)
                                                    .find(item => item.id === parseInt(itemId));
                                                return sum + (item ? parseFloat(item.price.replace('$', '')) : 0);
                                            }, 0).toFixed(2)}</p>
                                            <p><strong>Delivery Fee:</strong> $7.99</p>
                                            <p><strong>Tip:</strong> ${orderDetails.tip}</p>
                                            <p className="sakage-total-amount">
                                                <strong>Total:</strong> ${calculateTotal()}
                                            </p>
                                        </div>
                                    </div>
                                    <p>Complete your payment below using our secure checkout:</p>
                                    {error && <p className="sakage-form-error">{error}</p>}
                                    <button
                                        className="sakage-btn"
                                        onClick={handleStripeCheckout}
                                        disabled={isSubmitting || orderDetails.items.length === 0}
                                        aria-label="Proceed to secure checkout"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Pay Now'}
                                    </button>
                                    <p className="sakage-form-note">If the checkout doesn’t work, please contact us at <a href="mailto:admin@sakage.online">admin@sakage.online</a>.</p>
                                </div>
                            ) : (
                                <div className="sakage-full-form">
                                    <button
                                        onClick={handleBackToSuggestions}
                                        className="sakage-btn sakage-btn-back"
                                        aria-label="Back to meal suggestions"
                                    >
                                        ← Back to Suggestions
                                    </button>
                                    <form className="sakage-order-form" onSubmit={handlePlaceOrder}>
                                        {error && <p className="sakage-form-error">{error}</p>}
                                        <div className="sakage-form-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={orderDetails.name}
                                                onChange={handleInputChange}
                                                required
                                                aria-describedby="name-help"
                                            />
                                            <p id="name-help" className="sakage-form-note">Please enter your full name</p>
                                        </div>
                                        <div className="sakage-form-group">
                                            <label htmlFor="phone">Phone Number *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={orderDetails.phone}
                                                onChange={handleInputChange}
                                                required
                                                pattern="[0-9]{10}"
                                                title="Please enter a 10-digit phone number"
                                                aria-describedby="phone-help"
                                            />
                                            <p id="phone-help" className="sakage-form-note">Please enter a 10-digit phone number</p>
                                            {orderDetails.phone && !/^[0-9]{10}$/.test(orderDetails.phone) && (
                                                <p className="sakage-form-error">Please enter a valid 10-digit phone number</p>
                                            )}
                                        </div>
                                        <div className="sakage-form-group">
                                            <label htmlFor="email">Email *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={orderDetails.email}
                                                onChange={handleInputChange}
                                                required
                                                aria-describedby="email-help"
                                            />
                                            <p id="email-help" className="sakage-form-note">Please enter your email address</p>
                                        </div>
                                        <div className="sakage-form-group">
                                            <label htmlFor="address">Delivery Address *</label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                rows="3"
                                                value={orderDetails.address}
                                                onChange={handleInputChange}
                                                required
                                                aria-describedby="address-help"
                                            ></textarea>
                                            <p id="address-help" className="sakage-form-note">Please enter your delivery address</p>
                                        </div>
                                        <div className="sakage-form-group">
                                            <label htmlFor="instructions">Delivery Instructions</label>
                                            <textarea
                                                id="instructions"
                                                name="instructions"
                                                rows="2"
                                                value={orderDetails.instructions}
                                                onChange={handleInputChange}
                                                aria-describedby="instructions-help"
                                            ></textarea>
                                            <p id="instructions-help" className="sakage-form-note">Optional delivery instructions</p>
                                        </div>
                                        <div className="sakage-form-group">
                                            <label htmlFor="items">Selected Meal Items</label>
                                            <select
                                                multiple
                                                id="items"
                                                name="items"
                                                value={orderDetails.items}
                                                onChange={handleInputChange}
                                                required
                                                aria-describedby="items-help"
                                            >
                                                {menuCategories.flatMap(category =>
                                                    category.items.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name} - {item.price}</option>
                                                    ))
                                                )}
                                            </select>
                                            <p id="items-help" className="sakage-form-note">Your suggested meal is pre-filled. You can modify items (Ctrl+click for multiple)</p>
                                        </div>
                                        <div className="sakage-form-group">
                                            <label htmlFor="tip">Tip Amount ($) *</label>
                                            <select
                                                id="tip"
                                                name="tip"
                                                value={orderDetails.tip}
                                                onChange={handleInputChange}
                                                required
                                                aria-describedby="tip-help"
                                            >
                                                <option value="0.00">No tip</option>
                                                <option value="3.00">$3.00</option>
                                                <option value="5.00">$5.00</option>
                                                <option value="7.00">$7.00</option>
                                                <option value="10.00">$10.00</option>
                                                <option value="custom">Custom amount</option>
                                            </select>
                                            <p id="tip-help" className="sakage-form-note">Select a tip amount or choose custom</p>
                                            {orderDetails.tip === 'custom' && (
                                                <input
                                                    type="number"
                                                    name="customTip"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Enter custom tip amount"
                                                    className="sakage-custom-tip"
                                                    onChange={handleInputChange}
                                                    aria-describedby="custom-tip-help"
                                                />
                                            )}
                                            {orderDetails.tip === 'custom' && (
                                                <p id="custom-tip-help" className="sakage-form-note">Enter a custom tip amount</p>
                                            )}
                                        </div>
                                        <button type="submit" className="sakage-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Place Order'}
                                        </button>
                                        <p className="sakage-form-note">
                                            $7.99 delivery fee will be added to your total. We'll contact you to complete payment.
                                        </p>
                                        <p>Alternatively, pay now with our secure checkout:</p>
                                        <button
                                            className="sakage-btn"
                                            onClick={handleStripeCheckout}
                                            disabled={isSubmitting || orderDetails.items.length === 0}
                                            aria-label="Proceed to secure checkout"
                                        >
                                            {isSubmitting ? 'Processing...' : 'Pay Now'}
                                        </button>
                                        <p className="sakage-form-note">If the checkout doesn’t work, please contact us at <a href="mailto:admin@sakage.online">admin@sakage.online</a>.</p>
                                    </form>
                                </div>
                            )
                        ) : (
                            <div className="sakage-order-options">
                                <p>Enjoy our premium sandwiches delivered in ~34 minutes!</p>
                                <button
                                    onClick={() => setShowSuggestions(true)}
                                    className="sakage-btn sakage-btn-primary"
                                    aria-label="Get personalized meal suggestions"
                                >
                                    Get AI Meal Suggestions
                                </button>
                                <p>Or pay directly after selecting your items:</p>
                                <button
                                    className="sakage-btn"
                                    onClick={() => setShowOrderForm(true)}
                                    aria-label="Start order to proceed to checkout"
                                >
                                    Start Order
                                </button>
                                <p className="sakage-form-note">Select items and proceed to checkout to pay securely.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Reviews Section */}
                <section id="reviews" className="sakage-reviews" aria-labelledby="reviews-heading">
                    <div className="sakage-container">
                        <div className="sakage-section-title">
                            <h2 id="reviews-heading">What Our Customers Say</h2>
                            <p>Based on 30+ DoorDash reviews</p>
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

App.propTypes = {
    // No props are passed to App
};

export default App;