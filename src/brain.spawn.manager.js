brain.spawner.manager = () => {
    let configSpawn = brain.spawn.config;

    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        let cityMem = Memory.empire.cities[roomName];

        if (cityMem === undefined) continue;

        for (let spawn in room.find(FIND_MY_SPAWNS, { filter: (s) => !s.spawning })) {

            let uniqueId = Math.floor((Math.random() * 1000) + 1);
            let startPoint = undefined;
            let endPoint = undefined;

            let buildNext = configSpawn.buildNext(roomName);

            // Base
            if (buildNext === 'harvester') {
                // Spawn Harvester
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Harvester');

                // Set startPoint to source
                let source = _.filter(cityMem.sources, (s) => !s.hasHarvester);
                if (source) {
                    startPoint = Game.getObjectById(source[0]);

                    if (!startPoint) {
                        continue;
                    }
                }

                // Set endPoint to container
                endPoint = startPoint.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'harvester'), 'harvester' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'harvester'), 'harvester' + uniqueId, {
                        task: {
                            role: 'harvester',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'distributor') {
                // Spawn Distributor
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Distributor');

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'distributor'), 'distributor' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'distributor'), 'distributor' + uniqueId, {
                        task: {
                            role: 'distributor',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'carrier') {
                // Spawn Carrier
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Carrier');

                // Set startPoint to Container
                for (let source in cityMem.sources) {
                    if (!source.hasCarrier) {
                        startPoint = Game.getObjectById(id).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
                        break;
                    } else {
                        continue;
                    }
                }

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'carrier'), 'carrier' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'carrier'), 'carrier' + uniqueId, {
                        task: {
                            role: 'carrier',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'builder') {
                // Spawn Builder
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Builder');

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'builder'), 'builder' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'builder'), 'builder' + uniqueId, {
                        task: {
                            role: 'builder',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'upgrader') {
                // Spawn Upgrader
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Upgrader');

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

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'upgrader'), 'upgrader' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'upgrader'), 'upgrader' + uniqueId, {
                        task: {
                            role: 'upgrader',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'bridge') {
                // Spawn Bridge
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Bridge');

                // Set endPoint to Link > Container
                let storageLink = startPoint.findInRange(FIND_MY_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
                if (storageLink !== undefined) {
                    endPoint = storageLink;
                } else {
                    endPoint = spawn.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                    if (endPoint === undefined) continue;
                }

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'bridge'), 'bridge' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'bridge'), 'bridge' + uniqueId, {
                        task: {
                            role: 'bridge',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'miner') {
                // Spawn Miner
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Miner');

                // Set startPoint to Mineral Deposit
                let extractor = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR });
                if (!isNullOrUndefined(extractor)) {
                    startPoint = extractor[0].pos.findInRange(FIND_MINERALS, 1)[0];
                }

                // Set endPoint to Container
                endPoint = startPoint.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'miner'), 'miner' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'miner'), 'miner' + uniqueId, {
                        task: {
                            role: 'miner',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext === 'mineralCollector') {
                // Spawn MineralCollector
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning MineralCollector');

                // Set startPoint to Mineral Container
                let extractor = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR });
                if (!isNullOrUndefined(extractor)) {
                    startPoint = extractor[0].pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                }

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'mineralCollector'), 'mineralCollector' + uniqueId) === OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'mineralCollector'), 'mineralCollector' + uniqueId, {
                        task: {
                            role: 'mineralCollector',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }
            } else if (buildNext === 'laborant') {
                // Spawn Laborant
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning laborant');

                if (spawn.canCreateCreep(config.getBodyParts(roomName, 'laborant'), 'laborant' + uniqueId) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, 'laborant'), 'laborant' + uniqueId, {
                        task: {
                            role: 'laborant',
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            } else if (buildNext === 'pillager') {
                // Spawn Pillager
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning pillager');

                startPoint = spawn.room.storage; // Needed, do not remove this!!!

                //if (roomName == 'E27S83') {
                //    endPoint = new RoomPosition(25, 25, 'E27S81');
                //}

                if (endPoint) {
                    if (spawn.canCreateCreep(config.getBodyParts(roomName, 'pillager'), 'pillager' + uniqueId) === OK) {
                        spawn.createCreep(config.getBodyParts(roomName, 'pillager'), 'pillager' + uniqueId, {
                            task: {
                                role: 'pillager',
                                hasResource: false,
                                startPoint: startPoint,
                                endPoint: endPoint
                            }
                        });
                        break;
                    }
                }
            } else if (buildNext === 'scout') {
                // Spawn Scout Creep
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning scout');

                //let endPoint = new RoomPosition(25, 25, scoutRoom.targetRoom);

                if (spawn.canCreateCreep([MOVE], 'scout' + uniqueId) === OK) {
                    spawn.createCreep([MOVE], 'scout' + uniqueId, {
                        task: {
                            role: 'scout',
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            } else if (buildNext === 'specialCreep') {
                // Spawn Special Creep
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning special creep');

                if (spawn.canCreateCreep([], 'specialCreep' + uniqueId) === OK) {
                    spawn.createCreep([], 'specialCreep' + uniqueId, {
                        task: {
                            role: 'specialCreep',
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            } else if (buildNext === 'city') {
                let newCities = _.filter(Memory.empire.cities, (c) => c.parentRoom === roomName);
                for (let newCityName in newCities) {
                    let newCityMem = Memory.empire.cities[newCityName];
                    let newCityBuildNext = configSpawn.buildOutpostNext(newCityName);

                    if (newCityBuildNext) {
                        if (newCityBuildNext === 'claimer') {
                            // Spawn Claimer
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning claimer for new city '+newCityName);

                            let startPoint = new RoomPosition(25, 25, roomName); // Set startPoint to parent room
                            let endPoint = new RoomPosition(25, 25, newCityName); // Set endPoint to target claimName

                            if (spawn.canCreateCreep(config.getBodyParts(roomName, 'claimer'), 'claimer' + uniqueId) === OK) {
                                spawn.createCreep(config.getBodyParts(roomName, 'claimer'), 'claimer' + uniqueId, {
                                    task: {
                                        role: 'claimer',
                                        hasResource: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                break;
                            }
                        } else if (newCityBuildNext === 'prospector') {
                            // Spawn prospector to create the spawn in the outpost
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning prospector for new city '+newCityName);

                            let startPoint = new RoomPosition(25, 25, newCityName); // Set startPoint to target room
                            let endPoint = undefined;

                            for (let source in newCityMem.sources) {
                                if (!source.hasHarvester) {
                                    endPoint = Game.getObjectById(source);
                                    break;
                                } else {
                                    continue;
                                }
                            }

                            if (startPoint && endPoint) {
                                if (spawn.canCreateCreep(config.getBodyParts(roomName, 'prospector'), 'prospector' + uniqueId) === OK) {
                                    spawn.createCreep(config.getBodyParts(roomName, 'prospector'), 'prospector' + uniqueId, {
                                        task: {
                                            role: roles.roleProspector.id,
                                            hasResource: false,
                                            startPoint: startPoint,
                                            endPoint: endPoint
                                        }
                                    });
                                    break;
                                }
                            }
                        } else if (newCityBuildNext === 'roomBooster') {
                            // Spawn room booster if claim requires it
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning roomBooster for new city '+newCityName);

                            let startPoint = new RoomPosition(25, 25, roomName);
                            let endPoint = undefined;

                            for (let source in newCityMem.sources) {
                                if (!source.hasHarvester) {
                                    endPoint = Game.getObjectById(source);
                                    break;
                                } else {
                                    continue;
                                }
                            }

                            if (startPoint && endPoint) {
                                if (spawn.canCreateCreep(config.getBodyParts(roomName, 'roomBooster'), 'roomBooster' + uniqueId) === OK) {
                                    spawn.createCreep(config.getBodyParts(roomName, 'roomBooster'), 'roomBooster' + uniqueId, {
                                        task: {
                                            role: 'roomBooster',
                                            hasResource: false,
                                            startPoint: startPoint,
                                            endPoint: endPoint
                                        }
                                    });
                                    break;
                                }
                            }
                        } else if (newCityBuildNext === 'interRoomTransport') {
                            // Spawn interRoomTransport if claim requires it
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning interRoomTransport');

                            let startPoint = new RoomPosition(25, 25, roomName); // homeRoom - pickup energy
                            let endPoint = new RoomPosition(25, 25, newCityName); // endRoom - deliver energy

                            if (spawn.canCreateCreep(config.getBodyParts(roomName, 'interRoomTransport'), 'interRoomTransport' + uniqueId) === OK) {
                                spawn.createCreep(config.getBodyParts(roomName, 'interRoomTransport'), 'interRoomTransport' + uniqueId, {
                                    task: {
                                        role: 'interRoomTransport',
                                        hasResource: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                break;
                            }
                        }
                    }
                }
            } else if (buildNext === 'district') {

                for (let districtName in cityMem.districts) {
                    let districtMem = cityMem.districts[districtName];
                    let districtBuildNext = configSpawn.buildMineNext(districtName);

                    if (districtBuildNext) {
                        if (districtBuildNext === 'reserver') {
                            // Spawn Reserver
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Reserver');

                            startPoint = new RoomPosition(25, 25, roomName);
                            endPoint = new RoomPosition(25, 25, districtName);

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'reserver'), 'reserver' + uniqueId) === OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'reserver'), 'reserver' + uniqueId, {
                                    task: {
                                        role: 'reserver',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }

                        } else if (districtBuildNext === 'prospector') {
                            // Spawn Prospector
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Prospector');

                            startPoint = new RoomPosition(25, 25, districtName);

                            // Set endPoint to source
                            for (let source in districtMem.sources) {
                                if (!source.hasHarvester) {
                                    endPoint = Game.getObjectById(source);
                                    break;
                                } else {
                                    continue;
                                }
                            }

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'prospector'), 'prospector' + uniqueId) === OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'prospector'), 'prospector' + uniqueId, {
                                    task: {
                                        role: 'prospector',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }


                        } else if (districtBuildNext === 'collector') {
                            // Spawn Collector
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Collector');

                            startPoint = new RoomPosition(25, 25, districtName);
                            endPoint = new RoomPosition(25, 25, roomName);

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'collector'), 'collector' + uniqueId) === OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'collector'), 'collector' + uniqueId, {
                                    task: {
                                        role: 'collector',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }

                        }
                    } else {
                        continue;
                    }

                }
            }
        }
    }
}