brain.roles = {};

brain.roles.manager = function () {
    let roles = brain.roles;

    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        let task = creep.memory.task;

        if (task.hasResource && _.sum(creep.carry) == 0) {
            task.hasResource = false;
        }
        if (!task.hasResource && _.sum(creep.carry) == creep.carryCapacity) {
            task.hasResource = true;
        }


        try {
            if (task.role == 'harvester') roles.roleHarvester(creep, task);
            if (task.role == 'carrier') roles.roleCarrier(creep, task);
            if (task.role == 'distributor') roles.roleDistributor(creep, task);
            if (task.role == 'upgrader') roles.roleUpgrader(creep, task);
            if (task.role == 'builder') roles.roleBuilder(creep, task);
            if (task.role == 'bridge') roles.roleBridge(creep, task);
            if (task.role == 'miner') roles.roleMiner(creep, task);
            if (task.role == 'mineralCollector') roles.roleMineralCollector(creep, task);
            if (task.role == 'pillager') roles.rolePillager(creep, task);
            if (task.role == 'prospector') roles.roleProspector(creep, task);
            if (task.role == 'collector') roles.roleCollector(creep, task);
            if (task.role == 'claimer') roles.roleClaimer(creep, task);
            if (task.role == 'roomBooster') roles.roleRoomBooster(creep, task);
            if (task.role == 'attacker') roles.roleAttacker(creep, task);
            if (task.role == 'specialCreep') roles.roleSpecialCreep(creep, task);
        }
        catch (ex) {
            console.log('<font color=red>[Role Manager]: ' + ex + '</font>');
        }
    }
}

/*************************/
/******* HARVESTER *******/
/*************************/

brain.roles.roleHarvester = function (creep, task) {

    if (task.hasResource) {
        let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

        if (creep.room.memory.roles.roleDistributor.amountOfDistributors == 0) {
            // If no distributors exists, start filling spawn and extensions, so that we may spawn a new distributor --- This is a failsafe
            let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>  (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                    (s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
            });

            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });

            if (spawnOrExtension) {
                if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnOrExtension);
                }
            } else if (spawn.energy == 300) {
                let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (constructionSite) {
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                }
            } else if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        } else {
            // Distributors exists, start filling container
            if (task.endPoint) {
                if (creep.room.controller.level >= 7) {
                    let sourceLink = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_LINK })[0];

                    if (sourceLink) {
                        if (creep.transfer(sourceLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sourceLink);
                        }
                    } else {
                        if (creep.transfer(Game.getObjectById(task.endPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(task.endPoint.id));
                        }
                    }
                } else if (creep.transfer(Game.getObjectById(task.endPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(task.endPoint.id));
                }
            } else {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });

                if (container) {
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else if (spawn.energy == 300) {
                    let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if (constructionSite) {
                        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(constructionSite);
                        }
                    }
                } else {
                    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                }
            }
        }
    } else if (!task.hasResource) {
        if (creep.harvest(Game.getObjectById(task.startPoint.id)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id), { reusePath: 50 });
        }
    }
}

/***********************/
/******* CARRIER *******/
/***********************/

brain.roles.roleCarrier = function (creep, task) {

    if (task.hasResource) {
        if (creep.room.memory.roles.roleDistributor.amountOfDistributors == 0) {
            let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>  (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                    (s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
            });

            if (spawnOrExtension) {
                if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnOrExtension);
                }
            }
        } else {
            if (task.endPoint) {
                if (creep.transfer(Game.getObjectById(task.endPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(task.endPoint.id), { reusePath: 10 });
                }
            } else {
                if ((tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < 801 })) != undefined) {
                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower);
                    }
                }
            }
        }
    } else if (!task.hasResource) {
        if (creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id), { reusePath: 10 });
        }
    }
}

/***************************/
/******* DISTRIBUTOR *******/
/***************************/

brain.roles.roleDistributor = function (creep, task) {

    if (task.hasResource) {
        if (creep.carry.energy < 50) task.hasResource = false;

        let spawnOrExtension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>  (s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity) ||
                (s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
        });

        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0 && creep.room.memory.roles.roleDistributor.amountOfDistributors > 0) {
            // focus on refilling towers
            if ((tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < 900 })) != undefined) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            }

        } else {
            if (spawnOrExtension) {
                if (creep.transfer(spawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnOrExtension);
                }
            } else if ((tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < 801 })) != undefined) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else if (creep.room.storage && creep.room.storage.store.energy > 100000) {
                let tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity });
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
    } else if (!task.hasResource) {
        if (creep.carry.energy > 50) task.hasResource = true;

        if (task.startPoint) {
            if (Game.getObjectById(task.startPoint.id).store.energy > 0) {
                if (creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(task.startPoint.id));
                }
            } else if (_.sum(Game.creeps, (c) => c.room.name == creep.room.name && c.memory.task.role == 'bridge') == 0) {
                let baseLink = creep.room.storage.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_LINK })[0];
                if (baseLink && creep.withdraw(baseLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(baseLink);
                }
            } else if ((droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, { filter: (e) => e.amount >= creep.carryCapacity })) != undefined) {
                if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy);
                }
            } else {
                if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.energy > 0 })) != undefined) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { reusePath: 50 });
                    }
                }
            }
        } else {
            if ((container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.energy > 0 })) != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { reusePath: 50 });
                }
            }
        }
    }
}

