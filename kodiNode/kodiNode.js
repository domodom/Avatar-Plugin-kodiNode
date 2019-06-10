
let cxtmenu = require('cytoscape-cxtmenu');
const {Graph} = require('cyto-avatar');

let cyto;
let CY;
let cytoscape;
let menu;
let volume;

function addCytoMenu (elem) {

	if (elem.hasClass('kodiNode') && menu == null) {
			// Création du menu,
			// Couleur de base
			let fillColorClassic = 'rgba(51,51,51,0.2)';
			// Couleur sélectionné
			let fillColorCurrent = volume ? 'rgba(85,85,85,0.8)' : fillColorClassic;

			let defaults = {
			  menuRadius: 100, // the radius of the circular menu in pixels
			  selector: 'node',
			  commands: [ // an array of commands to list in the menu or a function that returns the array
					{
						content: '<img src="../core/plugins/kodiNode/assets/images/icons/radio.png" alt="Play Radio" width="35%" height="35%"/>',
						fillColor: ((volume && volume >= 20 && volume < 30) ? fillColorCurrent : fillColorClassic),
						select: function(ele){
							action('play_radio');
							menu.destroy();
							menu = null;
						}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/music.png" alt="Play music" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 15 && volume < 20) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('play_music');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/mute.png" alt="Mute" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 5 && volume < 10) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('mute_unmute');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/sound_down.png" alt="down" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 10 && volume < 15) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('soundDown');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/sound_up.png" alt="Up" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 5 && volume < 10) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('soundUp');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/stop.png" alt="Pause" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 10 && volume < 15) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('stop_player');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/pause.png" alt="Pause" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 10 && volume < 15) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('kodi_pause');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/play.png" alt="Play" width="35%" height="35%"/>',
							fillColor: ((volume && volume >= 5 && volume < 10) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('kodi_play');
								menu.destroy();
								menu = null;
							}
					},
					{
							content: '<img src="../core/plugins/kodiNode/assets/images/icons/power.png" alt="Start" width="35%" height="35%"/>',
							fillColor: ((volume && volume < 5) ? fillColorCurrent : fillColorClassic),
							select: function(ele){
								action('start_kodi');
								menu.destroy();
								menu = null;
							}
					}
			  ],

			  fillColor: 'rgba(136,136,136,0.8)',
			  activeFillColor: 'rgba(68,68,68,0.2)', // the colour used to indicate the selected command
			  activePadding: 0, // additional size in pixels for the active command
			  indicatorSize: 18, // the size in pixels of the pointer to the active command
			  separatorWidth: 0, // the empty spacing in pixels between successive commands
			  spotlightPadding: 0, // extra spacing in pixels between the element and the spotlight
			  minSpotlightRadius: 12, // the minimum radius in pixels of the spotlight
			  maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
			  openMenuEvents: 'tap', // space-separated cytoscape events that will open the menu; only `tap` work here
			  itemColor: 'white', // the colour of text in the command's content
			  itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
			  zIndex: 9999, // the z-index of the ui div
			  atMouse: false // draw menu at mouse position
			};
			// Création du menu
			menu = CY.cxtmenu(defaults);
	} else if (menu) {
			menu.destroy();
			menu = null;
	}

}


exports.beforeNodeMenu  = function(CY, cytoscape) {
	if (menu) {
		menu.destroy();
		menu = null;
	}
}

exports.addPluginElements = function(CY_param, cyto_param){

	CY = CY_param;
	cytoscape = cyto_param;
	cytoscape.use(cxtmenu);

	cyto = new Graph (CY, __dirname);
	cyto.loadAllGraphElements()
	.then(elems => {
		// Test sur la collection pour ajout d'événements
		if (elems && elems.length > 0) {
			elems.forEach(function(ele) {
				if (ele.hasClass('kodiNode')) {
					cyto.onClick(ele, (evt) => {
								addCytoMenu(evt);
					})
				}
			})
		} else {
			addKodiNode();
		}
	})
	.catch(err => {
		console.log('Error loading Elements', err);
	})

}


exports.onAvatarClose = function(callback){
  cyto.saveAllGraphElements("kodiNode")
  .then(() => {
    callback();
  })
  .catch(err => {
    console.log('Error saving Elements', err)
    callback();
  })

}

function action(key) {
	if (Avatar.exists('kodi')) {
		Avatar.call('kodi', {action : {command: key}, client: Config.modules.kodiNode.room});
	}
}

function addKodiNode () {
      cyto.getGraph()
      .then(cy => cyto.addGraphElement(cy, "kodiNode"))
      .then(elem => cyto.addElementClass(elem, "kodiNode"))
			.then(elem => cyto.addElementImage(elem, __dirname+"/assets/images/kodi.png"))
      .then(elem => cyto.addElementSize(elem, 45))
      .then(elem => cyto.addElementRenderedPosition(elem, 100, 140))
			.then(elem => cyto.onHoldClick(elem, (evt) => {
			  	addCytoMenu(evt);
			}))
      .catch(err => {
        console.log('err:', err || 'erreur dans la création de l\'élément')
      })
}

exports.action = function(data, callback){
	callback();
}
