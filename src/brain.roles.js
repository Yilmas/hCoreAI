brain.roles = {};

brain.roles.manager = function () {
    let roles = brain.roles;

    for (let creepMem in Memory.creeps) {
        if (!Game.creeps[creepMem]) {
            //Decommision unused creeps
            delete Memory.creeps[creepMem];
            config.log(2, '<font color=grey>[Memory] Clearing non-existing creep memory: ' + creepMem + '</font>');
        } else if (!Game.creeps[creepMem].memory.task) {
            Game.creeps[creepMem].suicide();
            config.log(2, '<font color=red>[Memory] Clearing creep: ' + creepMem + ' with non-existing memory</font>');
        } else {

            let creep = Game.creeps[creepMem];
            let task = creep.memory.task;

            if (task.hasResource && _.sum(creep.carry) === 0) {
                task.hasResource = false;
            }
            if (!task.hasResource && _.sum(creep.carry) === creep.carryCapacity) {
                task.hasResource = true;
            }

            try {
                if (task.role === 'harvester') roles.roleHarvester(creep, task);
                if (task.role === 'carrier') roles.roleCarrier(creep, task);
                if (task.role === 'distributor') roles.roleDistributor(creep, task);
                if (task.role === 'upgrader') roles.roleUpgrader(creep, task);
                if (task.role === 'builder') roles.roleBuilder(creep, task);
                if (task.role === 'bridge') roles.roleBridge(creep, task);
                if (task.role === 'wallBuilder') roles.roleWallBuilder(creep, task);
                if (task.role === 'miner') roles.roleMiner(creep, task);
                if (task.role === 'mineralCollector') roles.roleMineralCollector(creep, task);
                if (task.role === 'pillager') roles.rolePillager(creep, task);
                if (task.role === 'prospector') roles.roleProspector(creep, task);
                if (task.role === 'collector') roles.roleCollector(creep, task);
                if (task.role === 'claimer') roles.roleClaimer(creep, task);
                if (task.role === 'reserver') roles.roleReserver(creep, task);
                if (task.role === 'interCityBoost') roles.roleInterCityBoost(creep, task);
                if (task.role === 'interCityTransport') roles.roleInterCityTransport(creep, task);
                if (task.role === 'scout') roles.roleScout(creep, task);
                if (task.role === 'attacker') roles.roleAttacker(creep, task);
                if (task.role === 'defender') roles.roleDefender(creep, task);
                if (task.role === 'cityDefender') roles.roleCityDefender(creep, task);
                if (task.role === 'specialCreep') roles.roleSpecialCreep(creep, task);
            }
            catch (ex) {
                console.log('<font color=red>[Error]</font> <font color=yellow> [Role Manager] Creep: </font><font color=red>' + creepMem + '</font><font color=red> Error: ' + ex.stack + '</font>');
            }
        }
    }
}

/*************************/
/******* HARVESTER *******/
/*************************/

brain.roles.roleHarvester = (creep, task) => {
    let roomRoles = Memory.empire.cities[creep.room.name].roles;
    let sourceObject = Game.getObjectById(task.startPoint);

    if (task.hasResource) {
        if (roomRoles.roleDistributor.count === 0) {
            // If no distributors exists, start filling spawn and extensions, so that we may spawn a new distributor --- This is a failsafe
            if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) =>
                        (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                        (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
                });

                if (spawnOrExtension) {
                    if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawnOrExtension);
                    }
                }
            } else if ((constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))) {
                if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else if ((container = sourceObject.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0]) !== undefined) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            // Distributors exists, start filling container

            if ((sourceLink = sourceObject.pos.findInRange(FIND_MY_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_LINK })[0]) !== undefined) {
                if (!creep.room.storage && sourceLink.energy === 800) {
                    // War torn room, engage auto failsafe
                    let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) =>
                            (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                            (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
                    });

                    if (spawnOrExtension) {
                        if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawnOrExtension);
                        }
                    } else if ((constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))) {
                        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(constructionSite);
                        }
                    }
                } else {
                    if (creep.transfer(sourceLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sourceLink);
                    }
                }
            } else if ((container = sourceObject.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0]) !== undefined) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                } else if (container.store.energy === 2000) {
                    creep.drop(RESOURCE_ENERGY);
                }
            } else if ((constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))) {
                if (constructionSite) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                }
            }
        }
    } else if (!task.hasResource) {
        if (roomRoles.roleDistributor.count > 0 && Game.time % 4 === 0) {
            let target = creep.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_LINK || s.structureType === STRUCTURE_CONTAINER })[0];
            if (target) {
                creep.transfer(target, RESOURCE_ENERGY);
            }
        }

        if (creep.harvest(sourceObject) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceObject, { reusePath: 20 });
        }
    }
}

