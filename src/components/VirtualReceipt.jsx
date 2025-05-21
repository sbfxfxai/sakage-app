import PropTypes from 'prop-types';
import MenuImage from './MenuImage';

const VirtualReceipt = ({ suggestions, onSelect }) => {
    const calculateSubtotal = () => {
        return suggestions.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return sum + price;
        }, 0).toFixed(2);
    };

    const calculateTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const deliveryFee = 7.99;
        const tax = subtotal * 0.06; // 6% tax
        return (subtotal + tax + deliveryFee).toFixed(2);
    };

    // Handler for selecting the entire meal
    const handleSelectMeal = () => {
        // Pass all suggestion items as the selected meal
        onSelect(suggestions);
    };

    return (
        <section className="sakage-virtual-receipt" aria-labelledby="suggestions-heading">
            <div className="sakage-container">
                <div className="sakage-section-title">
                    <h2 id="suggestions-heading">Your Suggested Meal</h2>
                    <p>Here's what we recommend based on your cravings</p>
                </div>
                {suggestions.length > 0 ? (
                    <div className="sakage-suggestions-grid">
                        {suggestions.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="sakage-suggestion-item">
                                <div className="receipt-item-image">
                                    <MenuImage
                                        src={item.image}
                                        alt={item.name}
                                        width={150}
                                        height={150}
                                    />
                                </div>
                                <div className="receipt-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="receipt-item-description">{item.description}</p>
                                </div>
                            </div>
                        ))}
                        <div className="receipt-footer">
                            <div className="receipt-total">
                                <span>Subtotal:</span>
                                <span>${calculateSubtotal()}</span>
                            </div>
                            <div className="receipt-total">
                                <span>Estimated Tax (6%):</span>
                                <span>${(calculateSubtotal() * 0.06).toFixed(2)}</span>
                            </div>
                            <div className="receipt-total">
                                <span>Delivery Fee:</span>
                                <span>$7.99</span>
                            </div>
                            <div className="receipt-total grand-total">
                                <span>Total:</span>
                                <span>${calculateTotal()}</span>
                            </div>
                            <button
                                onClick={handleSelectMeal}
                                className="sakage-btn sakage-btn-primary"
                                aria-label="Place order for this meal"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="no-suggestions">
                        <p>No matches found. Try a different description or browse our full menu below.</p>
                        <button
                            className="sakage-btn"
                            onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                            aria-label="View full menu"
                        >
                            View Full Menu
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

VirtualReceipt.propTypes = {
    suggestions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
            promo: PropTypes.string
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default VirtualReceipt;