/*=========================================================
    Temporal Non-uniform Cellular Automata Simulator
    Part 1 : Core Functions
=========================================================*/

let cy = null;


/*=========================================================
    Decimal → Binary
=========================================================*/

function decimalToBinary(n){

    return Number(n).toString(2);

}


/*=========================================================
    Binary Array → Decimal
=========================================================*/

function BtoD(bits){

    let value = 0;

    for(let i=0;i<bits.length;i++)
        value = value*2 + bits[i];

    return value;

}


/*=========================================================
    Decimal → Binary Array
=========================================================*/

function DtoBbit(number,n){

    let s = Number(number).toString(2);

    while(s.length<n)
        s="0"+s;

    return s.split("").map(Number);

}


/*=========================================================
    Generate Wolfram Rule Table
=========================================================*/

function rules(rule){

    let s = decimalToBinary(rule);

    while(s.length<8)
        s="0"+s;

    return s.split("").map(Number);

}


/*=========================================================
    Generate All Configurations
=========================================================*/

function generateConfigurations(n){

    let configs=[];

    let total=Math.pow(2,n);

    for(let i=0;i<total;i++){

        configs.push({

            decimal:i,

            binary:DtoBbit(i,n)

        });

    }

    return configs;

}


/*=========================================================
    Apply One Rule
=========================================================*/

function applyRule(configuration,rule){

    const n=configuration.length;

    const table=rules(rule).reverse();

    let next=[...configuration];

    for(let i=0;i<n;i++){

        let neighbourhood;

        if(i===0){

            neighbourhood=[

                0,

                configuration[i],

                configuration[i+1]

            ];

        }

        else if(i===n-1){

            neighbourhood=[

                configuration[i-1],

                configuration[i],

                0

            ];

        }

        else{

            neighbourhood=[

                configuration[i-1],

                configuration[i],

                configuration[i+1]

            ];

        }

        let index=BtoD(neighbourhood);

        next[i]=table[index];

    }

    return next;

}


/*=========================================================
    Parse Rule Inputs
=========================================================*/

function getRules(){

    let ruleA=parseInt(

        document.getElementById("ruleA").value

    );

    let ruleB=parseInt(

        document.getElementById("ruleB").value

    );

    if(isNaN(ruleA) || ruleA<0 || ruleA>255){

        alert("Rule A must be between 0 and 255.");

        return null;

    }

    if(isNaN(ruleB) || ruleB<0 || ruleB>255){

        alert("Rule B must be between 0 and 255.");

        return null;

    }

    return{

        A:ruleA,

        B:ruleB

    };

}


/*=========================================================
    Parse Update Sequence
=========================================================*/

function getSequence(){

    let text=document

    .getElementById("sequence")

    .value

    .trim()

    .toUpperCase();

    if(text.length===0){

        alert("Enter update sequence.");

        return null;

    }

    let seq=text

    .split(",")

    .map(x=>x.trim());

    for(let s of seq){

        if(s!=="A" && s!=="B"){

            alert(

                "Sequence must contain only A and B."

            );

            return null;

        }

    }

    return seq;

}


/*=========================================================
    Rule Used At Time t
=========================================================*/

function ruleAtTime(t,ruleSet,sequence){

    const symbol=

        sequence[

            t%sequence.length

        ];

    if(symbol==="A")
        return ruleSet.A;

    return ruleSet.B;

}

/*=========================================================
    Build Transition Table
=========================================================*/

function buildTransitions(ruleSet, n) {

    const configurations = generateConfigurations(n);

    const transitions = [];

    for (const cfg of configurations) {

        // Apply Rule A
        const nextA = applyRule(
            cfg.binary,
            ruleSet.A
        );

        // Apply Rule B
        const nextB = applyRule(
            cfg.binary,
            ruleSet.B
        );

        transitions.push({

            source: cfg.decimal,

            sourceBinary: cfg.binary,

            targetA: BtoD(nextA),

            targetABinary: nextA,

            targetB: BtoD(nextB),

            targetBBinary: nextB

        });

    }

    return transitions;

}

/*=========================================================
    Update Information
=========================================================*/

function updateInfo(n){

    document

    .getElementById("cellCount")

    .textContent=n;

    document

    .getElementById("configCount")

    .textContent=Math.pow(2,n);

}


