require('require');

if(config.profiler.enabled) {
	try {
		var profiler = require('screeps-profiler');
		profiler.enable();
	} catch (e) {
		console.log('screeps-profiler not found');
		config.profiler.enabled = false;
	}
}


var main = function() {
	if(Game.cpu.bucket < Game.cpu.tickLimit) {
		console.log('Skipping tick ' + Game.time + ' due to lack of CPU.');
		return;
	}
	
    // Memory
	brain.memory.prepareMemory();
	brain.memory.refreshMemory();

    // Role Managers
	brain.special.roleManager();
	brain.roleManager();


    // Spawners
	brain.special.creepSpawner();
	brain.creepSpawner();


    // Structures
    brain.structureManager();
};

module.exports.loop = function () {
	if(config.profiler.enabled) {
		profiler.wrap(function() {
			main();
		});
	}
	else {
	    main();
	}
}