/***********************/
/******* CARRIER *******/
/***********************/

brain.roles.roleCarrier = (creep, task) => {

    if ((task.homeCity) && creep.room.name !== task.homeCity) {
        creep.moveTo(new RoomPosition(25, 25, task.homeCity));
    }
    else {
        let roomRoles = Memory.empire.cities[creep.room.name].roles;

        if (task.hasResource) {
            if (roomRoles.roleDistributor.count === 0) {
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
                        {
                            filter: (s) =>
                                (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                                (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
                        });

                    if (spawnOrExtension) {
                        if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawnOrExtension);
                        }
                    }
                }
            } else if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { reusePath: 10 });
                }
            } else if (!creep.room.storage) {
                brain.roles.roleDistributor(creep, task);
            }
        } else if (!task.hasResource) {
            let container = Game.getObjectById(task.startPoint.id);
            if (container) {
                let droppedEnergy = container.pos.findInRange(FIND_DROPPED_RESOURCES, 1, { filter: (e) => e.resourceType === RESOURCE_ENERGY });
                if (droppedEnergy.length) {
                    if (creep.pickup(droppedEnergy[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy[0]);
                    }
                } else {
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { reusePath: 10 });
                    }
                }
            }
        }
    }
}

/***************************/
/******* DISTRIBUTOR *******/
/***************************/

brain.roles.roleDistributor = (creep, task) => {
    let roomRoles = Memory.empire.cities[creep.room.name].roles;
    let storage = creep.room.storage;

    if (!task.controllerContainerId && creep.room.controller.level < 5) {
        let controllerContainer = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0];
        if (controllerContainer) {
            task.controllerContainerId = controllerContainer.id;
        }
    } else if (task.controllerContainerId && creep.room.controller.level >= 5) {
        // Room now uses links instead of container, delete the allocation.
        delete task.controllerContainerId;
    }

    let controllerContainer = (task.controllerContainerId ? Game.getObjectById(task.controllerContainerId) : undefined);

    if (task.hasResource) {
        if ((hostiles = creep.room.find(FIND_HOSTILE_CREEPS)).length && roomRoles.roleDistributor.count > 0 && false) {
            // focus on refilling towers
            let tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < 900 });
            if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else {
                creep.moveTo(tower);
            }
        } else {
            if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
                    {
                        filter: (s) =>
                            (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                            (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
                    });

                if (spawnOrExtension) {
                    if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawnOrExtension);
                    }
                }
            } else if ((tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < 900 }))) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else if (controllerContainer && controllerContainer.store.energy < 1000) {
                if (creep.transfer(controllerContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controllerContainer);
                }
            } else {
                utils.takeRandomStep(creep);
            }
        }
    } else if (!task.hasResource) {
        if (storage && storage.store.energy > 0) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        } else if (storage && roomRoles.roleBridge.count === 0 && (baseLink = storage.pos.findInRange(FIND_MY_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_LINK && s.energy > 0 })[0]) !== undefined) {
            if (creep.withdraw(baseLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(baseLink);
            }
        } else if ((droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (e) => e.resourceType === RESOURCE_ENERGY && e.amount > creep.carryCapacity }))) {
            if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
        } else if (creep.room.terminal && creep.room.terminal.store.energy > 0) {
            if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.terminal);
            }
        } else if (!storage && (carrier = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (s) => s.memory.task.role === 'roleCarrier' && s.carry.energy > 0 }))) {
            if (creep.withdraw(carrier, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(carrier);
            }
        } else if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > 200 && !s.pos.inRangeTo(creep.room.controller.pos, 2) }))) {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        }
    }
}

/************************/
/******* UPGRADER *******/
/************************/

brain.roles.roleUpgrader = (creep, task) => {
    let controller = creep.room.controller;

    if ((task.homeCity) && creep.room.name !== task.homeCity) {
        creep.moveTo(new RoomPosition(25, 25, task.homeCity));
    }
    else {

        if (brain.roles.task.isUpgradeBoostAvailable(creep)) {
            brain.roles.task.boostUpgrader(creep);
        } else {
            if (task.hasResource) {
                if (task.startPoint && Game.time % 3 === 0) {
                    creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY);
                }

                if (controller.sign === undefined || (controller.sign && controller.sign.username !== 'Yilmas')) {
                    if (creep.signController(controller, config.SIGN_MESSAGE) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller);
                    }
                }

                if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            } else if (!task.hasResource) {
                if (task.startPoint) {
                    if (creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(task.startPoint.id));
                    }
                } else {
                    if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > creep.carryCapacity }))) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(container);
                        }
                    } else {
                        let source = creep.pos.findClosestByPath(FIND_SOURCES);
                        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                    }
                }
            }
        }
    }
}

