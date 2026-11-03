const CY=120,T0=Math.random(),SY=70;
let DY=1;

function mixc(a,b,t){
  return a.map((v,i)=>v+(b[i]-v)*t);
}

function rgb(c,a){
  return `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a==null?1:a})`;
}

function drawScene(d){
  const now=performance.now()/1000;
  const tod=(now/CY+T0)%1;
  const dy=Math.min(1,Math.max(0,Math.sin(2*Math.PI*(tod-.25))*1.3+.5));
  DY=dy;

  const gl=Math.exp(-Math.pow((dy-.5)/.2,2));
  const top=mixc([8,16,46],[120,195,245],dy);
  const hor=mixc(top,[255,150,90],gl*.8);

  const sg=g.createLinearGradient(0,0,0,SY+8);
  sg.addColorStop(0,rgb(top));
  sg.addColorStop(1,rgb(hor));
  g.fillStyle=sg;
  g.fillRect(0,0,W,SY+10);

  if(dy<.6){
    g.fillStyle='#fff';
    for(let i=0;i<24;i++){
      g.globalAlpha=(.6-dy)*(.5+.5*Math.sin(now*2+i));
      g.fillRect(i*137%W,i*53%(SY-12),1.5,1.5);
    }
    g.globalAlpha=1;
  }

  const p=(tod-.25)/.5;
  if(p>=0&&p<=1){
    const x=W*(.08+.84*p);
    const y=SY-6-Math.sin(p*Math.PI)*(SY-24);
    const rg=g.createRadialGradient(x,y,2,x,y,40);
    rg.addColorStop(0,'rgba(255,230,140,.8)');
    rg.addColorStop(1,'rgba(255,230,140,0)');
    g.fillStyle=rg;
    g.fillRect(x-40,y-40,80,80);
    g.fillStyle='#ffe27a';
    g.beginPath();
    g.arc(x,y,10,0,7);
    g.fill();
  }

  const q=((tod-.75+1)%1)/.5;
  if(q>=0&&q<=1){
    const x=W*(.08+.84*q);
    const y=SY-6-Math.sin(q*Math.PI)*(SY-24);
    g.fillStyle='#eef3ff';
    g.beginPath();
    g.arc(x,y,8,0,7);
    g.fill();
    g.fillStyle='rgba(150,160,190,.5)';
    g.beginPath();
    g.arc(x-2,y-1,2,0,7);
    g.arc(x+3,y+3,1.5,0,7);
    g.fill();
  }

  g.fillStyle=`rgba(255,255,255,${.12+.55*dy})`;
  for(let i=0;i<3;i++){
    const x=((now*6+i*300)%(W+160))-80,y=16+i*13;
    g.beginPath();
    g.ellipse(x,y,34,7,0,0,7);
    g.ellipse(x+18,y-4,22,7,0,0,7);
    g.fill();
  }

  const wy=x=>SY+Math.round(
    (Math.sin(x*.03+now*1.6)*2.5+Math.sin(x*.07-now*1.1)*1.5)/2
  )*2;

  const tk=TK[S.tank||0];
  const wt=mixc(mixc(mixc([10,40,90],[100,205,240],dy),tk.t,tk.m),[110,120,50],d*.55);
  const wb=mixc(mixc(mixc([4,14,40],[15,85,150],dy),tk.t2,tk.m),[60,60,25],d*.6);

  const wg=g.createLinearGradient(0,SY,0,H);
  wg.addColorStop(0,rgb(wt));
  wg.addColorStop(1,rgb(wb));

  g.save();
  g.beginPath();
  g.moveTo(0,H);
  g.lineTo(0,SY);
  for(let x=0;x<=W;x+=10)g.lineTo(x,wy(x));
  g.lineTo(W,H);
  g.closePath();
  g.clip();

  for(let i=0;i<9;i++){
    g.fillStyle=rgb(mixc(wt,wb,i/8));
    g.fillRect(0,SY-4+i*45,W,46);
  }
  g.restore();

  g.fillStyle='rgba(255,255,255,'+.1*dy+')';
  for(let i=0;i<16;i++){
    g.fillRect(
      Math.round(((i*97+now*(8+i%3*5))%W)/6)*6,
      SY+12+(i*53%70),12,6
    );
  }

  if(dy>.15){
    g.fillStyle=`rgba(255,255,255,${.07*dy})`;
    for(let i=0;i<5;i++){
      const x=i*180+Math.sin(now*.4+i)*30;
      g.beginPath();
      g.moveTo(x,SY);
      g.lineTo(x+50,SY);
      g.lineTo(x+150,H);
      g.lineTo(x+60,H);
      g.fill();
    }
  }

  g.strokeStyle=`rgba(255,255,255,${.25+.3*dy})`;
  g.lineWidth=1.5;
  g.beginPath();
  for(let x=0;x<=W;x+=10)x?g.lineTo(x,wy(x)):g.moveTo(x,wy(x));
  g.stroke();

  g.fillStyle=rgb(mixc([60,50,45],[217,183,122],dy));
  g.fillRect(0,H-26,W,26);

  g.strokeStyle='rgba(255,255,255,.35)';
  g.lineWidth=1;
  for(let i=0;i<10;i++){
    const y=H-30-((now*28+i*83)%(H-SY-40));
    const x=60+i*76+Math.sin(now+i)*6;
    g.strokeRect(x|0,y|0,3+i%3*2,3+i%3*2);
  }

  g.save();
  g.textAlign='right';
  g.font='20px "VT323",monospace';
  g.fillStyle='#fff';
  g.fillText(
    dy>.85?'☀️ Ban ngày':dy<.15?'🌙 Ban đêm':tod<.5?'🌅 Bình minh':'🌇 Hoàng hôn',
    W-10,20
  );
  g.restore();
}

