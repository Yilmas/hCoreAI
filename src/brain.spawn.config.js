brain.spawn = {};
brain.spawn.config = {};

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
    let roomRoles = Memory.empire.cities[room.name].roles;

    let energyAvailableInRoom = room.energyAvailable;
    let storedEnergyAvailable = _.sum(room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_CONTAINER }), c => c.store[RESOURCE_ENERGY]);
    if (!isNullOrUndefined(room.storage) && roomRoles.roleDistributor.count > 0) {
        storedEnergyAvailable = storedEnergyAvailable + room.storage.store[RESOURCE_ENERGY];
    }

    return energyAvailableInRoom >= cost || (storedEnergyAvailable >= cost && roomRoles.roleDistributor.count > 0);
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
    case 'wallBuilder':
        return config.partsForWallBuilder(level);
    case 'claimer':
        return config.partsForClaimer(level);
    case 'reserver':
        return config.partsForReserver(level);
    case 'prospector':
        return config.partsForProspector(level);
    case 'collector':
        return config.partsForCollector(level);
    case 'interCityBoost':
        return config.partsForInterCityBoost(level);
    case 'interCityTransport':
        return config.partsForInterCityTransport(level);
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
    case 'defender':
        return config.partsForDefender(level);
    case 'specialCreep':
        return config.partsForSpecialCreep(level);
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
    if (level >= 5 && level <= 6) return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
    if (level >= 7 && level <= 8) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY];
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
    if (level >= 3 && level <= 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
};

// Wall Builder
config.partsForWallBuilder = level => {
    if (level <= 7) return undefined;
    if (level === 8)
        return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
}

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

// InterCity Boost
config.partsForInterCityBoost = level => {
    if (level <= 5) return undefined;
    if (level === 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
    if (level >= 7)
        return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
}

// InterCity Transport
config.partsForInterCityTransport = level => {
    if (level <= 6) return undefined;
    if (level >= 7) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
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
    if (level >= 3 && level <= 4) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL];
    if (level >= 5) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL];
};

// Healer
config.partsForHealer = level => {
    if (level <= 2) return undefined;
    if (level >= 3 && level <= 4) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL];
    if (level >= 5) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
};

// Defender
config.partsForDefender = level => {
    if (level <= 3) return undefined;
    if (level >= 4 && level <= 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, HEAL];
    if (level >= 6) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL];
}

// Special Creep
config.partsForSpecialCreep = level => {
    if (level >= 1 && level <= 6) return [WORK, WORK, CARRY, MOVE];
    if (level >= 7) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

}

brain.spawn.config.spawnEmergencyDistributor = roomName => {
    let roles = Memory.empire.cities[roomName].roles;
    let room = Game.rooms[roomName];

    if (roles.roleDistributor.count === 0 && ((room.storage && room.storage.store.energy > 0) || (room.terminal && room.terminal.store.energy > 0))) {
        return true;
    } else {
        return false;
    }
}

brain.spawn.config.checkRoleMinToCount = role => {
    if (role.count < role.min) return true;

    return false;
}

brain.spawn.config.sourcesHasHarvesters = sources => {
    return _.all(sources, 'hasHarvester', true);
}

brain.spawn.config.sourcesHasCarriers = sources => {
    return _.all(sources, 'hasCarrier', true);
}

brain.spawn.config.sourceHasLink = sources => {
    for (let source in sources) {
        let link = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (c) => c.structureType === STRUCTURE_LINK })[0];
        if (link) {
            return true;
        }
    }
}

brain.spawn.config.sourcesHasContainer = sources => {
    for (let source in sources) {
        let link = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (c) => c.structureType === STRUCTURE_CONTAINER })[0];
        if (link) {
            return true;
        }
    }
}

brain.spawn.config.sourcesHasContainerOrLink = sources => {
    for (let source in sources) {
        let containerOrLink = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (c) => c.structureType === STRUCTURE_CONTAINER || c.structureType === STRUCTURE_LINK })[0];
        if (containerOrLink) {
            return true;
        }
    }
}

brain.spawn.config.storageLinkExist = room => {
    return room.storage.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK }).length > 0;
}

brain.spawn.config.controllerHasLinkOrContainer = room => {
    return room.controller.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_LINK }).length > 0;
}

brain.spawn.config.extractorAndContainerExist = room => {
    if (room.controller.level >= 6 && room.storage && room.terminal) {
        let extractor = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR })[0];

        if (extractor) {
            let mineral = extractor.pos.findClosestByRange(FIND_MINERALS);
            let mineralType = mineral.mineralType;

            let mineralAmountInStorage = room.storage.store[mineralType] === undefined ? 0 : room.storage.store[mineralType];
            let mineralAmountInTerminal = room.terminal.store[mineralType] === undefined ? 0 : room.terminal.store[mineralType];

            if (mineralAmountInStorage + mineralAmountInTerminal > config.MAX_MINERAL_IN_ROOM) {
                return false;
            }

            if (mineral.mineralAmount > 0) {
                return extractor.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }).length > 0;
            }
        }
    }

    return false;
}

brain.spawn.config.mineralContainerHasResources = room => {
    if (room.controller.level >= 6 && room.storage && room.terminal) {
        let extractor = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR })[0];
        if (extractor) {
            let mineral = extractor.pos.findClosestByRange(FIND_MINERALS);
            if (mineral.mineralAmount > 0) {
                let container = extractor.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                if (container) {
                    return _.sum(container.store) > 1500;
                }
            }
        }
    }

    return false;
}

brain.spawn.config.labsExist = room => {
    if (room.controller.level >= 6) {
        return room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_LAB }).length > 0;
    }

    return false;
}

brain.spawn.config.reactionsIsActive = room => {
    if (room.controller.level >= 6 && Memory.empire.cities[room.name].reactions) {
        return _.any(Memory.empire.cities[room.name].reactions, 'isActive', true);
    }

    return false;
}

brain.spawn.config.specialCreepRequired = room => {
    let city = Memory.empire.cities[room.name];
    if (city && city.specialCreepRequired) return true;

    return false;
}

brain.spawn.config.spawnWallBuilder = room => {
    let city = Memory.empire.cities[room.name];
    if (city && city.useWallBuilder) {
        if (!city.hasWallBuilder) {
            return true;
        }
    }

    return false;
}

brain.spawn.config.checkInterCityCreeps = cityName => {
    if (_.sum(Memory.empire.cities, (c) => c.parentRoom && c.parentRoom === cityName && !c.isClaimed && !c.hasClaimer) > 0) {
        //config.log(3, 'city is not claimed, and lacks claimer');
        return true;
    } else if (_.sum(Memory.empire.cities, (c) => c.parentRoom && c.parentRoom === cityName && c.useInterCityBoost && !c.hasInterCityBoost) > 0) {
        //config.log(3, 'city needs a booster, and has no booster');
        return true;
    } else if (_.sum(Memory.empire.cities, (c) => c.parentRoom && c.parentRoom === cityName && c.useInterCityTransport && !c.hasInterCityTransport) > 0) {
        //config.log(3, 'city needs a transport, and has no transport');
        return true;
    }
}

brain.spawn.config.checkCityDistrictsForSpawnable = cityMem => {
    for (let districtName in cityMem.districts) {
        let district = cityMem.districts[districtName];
        if (!district.hasReserver) return true;
        if (district.useDefender && !district.hasDefender) return true;
        if (!brain.spawn.config.sourcesHasHarvesters(district.sources)) return true;
        if (!brain.spawn.config.sourcesHasCarriers(district.sources)) return true;
    }

    return false;
}