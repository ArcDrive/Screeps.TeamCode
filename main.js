var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDistributor = require('role.distributor');
var roleHarvesterS2 = require('role.harvesterS2');
var roleClaimer = require('role.claimer');
var roleNBuilder = require('role.newbuilder');
var roleNRepairer = require('role.newrepairer');
var roleNDistributor = require('role.newdistributor');
var roleNUpgrader = require('role.newupgrader');
var roleNNBuilder = require('role.nnbuilder');
var roleHarv = require('role.harv');
var roleExtractor = require('role.extractor');
var rolePickuper = require('role.attacker');
var roleTerminalWorker = require('role.termialWorker');

function getRoomsToScout() {
    for (let myRoom in Game.rooms) {
        let rooms = Game.map.describeExits(myRoom);
        for (let roomDirection in rooms) {
            //console.log('Rooms to consider',myRoom);
            let roomName = rooms[roomDirection];
            if (!Memory.rooms[roomName]) {
                Memory.rooms[roomName] = {};
                Memory.rooms[roomName].unscouted = true;
            }
        }
    }
}

module.exports.loop = function () {
    if (Game.rooms.W22S11.terminal && (Game.time % 10 == 0)) {
        if (Game.rooms.W22S11.terminal.store[RESOURCE_ENERGY] >= 2000 && Game.rooms.W22S11.terminal.store[RESOURCE_OXYGEN] >= 2000) {
            var orders = Game.market.getAllOrders(order => order.resourceType == RESOURCE_OXYGEN &&
                order.type == ORDER_BUY &&
                Game.market.calcTransactionCost(200, 'W22S11', order.roomName) < 400);
            orders.sort(function (a, b) {
                return b.price - a.price;
            });
            if (orders[0].price > 0.6) {
                var result = Game.market.deal(orders[0].id, 200, "W22S11");
                if (result == 0) {
                    Memory.rooms.W22S11.ordersCompleted += 1;
                }
            }
        }
    }

    //getRoomsToScout();


    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvs = _.filter(Game.creeps, (creep) => creep.memory.role == 'harv');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var pickupers = _.filter(Game.creeps, (creep) => creep.memory.role == 'pickuper');
    var distributors = _.filter(Game.creeps, (creep) => creep.memory.role == 'distributor');
    var harvestersS2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterS2');
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    var nbuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'nbuilder');
    var nrepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'nrepairer');
    var ndistributors = _.filter(Game.creeps, (creep) => creep.memory.role == 'ndistributor');
    var nupgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'nupgrader');
    var nnbuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'nnbuilder');
    var extractors = _.filter(Game.creeps, (creep) => creep.memory.role == 'extractor');
    var tworkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'tworker');

    if (extractors.length != 2) {
        var extract = Game.rooms.W22S11.find(FIND_MY_CREEPS, {
            filter: function (object) {
                return object.memory.role == 'extractor'
            }
        });

        if (extract.length < 1) {
            extract = 0;
        } else {
            extract = 1;
        }

        if (extract == 1 && extractors.length == 1) {
            var extract1 = 0;
        } else if (extract == 0 && extractors.length == 1) {
            var extract1 = 1;
        } else {
            var extract1 = 0;
        }

        let mineral1 = Game.getObjectById('5bbcb20e40062e4259e9361e');
        let mineral = Game.getObjectById('5bbcb21840062e4259e9368a');
        if (mineral.mineralAmount == 0) {
            extract = 1;
        }
        if (mineral1.mineralAmount == 0) {
            extract1 = 1;
        }
    }

    if (pickupers.length != 2) {
        var pick = Game.rooms.W22S11.find(FIND_MY_CREEPS, {
            filter: function (object) {
                return object.memory.role == 'pickuper'
            }
        });

        if (pick.length < 1) {
            pick = 0;
        } else {
            pick = 1
        }

        if (pick == 1 && pickupers.length == 1) {
            var pick1 = 0;
        } else if (pick == 0 && pickupers.length == 1) {
            var pick1 = 1;
        } else {
            var pick1 = 0;
        }
    }

    var LinkFrom = Game.getObjectById('5c01955fe279c454f9297bb3');
    var LinkTo = Game.getObjectById('5c016c862c9b1e46a3341656');
    if (LinkFrom.energy > 0 && LinkTo.energy < LinkTo.energyCapacity) {
        LinkFrom.transferEnergy(LinkTo);
    }
    var LinkFrom1 = Game.getObjectById('5c0825fda4618c742f70b565');
    if (LinkFrom1.energy > 0 && LinkTo.energy < LinkTo.energyCapacity) {
        LinkFrom1.transferEnergy(LinkTo);
    }

    var LinkFrom2 = Game.getObjectById('5c25913e1841ad1874a03e68');
    var LinkTo1 = Game.getObjectById('5c254d95b4a2ff07324c3995');
    if (LinkFrom2.energy > 0 && LinkTo1.energy < LinkTo1.energyCapacity) {
        LinkFrom2.transferEnergy(LinkTo1);
    }

    var towers = Game.rooms.W22S11.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    var towers1 = Game.rooms.W23S11.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers) {
        if (tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            } else {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_WALL && structure.hits <= 45000) ||
                        (structure.structureType == STRUCTURE_ROAD && structure.hits <= structure.hitsMax * 0.9) ||
                        (structure.structureType == STRUCTURE_RAMPART && structure.hits <= 45000));

                    }
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
                var damagedCreep = tower.pos.findClosestByRange(FIND_CREEPS, {
                    filter: (c) => c.hits < c.hitsMax
                });
                if (damagedCreep) {
                    tower.heal(damagedCreep);
                }
            }
            if(!closestHostile || !closestDamagedStructure || !damagedCreep) {
                break;
            }
        }
    }
    
    for (let tower1 of towers1) {
        if (tower1) {
            var closestHostile = tower1.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower1.attack(closestHostile);
            } else {
                var closestDamagedStructure = tower1.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_WALL && structure.hits <= 5000) ||
                        (structure.structureType == STRUCTURE_ROAD && structure.hits <= structure.hitsMax * 0.9) ||
                        (structure.structureType == STRUCTURE_RAMPART && structure.hits <= 7000));

                    }
                });
                if (closestDamagedStructure) {
                    tower1.repair(closestDamagedStructure);
                }
                var damagedCreep = tower1.pos.findClosestByRange(FIND_CREEPS, {
                    filter: (c) => c.hits < c.hitsMax
                });
                if (damagedCreep) {
                    tower1.heal(damagedCreep);
                }
            }
            if(!closestHostile || !closestDamagedStructure || !damagedCreep) {
                break;
            }
        }
    }
    
    var builds;

    var sites = Game.rooms.W22S11.find(FIND_CONSTRUCTION_SITES);
    if (sites.length > 0) {
        builds = 2;
    } else {
        builds = 0;
    }

    var builds1;

    var sites1 = Game.rooms.W23S11.find(FIND_CONSTRUCTION_SITES);
    if (sites1.length > 0) {
        builds1 = 1;
    } else {
        builds1 = 0;
    }

    var contain = Game.getObjectById('5c0b6a315c1c2e578f4cc6b1');
    var disturbs;
    if (contain.store[RESOURCE_ENERGY] == 0) {
        disturbs = 0;
    } else {
        disturbs = 1;
    }

    var terms = Memory.W22S11.term;
    if(!terms && (Game.rooms.W22S11.terminal.store[RESOURCE_ENERGY] > 3000 &&
        Game.rooms.W22S11.terminal.store[RESOURCE_OXYGEN] > 3500)) {
        Memory.W22S11.term = 0;
    }

    //SPECIAL

    if (Game.time % 20 == 0) {

        if (claimers.length < 0) {
            var newName = 'Claimer';
            Game.spawns['Home1'].spawnCreep([CLAIM, MOVE], newName,
                { memory: { role: 'claimer' } }); //WORK = 0, CARRY = 2, MOVE = 3 => Cost = 650;
        }

        if (extract < 1) {
            var newName = 'Extractor';
            Game.spawns['HomeH'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,
                                                   MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
                { memory: { role: 'extractor' } }); //WORK = 4, CARRY = 4, MOVE = 8 => Cost = 1000;
        } else

        if (extract1 < 1) {
            var newName = 'Extractor_N';
            Game.spawns['Home1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'extractor' } }); //WORK = 4, CARRY = 2, MOVE = 5 => Cost = 750;
        }

        if (tworkers.length < terms) {
            var newName = 'TerminalWorker1';
            Game.spawns['HomeH'].spawnCreep([CARRY,CARRY,MOVE], newName,
                { memory: { role: 'tworker' } }); //WORK = 0, CARRY = 2, MOVE = 1 => Cost = 150;
        }
    }

    //ROOM 1
    if (Game.time % 15 == 0) {

        if (harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            Game.spawns['Home'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'harvester' } }); //WORK = 3, CARRY = 3, MOVE = 5 => Cost = 700
        }

        if (harvestersS2.length < 2) {
            var newName = 'Harvester2S' + Game.time;
            Game.spawns['HomeH'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'harvesterS2' } }); //WORK = 2, CARRY = 2, MOVE = 3 => Cost = 600
        }

        if (distributors.length < 1) {
            var newName = 'Distributor' + Game.time;
            Game.spawns['Home'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'distributor' } }); //WORK = 0, CARRY = 4, MOVE = 3 => Cost = 350
        }

        if (upgraders.length < 3) {
            var newName = 'Upgrader' + Game.time;
            Game.spawns['HomeH'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } }); //WORK = 6, CARRY = 3, MOVE = 8 => Cost = 1150
        }

        if (builders.length < builds) {
            var newName = 'Builder' + Game.time;
            Game.spawns['Home'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'builder' } }); //WORK = 1, CARRY = 2, MOVE = 2 => Cost = 350
        }

        if (repairers.length < 1) {
            var newName = 'Repairer' + Game.time;
            Game.spawns['Home'].spawnCreep([CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,CARRY,MOVE,MOVE], newName,
                { memory: { role: 'repairer' } }); //CARRY = 7, MOVE = 6 => Cost = 650
        }
    }

    if (pick < 1) {
        var newName = 'Pickuper';
        Game.spawns['HomeH'].spawnCreep([CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE], newName,
            { memory: { role: 'pickuper' } }); //CARRY = 2, MOVE = 3 => Cost = 400
    }

    //ROOM 2

    if (ndistributors.length < 1) {
        var newName = 'NDistributor';
        Game.spawns['Home1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            { memory: { role: 'ndistributor' } }); //WORK = 1, CARRY = 4, MOVE = 3 => Cost = 650
    }

    if (pick1 < 1) {
        var newName = 'Pickuper_N';
        Game.spawns['Home1'].spawnCreep([CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE], newName,
            { memory: { role: 'pickuper' } }); //CARRY = 4, MOVE = 4 => Cost = 400
    }

    if (Game.time % 10 == 0) {

        if (nupgraders.length < 2) {
            var newName = 'NUpgrader' + Game.time;
            Game.spawns['Home1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'nupgrader' } }); //WORK = 2, CARRY = 2, MOVE = 3 => Cost = 450
        }

        if (nrepairers.length < 1) {
            var newName = 'NRepairer' + Game.time;
            Game.spawns['Home1'].spawnCreep([CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'nrepairer' } }); //WORK = 0, CARRY = 5, MOVE = 4 => Cost = 550
        }

        if (nbuilders.length < builds1) {
            var newName = 'nBuilder' + Game.time;
            Game.spawns['Home1'].spawnCreep([WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'nbuilder' } }); //WORK = 4, CARRY = 2, MOVE = 6 => Cost = 800
        }

        if (harvs.length < 2) {
            var newName = 'Harv' + Game.time;
            Game.spawns['Home1'].spawnCreep([WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, WORK, MOVE, WORK, MOVE], newName,
                { memory: { role: 'harv' } }); //WORK = 5, CARRY = 2, MOVE = 7 => Cost = 800
        }
    }

    //ROOM 3

	if (nnbuilders.length < 2) {
        var newName = 'nnBuilder' + Game.time;
        Game.spawns['Home2'].spawnCreep([WORK,MOVE,WORK,WORK,MOVE,WORK,MOVE,CARRY,MOVE,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'nnbuilder'}}); //WORK = 4, CARRY = 2, MOVE = 6 => Cost = 800
    }



    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        } else if (creep.memory.role == 'distributor') {
            roleDistributor.run(creep);
        } else if (creep.memory.role == 'harvesterS2') {
            roleHarvesterS2.run(creep);
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        } else if (Game.cpu.getUsed() <= 12) {
            if (creep.memory.role == 'nbuilder') {
                roleNBuilder.run(creep);
            } else if (creep.memory.role == 'nrepairer') {
                roleNRepairer.run(creep);
            } else if (creep.memory.role == 'ndistributor') {
                roleNDistributor.run(creep);
            } else if (creep.memory.role == 'nupgrader') {
                roleNUpgrader.run(creep);
            } else if (creep.memory.role == 'nnbuilder') {
                roleNNBuilder.run(creep);
            } else if (creep.memory.role == 'harv') {
                roleHarv.run(creep);
            } else if (creep.memory.role == 'extractor') {
                roleExtractor.run(creep);
            } else if (creep.memory.role == 'pickuper') {
                rolePickuper.run(creep);
            }
            if (creep.memory.role == 'tworker') {
                roleTerminalWorker.run(creep);
            }
        }
    }
}