const CO1=[
  "x    x   x","xx  xx  xx"," xx xx xx ",
  "  xxxxxx  ","   xxxx   ","    xx    ","    xx    "
];
const CO2=[
  "  xxxxxx  "," xxoxxoxx ","xxxxxxxxxx",
  "xoxxoxxoxx","xxxxxxxxxx"
];
const RK=["  xxxx  "," xxxxxxx","xxoxxxxx","xxxxxxxo"];

function spr(rows,x,y,px,a,b){
  for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++){
    const ch=rows[r][c];
    if(ch===' ')continue;
    g.fillStyle=ch==='o'?b:a;
    g.fillRect(x+c*px,y+r*px,px,px);
  }
}

function drawDeco0(){
  const now=performance.now()/1000,B=H-26;

  spr(RK,10,B-16,4,'#7d8794','#5d6672');
  spr(RK,690,B-16,4,'#7d8794','#5d6672');
  spr(CO1,60,B-35,5,'#ff5d73','#c43a52');
  spr(CO1,380,B-35,5,'#ff9f43','#d2691e');
  spr(CO2,230,B-25,5,'#b56cf0','#7f3fbf');
  spr(CO2,540,B-25,5,'#ff8fb1','#d4547e');

  [140,185,330,440,610,745].forEach((x,i)=>{
    const h=8+(i%3)*3,px=4;
    for(let k=0;k<h;k++){
      const xx=x+Math.round(Math.sin(now*1.4+i*1.7+k*.5)*k*.25)*px;
      g.fillStyle=k%2?'#2f9e57':'#237a43';
      g.fillRect(xx,B-(k+1)*px,px*2,px);
      if(k%3===1)g.fillRect(xx+(i%2?px*2:-px),B-(k+1)*px,px,px);
    }
  });

  g.fillStyle='#ff8a3d';
  [[1,0],[0,1],[1,1],[2,1],[1,2]].forEach(a=>
    g.fillRect(480+a[0]*4,B-12+a[1]*4,4,4)
  );
}

const SP=["   xx   ","   xx   ","  xxxx  ","  xoxx  "," xxxxxx ","xxxxoxxx"];
const ICE=["    x    ","   xxx   ","  xxoxx  "," xxxxxxx ","xxxxoxxxx"];

function weeds(xs,hm,now,B){
  xs.forEach((x,i)=>{
    const h=hm+(i%4)*3,px=4;
    for(let k=0;k<h;k++){
      const xx=x+Math.round(Math.sin(now*1.4+i*1.7+k*.5)*k*.25)*px;
      g.fillStyle=k%2?'#2f9e57':'#237a43';
      g.fillRect(xx,B-(k+1)*px,px*2,px);
      if(k%3===1)g.fillRect(xx+(i%2?px*2:-px),B-(k+1)*px,px,px);
    }
  });
}

