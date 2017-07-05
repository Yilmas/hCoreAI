require('require');


var main = function () {
    if (Game.cpu.bucket < Game.cpu.tickLimit) {
        console.log('Skipping tick ' + Game.time + ' due to lack of CPU.');
        return;
    }

    // Memory
    try {
        brain.memory.manager();
    } catch (ex) {
        console.log('<font color=red>[Error] Memory Manager: ' + ex.stack + '</font>');
    }

    // Role Managers
    brain.roles.manager();

    // Spawners
    try {
        brain.spawn.manager();
    }
    catch (ex) {
        console.log('<font color=red>[Error] Brain.Spawn.Manager: ' + ex.stack + '</font>');
    }

    // Structures
    try {
        brain.structureManager();
    }
    catch (ex) {
        console.log('<font color=red>[Error] StructureManager: ' + ex.stack + '</font>');
    }


    // Lab Manager
    //try {
    //    brain.labManager.start();
    //}
    //catch (ex) {
    //    console.log('<font color=red>[Error] Lab Manager: ' + ex.stack + '</font>');
    //}


    // Visualizer
    try {
        visualizer.startRoomVisuals();
    } catch (ex) {
        console.log('<font color=red>[Error] Visualizer: ' + ex.stack + '</font>');
    }

    // Stats - Grafana
    try {
        brain.memory.stats();
    } catch (ex) {
        console.log('<font color=red>[Error] Stats-Grafana: ' + ex.stack + '</font>');
    }

};

module.exports.loop = function () {
    main();
}