import $ from 'jquery';
import Morel from 'morel';
import CONFIG from 'config'; // Replaced with alias

$.extend(true, Morel.Occurrence.keys, CONFIG.morel.occurrence);

export default Morel.Occurrence.extend({

});
