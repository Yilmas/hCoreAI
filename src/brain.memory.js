//config_brain_memory

brain.memory = {
    prepareMemory: function () {
        //set all memory footprints
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];

            if (!room.controller) continue;

            // Start Script for setting all role information
            if (!room.memory.roles) {
                config.log(2, 'Start Script for setting role information for room: ' + roomName);

                room.memory.roles = {
                    roleHarvester: {
                        id: 'harvester',
                        amountOfHarvesters: 0,
                        operation: {
                            small: {
                                minimumOfHarvesters: 0, // Number will be set by amount of sources
                                bodyParts: [WORK, WORK, CARRY, MOVE] //300
                            },
                            medium: {
                                minimumOfHarvesters: 0, // Number will be set by amount of sources
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE] //700
                            },
                            large: {
                                minimumOfHarvesters: 0, // Number will be set by amount of sources
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] //750
                            }
                        }
                    },
                    roleCarrier: {
                        id: 'carrier',
                        amountOfCarriers: 0,
                        operation: {
                            small: {
                                minimumOfCarriers: 0, // Number will be set by amount of sources
                                bodyParts: [] //0
                            },
                            medium: {
                                minimumOfCarriers: 0, // Number will be set by amount of sources
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //600
                            },
                            large: {
                                minimumOfCarriers: 0, // Number will be set by amount of sources
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //600
                            }
                        }
                    },
                    roleDistributor: {
                        id: 'distributor',
                        amountOfDistributors: 0,
                        operation: {
                            small: {
                                minimumOfDistributors: 0, // Number will be set by amount of sources
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE] //300
                            },
                            medium: {
                                minimumOfDistributors: 0, // Number will be set by amount of sources
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //600
                            },
                            large: {
                                minimumOfDistributors: 0, // Number will be set by amount of sources
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] //900
                            }
                        }
                    },
                    roleBuilder: {
                        id: 'builder',
                        amountOfBuilders: 0,
                        operation: {
                            small: {
                                minimumOfBuilders: 1,
                                bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE] //300
                            },
                            medium: {
                                minimumOfBuilders: 1, //2
                                bodyParts: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] //650
                            },
                            large: {
                                minimumOfBuilders: 1, //2
                                bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY] //1700
                            }
                        }
                    },
                    roleUpgrader: {
                        id: 'upgrader',
                        amountOfUpgraders: 0,
                        operation: {
                            small: {
                                minimumOfUpgraders: 3,
                                bodyParts: [WORK, WORK, CARRY, MOVE] //300
                            },
                            medium: {
                                minimumOfUpgraders: 2,
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] //750
                            },
                            large: {
                                minimumOfUpgraders: 1,
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE] //1350
                            }
                        }
                    },
                    roleCollector: {
                        id: 'collector',
                        amountOfCollectors: 0,
                        operation: {
                            small: {
                                minimumOfCollectors: 0,
                                bodyParts: [] //0
                            },
                            medium: {
                                minimumOfCollectors: 2,
                                bodyParts: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //650
                            },
                            large: {
                                minimumOfCollectors: 2,
                                bodyParts: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE] //800
                            }
                        }
                    },
                    roleBridge: {
                        id: 'bridge',
                        amountOfBridges: 0,
                        operation: {
                            small: {
                                minimumOfBridges: 0,
                                bodyParts: [] //0
                            },
                            medium: {
                                minimumOfBridges: 1,
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //600
                            },
                            large: {
                                minimumOfBridges: 1,
                                bodyParts: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE] //600
                            }
                        }
                    },
                    roleMiner: {
                        id: 'miner',
                        amountOfMiners: 0,
                        operation: {
                            small: {
                                minimumOfMiners: 0,
                                bodyParts: []
                            },
                            medium: {
                                minimumOfMiners: 0,
                                bodyParts: []
                            },
                            large: {
                                minimumOfMiners: 1,
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] //750
                            }
                        }
                    },
                    roleClaimer: {
                        id: 'claimer',
                        amountOfClaimers: 0,
                        operation: {
                            small: {
                                minimumOfClaimers: 0,
                                bodyParts: [] //0
                            },
                            medium: {
                                minimumOfClaimers: 0,
                                bodyParts: [CLAIM, CLAIM, MOVE, MOVE] //1300
                            },
                            large: {
                                minimumOfClaimers: 0,
                                bodyParts: [CLAIM, CLAIM, MOVE, MOVE] //1300
                            }
                        }
                    },
                    roleProspector: {
                        id: 'prospector',
                        amountOfProspectors: 0,
                        operation: {
                            small: {
                                minimumOfProspectors: 0,
                                bodyParts: [] //0
                            },
                            medium: {
                                minimumOfProspectors: 0,
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] //750
                            },
                            large: {
                                minimumOfProspectors: 0,
                                bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] //750
                            }
                        }
                    },
                    roleAttacker: {
                        id: 'attacker',
                        operation: {
                            small: {
                                bodyParts: [] //0
                            },
                            medium: {
                                bodyParts: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK] //750
                            },
                            large: {
                                bodyParts: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK] //1450
                            }
                        }
                    },
                    roleHealer: {
                        id: 'healer',
                        operation: {
                            small: {
                                bodyParts: [] //0
                            },
                            medium: {
                                bodyParts: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL] //750
                            },
                            large: {
                                bodyParts: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL] //1600
                            }
                        }
                    }
                }
            }

            // Start Script for setting all sources in room
            if (!room.memory.sources) {
                config.log(2, 'Start Script for setting all sources in room');
                room.memory.sources = {};

                for (let source of room.find(FIND_SOURCES)) {
                    let sourceId = source.id;
                    let pos = source.pos;

                //let availableSpots = utils.getTerrainAroundRoomPos('plain', new RoomPosition(pos.x, pos.y, roomName)).length;

                    room.memory.sources[sourceId] = {};

                    room.memory.sources[sourceId] = {
                        source: sourceId,
                        totalSpots: 1,
                        openSpots: 1,
                        harvesters: 0,
                        carriers: 0
                    }
                };
            }

            // Reload operations, set minimumOfHarvesters and minimumOfCarriers to number of sources
            let sources = Object.keys(room.memory.sources).length;

            room.memory.roles.roleHarvester.operation.small.minimumOfHarvesters = sources;
            room.memory.roles.roleHarvester.operation.medium.minimumOfHarvesters = sources;
            room.memory.roles.roleHarvester.operation.large.minimumOfHarvesters = sources;
            room.memory.roles.roleCarrier.operation.medium.minimumOfCarriers = sources;
            room.memory.roles.roleCarrier.operation.large.minimumOfCarriers = sources;
            room.memory.roles.roleDistributor.operation.small.minimumOfDistributors = sources;
            room.memory.roles.roleDistributor.operation.medium.minimumOfDistributors = sources;
            room.memory.roles.roleDistributor.operation.large.minimumOfDistributors = sources;

            room.memory.roles.roleProspector.operation.small.minimumOfProspectors = sources;
            room.memory.roles.roleProspector.operation.medium.minimumOfProspectors = sources;
            room.memory.roles.roleProspector.operation.large.minimumOfProspectors = sources;
        }

        // Start script for room reservation and claims
        if (!Memory.claimList) {
            Memory.claimList = {};
        }
        // roomTypes = { MainBase, Outpost, Mine, Hostile }
        if (!Memory.claimList['E27S83']) {
            Memory.claimList['E27S83'] = {
                roomType: 'MainBase'
            }
        }

        if (!Memory.claimList['E26S83']) {
            Memory.claimList['E26S83'] = {
                roomType: 'Outpost',
                parentRoom: 'E27S83',
                task: {
                    useCollectors: false,
                    collectorCount: 0,
                    isClaimed: true,
                    hasClaimer: true,
                    useBooster: false,
                    useInterRoomTransport: false
                }
            }
        }

        if (!Memory.claimList['E27S82']) {
            Memory.claimList['E27S82'] = {
                roomType: 'Mine',
                parentRoom: 'E27S83',
                task: {
                    useCollectors: true,
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E27S84']) {
            Memory.claimList['E27S84'] = {
                roomType: 'Mine',
                parentRoom: 'E27S83',
                task: {
                    useCollectors: true,
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E26S82']) {
            Memory.claimList['E26S82'] = {
                roomType: 'Mine',
                parentRoom: 'E26S83',
                task: {
                    useCollectors: true,
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E25S83']) {
            Memory.claimList['E25S83'] = {
                roomType: 'Mine',
                parentRoom: 'E26S83',
                task: {
                    useCollectors: true,
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E27S85']) {
            Memory.claimList['E27S85'] = {
                roomType: 'Mine',
                parentRoom: 'E27S83',
                task: {
                    useCollectors: true,
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E29S85']) {
            Memory.claimList['E29S85'] = {
                roomType: 'Outpost',
                parentRoom: 'E27S83',
                task: {
                    useCollectors: false,
                    collectorCount: 0,
                    isClaimed: false,
                    hasClaimer: false,
                    useBooster: false,
                    useInterRoomTransport: false
                }
            }
        }

        if (!Memory.claimList['E29S84']) {
            Memory.claimList['E29S84'] = {
                roomType: 'Mine', // outpost, mine, base
                parentRoom: 'E29S85',
                task: {
                    useCollectors: false, // start with false, once all constructions are complete change to true
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E25S81']) {
            Memory.claimList['E25S81'] = {
                roomType: 'Mine', // outpost, mine, base
                parentRoom: 'E24S81',
                task: {
                    useCollectors: false, // start with false, once all constructions are complete change to true
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E28S84']) {
            Memory.claimList['E28S84'] = {
                roomType: 'Mine', // outpost, mine, base
                parentRoom: 'E29S85',
                task: {
                    useCollectors: false, // start with false, once all constructions are complete change to true
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E28S86']) {
            Memory.claimList['E28S86'] = {
                roomType: 'Outpost',
                parentRoom: 'E29S85',
                task: {
                    useCollectors: false,
                    collectorCount: 0,
                    isClaimed: false,
                    hasClaimer: false,
                    useBooster: false,
                    useInterRoomTransport: false
                }
            }
        }

        if (!Memory.claimList['E29S86']) {
            Memory.claimList['E29S86'] = {
                roomType: 'Mine', // outpost, mine, base
                parentRoom: 'E28S86',
                task: {
                    useCollectors: false, // start with false, once all constructions are complete change to true
                    collectorCount: 0,
                    hasReserver: false
                }
            }
        }

        if (!Memory.claimList['E22S84']) {
            Memory.claimList['E22S84'] = {
                roomType: 'Outpost',
                parentRoom: 'E24S81',
                task: {
                    useCollectors: false,
                    collectorCount: 0,
                    isClaimed: false,
                    hasClaimer: false,
                    useBooster: false,
                    useInterRoomTransport: false
                }
            }
        }


        //if (!Memory.claimList['targetRoom']) {
        //    Memory.claimList['targetRoom'] = {
        //        roomType: 'type', // outpost, mine, base
        //        parentRoom: 'parentRoom',
        //        task: {
        //            useCollectors: false, // start with false, once all constructions are complete change to true
        //            collectorCount: 0,
        //            hasReserver: false
        //        }
        //    }
        //}


        // Squad System
        if (!Memory.squads) {
            Memory.squads = {};
        }

        if (!Memory.squads['E27S84']) {
            Memory.squads['E27S84'] = {
                squadBase: 'E27S83',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E27S85']) {
            Memory.squads['E27S85'] = {
                squadBase: 'E27S83',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E25S83']) {
            Memory.squads['E25S83'] = {
                squadBase: 'E26S83',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E29S84']) {
            Memory.squads['E29S84'] = {
                squadBase: 'E29S85',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E25S81']) {
            Memory.squads['E25S81'] = {
                squadBase: 'E24S81',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E28S83']) {
            Memory.squads['E28S83'] = {
                squadBase: 'E27S83',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E28S86']) {
            Memory.squads['E28S86'] = {
                squadBase: 'E29S85',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        if (!Memory.squads['E29S86']) {
            Memory.squads['E29S86'] = {
                squadBase: 'E28S86',
                squadType: 'defend', //attack, defend
                squadHasSpawned: false,
                attacking: false,
                squadSize: 1,
                attackers: 1,
                healers: 0,
                squadMembers: {
                }
            }
        }

        //if (!Memory.squads['targetRoom']) {
        //    Memory.squads['targetRoom'] = {
        //        squadBase: 'spawnRoom',
        //        squadType: 'type', //attack, defend
        //        squadHasSpawned: false,
        //        attacking: false,
        //        squadSize: 0,
        //        attackers: 0,
        //        healers: 0,
        //        squadMembers: {
        //        }
        //    }
        //}

        if (!Memory.scouts) {
            Memory.scouts = {};
        }
    },

    refreshMemory: function () {
        //Decommision unused creeps
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                config.log(2, 'Clearing non-existing creep memory: ' + name);
            }
        }

        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];

            if (!room.controller) continue;

            for (let source in Memory.rooms[roomName].sources) {
                let amountOfHarvesters = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'harvester' && c.memory.task.startPoint.id == source);



                let remainingSpots = Memory.rooms[roomName].sources[Game.getObjectById(source).id].totalSpots - amountOfHarvesters;
                Memory.rooms[roomName].sources[Game.getObjectById(source).id].openSpots = remainingSpots;
                Memory.rooms[roomName].sources[Game.getObjectById(source).id].harvesters = amountOfHarvesters;

                let sourceContainer = Game.getObjectById(source).pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
                let amountOfCarriers = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'carrier' && c.memory.task.startPoint.id == sourceContainer.id);
                Memory.rooms[roomName].sources[Game.getObjectById(source).id].carriers = amountOfCarriers;
            }

            room.memory.roles.roleHarvester.amountOfHarvesters = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'harvester');
            room.memory.roles.roleCarrier.amountOfCarriers = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'carrier');
            room.memory.roles.roleDistributor.amountOfDistributors = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'distributor');
            room.memory.roles.roleBuilder.amountOfBuilders = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'builder');
            room.memory.roles.roleUpgrader.amountOfUpgraders = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'upgrader');
            room.memory.roles.roleBridge.amountOfBridges = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'bridge');
            room.memory.roles.roleMiner.amountOfMiners = _.sum(Game.creeps, (c) => c.room.name == roomName && c.memory.task.role == 'miner');
        }

        for (let claimName in Memory.claimList) {
            let claim = Memory.claimList[claimName];
            if (claim.roomType == 'Mine') {
                claim.task.collectorCount = _.sum(Game.creeps, (c) => c.memory.task.role == 'collector' && c.memory.task.startPoint.roomName == claimName);
                claim.task.hasReserver = _.sum(Game.creeps, (c) => c.memory.task.role == 'claimer' && c.memory.task.endPoint.roomName == claimName) == 1;

                if (Memory.rooms[claimName]) {
                    Memory.rooms[claimName].roles.roleProspector.amountOfProspectors = _.sum(Game.creeps, (c) => c.memory.task.role == 'prospector' && !isNullOrUndefined(Game.getObjectById(c.memory.task.endPoint.id)) && Game.getObjectById(c.memory.task.endPoint.id).room.name == claimName);
                    for (let source in Memory.rooms[claimName].sources) {

                        if (Game.getObjectById(source)) {
                            let amountOfProspectors = _.sum(Game.creeps, (c) => c.memory.task.role == 'prospector' && c.memory.task.endPoint.id == source);

                            let remainingSpots = Memory.rooms[claimName].sources[Game.getObjectById(source).id].totalSpots - amountOfProspectors;
                            Memory.rooms[claimName].sources[Game.getObjectById(source).id].openSpots = remainingSpots;
                            Memory.rooms[claimName].sources[Game.getObjectById(source).id].harvesters = amountOfProspectors;
                        }
                    }
                }
            }
            if (claim.roomType == 'Outpost') {
                claim.task.collectorCount = _.sum(Game.creeps, (c) => c.memory.task.role == 'collector' && c.memory.task.startPoint.roomName == claimName);
                if (Game.rooms[claimName] != undefined) {
                    claim.task.isClaimed = Game.rooms[claimName].controller.my;
                }
                claim.task.hasClaimer = _.sum(Game.creeps, (c) => c.memory.task.role == 'claimer' && c.memory.task.endPoint.roomName == claimName) > 0;

                if (Game.rooms[claimName]) {
                    let outpostSpawn = Game.rooms[claimName].find(FIND_MY_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
                    if (outpostSpawn.length > 0) {
                        Memory.rooms[claimName].roles.roleProspector.amountOfProspectors = _.sum(Game.creeps, (c) => c.memory.task.role == 'prospector' && Game.getObjectById(c.memory.task.endPoint.id).room.name == claimName);
                        for (let source in Memory.rooms[claimName].sources) {
                            let amountOfProspectors = _.sum(Game.creeps, (c) => c.memory.task.role == 'prospector' && c.memory.task.endPoint.id == source);
                            let remainingSpots = Memory.rooms[claimName].sources[Game.getObjectById(source).id].totalSpots - amountOfProspectors;
                            Memory.rooms[claimName].sources[Game.getObjectById(source).id].openSpots = remainingSpots;
                            Memory.rooms[claimName].sources[Game.getObjectById(source).id].harvesters = amountOfProspectors;
                        }
                    }
                }
            }
        }

        for (let squadName in Memory.squads) {
            let squad = Memory.squads[squadName];
            let squadMembers = _.filter(Game.creeps, (c) => c.memory.task.squad == squadName);

            squad.squadHasSpawned = squadMembers.length == squad.squadSize;

            if (!squad.attacking) {
                let forwardBase = Game.flags[squadName];
                let squadIsInRange = false;

                for (let creepTag in squadMembers) {
                    let creep = squadMembers[creepTag];
                    let range = creep.pos.getRangeTo(forwardBase);
                    squadIsInRange = range <= 3;
                }

                if (squadIsInRange) {
                    squad.attacking = true;
                }
            }
        }
    }
}