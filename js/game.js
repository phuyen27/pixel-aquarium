const cv=document.getElementById('c');
const g=cv.getContext('2d');
const W=800,H=440;

let S,food=[],floats=[],pend=0,pt=0,paused=false;

function fresh(){
  return{coins:60,dirt:0,own:[0],tank:0,fish:[mk(0)]};
}

function mk(t){
  return{
    t,s:1,h:20,
    x:100+Math.random()*600,
    y:80+Math.random()*250,
    vx:(Math.random()<.5?-1:1)*40,
    vy:0,tm:0
  };
}

try{
  S=JSON.parse(localStorage.getItem('nuoica')||'null');
}catch(e){}

if(!S||!S.fish)S=fresh();
S.own=S.own||[0];
S.tank=S.tank||0;

const MS={x:0,y:0,t:0,on:false};

function mpos(e){
  const r=cv.getBoundingClientRect();
  MS.x=(e.clientX-r.left)*W/r.width;
  MS.y=Math.max(SY+30,(e.clientY-r.top)*H/r.height);
  MS.t=performance.now();
  MS.on=true;
}

cv.addEventListener('pointermove',mpos);
cv.addEventListener('pointerleave',()=>{MS.on=false});

cv.addEventListener('pointerdown',e=>{
  if(paused)return;
  const r=cv.getBoundingClientRect();
  const x=(e.clientX-r.left)*W/r.width;
  for(let i=0;i<3;i++){
    food.push({x:x+(i-1)*12,y:10+i*6});
  }
});

let last=performance.now(),acc=0;

function step(dt){
  food.forEach(f=>{
    f.y=Math.min(f.y+30*dt,H-24);
    f.x+=Math.sin(performance.now()/400+f.y*.1)*6*dt;
    if(f.y>=H-24)f.b=(f.b||0)+dt;
  });
  food=food.filter(f=>!(f.b>2));

  S.dirt=Math.min(100,S.dirt+dt*0.3*S.fish.length/3);

  for(const f of S.fish){
    const sz=14*f.s;
    f.h=T[f.t].k==='oyster'?5:f.h+dt*(1+S.dirt/60);

    let tgt=null,bd=1e9;

    if(f.h>30){
      for(const o of food){
        if(o.y<SY)continue;
        const d=Math.hypot(o.x-f.x,o.y-f.y);
        if(d<bd){bd=d;tgt=o}
      }
    }

    if(tgt){
      const dx=tgt.x-f.x,dy=tgt.y-f.y,d=Math.hypot(dx,dy)||1;
      f.vx+=dx/d*280*dt;
      f.vy+=dy/d*280*dt;

      if(d<Math.max(sz,T[f.t].k==='oyster'?44:18)){
        food.splice(food.indexOf(tgt),1);
        f.h=Math.max(0,f.h-35);
        f.s=Math.min(2.5,f.s+0.07);
        S.dirt=Math.min(100,S.dirt+1.5);
      }
    }else{
      f.tm-=dt;
      if(f.tm<=0){
        f.tm=1+Math.random()*3;
        f.vx+=(Math.random()-.5)*90;
        f.vy+=(Math.random()-.5)*50;
        f.fol=Math.random()<.65;
      }

      if(f.fol&&MS.on&&performance.now()-MS.t<3000){
        const dx=MS.x-f.x,dy=MS.y-f.y,dd=Math.hypot(dx,dy)||1;
        if(dd>45){
          f.vx+=dx/dd*120*dt;
          f.vy+=dy/dd*120*dt;
        }else{
          f.vx*=.97;
          f.vy*=.97;
        }
      }
    }

    const sp=Math.hypot(f.vx,f.vy);
    const mx=(['sea','jelly','turtle'].includes(T[f.t].k))
      ?(tgt?85:24)
      :T[f.t].k==='floor'
        ?(tgt?70:20)
        :tgt?160:(f.fol&&MS.on?85:55);

    if(sp>mx){
      f.vx*=mx/sp;
      f.vy*=mx/sp;
    }

    f.x+=f.vx*dt;
    f.y+=f.vy*dt;

    if(f.x<30){f.x=30;f.vx=Math.abs(f.vx)}
    if(f.x>W-30){f.x=W-30;f.vx=-Math.abs(f.vx)}
    if(f.y<SY+28){f.y=SY+28;f.vy=Math.abs(f.vy)}
    if(f.y>H-50){f.y=H-50;f.vy=-Math.abs(f.vy)}

    if(T[f.t].k==='oyster'){
      f.ox=f.ox||f.x;
      f.x=f.ox;
      f.y=H-34;
      f.vx=f.vy=0;
    }

    if(T[f.t].k==='floor'){
      f.y=H-36;
      f.vy=0;
    }

    if(f.h<70){
      f.inc=(f.inc||0)+T[f.t].v*f.s*dt*0.06;
      if(f.inc>=1){
        const n=Math.floor(f.inc);
        f.inc-=n;
        S.coins+=n;
        pend+=n;
      }
    }
  }

  const before=S.fish.length;
  S.fish=S.fish.filter(f=>f.h<100);

  if(S.fish.length<before){
    say('Có cá bị đói mà đi mất 😢 Nhớ cho ăn nhé!');
  }

  if(!S.fish.length&&S.coins<T[0].p){
    S.fish.push(mk(0));
    say('Tặng bạn một chú cá vàng mới 🐟');
  }

  pt+=dt;
  if(pt>3){
    pt=0;
    if(pend>0){
      floats.push({x:W-70,y:44,t:1.6,n:pend});
      pend=0;
    }
  }

  floats.forEach(a=>{
    a.y-=25*dt;
    a.t-=dt;
  });
  floats=floats.filter(a=>a.t>0);
}