/***********************/
/******* BUILDER *******/
/***********************/

brain.roles.roleBuilder = (creep, task) => {
    let storage = creep.room.storage;
    let terminal = creep.room.terminal;

    brain.roles.task.pickUpEnergy(creep);

    if ((task.homeCity) && creep.room.name !== task.homeCity) {
        creep.moveTo(new RoomPosition(25, 25, task.homeCity));
    }
    else {
        if (task.hasResource) {
            let repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) =>
                    s.hits < s.hitsMax &&
                    s.hits < config.wallOrRampartTargetHitPoints(creep.room.name) &&
                    s.structureType !== STRUCTURE_CONTAINER &&
                    s.structureType !== STRUCTURE_ROAD
            });

            let repairRoadTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) =>
                    s.hits < s.hitsMax &&
                    s.hits < (s.hitsMax === 5000 ? 4500 : 24500) &&
                    s.structureType === STRUCTURE_ROAD
            });

            var testStorage = true;
            if (storage && storage.store.energy < 2000) {
                testStorage = false;
            }

            if ((constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))) {
                if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else if (repairTargets.length || repairRoadTarget) {
                let creepEnergyLevel = creep.carry.energy / creep.carryCapacity * 100;
                let repairWallTarget = _.filter(repairTargets, { 'structureType': STRUCTURE_WALL });
                let repairRampartTarget = _.filter(repairTargets, { 'structureType': STRUCTURE_RAMPART });


                if (repairRoadTarget && false) {
                    if (creep.repair(repairRoadTarget) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairRoadTarget);
                    }
                } else if (repairWallTarget.length) {
                    if (creep.repair(repairWallTarget[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairWallTarget[0]);
                    }
                } else if (repairRampartTarget.length) {
                    if (creep.repair(repairRampartTarget[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairRampartTarget[0]);
                    }
                } else {
                    if (creep.repair(repairRoadTarget) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairRoadTarget);
                    }
                }
            } else if ((repairContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax }))) {
                if (creep.repair(repairContainer) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairContainer);
                }
            } else if (creep.room.controller.level < 4) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                utils.takeRandomStep(creep);
            }
        } else if (!task.hasResource) {
            if (storage && storage.store.energy > creep.room.energyCapacityAvailable) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            } else if (terminal && terminal.store.energy > config.TERMINAL_MINIMUM_ENERGY) {
                if (creep.withdraw(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
            } else if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > creep.carryCapacity * 2 }))) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
}

/**********************/
/******* BRIDGE *******/
/**********************/

