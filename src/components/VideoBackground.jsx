import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

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

export default VideoBackground;