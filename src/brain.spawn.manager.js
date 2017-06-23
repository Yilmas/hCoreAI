brain.spawn.manager = () => {
    let configSpawn = brain.spawn.config;

    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (!Memory.empire.cities[roomName]) continue;

        //if (roomName !== 'E27S83') continue;

        let cityMem = Memory.empire.cities[roomName];
        if (!cityMem) continue;

        let cityName = roomName;
        let roles = cityMem.roles;

        let spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS, { filter: (s) => !s.spawning })[0];
        if (!spawn) continue;

        let startPoint = undefined;
        let endPoint = undefined;

        if (!configSpawn.spawnEmergencyDistributor(roomName) && !configSpawn.sourcesHasHarvesters(cityMem.sources)) {
            // Spawn Harvester
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Harvester');

            // Set startPoint to source

            for (let source in cityMem.sources) {
                if (!cityMem.sources[source].hasHarvester) {
                    startPoint = source;
                } else {
                    continue;
                }
            }

            if (brain.spawn.createCreep(spawn, roomName, 'harvester', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleDistributor) && configSpawn.sourcesHasContainerOrLink(cityMem.sources)) {
            // Spawn Distributor
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Distributor');

            if (brain.spawn.createCreep(spawn, roomName, 'distributor', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (!configSpawn.sourcesHasCarriers(cityMem.sources) && configSpawn.sourcesHasContainer(cityMem.sources) && room.storage && !configSpawn.sourceHasLink(cityMem.sources)) {
            // Spawn Carrier
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Carrier');

            // Set startPoint to Container
            for (let source in cityMem.sources) {
                if (!cityMem.sources[source].hasCarrier) {
                    startPoint = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                    break;
                } else {
                    continue;
                }
            }

            if (brain.spawn.createCreep(spawn, roomName, 'carrier', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleBuilder)) {
            // Spawn Builder
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Builder');

            if (brain.spawn.createCreep(spawn, roomName, 'builder', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleUpgrader)) {
            // Spawn Upgrader
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Upgrader');

            let controller = spawn.room.controller;

            // Set startPoint to Link > Container > Storage
            if (controller.level >= 3 && controller.level <= 5) {
                let link = controller.pos.findInRange(FIND_MY_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
                let container = controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];

                if (!isNullOrUndefined(spawn.room.storage)) {
                    startPoint = spawn.room.storage;
                }
                if (!isNullOrUndefined(container)) {
                    startPoint = container;
                }
                if (!isNullOrUndefined(link)) {
                    startPoint = link;
                }
            } else if (controller.level >= 6) {
                startPoint = controller.pos.findInRange(FIND_MY_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
            }

            if (brain.spawn.createCreep(spawn, roomName, 'upgrader', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (room.storage && configSpawn.checkRoleMinToCount(roles.roleBridge) && configSpawn.controllerHasLinkOrContainer(room.controller)) {
            // Spawn Bridge
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Bridge');

            // Set endPoint to Link > Container
            let storageLink = room.storage.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
            if (storageLink !== undefined) {
                endPoint = storageLink;
            } else {
                endPoint = room.controller.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                if (endPoint === undefined) continue;
            }

            if (brain.spawn.createCreep(spawn, roomName, 'bridge', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleMiner) && configSpawn.extractorAndContainerExist(room)) {
            // Spawn Miner
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Miner');

            // Set startPoint to Mineral Deposit
            let extractor = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR });
            if (!isNullOrUndefined(extractor)) {
                startPoint = extractor[0].pos.findInRange(FIND_MINERALS, 1)[0];
            }

            // Set endPoint to Container
            endPoint = startPoint.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];

            if (brain.spawn.createCreep(spawn, roomName, 'miner', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleMineralCollector) && configSpawn.extractorAndContainerExist(room) && configSpawn.mineralContainerHasResources(room)) {
            // Spawn Mineral Collector
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Mineral Collector');

            // Set startPoint to Mineral Container
            let extractor = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR });
            if (!isNullOrUndefined(extractor)) {
                startPoint = extractor[0].pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
            }

            if (brain.spawn.createCreep(spawn, roomName, 'mineralCollector', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleLaborant) && configSpawn.labsExist(room) && configSpawn.reactionsIsActive(room)) {
            // Spawn Laborant
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Laborant');

            if (brain.spawn.createCreep(spawn, roomName, 'laborant', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.spawnWallBuilder(room)) {
            // Spawn Wall Builder
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Wall Builder');

            startPoint = new RoomPosition(25, 25, room.name);

            if (brain.spawn.createCreep(spawn, roomName, 'wallBuilder', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkRoleMinToCount(roles.roleSpecial) && configSpawn.specialCreepRequired(room)) {
            // Spawn Special Creep
            config.log(3, '[Spawn] Room: ' + roomName + ' spawn Special Creep');

            startPoint = new RoomPosition(25, 25, room.name);

            if (brain.spawn.createCreep(spawn, roomName, 'specialCreep', startPoint, endPoint) === OK) {
                continue;
            }
        } else if (configSpawn.checkInterCityCreeps(cityName)) {
            // Inter City Creeps
            let city = _.filter(Memory.empire.cities, (c) => c.parentRoom === cityName && ((!c.isClaimed && !c.hasClaimer) || (c.useInterCityBoost && !c.hasInterCityBoost) || (c.useInterCityTransport && !c.hasInterCityTransport)))[0];
            //console.log(city.useInterCityTransport);

            startPoint = undefined;
            endPoint = undefined;

            if (!city.isClaimed && !city.hasClaimer) {
                // Spawn Claimer
                config.log(3, '[Spawn] Room: ' + roomName + ' spawn Claimer');

                startPoint = new RoomPosition(25, 25, roomName); // Set startPoint to parent room
                endPoint = new RoomPosition(25, 25, city.cityName); // Set endPoint to target claimName

                if (brain.spawn.createCreep(spawn, roomName, 'claimer', startPoint, endPoint) === OK) {
                    break;
                }
            } else if (city.isClaimed && city.useInterCityBoost && !city.hasInterCityBoost) {
                // Spawn InterCity Boost
                config.log(3, '[Spawn] Room: ' + roomName + ' spawn InterCity Boost');

                startPoint = new RoomPosition(25, 25, city.cityName);
                endPoint = undefined;

                for (let source in city.sources) {
                    if (!source.hasHarvester) {
                        endPoint = Game.getObjectById(source);
                        break;
                    } else {
                        continue;
                    }
                }

                if (startPoint && endPoint) {
                    if (brain.spawn.createCreep(spawn, roomName, 'interCityBoost', startPoint, endPoint) === OK) {
                        break;
                    }
                }
            } else if (city.isClaimed && city.useInterCityTransport && !city.hasInterCityTransport) {
                // Spawn InterCity Transport
                config.log(3, '[Spawn] Room: ' + roomName + ' spawn InterCity Transport');

                startPoint = new RoomPosition(25, 25, roomName); // homeRoom - pickup energy
                endPoint = new RoomPosition(25, 25, city.cityName); // endRoom - deliver energy

                if (brain.spawn.createCreep(spawn, roomName, 'interCityTransport', startPoint, endPoint) === OK) {
                    break;
                }
            }

            continue;
        } else if (configSpawn.checkCityDistrictsForSpawnable(cityMem)) {
            // Manage Districts
            for (let districtName in cityMem.districts) {
                //if(districtName !== 'E28S83' && districtName !== 'E27S84' && districtName !== 'E29S84' && districtName !== 'E26S82' && districtName !== 'E25S81' && districtName !== 'E29S86' && districtName !== 'E25S83') continue;
                startPoint = undefined;
                endPoint = undefined;

                let district = cityMem.districts[districtName];

                if (district.useDefender && !district.hasDefender) {
                    // Spawn Defender
                    config.log(3, '[Spawn] Room: ' + roomName + ' spawn Defender');

                    startPoint = Game.flags[districtName]; // Set startPoint to flag for rendevour

                    if (startPoint) {
                        if (brain.spawn.createCreep(spawn, roomName, 'defender', startPoint, endPoint) === OK) {
                            break;
                        }
                    }
                } else if (!district.hasReserver) {
                    // Spawn Reserver
                    // TODO: Add district.startReserverAtTick (tick at 5000, minus 3000 ticks) Update startReserverAtTick once the controller reaches 4999+ reservationTicks
                    config.log(3, '[Spawn] Room: ' + roomName + ' spawn Reserver');

                    startPoint = new RoomPosition(25, 25, roomName);
                    endPoint = new RoomPosition(25, 25, districtName);

                    if (brain.spawn.createCreep(spawn, roomName, 'reserver', startPoint, endPoint) === OK) {
                        break;
                    }
                } else if (!configSpawn.sourcesHasHarvesters(district.sources) && Game.rooms[districtName]) {
                    // Spawn Prospector
                    config.log(3, '[Spawn] Room: ' + roomName + ' spawn Prospector');

                    startPoint = new RoomPosition(25, 25, districtName);

                    // Set endPoint to source
                    for (let source in district.sources) {
                        if (!district.sources[source].hasHarvester) {
                            endPoint = source;
                        } else {
                            continue;
                        }
                    }
                    if (brain.spawn.createCreep(spawn, roomName, 'prospector', startPoint, endPoint) === OK) {
                        break;
                    }
                } else if (!configSpawn.sourcesHasCarriers(district.sources) && configSpawn.sourcesHasContainer(district.sources) && Game.rooms[districtName]) {
                    // Spawn Collector
                    config.log(3, '[Spawn] Room: ' + roomName + ' spawn Collector');

                    // Set endPoint to Container
                    for (let source in district.sources) {
                        if (!district.sources[source].hasCarrier) {
                            let container = Game.getObjectById(source).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                            if (container) {
                                startPoint = container.id;
                                break;
                            } else {
                                continue;
                            }
                            break;
                        } else {
                            continue;
                        }
                    }
                    endPoint = new RoomPosition(25, 25, roomName);

                    if (!startPoint) continue;

                    if (brain.spawn.createCreep(spawn, roomName, 'collector', startPoint, endPoint) === OK) {
                        break;
                    }
                }
            }

            continue;
        } else if (false) {
            // Manage squads
            // TODO: Create a new squad system
        }
    }
}

global.brain.spawn.createCreep = (test, roomName, role, startPoint, endPoint) => {
    let uniqueId = Math.floor((Math.random() * 1000) + 1);
    if ((isCreationPossible = test.canCreateCreep(config.getBodyParts(roomName, role), role + uniqueId)) === OK) {
        return test.createCreep(config.getBodyParts(roomName, role), role + uniqueId, {
            task: {
                role: role,
                hasResource: false,
                startPoint: startPoint,
                endPoint: endPoint
            }
        });
    } else {
        return isCreationPossible;
    }
}