brain.roles.roleBridge = (creep, task) => {

    if (creep.carry.energy > 0) {
        task.hasResource = true;
    }

    let roleTasks = brain.roles.task;

    let storage = creep.room.storage; // old startPoint
    let controller = creep.room.controller;
    let terminal = creep.room.terminal;
    let endPoint = Game.getObjectById(task.endPoint.id); // base link
    let terminalEnergyMin = creep.room.storage ? getTerminalEnergyMin(creep.room) : 0;
    let labs = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_LAB && s.energy < s.energyCapacity });

    let sourceHasLinks = false;

    for (let sourceName in Memory.empire.cities[creep.room.name].sources) {
        if (Game.getObjectById(sourceName).pos.findInRange(FIND_MY_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_LINK })[0]) {
            sourceHasLinks = true;
        } else {
            sourceHasLinks = false;
        }
    }

    // TODO: Rename bridgePosition to center ie: city.center = { x: 0, y: 0 }
    let cityMem = Memory.empire.cities[creep.room.name];
    let isCityCenterSet = cityMem.bridgePosition && controller.level >= 5;

    if (isCityCenterSet && !creep.pos.inRangeTo(cityMem.bridgePosition.x, cityMem.bridgePosition.y, 0)) {
        creep.moveTo(cityMem.bridgePosition.x, cityMem.bridgePosition.y);
    } else {
        if (creep.room.controller.level >= 6 && sourceHasLinks) {
            // Stage specifc when sourceHasLinks === true


            if (creep.room.name === 'E2S37' && terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] && Game.getObjectById('599967be6b5740279d20079f').mineralAmount < 450 && !creep.carry.energy) {
                roleTasks.fillLabs(creep, task);
            } else if (roleTasks.requiresFillReaction(creep, task)) {
                roleTasks.fillLabsForReaction(creep, task);
            } else {
                if (task.hasResource) {
                    if (endPoint.energy < 400) {
                        if (creep.transfer(endPoint, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(endPoint);
                        }
                    } else if (terminal && terminal.store.energy < terminalEnergyMin) {
                        if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
                    } else if (labs.length) {
                        if (creep.transfer(labs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(labs[0]);
                        }
                    } else {
                        if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                } else {
                    if (endPoint.energy > 600) {
                        if (creep.withdraw(endPoint, RESOURCE_ENERGY, endPoint.energy - 400) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(endPoint);
                        }
                        if (_.sum(creep.carry) < creep.carryCapacity / 2) task.hasResource = false;
                    } else if (terminal && terminal.store.energy > terminalEnergyMin) {
                        if (creep.withdraw(terminal, RESOURCE_ENERGY, terminal.store.energy - terminalEnergyMin) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        } else if (creep.withdraw(terminal, RESOURCE_ENERGY, terminal.store.energy - terminalEnergyMin) === ERR_FULL) {
                            creep.withdraw(terminal, RESOURCE_ENERGY, creep.carryCapacity);
                        }
                    } else if (storage.store.energy > creep.room.energyCapacityAvailable && ((terminal && terminal.store.energy < terminalEnergyMin) || endPoint.energy < 400)) {
                        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                }
            }

        } else {

            if (roleTasks.requiresFillReaction(creep, task)) {
                roleTasks.fillLabsForReaction(creep, task);
            } else if (task.hasResource) {
                if (endPoint.structureType === STRUCTURE_LINK) {
                    // upgraders use link
                    if (endPoint.energy < endPoint.energyCapacity) {
                        if (creep.transfer(endPoint, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(endPoint);
                        }
                    } else if (terminal && terminal.store.energy < terminalEnergyMin) {
                        if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
                    } else if (terminal && terminal.store.energy > terminalEnergyMin) {
                        if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    } else if (labs.length) {
                        if (creep.transfer(labs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(labs[0]);
                        }
                    } else {
                        if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                } else {
                    if (endPoint.store.energy < 1800) {
                        if (creep.transfer(endPoint, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(endPoint);
                        }
                    }
                }
            } else {
                if (terminal && terminal.store.energy > terminalEnergyMin) {
                    if (creep.withdraw(terminal, RESOURCE_ENERGY, terminal.store.energy - terminalEnergyMin) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    } else if (creep.withdraw(terminal, RESOURCE_ENERGY, terminal.store.energy - terminalEnergyMin) === ERR_FULL) {
                        creep.withdraw(terminal, RESOURCE_ENERGY, creep.carryCapacity);
                    }
                } else {
                    if (storage.store.energy > creep.room.energyCapacityAvailable && ((terminal && terminal.store.energy < terminalEnergyMin) || endPoint.energy < 400)) {
                        if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                }
            }
        }
    }
}

/****************************/
/******* WALL BUILDER *******/
/****************************/

brain.roles.roleWallBuilder = (creep, task) => {
    let storage = creep.room.storage;
    let target = Game.getObjectById(task.target) ? Game.getObjectById(task.target) : undefined;

    if (task.hasResource && target) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (creep.repair(target) === OK) {
            utils.takeRandomStep(creep);
        }
    } else if (!task.hasResource) {
        if (storage && storage.store.energy > 100000) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            } else if (creep.withdraw(storage, RESOURCE_ENERGY) === OK) {

                let repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) =>
                        s.hits < s.hitsMax &&
                        s.hits < config.wallOrRampartTargetHitPoints(creep.room.name) * 10 &&
                        s.structureType !== STRUCTURE_CONTAINER &&
                        s.structureType !== STRUCTURE_ROAD
                });

                let wallTargets = _.filter(repairTargets, { 'structureType': STRUCTURE_WALL });
                let lowestWallTarget = _.sortBy(wallTargets, 'hits')[0];
                let rampartTargets = _.filter(repairTargets, { 'structureType': STRUCTURE_RAMPART });
                let lowestRampartTarget = _.sortBy(rampartTargets, 'hits')[0];

                if (wallTargets.length) {
                    task.target = lowestWallTarget.id;
                } else if (rampartTargets.length) {
                    task.target = lowestRampartTarget.id;
                }
            }
        }
    } else {
        utils.takeRandomStep(creep);
    }
}

/*********************/
/******* MINER *******/
/*********************/

brain.roles.roleMiner = (creep, task) => {

    let mineralType = Game.getObjectById(task.startPoint.id).mineralType;
    if (task.hasResource) {
        if (creep.transfer(Game.getObjectById(task.endPoint.id), mineralType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.endPoint.id));
        }
    } else if (!task.hasResource) {
        if (creep.harvest(Game.getObjectById(task.startPoint.id), mineralType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id));
        }
        creep.transfer(Game.getObjectById(task.endPoint.id), mineralType);
    }
}

