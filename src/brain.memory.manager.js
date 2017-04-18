brain.memory.manager = () => {
    
}

brain.memory.injection = () => {
    utils.createRoom('E27S83', '', 'Base');
    utils.createRoom('E27S82', 'E27S83', 'Mine');
    utils.createRoom('E27S84', 'E27S83', 'Mine');
    utils.createRoom('E27S85', 'E27S83', 'Mine');
    utils.createRoom('E26S83', 'E27S83', 'Outpost');
    utils.createRoom('E25S83', 'E26S83', 'Mine');
    utils.createRoom('E27S81', 'E27S83', 'Outpost');
    utils.createRoom('E26S81', 'E27S81', 'Mine');
}

global.utils.createRoom = function (targetRoom, parentRoom, roomType) {
    if (!Memory.rooms[targetRoom]) {
        config.log(3, 'Setup new room: ' + targetRoom);

        config.log(3, 'Load sources for target room');
        let sources = {};

        if (!Game.rooms[targetRoom]) {
            for (let source of Game.rooms[targetRoom].find(FIND_SOURCES)) {
                let sourceTarget = {
                    id: source.id,
                    totalSpots: 1,
                    openSpots: 1,
                    carriers: 0
                }
                sources.push(sourceTarget);
            }
        }

        Memory.rooms[targetRoom] = {
            roomType: roomType,
            parentRoom: parentRoom,
            sources: sources,
            defense: {
                count: 0,
                level: 1
            },
            reactions: {}
        }
    }
}