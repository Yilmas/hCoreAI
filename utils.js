//utils

global.utils = {

    /**
     * Move the creep to avoid traffic jam, caused by inactive creeps standing on roads
     * @param {Creep} creep The creep to move
    */
    takeRandomStep: function (creep) {
        let directions = [TOP, TOP_LEFT, TOP_RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT, LEFT, RIGHT];
        let randomDirection = _.random(0, 7);
        let isCurrentTileRoad = creep.pos.lookFor(LOOK_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_ROAD });
        if (isCurrentTileRoad[0]) {
            config.log(1, 'Creep: ' + creep.name + ' in room: ' + creep.room.name + ' avoiding traffic jam!');
            creep.move(directions[randomDirection]);
        }
    },

    /**
     * Move the creep in a direction to avoid standing on the edge, thereby causing pos stutter
     * @param {Creep} creep The creep to move
    */
    avoidRoomEdge: function (creep) {
        if (creep.pos.x == 0) {
            creep.move(RIGHT);
        } else if (creep.pos.x == 49) {
            creep.move(LEFT);
        } else if (creep.pos.y == 0) {
            creep.move(BOTTOM);
        } else if (creep.pos.y == 49) {
            creep.move(TOP);
        }
    },

    /**
     * This returns a list of all tiles around a set of coordinates
     * @param {string} terrain The type of terrain to look for
     * @param {RoomPosition} roomPos The target tile you want the surrounding terrain for
     * @returns {tiles[]} Returns a list of tiles and their terrain
    */
    getTerrainAroundRoomPos: function (terrain, roomPos) {
        let tiles = new Array();

        if (new RoomPosition(roomPos.x + 1, roomPos.y, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x + 1, roomPos.y, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x - 1, roomPos.y, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x - 1, roomPos.y, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x, roomPos.y + 1, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x, roomPos.y + 1, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x, roomPos.y - 1, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x, roomPos.y - 1, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x + 1, roomPos.y + 1, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x + 1, roomPos.y + 1, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x - 1, roomPos.y - 1, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x - 1, roomPos.y - 1, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x - 1, roomPos.y + 1, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x - 1, roomPos.y + 1, roomPos.roomName));
        }
        if (new RoomPosition(roomPos.x + 1, roomPos.y - 1, roomPos.roomName).lookFor('terrain') == terrain) {
            tiles.push(new RoomPosition(roomPos.x + 1, roomPos.y - 1, roomPos.roomName));
        }

        return tiles;
    },

    createCreepBody: function (role, roomName) {
        // TODO: Create function that returns the necessary body to the specified role.
        // This function requires the new OperationSize function.

        let room = Game.rooms[roomName];
        let maxEnergyCapacity = room.energyCapacityAvailable;
        console.log(maxEnergyCapacity);

        let bodyParts = [];
        let workParts = 0;
        let carryParts = 1;
        let moveParts;

        if (role == 'harvester' || role == 'upgrader') {

            let i = (carryParts * BODYPART_COST[CARRY]) * -1;
            while (i < (maxEnergyCapacity - BODYPART_COST[CARRY]) && workParts < 5) {
                bodyParts.push(WORK);
                workParts++;
                i += BODYPART_COST[WORK] + BODYPART_COST[MOVE];
            }

            bodyParts.push(CARRY);

            moveParts = Math.floor((workParts + carryParts) / 2);

            for (x = 0; x < moveParts; x++) {
                bodyParts.push(MOVE);
            }

            return bodyParts;
        } else if (role == 'distributor') {

            let i = 0;
            while (i < maxEnergyCapacity) {
                bodyParts.push(CARRY);
                carryParts++;
                i += BODYPART_COST[CARRY] + BODYPART_COST[MOVE];
            }

            moveParts = Math.floor((workParts + carryParts) / 2);

            for (x = 0; x < moveParts; x++) {
                bodyParts.push(MOVE);
            }

            return bodyParts;
        } else if (role == 'builder') {

            let i = 0;
            while (i < maxEnergyCapacity) {

                moveParts = Math.floor((workParts + carryParts) / 2);

                console.log((moveParts * BODYPART_COST[MOVE] + i));

                if (getBodyCost(bodyParts) + (moveParts * BODYPART_COST[MOVE]) <= maxEnergyCapacity) {

                    bodyParts.push(WORK);
                    bodyParts.push(CARRY);
                    workParts++;
                    carryParts++;
                    i += BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE];
                }
            }

            moveParts = Math.floor((workParts + carryParts) / 2);

            for (x = 0; x < moveParts; x++) {
                bodyParts.push(MOVE);
            }

            return bodyParts;
        }
    },

    getRepairQuota: function (type) {
        switch (type) {
            case STRUCTURE_CONTAINER:
                // max 250.000
                return 100000;
            case STRUCTURE_EXTRACTOR:
            case STRUCTURE_LAB:
            case STRUCTURE_OBSERVER:
                // max 500
                return 500;
            case STRUCTURE_TOWER:
            case STRUCTURE_TERMINAL:
            case STRUCTURE_EXTENSION:
                // max 3.000
                return 3000;
            case STRUCTURE_LINK:
            case STRUCTURE_NUKER:
                // max 1.000
                return 1000;
            case STRUCTURE_POWER_BANK:
                // max 2.000.000
                return 200000;
            case STRUCTURE_POWER_SPAWN:
                // max 5.000
                return 5000;
            case STRUCTURE_RAMPART:
                // max defined by controller level
                return 50.000;
            case STRUCTURE_ROAD:
                // max 5.000
                return 5000;
            case STRUCTURE_STORAGE:
                // max 10.000
                return 10000;
            case STRUCTURE_WALL:
                // max 300.000.000
                return 50000;
            default:
                // If I have forgotton a structure, or a new one is added
                return 5000;
        }
    }
}