/************************/
/******* UPGRADER *******/
/************************/

brain.roles.roleUpgrader = function (creep, task) {


    if (task.hasResource) {
        if (task.startPoint && Game.time % 2 === 0) {
            creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY);
        }

        if (creep.room.controller.sign == undefined || (creep.room.controller.sign && creep.room.controller.sign.username != 'Yilmas')) {
            if (creep.signController(creep.room.controller, config.SIGN_MESSAGE) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }

        if (creep.upgradeController(Game.getObjectById(task.endPoint.id)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.endPoint.id));
        }
    } else if (!task.hasResource) {
        if (task.startPoint) {
            if (creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.startPoint.id));
            }
        } else {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.energy > 200 });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
}

/***********************/
/******* BUILDER *******/
/***********************/

brain.roles.roleBuilder = function (creep, task) {


    if (task.hasResource) {
        let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        let repairSite = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (s) => s.hits < s.hitsMax && s.hits < 25000 && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
            });

        if (constructionSite) {
            if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        } else if (repairSite) {
            if (creep.repair(repairSite) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairSite);
            }
        } else {
            utils.takeRandomStep(creep);
        }
    } else if (!task.hasResource) {
        let droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
            filter: (e) => e.energy >= creep.carryCapacity
        });

        if (droppedEnergy) {
            if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
        } else if (task.startPoint) {
            if (creep.room.storage.store.energy > 200) {
                if (creep.withdraw(Game.getObjectById(task.startPoint.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(task.startPoint.id));
                }
            } else {
                utils.takeRandomStep(creep);
            }
        } else {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES,
                { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.energy > 200 });

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
}

/**********************/
/******* BRIDGE *******/
/**********************/

