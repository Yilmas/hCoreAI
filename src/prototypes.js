let oldMoveTo = Creep.moveTo;
Creep.prototype.moveTo = (target, options) => {
    let firstVal = Game.cpu.getUsed();
    oldMoveTo(target, options);
    let secondVal = Game.cpu.getUsed();
    let resultVal = secondVal - firstVal;

    brain.stats.moveToCpu = brain.stats.moveToCpu + resultVal;
}