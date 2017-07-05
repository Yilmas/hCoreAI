brain.memory.stats = {};
brain.memory.stats.manager = () => {
    brain.memory.stats.default();

    if (Game.time % 3 === 0) {
        brain.memory.stats.storedResources();
    }
}

brain.memory.stats.default = () => {
    if (Memory.stats == undefined) {
        Memory.stats = {};
    }

    var rooms = Game.rooms;
    for (let roomKey in rooms) {
        let room = Game.rooms[roomKey];
        var isMyRoom = (room.controller ? room.controller.my : 0);
        if (isMyRoom) {
            //Memory.stats['room.' + room.name + '.myRoom'] = 1;
            //Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
            //Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress;
            //Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal;
            //var stored = 0;
            //var storedTotal = 0;

            //if (room.storage) {
            //    stored = room.storage.store[RESOURCE_ENERGY];
            //    storedTotal = room.storage.storeCapacity[RESOURCE_ENERGY];
            //} else {
            //    stored = 0;
            //    storedTotal = 0;
            //}

            //Memory.stats['room.' + room.name + '.storedEnergy'] = stored;
        }
        //else {
        //    Memory.stats['room.' + room.name + '.myRoom'] = undefined;
        //}
    }


    Memory.stats['gcl.progress'] = Game.gcl.progress;
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
    Memory.stats['gcl.level'] = Game.gcl.level;

    //Memory.stats['cpu.CreepManagers'] = creepManagement
    //Memory.stats['cpu.Towers'] = towersRunning
    //Memory.stats['cpu.Links'] = linksRunning
    //Memory.stats['cpu.SetupRoles'] = roleSetup
    //Memory.stats['cpu.Creeps'] = functionsExecutedFromCreeps
    //Memory.stats['cpu.SumProfiling'] = sumOfProfiller
    //Memory.stats['cpu.Start'] = startOfMain
    Memory.stats['cpu.bucket'] = Game.cpu.bucket;
    Memory.stats['cpu.limit'] = Game.cpu.limit;
    Memory.stats['cpu.stats'] = Game.cpu.getUsed() - Memory.stats['cpu.getUsed'];
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
}

