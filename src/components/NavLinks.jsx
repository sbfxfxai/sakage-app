import PropTypes from 'prop-types';

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

export default NavLinks;