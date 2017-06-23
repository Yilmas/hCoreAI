global.brain = {
    stats: {
        moveToCpu: 0
    },
    special: {}
};

// TODO: Create settings, holds all variables that changes per RCL.

/*
* Configuration paramaters
*/
global.config = {
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

    if (_.sum(Game.creeps, (c) => c.room.name == roomName) < 4) {
        // Initiate reboot process
        config.log(1, 'Room: ' + roomName + ' Running reboot process of operations');
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

config.wallOrRampartTargetHitPoints = roomName => {
    let room = Game.rooms[roomName];

    switch (room.controller.level) {
    case 1:
        return 10000;
    case 2:
        return 15000;
    case 3:
        return 25000;
    case 4:
        return 50000;
    case 5:
        return 100000;
    case 6:
        return 250000;
    case 7:
        return 500000;
    case 8:
        if (roomName === 'E27S83' || roomName === 'E26S83') return 1500000;
        return 750000;
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

config.WHITE_LIST = ['Parthon', 'Vlahn', 'Baj', 'Zeekner', 'Regnare', 'DoctorPC', 'NobodysNightmare', 'cazantyl', 'Yilmas', 'admon'];

config.SIGN_MESSAGE = "[Ypsilon Pact] Sector Claimed, unauthorized claims may result in war declarations!";

config.TERMINAL_MINIMUM_ENERGY = 100000;
config.MAX_MINERAL_IN_ROOM = 50000;