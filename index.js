var photons=[];
var D0=[];  //Straight
var D1=[];  //Down
var timer=[];

var lastD0=null;

var c,canv,w,h,sim;
window.addEventListener('load',()=>{
    //alert("loaded, Hello world!");
    canv = document.getElementById('simSpace');
    c = canv.getContext('2d');
    clear();

    sim=setInterval(tick,1);
});

var tickCount = 0;
var laser_AB=false;
var laser_B=false;
var laser_C=true;
var restartCounter=true;
function tick(){
    //if(tickCount%50==0 && laser) createPhoton();
    //if(tickCount%100*Math.sin(Math.floor(tickCount/100))==0) createPhoton();
    //if(tickCount%20==0 && laser && Math.sin(tickCount)>0.2) createPhoton();


    if(tickCount%20==0 && laser_AB) createPhoton();
    if(Math.random()>0.99 && laser_B) createPhoton();
    if(Math.random()>0.7 && laser_C) createPhoton();
    
    for(var i=0;i<photons.length; i++){
        doPhysics(photons[i]);
    }
    clear();
    draw();
    tickCount++;
}

var lastPhoton=0;
function createPhoton(xoff=0){
    photons.push({
        id: lastPhoton++,
        x: 30+xoff,
        y: 250,
        vx: 0.5,
        vy: 0
    });
}

function btn_clearSensorData(){
    D0=[];  //Straight
    D1=[];  //Down
    timer=[];
}

function btn_toggleLaser_AB(){
    laser_AB = !laser_AB;
    document.getElementById("btn_toggleLaser_AB").style.backgroundColor=laser_AB?"#0F0":"#F00";
}
function btn_toggleLaser_B(){
    laser_B = !laser_B;
    document.getElementById("btn_toggleLaser_B").style.backgroundColor=laser_B?"#0F0":"#F00";
}
function btn_toggleLaser_C(){
    laser_C = !laser_C;
    document.getElementById("btn_toggleLaser_C").style.backgroundColor=laser_C?"#0F0":"#F00";
}
function btn_toggleTimerRestart(){
    restartCounter = !restartCounter;
    document.getElementById("btn_toggleTimerRestart").style.backgroundColor=restartCounter?"#0F0":"#F00";
}

function doPhysics(p){
    p.x+=p.vx;
    p.y+=p.vy;

    if(p.x>=250 && !p["bs"]){
        p.bs=true;
        if(Math.random()<0.5){
            p.vx=0;
            p.vy=0.5;
        }
    }

    if(p.x>=400){
        D0.push(tickCount);
        if(lastD0==null || restartCounter) lastD0=tickCount;
        destroyPhoton(p);
    }

    if(p.y>=400){
        D1.push(tickCount);
        if(lastD0!=null){
            timer.push(tickCount-lastD0);
            lastD0=null;
        }
        destroyPhoton(p);
    }

}

function destroyPhoton(p){
    photons = photons.filter(op=>(op.id!=p.id))
}

function draw(){
    drawStatics();
    drawInfo();
    drawHistogram();
    //drawPhothons
    photons.forEach(drawPhoton)
}

function drawHistogram(){
    c.beginPath();
    c.rect(30,40,800,150);

    var counter={};
    var maxHits=0;
    timer.forEach(time=>{
        if(!counter[time]) counter[time]=0;
        counter[time]++;
        if(counter[time]>maxHits) maxHits=counter[time];
    });

    c.stroke();
    c.beginPath();
    c.strokeStyle="#F00";
    var vals=Object.keys(counter);
    vals = vals.sort((a,b)=>(a-b));
    for(var i = 0; i<vals.length; i++){
        var height=counter[vals[i]]*140/maxHits
        c.rect(30+i*20,40+150-height,20,height)
        c.fillText(`${vals[i]}`,30+i*20+5,40+150+10)
        //console.log(`(${vals[i]}, ${height})`);
    }
    c.stroke();
    c.strokeStyle="#000";
}

function drawInfo(){
    c.font="10px Arial";
    c.fillText(`#Phot: ${photons.length}`,0,10);
    c.fillText(`#D0: ${D0.length}`,0,20);
    c.fillText(`#D1: ${D1.length}`,0,30);
    c.fillText(`Hist: `,0,45);
}

function drawPhoton(p){
    c.beginPath();
    c.arc(p.x,p.y,2,0,2*Math.PI);
    c.fill();
}

function drawStatics(){
    //photon source
    c.rect(10,250-5,20,10);
    
    //b split
    c.rect(250-20,250-20,40,40);
    c.moveTo(250-20,250-20);
    c.lineTo(250+20,250+20);
    
    c.moveTo(250-20,400);
    c.lineTo(250+20,400);
    c.arc(250,400,20,0,Math.PI);
    
    
    c.moveTo(400,250-20);
    c.lineTo(400,250+20);
    c.arc(400,250,20,3*Math.PI/2,Math.PI/2);
    c.stroke();
}


function clear(){
    w = (canv.width =window.innerWidth);
    h = (canv.height=500);
}

