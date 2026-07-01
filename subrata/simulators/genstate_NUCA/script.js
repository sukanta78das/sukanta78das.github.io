/*=========================================================
    Non-uniform Cellular Automata Simulator
    Part 1 : Core Cellular Automata Functions
=========================================================*/

let cy = null;

/*---------------------------------------------------------
    Utility Functions
---------------------------------------------------------*/

// Decimal → Binary String
function decimalToBinary(n) {
    return Number(n).toString(2);
}

// Binary Array → Decimal
function BtoD(bits) {

    let value = 0;

    for (let i = 0; i < bits.length; i++) {
        value = value * 2 + bits[i];
    }

    return value;
}

// Decimal → Binary Array of fixed length n
function DtoBbit(number, n) {

    let s = Number(number).toString(2);

    while (s.length < n)
        s = "0" + s;

    return s.split("").map(Number);

}

/*---------------------------------------------------------
    Wolfram Rule
---------------------------------------------------------*/

function rules(rule) {

    let s = decimalToBinary(rule);

    while (s.length < 8)
        s = "0" + s;

    return s.split("").map(Number);

}

/*---------------------------------------------------------
    Generate All Configurations
---------------------------------------------------------*/

function generateConfigurations(n) {

    const configs = [];

    const total = Math.pow(2, n);

    for (let i = 0; i < total; i++) {

        configs.push({

            decimal: i,

            binary: DtoBbit(i, n)

        });

    }

    return configs;

}

/*---------------------------------------------------------
    Null Boundary Update
---------------------------------------------------------*/

function nonUniformUpdateNull(configuration, ruleSequence) {

    const n = configuration.length;

    const next = [...configuration];

    // Reverse every rule table
    const tables = [];

    for (let r of ruleSequence) {

        let table = rules(r);

        table.reverse();

        tables.push(table);

    }

    for (let i = 0; i < n; i++) {

        let neighbourhood;

        if (i === 0) {

            neighbourhood = [

                0,
                configuration[i],
                configuration[i + 1]

            ];

        }
        else if (i === n - 1) {

            neighbourhood = [

                configuration[i - 1],
                configuration[i],
                0

            ];

        }
        else {

            neighbourhood = [

                configuration[i - 1],
                configuration[i],
                configuration[i + 1]

            ];

        }

        const index = BtoD(neighbourhood);

        next[i] = tables[i][index];

    }

    return next;

}

/*---------------------------------------------------------
    Parse Rule Sequence
---------------------------------------------------------*/

function getRuleSequence() {

    const text =
        document.getElementById("rules").value.trim();

    if (text.length === 0) {

        alert("Please enter a rule sequence.");

        return null;

    }

    const seq =
        text.split(",").map(x => Number(x.trim()));

    for (let r of seq) {

        if (isNaN(r) || r < 0 || r > 255) {

            alert("Rules must be integers between 0 and 255.");

            return null;

        }

    }

    return seq;

}

/*---------------------------------------------------------
    Update Information Panel
---------------------------------------------------------*/

function updateInfo(n) {

    document.getElementById("cellCount").textContent = n;

    document.getElementById("configCount").textContent =
        Math.pow(2, n);

}

/*---------------------------------------------------------
    Build Transition Edge List
---------------------------------------------------------*/

function buildEdges(ruleSequence) {

    const n = ruleSequence.length;

    const configs =
        generateConfigurations(n);

    const edges = [];

    for (let cfg of configs) {

        const next =
            nonUniformUpdateNull(
                cfg.binary,
                ruleSequence
            );

        edges.push({

            source: cfg.decimal,

            target: BtoD(next)

        });

    }

    return edges;

}

/*=========================================================
    Part 2 : Graph Visualization
=========================================================*/

/*
----------------------------------------------------------
Create Cytoscape Elements
----------------------------------------------------------
*/

function createElements(ruleSequence) {

    const n = ruleSequence.length;
    const total = Math.pow(2, n);

    const elements = [];

    /*--------------------------
        Nodes
    --------------------------*/

    for (let i = 0; i < total; i++) {

        elements.push({

            data: {

                id: String(i),

                label: i.toString(2).padStart(n, "0")

            }

        });

    }

    /*--------------------------
        Edges
    --------------------------*/

    const edges = buildEdges(ruleSequence);

    let id = 0;

    for (const e of edges) {

        elements.push({

            data: {

                id: "e" + id++,

                source: String(e.source),

                target: String(e.target)

            }

        });

    }

    return elements;

}


/*
----------------------------------------------------------
Destroy Previous Graph
----------------------------------------------------------
*/

function clearGraph() {

    if (cy != null) {

        cy.destroy();

        cy = null;

    }

}


/*
----------------------------------------------------------
Create Graph
----------------------------------------------------------
*/

