import PropTypes from 'prop-types';

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

export default MenuImage;