import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card'; // Import the Card component
import './App.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cardData, setCardData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerms, setSearchTerms] = useState([]); // State to store search terms

  useEffect(() => {
    // Fetch search terms from Scryfall's autocomplete API
    axios.get(`https://api.scryfall.com/cards/autocomplete?q=${searchTerm}`)
      .then(response => {
        setSearchTerms(response.data.data); // Set fetched search terms to state
      })
      .catch(error => {
        console.error('Error fetching search terms:', error);
      });
  }, [searchTerm]); // Runs whenever searchTerm changes

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setCardData([]);
      return;
    }

    // Check if searchTerms has data before iterating
    if (searchTerms.length > 0) {
      try {
        for (const cardName of searchTerms) {
          const delay = Math.random() * 50 + 50;
          await new Promise((resolve) => setTimeout(resolve, delay));

          const response = await axios.get(`https://api.scryfall.com/cards/search?q=${cardName}&format=image`, {
            headers: {
              'Origin': window.location.origin,
            },
          });
          if (response.status === 200) {
            const data = response.data.data;
            setCardData((prevData) => [...prevData, ...data]); // Update card data with new results
            setErrorMessage(null);
          } else {
            console.error('Unexpected API error:', response.statusText);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage('No results found for your search term.');
        } else {
          console.error('Error fetching cards:', error);
        }
      }
    } else {
      // Handle the case where searchTerms is empty
      console.warn('No search terms available yet. Try typing something to search.');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm('');
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
      <h1>MGT Card Gallery</h1>
        <form onSubmit={handleSearch}>
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Magic the Gathering Cards"
              style={{
                width: '400px',
                height: '30px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'transparent',
                color: '#fff',
              }}
            />
          </div>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {cardData.length > 0 && (
          <div className="card-list">
            {cardData.map((card) => (
              <Card key={card.id} cardData={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;