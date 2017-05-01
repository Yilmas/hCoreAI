brain.creepSpawner = function () {

    //start spawning
    for (let roomName in Game.rooms) {

        if (Memory.claimList[roomName] === undefined) continue;
        if (Memory.claimList[roomName].roomType === 'Mine') continue;

        let spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS, { filter: (s) => !s.spawning })[0];
        let roles = Game.rooms[roomName].memory.roles;
        let operationSize = config.operationSize(roomName);

        if (!spawn) continue;

        // Check spawn sequence - if spawn is not spawning a creep
        if (!spawn.spawning) {
            let uniqueNameID = Math.floor((Math.random() * 1000) + 1);

            let controllerContainer = undefined;

            if (spawn.room.controller.level >= 3 && spawn.room.controller.level <= 5) {
                controllerContainer = spawn.room.controller.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
            }

            let containers = spawn.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }, 3); // Used while there is no storage
            let link = undefined;
            if (spawn.room.storage) {
                link = spawn.room.storage.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_LINK }, 3);
            }


            let mineral = undefined;
            let mineralContainer = undefined;

            if (spawn.room.controller.level >= 6 && spawn.room.name !== 'E27S81' && spawn.room.name !== 'E28S86') {
                let extractor = spawn.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR });
                mineral = extractor[0].pos.findClosestByRange(FIND_MINERALS);
                mineralContainer = mineral.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });
            }

            let sourceHasLinks = false;

            for (let source of spawn.room.find(FIND_SOURCES)) {
                let sourceLink = source.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
                if (sourceLink) {
                    sourceHasLinks = true;
                }
            }

            let scoutRoom = _.filter(Memory.scouts, (s) => s.parentRoom === roomName && !s.isScouted)[0];

            if (roles.roleHarvester.amountOfHarvesters < roles.roleHarvester.operation[operationSize].minimumOfHarvesters) {
                // Spawn harvester
                config.log(3, 'debug scope: Room: ' + roomName + ' harvester');

                let startPoint; // set startPoint to source
                let endPoint = undefined;

                let source = _.filter(Memory.rooms[roomName].sources, (s) => s.openSpots > 0);

                if (source[0].openSpots > 0) {
                    startPoint = Game.getObjectById(source[0].source);
                }

                if (!startPoint) {
                    continue;
                }

                if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleHarvester.id), roles.roleHarvester.id + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, roles.roleHarvester.id), roles.roleHarvester.id + uniqueNameID, {
                        name: roles.roleHarvester.id + uniqueNameID,
                        task: {
                            role: roles.roleHarvester.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }

            } else if (roles.roleDistributor.amountOfDistributors < 2 && containers) {
                // Spawn distributor
                config.log(3, 'debug scope: Room: ' + roomName + ' distributor');

                let startPoint = undefined;
                let endPoint = undefined;

                if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleDistributor.id), roles.roleDistributor.id + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, roles.roleDistributor.id), roles.roleDistributor.id + uniqueNameID, {
                        task: {
                            role: roles.roleDistributor.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }

            } else if (roles.roleBuilder.amountOfBuilders < 1) {
                // Spawn builder
                config.log(3, 'debug scope: Room: ' + roomName + ' builder');

                if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleBuilder.id), roles.roleBuilder.id + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, roles.roleBuilder.id), roles.roleBuilder.id + uniqueNameID, {
                        task: {
                            role: roles.roleBuilder.id,
                            hasResource: false,
                            startPoint: undefined,
                            endPoint: undefined
                        }
                    });
                    break;
                }

            } else if (roles.roleUpgrader.amountOfUpgraders < roles.roleUpgrader.operation[operationSize].minimumOfUpgraders) {
                // Spawn upgrader
                config.log(3, 'debug scope: Room: ' + roomName + ' upgrader');

                let startPoint = undefined; // Set startPoint to either a null, container, storage or link
                let endPoint = undefined;
                let controller = spawn.room.controller;

                // Defined startpoint by what should exist at a given controller level
                if (controller.level >= 3 && controller.level <= 5) {
                    // Use container > storage > link
                    let link = controller.pos.findInRange(FIND_MY_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_LINK });
                    let storage = spawn.room.storage;
                    let container = controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });


                    if (!isNullOrUndefined(storage)) {
                        startPoint = storage;
                    }
                    if (!isNullOrUndefined(container)) {
                        startPoint = container;
                    }
                    if (!isNullOrUndefined(link)) {
                        startPoint = link;
                    }

                } else if (spawn.room.controller.level >= 6) {
                    // Use link
                    startPoint = controller.pos.findInRange(FIND_MY_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_LINK });
                }

                if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleUpgrader.id), roles.roleUpgrader.id + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, roles.roleUpgrader.id), roles.roleUpgrader.id + uniqueNameID, {
                        task: {
                            role: roles.roleUpgrader.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            } else if (roles.roleCarrier.amountOfCarriers < roles.roleCarrier.operation[operationSize].minimumOfCarriers && spawn.room.storage && containers && !sourceHasLinks) {
                // Spawn carrier
                config.log(3, 'debug scope: Room: ' + roomName + ' carrier');

                let startPoint; // set startPoint to container
                let endPoint = undefined;
                let sourceId;

                for (let id in Memory.rooms[roomName].sources) {
                    if (Memory.rooms[roomName].sources[id].carriers === 0) {
                        sourceId = id;
                    } else {
                        continue;
                    }
                }

                if (sourceId) {
                    startPoint = Game.getObjectById(sourceId).pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
                }

                if (startPoint) {
                    if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleCarrier.id), roles.roleCarrier.id + uniqueNameID) === OK) {
                        spawn.createCreep(config.getBodyParts(roomName, roles.roleCarrier.id), roles.roleCarrier.id + uniqueNameID, {
                            task: {
                                role: roles.roleCarrier.id,
                                hasResource: false,
                                startPoint: startPoint,
                                endPoint: endPoint
                            }
                        });
                        break;
                    }
                }

            } else if (roles.roleBridge.amountOfBridges < 1 && spawn.room.storage && (link || controllerContainer)) {
                // Spawn bridge
                config.log(3, 'debug scope: Room: ' + roomName + ' bridge');

                let startPoint = undefined;
                let endPoint = undefined;

                if (!isNullOrUndefined(controllerContainer)) {
                    // Set endpoint to the controllers container
                    endPoint = controllerContainer;
                }
                if (!isNullOrUndefined(link)) {
                    // Set endpoint to the link
                    endPoint = startPoint.pos.findInRange(FIND_MY_STRUCTURES, 5, { filter: (s) => s.structureType === STRUCTURE_LINK });
                }

                if (endPoint) {
                    if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleBridge.id), roles.roleBridge.id + uniqueNameID) === OK) {
                        spawn.createCreep(config.getBodyParts(roomName, roles.roleBridge.id), roles.roleBridge.id + uniqueNameID, {
                            task: {
                                role: roles.roleBridge.id,
                                hasResource: false,
                                startPoint: startPoint,
                                endPoint: endPoint
                            }
                        });
                        break;
                    }
                }
            }
            else if (!isNullOrUndefined(mineral) && mineral.mineralAmount > 0 && roles.roleMiner.amountOfMiners < 1) {
                // Spawn miner
                config.log(3, 'debug scope: Room: ' + roomName + ' miner');

                let startPoint = mineral; // set startPoint to the mineral
                let endPoint = mineral.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER }); // Set endPoint to nearby container

                if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleMiner.id), roles.roleMiner.id + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, roles.roleMiner.id), roles.roleMiner.id + uniqueNameID, {
                        task: {
                            role: roles.roleMiner.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }

            }
            else if (!isNullOrUndefined(mineralContainer) && _.sum(mineralContainer.store) > 1800 && roles.roleMiner.amountOfMiners > _.sum(Game.creeps, (c) => c.room.name === roomName && c.memory.task.role === 'mineralCollector')) {
                // Spawn mineral collector
                config.log(3, 'debug scope: Room: ' + roomName + ' mineralCollector');

                let startPoint = mineralContainer; // Set startPoint to nearby container
                let endPoint = undefined; // set endPoint to the storage

                if (spawn.canCreateCreep(config.getBodyParts(roomName, 'mineralCollector'), 'mineralCollector' + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, 'mineralCollector'), 'mineralCollector' + uniqueNameID, {
                        task: {
                            role: 'mineralCollector',
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }

            }
            else if ((spawn.room.memory.reactions && spawn.room.memory.reactions['UO']) && _.sum(Game.creeps, (c) => c.room.name === roomName && c.memory.task.role === 'laborant') < 1) {
                // Spawn Laborant
                config.log(3, 'debug scope: Room: ' + roomName + ' laborant');

                let startPoint = undefined;
                let endPoint = undefined;

                if (spawn.canCreateCreep(config.getBodyParts(roomName, 'laborant'), 'laborant' + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, 'laborant'), 'laborant' + uniqueNameID, {
                        task: {
                            role: 'laborant',
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            }
            else if (false && _.sum(Game.creeps, (c) => c.memory.task.startPoint.room != undefined && c.memory.task.startPoint.room.name === roomName && c.memory.task.role == 'pillager') < 1) {
                // Spawn Pillager
                config.log(3, 'debug scope: Room: ' + roomName + ' pillager');

                let startPoint = spawn.room.storage; // Needed, do not remove this!!!
                let endPoint = undefined;

                //if (roomName == 'E27S83') {
                //    endPoint = new RoomPosition(25, 25, 'E27S81');
                //}

                if (endPoint) {
                    if (spawn.canCreateCreep(config.getBodyParts(roomName, 'pillager'), 'pillager' + uniqueNameID) === OK) {
                        spawn.createCreep(config.getBodyParts(roomName, 'pillager'), 'pillager' + uniqueNameID, {
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
            }
            else if (scoutRoom && _.sum(Game.creeps, (c) => c.memory.task.role === 'scout' && c.memory.task.endPoint.roomName === scoutRoom.targetRoom) < 1) {
                // Spawn Scout Creep
                config.log(3, 'debug scope: Room: ' + roomName + ' scout');

                let startPoint = undefined;
                let endPoint = new RoomPosition(25, 25, scoutRoom.targetRoom);

                if (spawn.canCreateCreep([MOVE], 'scout' + uniqueNameID) === OK) {
                    spawn.createCreep([MOVE], 'scout' + uniqueNameID, {
                        task: {
                            role: 'scout',
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            }
            else if (false && _.sum(Game.creeps, (c) => c.memory.task.role === 'specialCreep') < 1) {
                // Spawn Special Creep
                config.log(3, 'debug scope: Room: ' + roomName + ' specialCreep');

                let startPoint = undefined;
                let endPoint = undefined;

                if (spawn.canCreateCreep(config.getBodyParts(roomName, roles.roleCollector.id), 'specialCreep' + uniqueNameID) === OK) {
                    spawn.createCreep(config.getBodyParts(roomName, roles.roleCollector.id), 'specialCreep' + uniqueNameID, {
                        name: 'specialCreep' + uniqueNameID,
                        task: {
                            role: 'specialCreep',
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
}