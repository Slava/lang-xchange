import React, { useState, useEffect } from 'react';
import topicsData from './topicsData.json';

const LanguageExchangeApp = () => {
  const [selectedLevel, setSelectedLevel] = useState(() => {
    const storedLevel = localStorage.getItem('selectedLevel');
    return storedLevel === "null" ? null : storedLevel;
  });
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : {};
  });
  const [isKoreanMode, setIsKoreanMode] = useState(() => {
    return localStorage.getItem('isKoreanMode') === 'true';
  });
  const [currentTopic, setCurrentTopic] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    if (selectedLevel) {
      const initCategories = {};
      topicsData[selectedLevel].forEach(topic => {
        initCategories[topic.category] = categories[topic.category] ?? true;
      });
      setCategories(initCategories);
    }
  }, [selectedLevel]);

  useEffect(() => {
    localStorage.setItem('selectedLevel', selectedLevel);
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('isKoreanMode', isKoreanMode);
  }, [selectedLevel, categories, isKoreanMode]);

  const toggleCategory = (category) => {
    setCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const getRandomTopic = () => {
    const selectedCategories = Object.entries(categories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);

    if (selectedCategories.length === 0) return null;

    const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
    const categoryTopics = topicsData[selectedLevel].find(t => t.category === randomCategory);
    const randomQuestion = categoryTopics.questions[Math.floor(Math.random() * categoryTopics.questions.length)];
    return { ...randomQuestion, category: randomCategory, vocabulary: categoryTopics.koreanVocabulary };
  };

  const handleNewTopic = () => {
    setCurrentTopic(getRandomTopic());
    setShowTranslation(false);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Language Exchange Topic Generator</h1>

      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Level</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {Object.keys(topicsData).map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '0.25rem',
                backgroundColor: selectedLevel === level ? '#007bff' : 'white',
                color: selectedLevel === level ? 'white' : 'black',
                cursor: 'pointer',
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {selectedLevel && (
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Categories</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.keys(categories).map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.25rem',
                  backgroundColor: categories[category] ? '#007bff' : 'white',
                  color: categories[category] ? 'white' : 'black',
                  cursor: 'pointer',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '0.5rem' }}>English</span>
        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
          <input
            type="checkbox"
            checked={isKoreanMode}
            onChange={() => setIsKoreanMode(!isKoreanMode)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isKoreanMode ? '#2196F3' : '#ccc',
              transition: '.4s',
              borderRadius: '34px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                content: '""',
                height: '26px',
                width: '26px',
                left: '4px',
                bottom: '4px',
                backgroundColor: 'white',
                transition: '.4s',
                borderRadius: '50%',
                transform: isKoreanMode ? 'translateX(26px)' : 'translateX(0px)',
              }}
            />
          </span>
        </label>
        <span style={{ marginLeft: '0.5rem' }}>한국어</span>
      </div>

      <button
        onClick={handleNewTopic}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
        }}
      >
        New Topic
      </button>

      {currentTopic && (
        <div style={{ border: '1px solid #ccc', borderRadius: '0.25rem', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>{currentTopic.category}</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{isKoreanMode ? currentTopic.korean : currentTopic.english}</p>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            style={{
              marginBottom: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
          >
            {showTranslation ? "Hide" : "Show"} Translation
          </button>
          {showTranslation && (
            <p style={{ marginBottom: '1rem' }}>{isKoreanMode ? currentTopic.english : currentTopic.korean}</p>
          )}
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Vocabulary:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {currentTopic.vocabulary.map((word, index) => (
              <li key={index} style={{ marginBottom: '0.25rem' }}>
                {isKoreanMode ? word.korean : word.english} - {isKoreanMode ? word.english : word.korean}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageExchangeApp;
