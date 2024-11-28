function setup() {
    var processSizesInput = document.getElementById("processSizes").value;
    var blockSizesInput = document.getElementById("blockSizes").value;

    var processes = processSizesInput.split(",").map(function(size) {
        return parseInt(size.trim());
    });

    var blocks = blockSizesInput.split(",").map(function(size) {
        return parseInt(size.trim());
    });

    displayAllocation(processes, blocks);
}

function displayAllocation(processes, blocks) {
    var firstFitAllocation = firstFit(processes, blocks.slice());
    var bestFitAllocation = bestFit(processes, blocks.slice());
    var worstFitAllocation = worstFit(processes, blocks.slice());
    var nextFitAllocation = nextFit(processes, blocks.slice());

    displayMemory("First Fit", firstFitAllocation, "firstFitAllocation", blocks, processes);
    displayMemory("Best Fit", bestFitAllocation, "bestFitAllocation", blocks, processes);
    displayMemory("Worst Fit", worstFitAllocation, "worstFitAllocation", blocks, processes);
    displayMemory("Next Fit", nextFitAllocation, "nextFitAllocation", blocks, processes);

    var unallocatedFirstFit = findUnallocatedProcesses(processes, firstFitAllocation);
    var unallocatedBestFit = findUnallocatedProcesses(processes, bestFitAllocation);
    var unallocatedWorstFit = findUnallocatedProcesses(processes, worstFitAllocation);
    var unallocatedNextFit = findUnallocatedProcesses(processes, nextFitAllocation);

    displayUnallocatedProcesses(unallocatedFirstFit, "unallocatedProcessesFirstFit");
    displayUnallocatedProcesses(unallocatedBestFit, "unallocatedProcessesBestFit");
    displayUnallocatedProcesses(unallocatedWorstFit, "unallocatedProcessesWorstFit");
    displayUnallocatedProcesses(unallocatedNextFit, "unallocatedProcessesNextFit");
}

function firstFit(processes, blocks) {
    var allocation = new Array(blocks.length).fill(-1);
    for (var i = 0; i < processes.length; i++) {
        for (var j = 0; j < blocks.length; j++) {
            if (blocks[j] >= processes[i] && allocation[j] === -1) {
                allocation[j] = i;
                break;
            }
        }
    }
    return allocation;
}

function bestFit(processes, blocks) {
    var allocation = new Array(blocks.length).fill(-1);
    for (var i = 0; i < processes.length; i++) {
        var bestIndex = -1;
        for (var j = 0; j < blocks.length; j++) {
            if (blocks[j] >= processes[i] && allocation[j] === -1) {
                if (bestIndex === -1 || blocks[j] < blocks[bestIndex]) {
                    bestIndex = j;
                }
            }
        }
        if (bestIndex !== -1) {
            allocation[bestIndex] = i;
        }
    }
    return allocation;
}

function worstFit(processes, blocks) {
    var allocation = new Array(blocks.length).fill(-1);
    for (var i = 0; i < processes.length; i++) {
        var worstIndex = -1;
        for (var j = 0; j < blocks.length; j++) {
            if (blocks[j] >= processes[i] && allocation[j] === -1) {
                if (worstIndex === -1 || blocks[j] > blocks[worstIndex]) {
                    worstIndex = j;
                }
            }
        }
        if (worstIndex !== -1) {
            allocation[worstIndex] = i;
        }
    }
    return allocation;
}

function nextFit(processes, blocks) {
    var allocation = new Array(blocks.length).fill(-1);
    var lastIndex = 0;
    for (var i = 0; i < processes.length; i++) {
        for (var j = lastIndex; j < blocks.length; j++) {
            if (blocks[j] >= processes[i] && allocation[j] === -1) {
                allocation[j] = i;
                lastIndex = j;
                break;
            }
        }
    }
    return allocation;
}

function findUnallocatedProcesses(processes, allocation) {
var unallocated = [];
for (var i = 0; i < processes.length; i++) {
    var allocated = false;
    for (var j = 0; j < allocation.length; j++) {
        if (allocation[j] === i) {
            allocated = true;
            break;
        }
    }
    if (!allocated) {
        unallocated.push(i + 1); // Adjust indexing here
    }
}
return unallocated;
}




function displayMemory(title, allocation, divId, blocks, processes) {
    var div = document.getElementById(divId);
    div.innerHTML = "<h4>" + title + "</h4>";
    for (var i = 0; i < blocks.length; i++) {
        var block = "<div class='block'>";
        block += "<div class='block-header'>Block " + (i + 1) + "</div>";
        block += "<div class='block-content'>";
        if (allocation[i] !== -1) {
            block += "<div class='flexbox'><p class='allocated'>Process " + (allocation[i]+1) + "</p><p class='unallocated'>Remaining: " + (blocks[i] - processes[allocation[i]]) + "</p></div>";
        } else {
            block += "<p class='unallocated'>Free: " + blocks[i] + "</p>";
        }
        block += "</div>";
        block += "</div>";
        div.innerHTML += block;
    }
}

function displayUnallocatedProcesses(unallocated, divId) {
    var div = document.getElementById(divId);
    if (unallocated.length > 0) {
        div.innerHTML += "<div class='not-allocated'><h4>Unallocated Processes:</h4>";
        unallocated.forEach(function(process) {
            div.innerHTML += "<p>Process " + process + " = not allocated</p>";
        });
        div.innerHTML += "</div>";
    }
}