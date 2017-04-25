visualizer = {};

visualizer.startRoomVisuals = function () {
    let firstVal = Game.cpu.getUsed();
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];

        //room.visual.circle(10,15);
    }
    let secondVal = Game.cpu.getUsed();
    let visualCpuUsage = secondVal - firstVal;

    Game.rooms['E27S83'].visual.text('Visual CPU usage: ' + visualCpuUsage.toFixed(2), 1, 1, { color: 'green', font: 0.5, align: 'left' });
}