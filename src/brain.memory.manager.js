brain.memory.manager = () => {
    brain.memory.setupMemory();
    brain.memory.injection();

    if (Game.tick % 2 === 0) {
        brain.memory.refresh();
    }
}

brain.memory.refresh = () => {
    //Decommision unused creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            config.log(2, 'Clearing non-existing creep memory: ' + name);
        }
    }

    var empire = Memory.empire;

    // Update cities
    for (let cityName in empire.cities) {
        let city = empire.cities[cityName];
        if (!Game.rooms[cityName]) continue;

        // Update isClaimed
        city.isClaimed = Game.rooms[cityName].controller.my;
        city.hasClaimer = _.sum(Game.creeps, (c) => c.memory.task.role === 'claimer' && c.memory.task.endPoint.roomName === cityName) === 1;

        // Update Roles
        city.roles.roleDistributor.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'distributor' && c.room.name == cityName);
        city.roles.roleUpgrader.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'upgrader' && c.room.name == cityName);
        city.roles.roleBuilder.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'builder' && c.room.name == cityName);
        city.roles.roleBridge.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'bridge' && c.room.name == cityName);
        city.roles.roleMiner.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'miner' && c.room.name == cityName);
        city.roles.roleMineralCollector.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'mineralCollector' && c.room.name == cityName);
        city.roles.roleLaborant.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'laborant' && c.room.name == cityName);
        city.roles.roleSpecial.count = _.sum(Game.creeps, (c) => c.memory.task.role === 'special' && c.room.name == cityName);

        // Update city sources
        if (city.sources) {
            for (let sourceName in city.sources) {
                let source = city.sources[sourceName];

                // check if source has harvester/prospector
                source.hasHarvester = _.sum(Game.creeps, (c) => c.memory.task.role === 'harvester' && c.memory.task.endPoint.id === source) === 1;

                // check if source has carrier/collector
                let sourceContainer = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_CONTAINER })[0];
                source.hasCarrier = _.sum(Game.creeps, (c) => c.memory.task.role === 'carrier' && c.memory.task.startPoint.id === sourceContainer) === 1;
            }
        }

        // Update districts
        for (let districtName in city.districts) {
            let district = city.districts[districtName];
            if (!Game.rooms[districtName]) continue;

            // check if a reserver has districtname as endpoint (RoomPosition)
            district.hasReserver = _.sum(Game.creeps, (c) => c.memory.task.role === 'reserver' && c.memory.task.endPoint.roomName === districtName) === 1;

            // check if a defender has districtname as endpoint (Flag)
            district.hasDefender = _.sum(Game.creeps, (c) => c.memory.task.role === 'defender' && c.memory.task.endPoint.room.name === districtName) === 1;

            // Update district sources
            if (district.sources) {
                for (let sourceName in district.sources) {
                    let source = district.sources[sourceName];

                    // check if source has harvester/prospector
                    source.hasHarvester = _.sum(Game.creeps, (c) => c.memory.task.role === 'prospector' && c.memory.task.endPoint.id === source) === 1;

                    // check if source has carrier/collector
                    let sourceContainer = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_CONTAINER })[0];
                    source.hasCarrier = _.sum(Game.creeps, (c) => c.memory.task.role === 'collector' && c.memory.task.startPoint.id === sourceContainer) === 1;
                }
            }
        }
    }
}

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
                let sources = {};
                for (let source of Game.rooms[cityName].find(FIND_SOURCES)) {
                    let sourceTarget = {
                        id: source,
                        hasHarvester: false,
                        hasCarrier: false
                    }

                    sources.push(sourceTarget);
                }

                if (sources.length) {
                    city.sources = sources;
                }
            }

            for (let districtName in city.districts) {
                let district = city.districts[districtName];

                if (Game.rooms[districtName]) {
                    // Load sources for district, if not set
                    if (!district.sources) {
                        let sources = {};
                        for (let source of Game.rooms[district].find(FIND_SOURCES)) {
                            let sourceTarget = {
                                id: source,
                                hasHarvester: false,
                                hasCarrier: false
                            }

                            sources.push(sourceTarget);
                        }

                        if (sources.length) {
                            district.sources = sources;
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
    if (Memory.empire.cities && !Memory.empire.cities[targetRoom]) {
        config.log(3, '[Memory CreateCity] Setup new city: ' + targetRoom);

        Memory.empire.cities[targetRoom] = {
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
            defenseLevel: 0
        }

    } else {
        config.log(3, '[Memory CreateCity] City ' + targetRoom + ' already exist');
    }
}

global.utils.createDistrict = (targetRoom, districtType, cityRoom) => { brain.memory.createDistrict(targetRoom, districtType, cityRoom); }
brain.memory.createDistrict = (targetRoom, districtType, cityRoom) => {
    if (Memory.empire.cities[cityRoom] && !Memory.empire.cities[cityRoom].districts[targetRoom]) {
        config.log(3, '[Memory CreateDistrict] Setup new district: ' + targetRoom + ' in city: ' + cityRoom);

        Memory.empire.cities[cityRoom].districts[targetRoom] = {
            hasReserver: false,
            startReserverAt: 0, // Current tick + 3000, signals when the next reserver should start spawning, updates when reservation.ticksToEnd === 5000
            hasDefender: false,
            type: districtType
        }
    } else {
        config.log(3, '[Memory CreateDistrict] District ' + targetRoom + ' already exist');
    }
}