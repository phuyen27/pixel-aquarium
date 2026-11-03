const SR=["      ooo       ","    oodddoo     ","ut  obxbbxbbo   ","uttoblbxbbbbbo  ","ttttblbbxbbbepbo","uttoblbbxbbbbbbo","ut  olllbxbbbbo ","    ooldlllloo  ","      oodoo     "];
const SS=["        dd      ","    ooooddoooo  ","ut obbxbbxbbbbo ","ttobbbxbbxbbbepo","ut oblllxllllllo","    ooolllddoo  ","       oooo     "];
const ST=["      d         ","     odd        ","    oddo        ","   ooxbbo       ","t  obxbbbbo     ","tt obbxbbbbbo   ","ttt obxbbbbbepo ","tt obbxbbbbbo   ","t  oblxbbbbo    ","    ooblbbo     ","     ooddoo     ","       dd       "];
const SH=["        ooo     ","       obbbo    ","      obbepbbbo ","      obbbbboo  ","      oblbbo    ","     dobllbo    ","    ddobllbo    ","     dobxlbo    ","      obxbo     ","      obbbo     ","     oobbo      ","    oboo        "];
const SJ=["     oooooo     ","   ooblllllboo  ","  obblbbbbbblbo ","  obbbxbbxbbbbo ","  oblbepbbepblo ","   oooooooooo   ","    d  d  d  d  ","     d  d  d  d ","    d  d  d  d  ","     d  d  d  d ","    d  d  d  d  "];
const SO=["    oooooooo    ","  ooxbxbbxbxboo "," oxbxbxbbxbxbxbo","oooooooooooooooo","obllllleellllllo"," obllllleelllbo ","  oobbbbbbbboo  ","    oooooooo    "];
const STU=["     ooooo      ","   ooxbbxboo    ","  oxbxbbxbxboo  "," obxbbxbbxbbolll"," oxbbxbbxbbxolpl","  ooddoooooddo  ","   dd      dd   "];
const SCR=["  ooo      ooo  "," oxxxo    oxxxo ","  oo ooooooo oo ","    obbepbbepbo ","   obbbbbbbbbo  ","  dd obbbbbo dd "," dd  d  d  dd   "];
const SOC=[...SJ.slice(0,5),"   oooooooooo   ","  oddoddoddodd  "," dd  dd  dd  dd "," d   dd  dd   d ","dd    d  d    dd"," d    dd dd    d"];
const SMA=["       oo       ","     ooxxoo     ","   oobbbbbboo   ","  obbbbxxbbbbo  ","utbbbblllbbbepoo","  obblllllllbo  ","    ooooooooo   "];
const SSF=["       oo       ","      oxxo      ","  ooooxxxxoooo  ","   oxxxxxxxxo   ","    oxxbbxxo    ","   oxxo  oxxo   ","  oxo      oxo  "];
const R2=["       ddd      ","     oodddoo    ","   ooosssshsso  ","tuoossbbbbbbhbbo","tttobbbbbbbbbepo","tttobbxbbddbbbbo","tttolllbbxblllbo","tuoollllllllllo ","    dd ooooo    ","    ddd         "];
const S2=["      dd        ","    oodddoo     ","  tuosssssshso  ","ttuobbbbxbbbbepo","tttobbxbbxbbbbbo","ttuolllllllllllo","  tuooollllloo  ","     dd ooddo   "];
const T2=["       dd       ","      oddo      ","     oddddo     ","   ooddxbbo     ","   odbbxbbbo    ","t oobbxbbbbbo   ","tuobbxbbbbbepo  ","tuobbxbbbbbbbo  ","t oollllllllo   ","   oddllllo     ","    oddddo      ","     dddd       "];
const EEL=["     oddddddddo ","tuoobbbbbbbbbepo","tuoollllllllllo ","      oooooo    "];
const ANG=["            ee  ","           d    ","     oooddoooo  ","   ooosssssso   ","tuooobbbbbbbbbo ","tuoobbbbbbepbbo ","tuoobbeebeebbbo ","  oooollllllooo ","    ooooooooo   "];
const DOL=["        dd      ","      ooddoo    ","   oosssssssso  ","tuoobbbbbbbbbepo","tuoollllllllllbo","  tuoooolllooo  ","    dd   oo     "];
const SHR=["      oooo      ","    oobbbboo    ","  uuobbbbbbboo  ","ttt oblllbbepbo ","tt   oolllbboo  ","     d dd d d   ","    d  d  d d   "];

