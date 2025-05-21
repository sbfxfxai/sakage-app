import { useState, useEffect } from 'react';
import MenuImage from './MenuImage';

const PromoPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check mobile status after mount
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        const handleResize = () => {
            checkMobile();
        };

        const scrollHandler = () => {
            if (window.scrollY > 300 && !isVisible && localStorage.getItem('popupClosed') !== 'true') {
                setIsVisible(true);
                window.removeEventListener('scroll', scrollHandler);
            }
        };

        const timer = setTimeout(() => {
            if (localStorage.getItem('popupClosed') !== 'true') {
                setIsVisible(true);
            }
        }, 5000);

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', scrollHandler);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [isVisible]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, connect to your email service or backend
        console.log('Email submitted:', email);
        setSubmitted(true);
        localStorage.setItem('subscribedEmail', email);

        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('popupClosed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className={`bg-white rounded-xl shadow-xl relative ${isMobile ? 'w-11/12' : 'max-w-2xl w-full'}`}>
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                    aria-label="Close popup"
                >
                    &times;
                </button>

                <div className="p-6">
                    {!submitted ? (
                        <>
                            <div className="text-center mb-6">
                                <MenuImage src="/1.jpg" alt="Sakage Logo" width={120} height={60} className="mx-auto" />
                                <h3 className="text-2xl font-bold text-amber-600 mt-4">Limited-Time Offer!</h3>
                            </div>

                            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6`}>
                                <div className="flex-1 rounded-lg overflow-hidden">
                                    <MenuImage
                                        src="/steaksand1.jpg"
                                        alt="Steak Sandwich"
                                        width={300}
                                        height={200}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="text-lg font-semibold text-amber-600 mb-4">
                                        <strong>Get 15% OFF your first order!</strong>
                                    </p>
                                    <p className="mb-4">Join our mailing list for exclusive deals and early access to new menu items.</p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                                        >
                                            Get My Discount
                                        </button>
                                    </form>

                                    <p className="text-xs text-gray-500 mt-3">
                                        By subscribing, you agree to our <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>.
                                    </p>
                                </div>
                            </div>

                            <div className="text-center mt-6 pt-4 border-t border-gray-200">
                                <p className="text-lg">Use code: <strong className="text-amber-600">SAKAGE15</strong> at checkout</p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <div className="text-5xl text-green-500 mb-4">✓</div>
                            <h3 className="text-2xl font-bold text-amber-600 mb-2">Thank You!</h3>
                            <p className="mb-2">Your discount code has been sent to your email.</p>
                            <p className="mb-6">Check your inbox for <strong className="text-amber-600">SAKAGE15</strong>!</p>
                            <a
                                href="https://order.online/store/sakage-columbia-33609701/?hideModal=true&pickup=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                Order Now
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromoPopup;