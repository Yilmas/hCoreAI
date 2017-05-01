brain.spawn = {};
brain.spawn.config = {};

brain.spawn.config.buildNext = roomName => {

    let roomMemory = Memory.rooms[roomName];

    if (roomMemory.roomType == 'base') {
        return 'base';
    } else if (roomMemory.roomType == 'mine') {
        return 'mine';
    } else if (roomMemory.roomType == 'outpost') {
        return 'outpost';
    }
}

brain.spawn.config.buildMineNext = roomName => {

}

brain.spawn.config.buildOutpostNext = roomName => {

}

brain.spawn.config.creepPriority = role => {
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
    if (role == 'roomBooster') return 7;
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
    let room = Game.rooms[roomName];
    if (!room) return undefined; // Room has no creeps or owned structures, and is therefor either neutral or a mine
    return config.findOperationLevel(config.energyCapacityAvailable.length, room, role);
};

config.findOperationLevel = (operationLevel, room, role) => {
    let currentOperationLevel = operationLevel - 1;

    if (currentOperationLevel === -1) return undefined;

    let energyCapacityAvailable = config.energyCapacityAvailable[currentOperationLevel];
    if (room.controller.level >= operationLevel) {
        if (room.energyCapacityAvailable >= energyCapacityAvailable) {

            let bodyParts = config.roleBodyParts(role, operationLevel);
            let bodyPartsCost = getBodyCost(bodyParts);

            if (config.isEnergyCostPlausible(room, bodyPartsCost)) {
                return bodyParts;
            } else {
                return config.findOperationLevel(currentOperationLevel, room, role);
            }
        } else {
            return config.findOperationLevel(currentOperationLevel, room, role);
        }
    } else {
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
        case 'reserver':
            return config.partsForReserver(level);
        case 'prospector':
            return config.partsForProspector(level);
        case 'collector':
            return config.partsForCollector(level);
        case 'roomBooster':
            return config.partsForRoomBooster(level);
        case 'interRoomTransport':
            return config.partsForInterRoomTransport(level);
        case 'miner':
            return config.partsForMiner(level);
        case 'mineralCollector':
            return config.partsForMineralCollector(level);
        case 'laborant':
            return config.partsForLaborant(level);
        case 'pillager':
            return config.partsForPillager(level);
        case 'attacker':
            return config.partsForAttacker(level);
        case 'healer':
            return config.partsForHealer(level);
    }
};

// Harvester
config.partsForHarvester = level => {
    if (level === 1) return [WORK, WORK, CARRY, MOVE];
    if (level === 2) return [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
    if (level >= 3) return [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
};

// Distributor
config.partsForDistributor = level => {
    if (level === 1) return undefined;
    if (level === 2) return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
    if (level >= 3 && level <= 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 7) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
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
    if (level === 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
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
    if (level >= 4) return [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM];
};

// Reserver
config.partsForReserver = level => {
    if (level <= 3) return undefined;
    if (level >= 4) return [CLAIM, CLAIM, MOVE, MOVE];
}

// RoomBooster
config.partsForRoomBooster = level => {
    if (level <= 5) return undefined;
    if (level === 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 7)
        return [
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
        ];
}

// InterRoomTransport
config.partsForInterRoomTransport = level => {
    if (level <= 6) return undefined;
    if (level >= 7) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
}

// Prospector
config.partsForProspector = level => {
    if (level <= 3) return undefined;
    if (level >= 4) return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
};

// Collector
config.partsForCollector = level => {
    if (level <= 3) return undefined;
    if (level >= 4 && level <= 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level === 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 7) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
};

// Miner
config.partsForMiner = level => {
    if (level <= 5) return undefined;
    if (level >= 6) return [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY];
}

// Mineral Collector
config.partsForMineralCollector = level => {
    if (level <= 5) return undefined;
    if (level >= 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
}

// Laborant
config.partsForLaborant = level => {
    if (level <= 5) return undefined;
    if (level >= 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
}

// Pillager
config.partsForPillager = level => {
    if (level <= 3) return undefined;
    if (level === 4) return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
}

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


brain.spawn.config.checkCreepSpawnForRoom = targetRoom => {
    let room = Game.rooms[targetRoom];


}