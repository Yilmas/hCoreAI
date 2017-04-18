brain.labManager = {};

brain.labManager.start = function () {
    brain.memory.setupReaction();

    // TODO: Loop creeps that are of role == laborant
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        let task = creep.memory.task;
        if (task.role == 'laborant') {
            // role management of laborant

            if (!task.emptyResultLab) {
                task.emptyResultLab = false;
            }

            if (task.hasResource && _.sum(creep.carry) == 0) {
                task.hasResource = false;
            }
            if (!task.hasResource && _.sum(creep.carry) == creep.carryCapacity) {
                task.hasResource = true;
            }


            let reaction = creep.room.memory.reactions['UH'];

            let lab1 = Game.getObjectById(reaction.lab1.id);
            let lab1Type = reaction.lab1.resourceType;
            let lab2 = Game.getObjectById(reaction.lab2.id);
            let lab2Type = reaction.lab2.resourceType;
            let resultLab = Game.getObjectById(reaction.resultLab.id);
            let resultLabType = reaction.lab1.resourceType;
            let terminal = creep.room.terminal;

            if (resultLab.mineralAmount == resultLab.mineralCapacity) {
                task.emptyResultLab = true;
            }
            if (resultLab.mineralAmount == 0) {
                task.emptyResultLab = false;
            }

            if (resultLab.mineralAmount != resultLab.mineralCapacity && !task.emptyResultLab) {
                // Fill Labs
                if (lab1.mineralAmount < lab1.mineralCapacity && creep.carryCapacity <= (lab1.mineralCapacity - lab1.mineralAmount)) {
                    // fill lab1
                    if (!task.hasResource) {
                        if (creep.withdraw(terminal, lab1Type) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
                    }
                    if (task.hasResource) {
                        if (creep.transfer(lab1, lab1Type) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(lab1);
                        }
                    }

                } else if (lab2.mineralAmount < lab2.mineralCapacity && creep.carryCapacity <= (lab2.mineralCapacity - lab2.mineralAmount)) {
                    // fill lab2

                    if (!task.hasResource) {
                        if (creep.withdraw(terminal, lab2Type) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
                    }
                    if (task.hasResource) {
                        if (creep.transfer(lab2, lab2Type) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(lab2);
                        }
                    }

                } else {
                    if (_.sum(creep.carry) != 0) {
                        // clean creep capacity

                        let mineralType = undefined;
                        for (let item in creep.carry) {
                            if (item != RESOURCE_ENERGY)
                                mineralType = item;
                        }

                        if (creep.transfer(terminal, mineralType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
                    }
                }
            } else if (task.emptyResultLab) {
                // Empty resultLab
                if (_.sum(creep.carry) != 0) {
                    // clean creep capacity

                    let mineralType = undefined;
                    for (let item in creep.carry) {
                        if (item != RESOURCE_ENERGY)
                            mineralType = item;
                    }

                    if (creep.transfer(terminal, mineralType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    }
                } else {
                    if (creep.withdraw(resultLab, resultLabType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resultLab);
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
            let reactionType = reaction.longName;

            if (reactionType == 'utriumHydride') {
                let utriumLab = Game.getObjectById(reaction.lab1.id);
                let hydrogenLab = Game.getObjectById(reaction.lab2.id);
                let utriumHydrideLab = Game.getObjectById(reaction.resultLab.id);

                if ((utriumLab.mineralAmount >= hydrogenLab.mineralAmount && hydrogenLab.mineralAmount >= utriumLab.mineralAmount) || reaction.isRunning) {
                    // run reaction
                    reaction.isRunning = true;

                    //config.log(3, '[Lab] Room: ' + roomName + ' | Reaction: Running');
                    if (utriumHydrideLab.runReaction(utriumLab, hydrogenLab) == ERR_NOT_ENOUGH_RESOURCES) {
                        reaction.isRunning = false;
                    }
                } else {
                    reaction.isRunning = false;
                }
            }
        }
    }
}

brain.memory.setupReaction = function () {

    if (!Memory.rooms['E27S83'].reactions) {
        Memory.rooms['E27S83'].reactions = {
            UH: {
                longName: 'utriumHydride',
                isRunning: false,
                lab1: {
                    id: '58c6f3acdb541b3ef7ebb703',
                    resourceType: RESOURCE_UTRIUM
                },
                lab2: {
                    id: '58c6e5cd1016063aefbde12a',
                    resourceType: RESOURCE_HYDROGEN
                },
                resultLab: {
                    id: '58c7079fccd761eb2cc8e764',
                    resourceType: RESOURCE_UTRIUM_HYDRIDE
                }
            }
        }
    }

};