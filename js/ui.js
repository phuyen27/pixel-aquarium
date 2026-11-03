function say(t){
  const box=document.getElementById('toasts');
  if(!box)return;

  const bad=/😢|Chưa đủ|đầy/.test(t);

  for(const e of box.children){
    if(e.textContent===t&&!e.classList.contains('out'))return;
  }

  while(box.children.length>=3)box.firstChild.remove();

  const e=document.createElement('div');
  e.className='toast '+(bad?'bad':'good');
  e.textContent=t;
  box.appendChild(e);

  setTimeout(()=>e.classList.add('out'),2400);
  setTimeout(()=>e.remove(),2750);
}

const shop=document.getElementById('shop');

setTimeout(()=>{
  T.map((t,i)=>[t,i])
    .sort((a,b)=>a[0].p-b[0].p)
    .forEach(([t,i])=>{
      const b=document.createElement('button');
      b.id='b'+i;
      b.title=t.n;
      b.appendChild(portrait(i));

      const pr=document.createElement('span');
      pr.textContent='🪙 '+t.p;
      b.appendChild(pr);

      b.onclick=()=>{
        if(S.coins>=t.p&&S.fish.length<cap()){
          S.coins-=t.p;
          S.fish.push(mk(i));
          say('Đã thêm '+t.n+'!');
        }else{
          say(
            S.fish.length>=cap()
              ?'Bể đầy rồi! Mua bể mới để thêm chỗ.'
              :'Chưa đủ xu.'
          );
        }
      };

      shop.appendChild(b);
    });
},0);

document.getElementById('clean').onclick=()=>{
  S.dirt=0;
  say('Bể sạch bong ✨');
};

const pb=document.getElementById('pause');

pb.onclick=()=>{
  paused=!paused;
  pb.textContent=paused?'▶ Tiếp tục':'⏸ Tạm dừng';
};

let rt=0;
const rb=document.getElementById('reset');

rb.onclick=()=>{
  if(performance.now()-rt<3000){
    S=fresh();
    food=[];
    rt=0;
    rb.textContent='↺ Chơi lại';
    renderTanks();
    say('Bắt đầu lại từ đầu!');
  }else{
    rt=performance.now();
    rb.textContent='Bấm lại để xác nhận';
    setTimeout(()=>{rb.textContent='↺ Chơi lại'},3000);
  }
};

function cap(){
  return 16+4*S.own.length;
}

function renderTanks(){
  const box=document.getElementById('tanks');
  if(!box)return;
  box.innerHTML='';

  TK.forEach((k,i)=>{
    const own=S.own.includes(i);
    const b=document.createElement('button');
    const sw=document.createElement('div');
    const n=document.createElement('span');
    const st=document.createElement('span');

    sw.className='sw';
    sw.style.background='linear-gradient(rgb('+k.t+'),rgb('+k.t2+'))';
    n.textContent=k.n;

    st.textContent=own
      ?(S.tank===i?'✔ Đang dùng':'Dùng')
      :'🪙 '+k.p;

    if(S.tank===i)b.classList.add('on');

    b.append(sw,n,st);

    b.onclick=()=>{
      if(own){
        S.tank=i;
        say('Đã đổi sang '+k.n);
        closeTP();
      }else if(S.coins>=k.p){
        S.coins-=k.p;
        S.own.push(i);
        S.tank=i;
        say('Đã mua '+k.n+'! +4 chỗ cho cá');
        closeTP();
      }else{
        say('Chưa đủ xu.');
      }
      renderTanks();
    };

    box.appendChild(b);
  });
}

setTimeout(renderTanks,0);

const tp=document.getElementById('tankpop');
const closeTP=()=>{tp.hidden=true};

document.getElementById('tankbtn').onclick=()=>{
  renderTanks();
  tp.hidden=false;
};

document.getElementById('tclose').onclick=closeTP;

tp.addEventListener('pointerdown',e=>{
  if(e.target===tp)closeTP();
});

let pg=0;

function showPage(){
  const kids=[...shop.children];
  if(!kids.length)return;

  const pp=Math.max(2,Math.floor((shop.clientWidth+8)/96));
  const pages=Math.ceil(kids.length/pp);

  pg=((pg%pages)+pages)%pages;

  kids.forEach((b,i)=>{
    b.style.display=(i>=pg*pp&&i<(pg+1)*pp)?'':'none';
  });

  document.getElementById('pgi').textContent='('+(pg+1)+'/'+pages+')';
}

setTimeout(showPage,0);
addEventListener('resize',showPage);

document.getElementById('prev').onclick=()=>{
  pg--;
  showPage();
};

document.getElementById('next').onclick=()=>{
  pg++;
  showPage();
};