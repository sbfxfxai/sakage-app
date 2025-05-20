import { useState } from 'react';
import PropTypes from 'prop-types';
import VideoBackground from './VideoBackground';
import MenuImage from './MenuImage';

const SimplifiedMenu = ({ menuCategories }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

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
                            <div className="category-header" onClick={() => toggleCategory(category.id)}>
                                <h3>{category.title}</h3>
                                <span className="toggle-icon">
                                    {expandedCategory === category.id ? '−' : '+'}
                                </span>
                            </div>
                            <div className={`sakage-menu-items ${expandedCategory === category.id ? 'expanded' : ''}`}>
                                {(expandedCategory === category.id ? category.items : category.items.slice(0, 3)).map(item => (
                                    <div key={item.id} className="sakage-menu-item">
                                        <div className="sakage-menu-item-image">
                                            <MenuImage src={item.image} alt={item.name} width="150" height="100" />
                                        </div>
                                        <div className="sakage-menu-item-content">
                                            <h4>{item.name}</h4>
                                            <p className="sakage-price">{item.price}</p>
                                            {item.promo && <p className="sakage-promo">{item.promo}</p>}
                                            <p className="sakage-description">{item.description}</p>
                                            <div className="menu-item-actions">
                                                <a
                                                    href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sakage-btn sakage-btn-small"
                                                >
                                                    Order Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {category.items.length > 3 && (
                                <button
                                    className="sakage-btn sakage-btn-outline toggle-category-btn"
                                    onClick={() => toggleCategory(category.id)}
                                    aria-label={`${expandedCategory === category.id ? 'Show less' : 'View all'} ${category.title}`}
                                >
                                    {expandedCategory === category.id ? 'Show Less' : `View All ${category.title}`}
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

export default SimplifiedMenu;