function drawDeco(){
  const k=S.tank||0;
  if(k===0)return drawDeco0();
  if(k>3)return drawDeco2(k);

  const now=performance.now()/1000,B=H-26;

  if(k===1){
    weeds([40,80,120,160,230,290,350,410,470,540,600,660,720,765],9,now,B);
    spr(RK,200,B-16,4,'#7d8794','#5d6672');
    spr(RK,560,B-16,4,'#7d8794','#5d6672');
  }else if(k===2){
    [
      [30,6,'#5b4b8a','#3d3166'],[200,6,'#6a58a0','#46397a'],
      [420,6,'#5b4b8a','#3d3166'],[640,6,'#6a58a0','#46397a'],
      [120,4,'#4a3c78','#33295a'],[330,4,'#4a3c78','#33295a'],
      [560,4,'#4a3c78','#33295a'],[730,4,'#4a3c78','#33295a']
    ].forEach(a=>spr(SP,a[0],B-6*a[1],a[1],a[2],a[3]));

    for(let i=0;i<9;i++){
      g.globalAlpha=.25+.75*Math.abs(Math.sin(now*1.2+i));
      g.fillStyle='#7ff';
      g.fillRect((i*101+40)%W,SY+60+((i*67)%250),4,4);
    }
    g.globalAlpha=1;
  }else{
    [[50,5],[220,7],[400,5],[560,7],[700,5],[130,4],[320,4],[640,4]]
      .forEach((a,i)=>spr(
        ICE,a[0],B-5*a[1],a[1],
        i%2?'#bfeaff':'#eafaff','#7fc4e8'
      ));

    g.fillStyle='#fff';
    g.globalAlpha=.5;
    for(let i=0;i<10;i++){
      g.fillRect(
        Math.round(((i*83+now*6)%W)/4)*4,
        SY+30+(((i*61+now*8)%300)|0),4,4
      );
    }
    g.globalAlpha=1;
  }

  g.fillStyle='#ff8a3d';
  [[1,0],[0,1],[1,1],[2,1],[1,2]].forEach(a=>
    g.fillRect(480+a[0]*4,B-12+a[1]*4,4,4)
  );
}

function drawDeco2(k){
  const now=performance.now()/1000,B=H-26;

  if(k===4){
    [[20,6],[250,5],[470,6],[690,5]].forEach(a=>
      spr(RK,a[0],B-4*a[1],a[1],'#3d2b2b','#251a1a')
    );

    [[120,5],[360,6],[590,5]].forEach(a=>
      spr(SP,a[0],B-6*a[1],a[1],'#7a2a1a','#4d1810')
    );

    g.fillStyle='rgba(255,90,20,.28)';
    g.fillRect(0,B-8,W,8);

    g.fillStyle='#ff9a2a';
    for(let i=0;i<14;i++){
      g.globalAlpha=.4+.6*Math.abs(Math.sin(now*2+i));
      g.fillRect((i*59+30)%W,H-34-(((now*35+i*47)%320)|0),4,4);
    }
    g.globalAlpha=1;
  }else if(k===5){
    const P=[
      ['#ff9ecb','#e0689f'],['#8ff0d0','#4fc0a0'],
      ['#ffe27a','#d9b53a'],['#b9a2ff','#8068d8']
    ];

    [40,160,300,420,560,690].forEach((x,i)=>{
      i%2
        ?spr(CO2,x,B-25,5,P[i%4][0],P[i%4][1])
        :spr(CO1,x,B-35,5,P[i%4][0],P[i%4][1]);
    });

    g.globalAlpha=.7;
    for(let i=0;i<16;i++){
      g.fillStyle=P[i%4][0];
      g.fillRect(
        Math.round(((i*71+now*7*(1+i%3))%W)/4)*4,
        SY+25+(((i*43+now*5)%320)|0),4,4
      );
    }
    g.globalAlpha=1;
  }else{
    g.fillStyle='#fff';
    for(let i=0;i<40;i++){
      const z=i%5?2:4;
      g.globalAlpha=.2+.8*Math.abs(Math.sin(now*1.5+i*1.3));
      g.fillRect((i*127)%W,SY+10+((i*89)%330),z,z);
    }
    g.globalAlpha=1;

    spr(RK,60,B-20,5,'#59598a','#3a3a66');
    spr(RK,640,B-20,5,'#59598a','#3a3a66');

    [['#6ff',200],['#f9f',420],['#9f9',600]].forEach((a,i)=>{
      const x=a[1]+Math.sin(now*.5+i)*40;
      const y=SY+90+i*70+Math.sin(now*.8+i*2)*20;
      g.fillStyle=a[0];
      g.globalAlpha=.25;
      g.fillRect(x-8,y-8,16,16);
      g.globalAlpha=.8;
      g.fillRect(x-4,y-4,8,8);
      g.globalAlpha=1;
    });
  }
}