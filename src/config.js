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