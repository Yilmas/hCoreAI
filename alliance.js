global.alliance = {
    enabled: true
}

global.alliance.memberList = function () {
    var originalAttack = Creep.prototype.attack; // Så er referencen gemt
    Creep.prototype.attack = function (presumedAllyCreep) {
        if (!presumedAllyCreep.isAlly) {
            originalAttack();
        }
    };


    

    var pos = typeof RoomPosition === 'String'
    if (typeof RoomPosition === 'Object') { return }
}