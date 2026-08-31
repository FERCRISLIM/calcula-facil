
const BRL = v => (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const num = id => Math.max(0,Number(document.getElementById(id)?.value)||0);

function calcCompound(){
  const inicial=num('inicial'), aporte=num('aporte'), taxa=num('taxa')/100;
  const tipoTaxa=document.getElementById('tipoTaxa').value;
  const tempo=num('tempo'), tipoTempo=document.getElementById('tipoTempo').value;
  const meses=Math.round(tipoTempo==='anos'?tempo*12:tempo);
  const r=tipoTaxa==='ano' ? Math.pow(1+taxa,1/12)-1 : taxa;
  let patrimonio=inicial, investido=inicial, jurosAcum=0;
  const rows=[], labels=['Inicial'], values=[patrimonio];
  for(let m=1;m<=meses;m++){
    const juros=patrimonio*r;
    patrimonio+=juros+aporte; investido+=aporte; jurosAcum+=juros;
    rows.push([m,aporte,juros,jurosAcum,investido,patrimonio]);
    labels.push('Mês '+m); values.push(patrimonio);
  }
  document.getElementById('final').textContent=BRL(patrimonio);
  document.getElementById('bolso').textContent=BRL(investido);
  document.getElementById('juros').textContent=BRL(patrimonio-investido);
  document.getElementById('tbody').innerHTML=rows.map(r=>`<tr><td>${r[0]}</td><td>${BRL(r[1])}</td><td>${BRL(r[2])}</td><td>${BRL(r[3])}</td><td>${BRL(r[4])}</td><td><b>${BRL(r[5])}</b></td></tr>`).join('');
  drawChart(labels,values,'Patrimônio');
}

function calcSimple(){
  const capital=num('capital'), taxa=num('taxa')/100, tempo=num('tempo');
  const total=capital*(1+taxa*tempo), juros=total-capital;
  document.getElementById('montante').textContent=BRL(total);
  document.getElementById('jurosSimples').textContent=BRL(juros);
}

function calcFin(){
  const pv=num('valor'), entrada=num('entrada'), taxa=num('taxa')/100, n=Math.round(num('parcelas'));
  const principal=Math.max(0,pv-entrada);
  let parcela=0,total=entrada;
  if(taxa===0) parcela=principal/n;
  else parcela=principal*(taxa*Math.pow(1+taxa,n))/(Math.pow(1+taxa,n)-1);
  total+=parcela*n;
  document.getElementById('parcela').textContent=BRL(parcela);
  document.getElementById('totalFin').textContent=BRL(total);
  document.getElementById('jurosFin').textContent=BRL(total-pv);
}

function calcMeta(){
  const meta=num('meta'), inicial=num('inicial'), taxa=num('taxa')/100, meses=Math.round(num('meses'));
  let aporte=0;
  if(meses>0){
    if(taxa===0) aporte=Math.max(0,(meta-inicial)/meses);
    else aporte=Math.max(0,(meta-inicial*Math.pow(1+taxa,meses))*taxa/(Math.pow(1+taxa,meses)-1));
  }
  document.getElementById('aporteNec').textContent=BRL(aporte);
}

let chart;
function drawChart(labels,data,label){
  const canvas=document.getElementById('chart');
  if(!canvas || typeof Chart==='undefined') return;
  if(chart) chart.destroy();
  chart=new Chart(canvas,{type:'line',data:{labels,datasets:[{label,data,borderWidth:2,tension:.25,fill:false}]},
    options:{responsive:true,maintainAspectRatio:false,scales:{y:{ticks:{callback:v=>BRL(v)}}}}});
}
