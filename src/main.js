require('require');


var main = function () {
    if (Game.cpu.bucket < Game.cpu.tickLimit) {
        console.log('Skipping tick ' + Game.time + ' due to lack of CPU.');
        return;
    }

    // Memory
    try {
        brain.memory.prepareMemory();
    }
    catch (ex) {
        console.log('<font color=red>Memory.prePareMemory: ' + ex + '</font>');
    }

    try {
        brain.memory.refreshMemory();
    }
    catch (ex) {
        console.log('<font color=red>Memory.refreshMemory: ' + ex + '</font>');
    }

    // Role Managers
    brain.roleManager();
    brain.special.roleManager();

    // Spawners
    try {
        brain.special.creepSpawner();
    }
    catch (ex) {
        console.log('<font color=red>Special.CreepSpawner: ' + ex + '</font>');
    }
    try {
        brain.creepSpawner();
    }
    catch (ex) {
        console.log('<font color=red>CreepSpawner: ' + ex + '</font>');
    }

    // Structures
    try {
        brain.structureManager();
    }
    catch (ex) {
        console.log('<font color=red>StructureManager: ' + ex + '</font>');
    }


    // Lab Manager
    try {
        brain.labManager.start();
    }
    catch (ex) {
        console.log('<font color=red>Lab Manager: ' + ex.stack + '</font>');
    }
};

module.exports.loop = function () {
    main();
}