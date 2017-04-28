visualizer = {};

visualizer.startRoomVisuals = function () {
    let firstVal = Game.cpu.getUsed();
    _.filter(Game.creeps);
    let secondVal = Game.cpu.getUsed();
    let visualCpuUsage = secondVal - firstVal;

    Game.rooms['E27S83'].visual.text('Visual CPU usage: ' + visualCpuUsage.toFixed(2), 1, 1, { color: 'green', font: 0.5, align: 'left' });
}