import React, { createContext, useState } from 'react';

export const locationsContext = createContext();

const LocationsProvider = (props) => {
	const [suggestedLocation, setSuggestedLocation] = useState();

	return (
		<locationsContext.Provider
			value={[suggestedLocation, setSuggestedLocation]}
		>
			{props.children}
		</locationsContext.Provider>
	);
};

export default LocationsProvider;
