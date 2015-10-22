import flag from './resources/map_marker_centre.svg!text';

var PRIMARY 	= "#D53F43"; // "#69AEBB";
var SECONDARY 	= "#297685"; // "#FFDE8D";
var HILIGHT 	= "#30A349"; // "#F9D068";

var RED_ICON	= "data:image/svg+xml," + encodeURIComponent(flag.split("#fff").join(PRIMARY)); //'//maps.google.com/mapfiles/ms/icons/red-dot.png';
var BLUE_ICON	= "data:image/svg+xml," + encodeURIComponent(flag.split("#fff").join(SECONDARY)); //'//maps.google.com/mapfiles/ms/icons/blue-dot.png';
var GREEN_ICON	= "data:image/svg+xml," + encodeURIComponent(flag.split("#fff").join(HILIGHT));//'//maps.google.com/mapfiles/ms/icons/green-dot.png';

var icons = {
	GREEN_ICON: GREEN_ICON,
	BLUE_ICON: BLUE_ICON,
	RED_ICON: RED_ICON
};

export default icons;