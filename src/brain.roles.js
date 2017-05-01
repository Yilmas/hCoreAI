brain.roles = {};

brain.roles.manager = function () {
    let roles = brain.roles;

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
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
            if (task.role === 'miner') roles.roleMiner(creep, task);
            if (task.role === 'mineralCollector') roles.roleMineralCollector(creep, task);
            if (task.role === 'pillager') roles.rolePillager(creep, task);
            if (task.role === 'prospector') roles.roleProspector(creep, task);
            if (task.role === 'collector') roles.roleCollector(creep, task);
            if (task.role === 'claimer') roles.roleClaimer(creep, task);
            if (task.role === 'reserver') roles.roleReserver(creep, task);
            if (task.role === 'roomBooster') roles.roleRoomBooster(creep, task);
            if (task.role === 'interRoomTransport') roles.roleInterRoomTransport(creep, task);
            if (task.role === 'scout') roles.roleScout(creep, task);
            if (task.role === 'attacker') roles.roleAttacker(creep, task);
            if (task.role === 'specialCreep') roles.roleSpecialCreep(creep, task);
        }
        catch (ex) {
            console.log('<font color=red>[Role Manager]: ' + ex + '</font>');
        }
    }
}

/*************************/
/******* HARVESTER *******/
/*************************/

brain.roles.roleHarvester = (creep, task) => {
    let roomRoles = Memory.empire.cities[creep.room.name].roles;

    if (task.hasResource) {
        if (roomRoles.roleDistributor.count === 0) {
            // If no distributors exists, start filling spawn and extensions, so that we may spawn a new distributor --- This is a failsafe
            let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>
                    (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                    (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
            });

            if (spawnOrExtension) {
                if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnOrExtension);
                }
            } else if ((constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)) !== undefined) {
                if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else if ((container = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0]) !== undefined) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        } else {
            // Distributors exists, start filling container

            if ((sourceLink = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_LINK })[0]) !== undefined) {
                if (creep.transfer(sourceLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceLink);
                }
            } else if ((container = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })[0]) !== undefined) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else {
                let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (constructionSite) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                }
            }
        }
    } else if (!task.hasResource) {
        if (creep.harvest(Game.getObjectById(task.startPoint.id)) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id), { reusePath: 20 });
        }
    }
}

/***********************/
/******* CARRIER *******/
/***********************/

brain.roles.roleCarrier = (creep, task) => {
    let roomRoles = Memory.empire.cities[creep.room.name].roles;

    if (task.hasResource) {
        if (roomRoles.roleDistributor.count === 0) {
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
        } else if (creep.room.storage) {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, { reusePath: 10 });
            }
        }
    } else if (!task.hasResource) {
        if (creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id), { reusePath: 10 });
        }
    }
}

/***************************/
/******* DISTRIBUTOR *******/
/***************************/

brain.roles.roleDistributor = (creep, task) => {
    let roomRoles = Memory.empire.cities[creep.room.name].roles;
    let storage = creep.room.storage;

    if (task.hasResource) {

        if ((hostiles = creep.room.find(FIND_HOSTILE_CREEPS)).length && roomRoles.roleDistributor.count > 1) {
            // focus on refilling towers
            if ((tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < 900 })) !== undefined) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            }
        } else {
            let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>
                    (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                    (s.structureType === STRUCTURE_SPAWN && s.energy < s.energyCapacity)
            });

            if (spawnOrExtension) {
                if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnOrExtension);
                }
            } else if ((tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER && s.energy < 900 })) !== undefined) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            }
        }
    } else if (!task.hasResource) {
        if (storage) {
            if (storage.store.energy > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            } else if (roomRoles.roleBridge.count === 0 && (baseLink = storage.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK })[0]) !== undefined) {
                if (creep.withdraw(baseLink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(baseLink);
                }
            } else if ((droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, { filter: (e) => e.amount >= 200 })) !== undefined) {
                if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy);
                }
            }
        } else {
            if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy >= 200 })) !== undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { reusePath: 10 });
                }
            }
        }
    }
}

