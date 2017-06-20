brain.structureManager = function () {
    // Script for managing towers
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];

        let towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });

        let hostiles = room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length) {
            var userName = hostiles[0].owner.username;
            if (!_.contains(config.WHITE_LIST, userName) && userName != 'Drxx') {
                let hostileHealer;

                for (var hostile in hostiles) {
                    for (var item in hostile.body) {
                        var part = hostile.body[item];
                        if (part.type === 'heal') {
                            hostileHealer = hostile;
                        }
                    }
                }

                // TODO: Remove this clause once the room is empty of hostiles. And figure out a way to combat those creeps.
                //if(roomName == 'E29S85') {
                //    towers.forEach(tower => tower.repair(Game.getObjectById('58d1a4460551b0282bafcc89')));
                //} else {
                if (hostileHealer) {
                    // TODO: Does the tower not focus healers ?
                    towers.forEach(tower => tower.attack(hostileHealer));
                } else {
                    towers.forEach(tower => tower.attack(hostiles[0]));
                }
                //}


            }
        } else {
            for (let tower of towers) {
                if (tower.energy > 800) {
                    let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.hits < 100000 && s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL
                    });

                    let closestDamagedRampart = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.hits < config.wallOrRampartTargetHitPoints(tower.room.name) && s.structureType == STRUCTURE_RAMPART
                    });

                    let closestDamagedWall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.hits < config.wallOrRampartTargetHitPoints(tower.room.name) && s.structureType == STRUCTURE_WALL
                    });

                    if (!isNullOrUndefined(closestDamagedStructure)) {
                        tower.repair(closestDamagedStructure);
                    } else {
                        if (room.storage && room.storage.store.energy > 20000) {
                            if (!isNullOrUndefined(closestDamagedRampart)) {
                                tower.repair(closestDamagedRampart);
                            } else if (!isNullOrUndefined(closestDamagedWall)) {
                                tower.repair(closestDamagedWall);
                            }
                        }
                    }
                }
            }
        }

        // Script for managing links
        if (room.storage) {

            let link = room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });


            if (link) {
                let storageLink = room.storage.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });
                let controllerLink = room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK });

                if (storageLink && controllerLink) {
                    // only transfer energy if maximum efficient can be reached, and the receiver is empty.
                    if (storageLink.energy > 600 && controllerLink.energy < 400) {
                        storageLink.transferEnergy(controllerLink);
                    }
                }

                if (room.controller.level >= 6) {
                    // Code to start deliver harvested resources to controller link then base link
                    for (let source of room.find(FIND_SOURCES)) {
                        let sourceLink = source.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType == STRUCTURE_LINK })[0];
                        if (sourceLink) {
                            if (controllerLink.energy < 600) {
                                sourceLink.transferEnergy(controllerLink);
                            } else {
                                sourceLink.transferEnergy(storageLink);
                            }
                        }
                    }

                    if (storageLink.energy > 200 && controllerLink.energy < 400) {
                        storageLink.transferEnergy(controllerLink);
                    }
                }
            }
        }

    }
}