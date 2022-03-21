import React, { useState, useEffect, useRef, useContext } from 'react';
import { locationsContext } from '../shared/LocationsProvider';
import Modal from 'react-modal';
// import PlacesAutocomplete, {
// 	geocodeByAddress,
// 	geocodeByPlaceId,
// 	getLatLng,
// } from 'react-places-autocomplete';
// import { gsap } from 'gsap';
// import { Flip } from 'gsap/all';

import GetWeather from '../shared/getWeather';
// import { googleAutocomplete } from '../shared/googleAutocomplete';
// import { usePlacesAutocomplete } from '../shared/usePlacesAutocomplete';
import SearchLocationInput from '../shared/searchLocationInput';

import clear_day from '../images/clear_day.svg';
// import clear_night from '../images/clear_night.svg';
import cloudy from '../images/cloudy.svg';
import drizzle from '../images/drizzle.svg';
import flurries from '../images/flurries.svg';
import fog_light from '../images/fog_light.svg';
import fog from '../images/fog.svg';
import freezing_drizzle from '../images/freezing_drizzle.svg';
import freezing_rain_heavy from '../images/freezing_rain_heavy.svg';
import freezing_rain_light from '../images/freezing_rain_light.svg';
import freezing_rain from '../images/freezing_rain.svg';
import ice_pellets_heavy from '../images/ice_pellets_heavy.svg';
import ice_pellets_light from '../images/ice_pellets_light.svg';
import ice_pellets from '../images/ice_pellets.svg';
import mostly_clear_day from '../images/mostly_clear_day.svg';
// import mostly_clear_night from '../images/mostly_clear_night.svg';
import mostly_cloudy from '../images/mostly_cloudy.svg';
import partly_cloudy_day from '../images/partly_cloudy_day.svg';
// import partly_cloudy_night from '../images/partly_cloudy_night.svg';
import rain_heavy from '../images/rain_heavy.svg';
import rain_light from '../images/rain_light.svg';
import rain from '../images/rain.svg';
import snow_heavy from '../images/snow_heavy.svg';
import snow_light from '../images/snow_light.svg';
import snow from '../images/snow.svg';
import tstorm from '../images/tstorm.svg';
// import { getLowResolutionImageURL } from 'gatsby-plugin-image';

// const google = window.google;
const axios = require('axios');

// gsap.registerPlugin(Flip);