/*=========================================================
    Number of Cells
=========================================================*/

function numberOfCells(){

    const n = parseInt(
        document.getElementById("cells").value
    );

    if(isNaN(n) || n < 1){

        alert("Enter a valid number of cells.");

        return null;

    }

    return n;

}

/*=========================================================
        Part 2 : Graph Construction
=========================================================*/


/*---------------------------------------------------------
    Create Cytoscape Elements
---------------------------------------------------------*/

function createElements(transitions,n){

    const elements=[];

    const total=Math.pow(2,n);

    /*--------------------------
        Nodes
    --------------------------*/

    for(let i=0;i<total;i++){

        elements.push({

            data:{

                id:String(i),

                label:i.toString(2).padStart(n,"0")

            }

        });

    }

    /*--------------------------
        Rule A (Solid)
    --------------------------*/

    let id=0;

    for(const t of transitions){

        elements.push({

            data:{

                id:"A"+id++,

                source:String(t.source),

                target:String(t.targetA),

                edgeType:"solid",

                rule:"A"

            }

        });

    }

    /*--------------------------
        Rule B (Dashed)
    --------------------------*/

    id=0;

    for(const t of transitions){

        elements.push({

            data:{

                id:"B"+id++,

                source:String(t.source),

                target:String(t.targetB),

                edgeType:"dashed",

                rule:"B"

            }

        });

    }

    return elements;

}



/*---------------------------------------------------------
    Destroy Previous Graph
---------------------------------------------------------*/

function clearGraph(){

    if(cy!=null){

        cy.destroy();

        cy=null;

    }

}



/*---------------------------------------------------------
    Draw Graph
---------------------------------------------------------*/

function drawGraph(ruleSet,n){

    clearGraph();

    const transitions=
        buildTransitions(ruleSet,n);

    cy=cytoscape({

        container:
        document.getElementById("cy"),

        elements:
        createElements(transitions,n),

        style:[

        /*=========================
            Nodes
        =========================*/

        {

            selector:"node",

            style:{

                "shape":"rectangle",

                "background-color":"white",

                "border-width":1.5,

                "border-color":"black",

                "width":72,

                "height":34,

                "label":"data(label)",

                "font-family":"STIX Two Math",

                "font-size":18,

                "font-weight":"bold",

                "color":"black",

                "text-valign":"center",

                "text-halign":"center"

            }

        },

        /*=========================
            Rule A
        =========================*/

        {

            selector:"edge[edgeType='solid']",

            style:{

                "line-style":"solid",

                "line-color":"black",

                "target-arrow-color":"black",

                "target-arrow-shape":"triangle",

                "curve-style":"bezier",

                "width":2,

                "arrow-scale":1.2

            }

        },

        /*=========================
            Rule B
        =========================*/

        {

            selector:"edge[edgeType='dashed']",

            style:{

                "line-style":"dashed",

                "line-color":"black",

                "target-arrow-color":"black",

                "target-arrow-shape":"triangle",

                "curve-style":"bezier",

                "width":2,

                "arrow-scale":1.2

            }

        }

        ],

       layout: {
                name: "cose",
                animate: false,
                randomize: true,
                fit: true,
                padding: 100,

                nodeRepulsion: 1000000,
                idealEdgeLength: 200,
                edgeElasticity: 50,

                gravity: 20,
                componentSpacing: 200,
                numIter: 5000
            }

    });

}



/*---------------------------------------------------------
    Generate Graph
---------------------------------------------------------*/

function generateGraph(){

    const rules=getRules();

    if(rules==null)
        return;

    const n=numberOfCells();

    updateInfo(n);

    drawGraph(rules,n);

}



/*---------------------------------------------------------
    Generate Button
---------------------------------------------------------*/

document

.getElementById("generateBtn")

.addEventListener(

"click",

generateGraph

);



/*---------------------------------------------------------
    ENTER Key
---------------------------------------------------------*/

document

.getElementById("sequence")

.addEventListener(

"keypress",

function(e){

    if(e.key==="Enter")
        generateGraph();

}

);



/*---------------------------------------------------------
    Auto Generate
---------------------------------------------------------*/

window.onload=function(){

    generateGraph();

};

