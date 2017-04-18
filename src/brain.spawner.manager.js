brain.spawner.manager = () => {
    let configSpawn = brain.spawner.config;

    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        if (Memory.rooms[roomName] == undefined || Memory.rooms[roomName].type === 'Mine') continue;

        for (let spawn in room.find(FIND_MY_SPAWNS, { filter: (s) => !s.spawning })) {

            let uniqueId = Math.floor((Math.random() * 1000) + 1);
            let startPoint = undefined;
            let endPoint = undefined;
            
            let buildNext = configSpawn.buildNext(roomName);

            // Base
            if (buildNext == 'harvester') {
                // Spawn Harvester
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Harvester');

                // Set startPoint to source
                let source = _.filter(Memory.rooms[roomName].sources, (s) => s.openSpots > 0);
                if (source[0].openSpots > 0) {
                    startPoint = Game.getObjectById(source[0].id);

                    if (startPoint == undefined) {
                        continue;
                    }
                }

                // Set endPoint to container
                endPoint = startPoint.pos.findInRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 3)[0];

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'harvester'), 'harvester' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'harvester'), 'harvester' + uniqueId, {
                        name: 'harvester' + uniqueId,
                        task: {
                            role: 'harvester',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'distributor') {
                // Spawn Distributor
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Distributor');

                startPoint = spawn.room.storage;
                endPoint = spawn;

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'distributor'), 'distributor' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'distributor'), 'distributor' + uniqueId, {
                        name: 'distributor' + uniqueId,
                        task: {
                            role: 'distributor',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'carrier') {
                // Spawn Carrier
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Carrier');

                // Set startPoint to Container
                for (let id in Memory.rooms[roomName].sources) {
                    if (Memory.rooms[roomName].sources[id].carriers == 0) {
                        startPoint = Game.getObjectById(id).pos.findInRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 3);
                        break;
                    } else {
                        continue;
                    }
                }

                // Set endPoint to Storage
                endPoint = spawn.room.storage;

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'carrier'), 'carrier' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'carrier'), 'carrier' + uniqueId, {
                        name: 'carrier' + uniqueId,
                        task: {
                            role: 'carrier',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'builder') {
                // Spawn Builder
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Builder');

                startPoint = spawn.room.storage;

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'builder'), 'builder' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'builder'), 'builder' + uniqueId, {
                        name: 'builder' + uniqueId,
                        task: {
                            role: 'builder',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'upgrader') {
                // Spawn Upgrader
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Upgrader');

                // Set startPoint to Link > Container > Storage
                if (spawn.room.controller.level >= 3 && spawn.room.controller.level <= 5) {
                    let link = spawn.room.controller.pos.findInRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK }, 5)[0];
                    let container = spawn.room.controller.pos.findInRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 5)[0];

                    if (!isNullOrUndefined(spawn.room.storage)) {
                        startPoint = storage;
                    }
                    if (!isNullOrUndefined(container)) {
                        startPoint = container;
                    }
                    if (!isNullOrUndefined(link)) {
                        startPoint = link;
                    }
                } else if (spawn.room.controller.level >= 6) {
                    startPoint = spawn.room.controller.pos.findInRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK }, 5)[0];
                }

                // Set endPoint to Controller
                endPoint = spawn.room.controller;

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'upgrader'), 'upgrader' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'upgrader'), 'upgrader' + uniqueId, {
                        name: 'upgrader' + uniqueId,
                        task: {
                            role: 'upgrader',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'bridge') {
                // Spawn Bridge
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Bridge');

                let containerBody = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]; //900

                // Set startPoint to Storage
                startPoint = spawn.room.storage;

                // Set endPoint to Link > Container
                let storageLink = startPoint.findInRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK }, 5)[0];
                if (storageLink != undefined) {
                    endPoint = storageLink;
                } else {
                    endPoint = spawn.room.controller.pos.findInRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 5);
                    if(endPoint == undefined) continue;
                }

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'bridge'), 'bridge' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'bridge'), 'bridge' + uniqueId, {
                        name: 'bridge' + uniqueId,
                        task: {
                            role: 'bridge',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'mineralHarvester') {
                // Spawn MineralHarvester
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning MineralHarvester');

                // Set startPoint to Mineral Deposit
                let extractor = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTRACTOR });
                if (spawn.room.controller.level >= 6 && !isNullOrUndefined(extractor)) {
                    startPoint = extractor[0].pos.findInRange(FIND_MINERALS, 1)[0];
                }

                // Set endPoint to Container
                endPoint = startPoint.pos.findInRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 3)[0];

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'mineralHarvester'), 'mineralHarvester' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'mineralHarvester'), 'mineralHarvester' + uniqueId, {
                        name: 'mineralHarvester' + uniqueId,
                        task: {
                            role: 'mineralHarvester',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }

            } else if (buildNext == 'mineralCollector') {
                // Spawn MineralCollector
                config.log(3, '[DEBUG] Room: ' + roomName + ' spawning MineralCollector');

                // Set startPoint to Mineral Container
                let extractor = spawn.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTRACTOR });
                if (!isNullOrUndefined(extractor)) {
                    startPoint = extractor[0].pos.findInRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER })[0];
                }
                
                // Set endPoint to Storage
                endPoint = spawn.room.storage;

                if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'mineralCollector'), 'mineralCollector' + uniqueId) == OK) {
                    spawn.createCreep(configSpawn.getBodyParts(roomName, 'mineralCollector'), 'mineralCollector' + uniqueId, {
                        name: 'mineralCollector' + uniqueId,
                        task: {
                            role: 'mineralCollector',
                            hasResources: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    continue;
                }
            }

            if (buildNext == 'mine') {

                Memory.rooms['asd'].mines = {};

                for (let mine in spawn.room.memory.mines) {
                    let mineNext = configSpawn.buildMineNext(mine);

                    if (!isNullOrUndefined(mineNext)) {
                        if (mineNext == 'reserver') {
                            // Spawn Reserver
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Reserver');

                            startPoint = new RoomPosition(25, 25, roomName);
                            endPoint = new RoomPosition(25, 25, mine);

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'reserver'), 'reserver' + uniqueId) == OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'reserver'), 'reserver' + uniqueId, {
                                    name: 'reserver' + uniqueId,
                                    task: {
                                        role: 'reserver',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }

                        } else if (mineNext == 'prospector') {
                            // Spawn Prospector
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Prospector');

                            startPoint = new RoomPosition(25, 25, mine);

                            // Set endPoint to source
                            let source = _.filter(Memory.rooms[roomName].sources, (s) => s.openSpots > 0);
                            if (source[0].openSpots > 0) {
                                endPoint = Game.getObjectById(source[0].id);

                                if (endPoint == undefined) {
                                    continue;
                                }
                            }

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'prospector'), 'prospector' + uniqueId) == OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'prospector'), 'prospector' + uniqueId, {
                                    name: 'prospector' + uniqueId,
                                    task: {
                                        role: 'prospector',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }


                        } else if (mineNext == 'collector') {
                            // Spawn Collector
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Collector');

                            startPoint = new RoomPosition(25, 25, mine);
                            endPoint = new RoomPosition(25, 25, roomName);

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'collector'), 'collector' + uniqueId) == OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'collector'), 'collector' + uniqueId, {
                                    name: 'collector' + uniqueId,
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

            // Outpost
            if (buildNext == 'outpost') {

                for (let outpost in _.filter(Memory.claimList, (c) => c.parentRoom == roomName)) {
                    let outpostNext = configSpawn.buildOutpostNext(outpost);

                    if (!isNullOrUndefined(outpostNext)) {

                        if (buildNext == 'claimer') {
                            // Spawn Claimer
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning Claimer');

                            startPoint = new RoomPosition(25, 25, roomName);
                            endPoint = new RoomPosition(25, 25, outpost);

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'claimer'), 'claimer' + uniqueId) == OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'claimer'), 'claimer' + uniqueId, {
                                    name: 'claimer' + uniqueId,
                                    task: {
                                        role: 'claimer',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }

                        } else if (buildNext == 'offSiteBuilder') {
                            // Spawn OffSiteBuilder
                            config.log(3, '[DEBUG] Room: ' + roomName + ' spawning OffSiteBuilder');

                            startPoint = new RoomPosition(25, 25, outpost);

                            // Set endPoint to source
                            let source = _.filter(Memory.rooms[roomName].sources, (s) => s.openSpots > 0);
                            if (source[0].openSpots > 0) {
                                endPoint = Game.getObjectById(source[0].id);

                                if (endPoint == undefined) {
                                    continue;
                                }
                            }

                            if (spawn.canCreateCreep(configSpawn.getBodyParts(roomName, 'prospector'), 'offSiteBuilder' + uniqueId) == OK) {
                                spawn.createCreep(configSpawn.getBodyParts(roomName, 'prospector'), 'offSiteBuilder' + uniqueId, {
                                    name: 'offSiteBuilder' + uniqueId,
                                    task: {
                                        role: 'offSiteBuilder',
                                        hasResources: false,
                                        startPoint: startPoint,
                                        endPoint: endPoint
                                    }
                                });
                                continue;
                            }

                        }
                    }
                }
            }
        }
    }
}