function draw(){
  const d=S.dirt/100;
  drawScene(d);
  drawDeco();

  food.forEach(f=>{
    g.globalAlpha=f.b>1.4?Math.max(0,(2-f.b)/.6):1;
    const x=Math.round(f.x/3)*3,y=Math.round(f.y/3)*3;
    g.fillStyle='#8c4a1c';
    g.fillRect(x,y,6,6);
    g.fillStyle='#f2a33c';
    g.fillRect(x,y,3,3);
    g.fillStyle='#d9742a';
    g.fillRect(x+3,y+3,3,3);
    g.globalAlpha=1;
  });

  for(const f of S.fish){
    const t=T[f.t],s=14*f.s*(t.H&&t.H>1.5?1.15:1);
    drawFish3(f,t,s);

    const hp=Math.min(1,f.h/100);
    g.fillStyle='rgba(0,0,0,.35)';
    g.fillRect(f.x-16,f.y-s-12,32,4);

    g.fillStyle=hp>.7?'#e63946':hp>.4?'#ffb703':'#52c41a';
    g.fillRect(f.x-16,f.y-s-12,32*(1-hp),4);
  }

  g.fillStyle=`rgba(5,15,50,${.32*(1-DY)})`;
  g.fillRect(0,SY,W,H-SY);

  g.font='24px "VT323",monospace';
  g.fillStyle='#fff3a0';
  g.textAlign='center';

  floats.forEach(a=>{
    g.globalAlpha=Math.max(0,a.t);
    g.fillText('+'+a.n+' 🪙',a.x,a.y);
    g.globalAlpha=1;
  });

  g.textAlign='left';
  g.font='20px "VT323",monospace';
  g.fillStyle='#fff';
  g.fillText(
    'Độ bẩn: '+Math.round(S.dirt)+'%   ·   Cá: '+S.fish.length+'/'+cap(),
    10,20
  );

  document.getElementById('coins').textContent='🪙 '+Math.floor(S.coins);

  T.forEach((t,i)=>{
    const el=document.getElementById('b'+i);
    if(el)el.disabled=S.coins<t.p||S.fish.length>=cap();
  });
}

function loop(n){
  const dt=Math.min(.1,(n-last)/1000);
  last=n;

  if(!paused)step(dt);
  draw();

  if(paused){
    g.fillStyle='rgba(0,0,0,.45)';
    g.fillRect(0,0,W,H);
    g.fillStyle='#fff';
    g.font='56px "VT323",monospace';
    g.textAlign='center';
    g.fillText('⏸ TẠM DỪNG',W/2,H/2);
    g.textAlign='left';
  }

  acc+=dt;
  if(acc>5){
    acc=0;
    save();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);