/************************/
/******* UPGRADER *******/
/************************/

brain.roles.roleUpgrader = (creep, task) => {
    let controller = creep.room.controller;

    if (task.hasResource) {
        if (task.startPoint && Game.time % 2 === 0) {
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
            if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })) !== undefined) {
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

/***********************/
/******* BUILDER *******/
/***********************/

brain.roles.roleBuilder = (creep, task) => {
    let storage = creep.room.storage;

    if (task.hasResource) {
        let repairSite = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
                s.hits < s.hitsMax &&
                s.hits < 25000 &&
                s.structureType !== STRUCTURE_WALL &&
                s.structureType !== STRUCTURE_RAMPART
        });

        if ((constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)) !== undefined) {
            if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        } else if (repairSite) {
            if (creep.repair(repairSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairSite);
            }
        } else {
            utils.takeRandomStep(creep);
        }
    } else if (!task.hasResource) {
        if ((droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, { filter: (e) => e.energy >= creep.carryCapacity / 2 })) !== undefined) {
            if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
        } else if (storage && storage.store.energy > 300) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        } else if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > 200 })) !== undefined) {
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

/**********************/
/******* BRIDGE *******/
/**********************/

brain.roles.roleBridge = (creep, task) => {

    if (creep.carry.energy > 0) {
        task.hasResource = true;
    }

    let storage = creep.room.storage; // old startPoint
    let terminal = creep.room.terminal;
    let endPoint = Game.getObjectById(task.endPoint.id); // base link

    let sourceHasLinks = false;

    for (let sourceName in Memory.empire.cities[creep.room.name].sources) {
        if (Game.getObjectById(sourceName).pos.findInRange(FIND_MY_STRUCTURES, 2, { filter: (s) => s.structureType === STRUCTURE_LINK })[0]) {
            sourceHasLinks = true;
        } else {
            sourceHasLinks = false;
        }
    }

    if (creep.room.controller.level >= 7 && sourceHasLinks) {
        // Stage specifc when sourceHasLinks === true

        if (task.hasResource) {
            if (endPoint.energy < 400) {
                if (creep.transfer(endPoint, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint);
                }
            } else if (terminal.store.energy < config.TERMINAL_MINIMUM_ENERGY) {
                if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
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
            } else if (terminal.store.energy > config.TERMINAL_MINIMUM_ENERGY) {
                if (creep.withdraw(terminal, RESOURCE_ENERGY, terminal.store.energy - config.TERMINAL_MINIMUM_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
            } else if (terminal.store.energy < config.TERMINAL_MINIMUM_ENERGY || endPoint.energy < 400) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }

    } else {

        if (task.hasResource) {
            if (endPoint.structureType === STRUCTURE_LINK) {
                // upgraders use link
                if (endPoint.energy < endPoint.energyCapacity) {
                    if (creep.transfer(endPoint, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(endPoint);
                    }
                } else if (terminal && terminal.store.energy < config.TERMINAL_MINIMUM_ENERGY) {
                    if (creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    }
                }
            } else if (endPoint.structureType === STRUCTURE_CONTAINER) {
                // upgraders use container
                if (creep.transfer(endPoint, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint);
                }
            }
        } else {
            if (terminal && terminal.store.energy > config.TERMINAL_MINIMUM_ENERGY) {
                if (creep.withdraw(terminal, RESOURCE_ENERGY, terminal.store.energy - config.TERMINAL_MINIMUM_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
            } else {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
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
        if (creep.transfer(creep.room.storage, mineralType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { reusePath: 20 });
        }
    } else if (!task.hasResource) {
        if (creep.withdraw(container, mineralType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(container, { reusePath: 20 });
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

    if (task.hasResource) {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if (controller.my && controller.ticksToDowngrade < 1000) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                if ((constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES)) !== undefined) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                } else if ((repairSite = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax && s.hits <= 250000 })) !== undefined) {
                    creep.repair(repairSite);
                } else if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER })) !== undefined && container.store.energy < 2000) {
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
            if (creep.harvest(Game.getObjectById(task.endPoint.id)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.endPoint.id));
            }
        }
    }
}

/*************************/
/******* COLLECTOR *******/
/*************************/

brain.roles.roleCollector = (creep, task) => {

    if ((droppedEnergyOnTile = creep.pos.lookFor(LOOK_ENERGY)) !== undefined) {
        creep.pickup(droppedEnergyOnTile, RESOURCE_ENERGY);
    }

    if (task.hasResource) {
        creep.repair(creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_ROAD })[0]);

        if (creep.room.name !== task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
        } else {
            if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, { reusePath: 10 });
            }
        }
    } else if (!task.hasResource) {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName), { reusePath: (creep.room.name === task.startPoint.roomName ? 10 : 50) });
        } else {
            if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > creep.carryCapacity })) !== undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
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
        creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
    } else {
        if (creep.room.controller.sign === undefined || (creep.room.controller.sign && creep.room.controller.sign.username !== 'Yilmas')) {
            if (creep.signController(creep.room.controller, config.SIGN_MESSAGE) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else if (task.claim) {
            //claim
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            //reserve
            if (creep.reserveController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { reusePath: 50 });
            }
        }
    }
}

