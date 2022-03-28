import React, { useState, useEffect, useRef, useContext } from 'react';
import { locationsContext } from './LocationsProvider';
import '../styles/styles.css';

let autoComplete;

const loadScript = (url, callback) => {
	let script = document.createElement('script');
	script.type = 'text/javascript';

	if (script.readyState) {
		script.onreadystatechange = function () {
			if (script.readyState === 'loaded' || script.readyState === 'complete') {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {
		script.onload = () => callback();
	}

	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef, suggestedLocation) {
	autoComplete = new window.google.maps.places.Autocomplete(
		autoCompleteRef.current,
		{ types: ['(cities)'], componentRestrictions: { country: 'us' } }
	);
	autoComplete.setFields(['address_components', 'formatted_address']);
	autoComplete.addListener('place_changed', () =>
		handlePlaceSelect(updateQuery, suggestedLocation)
	);
}

async function handlePlaceSelect(updateQuery, suggestedLocation) {
	const addressObject = autoComplete.getPlace();
	const query = addressObject.formatted_address;
	//If statement added to prevent an error in console about query being undefined.
	if (query) {
		updateQuery(query);
		suggestedLocation[1](query);
	}
}

function SearchLocationInput() {
	const [query, setQuery] = useState('');
	const autoCompleteRef = useRef(null);

	const suggestedLocation = useContext(locationsContext);

	useEffect(() => {
		loadScript(
			`${process.env.GATSBY_GOOGLE_PLACES_URL_PART_1}` +
				`${process.env.GATSBY_GOOGLE_PLACES_API_KEY}` +
				`${process.env.GATSBY_GOOGLE_PLACES_URL_PART_2}`,
			() => handleScriptLoad(setQuery, autoCompleteRef, suggestedLocation)
		);
		document.getElementById('searchField').focus();
	}, []);

	return (
		<div className='search-location-input'>
			<input
				id='searchField'
				ref={autoCompleteRef}
				onChange={(event) => setQuery(event.target.value)}
				placeholder='Enter a City'
				value={query}
				onKeyPress={(e) => {
					e.target.keyCode === 13 && e.preventDefault();
				}}
				//Above line disables Enter key, making user utilize the drop down menu.
			/>
		</div>
	);
}
export default SearchLocationInput;
