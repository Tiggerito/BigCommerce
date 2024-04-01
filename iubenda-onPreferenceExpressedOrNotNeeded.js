function (preference) {
/*
    Web Site Advantage: Iubenda Google Consent Mode [v1.0] 
    Implements Google Consent Mode for use in the onPreferenceExpressedOrNotNeeded callback
    https://bigcommerce.websiteadvantage.com.au/
    Copyright (C) 2024 Web Site Advantage
*/
	if (!preference) {
		gtag("consent", "update", {
			"ad_storage": "denied",
			"ad_user_data": "denied",
			"ad_personalization": "denied",
			"analytics_storage": "denied",
			"functionality_storage": "denied",
			"personalization_storage": "denied",
			"security_storage": "denied"
		});
		return;
	};
	
	if (preference.consent === true) {
		gtag("consent", "update", {
			"ad_storage": "granted",
			"ad_user_data": "granted",
			"ad_personalization": "granted",
			"analytics_storage": "granted",
			"functionality_storage": "granted",
			"personalization_storage": "granted",
			"security_storage": "granted"
		});
		return;
	};

	if (preference.consent === false) {
		gtag("consent", "update", {
			"ad_storage": "denied",
			"ad_user_data": "denied",
			"ad_personalization": "denied",
			"analytics_storage": "denied",
			"functionality_storage": "denied",
			"personalization_storage": "denied",
			"security_storage": "denied"
		});
		return;
	} 
		
	if (preference.purposes) {

		var update = {};

		for (var purposeId in preference.purposes) {

			var state = preference.purposes[purposeId] ? 'granted' : 'denied';

			// settings are based on how the Iubenda GTM Template does it

			switch (purposeId) {
				case '2': // Functionality
					update.functionality_storage = state;
					update.security_storage = state;
				break;
				case '3': // Experience
					update.personalization_storage = state; 
				break;
				case '4': // Measurement = Analytics
					update.analytics_storage = state;
				break;
				case '5': // Marketing = Ads
					update.ad_storage = state;
					update.ad_user_data = state;
					update.ad_personalization = state;
				break;
			}
		}
		gtag("consent", "update", update);
	}            
}