/************************/
/******* RESERVER *******/
/************************/

brain.roles.roleReserver = (creep, task) => {

    if (creep.room.name !== task.endPoint.roomName) {
        creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
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

/****************************/
/******* ROOM BOOSTER *******/
/****************************/

brain.roles.roleRoomBooster = (creep, task) => {
    if (task.hasResource) {
        if (creep.room.name !== task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if ((constructionsite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)) !== undefined) {
                if (creep.build(constructionsite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionsite);
                }
            } else if ((repairSite = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) =>
                    (s.structureType === STRUCTURE_WALL && s.hits < s.hitsMax && s.hits < 200000) ||
                    (s.structureType === STRUCTURE_RAMPART && s.hits < s.hitsMax && s.hits < 200000)
            })) !== undefined) {

                if ((orderedRepairSite = _.sortBy(repairSite, 'hits')[0]) !== undefined) {
                    if (creep.repair(orderedRepairSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(orderedRepairSite);
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
            if ((droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY)) !== undefined) {
                if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy);
                }
            } else if (creep.harvest(Game.getObjectById(task.endPoint.id)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.endPoint.id));
            }
        }
    }
}

/************************************/
/******* INTER-ROOM TRANSPORT *******/
/************************************/

brain.roles.roleInterRoomTransport = (creep, task) => {

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
                        s.structureType === STRUCTURE_SPAWN
                }
                );

                if (hostiles) {
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
    } else if (squad.squadType === 'defend') {

        if (creep.room.name !== task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName));
        } else if (creep.room.name === task.startPoint.name) {
            // attack if hostile creeps exist
            let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            let hostileStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (s) =>
                    (s.structureType === STRUCTURE_TOWER && s.energy === 0) ||
                    (s.structureType === STRUCTURE_SPAWN && s.energy === 0) ||
                    (s.structureType === STRUCTURE_EXTENSION && s.energy === 0) ||
                    (s.structureType === STRUCTURE_TERMINAL && _.sum(s.store) === 0) ||
                    (s.structureType === STRUCTURE_LINK && s.energy === 0) ||
                    (s.structureType === STRUCTURE_STORAGE && _.sum(s.store) === 0) ||
                    (s.structureType === STRUCTURE_EXTRACTOR)
            }
            );

            if (hostiles) {

                creep.rangedMassAttack();
                if (creep.attack(hostiles) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles);
                }
            } else if (hostileStructures) {
                creep.rangedAttack(hostileStructures);
                if (creep.attack(hostileStructures) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileStructures);
                }
            } else {
                // go to defensive station
                creep.moveTo(new RoomPosition(task.startPoint.pos.x, task.startPoint.pos.y, task.startPoint.pos.roomName));
            }
        }
    }
}

/*****************************/
/******* SPECIAL CREEP *******/
/*****************************/

brain.roles.roleSpecialCreep = (creep, task) => {
    
}