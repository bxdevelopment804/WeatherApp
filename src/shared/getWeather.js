import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/styles.css';

const GetWeather = (props) => {
	const [deleteCityModalIsOpen, setDeleteCityModalIsOpen] = useState(false);
	const [deleted, setDeleted] = useState(false);
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

	function openDeleteCityModal() {
		setDeleteCityModalIsOpen(true);
	}

	function afterOpenDeleteCityModal() {
		// subtitle.style.color = '#f00';
		//Look into the above line...
	}

	function closeDeleteCityModal() {
		console.log('DELETE CITY MODAL - GET WEATHER.JS');
		console.log('props.index: ' + props.index);

		let lsLocationArray = JSON.parse(
			window.localStorage.getItem('lsLocationArray')
		);
		if (lsLocationArray) {
			console.log('lsLocationArray length: ' + lsLocationArray.length);
			let objectString = JSON.stringify(lsLocationArray, null, 4);
			console.log('lsLocationArray String Below:');
			console.log(objectString);

			let tempLocationArray = lsLocationArray;
			tempLocationArray.splice(props.index, 1);
			// let objectString2 = JSON.stringify(tempLocationArray, null, 4);
			// console.log('tempLocation Array String Below:');
			// console.log(objectString2);
			if (lsLocationArray.length == 0) {
				// window.localStorage.clear();
				tempLocationArray = ['empty'];
				console.log('Trying to set array to "empty"...');
				window.localStorage.setItem(
					'lsLocationArray',
					JSON.stringify(tempLocationArray)
				);
				let objectString2 = JSON.stringify(tempLocationArray, null, 4);
				console.log('tempLocation Array String Below:');
				console.log(objectString2);
				// document.getElementById('weatherContainer').style.display = 'none';
			} else {
				window.localStorage.setItem(
					'lsLocationArray',
					JSON.stringify(tempLocationArray)
				);
			}
			// setDeleted(true);
		}
		// else {
		// 	document.getElementById('weatherContainer').style.display = 'none';
		// 	// document.getElementById('deleteModalButton').style.display = 'none';
		// }
		setDeleted(true);
		setDeleteCityModalIsOpen(false);
	}

	function cancelDeleteCityModal() {
		setDeleteCityModalIsOpen(false);
	}
	// var location = props.location;
	return (
		<div>
			{deleted ? null : (
				<section id='weatherContainer'>
					{/* <section id='weatherContainer' key={props.index}> */}
					{/* <div className='weatherLineItem'>Weather Container</div> */}
					<div id='deleteButton' onClick={openDeleteCityModal}>
						X
					</div>
					<div id='locationTitle' className='weatherLineItem'>
						{props.location}
					</div>
					<div className='weatherLineItem'>
						Temperature: {props.temperature}&#176;F
					</div>
					<div>
						Hi: {props.highTemp}&#176;F Lo: {props.lowTemp}&#176;F
					</div>
					<div className='weatherLineItem'>
						Current Conditions: {props.currentConditions}
					</div>
					<div className='weatherLineItem'>
						Humidity: {props.currentHumidity}%
					</div>
					<div className='weatherLineItem'>
						Precipitation: {props.currentPrecipitationProbability}%
					</div>
					<div className='weatherLineItem'>
						Wind Speed: {props.currentWindSpeed} MPH
					</div>
					<div className='weatherLineItem'>Local Time: {props.localTime}</div>
					{/* <div className='weatherLineItem'>Index: {props.index}</div> */}
					{/* <div className='weatherLineItem'>
				Weather Image Text: {props.weatherImage}
			</div> */}
					{/* <img src={require({props.weatherImage}).default} alt='weather text'/> */}
					<img id='weatherSVG' src={props.weatherImage} alt='weather text' />
					<Modal
						id='deleteCityModal'
						isOpen={deleteCityModalIsOpen}
						onAfterOpen={afterOpenDeleteCityModal}
						onRequestClose={closeDeleteCityModal}
						style={customStyles}
						contentLabel='Delete City Modal'
					>
						<h2
							id='deleteModalHeader'
							ref={(_subtitle) => (subtitle = _subtitle)}
						>
							Confirm delete?
						</h2>
						<div id='deleteModalButtonContainer'>
							<button
								className='deleteModalButton'
								id='deleteCityModalAddButton'
								onClick={closeDeleteCityModal}
							>
								Delete
							</button>
							<button
								className='deleteModalButton'
								id='deleteCityModalCancelButton'
								onClick={cancelDeleteCityModal}
							>
								Cancel
							</button>
						</div>
						{/* </Link> */}
					</Modal>
				</section>
			)}
		</div>
	);
};

export default GetWeather;
