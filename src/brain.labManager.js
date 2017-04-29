brain.labManager = {};

brain.labManager.start = function () {
    brain.memory.setupReaction();

    // TODO: Loop creeps that are of role == laborant
    for (let creep of _.filter(Game.creeps, (c) => c.memory.task.role == 'laborant')) {
        let task = creep.memory.task;

        if (!task.focusReaction) {
            task.focusReaction = '';
        }

        let reactions = _.filter(creep.room.memory.reactions, (r) => r.isActive);
        for (let reaction in reactions) {

            let labInput1 = Game.getObjectById(reaction.lab1.id);
            let labInput2 = Game.getObjectById(reaction.lab2.id);
            let labOutput = Game.getObjectById(reaction.resultLab.id);

            if (reaction.emptyFacilities && task.focusReaction == reaction.longName) {
                // Check if facility is indeed empty, if it is set isActive to false
                if (labInput1.mineralAmount == 0 && labInput2.mineralAmount == 0 && labOutput.mineralAmount == 0) {
                    reaction.emptyFacilities = false;
                    reaction.isActive = false;
                    task.focusReaction = '';
                } else {
                    // Empty all labs associated with this reaction
                    if (!task.hasResource) {
                        // pickup resources

                        if (labInput1.mineralAmount > 0) {
                            if (creep.withdraw(labInput1, labInput1.mineralType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(labInput1);
                            }
                        } else if (labInput2.mineralAmount > 0) {
                            if (creep.withdraw(labInput2, labInput2.mineralType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(labInput2);
                            }
                        } else if (labOutput.mineralAmount > 0) {
                            if (creep.withdraw(labOutput, labOutput.mineralType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(labOutput);
                            }
                        }

                    } else if (task.hasResource) {
                        // dropoff resources

                        let mineralType = undefined;
                        for (let item in creep.carry) {
                            if (item != RESOURCE_ENERGY)
                                mineralType = item;
                        }

                        if (creep.transfer(creep.room.terminal, mineralType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal);
                        }
                    }
                    break; // Stop the loop, until facility is empty
                }
            } else {

                let mineralType = undefined;
                for (let item in creep.carry) {
                    if (item != RESOURCE_ENERGY)
                        mineralType = item;
                }

                if (creep.carryCapacity <= (labInput1.mineralCapacity - labInput1.mineralAmount) && mineralType == labInput1.mineralType) {
                    // Fill labInput1 with minerals
                    if (!task.hasResource) {
                        // pickup resources
                        if (creep.withdraw(creep.room.terminal, labInput1.mineralType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal);
                        }
                    } else if (task.hasResource) {
                        // dropoff resources
                        if (creep.transfer(labInput1, labInput1.mineralType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(labInput1);
                        }
                    }
                    break; // avoid doing more than one reaction per creep
                } else if (creep.carryCapacity <= (labInput2.mineralCapacity - labInput2.mineralAmount) && mineralType == labInput2.mineralType) {
                    // Fill labInput2 with minerals
                    if (!task.hasResource) {
                        // pickup resources
                        if (creep.withdraw(creep.room.terminal, labInput2.mineralType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.terminal);
                        }
                    } else if (task.hasResource) {
                        // dropoff resources
                        if (creep.transfer(labInput2, labInput2.mineralType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(labInput2);
                        }
                    }
                    break; // avoid doing more than one reaction per creep
                } else if (labOutput.mineralAmount == labOutput.mineralCapacity || reaction.emptyResultLab) {
                    if (labOutput.mineralAmount == 0 && reaction.emptyResultLab && _.sum(creep.carry) == 0) {
                        // Stop emptying result lab
                        reaction.emptyResultLab = false;
                        continue; // continue to next reaction(s) doing more than one reaction
                    } else {
                        // Empty result lab
                        if (!task.hasResource) {
                            // pickup resources
                            if (creep.withdraw(labOutput, labOutput.mineralType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(labOutput);
                            }
                        } else if (task.hasResource) {
                            // dropoff resources
                            if (creep.transfer(creep.room.terminal, mineralType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.terminal);
                            }
                        }
                        break; // avoid doing more than one reaction per creep
                    }
                }
            }
        }
    }

    // TODO: Loop rooms that are of room.controller.level >= 7
    for (let roomName in Game.rooms) {
        brain.labManager.runReactions(roomName);
    }
};

brain.labManager.runReactions = roomName => {
    let room = Game.rooms[roomName];
    if (room.memory.reactions) {

        for (let reactionId in room.memory.reactions) {
            let reaction = room.memory.reactions[reactionId];

            let labInput1 = Game.getObjectById(reaction.lab1.id);
            let labInput2 = Game.getObjectById(reaction.lab2.id);
            let outputLab = Game.getObjectById(reaction.resultLab.id);

            if ((labInput1.mineralAmount > 0 && labInput2.mineralAmount > 0) && ((labInput1.mineralAmount >= labInput2.mineralAmount || labInput2.mineralAmount >= labInput1.mineralAmount) || reaction.isRunning)) {
                // run reaction
                reaction.isRunning = true;

                //config.log(3, '[Lab] Room: ' + roomName + ' | Reaction: Running');
                if (outputLab.runReaction(labInput1, labInput2) == ERR_NOT_ENOUGH_RESOURCES) {
                    reaction.isRunning = false;
                }
            } else {
                reaction.isRunning = false;
            }
        }
    }
}

brain.memory.setupReaction = function () {

    if (!Memory.rooms['E27S83'].reactions) {
        Memory.rooms['E27S83'].reactions = {
            UO: {
                longName: 'utriumOxide',
                isActive: false,
                isRunning: false,
                emptyFacilities: false,
                emptyResultLab: false,
                lab1: {
                    id: '58c6f3acdb541b3ef7ebb703',
                    resourceType: RESOURCE_UTRIUM
                },
                lab2: {
                    id: '58c6e5cd1016063aefbde12a',
                    resourceType: RESOURCE_OXYGEN
                },
                resultLab: {
                    id: '58c7079fccd761eb2cc8e764',
                    resourceType: RESOURCE_UTRIUM_OXIDE
                }
            },
            HO: {
                longName: 'hydroxide',
                isActive: false,
                isRunning: false,
                emptyFacilities: false,
                emptyResultLab: false,
                lab1: {
                    id: '58f3e68b1fe8e65ec104f9dd',
                    resourceType: RESOURCE_HYDROGEN
                },
                lab2: {
                    id: '58f411b1c9f94768a30cdf88',
                    resourceType: RESOURCE_OXYGEN
                },
                resultLab: {
                    id: '58f3fe5f1b5d2e6a5b8a9f0d',
                    resourceType: RESOURCE_HYDROXIDE
                }
            }
        }
    }

};

global.brain.labManager.stopReaction = (roomName, reactionName) => {
    let room = Game.rooms[roomName];

    for (let reaction in room.memory.reactions) {
        if (reaction.longName == reactionName) {
            // Set reaction to empty
            reaction.emptyFacilities = true;

            // Set laborants to focus the reaction

            const creeps = room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.task.role === 'laborant' });
            creeps.forEach((c) => {
                c.memory.task.focusReaction = 'reaction name';

                config.log(3, '[Lab Manager] Creep: ' + c.name + ' is focusing reaction: ' + reactionName);
            });
        } else {
            config.log(3, '[Lab Manager] No reaction \' ' + reactionName + ' \' in room ' + roomName);
        }
    }
}