const mapS=(rows,f)=>rows.map((r,ri)=>[...r].map((ch,c)=>f(ch,ri,c)).join(''));
const noX=rows=>mapS(rows,ch=>ch==='x'?'b':ch);
const stripes=(rows,cs)=>mapS(rows,(ch,r,c)=>cs.includes(c)&&'bls'.includes(ch)?'x':ch);
const dots=rows=>mapS(rows,(ch,r,c)=>(ch==='b'||ch==='s')&&(r*7+c*3)%11===0?'x':ch);
const band=(rows,rr)=>mapS(rows,(ch,r,c)=>r===rr&&(ch==='b'||ch==='l')?'x':ch);

const B2=noX(R2),Sl=noX(S2),Tl=noX(T2);

const SPR=[
  B2,stripes(B2,[6,7,11]),dots(Sl),band(Sl,4),B2,
  stripes(Tl,[7,9]),dots(Sl),Sl,B2,dots(Sl),dots(B2),
  stripes(Tl,[8]),Sl,SH,SJ,SO,stripes(Sl,[6,10]),dots(B2),
  STU,SCR,SOC,SMA,SSF,EEL,ANG,DOL,SHR,stripes(Tl,[8,10])
];

const PAL={};

function hx(h){
  h=h.replace('#','');
  return[0,2,4].map(i=>parseInt(h.substr(i,2),16));
}

function mkpal(t){
  const c=hx(t.c),c2=hx(t.c2),dk=rgb(mixc(c2,[0,0,0],.55));
  return{
    o:dk,u:dk,b:rgb(c),l:rgb(mixc(c,[255,255,255],.5)),
    s:rgb(mixc(c,[0,0,0],.28)),h:rgb(mixc(c,[255,255,255],.65)),
    d:rgb(c2),t:rgb(c2),x:t.pc||rgb(c2),e:'#fff',p:'#111'
  };
}

function drawFish3(f,t,s){
  const sp=SPR[f.t],px=Math.round(f.s*1.4+1),dir=f.vx>=0?1:-1,w=16,h=sp.length;
  f.ph=f.ph||Math.random()*9;
  const fr=Math.floor(performance.now()/220+f.ph)%2;
  const pal=PAL[f.t]||(PAL[f.t]=mkpal(t));

  g.save();
  g.translate(Math.round(f.x),Math.round(f.y));
  g.scale(dir,1);

  for(let r=0;r<h;r++)for(let c=0;c<w;c++){
    const ch=sp[r][c];
    if(ch===' ')continue;
    const dy=(ch==='t'||ch==='u')&&c<3?(fr?1:-1):0;
    g.fillStyle=pal[ch];
    g.fillRect(
      Math.round((c-w/2)*px),
      Math.round((r-h/2+dy)*px),
      px,px
    );
  }
  g.restore();
}

function portrait(i){
  const sp=SPR[i],pal=PAL[i]||(PAL[i]=mkpal(T[i]));
  const px=3,cv2=document.createElement('canvas');
  cv2.width=16*px;
  cv2.height=12*px;
  const x=cv2.getContext('2d'),o=Math.floor((12-sp.length)/2);

  for(let r=0;r<sp.length;r++)for(let c=0;c<16;c++){
    const ch=sp[r][c];
    if(ch===' ')continue;
    x.fillStyle=pal[ch];
    x.fillRect(c*px,(r+o)*px,px,px);
  }
  return cv2;
}