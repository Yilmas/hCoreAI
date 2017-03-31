brain.labManager = {};

brain.labManager.start = function () {
    brain.memory.setupReaction();

    // TODO: Loop creeps that are of role == laborant
    for (let creep in Game.creeps) {
        
    }

    // TODO: Loop rooms that are of room.controller.level >= 7
    for (let roomName in Game.rooms) {
        brain.labManager.runReactions(roomName);
    }
};

brain.labManager.runReactions = roomName => {
    for (let reaction in Memory.rooms[roomName].reactions) {
        let reactionType = reaction.longName;

        if (reactionType == 'utriumHydride') {
            let utriumLab = Game.getObjectById(reaction.labs.utriumLab);
            let hydrogenLab = Game.getObjectById(reaction.labs.hydrogenLab);
            let utriumHydrideLab = Game.getObjectById(reaction.labs.utriumHydrideLab);

            if (utriumLab.mineralAmount == hydrogenLab.mineralAmount || reaction.isRunning) {
                // run reaction
                reaction.isRunning = true;
                utriumHydrideLab.runReaction(utriumLab, hydrogenLab);
            } else {
                reaction.isRunning = false;
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
                labs: {
                    utriumLab: '58c6f3acdb541b3ef7ebb703',
                    hydrogenLab: '58c6e5cd1016063aefbde12a',
                    utriumHydrideLab: '58c7079fccd761eb2cc8e764'
                }
            }
        }
    }

};

brain.labManager.roleManager = creep => {
    let task = creep.memory.task;
    if (task.role == 'laborant') {

        // get the reactions for the room where the creep is located
        let reactions = creep.room.memory.reactions;


        if (task.hasResource) {
            // end product should be stored in terminal
            // base mineral should be delivered to the appropriate lab
            
        } else if (!task.hasResource) {
            // decide what to do

            if (roomHasActiveReaction(creep.room.name)) {
                // collect end product
                for (let reaction of reactions) {
                    if (reaction.isRunning) {
                        let resultLab = undefined;
                        if (reaction.longName == 'utriumHydride') {
                            resultLab = reaction.utriumHydrideLab;
                        }

                        if (resultLab) {
                            if (creep.withdraw(resultLab, resultLab.mineralType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(resultLab);
                            }
                        }
                    }
                }
            } else {
                // collect base minerals
            }
            
        }
    }
}

brain.labManager.utils = {
    roomHasActiveReaction: function(roomName) {
        for (let reaction in Game.rooms[roomName].memory.reactions) {
            if (reaction.isRunning) {
                return true;
            }
        }
    }
}