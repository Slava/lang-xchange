import React, { useState, useEffect } from 'react';
import topicsData from './topicsData.json';

const LanguageExchangeApp = () => {
  const [categories, setCategories] = useState({});
  const [levels, setLevels] = useState({});
  const [isKoreanMode, setIsKoreanMode] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const initCategories = {};
    const initLevels = {};
    Object.keys(topicsData).forEach(level => {
      initLevels[level] = true;
      topicsData[level].forEach(topic => {
        initCategories[topic.category] = true;
      });
    });
    setCategories(initCategories);
    setLevels(initLevels);
  }, []);

  const toggleCategory = (category) => {
    setCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleLevel = (level) => {
    setLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const getRandomTopic = () => {
    const filteredTopics = Object.keys(topicsData)
      .filter(level => levels[level])
      .flatMap(level => topicsData[level].filter(topic => categories[topic.category]));

    if (filteredTopics.length === 0) return null;

    const randomTopic = filteredTopics[Math.floor(Math.random() * filteredTopics.length)];
    const randomQuestion = randomTopic.questions[Math.floor(Math.random() * randomTopic.questions.length)];
    return { ...randomQuestion, category: randomTopic.category, vocabulary: randomTopic.koreanVocabulary };
  };

  const handleNewTopic = () => {
    setCurrentTopic(getRandomTopic());
    setShowTranslation(false);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Language Exchange Topic Generator</h1>
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
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Levels</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.keys(levels).map(level => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '0.25rem',
                backgroundColor: levels[level] ? '#007bff' : 'white',
                color: levels[level] ? 'white' : 'black',
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{currentTopic.category}</h2>
          <p style={{ marginBottom: '0.5rem' }}>{isKoreanMode ? currentTopic.korean : currentTopic.english}</p>
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
