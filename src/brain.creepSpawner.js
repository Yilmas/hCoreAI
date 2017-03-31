brain.creepSpawner = function () {

    //start spawning
    for (let roomName in Game.rooms) {

        if (Memory.claimList[roomName] == undefined) continue;
        if (Memory.claimList[roomName].roomType == 'Mine') continue;

        let spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS, { filter: (s) => !s.spawning })[0];
        let roles = Game.rooms[roomName].memory.roles;
        let operationSize = config.operationSize(roomName);

        if (!spawn) continue;

        // Check spawn sequence - if spawn is not spawning a creep
        if (!spawn.spawning) {
            let uniqueNameID = Math.floor((Math.random() * 1000) + 1);

            let controllerContainer = undefined;

            if (spawn.room.controller.level >= 3 && spawn.room.controller.level <= 5) {
                controllerContainer = spawn.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 3);
            }

            let containers = spawn.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 3); // Used while there is no storage
            let link = undefined;
            if (spawn.room.storage) {
                link = spawn.room.storage.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK }, 3);
            }


            let mineral = undefined;
            let mineralContainer = undefined;

            if (spawn.room.controller.level >= 6) {
                let extractor = spawn.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTRACTOR });
                mineral = extractor[0].pos.findClosestByRange(FIND_MINERALS);
                mineralContainer = mineral.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
            }



            if (roles.roleHarvester.amountOfHarvesters < roles.roleHarvester.operation[operationSize].minimumOfHarvesters) {
                // Spawn harvester
                config.log(3, 'debug scope: Room: ' + roomName + ' harvester');

                let startPoint; // set startPoint to source

                let source = _.filter(Memory.rooms[roomName].sources, (s) => s.openSpots > 0);

                if (source[0].openSpots > 0) {
                    startPoint = Game.getObjectById(source[0].source);
                }

                if (!startPoint) {
                    continue;
                }

                let endPoint = startPoint.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                }); // Set endPoint to container

                if (spawn.canCreateCreep(roles.roleHarvester.operation[operationSize].bodyParts, roles.roleHarvester.id + uniqueNameID) == OK) {
                    spawn.createCreep(roles.roleHarvester.operation[operationSize].bodyParts, roles.roleHarvester.id + uniqueNameID, {
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

            } else if (roles.roleDistributor.amountOfDistributors < roles.roleDistributor.operation[operationSize].minimumOfDistributors && containers) {
                // Spawn distributor
                config.log(3, 'debug scope: Room: ' + roomName + ' distributor');

                let startPoint = spawn.room.storage; // Set startPoint to the storage

                let endPoint = spawn; // set endPoint to spawn!/extensions/towers

                if (spawn.canCreateCreep(roles.roleDistributor.operation[operationSize].bodyParts, roles.roleDistributor.id + uniqueNameID) == OK) {
                    spawn.createCreep(roles.roleDistributor.operation[operationSize].bodyParts, roles.roleDistributor.id + uniqueNameID, {
                        task: {
                            role: roles.roleDistributor.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                } else if (spawn.canCreateCreep(roles.roleDistributor.operation['small'].bodyParts, roles.roleDistributor.id + uniqueNameID) == ERR_NOT_ENOUGH_ENERGY && roles.roleDistributor.amountOfDistributors == 0) {
                    spawn.createCreep(roles.roleDistributor.operation['small'].bodyParts, roles.roleDistributor.id + uniqueNameID, {
                        task: {
                            role: roles.roleDistributor.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }

            } else if (roles.roleBuilder.amountOfBuilders < roles.roleBuilder.operation[operationSize].minimumOfBuilders) {
                // Spawn builder
                config.log(3, 'debug scope: Room: ' + roomName + ' builder');

                let startPoint = spawn.room.storage; // Set startPoint to the storage
                let endPoint; // not used!!!

                if (spawn.canCreateCreep(roles.roleBuilder.operation[operationSize].bodyParts, roles.roleBuilder.id + uniqueNameID) == OK) {
                    spawn.createCreep(roles.roleBuilder.operation[operationSize].bodyParts, roles.roleBuilder.id + uniqueNameID, {
                        task: {
                            role: roles.roleBuilder.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }

            } else if (roles.roleUpgrader.amountOfUpgraders < roles.roleUpgrader.operation[operationSize].minimumOfUpgraders) {
                // Spawn upgrader
                config.log(3, 'debug scope: Room: ' + roomName + ' upgrader');

                let startPoint = undefined; // Set startPoint to either a null, container, storage or link

                // Defined startpoint by what should exist at a given controller level
                if (spawn.room.controller.level >= 3 && spawn.room.controller.level <= 5) {
                    // Use container > storage > link
                    let link = spawn.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK }, 3);
                    let storage = spawn.room.storage;
                    let container = spawn.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }, 5);


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
                    startPoint = spawn.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK }, 3);
                }

                let endPoint = spawn.room.controller; // Set endPoint to the controller

                if (spawn.canCreateCreep(roles.roleUpgrader.operation[operationSize].bodyParts, roles.roleUpgrader.id + uniqueNameID) == OK) {
                    spawn.createCreep(roles.roleUpgrader.operation[operationSize].bodyParts, roles.roleUpgrader.id + uniqueNameID, {
                        task: {
                            role: roles.roleUpgrader.id,
                            hasResource: false,
                            startPoint: startPoint,
                            endPoint: endPoint
                        }
                    });
                    break;
                }
            } else if (roles.roleCarrier.amountOfCarriers < roles.roleCarrier.operation[operationSize].minimumOfCarriers && spawn.room.storage && containers) {
                // Spawn carrier
                config.log(3, 'debug scope: Room: ' + roomName + ' carrier');

                let startPoint; // set startPoint to container
                let sourceId;

                for (let id in Memory.rooms[roomName].sources) {
                    if (Memory.rooms[roomName].sources[id].carriers == 0) {
                        sourceId = id;
                    } else {
                        continue;
                    }
                }

                if (sourceId) {
                    startPoint = Game.getObjectById(sourceId).pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
                }

                let endPoint; // Set endPoint to the storage > container

                if (spawn.room.storage) {
                    endPoint = spawn.room.storage;
                } else {
                    // TODO, is this working ?
                    let containerNearSpawn = spawn.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
                    endPoint = containerNearSpawn;
                }

                if (startPoint && endPoint) {
                    if (spawn.canCreateCreep(roles.roleCarrier.operation[operationSize].bodyParts, roles.roleCarrier.id + uniqueNameID) == OK) {
                        spawn.createCreep(roles.roleCarrier.operation[operationSize].bodyParts, roles.roleCarrier.id + uniqueNameID, {
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

            } else if (roles.roleBridge.amountOfBridges < roles.roleBridge.operation[operationSize].minimumOfBridges && (spawn.room.storage) && (link || controllerContainer)) {
                // Spawn bridge
                config.log(3, 'debug scope: Room: ' + roomName + ' bridge');

                let containerBodyPart = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]; //900
                let linkBodyPart = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; //600

                let startPoint = spawn.room.storage; // set startPoint to storage
                let endPoint = undefined;

                if (!isNullOrUndefined(controllerContainer)) {
                    // Set endpoint to the controllers container
                    endPoint = controllerContainer;
                }
                if (!isNullOrUndefined(link)) {
                    // Set endpoint to the link
                    endPoint = startPoint.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });
                }

                if (endPoint) {
                    if (spawn.canCreateCreep((!isNullOrUndefined(link) ? linkBodyPart : containerBodyPart), roles.roleBridge.id + uniqueNameID) == OK) {
                        spawn.createCreep((!isNullOrUndefined(link) ? linkBodyPart: containerBodyPart), roles.roleBridge.id +uniqueNameID, {
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
            else if (!isNullOrUndefined(mineral) && mineral.mineralAmount > 0 && roles.roleMiner.amountOfMiners < roles.roleMiner.operation[operationSize].minimumOfMiners) {
                // Spawn miner
                config.log(3, 'debug scope: Room: ' + roomName + ' miner');

                let startPoint = mineral; // set startPoint to the mineral
                let endPoint = mineral.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER }); // Set endPoint to nearby container

                if (spawn.canCreateCreep(roles.roleMiner.operation[operationSize].bodyParts, roles.roleMiner.id + uniqueNameID) == OK) {
                    spawn.createCreep(roles.roleMiner.operation[operationSize].bodyParts, roles.roleMiner.id + uniqueNameID, {
                        name: roles.roleMiner.id + uniqueNameID,
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
            else if (!isNullOrUndefined(mineralContainer) && _.sum(mineralContainer.store) > 1800 && roles.roleMiner.amountOfMiners > _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'mineralCollector')) {
                // Spawn mineral collector
                config.log(3, 'debug scope: Room: ' + roomName + ' mineralCollector');

                let startPoint = mineralContainer; // Set startPoint to nearby container
                let endPoint = spawn.room.storage; // set endPoint to the storage

                if (spawn.canCreateCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'mineralCollector' + uniqueNameID) == OK) {
                    spawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'mineralCollector' + uniqueNameID, {
                        name: 'mineralCollector' + uniqueNameID,
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
        }
    }
}