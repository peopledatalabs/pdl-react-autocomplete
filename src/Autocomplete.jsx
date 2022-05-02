// eslint-disable-next-line
import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function Autocomplete({
  field, size, onTermSelected, apiKey,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(0);

  const timer = useRef(null);

  const autoInput = document.querySelector('.pdl-auto-input');

  useEffect(() => {
    if (focus) debounce(fetchResults)();
  }, [searchTerm, focus]);

  const debounce = (cb, delay = 250) => {
    clearTimeout(timer.current);

    return () => {
      timer.current = setTimeout(() => {
        cb();
      }, delay);
    };
  };

  const fetchResults = async () => {
    setErrorMessage('');
    setIsActive(0);

    if (!focus) return;

    setIsLoading(true);

    if (searchTerm.length === 0) {
      setIsLoading(false);
      clearTimeout(timer.current);
      clearResults();
      return;
    }

    let reqURL = `https://api.peopledatalabs.com/v5/autocomplete?field=${field}&text=${searchTerm}`;
    if (size !== undefined) reqURL += `&size=${size}`;

    const response = await fetch(reqURL, {
      headers: {
        'X-API-Key': `${apiKey}`,
      },
    });

    const data = await response.json();

    if (data.status !== 200) {
      switch (data.status) {
        case 404:
          clearResults();
          setIsLoading(false);
          setErrorMessage('No results');
          break;
        case 403:
          clearResults();
          setIsLoading(false);
          setErrorMessage('Unauthorized API key');
          break;
        case 401:
          clearResults();
          setIsLoading(false);
          setErrorMessage('API key required');
          break;
        case 429:
          clearResults();
          setIsLoading(false);
          setErrorMessage('API rate limit reached');
          break;
        default:
          clearResults();
          setIsLoading(false);
          setErrorMessage(data.error.message);
          break;
      }
      return;
    }

    setSearchResults(data.data);
    setIsLoading(false);
  };

  const clearResults = () => {
    setSearchResults([]);
  };

  const blur = () => {
    setFocus(false);
    autoInput.blur();
  };

  const selectHandler = (e) => {
    if (searchResults.length === 0) return;

    if (e.type === 'mousedown') {
      const selected = document.querySelector('.pdl-selected');
      const selectedTerm = selected.getAttribute('value');
      setSearchTerm(selectedTerm);
      onTermSelected(selectedTerm);
      blur();
      return;
    }

    switch (e.key) {
      case 'Enter': {
        const selected = document.querySelector('.pdl-selected');
        const selectedTerm = selected.getAttribute('value');
        setSearchTerm(selectedTerm);
        onTermSelected(selectedTerm);
        blur();
        break;
      }
      case 'ArrowDown':
        if (isActive === (searchResults.length - 1) || (isActive === null)) {
          setIsActive(0);
        } else {
          setIsActive((isActive) => isActive + 1);
        }
        break;
      case 'ArrowUp':
        if (isActive === 0 || isActive === null) {
          setIsActive(searchResults.length - 1);
        } else {
          setIsActive((isActive) => isActive - 1);
        }
        break;
      case 'Escape':
        blur();
        break;
      default:
        break;
    }
  };

  const placeholderText = () => {
    switch (field) {
      case 'company':
        return 'IE: people data labs';
      case 'country':
        return 'IE: ["united states"]';
      case 'industry':
        return 'IE: computer software';
      case 'location':
        return 'IE: berkeley, california, united states';
      case 'major':
        return 'IE: ["entrepreneurship]';
      case 'region':
        return 'IE: ["california, united states"]';
      case 'role':
        return 'IE: operations';
      case 'sub_role':
        return 'IE: logistics';
      case 'school':
        return 'IE: university of texas at austin';
      case 'skill':
        return 'IE: data analysis';
      case 'title':
        return 'IE: co-founder and chief executive officer';
      default:
    }
  };

  return (
    <div className="pdl-autocomplete-wrapper">
      <div className={`pdl-auto-input-wrapper pdl-df pdl-row ${focus ? 'pdl-input-wrapper-focus' : ''}`}>
        <input
          className="pdl-auto-input"
          placeholder={placeholderText()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(e) => selectHandler(e)}
        />
        <div className={`pdl-loading-spinner ${isLoading ? '' : 'pdl-dn'}`} />
      </div>
      <div className="pdl-autocomplete">
        <div className={`pdl-suggestions ${!focus || !searchResults.length ? 'pdl-dn' : ''}`}>
          {(searchResults.length > 0)
            ? searchResults.map((searchResult, idx) => (
              // eslint-disable-next-line
              <div
                key={idx}
                className={`pdl-suggestion pdl-df pdl-row ${idx === isActive ? 'pdl-selected' : ''}`}
                value={searchResult.name}
                data-idx={idx}
                onMouseOver={(e) => setIsActive(parseInt(e.currentTarget.dataset.idx, 10))}
                onMouseDown={(e) => selectHandler(e)}
              >
                <div className="pdl-suggestion-name">
                  {searchResult.name}
                </div>
                <div className="pdl-suggestion-count">
                  {searchResult.count ? `(${searchResult.count.toLocaleString('en-US')})` : null}
                </div>
              </div>
            )) : null}
        </div>
        <div
          className={`pdl-suggestions-pending
                        ${(focus === false) || isLoading || errorMessage || (searchResults.length > 0) ? 'pdl-dn' : ''}`}
        >
          Start typing to get suggestions
        </div>
        <div className={`pdl-suggestions-error
                        ${(errorMessage.length === 0) || (!focus) || (searchTerm.length === 0) ? 'pdl-dn' : ''}`}
        >
          {errorMessage}
        </div>
      </div>
    </div>
  );
}

export default Autocomplete;
