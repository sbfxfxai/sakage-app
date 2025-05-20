import PropTypes from 'prop-types';
import MenuImage from './MenuImage';

const VirtualReceipt = ({ suggestions }) => {
    const calculateTotal = () => {
        return suggestions.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return sum + price;
        }, 0).toFixed(2);
    };

    return (
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
                            {suggestions.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="receipt-item">
                                    <div className="receipt-item-image">
                                        <MenuImage src={item.image} alt={item.name} width="100" height="100" />
                                    </div>
                                    <div className="receipt-item-details">
                                        <h4>{item.name}</h4>
                                        <p className="sakage-price">{item.price}</p>
                                        <p className="receipt-item-description">{item.description}</p>
                                        <div className="receipt-item-actions">
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
                                </div>
                            ))}
                        </div>
                        <div className="receipt-footer">
                            <div className="receipt-total">
                                <span>Subtotal:</span>
                                <span>${calculateTotal()}</span>
                            </div>
                            <div className="receipt-total">
                                <span>Estimated Tax:</span>
                                <span>${(calculateTotal() * 0.06).toFixed(2)}</span>
                            </div>
                            <div className="receipt-total grand-total">
                                <span>Total:</span>
                                <span>${(calculateTotal() * 1.06).toFixed(2)}</span>
                            </div>
                            <a
                                href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sakage-btn sakage-btn-primary"
                                aria-label="Place your order now"
                            >
                                Place Order Now
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="no-suggestions">
                        <p>No matches found. Try a different description or browse our full menu below.</p>
                        <button
                            className="sakage-btn"
                            onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
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
    suggestions: PropTypes.array.isRequired
};

export default VirtualReceipt;