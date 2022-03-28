import React, { useState, useEffect, useContext } from 'react';
import { locationsContext } from '../shared/LocationsProvider';
import Modal from 'react-modal';

import GetWeather from '../shared/getWeather';
import SearchLocationInput from '../shared/searchLocationInput';

import clear_day from '../images/clear_day.svg';
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
import mostly_cloudy from '../images/mostly_cloudy.svg';
import partly_cloudy_day from '../images/partly_cloudy_day.svg';
import rain_heavy from '../images/rain_heavy.svg';
import rain_light from '../images/rain_light.svg';
import rain from '../images/rain.svg';
import snow_heavy from '../images/snow_heavy.svg';
import snow_light from '../images/snow_light.svg';
import snow from '../images/snow.svg';
import tstorm from '../images/tstorm.svg';

const axios = require('axios');

const Weather = () => {
	//Overall, Weather function looks in local storage for any locations a user previously added, which are stored in an array.  (A default location will be used if this is the user's first time on this page.)  The location array is converted into an array of weather objects for each city, and which is then passed to the GetWeather component for rendering.  New locations the user adds will be added to local storage.
	//   Each location is passed to the Google Geocode API for conversion to latitude and longitude, as required by the Tomorrow.io API.  The coordinates are then passed to the Tomorrow.io API for various weather information, and then passed to the Google Maps API to help determine the local time for each location.  All API calls handled through Axios.
	const [enteredAddress, setEnteredAddress] = useState('');
	const [addressArray, setAddressArray] = useState([]);
	const [locationArray, setLocationArray] = useState(['Sacramento, CA']);
	const [addCityModalIsOpen, setAddCityModalIsOpen] = useState(false);
	const [randomBackground, setRandomBackground] = useState();

	const suggestedLocation = useContext(locationsContext);

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

	//Opens modal to add a city.
	function openAddCityModal() {
		setAddCityModalIsOpen(true);
		suggestedLocation[1]('');
		//If the user starts to add a city after just adding a new one, but clicks out of the modal, the above line prevents the first city from being added again.
	}

	function afterOpenAddCityModal() {
		//UNUSED
	}

	//Gets desired location from user and submits to API chain for weather info.
	function closeAddCityModal() {
		if (suggestedLocation[0] && suggestedLocation[0] !== '') {
			let passedLocation = suggestedLocation[0];
			convertAddressToLatLng(passedLocation);
		}
		setAddCityModalIsOpen(false);
	}

	//Cancels adding a new location.
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
	// useEffect gets any locations previously added by the user from local storage on page load, and sends them through the API chain for weather updates.
	useEffect(() => {
		if (window !== 'undefined') {
			let lsLocationArray = JSON.parse(
				window.localStorage.getItem('lsLocationArray')
			);

			if (lsLocationArray && lsLocationArray[0] != 'empty') {
				//If previous locations are found in local storage, create a new 'process array' with those locations.  If no previous locations are found, use the LocationArray state location.
				setLocationArray(lsLocationArray);
				processArray = lsLocationArray;
			} else {
				//No previous locations were found, so use the LocationArray default state location.
				processArray = locationArray;
				window.localStorage.clear();
			}
		}
		processArray.forEach((location, i) => {
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

			convertInitialAddressesToLatLng(location, i);
		});
	}, []);

	// ----------------------------------------------------------
	//Gets latitude and longitude for locations already saved in local storage.  Tomorrow.io API needs lat/lng to get weather information.
	async function convertInitialAddressesToLatLng(providedAddress, i) {
		var lat = '';
		var lng = '';
		var cityAndState = '';
		var formattedAddress = providedAddress.trim().replace(' ', ',+');

		try {
			const response = await axios.get(
				`${process.env.GATSBY_GOOGLE_GEOCODE_URL_PART_1}` +
					formattedAddress +
					`${process.env.GATSBY_GOOGLE_GEOCODE_URL_PART_2}` +
					`${process.env.GATSBY_GOOGLE_GEOCODE_API_KEY}`
			);

			if (response.data.results[0]) {
				lat = response.data.results[0].geometry.location.lat;
				lng = response.data.results[0].geometry.location.lng;
				cityAndState = response.data.results[0].formatted_address;
				initialWeatherObject[i].location = cityAndState;

				//Adding below line because async state update isn't fast enough to immediately pass to getWeather()
				var address = lat + ',' + lng;
				let initialValues = true;
				getAllWeather(address, i, initialValues);
			} else {
				alert(`Please enter a valid location.`);
			}
		} catch (error) {
			console.error(error);
		}
	}

	//Gets weather information for both initial locations in local storage as well as any locations added from the Add Location modal.
	async function getAllWeather(address, i, initialValues) {
		try {
			const response = await axios.get(
				`${process.env.GATSBY_TOMORROW_IO_URL_PART_1}` +
					address +
					`${process.env.GATSBY_TOMORROW_IO_URL_PART_2}` +
					`${process.env.GATSBY_TOMORROW_IO_API_KEY}`
			);

			var currentConditions;
			var weatherImage;

			var currentMinutes = new Date().getMinutes().toLocaleString('en-US', {
				minimumIntegerDigits: 2,
				useGrouping: false,
			});
			var currentIndex;
			var dayIndex;
			for (let i = 0; i < response.data.data.timelines.length; ++i) {
				if (response.data.data.timelines[i].timestep == 'current') {
					currentIndex = i;
				} else if (response.data.data.timelines[i].timestep == '1d') {
					dayIndex = i;
				}
			}

			var estHour =
				Number(
					response.data.data.timelines[currentIndex].startTime.substring(11, 13)
				) + 5;

			var currentTemperature = Math.round(
				response.data.data.timelines[currentIndex].intervals[0].values
					.temperature
			);
			var currentWeatherCode =
				response.data.data.timelines[currentIndex].intervals[0].values
					.weatherCode;
			var currentHumidity = Math.round(
				response.data.data.timelines[currentIndex].intervals[0].values.humidity
			);
			var currentPrecipitationProbability = Math.round(
				response.data.data.timelines[currentIndex].intervals[0].values
					.precipitationProbability
			);
			var currentWindSpeed = Math.round(
				response.data.data.timelines[currentIndex].intervals[0].values.windSpeed
			);
			var highTemp = Math.round(
				response.data.data.timelines[dayIndex].intervals[0].values
					.temperatureMax
			);
			var lowTemp = Math.round(
				response.data.data.timelines[dayIndex].intervals[0].values
					.temperatureMin
			);

			switch (currentWeatherCode) {
				case 1000:
					currentConditions = 'Clear';
					weatherImage = clear_day;
					break;
				case 1100:
					currentConditions = 'Mostly Clear';
					weatherImage = mostly_clear_day;
					break;
				case 1101:
					currentConditions = 'Partly Cloudy';
					weatherImage = partly_cloudy_day;
					break;
				case 1102:
					currentConditions = 'Mostly Cloudy';
					weatherImage = mostly_cloudy;
					break;
				case 1001:
					currentConditions = 'Cloudy';
					weatherImage = cloudy;
					break;
				case 2100:
					currentConditions = 'Light Fog';
					weatherImage = fog_light;
					break;
				case 2000:
					currentConditions = 'Fog';
					weatherImage = fog;
					break;
				case 4000:
					currentConditions = 'Drizzle';
					weatherImage = drizzle;
					break;
				case 4200:
					currentConditions = 'Light Rain';
					weatherImage = rain_light;
					break;
				case 4001:
					currentConditions = 'Rain';
					weatherImage = rain;
					break;
				case 4201:
					currentConditions = 'Heavy Rain';
					weatherImage = rain_heavy;
					break;
				case 5001:
					currentConditions = 'Flurries';
					weatherImage = flurries;
					break;
				case 5100:
					currentConditions = 'Light Snow';
					weatherImage = snow_light;
					break;
				case 5000:
					currentConditions = 'Snow';
					weatherImage = snow;
					break;
				case 5101:
					currentConditions = 'Heavy Snow';
					weatherImage = snow_heavy;
					break;
				case 6000:
					currentConditions = 'Freezing Drizzle';
					weatherImage = freezing_drizzle;
					break;
				case 6200:
					currentConditions = 'Light Freezing Drizzle';
					weatherImage = freezing_rain_light;
					break;
				case 6001:
					currentConditions = 'Freezing Rain';
					weatherImage = freezing_rain;
					break;
				case 6201:
					currentConditions = 'Heavy Freezing Rain';
					weatherImage = freezing_rain_heavy;
					break;
				case 7102:
					currentConditions = 'Light Ice Pellets';
					weatherImage = ice_pellets_light;
					break;
				case 7000:
					currentConditions = 'Ice Pellets';
					weatherImage = ice_pellets;
					break;
				case 7101:
					currentConditions = 'Heavy Ice Pellets';
					weatherImage = ice_pellets_heavy;
					break;
				case 8000:
					currentConditions = 'Thunderstorm';
					weatherImage = tstorm;
					break;
				default:
					currentConditions = 'Unable To Determine Current Conditions';
					break;
			}

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
				let initialValues3 = false;
				getAllCityTimeZones(address, estHour, currentMinutes, initialValues3);
			}
		} catch (error) {
			console.error(error);
			alert(
				'Unfortunately, this Tomorrow.io account will only allow for 25 API calls per hour.  Additional weather updates will be available at the start of the next hour.'
			);
		}
	}

	async function getAllCityTimeZones(
		address,
		estHour,
		currentMinutes,
		i,
		initialValues
	) {
		const dateNow = Date.now() / 1000;
		try {
			const response = await axios.get(
				`${process.env.GATSBY_GOOGLE_TIMEZONE_URL_PART_1}` +
					address +
					`${process.env.GATSBY_GOOGLE_TIMEZONE_URL_PART_2}` +
					dateNow +
					`${process.env.GATSBY_GOOGLE_TIMEZONE_URL_PART_3}` +
					`${process.env.GATSBY_GOOGLE_TIMEZONE_API_KEY}`
			);
			var apiESTAdjustment = response.data.rawOffset / 60 / 60;
			var localHour = Number(estHour) + Number(apiESTAdjustment);

			if (initialValues) {
				// Update Time Zones When Going Through Local Storage Locations...
				if (localHour < 12 && localHour > 0) {
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' AM';
				} else if (localHour === 0) {
					localHour = 12;
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' AM';
				} else if (localHour == 12) {
					localHour = 12;
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' PM';
				} else {
					// Update Time Zones For Any Added Locations
					localHour = localHour - 12;
					initialWeatherObject[i].localTime =
						localHour + ':' + currentMinutes + ' PM';
				}
				setAddressArray(initialWeatherObject);
				if (i == locationArray.length - 1) {
					setRandomBackground(
						Math.floor(Math.random() * backgroundsArray.length)
					);
				}
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
					weatherObject.localTime = localHour + ':' + currentMinutes + ' AM';
				} else if (localHour === 0) {
					localHour = 12;
					weatherObject.localTime = localHour + ':' + currentMinutes + ' AM';
				} else {
					localHour = localHour - 12;
					weatherObject.localTime = localHour + ':' + currentMinutes + ' PM';
				}
				if (window !== 'undefined') {
					let currentLSLocationArray = JSON.parse(
						window.localStorage.getItem('lsLocationArray')
					);
					var updatedAddressArray2;
					if (currentLSLocationArray.length == 1) {
						updatedAddressArray2 = [];
						weatherObject.key = 0;
					} else {
						updatedAddressArray2 = addressArray;
					}
					updatedAddressArray2.push(weatherObject);
					setAddressArray([...updatedAddressArray2]);

					if (!window.localStorage.getItem('lsLocationArray')) {
						console.log('No Previous Locations Found In Local Storage');
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	// Takes an additional location from the Add City modal and converts it into a latitude & longitude.  The coordinates are then sent to the fun
	async function convertAddressToLatLng(passedLocation) {
		var lat = '';
		var lng = '';
		var cityAndState = '';
		var formattedAddress;
		if (passedLocation) {
			formattedAddress = passedLocation.trim().replace(' ', ',+');
		}

		try {
			const response = await axios.get(
				`${process.env.GATSBY_GOOGLE_GEOCODE_URL_PART_1}` +
					formattedAddress +
					`${process.env.GATSBY_GOOGLE_GEOCODE_URL_PART_2}` +
					`${process.env.GATSBY_GOOGLE_GEOCODE_API_KEY}`
			);

			if (response.data.results[0]) {
				lat = response.data.results[0].geometry.location.lat;
				lng = response.data.results[0].geometry.location.lng;
				cityAndState = response.data.results[0].formatted_address;

				//The below few lines take the city/state/zip/etc from Google and reduces it down to just the city and state.  Cleans up presentation for user.
				let cityAndStateArray = cityAndState.split(',');
				let modifiedCityAndState = cityAndStateArray[0].concat(
					', ',
					cityAndStateArray[1].replace(/\d+/, ' ').trim()
				);

				weatherObject.location = modifiedCityAndState;

				if (window !== 'undefined') {
					if (!window.localStorage.getItem('lsLocationArray')) {
						setAddressArray([]);
						let tempLocationArray = [];

						tempLocationArray.push(modifiedCityAndState);

						setLocationArray(tempLocationArray);

						console.log('No Previous Locations Found In Local Storage');
						let initialLSLocationArray = [];

						initialLSLocationArray.push(modifiedCityAndState);
						window.localStorage.setItem(
							'lsLocationArray',
							JSON.stringify(initialLSLocationArray)
						);
					} else {
						let tempLocationArray = locationArray;

						tempLocationArray.push(modifiedCityAndState);
						setLocationArray(tempLocationArray);

						let tempLSLocationArray = JSON.parse(
							window.localStorage.getItem('lsLocationArray')
						);

						tempLSLocationArray.push(modifiedCityAndState);
						window.localStorage.setItem(
							'lsLocationArray',
							JSON.stringify(tempLSLocationArray)
						);
					}
				}

				//Adding below line because async state update isn't fast enough to immediately pass to getWeather()
				var address = lat + ',' + lng;

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
				<Modal
					id='addCityModal'
					isOpen={addCityModalIsOpen}
					onAfterOpen={afterOpenAddCityModal}
					onRequestClose={closeAddCityModal}
					style={customStyles}
					contentLabel='Add City Modal'
				>
					<h2 id='addModalHeader'>Which location would you like to add?</h2>
					<SearchLocationInput setEnteredAddress={setEnteredAddress} />
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
			<div className='bottomText' id='tomorrowCredit'>
				Weather Data Provided By Tomorrow.io
			</div>
			<div className='bottomText' id='bxdCredit'>
				Page Created By BX Development
			</div>
		</section>
	);
};

export default Weather;