brain.roles.roleBridge = function (creep, task) {


    if (creep.carry.energy > 0) {
        task.hasResource = true;
    }

    let startPoint = Game.getObjectById(task.startPoint.id);
    let endPoint = Game.getObjectById(task.endPoint.id);
    let sourceHasLinks = false;

    for (let source of creep.room.find(FIND_SOURCES)) {
        let sourceLink = source.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_LINK })[0];
        if (sourceLink) {
            sourceHasLinks = true;
        }
    }

    if (task.hasResource) {

        if (creep.room.controller.level >= 7 && sourceHasLinks) {
            if (endPoint.energy < 400) { //400
                if (creep.transfer(endPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint);
                }
            } else if (creep.room.terminal && creep.room.terminal.store.energy < 20000) {
                if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            } else {
                if (creep.transfer(startPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(startPoint);
                }
            }
        } else {
            if (endPoint.energy < 800) {
                if (creep.transfer(endPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint);
                }
            } else if (endPoint.structureType == STRUCTURE_CONTAINER && endPoint.store.energy < 2000) {
                if (creep.transfer(endPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint, { reusePath: 50 });
                }
            } else if (creep.room.terminal && creep.room.terminal.store.energy < 20000) {
                if (creep.transfer(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            }
        }
    } else if (!task.hasResource) {

        if (creep.room.controller.level >= 7 && sourceHasLinks) {
            // withdraw from link and terminal
            if (endPoint.energy > 600) { //600
                if (creep.withdraw(endPoint, RESOURCE_ENERGY, endPoint.energy - 400) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(endPoint);
                }
            } else if (creep.room.terminal && creep.room.terminal.store.energy > 21000) {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            } else if ((creep.room.terminal && creep.room.terminal.store.energy < 20000) || endPoint.energy < 400) { //400
                if (creep.withdraw(startPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(startPoint);
                }
            }
        } else {
            // withdraw from storage and terminal
            if (startPoint.store.energy > 800) {
                if (creep.withdraw(startPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(startPoint, { reusePath: 50 });
                }
            } else if (creep.room.terminal && creep.room.terminal.store.energy > 20000) {
                if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            }
        }
    }
}

/*********************/
/******* MINER *******/
/*********************/

brain.roles.roleMiner = function (creep, task) {


    let mineralType = Game.getObjectById(task.startPoint.id).mineralType;
    if (task.hasResource) {
        if (creep.transfer(Game.getObjectById(task.endPoint.id), mineralType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.endPoint.id));
        }
    } else if (!task.hasResource) {
        if (creep.harvest(Game.getObjectById(task.startPoint.id), mineralType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id));
        }
        creep.transfer(Game.getObjectById(task.endPoint.id), mineralType);
    }
}

/*********************************/
/******* MINERAL COLLECTOR *******/
/*********************************/

brain.roles.roleMineralCollector = function (creep, task) {

    let container = Game.getObjectById(task.startPoint.id);
    let mineralType = undefined;

    for (let item in container.store) {
        if (item != RESOURCE_ENERGY)
            mineralType = item;
    }


    if (task.hasResource) {
        if (creep.transfer(Game.getObjectById(task.endPoint.id), mineralType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.endPoint.id), { reusePath: 50 });
        }
    } else if (!task.hasResource) {
        if (creep.withdraw(Game.getObjectById(task.startPoint.id), mineralType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(task.startPoint.id), { reusePath: 50 });
        }
    }
}

/************************/
/******* PILLAGER *******/
/************************/

brain.roles.rolePillager = function (creep, task) {


    if (task.hasResource) {
        if (creep.room.name != task.startPoint.room.name) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.room.name), { reusePath: 50 });
        } else {
            let mineralType = undefined;

            for (let item in creep.carry) {
                mineralType = item;
            }

            if (creep.transfer(Game.getObjectById(task.startPoint.id), mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.startPoint.id));
            }
        }
    } else if (!task.hasResource) {
        // Pillage room
        if (creep.room.name != task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
        } else {
            let structureWithResources = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) =>
                    (s.structureType == STRUCTURE_TOWER && s.energy > 0 && s.owner != 'Yilmas') ||
                    (s.structureType == STRUCTURE_EXTENSION && s.energy > 0 && s.owner != 'Yilmas') ||
                    (s.structureType == STRUCTURE_LINK && s.energy > 0 && s.owner != 'Yilmas') ||
                    (s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) > 0 && s.owner != 'Yilmas') ||
                    (s.structureType == STRUCTURE_STORAGE && _.sum(s.store) > 0)
            });

            if (structureWithResources) {
                let mineralType = RESOURCE_ENERGY;

                if (structureWithResources.store) {
                    for (let item in structureWithResources.store) {
                        if (structureWithResources.owner == 'Yilmas' && item == RESOURCE_ENERGY) {
                            continue;
                        } else {
                            mineralType = item;
                        }
                    }
                }

                if (mineralType) {
                    if (creep.withdraw(structureWithResources, mineralType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureWithResources);
                    }
                }

                if (_.sum(creep.carry == creep.carryCapacity)) config.log(3, '[Pillage] Room: ' + creep.room.name + ' stole ' + creep.carryCapacity + ' of ' + creep.carry[0]);
            } else {
                config.log(3, '[Pillage] Room: ' + creep.room.name + ' I am no longer needed');
            }
        }
    }
}


/**************************/
/******* PROSPECTOR *******/
/**************************/

brain.roles.roleProspector = function (creep, task) {

    if (task.hasResource) {
        if (creep.room.name != task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            let constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
            let repairSite = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.hits < s.hitsMax && s.hits <= 250000 }, 3);

            if (constructionSite) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else if (repairSite) {
                creep.repair(repairSite);
            } else if (container && container.store.energy < 2000) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }

                if (container.store.energy > 1600) {
                    // TODO: Request haul, unless already requested
                }

            } else {
                // drop energy
                creep.drop(RESOURCE_ENERGY);
            }
        }
    } else if (!task.hasResource) {
        if (creep.room.name != task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if (creep.harvest(Game.getObjectById(task.endPoint.id)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.endPoint.id));
            }
        }
    }
}

/*************************/
/******* COLLECTOR *******/
/*************************/

brain.roles.roleCollector = function (creep, task) {

    if (task.hasResource) {

        let repairVicinity = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_ROAD && s.hits < s.hitsMax && s.hits < 25000 }, 3);
        creep.repair(repairVicinity);

        if (creep.room.name != task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
        } else {
            if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { reusePath: 50 });
                }
            } else {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
                if (container) {
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }
    } else if (!task.hasResource) {
        // TODO: Find haul request by range to target and reserve it, add its own estimated arrival time to the job
        // If another reservation is in place, determine if new creep is faster than the current reservation.

        if (creep.room.name != task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName), { reusePath: 50 });
        } else {
            let droppedEnergy = _.max(creep.room.find(FIND_DROPPED_ENERGY), (r) => r.amount);

            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.energy > creep.carryCapacity });

            if (creep.room.storage) {
                if (creep.room.storage.store.energy > 100000) {
                    if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                } else if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            } else if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }

                // TODO: delete haul request

            } else if (droppedEnergy) {
                if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy);
                }
            }
        }
    }
}