/*********************************/
/******* MINERAL COLLECTOR *******/
/*********************************/

brain.roles.roleMineralCollector = (creep, task) => {

    let container = Game.getObjectById(task.startPoint.id);
    let mineralType = undefined;

    for (let item in container.store) {
        if (item !== RESOURCE_ENERGY)
            mineralType = item;
    }


    if (task.hasResource) {
        if (creep.transfer(creep.room.terminal, mineralType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.terminal, { reusePath: 20 });
        }
    } else if (!task.hasResource) {
        if (creep.ticksToLive < 50 && _.sum(creep.carry) > 0) {
            switch (creep.transfer(container, mineralType)) {
                case OK:
                    creep.suicide();
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(container);
                    break;
            }
        } else {
            if ((creep.pos.x !== container.pos.x || creep.pos.y !== container.pos.y) && !container.pos.lookFor(LOOK_CREEPS).length) {
                creep.moveTo(container);
            } else {
                if (creep.withdraw(container, mineralType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { reusePath: 20 });
                }
            }
        }
    }
}

/************************/
/******* PILLAGER *******/
/************************/

brain.roles.rolePillager = (creep, task) => {

    if (task.hasResource) {
        if (creep.room.name !== task.startPoint.room.name) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.room.name), { reusePath: 50 });
        } else {
            let mineralType = undefined;

            for (let item in creep.carry) {
                mineralType = item;
            }

            if (creep.transfer(creep.room.storage, mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    } else if (!task.hasResource) {
        // Pillage room
        if (creep.room.name !== task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
        } else {
            let structures = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) =>
                    (s.structureType === STRUCTURE_TOWER && s.energy > 0) ||
                    (s.structureType === STRUCTURE_EXTENSION && s.energy > 0) ||
                    (s.structureType === STRUCTURE_LINK && s.energy > 0) ||
                    (s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) > 0) ||
                    (s.structureType === STRUCTURE_STORAGE && _.sum(s.store) > 0) ||
                    (s.structureType === STRUCTURE_TERMINAL && _.sum(s.store) > 0)
            });

            if (structures) {
                if (_.sum(creep.carry) < creep.carryCapacity) {
                    let mineralType = RESOURCE_ENERGY;

                    if (structures.store) {
                        for (let item in structures.store) {
                            mineralType = item;
                        }
                    }

                    if (creep.withdraw(structures, mineralType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(structures);
                    }
                } else {
                    if (Game.time % 10 === 0) {
                        config.log(3, '[Pillage] Room: ' + creep.room.name + ' Creep: ' + creep.name + ' stole ' + _.sum(creep.carry) + ' of ' + mineralType);
                    }
                }
            } else {
                config.log(3, '[Pillage] Room: ' + creep.room.name + ' I am no longer needed');
            }
        }
    }
}


/**************************/
/******* PROSPECTOR *******/
/**************************/

brain.roles.roleProspector = (creep, task) => {

    let controller = creep.room.controller;

    let endPoint = Game.getObjectById(task.endPoint);

    if (task.hasResource) {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if (controller.my && controller.ticksToDowngrade < 1000) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                if ((constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES))) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                } else if ((repairSite = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax && s.hits <= 250000 })[0]) !== undefined) {
                    creep.repair(repairSite);
                } else if ((container = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0]) !== undefined && container.store.energy < 2000) {
                    if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else {
                    creep.drop(RESOURCE_ENERGY);
                }
            }
        }
    } else if (!task.hasResource) {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if (creep.harvest(endPoint) === ERR_NOT_IN_RANGE) {
                creep.moveTo(endPoint);
            }
        }
    }
}

/*************************/
/******* COLLECTOR *******/
/*************************/

brain.roles.roleCollector = (creep, task) => {
    let startPoint = Game.getObjectById(task.startPoint);

    brain.roles.task.pickUpEnergy(creep);

    if (task.hasResource) {
        let repairSite = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) =>
                s.hits < s.hitsMax &&
                s.hits < 25000 &&
                s.structureType === STRUCTURE_ROAD
        });
        creep.repair(repairSite);

        if (creep.room.name !== task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
        } else {
            let mineralType = undefined;

            for (let item in creep.carry) {
                mineralType = item;
            }

            if (creep.transfer(creep.room.storage, mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, { reusePath: 3 });
            }
        }
    } else if (!task.hasResource) {

        if (startPoint && creep.room.name !== startPoint.room.name) {
            creep.moveTo(new RoomPosition(25, 25, startPoint.room.name), { reusePath: (creep.room.name === task.endPoint.roomName ? 10 : 50) });
        } else {
            if (Game.getObjectById(task.startPoint)) {
                if (creep.withdraw(Game.getObjectById(task.startPoint), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(task.startPoint));
                }
                if (_.sum(creep.carry) > creep.carryCapacity / 2) {
                    task.hasResource = true;
                }
            } else {
                utils.avoidRoomEdge(creep);
            }
        }
    }
}

