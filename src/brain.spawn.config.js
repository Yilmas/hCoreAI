brain.spawner = {};
brain.spawner.config = {};

brain.spawner.config.buildNext = roomName => {

    let roomMemory = Memory.rooms[roomName];

    if (roomMemory.roomType == 'base') {
        return 'base';
    } else if (roomMemory.roomType == 'mine') {
        return 'mine';
    } else if (roomMemory.roomType == 'outpost') {
        return 'outpost';
    }
}

brain.spawner.config.buildMineNext = roomName => {

}

brain.spawner.config.buildOutpostNext = roomName => {

}

brain.spawner.config.creepPriority = role => {
    if (role == 'harvester') return 1;
    if (role == 'distributor') return 2;
    if (role == 'carrier') return 3;
    if (role == 'upgrader') return 4;
    if (role == 'bridge') return 5;
    if (role == 'builder') return 6;
    if (role == 'miner') return 6;
    if (role == 'mineralCollector') return 3;
    if (role == 'reserver') return 4;
    if (role == 'prospector') return 5;
    if (role == 'collector') return 6;
    if (role == 'claimer') return 1;
    if (role == 'offSiteBuilder') return 3;
}



config.energyCapacityAvailable = [
    300,  // 1
    550,  // 2
    800,  // 3
    1300, // 4
    1800, // 5
    2300, // 6
    5300, // 7
    12300 // 8
];

global.config.getBodyParts = (roomName, role) => {
    //config.log(3, 'debug scope: Find Operation Level');
    let room = Game.rooms[roomName];
    if (!room) return undefined; // Room has no creeps or owned structures, and is therefor either neutral or a mine
    return config.findOperationLevel(config.energyCapacityAvailable.length, room, role);
};

config.findOperationLevel = (operationLevel, room, role) => {
    //config.log(3, 'debug scope: ' + room.name + ' Operation Level ' + operationLevel);
    let currentOperationLevel = operationLevel - 1;

    // If the currentOperationLevel is less than zero, something is wrong.
    // Delete this if-statement if this check is redundant.
    if (currentOperationLevel === -1) return undefined;

    let energyCapacityAvailable = config.energyCapacityAvailable[currentOperationLevel];
    if (room.controller.level >= operationLevel) {
        //config.log(3, 'debug scope: ' + room.name + ' Operation Level ' + operationLevel + ' equal room level=' + room.controller.level);
        if (room.energyCapacityAvailable >= energyCapacityAvailable) {
            //config.log(3, 'debug scope: ' + room.name + ' Operation Level ' + operationLevel + ' equal room level=' + room.controller.level + ' and equal capacity');

            let bodyParts = config.roleBodyParts(role, operationLevel);
            //config.log(3, 'debug scope: role: ' + role + ' operationLevel: ' + operationLevel + ' body: ' + bodyParts);
            let bodyPartsCost = getBodyCost(bodyParts);
            //config.log(3, 'debug scope: ' + room.name + ' Operation Level ' + operationLevel + ' equal room level=' + room.controller.level + ' and equal capacity' + ' and cost: ' + bodyPartsCost);

            if (config.isEnergyCostPlausible(room, bodyPartsCost)) {
                //config.log(3, 'debug scope: Room: ' + room.name + ' Cost: ' + bodyPartsCost + ' Energy ' + energyCapacityAvailable);
                return bodyParts;
            } else {
                //config.log(3, 'debug scope: Room: ' + room.name + ' Cost: ' + bodyPartsCost + ' is higher than Energy ' + energyCapacityAvailable);
                return config.findOperationLevel(currentOperationLevel, room, role);
            }
        } else {
            //config.log(3, 'debug scope: ' + room.name + ' Operation Level ' + operationLevel + ' equal room level and NOT equal capacity');
            return config.findOperationLevel(currentOperationLevel, room, role);
        }
    } else {
        //config.log(3, 'debug scope: ' + room.name + ' Operation Level ' + operationLevel + ' NOT equal room level');
        return config.findOperationLevel(currentOperationLevel, room, role);
    }
};

config.isEnergyCostPlausible = (room, cost) => {
    let energyAvailableInRoom = room.energyAvailable;
    let storedEnergyAvailable = _.sum(room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_CONTAINER }), c => c.store[RESOURCE_ENERGY]);
    if (!isNullOrUndefined(room.storage)) {
        storedEnergyAvailable = storedEnergyAvailable + room.storage.store[RESOURCE_ENERGY];
    }

    return energyAvailableInRoom >= cost || (storedEnergyAvailable >= cost && room.memory.roles.roleDistributor.amountOfDistributors > 0);
};

config.roleBodyParts = (role, level) => {
    switch (role) {
    case 'harvester':
        return config.partsForHarvester(level);
    case 'distributor':
        return config.partsForDistributor(level);
    case 'upgrader':
        return config.partsForUpgrader(level);
    case 'builder':
        return config.partsForBuilder(level);
    case 'carrier':
        return config.partsForCarrier(level);
    case 'bridge':
        return config.partsForBridge(level);
    case 'claimer':
        return config.partsForClaimer(level);
    case 'prospector':
        return config.partsForProspector(level);
    case 'collector':
        return config.partsForCollector(level);
    case 'attacker':
        return config.partsForAttacker(level);
    case 'healer':
        return config.partsForHealer(level);
    }
};

// Harvester
config.partsForHarvester = level => {
    if (level == 1) return [WORK, WORK, CARRY, MOVE];
    if (level == 2) return [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
    if (level >= 3) return [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
};

// Distributor
config.partsForDistributor = level => {
    if (level == 1) return undefined;
    if (level == 2) return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
    if (level >= 3) return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
};

// Upgrader
config.partsForUpgrader = level => {
    if (level >= 1 && level <= 2) return [WORK, WORK, CARRY, MOVE];
    if (level >= 3 && level <= 4) return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    if (level >= 5) return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
};

// Builder
config.partsForBuilder = level => {
    if (level >= 1 && level <= 2) return [WORK, CARRY, CARRY, MOVE, MOVE];
    if (level >= 3 && level <= 4) return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
    if (level == 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
};

// Carrier
config.partsForCarrier = level => {
    if (level <= 2) return undefined;
    if (level >= 3 && level <= 4) return [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 5) return [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
};

// Bridge
config.partsForBridge = level => {
    if (level <= 2) return undefined;
    if (level >= 3 && level <= 4) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 5) return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
};

// Claimer
config.partsForClaimer = level => {
    if (level <= 3) return undefined;
    if (level >= 4) return [CLAIM, CLAIM, MOVE, MOVE];
};

// Prospector
config.partsForProspector = level => {
    if (level <= 3) return undefined;
    if (level >= 4) return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
};

// Collector
config.partsForCollector = level => {
    if (level <= 3) return undefined;
    if (level >= 4 && level <= 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level == 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 7) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
};

// Attacker
config.partsForAttacker = level => {
    if (level <= 2) return undefined;
    if (level >= 3 && level <= 4) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK];
    if (level >= 5) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK];
};

// Healer
config.partsForHealer = level => {
    if (level <= 2) return undefined;
    if (level >= 3 && level <= 4) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL];
    if (level >= 5) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
};


brain.spawner.config.checkCreepSpawnForRoom = targetRoom => {
    let room = Game.rooms[targetRoom];


}