//utils

global.utils = {

    /**
     * Move the creep to avoid traffic jam, caused by inactive creeps standing on roads
     * @param {Creep} creep The creep to move
    */
    takeRandomStep: (creep) => {
        let directions = [TOP, TOP_LEFT, TOP_RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT, LEFT, RIGHT];
        let randomDirection = _.random(0, 7);
        let isCurrentTileRoad = creep.pos.lookFor(LOOK_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_ROAD });
        if (isCurrentTileRoad[0]) {

            if (creep.move(directions[randomDirection]) !== OK) {
                let bridgePosition = Memory.empire.cities[creep.room.name].bridgePosition;
                creep.moveTo(bridgePosition);
            }
        }
    },

    /**
     * Move the creep in a direction to avoid standing on the edge, thereby causing pos stutter
     * @param {Creep} creep The creep to move
    */
    avoidRoomEdge: (creep) => {
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
    },

    /**
     * Send minerals from one room to another, does not need to be your own rooms
     * @param {string} fromRoom Where are you sending it from, ie. the location of the minerals.
     * @param {string} toRoom What room should the minerals be sent to ?
     * @param {RESOURCE_*} resourceType What mineral type should be sent ?
     * @param {int} amount What quantity should be sent ?
    */
    sendMinerals: function (fromRoom, toRoom, resourceType, amount) {
        return Game.rooms[fromRoom].terminal.send(resourceType, amount, toRoom);
    },

    /**
     * Change the special creep required state between on and off
     * @param {string} cityName The name of the city that the specialCreepRequired should change state
    */
    setSpecialCreepRequired: function (cityName) {
        let memCity = Memory.empire.cities[cityName];
        if (memCity && (memCity.specialCreepRequired === undefined || memCity.specialCreepRequired === false)) {
            memCity.specialCreepRequired = true;
        } else {
            memCity.specialCreepRequired = false;
        }

        config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' SpecialCreep state set to: ' + memCity.specialCreepRequired + '</font>');
    },

    /**
     * Change the wall builder state between on and off
     * @param {string} cityName What city should the state be changed on ?
    */
    setUseWallBuilder: function (cityName) {
        let city = Memory.empire.cities[cityName];
        city.useWallBuilder = !city.useWallBuilder;

        config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' WallBuilder state set to: ' + city.useWallBuilder + '</font>');
    },

    /**
     * Change the intercity boost state between on and off
     * @param {string} cityName What city should the state be changed on ?
    */
    setUseInterCityBoost: function (cityName) {
        let city = Memory.empire.cities[cityName];
        city.useInterCityBoost = !city.useInterCityBoost;

        config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' InterCityBoost state set to: ' + city.useInterCityBoost + '</font>');
    },

    /**
     * Change the intercity transport state between on and off
     * @param {string} cityName What city should the state be changed on ?
    */
    setUseInterCityTransport: function (cityName) {
        let city = Memory.empire.cities[cityName];
        city.useInterCityTransport = !city.useInterCityTransport;

        config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' InterCityTransport state set to: ' + city.useInterCityTransport + '</font>');
    },

    setRoleMin: function (cityName, role, count) {
        let city = Memory.empire.cities[cityName];
        let oldCount = city.roles[role].min;
        city.roles[role].min = count;

        config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' Role: ' + role + ' minimum set to: ' + count + ', old minimum: ' + oldCount + '</font>');
    },

    /**
     * Launch nuke at room name
     * @param {string} fromCity What city launch the nuke ?
     * @param {RoomPosition} toRoomPos Where should the nuke land ?
    */
    launchNuke: function (fromCity, toRoomPos) {
        let cityToLaunchFrom = Game.rooms[fromCity];

        if (cityToLaunchFrom) {
            let nukeSilo = cityToLaunchFrom.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_NUKER })[0];

            if (nukeSilo) {
                if (nukeSilo.energy === nukeSilo.energyCapacity && nukeSilo.ghodium === nukeSilo.ghodiumCapacity) {
                    // Ready to Launch, testing destination is not our own.
                    let targetRoom = Game.rooms[toRoomPos.roomName];
                    if (targetRoom && targetRoom.controller.owner.my) {
                        // target is FRIENDLY, abort launch.
                        config.log(3, '<font color=green>[UTILS]</font> <font color=yellow>NUKE ALERT</font> <font color=green>- Room: ' + fromCity + ' failed to launch nuke on: ' + toRoomPos + ' | </font><font color=red> error code: ABORT!! Targeting friendly city!!!</font>');
                    } else {
                        // Launch nuke!
                        let launch = nukeSilo.launchNuke(toRoomPos);
                        if (launch === OK) {
                            config.log(3, '<font color=green>[UTILS]</font> <font color=yellow>NUKE ALERT</font> <font color=green>- Room: ' + fromCity + ' launching a nuke to hit: ' + toRoomPos + '</font>');
                        } else {
                            config.log(3, '<font color=green>[UTILS]</font> <font color=yellow>NUKE ALERT</font> <font color=green>- Room: ' + fromCity + ' failed to launch nuke on: ' + toRoomPos + ' | </font><font color=red> error code: ' + launch + '</font>');
                        }

                    }

                } else {
                    // Silo is not fueled
                    config.log(3, '<font color=green>[UTILS]</font> <font color=yellow>NUKE ALERT</font> <font color=green>- Room: ' + fromCity + ' failed to launch nuke on: ' + toRoomPos + ' | </font><font color=red> error code: silo is not fueled</font>');
                }
            } else {
                // No silo found
                config.log(3, '<font color=green>[UTILS]</font> <font color=yellow>NUKE ALERT</font> <font color=green>- Room: ' + fromCity + ' failed to launch nuke on: ' + toRoomPos + ' | </font><font color=red> error code: connection to silo not possible</font>');
            }
        } else {
            // No such room
            config.log(3, '<font color=green>[UTILS]</font> <font color=yellow>NUKE ALERT</font> <font color=green>- Room: ' + fromCity + ' failed to launch nuke on: ' + toRoomPos + ' | </font><font color=red> error code: launch city does not exist</font>');
        }
    },

    /**
     * Set Bridge Position for city
     * @param {string} cityName What city do you want to edit ?
     * @param {RoomPosition} pos What is the new bridge position ?
    */
    setBridgePosition: function (cityName, pos) {
        Memory.empire.cities[cityName].bridgePosition = pos;
        config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' BridgePosition set to: </font><font color=yellow>[' + pos.x + '].[' + pos.y + '] (' + pos.roomName + ')</font>');
    },

    getBridgePosition: function (cityName) {
        let pos = Memory.empire.cities[cityName].bridgePosition;
        if (!pos) {
            config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' BridgePosition is: </font><font color=red>not set</font>');
        } else {
            config.log(3, '<font color=green>[UTILS] Room: ' + cityName + ' BridgePosition is: </font><font color=yellow>[' + pos.x + '].[' + pos.y + '] (' + pos.roomName + ')</font>');
        }
    }
}