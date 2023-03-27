var connection = navigator.connection||navigator.mozConnection||navigator.webkitConnection;
var loadFonts = true;

if (connection) {
    if (connection.saveData) {
        loadFonts = false;
    }
    else {
        switch(connection.effectiveType) {
            case 'slow-2g':
            case '2g':
            case '3g':
                loadFonts = false;
                break;
        }
    }   
}

if (loadFonts) {
	// load web fonts
}
