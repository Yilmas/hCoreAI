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
        console.log('<font color=red>[Error]</font> <font color=yellow>Memory Manager: </font><font color=red>' + ex.stack + '</font>');
    }

    // Role Managers
    brain.roles.manager();

    // Spawners
    try {
        brain.spawn.manager();
    }
    catch (ex) {
        console.log('<font color=red>[Error]</font> <font color=yellow>Spawn Manager: </font><font color=red>' + ex.stack + '</font>');
    }

    // Structures
    try {
        brain.structures.manager();
    }
    catch (ex) {
        console.log('<font color=red>[Error]</font> <font color=yellow>Structure Manager: </font><font color=red>' + ex.stack + '</font>');
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
        console.log('<font color=red>[Error]</font> <font color=yellow>Visualizer: </font><font color=red>' + ex.stack + '</font>');
    }

    // Stats - Grafana
    try {
        brain.memory.stats.manager();
    } catch (ex) {
        console.log('<font color=red>[Error]</font> <font color=yellow>Stats Grafana: </font><font color=red>' + ex.stack + '</font>');
    }

};

module.exports.loop = function () {
    main();
}