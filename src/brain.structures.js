brain.structures = {};

brain.structures.manager = () => {
    for (let roomName in Game.rooms) {
        let city = Game.rooms[roomName];

        if ((towers = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER })) !== undefined) {
            brain.structures.towers(city, towers);
        }

        if ((links = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_LINK })) !== undefined) {
            brain.structures.links(city, links);
        }

        if ((labs = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_LAB })) !== undefined) {
            brain.structures.labs(city, labs);
        }
    }
}

brain.structures.towers = (city, towers) => {
    let hostiles = city.find(FIND_HOSTILE_CREEPS);

    if (hostiles.length && !_.contains(config.WHITE_LIST, hostiles[0].owner.username)) {

        let hostileHealers = _.filter(hostiles, function(hostile) {
            return _.some(hostile.body, { 'type': 'heal' });
        });

        if (hostileHealers) {
            towers.forEach(tower => tower.attack(hostileHealers[0]));
        } else {
            towers.forEach(tower => tower.attack(hostiles[0]));
        }

    } else {
        for (let tower of towers) {
            if (tower.energy > 600) {
                let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax && s.hits < 250000
                });

                let closestDamagedRampart = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_RAMPART && s.hits < s.hitsMax && s.hits < config.wallOrRampartTargetHitPoints(tower.room.name)
                });

                let closestDamagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_WALL && s.hits < s.hitsMax && s.hits < config.wallOrRampartTargetHitPoints(tower.room.name)
                });

                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                } else if (city.storage && city.storage.store.energy > 20000) {
                    if (closestDamagedRampart) {
                        tower.repair(closestDamagedRampart);
                    } else if (closestDamagedWall) {
                        tower.repair(closestDamagedWall);
                    }
                }
            }
        }
    }
}

brain.structures.links = (city, links) => {
    // Script for managing links
    if (city.storage) {
        let storageLink = city.storage.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK }[0]);
        let controllerLink = city.controller.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK }[0]);
        
        if (storageLink && controllerLink) {
            if (city.controller.level >= 6) {
                if (storageLink.energy > 200 && controllerLink.energy < 400) {
                    storageLink.transferEnergy(controllerLink);
                }

                for (let source of city.find(FIND_SOURCES)) {
                    let sourceLink = source.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
                    if (sourceLink) {
                        if (controllerLink.energy < 600) {
                            sourceLink.transferEnergy(controllerLink);
                        } else {
                            sourceLink.transferEnergy(storageLink);
                        }
                    }
                }
            }
            if (storageLink.energy > 600 && controllerLink.energy < 400) {
                storageLink.transferEnergy(controllerLink);
            }
        }
    }
}

brain.structures.labs = (city, labs) => {
    
}