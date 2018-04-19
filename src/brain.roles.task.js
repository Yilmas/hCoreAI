brain.roles.task = {};

brain.roles.task.pickUpEnergy = (creep) => {
    let droppedEnergy = creep.pos.lookFor(LOOK_ENERGY);
    let orderedEnergy = _.sortBy(droppedEnergy, 'amount').reverse();
    if (orderedEnergy.length) {
        creep.pickup(orderedEnergy[0]);
    }
}

brain.roles.task.fillLabs = (creep, task) => {
    if (creep.room.name === 'E2S37') {
        let terminal = creep.room.terminal;
        let labBoost = Game.getObjectById('599967be6b5740279d20079f');

        if (terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] && _.sum(creep.carry) === 0 && labBoost.mineralAmount < 450) {

            if (creep.withdraw(terminal, RESOURCE_CATALYZED_GHODIUM_ACID, 450) === OK) {
                task.hasResource = true;
            }
        } else if (creep.carry[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {

            creep.transfer(labBoost, RESOURCE_CATALYZED_GHODIUM_ACID);
        }
    }
}


brain.roles.task.isUpgradeBoostAvailable = (creep) => {
    let labBoost = Game.getObjectById('599967be6b5740279d20079f');
    let boosted = _.filter(creep.body, part => part.type === WORK && part.boost === RESOURCE_CATALYZED_GHODIUM_ACID).length > 0;

    if (creep.room.name === 'E2S37' && creep.ticksToLive > 1400 && !boosted && labBoost.mineralAmount === 450) {
        return true;
    }

    return false;
}

brain.roles.task.boostUpgrader = creep => {
    let labBoost = Game.getObjectById('599967be6b5740279d20079f');
    if (labBoost.boostCreep(creep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(labBoost);
    }
}

brain.roles.task.requiresFillReaction = (creep, task) => {
    let cityMem = Memory.empire.cities[creep.room.name];
    let terminal = creep.room.terminal;

    if (creep.room.name === 'E3S34' || creep.room.name === 'E1S34' || creep.room.name === 'E1S32' || creep.room.name === 'W1S34' || creep.room.name === 'E5S38' || creep.room.name === 'E8S37' || creep.room.name === 'E3S39') {

        let hasReaction = false;

        for (let item in cityMem.reactions) {
            let reaction = cityMem.reactions[item];
            if (reaction) {

                let lab1 = Game.getObjectById(reaction.lab1.id);
                let lab1Attention = terminal.store[reaction.lab1.resourceType] && lab1.mineralAmount < (lab1.mineralCapacity - 500);

                let lab2 = Game.getObjectById(reaction.lab2.id);
                let lab2Attention = terminal.store[reaction.lab2.resourceType] && lab2.mineralAmount < (lab2.mineralCapacity - 500);

                let resultLab = Game.getObjectById(reaction.resultLab.id);
                let resultLabAttention = resultLab.mineralAmount > 200;

                let reactionNeedsAttention = lab1Attention || lab2Attention || resultLabAttention;

                if (reactionNeedsAttention) {
                    hasReaction = true;
                } else {
                    let mineralType = undefined;

                    for (let item in creep.carry) {
                        mineralType = item;
                    }

                    if (_.sum(creep.carry) > 0) {
                        creep.transfer(terminal, mineralType);
                    }
                }
            }
        }

        if (hasReaction) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

brain.roles.task.fillLabsForReaction = (creep, task) => {
    let cityMem = Memory.empire.cities[creep.room.name];

    let firstRun = false;

    for (let item in cityMem.reactions) {

        if (item && !firstRun) {
            firstRun = true;

            let reaction = cityMem.reactions[item];



            let lab1 = Game.getObjectById(reaction.lab1.id);
            let lab1Type = reaction.lab1.resourceType;
            let lab2 = Game.getObjectById(reaction.lab2.id);
            let lab2Type = reaction.lab2.resourceType;
            let resultLab = Game.getObjectById(reaction.resultLab.id);
            let resultLabType = reaction.resultLab.resourceType;

            let terminal = creep.room.terminal;

            if (task.hasResource) {
                let mineralType = undefined;

                for (let item in creep.carry) {
                    mineralType = item;
                }

                if (mineralType === lab1Type) {
                    if (lab1.mineralAmount === lab1.mineralCapacity) {
                        creep.transfer(terminal, mineralType);
                    } else {
                        creep.transfer(lab1, mineralType);
                    }
                } else if (mineralType === lab2Type) {
                    if (lab2.mineralAmount === lab2.mineralCapacity) {
                        creep.transfer(terminal, mineralType);
                    } else {
                        creep.transfer(lab2, mineralType);
                    }
                } else if (mineralType === resultLabType) {
                    creep.transfer(terminal, mineralType);
                } else {
                    creep.transfer(terminal, mineralType);
                }

            } else if (!task.hasResource) {

                if (resultLab.mineralAmount > 200) {
                    creep.withdraw(resultLab, resultLabType);
                } else if (lab1.mineralAmount < lab1.mineralCapacity && terminal.store[lab1Type]) {
                    console.log(creep.withdraw(terminal, lab1Type));
                } else if (lab2.mineralAmount < lab2.mineralCapacity && terminal.store[lab2Type]) {
                    creep.withdraw(terminal, lab2Type);
                }
            }

        } else {
            return;
        }
    }

}