brain.memory.stats.storedResources = () => {
    if (!Memory.stats.storedResources) {
        Memory.stats.storedResources = {
            energy: 0,
            power: 0,
            base: { H: 0, O: 0, U: 0, L: 0, K: 0, Z: 0, X: 0 },
            compound: { OH: 0, ZK: 0, UL: 0, G: 0 },
            tier1: { UH: 0, UO: 0, KH: 0, KO: 0, LH: 0, LO: 0, ZH: 0, ZO: 0, GH: 0, GO: 0 },
            tier2: { UH2O: 0, UHO2: 0, KH2O: 0, KHO2: 0, LH2O: 0, LHO2: 0, ZH2O: 0, ZHO2: 0, GH2O: 0, GHO2: 0 },
            tier3: { XUH2O: 0, XUHO2: 0, XKH2O: 0, XKHO2: 0, XLH2O: 0, XLHO2: 0, XZH2O: 0, XZHO2: 0, XGH2O: 0, XGHO2: 0 }
        };
    }

    let storedEnergy = 0, storedPower = 0, storedH = 0, storedO = 0, storedU = 0, storedL = 0, storedK = 0, storedZ = 0, storedX = 0, storedOH = 0, storedZK = 0, storedUL = 0, storedG = 0,
        storedUH = 0, storedUO = 0, storedKH = 0, storedKO = 0, storedLH = 0, storedLO = 0, storedZH = 0, storedZO = 0, storedGH = 0, storedGO = 0, storedUH2O = 0, storedUHO2 = 0,
        storedKH2O = 0, storedKHO2 = 0, storedLH2O = 0, storedLHO2 = 0, storedZH2O = 0, storedZHO2 = 0, storedGH2O = 0, storedGHO2 = 0,
        storedXUH2O = 0, storedXUHO2 = 0, storedXKH2O = 0, storedXKHO2 = 0, storedXLH2O = 0, storedXLHO2 = 0, storedXZH2O = 0, storedXZHO2 = 0, storedXGH2O = 0, storedXGHO2 = 0;

    for (let roomName in Game.rooms) {
        let city = Game.rooms[roomName];

        // Base Minerals
        storedEnergy = (city.terminal && city.terminal.store[RESOURCE_ENERGY] ? city.terminal.store[RESOURCE_ENERGY] : 0) +
            (city.storage ? city.storage.store[RESOURCE_ENERGY] : 0) + storedEnergy;
        storedPower = (city.terminal && city.terminal.store[RESOURCE_POWER] ? city.terminal.store[RESOURCE_POWER] : 0) +
            (city.storage && city.storage.store[RESOURCE_POWER] ? city.storage.store[RESOURCE_POWER] : 0) + storedPower;
        storedH = (city.terminal && city.terminal.store[RESOURCE_HYDROGEN] ? city.terminal.store[RESOURCE_HYDROGEN] : 0) +
            (city.storage && city.storage.store[RESOURCE_HYDROGEN] ? city.storage.store[RESOURCE_HYDROGEN] : 0) + storedH;
        storedO = (city.terminal && city.terminal.store[RESOURCE_OXYGEN] ? city.terminal.store[RESOURCE_OXYGEN] : 0) +
            (city.storage && city.storage.store[RESOURCE_OXYGEN] ? city.storage.store[RESOURCE_OXYGEN] : 0) + storedO;
        storedU = (city.terminal && city.terminal.store[RESOURCE_UTRIUM] ? city.terminal.store[RESOURCE_UTRIUM] : 0) +
            (city.storage && city.storage.store[RESOURCE_UTRIUM] ? city.storage.store[RESOURCE_UTRIUM] : 0) + storedU;
        storedL = (city.terminal && city.terminal.store[RESOURCE_LEMERGIUM] ? city.terminal.store[RESOURCE_LEMERGIUM] : 0) +
            (city.storage && city.storage.store[RESOURCE_LEMERGIUM] ? city.storage.store[RESOURCE_LEMERGIUM] : 0) + storedL;
        storedK = (city.terminal && city.terminal.store[RESOURCE_KEANIUM] ? city.terminal.store[RESOURCE_KEANIUM] : 0) +
            (city.storage && city.storage.store[RESOURCE_KEANIUM] ? city.storage.store[RESOURCE_KEANIUM] : 0) + storedK;
        storedZ = (city.terminal && city.terminal.store[RESOURCE_ZYNTHIUM] ? city.terminal.store[RESOURCE_ZYNTHIUM] : 0) +
            (city.storage && city.storage.store[RESOURCE_ZYNTHIUM] ? city.storage.store[RESOURCE_ZYNTHIUM] : 0) + storedZ;
        storedX = (city.terminal && city.terminal.store[RESOURCE_CATALYST] ? city.terminal.store[RESOURCE_CATALYST] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYST] ? city.storage.store[RESOURCE_CATALYST] : 0) + storedX;

        // Compound Minerals
        storedOH = (city.terminal && city.terminal.store[RESOURCE_HYDROXIDE] ? city.terminal.store[RESOURCE_HYDROXIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_HYDROXIDE] ? city.storage.store[RESOURCE_HYDROXIDE] : 0) + storedOH;
        storedZK = (city.terminal && city.terminal.store[RESOURCE_ZYNTHIUM_KEANITE] ? city.terminal.store[RESOURCE_ZYNTHIUM_KEANITE] : 0) +
            (city.storage && city.storage.store[RESOURCE_ZYNTHIUM_KEANITE] ? city.storage.store[RESOURCE_ZYNTHIUM_KEANITE] : 0) + storedZK;
        storedUL = (city.terminal && city.terminal.store[RESOURCE_UTRIUM_LEMERGITE] ? city.terminal.store[RESOURCE_UTRIUM_LEMERGITE] : 0) +
            (city.storage && city.storage.store[RESOURCE_UTRIUM_LEMERGITE] ? city.storage.store[RESOURCE_UTRIUM_LEMERGITE] : 0) + storedUL;
        storedG = (city.terminal && city.terminal.store[RESOURCE_GHODIUM] ? city.terminal.store[RESOURCE_GHODIUM] : 0) +
            (city.storage && city.storage.store[RESOURCE_GHODIUM] ? city.storage.store[RESOURCE_GHODIUM] : 0) + storedG;

        // Tier 1 Minerals
        storedUH = (city.terminal && city.terminal.store[RESOURCE_UTRIUM_HYDRIDE] ? city.terminal.store[RESOURCE_UTRIUM_HYDRIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_UTRIUM_HYDRIDE] ? city.storage.store[RESOURCE_UTRIUM_HYDRIDE] : 0) + storedUH;
        storedUO = (city.terminal && city.terminal.store[RESOURCE_UTRIUM_OXIDE] ? city.terminal.store[RESOURCE_UTRIUM_OXIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_UTRIUM_OXIDE] ? city.storage.store[RESOURCE_UTRIUM_OXIDE] : 0) + storedUO;
        storedKH = (city.terminal && city.terminal.store[RESOURCE_KEANIUM_HYDRIDE] ? city.terminal.store[RESOURCE_KEANIUM_HYDRIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_KEANIUM_HYDRIDE] ? city.storage.store[RESOURCE_KEANIUM_HYDRIDE] : 0) + storedKH;
        storedKO = (city.terminal && city.terminal.store[RESOURCE_KEANIUM_OXIDE] ? city.terminal.store[RESOURCE_KEANIUM_OXIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_KEANIUM_OXIDE] ? city.storage.store[RESOURCE_KEANIUM_OXIDE] : 0) + storedKO;
        storedLH = (city.terminal && city.terminal.store[RESOURCE_LEMERGIUM_HYDRIDE] ? city.terminal.store[RESOURCE_LEMERGIUM_HYDRIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_LEMERGIUM_HYDRIDE] ? city.storage.store[RESOURCE_LEMERGIUM_HYDRIDE] : 0) + storedLH;
        storedLO = (city.terminal && city.terminal.store[RESOURCE_LEMERGIUM_OXIDE] ? city.terminal.store[RESOURCE_LEMERGIUM_OXIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_LEMERGIUM_OXIDE] ? city.storage.store[RESOURCE_LEMERGIUM_OXIDE] : 0) + storedLO;
        storedZH = (city.terminal && city.terminal.store[RESOURCE_ZYNTHIUM_HYDRIDE] ? city.terminal.store[RESOURCE_ZYNTHIUM_HYDRIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_ZYNTHIUM_HYDRIDE] ? city.storage.store[RESOURCE_ZYNTHIUM_HYDRIDE] : 0) + storedZH;
        storedZO = (city.terminal && city.terminal.store[RESOURCE_ZYNTHIUM_OXIDE] ? city.terminal.store[RESOURCE_ZYNTHIUM_OXIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_ZYNTHIUM_OXIDE] ? city.storage.store[RESOURCE_ZYNTHIUM_OXIDE] : 0) + storedZO;
        storedGH = (city.terminal && city.terminal.store[RESOURCE_GHODIUM_HYDRIDE] ? city.terminal.store[RESOURCE_GHODIUM_HYDRIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_GHODIUM_HYDRIDE] ? city.storage.store[RESOURCE_GHODIUM_HYDRIDE] : 0) + storedGH;
        storedGO = (city.terminal && city.terminal.store[RESOURCE_GHODIUM_OXIDE] ? city.terminal.store[RESOURCE_GHODIUM_OXIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_GHODIUM_OXIDE] ? city.storage.store[RESOURCE_GHODIUM_OXIDE] : 0) + storedGO;

        // Tier 2 Minerals
        storedUH2O = (city.terminal && city.terminal.store[RESOURCE_UTRIUM_ACID] ? city.terminal.store[RESOURCE_UTRIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_UTRIUM_ACID] ? city.storage.store[RESOURCE_UTRIUM_ACID] : 0) + storedUH2O;
        storedUHO2 = (city.terminal && city.terminal.store[RESOURCE_UTRIUM_ALKALIDE] ? city.terminal.store[RESOURCE_UTRIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_UTRIUM_ALKALIDE] ? city.storage.store[RESOURCE_UTRIUM_ALKALIDE] : 0) + storedUHO2;
        storedKH2O = (city.terminal && city.terminal.store[RESOURCE_KEANIUM_ACID] ? city.terminal.store[RESOURCE_KEANIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_KEANIUM_ACID] ? city.storage.store[RESOURCE_KEANIUM_ACID] : 0) + storedKH2O;
        storedKHO2 = (city.terminal && city.terminal.store[RESOURCE_KEANIUM_ALKALIDE] ? city.terminal.store[RESOURCE_KEANIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_KEANIUM_ALKALIDE] ? city.storage.store[RESOURCE_KEANIUM_ALKALIDE] : 0) + storedKHO2;
        storedLH2O = (city.terminal && city.terminal.store[RESOURCE_LEMERGIUM_ACID] ? city.terminal.store[RESOURCE_LEMERGIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_LEMERGIUM_ACID] ? city.storage.store[RESOURCE_LEMERGIUM_ACID] : 0) + storedLH2O;
        storedLHO2 = (city.terminal && city.terminal.store[RESOURCE_LEMERGIUM_ALKALIDE] ? city.terminal.store[RESOURCE_LEMERGIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_LEMERGIUM_ALKALIDE] ? city.storage.store[RESOURCE_LEMERGIUM_ALKALIDE] : 0) + storedLHO2;
        storedZH2O = (city.terminal && city.terminal.store[RESOURCE_ZYNTHIUM_ACID] ? city.terminal.store[RESOURCE_ZYNTHIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_ZYNTHIUM_ACID] ? city.storage.store[RESOURCE_ZYNTHIUM_ACID] : 0) + storedZH2O;
        storedZHO2 = (city.terminal && city.terminal.store[RESOURCE_ZYNTHIUM_ALKALIDE] ? city.terminal.store[RESOURCE_ZYNTHIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_ZYNTHIUM_ALKALIDE] ? city.storage.store[RESOURCE_ZYNTHIUM_ALKALIDE] : 0) + storedZHO2;
        storedGH2O = (city.terminal && city.terminal.store[RESOURCE_GHODIUM_ACID] ? city.terminal.store[RESOURCE_GHODIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_GHODIUM_ACID] ? city.storage.store[RESOURCE_GHODIUM_ACID] : 0) + storedGH2O;
        storedGHO2 = (city.terminal && city.terminal.store[RESOURCE_GHODIUM_ALKALIDE] ? city.terminal.store[RESOURCE_GHODIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_GHODIUM_ALKALIDE] ? city.storage.store[RESOURCE_GHODIUM_ALKALIDE] : 0) + storedGHO2;

        // Tier 3 Minerals
        storedXUH2O = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_UTRIUM_ACID] ? city.terminal.store[RESOURCE_CATALYZED_UTRIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_UTRIUM_ACID] ? city.storage.store[RESOURCE_CATALYZED_UTRIUM_ACID] : 0) + storedXUH2O;
        storedXUHO2 = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_UTRIUM_ALKALIDE] ? city.terminal.store[RESOURCE_CATALYZED_UTRIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_UTRIUM_ALKALIDE] ? city.storage.store[RESOURCE_CATALYZED_UTRIUM_ALKALIDE] : 0) + storedXUHO2;
        storedXKH2O = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_KEANIUM_ACID] ? city.terminal.store[RESOURCE_CATALYZED_KEANIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_KEANIUM_ACID] ? city.storage.store[RESOURCE_CATALYZED_KEANIUM_ACID] : 0) + storedXKH2O;
        storedXKHO2 = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] ? city.terminal.store[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] ? city.storage.store[RESOURCE_CATALYZED_KEANIUM_ALKALIDE] : 0) + storedXKHO2;
        storedXLH2O = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_LEMERGIUM_ACID] ? city.terminal.store[RESOURCE_CATALYZED_LEMERGIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_LEMERGIUM_ACID] ? city.storage.store[RESOURCE_CATALYZED_LEMERGIUM_ACID] : 0) + storedXLH2O;
        storedXLHO2 = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] ? city.terminal.store[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] ? city.storage.store[RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE] : 0) + storedXLHO2;
        storedXZH2O = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_ZYNTHIUM_ACID] ? city.terminal.store[RESOURCE_CATALYZED_ZYNTHIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_ZYNTHIUM_ACID] ? city.storage.store[RESOURCE_CATALYZED_ZYNTHIUM_ACID] : 0) + storedXZH2O;
        storedXZHO2 = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] ? city.terminal.store[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] ? city.storage.store[RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE] : 0) + storedXZHO2;
        storedXGH2O = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] ? city.terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_GHODIUM_ACID] ? city.storage.store[RESOURCE_CATALYZED_GHODIUM_ACID] : 0) + storedXGH2O;
        storedXGHO2 = (city.terminal && city.terminal.store[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] ? city.terminal.store[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] : 0) +
            (city.storage && city.storage.store[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] ? city.storage.store[RESOURCE_CATALYZED_GHODIUM_ALKALIDE] : 0) + storedXGHO2;
    }

    let storedResources = Memory.stats.storedResources;
    storedResources.energy = storedEnergy;
    storedResources.power = storedPower;

    storedResources.base.H = storedH;
    storedResources.base.O = storedO;
    storedResources.base.U = storedU;
    storedResources.base.L = storedL;
    storedResources.base.K = storedK;
    storedResources.base.Z = storedZ;
    storedResources.base.X = storedX;

    storedResources.compound.OH = storedOH;
    storedResources.compound.ZK = storedZK;
    storedResources.compound.UL = storedUL;
    storedResources.compound.G = storedG;

    storedResources.tier1.UH = storedUH;
    storedResources.tier1.UO = storedUO;
    storedResources.tier1.KH = storedKH;
    storedResources.tier1.KO = storedKO;
    storedResources.tier1.LH = storedLH;
    storedResources.tier1.LO = storedLO;
    storedResources.tier1.ZH = storedZH;
    storedResources.tier1.ZO = storedZO;
    storedResources.tier1.GH = storedGH;
    storedResources.tier1.GO = storedGO;

    storedResources.tier2.UH2O = storedUH2O;
    storedResources.tier2.UHO2 = storedUHO2;
    storedResources.tier2.KH2O = storedKH2O;
    storedResources.tier2.KHO2 = storedKHO2;
    storedResources.tier2.LH2O = storedLH2O;
    storedResources.tier2.LHO2 = storedLHO2;
    storedResources.tier2.ZH2O = storedZH2O;
    storedResources.tier2.ZHO2 = storedZHO2;
    storedResources.tier2.GH2O = storedGH2O;
    storedResources.tier2.GHO2 = storedGHO2;

    storedResources.tier3.XUH2O = storedXUH2O;
    storedResources.tier3.XUHO2 = storedXUHO2;
    storedResources.tier3.XKH2O = storedXKH2O;
    storedResources.tier3.XKHO2 = storedXKHO2;
    storedResources.tier3.XLH2O = storedXLH2O;
    storedResources.tier3.XLHO2 = storedXLHO2;
    storedResources.tier3.XZH2O = storedXZH2O;
    storedResources.tier3.XZHO2 = storedXZHO2;
    storedResources.tier3.XGH2O = storedXGH2O;
    storedResources.tier3.XGHO2 = storedXGHO2;
}