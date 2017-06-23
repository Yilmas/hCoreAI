brain.memory = {};

brain.memory.manager = () => {
    brain.memory.setupMemory();
    brain.memory.injection();

    brain.memory.refresh();
}

brain.memory.refresh = () => {
    config.log(1, '[Memory] Refresh memory');

    //Decommision unused creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            config.log(2, '<font color=grey>[Memory] Clearing non-existing creep memory: ' + name + '</font>');
        }
    }

    var empire = Memory.empire;

    // Update cities
    for (let cityName in empire.cities) {
        let city = empire.cities[cityName];

        // Update hasClaimer
        city.hasClaimer = _.sum(Game.creeps, (c) => c.memory.task.role === 'claimer' && c.memory.task.endPoint.roomName === cityName) > 0;

        if (!Game.rooms[cityName]) continue;
        // Update isClaimed
        city.isClaimed = Game.rooms[cityName].controller.my;


        // Update Roles
        city.roles.roleDistributor.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'distributor' && c.room.name === cityName);
        city.roles.roleUpgrader.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'upgrader' && c.room.name === cityName);
        city.roles.roleBuilder.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'builder' && c.room.name === cityName);
        city.roles.roleBridge.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'bridge' && c.room.name === cityName);
        city.roles.roleMiner.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'miner' && c.room.name === cityName);
        city.roles.roleMineralCollector.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'mineralCollector' && c.room.name === cityName);
        city.roles.roleLaborant.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'laborant' && c.room.name === cityName);
        city.roles.roleSpecial.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'specialCreep' && c.memory.task.startPoint.roomName === cityName);

        // Update Wall Builder
        if (city.useWallBuilder) {
            let countWallBuilders = _.sum(Game.creeps, (c) => c.memory.task.role === 'wallBuilder' && c.memory.task.startPoint.roomName === cityName);
            city.hasWallBuilder = countWallBuilders >= 2;
        }

        // Update Inter City Creeps
        if (city.useInterCityBoost) {
            let countBoost = _.sum(Game.creeps, (c) => c.memory.task.role === 'interCityBoost' && c.memory.task.startPoint.roomName === cityName);

            city.hasInterCityBoost = countBoost >= 2;
        } else {
            city.hasInterCityBoost = false;
        }

        if (city.useInterCityTransport) {
            let countTransport = _.sum(Game.creeps, (c) => c.memory.task.role === 'interCityTransport' && c.memory.task.endPoint.roomName === cityName);
            city.hasInterCityTransport = countTransport >= 2;
        } else {
            city.hasInterCityTransport = false;
        }

        // Update city sources
        if (city.sources) {
            for (let sourceName in city.sources) {
                let source = city.sources[sourceName];

                // check if source has harvester
                source.hasHarvester = _.sum(Game.creeps, (c) => c.memory.task.role === 'harvester' && c.memory.task.startPoint === sourceName) > 0;

                // check if source has carrier
                let sourceContainer = Game.getObjectById(sourceName).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                if (sourceContainer) {
                    source.hasCarrier = _.sum(Game.creeps, (c) => c.memory.task.role === 'carrier' && c.memory.task.startPoint.id === sourceContainer.id) > 0;
                } else {
                    source.hasCarrier = false;
                }

            }
        }

        // Update districts
        for (let districtName in city.districts) {
            let district = city.districts[districtName];

            // check if a reserver has districtname as endpoint (RoomPosition)
            district.hasReserver = _.sum(Game.creeps, (c) => c.memory.task.role === 'reserver' && c.memory.task.endPoint.roomName === districtName) > 0;

            // check if a defender has districtname as endpoint (Flag)
            if (district.useDefender) {
                district.hasDefender = _.sum(Game.creeps, (c) => c.memory.task.role === 'defender' && c.memory.task.startPoint.pos.roomName === districtName) > 0;
            } else {
                district.hasDefender = false;
            }

            // Update district sources
            if (district.sources) {
                for (let sourceName in district.sources) {
                    let source = district.sources[sourceName];

                    // check if source has prospector
                    source.hasHarvester = _.sum(Game.creeps, (c) => c.memory.task.role === 'prospector' && c.memory.task.endPoint === sourceName) > 0;

                    // check if source has collector
                    if (!Game.getObjectById(sourceName)) continue;
                    let sourceContainer = Game.getObjectById(sourceName).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_CONTAINER })[0];
                    if (sourceContainer) {
                        source.hasCarrier = _.sum(Game.creeps, (c) => c.memory.task.role === 'collector' && c.memory.task.startPoint === sourceContainer.id) > 0;
                    } else {
                        source.hasCarrier = false;
                    }

                }
            }
        }
    }
}

