import { useState } from 'react';
import PropTypes from 'prop-types';
import VideoBackground from './VideoBackground';

const AISuggestionBox = ({ menuData, setAiSuggestions, setShowSuggestions }) => {
    const [userRequest, setUserRequest] = useState('');

    const generateSuggestions = (request) => {
        const keywords = request.toLowerCase()
            .split(/\s+/)
            .filter(k => k.length > 2)
            .map(k => k.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''));

        const suggestions = [];

        Object.values(menuData).flat().forEach(item => {
            const itemText = `${item.name} ${item.description}`.toLowerCase();
            const matches = keywords.filter(keyword =>
                itemText.includes(keyword) ||
                findSynonyms(keyword).some(syn => itemText.includes(syn))
            );

            if (matches.length > 0) {
                suggestions.push({
                    item,
                    matchScore: matches.length,
                    matchedKeywords: matches
                });
            }
        });

        suggestions.sort((a, b) => b.matchScore - a.matchScore);
        const topSuggestions = suggestions.slice(0, 3).map(s => s.item);
        setAiSuggestions(topSuggestions);
        setShowSuggestions(true);
    };

    const findSynonyms = (word) => {
        const synonymMap = {
            'juicy': ['tender', 'succulent', 'moist'],
            'steak': ['beef', 'meat', 'sirloin'],
            'sweet': ['sugary', 'honeyed', 'candied'],
        };
        return synonymMap[word] || [];
    };

    return (
        <section className="ai-suggestion-section" aria-labelledby="ai-suggestion-heading">
            <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_17PM.mp4">
                <div className="sakage-container">
                    <div className="sakage-section-title">
                        <h2 id="ai-suggestion-heading">Tell Us What You're Craving</h2>
                        <p>Describe your perfect meal, and our AI will craft the ideal Sakage order for you!</p>
                    </div>
                    <div className="ai-input-container">
                        <input
                            type="text"
                            value={userRequest}
                            onChange={(e) => setUserRequest(e.target.value)}
                            placeholder="e.g., 'juicy steak sandwich with sweet drink'"
                            className="ai-input"
                            aria-label="Describe your desired meal"
                            onKeyDown={(e) => e.key === 'Enter' && generateSuggestions(userRequest)}
                        />
                        <button
                            onClick={() => generateSuggestions(userRequest)}
                            className="sakage-btn"
                            disabled={!userRequest.trim()}
                            aria-label="Generate meal suggestions"
                        >
                            Find My Meal
                        </button>
                    </div>
                </div>
            </VideoBackground>
        </section>
    );
};

AISuggestionBox.propTypes = {
    menuData: PropTypes.object.isRequired,
    setAiSuggestions: PropTypes.func.isRequired,
    setShowSuggestions: PropTypes.func.isRequired
};

export default AISuggestionBox;