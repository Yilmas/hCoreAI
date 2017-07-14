brain.roles.task = {};

brain.roles.task.pickUpEnergy = (creep) => {
    let droppedEnergy = creep.pos.lookFor(LOOK_ENERGY);
    let orderedEnergy = _.sortBy(droppedEnergy, 'amount').reverse();
    if (orderedEnergy.length) {
        creep.pickup(orderedEnergy[0]);
    }
}