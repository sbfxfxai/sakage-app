import { useState } from 'react';
import PropTypes from 'prop-types';
import VideoBackground from './VideoBackground';

const AISuggestionBox = ({ menuData, setAiSuggestions, setShowSuggestions }) => {
    const [userRequest, setUserRequest] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [budgetError, setBudgetError] = useState('');

    const generateSuggestions = () => {
        setBudgetError('');
        const budget = parseFloat(maxAmount.replace(/[^0-9.]/g, '')) || Infinity;

        if (isNaN(budget)) {
            setBudgetError('Please enter a valid budget amount');
            return;
        }

        if (budget < 10) {
            setBudgetError('Minimum budget should be $10 for a complete meal');
            return;
        }

        const inputText = `${userRequest} ${dietaryRestrictions}`.toLowerCase();
        const keywords = extractKeywords(inputText);
        const requestedItems = identifyRequestedItems(inputText);

        const suggestions = createBudgetedSuggestions(keywords, requestedItems, budget);

        if (suggestions.length === 0) {
            setBudgetError(`We couldn't find matching items under $${budget.toFixed(2)}. Try increasing your budget slightly.`);
            return;
        }

        setAiSuggestions(suggestions);
        setShowSuggestions(true);
    };

    const createBudgetedSuggestions = (keywords, requestedItems, budget) => {
        const allItems = Object.values(menuData).flat();
        let bestCombination = [];
        let bestCombinationTotal = 0;
        let bestCombinationScore = 0;

        // First, find all items that match keywords
        const matchedItems = allItems.filter(item => {
            const itemText = `${item.name} ${item.description}`.toLowerCase();
            return keywords.length === 0 || keywords.some(keyword =>
                itemText.includes(keyword) ||
                findSynonyms(keyword).some(syn => itemText.includes(syn))
            );
        });

        // Sort by price (ascending) to maximize items within budget
        matchedItems.sort((a, b) => {
            const priceA = parseFloat(a.price.replace('$', ''));
            const priceB = parseFloat(b.price.replace('$', ''));
            return priceA - priceB;
        });

        // Try different combinations to find the best match under budget
        for (let i = 0; i < matchedItems.length; i++) {
            const currentItem = matchedItems[i];
            const itemPrice = parseFloat(currentItem.price.replace('$', ''));

            if (itemPrice > budget) continue;

            let combination = [currentItem];
            let total = itemPrice;
            let score = calculateMatchScore(currentItem, keywords);

            // Try to add complementary items
            for (let j = 0; j < matchedItems.length; j++) {
                if (i === j) continue;

                const nextItem = matchedItems[j];
                const nextPrice = parseFloat(nextItem.price.replace('$', ''));

                if (total + nextPrice <= budget) {
                    combination.push(nextItem);
                    total += nextPrice;
                    score += calculateMatchScore(nextItem, keywords);
                }

                // Don't add more than 3 items
                if (combination.length >= 3) break;
            }

            // Keep track of the best combination found
            if (score > bestCombinationScore ||
                (score === bestCombinationScore && total > bestCombinationTotal)) {
                bestCombination = combination;
                bestCombinationTotal = total;
                bestCombinationScore = score;
            }
        }

        // If we didn't find any combinations, try single best item under budget
        if (bestCombination.length === 0) {
            // Sort by best match first
            matchedItems.sort((a, b) => {
                const aScore = calculateMatchScore(a, keywords);
                const bScore = calculateMatchScore(b, keywords);
                return bScore - aScore;
            });

            for (const item of matchedItems) {
                const itemPrice = parseFloat(item.price.replace('$', ''));
                if (itemPrice <= budget) {
                    bestCombination = [item];
                    bestCombinationTotal = itemPrice;
                    break;
                }
            }
        }

        return bestCombination;
    };

    const calculateMatchScore = (item, keywords) => {
        if (keywords.length === 0) return 1; // Default score if no keywords

        const itemText = `${item.name} ${item.description}`.toLowerCase();
        let score = 0;

        keywords.forEach(keyword => {
            if (itemText.includes(keyword)) score += 2;
            else if (findSynonyms(keyword).some(syn => itemText.includes(syn))) score += 1;
        });

        return score;
    };

    const extractKeywords = (text) => {
        return text.toLowerCase()
            .split(/\s+/)
            .filter(k => k.length > 2)
            .map(k => k.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''))
            .filter(k => !['and', 'with', 'for', 'under', 'less', 'than'].includes(k));
    };

    const identifyRequestedItems = (text) => {
        const itemTypes = {
            sandwich: ['sandwich', 'burger', 'sub', 'bagel'],
            drink: ['drink', 'beverage', 'soda', 'juice', 'coffee', 'tea'],
            side: ['side', 'fries', 'hash', 'muffin', 'roll', 'cinnamon'],
            breakfast: ['breakfast', 'morning', 'egg', 'omelet'],
            lunch: ['lunch', 'afternoon', 'burger', 'bbq']
        };

        return Object.entries(itemTypes).reduce((acc, [type, terms]) => {
            if (terms.some(term => text.includes(term))) {
                acc.push(type);
            }
            return acc;
        }, []);
    };

    const findSynonyms = (word) => {
        const synonymMap = {
            'juicy': ['tender', 'succulent', 'moist'],
            'steak': ['beef', 'meat', 'sirloin', 'ribeye'],
            'sweet': ['sugary', 'honeyed', 'candied', 'caramel'],
            'spicy': ['hot', 'zesty', 'peppery', 'fiery'],
            'cheesy': ['cheese', 'melted', 'gooey', 'dairy'],
            'crispy': ['crunchy', 'golden', 'fried', 'toasted'],
            'healthy': ['lean', 'light', 'fresh', 'fit'],
            'vegetarian': ['veggie', 'meatless', 'plant-based'],
            'hearty': ['filling', 'substantial', 'generous']
        };
        return synonymMap[word] || [];
    };

    return (
        <section className="ai-suggestion-section" aria-labelledby="ai-suggestion-heading">
            <VideoBackground videoSrc="/Generated File May 13, 2025 - 4_17PM.mp4">
                <div className="sakage-container">
                    <div className="sakage-section-title">
                        <h2 id="ai-suggestion-heading">AI Meal Suggestions</h2>
                        <p>Tell us what you're craving and we'll craft the perfect Sakage order within your budget!</p>
                    </div>
                    <div className="ai-input-container">
                        <div className="ai-form-group">
                            <label htmlFor="userRequest">Describe your perfect meal:</label>
                            <input
                                id="userRequest"
                                type="text"
                                value={userRequest}
                                onChange={(e) => setUserRequest(e.target.value)}
                                placeholder="e.g., 'juicy steak sandwich with a sweet drink'"
                                className="ai-input"
                                aria-label="Describe your desired meal"
                            />
                        </div>
                        <div className="ai-form-group">
                            <label htmlFor="maxAmount">Max budget ($):</label>
                            <input
                                id="maxAmount"
                                type="number"
                                min="10"
                                step="0.01"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                placeholder="e.g., 28"
                                className="ai-input"
                                aria-label="Your maximum budget"
                                required
                            />
                            {budgetError && <p className="error-message">{budgetError}</p>}
                        </div>
                        <div className="ai-form-group">
                            <label htmlFor="dietaryRestrictions">Dietary needs (optional):</label>
                            <input
                                id="dietaryRestrictions"
                                type="text"
                                value={dietaryRestrictions}
                                onChange={(e) => setDietaryRestrictions(e.target.value)}
                                placeholder="e.g., no pork, gluten-free"
                                className="ai-input"
                                aria-label="Your dietary restrictions"
                            />
                        </div>
                        <button
                            onClick={generateSuggestions}
                            className="sakage-btn"
                            disabled={!userRequest.trim() || !maxAmount}
                            aria-label="Generate meal suggestions"
                        >
                            Find My Perfect Meal
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