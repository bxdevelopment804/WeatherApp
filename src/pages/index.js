import * as React from 'react';
import Weather from './weather';

import LocationsProvider from '../shared/LocationsProvider';

const IndexPage = () => {
	return (
		<div>
			<LocationsProvider>
				<Weather />
			</LocationsProvider>
		</div>
	);
};

export default IndexPage;