global.utils.setSignMessage = message => { Memory.empire.SIGN_MESSAGE = message; }
global.utils.setWhiteList = whitelist => { Memory.empire.WHITE_LIST = whitelist; }

brain.memory.setupMemory = () => {
    if (!Memory.empire) {
        Memory.empire = {
            WHITE_LIST: '',
            SIGN_MESSAGE: '',
            cities: {}
        }
    }

    for (let cityName in Memory.empire.cities) {
        let city = Memory.empire.cities[cityName];

        if (Game.rooms[cityName]) {
            // Load sources for city, if not set
            if (!city.sources) {
                city.sources = {};
                for (let source of Game.rooms[cityName].find(FIND_SOURCES)) {
                    let sourceId = source.id;
                    city.sources[sourceId] = {};
                    city.sources[sourceId] = {
                        hasHarvester: false,
                        hasCarrier: false
                    }
                }
            }

            for (let districtName in city.districts) {
                let district = city.districts[districtName];

                if (Game.rooms[districtName]) {
                    // Load sources for district, if not set
                    if (!district.sources) {
                        district.sources = {};
                        for (let source of Game.rooms[districtName].find(FIND_SOURCES)) {
                            let sourceId = source.id;
                            district.sources[sourceId] = {};
                            district.sources[sourceId] = {
                                hasHarvester: false,
                                hasCarrier: false
                            }
                        }
                    }
                }
            }
        }
    }
}

brain.memory.injection = () => {
}

global.utils.createCity = (targetRoom, parentRoom) => { brain.memory.createCity(targetRoom, parentRoom); }
brain.memory.createCity = (targetRoom, parentRoom) => {
    if (!targetRoom) return config.log(3, '[Memory CreateCity] targetRoom must be set to a valid room name');

    if (Memory.empire.cities && !Memory.empire.cities[targetRoom]) {
        config.log(3, '[Memory CreateCity] Setup new city: ' + targetRoom);

        Memory.empire.cities[targetRoom] = {
            cityName: targetRoom,
            parentRoom: parentRoom,
            isClaimed: false,
            hasClaimer: false,
            roles: {
                roleDistributor: {
                    min: 2,
                    count: 0
                },
                roleUpgrader: {
                    min: 1,
                    count: 0
                },
                roleBuilder: {
                    min: 1,
                    count: 0
                },
                roleBridge: {
                    min: 1,
                    count: 0
                },
                roleMiner: {
                    min: 1,
                    count: 0
                },
                roleMineralCollector: {
                    min: 1,
                    count: 0
                },
                roleLaborant: {
                    min: 1,
                    count: 0
                },
                roleSpecial: {
                    min: 1,
                    count: 0
                }
            },
            districts: {},
            reactions: {},
            defenseLevel: 0,
            useWallBuilder: false,
            hasWallBuilder: false,
            useInterCityBoost: false,
            hasInterCityBoost: false,
            useInterCityTransport: false,
            hasInterCityTransport: false
        }

    } else {
        config.log(3, '[Memory CreateCity] City ' + targetRoom + ' already exist');
    }
}

global.utils.createDistrict = (targetRoom, districtType, cityRoom) => { brain.memory.createDistrict(targetRoom, districtType, cityRoom); }
brain.memory.createDistrict = (targetRoom, districtType, cityRoom) => {
    if (!targetRoom)
        return config.log(3, '[Memory CreateCity] targetRoom must be set to a valid room name');
    if (!districtType)
        return config.log(3, '[Memory CreateCity] districtType must be either \'normal\' or \'sk\'');
    if (!cityRoom)
        return config.log(3, '[Memory CreateCity] cityRoom must be set to a valid room name');

    if (Memory.empire.cities[cityRoom] && !Memory.empire.cities[cityRoom].districts[targetRoom]) {
        config.log(3, '[Memory CreateDistrict] Setup new district: ' + targetRoom + ' in city: ' + cityRoom);

        Memory.empire.cities[cityRoom].districts[targetRoom] = {
            startReserverAt: 0, // Current tick + 3000, signals when the next reserver should start spawning, updates when reservation.ticksToEnd === 5000
            hasReserver: false,
            hasDefender: false,
            useDefender: true,
            type: districtType
        }
    } else {
        config.log(3, '[Memory CreateDistrict] District ' + targetRoom + ' already exist');
    }
}