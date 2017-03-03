global.brain = {
    stats: {},
    special: {}
};

// TODO: Create settings, holds all variables that changes per RCL.

/*
* Configuration paramaters
*/
global.config = {
    profiler: {
        enabled: false
    },
    debug: {
        enabled: true,
        debugLevel: 2 // 0: all, 1: general, 2: warning, 3: debug
    }
};

global.config.log = function (level, message) {
    if (config.debug.enabled && config.debug.debugLevel <= level) {
        console.log(message);
    }
}

// TODO: Create new operationSize function
// Start Recursive
global.config.getBodyParts = function (roomName, role) {
    config.log(3, 'debug scope: Find Operation Level');
    let room = Game.rooms[roomName];
    if (!room) return undefined; // Room has no creeps or owned structures, and is therefor either neutral or a mine
    return config.operationLevel8(room, role);
}

config.operationLevel1 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 1');
    if (room.controller.level == 1) {
        return roleBodyParts(role, 1);
        config.log(3, 'debug scope: Room: Energy 300');
    }
}

config.operationLevel2 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 2');
    if (room.controller.level == 2) {
        if (room.energyCapacityAvailable == 550) {
            return roleBodyParts(role, 2);
            config.log(3, 'debug scope: Room: Energy 550');
        } else {
            return config.operationLevel1(room, role);
        }
    } else {
        return config.operationLevel1(room, role);
    }
}

config.operationLevel3 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 3');
    if (room.controller.level == 3) {
        if (room.energyCapacityAvailable == 800) {
            return roleBodyParts(role, 3);
            config.log(3, 'debug scope: Room: Energy 800');
        } else {
            return config.operationLevel2(room, role);
        }
    } else {
        return config.operationLevel2(room, role);
    }
}

config.operationLevel4 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 4');
    if (room.controller.level == 4) {
        if (room.energyCapacityAvailable == 1300) {
            return roleBodyParts(role, 4);
            config.log(3, 'debug scope: Room: Energy 1300');
        } else {
            return config.operationLevel3(room, role);
        }
    } else {
        return config.operationLevel3(room, role);
    }
}

config.operationLevel5 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 5');
    if (room.controller.level == 5) {
        if (room.energyCapacityAvailable == 1800) {
            return roleBodyParts(role, 5);
            config.log(3, 'debug scope: Room: Energy 1800');
        } else {
            return config.operationLevel4(room, role);
        }
    } else {
        return config.operationLevel4(room, role);
    }
}

config.operationLevel6 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 6');
    if (room.controller.level == 6) {
        if (room.energyCapacityAvailable == 2300) {
            return roleBodyParts(role, 6);
            config.log(3, 'debug scope: Room: Energy 2300');
        } else {
            return config.operationLevel5(room, role);
        }
    } else {
        return config.operationLevel5(room, role);
    }
}

config.operationLevel7 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 7');
    if (room.controller.level == 7) {
        if (room.energyCapacityAvailable == 5300) {
            return roleBodyParts(role, 7);
            config.log(3, 'debug scope: Room: Energy 5300');
        } else {
            return config.operationLevel6(room, role);
        }
    } else {
        return config.operationLevel6(room, role);
    }
}

config.operationLevel8 = function (room, role) {
    config.log(3, 'debug scope: Operation Level 8');
    if (room.controller.level == 8) {
        if (room.energyCapacityAvailable == 12300) {
            return roleBodyParts(role, 8);
            config.log(3, 'debug scope: Room: Energy 12300');
        } else {
            return config.operationLevel7(room, role);
        }
    } else {
        return config.operationLevel7(room, role);
    }
}
// End Recursive

global.config.roleBodyParts = function (role, level) {
    // Level > Energy
    //1 300
    //2 550
    //3 800
    //4 1300
    //5 1800
    //6 2300
    //7 5300
    //8 12300

    switch (role) {
        case 'harvester':
            if (level == 1) return [WORK, WORK, CARRY, MOVE];
            if (level == 2) return [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            if (level >= 3) return [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];
            break;
        case 'distributor':
            if (level == 1) return undefined;
            if (level >= 2 && level <= 3) return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
            if (level >= 4 && level <= 5) return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            if (level >= 6) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
            break;
        case 'upgrader':
            if (level >= 1 && level <= 2) return [WORK, WORK, CARRY, MOVE];
            if (level >= 3 && level <= 4) return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            if (level >= 5) return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
            break;
        case 'builder':
            if (level >= 1 && level <= 2) return [WORK, CARRY, CARRY, MOVE, MOVE];
            if (level >= 3 && level <= 4) return [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            if (level >= 5) return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
            break;
        case 'carrier':
            if (level <= 3) return undefined;
            if (level >= 4) return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            break;
        case 'bridge':
            if (level <= 3) return undefined;
            if (level >= 4) return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            break;
        case 'claimer':
            if (level <= 3) return undefined;
            if (level >= 4) return [CLAIM, CLAIM, MOVE, MOVE];
            break;
        case 'prospector':
            if (level <= 3) return undefined;
            if (level >= 4) return [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            break;
        case 'collector':
            if (level <= 3) return undefined;
            if (level >= 4) return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            break;
        case 'attacker':
            if (level <= 2) return undefined;
            if (level >= 3 && level <= 4) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK];
            if (level >= 5) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK];
            break;
        case 'healer':
            if (level <= 2) return undefined;
            if (level >= 3 && level <= 4) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL];
            if (level >= 5) return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL];
            break;
    }
}


// TODO: Add this to each operationLevel check
config.isEnergyCostPlausible = function(room, cost) {
    let energyAvailableInRoom = room.energyAvailable;
    let storedEnergyAvailable = _.sum(room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }), (c) => c.store[RESOURCE_ENERGY]);
    if (!isNullOrUndefined(room.storage)) {
        storedEnergyAvailable = storedEnergyAvailable + room.storage.store[RESOURCE_ENERGY];
    }

    if (energyAvailableInRoom <= cost) {
        return true;
    } else if (storedEnergyAvailable <= cost && room.memory.roles.roleDistributor.amountOfDistributors > 0) {
        return true;
    } else {
        return false;
    }
}


global.config.operationSize = function (roomName) {
    let room = Game.rooms[roomName];

    if (room.find(FIND_CREEPS, { filter: (c) => c.my == true }).length < 4) {
        // Initiate reboot process
        config.log(2, 'Room: ' + roomName + ' Running reboot process of operations');
        return 'small';
    } else {
        if (room.controller.level <= 2) {
            config.log(1, 'Room: ' + roomName + ' Running small operation');
            return 'small';
        } else if (room.controller.level <= 5) {
            if (room.energyCapacityAvailable < 750) {
                config.log(2, 'Room: ' + roomName + ' Falling back to small operation. Lack of extensions.');
                return 'small';
            } else {
                config.log(1, 'Room: ' + roomName + ' Running medium operation');
                return 'medium';
            }
        } else if (room.controller.level >= 6) {
            if (room.energyCapacityAvailable < 1300) {
                config.log(2, 'Room: ' + roomName + ' Falling back to medium operation. Lack of extensions.');
                return 'medium';
            } else {
                config.log(1, 'Room: ' + roomName + ' Running large operation');
                return 'large';
            }
        }
    }
}

global.isNullOrUndefined = function (theObject) {
    return (theObject === undefined || theObject === null);
}

global.getBodyCost = function (theBody) {
    if (isNullOrUndefined(theBody)) {
        return 0;
    }
    let cost = 0;
    for (let i = 0; i < theBody.length; i++) {
        let part = theBody[i];
        cost += BODYPART_COST[part];
    }
    return cost;
}