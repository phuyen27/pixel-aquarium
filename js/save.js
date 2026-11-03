function save(){
  try{
    localStorage.setItem('nuoica',JSON.stringify(S));
  }catch(e){}
}

function chk(s){
  let a=0;
  for(let i=0;i<s.length;i++){
    a=(a*31+s.charCodeAt(i))%65536;
  }
  return a.toString(16).padStart(4,'0');
}

function clean(t){
  return t.split(/[^A-Za-z0-9+/=-]/).join('');
}

function makeCode(){
  const o={
    c:Math.floor(S.coins),
    d:Math.round(S.dirt),
    o:S.own,
    k:S.tank,
    f:S.fish.map(f=>[
      f.t,
      +f.s.toFixed(2),
      Math.round(f.h)
    ])
  };

  const b=btoa(JSON.stringify(o));
  return 'CA1-'+chk(b)+'-'+b;
}

function readCode(txt){
  const m=/^CA1-([0-9a-f]{4})-([A-Za-z0-9+/=]+)$/.exec(clean(txt));

  if(!m||chk(m[2])!==m[1])return null;

  try{
    const o=JSON.parse(atob(m[2]));

    if(!Number.isFinite(o.c)||!Array.isArray(o.o)||!Array.isArray(o.f)){
      return null;
    }

    const own=[
      ...new Set(o.o.filter(i=>
        Number.isInteger(i)&&i>=0&&i<TK.length
      ))
    ];

    if(!own.includes(0))own.unshift(0);

    const k=own.includes(o.k)?o.k:0;
    const max=16+4*own.length;

    const fish=o.f
      .filter(a=>
        Array.isArray(a)&&
        Number.isInteger(a[0])&&
        a[0]>=0&&
        a[0]<T.length
      )
      .slice(0,max)
      .map(a=>{
        const f=mk(a[0]);
        f.s=Math.min(2.5,Math.max(1,+a[1]||1));
        f.h=Math.min(95,Math.max(0,+a[2]||0));
        return f;
      });

    return{
      coins:Math.max(0,o.c),
      dirt:Math.min(100,Math.max(0,+o.d||0)),
      own,
      tank:k,
      fish
    };
  }catch(e){
    return null;
  }
}

const spp=document.getElementById('savepop');
const sc=document.getElementById('scode');
const sb=document.createElement('button');

sb.className='ib';
sb.dataset.tip='Sao lưu';
sb.textContent='💾';

document.getElementById('nav').appendChild(sb);

sb.onclick=()=>{
  sc.value=makeCode();
  spp.hidden=false;
};

document.getElementById('sclose').onclick=()=>{
  spp.hidden=true;
};

spp.addEventListener('pointerdown',e=>{
  if(e.target===spp)spp.hidden=true;
});

document.getElementById('scopy').onclick=()=>{
  sc.value=makeCode();
  sc.select();

  const done=()=>say('Đã sao chép mã!');

  const fb=()=>{
    let ok=false;
    try{
      ok=document.execCommand('copy');
    }catch(e){}
    ok
      ?done()
      :say('Hãy bôi đen và sao chép mã thủ công');
  };

  navigator.clipboard
    ?navigator.clipboard.writeText(sc.value).then(done,fb)
    :fb();
};

let lt=0;
const lb=document.getElementById('sload');

lb.onclick=()=>{
  const r=readCode(sc.value);

  if(!r){
    say('Mã không hợp lệ 😢');
    return;
  }

  if(clean(sc.value)!==makeCode()&&performance.now()-lt>3000){
    lt=performance.now();
    lb.textContent='Bấm lại để ghi đè';
    setTimeout(()=>{
      lb.textContent='⬇ Khôi phục từ mã';
    },3000);
    return;
  }

  S=r;
  food=[];
  renderTanks();
  spp.hidden=true;
  lb.textContent='⬇ Khôi phục từ mã';
  say('Đã khôi phục dữ liệu!');
  save();
};