/***********************/
/******* CLAIMER *******/
/***********************/

brain.roles.roleClaimer = (creep, task) => {

    if (creep.room.name !== task.endPoint.roomName) {
        creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 10 });
    } else {
        if (creep.room.controller.sign === undefined || (creep.room.controller.sign && creep.room.controller.sign.username !== 'Yilmas')) {
            if (creep.signController(creep.room.controller, config.SIGN_MESSAGE) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

/************************/
/******* RESERVER *******/
/************************/

brain.roles.roleReserver = (creep, task) => {

    if (creep.ticksToLive < 5) {
        let district = Memory.empire.cities[task.startPoint.roomName].districts[task.endPoint.roomName];
        if (district && creep.room.controller.reservation && creep.room.controller.reservation.ticksToEnd > 4990) {
            district.startReserverAt = Game.time + 3000;
        }
    }

    if (creep.room.name !== task.endPoint.roomName) {
        creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 10 });
    } else {
        if (creep.room.controller.sign === undefined || (creep.room.controller.sign && creep.room.controller.sign.username !== 'Yilmas')) {
            if (creep.signController(creep.room.controller, config.SIGN_MESSAGE) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if (creep.reserveController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { reusePath: 50 });
            }
        }
    }
}

/*******************************/
/******* INTERCITY BOOST *******/
/*******************************/

brain.roles.roleInterCityBoost = (creep, task) => {

    if (task.hasResource) {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            let repairSite = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax && (s.hitsMax === 5000 ? 4500 : 24500))
            });

            let repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) =>
                    s.hits < s.hitsMax &&
                    s.hits < config.wallOrRampartTargetHitPoints(creep.room.name) &&
                    s.structureType !== STRUCTURE_CONTAINER &&
                    s.structureType !== STRUCTURE_ROAD
            });

            if ((constructionsite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES))) {
                if (creep.build(constructionsite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionsite);
                }
            } else if (repairSite) {
                if (creep.repair(repairSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairSite);
                }
            } else if (repairTargets.length) {
                let repairWallTarget = _.filter(repairTargets, { 'structureType': STRUCTURE_WALL });
                let repairRampartTarget = _.filter(repairTargets, { 'structureType': STRUCTURE_RAMPART });

                if (repairWallTarget.length) {
                    if (creep.repair(repairWallTarget[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairWallTarget[0]);
                    }
                } else if (repairRampartTarget.length) {
                    if (creep.repair(repairRampartTarget[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairRampartTarget[0]);
                    }
                }
            } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    } else {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName), { reusePath: 50 });
        } else {
            if ((droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (d) => d.resourceType === RESOURCE_ENERGY && d.amount > creep.carryCapacity / 2 }))) {
                if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy);
                }
            } else if (creep.room.storage && creep.room.storage.store.energy > creep.carryCapacity) {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            } else if (creep.room.terminal && creep.room.terminal.store.energy > creep.carryCapacity) {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            } else if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > (creep.carryCapacity - _.sum(creep.carry)) && s.id !== creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: (d) => d.structureType === STRUCTURE_CONTAINER }).id }))) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else if (creep.harvest(Game.getObjectById(task.endPoint.id)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.endPoint.id));
            }
        }
    }
}

/***********************************/
/******* INTERCITY TRANSPORT *******/
/***********************************/

brain.roles.roleInterCityTransport = (creep, task) => {

    let homeRoom = task.startPoint.roomName;
    let endRoom = task.endPoint.roomName;

    if (task.hasResource) {
        if (creep.room.name !== endRoom) {
            creep.moveTo(new RoomPosition(25, 25, endRoom), { reusePath: 50 });
        } else {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, { reusePath: 10 });
            }
        }
    } else if (!task.hasResource) {
        if (creep.room.name !== homeRoom) {
            creep.moveTo(new RoomPosition(25, 25, homeRoom), { reusePath: 50 });
        } else {
            if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, { reusePath: 10 });
            }
        }
    }
}

/*********************/
/******* SCOUT *******/
/*********************/

