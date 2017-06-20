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
        console.log('<font color=red>[Error] StructureManager: ' + ex + '</font>');
    }


    // Lab Manager
    //try {
    //    brain.labManager.start();
    //}
    //catch (ex) {
    //    console.log('<font color=red>[Error] Lab Manager: ' + ex + '</font>');
    //}


    // Visualizer
    //try {
    //    visualizer.startRoomVisuals();
    //} catch (ex) {
    //    console.log('<font color=red>[Error] Visualizer: ' + ex + '</font>');
    //}

};

module.exports.loop = function () {
    main();
}