import React from "react";
import { useState, useEffect, useRef } from "react";
import './index.css'

const Autocomplete = ({ field = 'company', size, onTermSelected = (term) => console.log(term) }) => {

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ searchResults, setSearchResults ] = useState([]);
    const [ focus, setFocus ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ isLoading , setIsLoading ] = useState(false)
    const [ isKeyActive, setIsKeyActive ] = useState(0)
    
    const timer = useRef(null)

    const autoInput = document.querySelector('.auto-input')

    useEffect(() => {
        if (focus) debounce(fetchResults)()
    }, [searchTerm, focus])

    const debounce = (cb, delay = 250) => {
        clearTimeout(timer.current)

        return () => {
            timer.current = setTimeout(() => {
                cb()
            }, delay)
        }
    }
    
    const fetchResults = async () => {
        setErrorMessage('')
        setIsKeyActive(0)

        if (!focus) return

        setIsLoading(true)

        if (searchTerm.length === 0) {
            setIsLoading(false)
            clearTimeout(timer.current)
            clearResults()
            return
        }
        
        let reqURL = `https://api.peopledatalabs.com/v5/autocomplete?field=${field}&text=${searchTerm}`
            if (size !== undefined) reqURL += `&size=${size}`
        
        const response = await fetch(reqURL, { headers: {
            "X-API-Key": `${process.env.REACT_APP_API_KEY}`
        }})

        const data = await response.json()

        if (data.status !== 200) {
            switch (data.status) {
                case 404:
                    clearResults()
                    setIsLoading(false)
                    setErrorMessage('No results')
                    break;
                case 403:
                    clearResults()
                    setIsLoading(false)
                    setErrorMessage('Unauthorized API key')
                    break;
                case 401:
                    clearResults()
                    setIsLoading(false)
                    setErrorMessage('API key required')
                    break;
                case 429:
                    clearResults()
                    setIsLoading(false)
                    setErrorMessage('API rate limit reached')
                    break;
                default:
                    clearResults()
                    setIsLoading(false)
                    setErrorMessage(data.error.message)
                    break;
            }
            return
        }

        setSearchResults(data.data)
        setIsLoading(false)
    }

    const clearResults = () => {
        setSearchResults([])
    }

    const mouseClickHandler = (e) => {
        let mouseSelected = document.querySelector(".mouseover")
        let mouseSelectedTerm = mouseSelected.getAttribute("value")
        setSearchTerm(mouseSelectedTerm)
        onTermSelected(mouseSelectedTerm)
        setFocus(false)
        autoInput.blur()
    }

    const keyDownHandler = (e) => {
        if (searchResults.length > 0) {
            switch (e.key) {
                case 'Enter':
                    let keySelected = document.querySelector('.keyselected')
                    let keySelectedTerm = keySelected.getAttribute('value')
                    setSearchTerm(keySelectedTerm)
                    onTermSelected(keySelectedTerm)
                    setFocus(false)
                    autoInput.blur()
                    break;
                case 'ArrowDown':
                    if (isKeyActive === (searchResults.length - 1) || (isKeyActive === null)){
                        setIsKeyActive(0)
                    } else {
                        setIsKeyActive((isKeyActive) => isKeyActive + 1)
                    }
                    break;                
                case 'ArrowUp':
                    if (isKeyActive === 0 || isKeyActive === null) {
                        setIsKeyActive(searchResults.length - 1)
                    } else {
                        setIsKeyActive((isKeyActive) => isKeyActive - 1)
                }                    
                break;            
                default:
                    break;
            }
        }
    }

    const placeholderText = () => {
        switch (field) {
            case 'company':
                return 'IE: people data labs'
                break;
            case 'country':
                return 'IE: ["united states"]'
                break;
            case 'industry':
                return 'IE: computer software'
                break;
            case 'location':
                return 'IE: berkeley, california, united states'
                break;
            case 'major':
                return 'IE: ["entrepreneurship]'
                break;
            case 'region':  
                return 'IE: ["california, united states"]'
                break;
            case 'role':
                return 'IE: operations'
                break;
            case 'sub_role':
                return 'IE: logistics'
                break;
            case 'school':
                return 'IE: university of texas at austin'
                break;
            case 'skill':
                return 'IE: data analysis'
                break;
            case 'title':
                return 'IE: co-founder and chief executive officer'
                break;
            default:
                break;
        }
    }

    return(
        <div className="autocomplete-wrapper">
            <div className={`auto-input-wrapper df row ${focus ? 'input-wrapper-focus' : ''}`}>
                <input
                    className="auto-input"
                    placeholder={placeholderText()}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onKeyDown={(e) => keyDownHandler(e)}
                ></input>
                <div className={`loading-spinner ${isLoading ? '' : 'dn'}`}/>
            </div>
            <div className="autocomplete">
                <div className={`suggestions ${!focus || !searchResults.length ? 'dn' : ''}`}>
                    {(searchResults.length > 0) ? 
                        searchResults.map((searchResult, idx) => 
                            <div
                                key={idx} 
                                className={`suggestion df row
                                    ${idx === isKeyActive ? 'keyselected' : ''}
                                    ${idx === (searchResults.length - 1) ? 'bb' : ''}`}
                                value={searchResult.name}
                                data-idx={idx}
                                onMouseDown={(e) => mouseClickHandler(e)}
                                onMouseOver={(e) => e.currentTarget.classList.add("mouseover")}
                                onMouseLeave={(e) => e.currentTarget.classList.remove('mouseover')}
                            >
                                <div className="suggestion-name">
                                    {searchResult.name} 
                                </div>
                                <div className="suggestion-count">
                                    {searchResult.count ? `(${searchResult.count.toLocaleString('en-US')})` : null}
                                </div>
                            </div>
                        ) : null }
                </div>
                <div 
                    className={`suggestions-pending 
                        ${(focus === false) || isLoading || errorMessage || (searchResults.length > 0) ? 'dn' : ''}`}
                >
                    Start typing to get suggestions
                </div>
                <div className={`suggestions-error
                        ${(errorMessage.length === 0) || (!focus) || (searchTerm.length === 0) ? 'dn' : ''}`}
                >
                    {errorMessage}
                </div>
            </div>
        </div>
    )
};

export default Autocomplete;