brain.roles.roleScout = (creep, task) => {
    let targetRoom = task.endPoint.roomName;
    let controller = creep.room.controller;

    if (creep.room.name !== targetRoom) {
        creep.moveTo(new RoomPosition(25, 25, targetRoom), { reusePath: 50 });
    } else {
        if (controller.sign === undefined || (controller.sign && controller.sign.username !== 'Yilmas')) {
            if (creep.signController(controller, config.SIGN_MESSAGE) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        } else {
            // suicide
            Memory.scouts[targetRoom].isScouted = true;
            creep.suicide();
        }
    }
}

/************************/
/******* ATTACKER *******/
/************************/

brain.roles.roleAttacker = (creep, task) => {

    let squad = Memory.squads[creep.memory.task.squad];

    if (squad.squadType === 'attack') {
        if (!squad.attacking && creep.room.name !== task.startPoint.room.name) {
            // move to rendevour point
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.room.name));
        } else if (squad.attacking) {
            // start the attack

            // avoid room changing
            utils.avoidRoomEdge(creep);

            if (creep.room.name !== task.endPoint.roomName) {
                creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName));
            } else {

                // start the actual attack
                let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                let hostilesStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) =>
                        s.structureType === STRUCTURE_TOWER ||
                        s.structureType === STRUCTURE_SPAWN ||
                        s.structureType === STRUCTURE_RAMPART
                }
                );

                if (Game.time % 2 === 0 && creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                } else if (hostiles) {
                    creep.rangedAttack(hostiles);
                    if (creep.attack(hostiles) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostiles);
                    }
                } else if (hostilesStructures) {
                    creep.rangedAttack(hostilesStructures);
                    if (creep.attack(hostilesStructures) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostilesStructures);
                    }
                }
            }
        } else if (!squad.attacking && creep.room.name === task.startPoint.room.name && creep.pos !== task.startPoint.pos) {
            // move closer to rendevour point
            creep.moveTo(new RoomPosition(task.startPoint.pos.x, task.startPoint.pos.y, task.startPoint.pos.roomName));
        }
    }
}

/************************/
/******* DEFENDER *******/
/************************/

brain.roles.roleDefender = (creep, task) => {

    if (creep.room.name !== task.startPoint.pos.roomName) {
        creep.moveTo(new RoomPosition(25, 25, task.startPoint.pos.roomName));
    } else if (creep.room.name === task.startPoint.pos.roomName) {
        // attack if hostile creeps exist
        let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { filter: (s) => s.owner && !_.contains(config.WHITE_LIST, s.owner.username) });
        let userName = (hostiles ? hostiles.owner.username : undefined);

        let hostileStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (s) =>
                (s.structureType === STRUCTURE_TOWER) ||
                (s.structureType === STRUCTURE_SPAWN) ||
                (s.structureType === STRUCTURE_EXTENSION) ||
                (s.structureType === STRUCTURE_TERMINAL && _.sum(s.store) === 0) ||
                (s.structureType === STRUCTURE_LINK && s.energy === 0) ||
                (s.structureType === STRUCTURE_STORAGE && _.sum(s.store) === 0) ||
                (s.structureType === STRUCTURE_EXTRACTOR)
        }
        );


        if (Game.time % 3 === 0 && creep.hits < creep.hitsMax) {
            creep.heal(creep);
            if (hostiles && !_.contains(config.WHITE_LIST, userName)) {
                creep.rangedAttack(hostiles);
            }
        } else if (hostiles && !_.contains(config.WHITE_LIST, userName)) {
            creep.rangedAttack(hostiles);
            if (creep.attack(hostiles) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostiles);
            }
        } else if (hostileStructures) {
            if (creep.attack(hostileStructures) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileStructures);
            }
        } else if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        } else if ((damagedCreeps = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax }))) {
            if (creep.heal(damagedCreeps) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreeps);
            }
        } else {
            // go to defensive station
            creep.moveTo(new RoomPosition(task.startPoint.pos.x, task.startPoint.pos.y, task.startPoint.pos.roomName));
        }
    }
}

/*****************************/
/******* CITY DEFENDER *******/
/*****************************/

brain.roles.roleCityDefender = (creep, task) => {

    if (creep.room.name !== task.startPoint.roomName) {
        creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
    } else if (creep.room.name === task.startPoint.roomName) {
        // attack if hostile creeps exist
        let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { filter: (s) => s.owner && !_.contains(config.WHITE_LIST, s.owner.username) });

        if (hostile) {
            // combat mode

            if (creep.pos.getRangeTo(30, 28) > 8) {
                creep.moveTo(task.startPoint, { ignoreCreeps: true });
            } else {
                if (creep.hits < creep.hitsMax - 300) {
                    creep.heal(creep);
                    if (hostile) {
                        creep.rangedAttack(hostiles);
                    }
                } else if (hostile) {
                    creep.rangedAttack(hostile);
                    if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostile);
                    }
                }
            }
        } else {
            // regen mode
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            } else if ((damagedCreeps = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax }))) {
                if (creep.heal(damagedCreeps) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedCreeps);
                }
            } else if (creep.pos.getRangeTo(30, 28) > 8) {
                creep.moveTo(task.startPoint, { ignoreCreeps: true });
            } else {
                // stay of the roads to avoid a congestion
                utils.takeRandomStep(creep);
            }
        }
    }
}