/***********************/
/******* CLAIMER *******/
/***********************/

brain.roles.roleClaimer = function (creep, task) {

    if (creep.room.name != task.endPoint.roomName) {
        creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName), { reusePath: 50 });
    } else {
        if (task.claim) {
            //claim
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            // set isClaimed to true in claimList
        } else {
            //reserve
            if (creep.room.controller.sign == undefined || (creep.room.controller.sign && creep.room.controller.sign.username != 'Yilmas')) {
                if (creep.signController(creep.room.controller, config.SIGN_MESSAGE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }

            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { reusePath: 50 });
            }
        }

    }
}

/****************************/
/******* ROOM BOOSTER *******/
/****************************/

brain.roles.roleRoomBooster = function (creep, task) {
    if (task.hasResource) {
        if (creep.room.name != task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    } else {
        if (creep.room.name != task.startPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.roomName));
        } else {
            if (creep.harvest(Game.getObjectById(task.endPoint.id)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(task.endPoint.id));
            }
        }
    }
}

/************************/
/******* ATTACKER *******/
/************************/

brain.roles.roleAttacker = function (creep, task) {

    let squad = Memory.squads[creep.memory.task.squad];

    if (squad.squadType == 'attack') {
        if (!squad.attacking && creep.room.name != task.startPoint.room.name) {
            // move to rendevour point
            creep.moveTo(new RoomPosition(25, 25, task.startPoint.room.name));
        } else if (squad.attacking) {
            // start the attack

            // avoid room changing
            utils.avoidRoomEdge(creep);

            if (creep.room.name != task.endPoint.roomName) {
                creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName));
            } else {

                // start the actual attack
                let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                let hostilesStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) =>
                        s.structureType == STRUCTURE_TOWER ||
                        s.structureType == STRUCTURE_SPAWN
                }
                );

                if (hostiles) {
                    creep.rangedAttack(hostiles);
                    if (creep.attack(hostiles) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostiles);
                    }
                } else if (hostilesStructures) {
                    creep.rangedAttack(hostilesStructures);
                    if (creep.attack(hostilesStructures) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostilesStructures);
                    }
                }
            }
        } else if (!squad.attacking && creep.room.name == task.startPoint.room.name && creep.pos != task.startPoint.pos) {
            // move closer to rendevour point
            creep.moveTo(new RoomPosition(task.startPoint.pos.x, task.startPoint.pos.y, task.startPoint.pos.roomName));
        }
    } else if (squad.squadType == 'defend') {

        if (creep.room.name != task.endPoint.roomName) {
            creep.moveTo(new RoomPosition(25, 25, task.endPoint.roomName));
        } else if (creep.room.name == task.startPoint.name) {
            // attack if hostile creeps exist
            let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            let hostileStructures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (s) =>
                    (s.structureType == STRUCTURE_TOWER && s.energy == 0) ||
                    (s.structureType == STRUCTURE_SPAWN && s.energy == 0) ||
                    (s.structureType == STRUCTURE_EXTENSION && s.energy == 0) ||
                    (s.structureType == STRUCTURE_TERMINAL && _.sum(s.store) == 0) ||
                    (s.structureType == STRUCTURE_LINK && s.energy == 0) ||
                    (s.structureType == STRUCTURE_STORAGE && _.sum(s.store) == 0) ||
                    (s.structureType == STRUCTURE_EXTRACTOR)
            }
            );

            if (hostiles) {

                creep.rangedMassAttack();
                if (creep.attack(hostiles) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles);
                }
            } else if (hostileStructures) {
                creep.rangedAttack(hostileStructures);
                if (creep.attack(hostileStructures) == ERR_NOT_IN_RANGE) {
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

brain.roles.roleSpecialCreep = function (creep, task) {
    if (_.sum(creep.carry) > 0) task.hasResource = true;
    let mineralType = undefined;

    if (task.hasResource) {
        for (let item in creep.carry) {
            if (item != RESOURCE_ENERGY) mineralType = item;
        }

        if (creep.transfer(creep.room.terminal, mineralType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.terminal);
        }

    } else if (!task.hasResource) {
        for (let item in creep.room.storage.store) {
            if (item != RESOURCE_ENERGY) mineralType = item;
        }

        if (creep.withdraw(creep.room.storage, mineralType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
        }
    }
}