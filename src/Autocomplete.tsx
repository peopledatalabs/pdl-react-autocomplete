// eslint-disable-next-line import/no-unresolved
import './index.css';

import React, { useEffect, useRef, useState } from 'react';

interface AutocompleteProps {
  apiKey: string,
  field: string,
  onTermSelected: (term: string) => void,
  placeholder: string,
  size?: number,
  titlecase?: boolean,
}

function Autocomplete({
  field, size, onTermSelected, apiKey, placeholder, titlecase,
}: AutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState < { count: number, name: string }[] >([]);
  const [focus, setFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(0);

  const timer = useRef(null);

  const clearResults = () => {
    setSearchResults([]);
  };

  const fetchResults = async (): Promise<void> => {
    setErrorMessage('');
    setIsActive(0);

    if (!focus) return;

    setIsLoading(true);

    if (searchTerm.length === 0) {
      const debouncedTimeout: null | ReturnType<typeof setTimeout> = timer.current;
      setIsLoading(false);
      if (debouncedTimeout !== null) clearTimeout(debouncedTimeout); //

      clearResults();
      return;
    }

    let reqURL = `https://api.peopledatalabs.com/v5/autocomplete?field=${field}&text=${searchTerm}`;
    if (size !== undefined) reqURL += `&size=${size}`;
    if (titlecase) reqURL += '&titlecase=true';

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

  const debounce = (cb: () => void, delay = 250) => {
    let debouncedTimeout: ReturnType<typeof setTimeout> | null = timer.current;
    if (debouncedTimeout !== null) clearTimeout(debouncedTimeout);

    return () => {
      debouncedTimeout = setTimeout(() => {
        cb();
      }, delay);
    };
  };

  useEffect(() => {
    if (focus) debounce(fetchResults)();
  }, [searchTerm, focus]);

  const blur = () => {
    setFocus(false);
    const autoInput: HTMLInputElement | null = document.querySelector('.pdl-auto-input');
    if (autoInput !== null) { autoInput.blur(); }
  };

  const mouseDownHandler = (e: React.MouseEvent) => {
    if (searchResults.length === 0) return;

    if (e.type === 'mousedown') {
      const selected: HTMLInputElement | null = document.querySelector('.pdl-selected');

      if (selected !== null) {
        const selectedTerm: string | null = selected.getAttribute('data-value');

        if (selectedTerm !== null) {
          setSearchTerm(selectedTerm);
          onTermSelected(selectedTerm);
        }
      }
    }
    blur();
  };

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;

    if (e.type === 'keydown') {
      switch (e.key) {
        case 'Enter': {
          const selected: HTMLInputElement | null = document.querySelector('.pdl-selected');

          if (selected !== null) {
            const selectedTerm = selected.getAttribute('data-value');

            if (selectedTerm !== null) {
              setSearchTerm(selectedTerm);
              onTermSelected(selectedTerm);
            }
          }
          blur();
          break;
        }
        case 'ArrowDown':
          if (isActive === (searchResults.length - 1) || (isActive === null)) {
            setIsActive(0);
          } else {
            const toAdd = isActive;
            setIsActive(toAdd + 1);
          }
          break;
        case 'ArrowUp':
          if (isActive === 0 || isActive === null) {
            setIsActive(searchResults.length - 1);
          } else {
            const toSubtract = isActive;
            setIsActive(toSubtract - 1);
          }
          break;
        case 'Escape':
          blur();
          break;
        default:
          break;
      }
    }
  };

  const placeholderText = () => {
    switch (field) {
      case 'all_location':
        return 'IE: miami';
      case 'class':
        return 'IE: sales_and_marketing';
      case 'company':
        return 'IE: people data labs';
      case 'country':
        return 'IE: united states';
      case 'industry':
        return 'IE: computer software';
      case 'location':
        return 'IE: berkeley, california, united states';
      case 'location_name':
        return 'IE: berkeley, california, united states';
      case 'major':
        return 'IE: entrepreneurship';
      case 'region':
        return 'IE: california, united states';
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
      case 'website':
        return 'IE: peopledatalabs.com';
      default:
        return '';
    }
  };

  return (
    <div className="pdl-autocomplete-wrapper">
      <div className={`pdl-auto-input-wrapper pdl-df pdl-row ${focus ? 'pdl-input-wrapper-focus' : ''}`}>
        <input
          className="pdl-auto-input"
          placeholder={placeholder || placeholderText()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(e) => keyDownHandler(e)}
        />
        <div className={`pdl-loading-spinner ${isLoading ? '' : 'pdl-dn'}`} />
      </div>
      <div className="pdl-autocomplete">
        <div className={`pdl-suggestions ${!focus || !searchResults.length ? 'pdl-dn' : ''}`}>
          {(searchResults.length > 0)
            ? searchResults.map((searchResult, idx) => (
              <div
                key={idx}
                className={`pdl-suggestion pdl-df pdl-row ${idx === isActive ? 'pdl-selected' : ''}`}
                data-value={searchResult.name}
                data-idx={idx}
                onMouseOver={(e) => {
                  const indexString: string | undefined = e.currentTarget.dataset.idx;
                  if (indexString) setIsActive(parseInt(indexString, 10));
                }}
                onMouseDown={(e) => mouseDownHandler(e)}
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
        <div className={`pdl-suggestions-pending
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
