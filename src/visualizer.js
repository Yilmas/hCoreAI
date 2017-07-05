visualizer = {};

visualizer.startRoomVisuals = () => {
    let flag = Game.flags['showLayout'];
    if (!flag) return;
    let cPos = flag.pos;
    let roomName = cPos.roomName;

    let cpuStart = Game.cpu.getUsed();

    let optionTerminal = { radius: 0.25, opacity: 1.0, fill: 'white', stroke: 'grey', strokeWidth: 0.25 };
    let optionStorage = { radius: 0.25, opacity: 1.0, fill: 'white', stroke: 'green', strokeWidth: 0.25 };
    let optionSpawn = { radius: 0.25, opacity: 1.0, fill: 'yellow', stroke: 'grey', strokeWidth: 0.25 };
    let optionObserver = { radius: 0.15, opacity: 1.0, fill: 'green', stroke: 'black', strokeWidth: 0.15 };
    let optionLink = { radius: 0.3, opacity: 1.0, fill: 'black', stroke: 'yellow', strokeWidth: 0.2 };
    let optionLab = { radius: 0.15, opacity: 1.0, fill: 'white', stroke: 'black', strokeWidth: 0.15 };
    let optionRoad = { radius: 0.15, opacity: 1.0, fill: 'grey' };
    let optionExtension = { radius: 0.4, opacity: 1.0, fill: 'yellow', stroke: 'grey', strokeWidth: 0.1 };
    let optionNuke = { radius: 0.25, opacity: 1.0, fill: 'red', stroke: 'yellow', strokeWidth: 0.25 };
    let optionPowerSpawn = { radius: 0.25, opacity: 1.0, fill: 'black', stroke: 'red', strokeWidth: 0.25 };
    let optionRampart = { radius: 0.25, opacity: 0.5, fill: 'green', stroke: 'green', strokeWidth: 0.25 };
    let optionWall = { radius: 0.1, opacity: 1.0, fill: 'grey', stroke: 'black', strokeWidth: 0.4 };
    let optionTower = { radius: 0.1, opacity: 1.0, fill: 'yellow', stroke: 'red', strokeWidth: 0.4 };


    //let cPos = new RoomPosition(22,18,roomName);

    // Terminal
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 1, optionTerminal);

    // Storage
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 1, optionStorage);

    // Link
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y, optionLink);

    // Power Spawn
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y, optionPowerSpawn);

    // Nuke
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y, optionNuke);

    // Spawns
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 5, optionSpawn);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 5, optionSpawn);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y, optionSpawn);

    // Lab
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 1, optionLab);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y, optionLab);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 1, optionLab);

    // Observer
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y, optionObserver);

    // Tower
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 4, optionTower);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 4, optionTower);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 7, optionTower);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 7, optionTower);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 7, optionTower);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 7, optionTower);

    // Wall
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 8, optionWall);

    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 8, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 8, optionWall);

    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 7, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 6, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 5, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 4, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 3, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 2, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y - 1, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 1, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 2, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 3, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 4, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 5, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 6, optionWall);
    new RoomVisual(roomName).circle(cPos.x - 8, cPos.y + 7, optionWall);

    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 7, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 6, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 5, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 4, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 3, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 2, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y - 1, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 1, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 2, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 3, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 4, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 5, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 6, optionWall);
    new RoomVisual(roomName).circle(cPos.x + 8, cPos.y + 7, optionWall);

    // Rampart
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 7, optionRampart);

    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 7, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 7, optionRampart);

    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 6, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 5, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 4, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 3, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 2, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y - 1, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 1, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 2, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 3, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 4, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 5, optionRampart);
    new RoomVisual(roomName).circle(cPos.x - 7, cPos.y + 6, optionRampart);

    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 6, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 5, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 4, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 3, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 2, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y - 1, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 1, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 2, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 3, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 4, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 5, optionRampart);
    new RoomVisual(roomName).circle(cPos.x + 7, cPos.y + 6, optionRampart);

    // Road (Edge)
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 6, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 6, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y - 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 6, cPos.y + 6, optionRoad);

    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 6, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y - 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 6, cPos.y + 6, optionRoad);

    // Road (Inner Edge)
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 2, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 2, optionRoad);

    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 2, optionRoad);

    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 2, optionRoad);

    // Road (Cross paths)
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 3, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 4, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y + 3, optionRoad);
    new RoomVisual(roomName).circle(cPos.x, cPos.y - 3, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 4, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 1, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 1, optionRoad);

    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 5, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 2, optionRoad);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 2, optionRoad);

    // Extension
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 1, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 1, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 1, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 1, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 2, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 2, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 2, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 2, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y - 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y - 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 2, cPos.y + 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 2, cPos.y + 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 2, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 2, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 2, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 2, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 3, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 3, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 3, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 3, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 3, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 4, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 4, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 4, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 4, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 5, optionExtension);

    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y - 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 1, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 1, cPos.y + 5, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y - 1, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y - 1, optionExtension);
    new RoomVisual(roomName).circle(cPos.x - 5, cPos.y + 1, optionExtension);
    new RoomVisual(roomName).circle(cPos.x + 5, cPos.y + 1, optionExtension);

    const cpuElapsed = parseFloat(Math.round((Game.cpu.getUsed() - cpuStart) * 100) / 100).toFixed(2);
    new RoomVisual(roomName).text('CPU Usage: ' + cpuElapsed, cPos.x - 8, cPos.y - 9, { color: 'white', align: 'left' });
}