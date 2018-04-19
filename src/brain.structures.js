brain.structures = {};

brain.structures.manager = () => {
    for (let roomName in Game.rooms) {
        let city = Game.rooms[roomName];

        if ((towers = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER })) !== undefined) {
            brain.structures.towers(city, towers);
        }

        //brain.structures.terminals(city);

        if ((links = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_LINK })) !== undefined) {
            brain.structures.links(city, links);
        }

        if ((labs = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_LAB })) !== undefined) {
            brain.structures.labs(city, labs);
        }

        if (city.controller && city.controller.level > 6) {
            let spawners = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_SPAWN });
            for (let spawn of spawners) {
                if (spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 2, { filter: (s) => s.owner && !_.contains(config.WHITE_LIST, s.owner.username) }).length) {
                    spawn.room.controller.activateSafeMode();
                }
            }
        }

        brain.structures.ramps(city);
    }
}

brain.structures.ramps = (city) => {
    let ramps = city.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART });
    for (let ramp of ramps) {
        if (ramp.pos.findInRange(FIND_HOSTILE_CREEPS, 2, { filter: (s) => s.owner && _.contains(config.WHITE_LIST, s.owner.username) }).length) {
            ramp.setPublic(true);
        } else {
            ramp.setPublic(false);
        }
    }
}

brain.structures.towers = (city, towers) => {
    let hostiles = city.find(FIND_HOSTILE_CREEPS, { filter: (s) => s.owner && !_.contains(config.WHITE_LIST, s.owner.username) });

    if (hostiles.length) {
        let invaders = hostiles.filter(s => s.owner.username === 'Invader');
        let enemyAIs = hostiles.filter(s => s.owner.username !== 'Invader' && (s.getActiveBodyparts(WORK) || s.getActiveBodyparts(ATTACK) || s.getActiveBodyparts(RANGED_ATTACK) || s.getActiveBodyparts(CARRY)));

        if (invaders) {
            towers.forEach(tower => tower.attack(invaders[0]));
        } else if (enemyAIs.length) {

            let hostileHealers = hostiles.filter(s => s.owner.username !== 'Invader' && s.getActiveBodyparts(HEAL));

            if (hostileHealers.length) {
                towers.forEach(tower => tower.attack(hostileHealers[0]));
            } else {
                towers.forEach(tower => tower.attack(hostiles[0]));
            }

        }
    } else {
        for (let tower of towers) {
            if (tower.energy > 800) {
                let closestDamagedRampart = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_RAMPART && s.hits < s.hitsMax && (s.hits / config.wallOrRampartTargetHitPoints(tower.room.name) * 100 < 95)
                });

                if ((damagedCreep = city.find(FIND_MY_CREEPS, { filter: (s) => s.hits < s.hitsMax })).length) {
                    tower.heal(damagedCreep[0]);
                } else if ((city.storage && city.storage.store.energy > 20000) || city.controller.level === 3) {
                    if (closestDamagedRampart) {
                        tower.repair(closestDamagedRampart);
                    }
                }
            }
        }
    }
}

brain.structures.links = (city, links) => {
    // Script for managing links
    if (city.storage) {
        let storageLink = city.storage.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];
        let controllerLink = city.controller.pos.findInRange(FIND_MY_STRUCTURES, 3, { filter: (s) => s.structureType === STRUCTURE_LINK })[0];

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
            } else if (storageLink.energy > 600 && controllerLink.energy < 400) {
                storageLink.transferEnergy(controllerLink);
            }
        }
    }
}

brain.structures.terminals = (city) => {
    let cityRange = 3;
    let roomQuantityTarget = 3000;

    if (city.name === 'W1S34') {

        let roomMineralType = city.find(FIND_MINERALS)[0].mineralType;
        let mineralTypeToSend = undefined;

        for (let item in city.terminal.store) {

            if (item === RESOURCE_ENERGY) {
                continue;
            }

            if (city.controller.level === 7) {
                if (item === RESOURCE_GHODIUM_HYDRIDE || item === RESOURCE_GHODIUM_ACID || item === RESOURCE_CATALYZED_GHODIUM_ACID) {
                    continue;
                }
            }

            let mineral = city.terminal.store[item];

            if (item === roomMineralType) {
                if (mineral > config.MAX_MINERAL_IN_ROOM) {
                    console.log('a maximum of 50000');
                    console.log(item + ' ' + mineral);
                    mineralTypeToSend = item;
                }
                continue;
            } else if (mineral > roomQuantityTarget) {
                console.log('a maximum of 3000')
                console.log(item + ' ' + mineral);
                mineralTypeToSend = item;
            } else {
                continue;
            }
        }

        if (mineralTypeToSend) {
            let citiesInRange = [];
            for (let cityItem in Memory.empire.cities) {
                if (cityItem === city.name) continue;

                let cityMem = Memory.empire.cities[cityItem];

                if (Game.map.getRoomLinearDistance(city.name, cityItem) <= cityRange) {
                    citiesInRange.push(cityItem);
                }
            }

            for (let i = 0; i < citiesInRange.length; i++) {
                let remoteCity = Game.rooms[citiesInRange[i]];

                if (!remoteCity) continue;

                let remoteTerminal = remoteCity.terminal;

                if (!remoteTerminal.store[mineralTypeToSend] || remoteTerminal.store[mineralTypeToSend] < roomQuantityTarget) {
                    console.log('Room in range: ' + remoteTerminal.room.name);

                    // mineral to send: mineralTypeToSend
                    let amountToSend = remoteTerminal.store[mineralTypeToSend] ? roomQuantityTarget - remoteTerminal.store[mineralTypeToSend] : roomQuantityTarget;



                }



            }
        }
    }
}

brain.structures.labs = (city, labs) => {

    let cityMem = Memory.empire.cities[city.name];
    let reactionLab = _.filter(labs, lab => lab.pos.findInRange(labs, 1, { filter: (s) => s.structureType === STRUCTURE_LAB && s.id !== lab.id }).length === 2)[0];
    let inputLab1 = _.filter(labs, lab => lab.id !== reactionLab.id)[0];
    let inputLab2 = _.filter(labs, lab => lab.id !== reactionLab.id && lab.id !== inputLab1.id)[0];

    if (labs.length >= 3 && reactionLab.cooldown < 3 && (inputLab1 && inputLab1.mineralAmount > 0) && (inputLab2 && inputLab2.mineralAmount > 0)) {
        reactionLab.runReaction(inputLab1, inputLab2);
    }
}