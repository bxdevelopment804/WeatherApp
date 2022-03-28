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

	function openDeleteCityModal() {
		setDeleteCityModalIsOpen(true);
	}

	function afterOpenDeleteCityModal() {
		//UNUSED
	}

	function closeDeleteCityModal() {
		let lsLocationArray = JSON.parse(
			window.localStorage.getItem('lsLocationArray')
		);
		if (lsLocationArray) {
			let tempLocationArray = lsLocationArray;
			tempLocationArray.splice(props.index, 1);

			if (lsLocationArray.length == 0) {
				tempLocationArray = ['empty'];
				//Temporarily setting empty local storage to 'empty'.  Otherwise it'll be set to [], which returns 'undefined' to the rest of the code.  This spits out a clothes manufacturer in Argentina named UNDEFINED.
				window.localStorage.setItem(
					'lsLocationArray',
					JSON.stringify(tempLocationArray)
				);
			} else {
				window.localStorage.setItem(
					'lsLocationArray',
					JSON.stringify(tempLocationArray)
				);
			}
		}

		setDeleted(true);
		setDeleteCityModalIsOpen(false);
	}

	function cancelDeleteCityModal() {
		setDeleteCityModalIsOpen(false);
	}

	return (
		<div>
			{/* The below line hides the deleted container, as deleting a location from Location Array doesn't immediately trigger a re-render. */}
			{deleted ? null : (
				<section id='weatherContainer'>
					<button id='deleteButton' onClick={openDeleteCityModal}>
						X
					</button>
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

					<img id='weatherSVG' src={props.weatherImage} alt='weather text' />
					<Modal
						id='deleteCityModal'
						isOpen={deleteCityModalIsOpen}
						onAfterOpen={afterOpenDeleteCityModal}
						onRequestClose={closeDeleteCityModal}
						style={customStyles}
						contentLabel='Delete City Modal'
					>
						<h2 id='deleteModalHeader'>Confirm delete?</h2>
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
					</Modal>
				</section>
			)}
		</div>
	);
};

export default GetWeather;