function drawGraph(ruleSequence) {

    clearGraph();

    updateInfo(ruleSequence.length);

    cy = cytoscape({

        container: document.getElementById("cy"),

        elements: createElements(ruleSequence),

        style: [

        //--------------------------------------
        // Nodes
        //--------------------------------------

        {

            selector: "node",

            style: {

                "shape": "round-rectangle",

                "background-color": "#FFFFFF",

                "border-width": 1.5,

                "border-color": "#000000",

                "width": 72,

                "height": 34,

                "label": "data(label)",

                "font-family": "'STIX Two Math'",

                "font-size": 18,

                "font-weight": "bold",

                "color": "#000000",

                "text-valign": "center",

                "text-halign": "center"

            }

        },

        //--------------------------------------
        // Edges
        //--------------------------------------

        {

            selector: "edge",

            style: {

                "width": 1.8,

                "line-color": "#000000",

                "target-arrow-color": "#000000",

                "target-arrow-shape": "triangle",

                "curve-style": "bezier",

                "arrow-scale": 1.3

            }

        }

        ],

        layout: {

            name: "cose-bilkent",

            animate: false,

            randomize: false,

            fit: true,

            padding: 60,

            nodeRepulsion: 15000,

            idealEdgeLength: 180,

            edgeElasticity: 0.30,

            nestingFactor: 0.1,

            gravity: 0.2,

            numIter: 2500

        }

    });

}


/*
----------------------------------------------------------
Generate Graph
----------------------------------------------------------
*/

function generateGraph() {

    const ruleSequence = getRuleSequence();

    if (ruleSequence == null)
        return;

    drawGraph(ruleSequence);

}


/*
----------------------------------------------------------
Button Events
----------------------------------------------------------
*/

document
.getElementById("generateBtn")
.addEventListener(

    "click",

    generateGraph

);


/*
----------------------------------------------------------
Press ENTER
----------------------------------------------------------
*/

document
.getElementById("rules")
.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter")
            generateGraph();

    }

);


/*
----------------------------------------------------------
Generate Initial Graph
----------------------------------------------------------
*/

window.onload=function(){

    generateGraph();

};

/*=========================================================
    Part 3 : Export and Utility Functions
=========================================================*/


/*---------------------------------------------------------
    Get Current Rule Name
---------------------------------------------------------*/

function getRuleName() {

    const text =
        document.getElementById("rules")
        .value
        .trim();

    return text.replace(/,/g, "_");

}


/*---------------------------------------------------------
    Download PNG
---------------------------------------------------------*/

function downloadPNG() {

    if (cy == null) {

        alert("Generate a graph first.");

        return;

    }

    const png = cy.png({

        full: true,

        scale: 6,

        bg: "white"

    });

    const link =
        document.createElement("a");

    link.href = png;

    link.download =
        "CA_State_Graph_" +
        getRuleName() +
        ".png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


/*---------------------------------------------------------
    Download SVG
---------------------------------------------------------*/

function downloadSVG() {

    if (cy == null) {

        alert("Generate a graph first.");

        return;

    }

    if (typeof cy.svg !== "function") {

        alert(
            "SVG extension is not loaded."
        );

        return;

    }

    const svg = cy.svg({

        full: true,

        scale: 2

    });

    const blob =
        new Blob(

            [svg],

            {
                type:
                "image/svg+xml;charset=utf-8"
            }

        );

    saveAs(

        blob,

        "CA_State_Graph_" +
        getRuleName() +
        ".svg"

    );

}


/*---------------------------------------------------------
    Fit Graph
---------------------------------------------------------*/

function fitGraph() {

    if (cy == null)
        return;

    cy.fit(40);

}


/*---------------------------------------------------------
    Reset Zoom
---------------------------------------------------------*/

function resetView() {

    if (cy == null)
        return;

    cy.zoom(1);

    cy.center();

}


/*---------------------------------------------------------
    Lock Nodes
---------------------------------------------------------*/

function lockNodes() {

    if (cy == null)
        return;

    cy.nodes().lock();

}


/*---------------------------------------------------------
    Unlock Nodes
---------------------------------------------------------*/

function unlockNodes() {

    if (cy == null)
        return;

    cy.nodes().unlock();

}


/*---------------------------------------------------------
    Enable Mouse Wheel Zoom
---------------------------------------------------------*/

function enableInteraction() {

    if (cy == null)
        return;

    cy.userZoomingEnabled(true);

    cy.userPanningEnabled(true);

    cy.boxSelectionEnabled(false);

}


/*---------------------------------------------------------
    Toolbar Buttons
---------------------------------------------------------*/

document
.getElementById("pngBtn")
.addEventListener(

    "click",

    downloadPNG

);


document
.getElementById("svgBtn")
.addEventListener(

    "click",

    downloadSVG

);


/*---------------------------------------------------------
    Improve Graph After Layout
---------------------------------------------------------*/

document.addEventListener(

    "DOMContentLoaded",

    function(){

        generateGraph();

        setTimeout(function(){

            fitGraph();

            lockNodes();

            enableInteraction();

        },700);

    }

);


/*---------------------------------------------------------
    Fit After Every New Graph
---------------------------------------------------------*/

const oldGenerate =
generateGraph;

generateGraph = function(){

    oldGenerate();

    setTimeout(function(){

        fitGraph();

        lockNodes();

        enableInteraction();

    },500);

};