/*****************************/
/******* SPECIAL CREEP *******/
/*****************************/

brain.roles.roleSpecialCreep = (creep, task) => {

    if (task.startPoint.roomName === 'E8S37') {
        if (creep.room.name !== 'E9S35') {
            creep.moveTo(new RoomPosition(25, 25, 'E9S35'));
        } else if (creep.room.name === 'E9S35' && Game.rooms['E9S35']) {

            let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, { filter: (s) => s.owner && !_.contains(config.WHITE_LIST, s.owner.username) });
            let userName = (hostiles ? hostiles.owner.username : undefined);

            let hostileStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (s) =>
                    (s.structureType === STRUCTURE_TOWER) ||
                    (s.structureType === STRUCTURE_SPAWN) ||
                    (s.structureType === STRUCTURE_EXTENSION && s.energy === 0) ||
                    (s.structureType === STRUCTURE_TERMINAL && _.sum(s.store) === 0) ||
                    (s.structureType === STRUCTURE_LINK && s.energy === 0) ||
                    (s.structureType === STRUCTURE_STORAGE && _.sum(s.store) === 0) ||
                    (s.structureType === STRUCTURE_EXTRACTOR)
            }
            );

            if (Game.time % 3 === 0 && creep.hits < creep.hitsMax) {
                creep.heal(creep);
                if (hostiles && !_.contains(config.WHITE_LIST, userName)) {
                    creep.rangedAttack(hostiles);
                }
            } else if (hostiles && !_.contains(config.WHITE_LIST, userName)) {
                creep.rangedAttack(hostiles);
                if (creep.attack(hostiles) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles);
                }
            } else if (hostileStructures) {
                if (creep.attack(hostileStructures) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileStructures);
                }
            } else if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            } else if ((damagedCreeps = creep.pos.findClosestByPath(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax }))) {
                if (creep.heal(damagedCreeps) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedCreeps);
                }
            } else {
                // go to defensive station
                creep.moveTo(new RoomPosition(18, 41, 'E9S35'));
            }
        }
    }

    if (task.startPoint.roomName === 'XXXX') {
        if (creep.room.name !== 'E9S35') {
            creep.moveTo(new RoomPosition(25, 25, 'E9S35'));
        } else if (creep.room.name === 'E9S35' && Game.rooms['E9S35']) {

            let ramp = undefined; // Game.getObjectById('5988270216e29b7be8d9eb61');
            let spawn = undefined; // Game.getObjectById('5987a723e1fda85b5b0e8743');

            if (ramp) {
                if (creep.dismantle(ramp) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(ramp);
                }
            } else if (spawn) {
                if (creep.dismantle(spawn) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            } else {
                let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                if (target) {
                    if (target && creep.pos === target.pos) {
                        creep.move(TOP);
                    } else {
                        creep.moveTo(target);
                        creep.say('HULK SMASH!', true)
                    }
                } else {
                    let spawn = Game.getObjectById('59a3de8618d0605b341013cb');
                    if (creep.dismantle(spawn) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
        }
    }

    let nuke = false;
    if (nuke) {
        let endPoint = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_NUKER });

        if (task.hasResource) {

            let mineralType = undefined;

            for (let item in creep.carry) {
                mineralType = item;
            }

            if (mineralType === RESOURCE_ENERGY && endPoint.energy === endPoint.energyCapacity) {
                // Unload Energy into terminal
                if (creep.transfer(creep.room.terminal, mineralType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            } else if (mineralType === RESOURCE_GHODIUM && endPoint.ghodium === endPoint.ghodiumCapacity) {
                // Unload Ghodium into terminal
                if (creep.transfer(creep.room.terminal, mineralType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            } else {
                if (creep.transfer(endPoint, mineralType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint, { reusePath: 3 });
                }
            }

        } else if (!task.hasResource) {
            if (endPoint.energy < endPoint.energyCapacity) {
                // Load Energy
                if (creep.room.storage.store.energy > 0) {
                    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                } else {
                    if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.terminal);
                    }
                }
            } else if (endPoint.ghodium < endPoint.ghodiumCapacity) {
                // Load Ghodium
                if (creep.withdraw(creep.room.terminal, RESOURCE_GHODIUM) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            }
        }
    }

}