const Weather = () => {
	//Overall, Weather function looks in local storage for any user defined locations, which are stored in an array.  A default location will be used if this is the user's first time.  This location array is converted into an array of weather objects for each city, and then passed to the GetWeather component for rendering.  New locations the user adds will be added to local storage.
	//   Each location is passed to the Google Geocode API for conversion to latitude and longitude, as required by the Tomorrow.io API.  The location is then passed to the Tomorrow.io API for various weather information, and then passed to the Google Maps API to help determine the local time for each location.  All API calls handled through Axios.
	const [enteredAddress, setEnteredAddress] = useState('');
	const [formattedLatLng, setFormattedLatLng] = useState();
	// const [formattedCurrentTemperature, setFormattedCurrentTemperature] = useState();
	// const [formattedCurrentConditions, setFormattedCurrentConditions] =	useState();
	const [localTime, setLocalTime] = useState();
	const [foundLocation, setFoundLocation] = useState();
	const [addressArray, setAddressArray] = useState([]);

	const [locationArray, setLocationArray] = useState(['Sacramento, CA']);
	const [addCityModalIsOpen, setAddCityModalIsOpen] = useState(false);
	const [randomBackground, setRandomBackground] = useState();

	const suggestedLocation = useContext(locationsContext);

	// const [googleAddress, setGoogleAddress] = useState('');
	// const [coordinates, setCoordinates] = useState({
	// 	lat: null,
	// 	lng: null,
	// });

	// const handleSelect = async (value) => {
	// 	const results = await geocodeByAddress(value);

	// 	const ll = await getLatLng(results[0]);
	// 	console.log('LL: ' + ll);
	// 	setGoogleAddress(value);
	// 	setCoordinates(ll);
	// };

	// const [selectedPrediction, setSelectedPrediction] = useState(null);
	// const [searchValue, setSearchValue] = useState('');
	// const predictions = usePlacesAutocomplete(searchValue);

	// const handlePredictionSelection = (e, prediction) => {
	// 	e.preventDefault();
	// 	setSelectedPrediction(prediction);
	// };

	//Search Location Variables and State - 3-16-22
	// let autoComplete;

	// const loadScript = (url, callback) => {
	// 	let script = document.createElement('script');
	// 	script.type = 'text/javascript';

	// 	if (script.readyState) {
	// 		script.onreadystatechange = function () {
	// 			if (
	// 				script.readyState === 'loaded' ||
	// 				script.readyState === 'complete'
	// 			) {
	// 				script.onreadystatechange = null;
	// 				callback();
	// 			}
	// 		};
	// 	} else {
	// 		script.onload = () => callback();
	// 	}

	// 	script.src = url;
	// 	document.getElementsByTagName('head')[0].appendChild(script);
	// };

	// function handleScriptLoad(updateQuery, autoCompleteRef) {
	// 	autoComplete = new window.google.maps.places.Autocomplete(
	// 		autoCompleteRef.current,
	// 		{ types: ['(cities)'], componentRestrictions: { country: 'us' } }
	// 	);
	// 	autoComplete.setFields(['address_components', 'formatted_address']);
	// 	autoComplete.addListener('place_changed', () =>
	// 		handlePlaceSelect(updateQuery)
	// 	);
	// }

	// async function handlePlaceSelect(updateQuery) {
	// 	const addressObject = autoComplete.getPlace();
	// 	const query = addressObject.formatted_address;
	// 	updateQuery(query);
	// 	// ---------------------------
	// 	setEnteredAddress(query);
	// 	// ---------------------------
	// 	console.log(addressObject);
	// }

	// const [query, setQuery] = useState('');
	// const autoCompleteRef = useRef(null);

	// useEffect(() => {
	// 	loadScript(
	// 		`https://maps.googleapis.com/maps/api/js?key=AIzaSyCdLuhh7iqVVQOoB0gtTPxIOFDAY6jqP0Q&libraries=places`,
	// 		() => handleScriptLoad(setQuery, autoCompleteRef)
	// 	);
	// }, []);
	//---------------------------

	const backgroundsArray = [
		'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
		'https://images.unsplash.com/photo-1501908734255-16579c18c25f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2728&q=80',
		'https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80',
		'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		'https://images.unsplash.com/photo-1616919954110-a94268e70f6d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		'https://images.unsplash.com/photo-1511300636408-a63a89df3482?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		'https://images.unsplash.com/photo-1631361773699-9379410d5cea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
		'https://images.unsplash.com/photo-1618168683556-b3a4ed583277?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
	];

	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},
	};

	Modal.setAppElement(`#___gatsby`);

	let subtitle;

	function openAddCityModal() {
		setAddCityModalIsOpen(true);
		// initService();
	}

	function afterOpenAddCityModal() {
		// UNUSED
		// document.getElementById("myText").focus();
		setEnteredAddress(suggestedLocation[0]);
	}

	function closeAddCityModal() {
		// if (enteredAddress) {
		// if (query) {
		if (suggestedLocation[0] !== '') {
			console.log(
				'CloseAddCityModal() suggestedLocation[0] ' + suggestedLocation[0]
			);
			setEnteredAddress(suggestedLocation[0]);
			let passedLocation = suggestedLocation[0];
			convertAddressToLatLng(passedLocation);
			// convertAllAddressesToLatLng(
			// 	enteredAddress,
			// 	Number(locationArray.length),
			// 	false
			// );
		}
		setAddCityModalIsOpen(false);
	}

	function cancelAddCityModal() {
		if (enteredAddress) {
			setEnteredAddress('');
		}
		setAddCityModalIsOpen(false);
		suggestedLocation[1]('');
	}

	var initialWeatherObject = [];
	var weatherObject = {
		key: '',
		location: '',
		temperature: '',
		currentConditions: '',
		localTime: '',
		weatherImage: '',
	};
	var processArray;

	// -------------------------
	// useEffect renders weather date for any locations in local storage on page load
	useEffect(() => {
		console.log('0.) USE EFFECT');
		//ADDED 3/12/22
		if (window !== 'undefined') {
			let lsLocationArray = JSON.parse(
				window.localStorage.getItem('lsLocationArray')
			);

			if (lsLocationArray && lsLocationArray[0] != 'empty') {
				// if (lsLocationArray && lsLocationArray !== ['empty']) {
				//If previous locations are found in local storage, create a new 'process array' with those locations.  If no previous locations are found, use the LocationArray state location.
				console.log('Local storage found.');
				setLocationArray(lsLocationArray);
				processArray = lsLocationArray;
				let objectString = JSON.stringify(locationArray, null, 4);
				console.log('LocationArray String Below:');
				console.log(objectString);
				let objectString2 = JSON.stringify(processArray, null, 4);
				console.log('Process Array String Below:');
				console.log(objectString2);
			} else {
				//No previous locations were found, so use the LocationArray default state location.
				processArray = locationArray;
				let objectString3 = JSON.stringify(processArray, null, 4);
				console.log('Process Array String Below:');
				console.log(objectString3);
				window.localStorage.clear();
			}
		}
		processArray.forEach((location, i) => {
			console.log('Process Array ' + i + ': ' + processArray[i]);
			initialWeatherObject.push({
				key: '',
				location: '',
				temperature: '',
				currentConditions: '',
				localTime: '',
				weatherImage: '',
				currentHumidity: '',
				currentPrecipitationProbability: '',
				currentWindSpeed: '',
				highTemp: '',
				lowTemp: '',
			});
			console.log('UseEffect Location: ' + location);
			console.log('useEffect i: ' + i);

			convertInitialAddressesToLatLng(location, i);
			// let initialUseEffectValues = true;
			// convertAllAddressesToLatLng(location, i, initialUseEffectValues);
		});
	}, []);

	// ----------------------------------------------------------
	//Functions for processing the initial saved locations.
	async function convertInitialAddressesToLatLng(providedAddress, i) {
		console.log('1.) CONVERT ADDRESS TO LAT/LNG');
		var lat = '';
		var lng = '';
		var cityAndState = '';
		var formattedAddress = providedAddress.trim().replace(' ', ',+');

		try {
			const response = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json?address=' +
					formattedAddress +
					'&key=AIzaSyCdLuhh7iqVVQOoB0gtTPxIOFDAY6jqP0Q'
			);

			if (response.data.results[0]) {
				lat = response.data.results[0].geometry.location.lat;
				lng = response.data.results[0].geometry.location.lng;
				cityAndState = response.data.results[0].formatted_address;

				//--------------------
				initialWeatherObject[i].location = cityAndState;
				console.log(
					'Updating Weather Object Location ' + i + ' With: ' + cityAndState
				);
				console.log(
					'Initial Weather Object Location' +
						i +
						': ' +
						initialWeatherObject[i].location
				);
				setFoundLocation(cityAndState);

				//Adding below line because async state update isn't fast enough to immediately pass to getWeather()
				var address = lat + ',' + lng;
				// console.log('1.) CONVERT ADDRESS TO LAT/LNG');
				console.log('Initial Response:');
				console.log(response);
				console.log('Initial City/State: ' + cityAndState);
				let initialValues = true;
				// getInitialWeather(address, i);
				getAllWeather(address, i, initialValues);
			} else {
				alert(`Please enter a valid location. Location #1`);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function convertAllAddressesToLatLng(
		providedAddress,
		i,
		initialValues
	) {
		console.log('x1x.) CONVERT ADDRESS TO LAT/LNG');
		var lat = '';
		var lng = '';
		var cityAndState = '';
		var formattedAddress = providedAddress.trim().replace(' ', ',+');

		try {
			const response = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json?address=' +
					formattedAddress +
					'&key=AIzaSyCdLuhh7iqVVQOoB0gtTPxIOFDAY6jqP0Q'
			);

			if (response.data.results[0]) {
				lat = response.data.results[0].geometry.location.lat;
				lng = response.data.results[0].geometry.location.lng;
				cityAndState = response.data.results[0].formatted_address;

				//--------------------
				if (initialValues) {
					initialWeatherObject[i].location = cityAndState;
					console.log(
						'Updating Weather Object Location ' + i + ' With: ' + cityAndState
					);
					console.log(
						'Initial Weather Object Location' +
							i +
							': ' +
							initialWeatherObject[i].location
					);
					setFoundLocation(cityAndState);

					//Adding below line because async state update isn't fast enough to immediately pass to getWeather()
					let address = lat + ',' + lng;
					// console.log('1.) CONVERT ADDRESS TO LAT/LNG');
					console.log('Initial Response:');
					console.log(response);
					console.log('Initial City/State: ' + cityAndState);
					let initialValues6 = true;
					// getInitialWeather(address, i);
					getAllWeather(address, i, initialValues6);
				} else {
					alert(`Please enter a valid location. Location #2`);
				}
			} else if (!initialValues) {
				weatherObject.location = cityAndState;
				setFormattedLatLng(lat + ',' + lng);
				setFoundLocation(cityAndState);
				if (window !== 'undefined') {
					if (!window.localStorage.getItem('lsLocationArray')) {
						setAddressArray([]);
						let tempLocationArray = [];
						tempLocationArray.push(cityAndState);
						console.log('Setting Location Array to ' + cityAndState);
						let objectString = JSON.stringify(tempLocationArray, null, 4);
						console.log('tempLocationArray String Below (NOT Local Storage):');
						console.log(objectString);
						setLocationArray(tempLocationArray);

						console.log('No Local Storage Variables Found');
						let initialLSLocationArray = [];
						initialLSLocationArray.push(cityAndState);
						console.log('Adding: ' + initialLSLocationArray);
						window.localStorage.setItem(
							'lsLocationArray',
							JSON.stringify(initialLSLocationArray)
						);
					} else {
						let tempLocationArray = locationArray;
						tempLocationArray.push(cityAndState);
						setLocationArray(tempLocationArray);

						console.log('Local Storage Variables Found.');
						let tempLSLocationArray = JSON.parse(
							window.localStorage.getItem('lsLocationArray')
						);
						console.log('Temp LS Location Array: ' + tempLSLocationArray);
						let objectString = JSON.stringify(tempLSLocationArray, null, 4);
						console.log('Initial tempLSLocationArray String Below:');
						console.log(objectString);
						tempLSLocationArray.push(cityAndState);
						console.log('Saving Back to Local Storage:');
						let objectString2 = JSON.stringify(tempLSLocationArray, null, 4);
						// console.log('Initial tempLSLocationArray String Below:');
						console.log(objectString2);
						window.localStorage.setItem(
							'lsLocationArray',
							JSON.stringify(tempLSLocationArray)
						);
					}
				}

				//Adding below line because async state update isn't fast enough to immediately pass to getWeather()
				let address = lat + ',' + lng;
				console.log(response);
				console.log('City/State: ' + cityAndState);
				let objectString = JSON.stringify(locationArray, null, 4);
				console.log('Location Array String Below:');
				console.log(objectString);
				// getWeather(address);
				let initialValues5 = false;
				getAllWeather(address, initialValues5);
			} else {
				alert(`Please enter a valid location.`);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function getAllWeather(address, i, initialValues) {
		console.log('x2x.) GET ALL WEATHER, INITIAL AND ADDED');

		try {
			// const response = await axios.get(
			// 	'https://api.tomorrow.io/v4/timelines?location=' +
			// 		address +
			// 		'&fields=temperature&fields=weatherCode&fields=temperatureMin&fields=temperatureMax&fields=humidity&fields=precipitationProbability&fields=windSpeed&units=imperial&timesteps=current&timesteps=1h&timesteps=1d&timezone=US%2FEastern&apikey=4OVgMKSU755IMMZgINuqH2guWzh5MHiG'
			// );
			const response = await axios.get(
				'https://api.tomorrow.io/v4/timelines?location=' +
					address +
					'&fields=temperature&fields=weatherCode&fields=temperatureMin&fields=temperatureMax&fields=humidity&fields=precipitationProbability&fields=windSpeed&units=imperial&timesteps=current&timesteps=1d&timezone=US%2FEastern&apikey=4OVgMKSU755IMMZgINuqH2guWzh5MHiG'
			);
			console.log('Get Initial Weather Response:');
			console.log(response);

			var currentConditions;
			var weatherImage;
			// Getting UTC time zone from API response, then adding five hours to adjust that to Eastern Standard Time.
			var estHour =
				Number(response.data.data.timelines[1].startTime.substring(11, 13)) + 5;
			// Number(response.data.data.timelines[2].startTime.substring(11, 13)) + 5;
			// var currentMinutes = response.data.data.timelines[0].startTime.substring(
			// var currentMinutes = response.data.data.timelines[2].startTime.substring(
			// 	14,
			// 	16
			// );
			console.log('EST Hour: ' + estHour);
			var currentMinutes = new Date().getMinutes().toLocaleString('en-US', {
				minimumIntegerDigits: 2,
				useGrouping: false,
			});
			console.log('Current Minutes: ' + currentMinutes);

			var currentTemperature = Math.round(
				response.data.data.timelines[1].intervals[0].values.temperature
				// response.data.data.timelines[2].intervals[0].values.temperature
			);
			var currentWeatherCode =
				response.data.data.timelines[1].intervals[0].values.weatherCode;
			// response.data.data.timelines[2].intervals[0].values.weatherCode;
			var currentHumidity = Math.round(
				response.data.data.timelines[1].intervals[0].values.humidity
				// response.data.data.timelines[2].intervals[0].values.humidity
			);
			var currentPrecipitationProbability = Math.round(
				// response.data.data.timelines[2].intervals[0].values
				response.data.data.timelines[1].intervals[0].values
					.precipitationProbability
			);
			var currentWindSpeed = Math.round(
				response.data.data.timelines[1].intervals[0].values.windSpeed
				// response.data.data.timelines[2].intervals[0].values.windSpeed
			);
			var highTemp = Math.round(
				// response.data.data.timelines[2].intervals[0].values.temperatureMax
				// response.data.data.timelines[1].intervals[0].values.temperatureMax
				response.data.data.timelines[0].intervals[0].values.temperatureMax
			);
			var lowTemp = Math.round(
				// response.data.data.timelines[2].intervals[0].values.temperatureMin
				// response.data.data.timelines[1].intervals[0].values.temperatureMin
				response.data.data.timelines[0].intervals[0].values.temperatureMin
			);

			switch (currentWeatherCode) {
				case 1000:
					currentConditions = 'Clear';
					// weatherImage = '../images/mostly_clear_day.svg';
					weatherImage = clear_day;
					break;
				case 1100:
					currentConditions = 'Mostly Clear';
					// weatherImage = '../images/mostly_clear_day.svg';
					weatherImage = mostly_clear_day;
					break;
				case 1101:
					currentConditions = 'Partly Cloudy';
					// weatherImage = '../images/partly_cloudy_day.svg';
					weatherImage = partly_cloudy_day;
					break;
				case 1102:
					currentConditions = 'Mostly Cloudy';
					// weatherImage = '../images/mostly_cloudy_day.svg';
					weatherImage = mostly_cloudy;
					break;
				case 1001:
					currentConditions = 'Cloudy';
					// weatherImage = '../images/cloudy.svg';
					weatherImage = cloudy;
					break;
				case 2100:
					currentConditions = 'Light Fog';
					// weatherImage = '../images/fog_light.svg';
					weatherImage = fog_light;
					break;
				case 2000:
					currentConditions = 'Fog';
					// weatherImage = '../images/fog.svg';
					weatherImage = fog;
					break;
				case 4000:
					currentConditions = 'Drizzle';
					// weatherImage = '../images/drizzle.svg';
					weatherImage = drizzle;
					break;
				case 4200:
					currentConditions = 'Light Rain';
					// weatherImage = '../images/rain_light.svg';
					weatherImage = rain_light;
					break;
				case 4001:
					currentConditions = 'Rain';
					// weatherImage = '../images/rain.svg';
					weatherImage = rain;
					break;
				case 4201:
					currentConditions = 'Heavy Rain';
					// weatherImage = '../images/rain_heavy.svg';
					weatherImage = rain_heavy;
					break;
				case 5001:
					currentConditions = 'Flurries';
					// weatherImage = '../images/flurries.svg';
					weatherImage = flurries;
					break;
				case 5100:
					currentConditions = 'Light Snow';
					// weatherImage = '../images/snow_light.svg';
					weatherImage = snow_light;
					break;
				case 5000:
					currentConditions = 'Snow';
					// weatherImage = '../images/snow.svg';
					weatherImage = snow;
					break;
				case 5101:
					currentConditions = 'Heavy Snow';
					// weatherImage = '../images/snow_heavy.svg';
					weatherImage = snow_heavy;
					break;
				case 6000:
					currentConditions = 'Freezing Drizzle';
					// weatherImage = '../images/freezing_drizzle.svg';
					weatherImage = freezing_drizzle;
					break;
				case 6200:
					currentConditions = 'Light Freezing Drizzle';
					// weatherImage = '../images/freezing_rain_light.svg';
					weatherImage = freezing_rain_light;
					break;
				case 6001:
					currentConditions = 'Freezing Rain';
					// weatherImage = '../images/freezing_rain.svg';
					weatherImage = freezing_rain;
					break;
				case 6201:
					currentConditions = 'Heavy Freezing Rain';
					// weatherImage = '../images/freezing_rain_heavy.svg';
					weatherImage = freezing_rain_heavy;
					break;
				case 7102:
					currentConditions = 'Light Ice Pellets';
					// weatherImage = '../images/ice_pellets_light.svg';
					weatherImage = ice_pellets_light;
					break;
				case 7000:
					currentConditions = 'Ice Pellets';
					// weatherImage = '../images/ice_pellets.svg';
					weatherImage = ice_pellets;
					break;
				case 7101:
					currentConditions = 'Heavy Ice Pellets';
					// weatherImage = '../images/ice_pellets_heavy.svg';
					weatherImage = ice_pellets_heavy;
					break;
				case 8000:
					currentConditions = 'Thunderstorm';
					// weatherImage = '../images/tstorm.svg';
					weatherImage = tstorm;
					break;
				default:
					currentConditions = 'Unable To Determine Current Conditions';
					break;
			}

			// setFormattedCurrentTemperature(currentTemperature + '\xB0 F');
			// setFormattedCurrentConditions(currentConditions);

			if (initialValues) {
				//Gets weather updates for initial locations stored in local storage array, updates an initial array of weather objects, and updates addressArray state with that array when complete.  If a location is added by user, it is processed in the below else if statement with a singular weather object.
				initialWeatherObject[i].temperature = currentTemperature;
				initialWeatherObject[i].currentConditions = currentConditions;
				initialWeatherObject[i].key = i;
				initialWeatherObject[i].weatherImage = weatherImage;
				initialWeatherObject[i].currentHumidity = currentHumidity;
				initialWeatherObject[i].currentPrecipitationProbability =
					currentPrecipitationProbability;
				initialWeatherObject[i].currentWindSpeed = currentWindSpeed;
				initialWeatherObject[i].highTemp = highTemp;
				initialWeatherObject[i].lowTemp = lowTemp;

				console.log(
					'Initial Weather Object Location ' +
						i +
						': ' +
						initialWeatherObject[i].location
				);
				console.log(
					'Updating Weather Object ' + i + ' Temp With: ' + currentTemperature
				);
				console.log(
					'Initial Weather Object Temperature ' +
						i +
						': ' +
						initialWeatherObject[i].temperature
				);
				console.log(
					'Updating Weather Object ' +
						i +
						' Conditions With: ' +
						currentConditions
				);
				console.log(
					'Initial Weather Object Conditions ' +
						i +
						': ' +
						initialWeatherObject[i].currentConditions
				);
				console.log('Updating Weather Object ' + i + ' Key With: ' + i);
				console.log(
					'Initial Weather Object Key ' + i + ': ' + initialWeatherObject[i].key
				);

				console.log(
					'Initial Weather Object: Location ' +
						initialWeatherObject[i].location +
						' Temperature ' +
						initialWeatherObject[i].temperature +
						' Current Conditions ' +
						initialWeatherObject[i].currentConditions +
						' Key ' +
						initialWeatherObject[i].key +
						' Current Humidity ' +
						initialWeatherObject[i].currentHumidity +
						' Current Precipitation Chance ' +
						initialWeatherObject[i].currentPrecipitationProbability +
						' Current Wind Speed ' +
						initialWeatherObject[i].currentWindSpeed +
						' High Temp ' +
						initialWeatherObject[i].highTemp +
						'Low Temp ' +
						initialWeatherObject[i].lowTemp
				);
				// getInitialCityTimeZone(address, estHour, currentMinutes, i);
				let initialValues2 = true;
				getAllCityTimeZones(
					address,
					estHour,
					currentMinutes,
					i,
					initialValues2
				);
			} else if (!initialValues) {
				// If a location is added by user, it is processed here with a singular weather object.
				weatherObject.temperature = currentTemperature;
				weatherObject.currentConditions = currentConditions;
				weatherObject.key = addressArray.length;
				weatherObject.weatherImage = weatherImage;
				weatherObject.currentHumidity = currentHumidity;
				weatherObject.currentPrecipitationProbability =
					currentPrecipitationProbability;
				weatherObject.currentWindSpeed = currentWindSpeed;
				weatherObject.highTemp = highTemp;
				weatherObject.lowTemp = lowTemp;

				console.log(
					'Weather Object: Location ' +
						weatherObject.location +
						' Temperature ' +
						weatherObject.temperature +
						' CurrentConditions' +
						weatherObject.currentConditions +
						' Key ' +
						weatherObject.key +
						' Local Time ' +
						weatherObject.localTime +
						'Weather Image' +
						weatherObject.weatherImage
				);
				let objectString = JSON.stringify(locationArray, null, 4);
				console.log('Location Array String Below:');
				console.log(objectString);
				// getCityTimeZone(address, estHour, currentMinutes);
				let initialValues3 = false;
				getAllCityTimeZones(address, estHour, currentMinutes, initialValues3);
			}
		} catch (error) {
			console.error(error);
			alert(
				'Unfortunately, this Tomorrow.io account will only allow for 25 API calls per hour.  Additional weather updates will be available at the start of the next hour.'
			);
		}
		console.log(
			'Formatted Lat/Lng: (Will not populate fast enough.)' + formattedLatLng
		);
	}

	async function getAllCityTimeZones(
		address,
		estHour,
		currentMinutes,
		i,
		initialValues
	) {
		console.log('x3x.) GET ALL TIME ZONES, INITIAL & ADDITIONS');
		console.log('Current i value: ' + i);
		console.log('Initial Values: ' + initialValues);
		const dateNow = Date.now() / 1000;
		try {
			const response = await axios.get(
				'https://maps.googleapis.com/maps/api/timezone/json?location=' +
					address +
					'&timestamp=' +
					dateNow +
					'&key=AIzaSyCdLuhh7iqVVQOoB0gtTPxIOFDAY6jqP0Q'
			);
			console.log(response);
			var apiESTAdjustment = response.data.rawOffset / 60 / 60;
			var localHour = Number(estHour) + Number(apiESTAdjustment);
			console.log('Local Hour: ' + localHour);
			console.log('apiESTAdjustment: ' + apiESTAdjustment);

			if (initialValues) {
				// Update Time Zones When Going Through Local Storage Locations...
				if (localHour < 12 && localHour > 0) {
					console.log(
						'Local Time, Location #1: ' +
							localHour +
							':' +
							currentMinutes +
							' AM'
					);

					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' AM';
					setLocalTime(localHour + ':' + currentMinutes + ' AM');
					// } else if (localHour == 0) {
				} else if (localHour === 0) {
					localHour = 12;
					console.log(
						'Local Time, Location #2: ' +
							localHour +
							':' +
							currentMinutes +
							' AM'
					);
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' AM';
					setLocalTime(localHour + ':' + currentMinutes + ' AM');
				} else if (localHour == 12) {
					localHour = 12;
					console.log(
						'Local Time, Location #2: ' +
							localHour +
							':' +
							currentMinutes +
							' PM'
					);
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' PM';
					setLocalTime(localHour + ':' + currentMinutes + ' PM');
				} else {
					// Update Time Zones For Any Added Location
					localHour = localHour - 12;
					console.log(
						'Local Time, Location #3: ' +
							localHour +
							':' +
							currentMinutes +
							' PM'
					);
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' PM';
					setLocalTime(localHour + ':' + currentMinutes + ' PM');
				}
				setAddressArray(initialWeatherObject);
				if (i == locationArray.length - 1) {
					setRandomBackground(
						Math.floor(Math.random() * backgroundsArray.length)
					);
				}
				for (let n = 0; n < initialWeatherObject.length; ++n) {
					console.log(
						'Initial Weather Object Length: ' + initialWeatherObject.length
					);
					console.log('Current Initial Weather Object Contents Listed Below: ');
					console.log('	Location ' + n + ' ' + initialWeatherObject[n].location);
					console.log(
						'	Temperature ' + n + ' ' + initialWeatherObject[n].temperature
					);
					console.log('	Key ' + n + ' ' + initialWeatherObject[n].key);
					console.log(' Local Time ' + n + initialWeatherObject[n].localTime);
				}
				let objectString = JSON.stringify(addressArray, null, 4);
				console.log('Address Array Object String Below:');
				console.log(objectString);
			} else if (!initialValues) {
				let tempBackgroundNumber = Math.floor(
					Math.random() * backgroundsArray.length
				);
				while (tempBackgroundNumber == randomBackground) {
					tempBackgroundNumber = Math.floor(
						Math.random() * backgroundsArray.length
					);
				}
				setRandomBackground(tempBackgroundNumber);
				if (localHour <= 12 && localHour > 0) {
					console.log(
						'Local Time: ' + localHour + ':' + currentMinutes + ' AM'
					);
					setLocalTime(localHour + ':' + currentMinutes + ' AM');
					weatherObject.localTime = localHour + ':' + currentMinutes + ' AM';
					// } else if (localHour == 0) {
				} else if (localHour === 0) {
					localHour = 12;
					console.log(
						'Local Time: ' + localHour + ':' + currentMinutes + ' AM'
					);
					setLocalTime(localHour + ':' + currentMinutes + ' AM');
					weatherObject.localTime = localHour + ':' + currentMinutes + ' AM';
				} else {
					localHour = localHour - 12;
					console.log(
						'Local Time: ' + localHour + ':' + currentMinutes + ' PM'
					);
					setLocalTime(localHour + ':' + currentMinutes + ' PM');
					weatherObject.localTime = localHour + ':' + currentMinutes + ' PM';
				}
				if (window !== 'undefined') {
					let currentLSLocationArray = JSON.parse(
						window.localStorage.getItem('lsLocationArray')
					);
					console.log(
						'currentLSLocationArray.length: ' + currentLSLocationArray.length
					);
					var updatedAddressArray2;
					if (currentLSLocationArray.length == 1) {
						updatedAddressArray2 = [];
						weatherObject.key = 0;
					} else {
						updatedAddressArray2 = addressArray;
					}
					updatedAddressArray2.push(weatherObject);
					console.log('Pushing to updatedAddressArray2 to Address Array!');
					// setAddressArray(updatedAddressArray2);
					setAddressArray([...updatedAddressArray2]);

					let objectString3 = JSON.stringify(updatedAddressArray2, null, 4);
					console.log('updatedAddressArray2 String Below:');
					console.log(objectString3);

					let objectString4 = JSON.stringify(weatherObject, null, 4);
					console.log('weatherObject String Below:');
					console.log(objectString4);
					// ---------------------
					if (!window.localStorage.getItem('lsLocationArray')) {
						console.log('No Local Storage Variables Found');
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	// -----------------------
	// CODE BREAK!! - Functions for processing added locations the user adds.
	// -----------------------

	// Converts a zip code or city & state into a latitude & longitude.
	// async function convertAddressToLatLng() {
	async function convertAddressToLatLng(passedLocation) {
		console.log('4.) CONVERT ADDED ADDRESS TO LAT & LNG');
		var lat = '';
		var lng = '';
		var cityAndState = '';
		// var formattedAddress = enteredAddress.trim().replace(' ', ',+');
		var formattedAddress = passedLocation.trim().replace(' ', ',+');

		try {
			const response = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json?address=' +
					formattedAddress +
					'&key=AIzaSyCdLuhh7iqVVQOoB0gtTPxIOFDAY6jqP0Q'
			);

			if (response.data.results[0]) {
				lat = response.data.results[0].geometry.location.lat;
				lng = response.data.results[0].geometry.location.lng;
				cityAndState = response.data.results[0].formatted_address;

				//3/21/22 Clean Up-------------------------
				let cityAndStateArray = cityAndState.split(',');
				let modifiedCityAndState = cityAndStateArray[0].concat(
					', ',
					cityAndStateArray[1].replace(/\d+/, ' ').trim()
				);
				// let test1 = cityAndStateArray[1].replace(/\d+/, ' ').trim();

				//--------------------
				// weatherObject.location = cityAndState;
				weatherObject.location = modifiedCityAndState;
				//--------------------------------------

				setFormattedLatLng(lat + ',' + lng);
				// setFoundLocation(cityAndState);
				setFoundLocation(modifiedCityAndState);
				console.log('Modified City and State: ' + modifiedCityAndState);
				if (window !== 'undefined') {
					if (!window.localStorage.getItem('lsLocationArray')) {
						setAddressArray([]);
						let tempLocationArray = [];
						// tempLocationArray.push(cityAndState);
						tempLocationArray.push(modifiedCityAndState);
						// console.log('Setting Location Array to ' + cityAndState);
						console.log('Setting Location Array to ' + modifiedCityAndState);
						let objectString = JSON.stringify(tempLocationArray, null, 4);
						console.log('tempLocationArray String Below (NOT Local Storage):');
						console.log(objectString);
						setLocationArray(tempLocationArray);

						console.log('No Local Storage Variables Found');
						let initialLSLocationArray = [];
						// initialLSLocationArray.push(cityAndState);
						initialLSLocationArray.push(modifiedCityAndState);
						console.log('Adding: ' + initialLSLocationArray);
						window.localStorage.setItem(
							'lsLocationArray',
							JSON.stringify(initialLSLocationArray)
						);
					} else {
						let tempLocationArray = locationArray;
						// tempLocationArray.push(cityAndState);
						tempLocationArray.push(modifiedCityAndState);
						setLocationArray(tempLocationArray);

						console.log('Local Storage Variables Found.');
						let tempLSLocationArray = JSON.parse(
							window.localStorage.getItem('lsLocationArray')
						);
						console.log('Temp LS Location Array: ' + tempLSLocationArray);
						let objectString = JSON.stringify(tempLSLocationArray, null, 4);
						console.log('Initial tempLSLocationArray String Below:');
						console.log(objectString);
						// tempLSLocationArray.push(cityAndState);
						tempLSLocationArray.push(modifiedCityAndState);
						console.log('Saving Back to Local Storage:');
						let objectString2 = JSON.stringify(tempLSLocationArray, null, 4);
						// console.log('Initial tempLSLocationArray String Below:');
						console.log(objectString2);
						window.localStorage.setItem(
							'lsLocationArray',
							JSON.stringify(tempLSLocationArray)
						);
					}
				}

				//Adding below line because async state update isn't fast enough to immediately pass to getWeather()
				var address = lat + ',' + lng;
				console.log(response);
				console.log('City/State: ' + cityAndState);
				let objectString = JSON.stringify(locationArray, null, 4);
				console.log('Location Array String Below:');
				console.log(objectString);

				let initialValues = false;
				getAllWeather(address, initialValues);
			} else {
				alert(`Please enter a valid location.`);
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<section
			id='pageContainer'
			style={{
				backgroundImage: `url(
					${backgroundsArray[randomBackground]}
				)`,
			}}
		>
			<h2 id='pageTitle'>Weather Widget</h2>
			<div id='weatherSlides'>
				{addressArray.map((address, i) => {
					return (
						<div className='getWeatherContainer' key={i}>
							<GetWeather
								index={i}
								location={locationArray[i]}
								temperature={addressArray[i].temperature}
								currentConditions={addressArray[i].currentConditions}
								localTime={addressArray[i].localTime}
								weatherImage={addressArray[i].weatherImage}
								currentHumidity={addressArray[i].currentHumidity}
								currentPrecipitationProbability={
									addressArray[i].currentPrecipitationProbability
								}
								currentWindSpeed={addressArray[i].currentWindSpeed}
								highTemp={addressArray[i].highTemp}
								lowTemp={addressArray[i].lowTemp}
							/>
						</div>
					);
				})}
				<div id='addCityButtonContainer'>
					<button id='addCityButton' onClick={openAddCityModal}>
						<div className='buttonText'>ADD</div>
						<div className='buttonText'>+</div>
						<div className='buttonText'>CITY</div>
					</button>
				</div>
				{/* <input id='autocomplete' placeholder='Enter a place' type='text' />

				<p>lat: {coordinates.lat}</p>
				<p>lng: {coordinates.lng}</p>
				<p>Google Address: {googleAddress}</p> */}

				{/* <PlacesAutocomplete
					// value={this.state.address}
					value={googleAddress}
					// onChange={this.handleChange}
					onChange={setGoogleAddress}
					// onChange={(event) => setGoogleAddress(event.target.value)}
					onSelect={handleSelect}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
						loading,
					}) => (
						<div>
							<input
								{...getInputProps({
									placeholder: 'Search Places ...',
									className: 'location-search-input',
								})}
							/>
							<div className='autocomplete-dropdown-container'>
								{loading && <div>Loading...</div>}
								{suggestions.map((suggestion) => {
									const className = suggestion.active
										? 'suggestion-item--active'
										: 'suggestion-item';
									// inline style for demonstration purpose
									const style = suggestion.active
										? { backgroundColor: '#fafafa', cursor: 'pointer' }
										: { backgroundColor: '#ffffff', cursor: 'pointer' };
									return (
										<div
											{...getSuggestionItemProps(suggestion, {
												className,
												style,
											})}
										>
											<span>{suggestion.description}</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete> */}
				<Modal
					id='addCityModal'
					isOpen={addCityModalIsOpen}
					onAfterOpen={afterOpenAddCityModal}
					onRequestClose={closeAddCityModal}
					style={customStyles}
					contentLabel='Add City Modal'
				>
					<h2 id='addModalHeader' ref={(_subtitle) => (subtitle = _subtitle)}>
						Which location would you like to add?
					</h2>

					{/* <input
						id='modalInput'
						type='text'
						onChange={(event) => setEnteredAddress(event.target.value)}
					/> */}

					{/* <SearchLocationInput /> */}
					<SearchLocationInput setEnteredAddress={setEnteredAddress} />

					{/* <div className='search-location-input'>
						<input
							ref={autoCompleteRef}
							onChange={(event) => setQuery(event.target.value)}
							placeholder='Enter a City'
							value={query}
						/>
					</div> */}

					{/* <p>Entered Address: {enteredAddress}</p>
					<p>Query: {query}</p> */}
					<div id='addModalButtonContainer'>
						<button
							className='addModalButton'
							id='addCityModalAddButton'
							onClick={closeAddCityModal}
						>
							Add
						</button>
						<button
							className='addModalButton'
							id='addCityModalCancelButton'
							onClick={cancelAddCityModal}
						>
							Cancel
						</button>
					</div>
				</Modal>
			</div>

			{/* THE BELOW SECTION PARTIALLY WORKS, BUT DOES PRODUCES CITIES AND NOT STATES */}
			{/* <>
				<form>
					<input
						name='predictionSearch'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
					<img
						src='https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png'
						alt='Powered by Google'
					/>
					<ul>
						{predictions?.map((prediction) => (
							<li key={prediction?.place_id}>
								<button
									onClick={(e) => handlePredictionSelection(e, prediction)}
									onKeyDown={(e) => handlePredictionSelection(e, prediction)}
								>
									{prediction?.structured_formatting?.main_text || 'Not found'}
								</button>
							</li>
						))}
					</ul>
					<h3>You searched for: {searchValue}</h3>
					<h3>
						You selected:{' '}
						{selectedPrediction?.structured_formatting?.main_text || 'None'}
					</h3>
				</form>
			</> */}

			<div className='bottomText' id='tomorrowCredit'>
				Weather Data Provided By Tomorrow.io
			</div>
			<div className='bottomText' id='bxdCredit'>
				Page Created By BX Development
			</div>
			{/* <SearchLocationInput /> */}
			{/* THE BELOW WORKS, BUT TEMPORARILY HIDING IT TRYING TO GET IT TO WORK IN THE MODAL */}
			{/* <p>IN PAGE GOOGLE AUTOCOMPLETE BELOW:</p>
			<div className='search-location-input'>
				<input
					ref={autoCompleteRef}
					onChange={(event) => setQuery(event.target.value)}
					placeholder='Enter a City'
					value={query}
				/>
			</div>
			<p>Entered Address: {enteredAddress}</p>
			<p>Query: {query}</p> */}
			{/* <p>Entered Address: {enteredAddress}</p>
			<p>Suggested Location: {suggestedLocation[0]}</p> */}
		</section>
	);
};

export default Weather;
