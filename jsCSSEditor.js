/*
Copyright (c) 2005 / 2011 Signey John

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
	jsCSSEditor 3.0 - julho/2005
	by Signey John
*/

var copId = '@copId@';
var copTo = '@copTo@';
var versao = '3.0';
var site='http://3wsistemas.com.br/jsCSSEditor/';

//*********************************
// Signey mar/2010
//*********************************
/*
	- aceitar e manter comentários- inutil?
	- plugin wordpress
	- alerta @media e não permite gravar
*/

//*********************************
// Signey jun/2004
//*********************************
/* ALTERAÇÕES
	15/07 - background-color e +
	16/07 - campos ajuda pequenos + contator defs
	20/07 - tag com mais de uma classe class="a b c"
	29/07 - ! important 
	01/08 - php sem globais
	28/08 - carrega prop das folhas
	15/09 - add prop opacity Mozilla & IE + sort;
	26/09 - sem sort ao salvar;
	28/09 - jan prop: not resize/move after add prop/class;
		- always allows to add pseudo/sub class;
		- allows to add property not listed
		- allow ID as selector
	30/09 - Edit stylesheet
		- window dependents
	07/10 - revisão grava
	15/10 - carregar folha com estilos duplicados - p/gravar: nome+posicao
	29/10 - a,b,c {} -> deixar no original, na procura mostrar
		- import
	13/11 - import
	17/11 - import c/WYSIWYG
				- cookie folhas selecionadas para edição
				- nav Objeto/folha
	FALTA:
		- opção procura de nova verssão
		- alternativas ao php
		- .asp (javascript)
		- servlet
	PAGINA:
		- cadastro no site
		- tabela comparativa 2.0 3.0
		- screenshots 
		- cadastro
		- licença gnu nos arquivos
		- termo de sigilo
	2009 - aceita tags css	
	2011 - comentarios
		- border radius
*/

var gravador = (top.opener && top.opener.gravador?top.opener.gravador:'/jsCSSEditor/jsCSSEditor.php');
var jsCSSEditorD = new Array();
var corO,corNM,cli=new Array();

//*********************************
// objeto ESTILO
//*********************************
function estilo(nome,tx) {
	this.nome = nome;
	this.ch = nome;
	this.v = Array();
	this.i = Array();
	this.tex = tex;
	this.put = put;
	this.get = get;
	this.volta = volta;
	this.pos = -1;
	this.alterado = alterado;
	this.temVolta = temVolta;
	this.voltaEstilo = voltaEstilo;
	this.merge = merge;
	
	this.merge(tx);

	//*********************************
	function merge(tx) {
		tx = trimm(tx,' ;');
		if (tx!='') {
			vt = palavraA(tx,';');
			for (var i=0;i<vt.length;i++) {
				vt[i] = trimm(vt[i]);
				if (false && vt[i].substring(0,5)=='-moz-') {
				} else if (vt[i].substring(0,5)=='{pos:') {
					//this[vt[i].substring(1)] = trimm(substrAt(vt[i],':'));
					this.pos = 1*trimm(substrAt(vt[i],':'));
				} else if (vt[i].indexOf(':')!=-1) {
					var pr = trimm(leftAt(vt[i],':')).toLowerCase();
					this.put(pr,trimm(substrAt(vt[i],':')));
				} else {
					this.put(vt[i],'');
				}
			}
		}
	}
	//*********************************
	function voltaEstilo(nPr) {
		if (this.alterado(nPr)) {
			return 'volta voltaS'
		} else if (this.temVolta(nPr)) {
			return 'volta voltaN';
		}
		return 'volta';
	}
	//*********************************
	function volta(nPr,o) {
		if (!this.temVolta(nPr)) {
			return false;
		}
		var i = this.i[nPr];
		var v = this.v[i];
		//v[1] = v[2][v[3]];
		o.value = v[2][v[3]];
		v[3]--;
		if (v[3]<0) {
			v[3] = v[2].length-1;
		}
		return true;
	}
	//*********************************
	function norm(v) {
		var n;
		v = trocaTudo(trocaTudo(trimm(v),', ',','),'  ',' ');
		var vt = palavraA(v,' '),r='';
		for (var i=0;i<vt.length;i++) {
			if (vt[i].length>4 && vt[i].substring(0,4)=='rgb(') {
				vt[i] = corToHex(vt[i]);
			}
			r += ' '+vt[i];
		}
		return (r==''?r:r.substring(1));
	}
	//*********************************
	function put(ch,v) {
		var i = this.i[ch];
		v = norm(v);
		if (typeof(i)=='undefined') {
			i = this.v.length;
			this.i[ch] = i;
			this.v[i] = Array(ch,v,Array(''+v),0);
		} else {
			//unddo...
			try {
				var vv = this.v[i][2],a=0;
			} catch (e) {
				alert('put attr? ch='+ch+' i='+i);
			}
			for (var x=0;x<vv.length;x++){
				if (v==vv[x]) {
					a = 1;
					break;
				}
			}
			if (a==0) {
				vv[vv.length] = v;
				this.v[i][3] = vv.length-2;
			}
			this.v[i] = Array(ch,v,vv,this.v[i][3]);
		}
	}
	//*********************************
	function temVolta(ch) {
		var i = this.i[ch];
		if (typeof(i)=='undefined') {
			return false;
		}
		return this.v[i][2].length>1;
	}
	//*********************************
	function alterado(ch) {
		var i = this.i[ch];
		if (typeof(i)=='undefined') {
			return false;
		}
		return this.v[i][1]!=this.v[i][2][0];
	}
	//*********************************
	function get(ch) {
		var i = this.i[ch];
		if (typeof(i)=='undefined') {
			return null;
		}
		return this.v[i][1];
	}
	//*********************************
	function tex() {
		var r = '';
		for (var i=0;i<this.v.length;i++) {
			if (trimm(this.v[i][1])!='') {
				r += this.v[i][0]+': '+this.v[i][1]+';';
			}
		}
		return r;
	}
}
//*********************************
//objeto EDITOR
//*********************************
function jsCSSEditor(t,e) {
	//constroi
		if (typeof(t)!='undefined') {
			janPrin(t,e);
			return;
		}
		top.document.title = 'jsCSSEditor';
		var oEv = top.opener.jsCSSEditorD[0];
		var oSt = top.opener.jsCSSEditorD[1];
		var fl = new Array();
		var fln = new Array();
		var ob = new Array();
		var obCor = new Array();
		var obCorS = false;
		var cor = new Array();
		var fls = janLocObj("vFls");
		this.sel = sel;
		this.edit = edit;
		this.muda = muda;
		this.ajuda = ajuda;
		this.grava = grava;
		this.important = important;
		this.editA = editA;
		this.folha = folha;
		this.editFolha = editFolha;
		this.folhaSel = folhaSel;
		this.addProp = addProp;
		this.prop = prop;
		this.addEst = addEst;
		this.lista = lista;
		this.coresP = coresP;
		this.volta = volta;
		this.refresh = refresh;
		this.navFolha = navFolha;
		this.navObj = navObj;
		this.dscCSS = dscCSS;
		this.novo = novo;
		//menu popup
		var oM; 
		var opsAddEst = palavraA(':link,:visited,:active,:hover,:focus,:lang(),:first-child'
			+',:left,:right,:first,:first-letter,:first-line,:after,:before',',');
		//dscCSS
		var vDSC = new Array();
		
		//lista();
	//fim constroi
	//*********************************
	function dscCSS3(es,f,tg,pth) {
		var v = locSts(f,tg,pth)
		for (var x=0;x<v.length;x++) {
			if (v[x].nome.indexOf(':')==-1 && (v[x].nome.indexOf(' ')==-1 || trimm(substrRat(v[x].nome,' ')).toLowerCase()==tg.toLowerCase()  )) {
				es.merge(v[x].tex());
			} else {
				//lert(v[x].nome);
			}
		}
	}
	//*********************************
	function dscCSS2(ob,pth) {
		var e = trimm(ob.className);
		var r = ob.tagName;
		var ch = pth+' '+r+'.'+e;
		var r = vDSC[ch];
		if (vazio(r)) {
			r = new estilo('eu','');
			var cl = palavraA(ob.className,' ');
			for (var f=0;f<fl.length;f++) {
				if (fln[f][2]) {
					dscCSS3(r,f,ob.tagName,pth);
					if (!vazio(ob.className)) {
						for (var i=0;i<cl.length;i++) {
							dscCSS3(r,f,'.'+cl[i],pth);
							dscCSS3(r,f,ob.tagName+'.'+cl[i],pth);
						}
					}
				}
			}
			vDSC[ch] = r;
		} else {
			//lert('rec '+r);
		}
		var r = r.tex();
		if (!vazio(r)) {
			ob.style.cssText = r;
		}
		if (!vazio(ob.className)) {
			ob.className='';
		}
	}
	//*********************************
	function dscCSS1(ob,pth) {
		var r = ob.tagName;
		if (vazio(r)) {
			return '';
		}
		r = r.toLowerCase();
		var e = trimm(ob.className).toLowerCase();
		dscCSS2(ob,' '+pth+' ');
		if (!vazio(e)) {
			r = pth+' '+r+'.'+troca(e,' ',' '+r+'.');
			//lert(pth+'  r='+r);
		} else {
			r = pth+' '+r;
		}
		for (var i=0;i<ob.childNodes.length;i++) {
			var o = ob.childNodes.item(i);
			dscCSS1(o,r);
		}
		return r;
	}
	//*********************************
	function dscCSS(i) {
		vDSC = new Array();
		dscCSS1(ob[i],'');
		//lert(troca(ob[i].innerHTML,' class=""','')); //parentNode.
		if (confirm('jogar na pagina o codigo html?')) {
			ob[i].innerHTML = html(troca(ob[i].innerHTML,' class=""',''));
		}
	}
	//*********************************
	function menu(ops,o,onc,win,ev) {
		//	menu(opsAddEst,o,'addEst',win);
		if (ev.ctrlKey) return false;
		if (oM && oM.aberto) {
			oM.fecha();
			return false;
		}
		var r = '',n=0,v=trimm(o.innerHTML);
		var nome = o.getAttribute('name');
		var id = o.id.substring(1);
		if (typeof(ops)=='string') {
			r = ops;
		} else if (v=='...') {
				r = '...<br><input id=input obj=P'+id
					+(vazio(nome)?'':' name='+nome)
					+' onblur=janLocObj("oCSS").'+onc+'(this,window)>'
					+'<input type=button value=...'
					+' onclick=janLocObj("oCSS").'+onc+'(browse.getId("input"),window)>'
				;
		} else {
			ops.sort(function(a,b){return fSort(a.toLowerCase(),b.toLowerCase());});
			n = ops.length;
			for (var ii=0;ii<n;ii++) {
				r += '<p obj=P'+id+' class="addPropO '+(ii%2==1?'addPropOimpar':'')+'"'
					+(vazio(nome)?'':' name='+nome)
					+' onclick=janLocObj("oCSS").'+onc+'(this,window);>'
					+(ops[ii]==''?'&nbsp;':ops[ii])+'</p>';
			}
			//lert(r);
		}
		var dv = browse.getId('addPropDIV',win.document);
		//lert(dv);
		dv.innerHTML = r;
		if (n>20) {
			dv.style.height='270px';
			dv.style.overflow='auto';
		} else {
			try {
				dv.style.height='';
				dv.style.overflow='';
			} catch (e) {
				alert(e.description);
			}
		}
		oM = new menuPopUp('addPropDIV',dv);
		if (v=='...') {
			oM.centrado = true;
		}
		oM.abre(o,0,ev);
		return true;
	}
	//*********************************
	function propAdd(id) {
		var r =  '<table class=addProp>',n=0;
		for (var ii=0;ii<prG.length;ii++) {
			var prop = prG[ii];
			if (prop.substring(0,1)==' ') {
				if (n++%5==0) r += '<tr>';
				r += '<td id=S'+id+' onclick=janLocObj("oCSS").addProp(this,window,event);'
					+' class=atMenu>'+prop+'</td>';
			}
		}
		r += '</table>';
		return r;
	}
	//*********************************
	//atualiza dados da folha
	function novo(fl,posA,posN) {
		//alerta('movendo novo de '+posA+' para '+posN);
		fls[fl][posN] = fls[fl][posA];
		fls[fl][posN].pos = posN;
		fls[fl][posA] = null;
	}
	//*********************************
	//dá refresh n7a janela alvo
	function refresh(alvo) {
		var a = ''+alvo.location;
		if (a.indexOf('&_refresh')==-1) {
			a += '&_refresh=1';
		}
		alvo.location = a;
	}
	//*********************************
	//set important
	function important(o,cmp,win) {
		if (o.form[cmp].value.indexOf('!')==-1) {
			o.form[cmp].value += ' ! important';
		} else {
			o.form[cmp].value = trimm(leftAt(o.form[cmp].value,'!'));
		}
		this.muda(o.form[cmp],win);
	}
	//*********************************
	//sel folha
	function folhaSel(i,op) {
		if (op==0) {
			fl[i].disabled = !fl[i].disabled;
		} else {
			top.nFls[i][2] = !top.nFls[i][2];
			//grava cookie
			var c = '';
			for (var x=0;x<top.nFls.length;x++) {
				c += top.nFls[x][2]?'S':'N';
			}
			//alerta(top.strCookie+'='+c);
			cookiePut(top.strCookie,c);
			//alerta(window.location+' '+document.cookie);
		}
	}
	//*********************************
	//mostra folha
	function folha(f) {
		for (var i=0;i<browse.cssRules(fl[f]).length;i++) {
			document.write('<br>'+browse.cssRules(fl[f])[i].selectorText);
		}
	}
	//*********************************
	//ret propriedade chave fl@estilo
	function prop(ch) {
		var v = palavraA(ch,'@');
		var fls = janLocObj("vFls");
		return fls[v[0]][v[1]];
	}
	//*********************************
	//adiciona sub estilo
	function addEst(o,win,ev) {
		var tg = o.tagName.toLowerCase();
		if (tg=='span') {
			//abre menu
			menu(opsAddEst,o,'addEst',win,ev);
			return;
		}
		
		//adiciona
		var id = o.getAttribute('obj').substring(1);
		//formulário
		//lert(id);
		var fm = browse.getId(id,win.document);
		oM.fecha();

		var v = trimm((tg=='input'?o.value:o.innerHTML));
		if (vazio(v)) {
			return;
		}

		var fo = fm._fl.value;
		var no = fm._st.value;
		no = no+(v.substring(0,1)==':'?'':' ')+v;
		var v = janLocObj("vFls");
		//alerta(fo+' '+no);
		if (v[fo][no]) {
			alert(fo+' @ '+no+' Exists... ');
		} else {
			var es = new estilo(no,'');
			addVirtual(fo,es);
			refresh(win);
		}
	}
	//*********************************
	//adiciona estilo com index negativo
	function addVirtual(fo,es) {
		var p = -2;
		while (fls[fo][p]) p--;
		es.pos = p;
		fls[fo][p] = es;
		return p;
	}
	//*********************************
	//adiciona nova prop ao estilo
	function addProp(o,win,ev) {
		if (ev) {
			var va = trimm(o.innerHTML),r='',n=0;
			var id = o.id.substring(1);
			//monta opcoes
			var oo=new Array();
			for (var ii=0;ii<prG.length;ii++) {
				var prop = prG[ii];
				if (prop.substring(0,1)==' ') {
					ga = trimm(prop);
				} else if (ga==va || va=='ALL') {
					oo[oo.length] = prop;
					n++;
				}
			}
			//abre menu
			menu(oo,o,'addProp',win,ev);
			return;
		}
		
		var tg = o.tagName.toLowerCase();
		var fo,st,stP,fm,pAd;
		if (tg=='select') {
			fm = o.form;
			pAd = o.value;
		} else {
			var id = o.getAttribute('obj').substring(1);
			fm = browse.getId(id,win.document);
			//lert('id='+id+"="+fm);
			pAd = (tg=='p'?o.innerHTML:o.value);
			oM.fecha();
		}
		if (vazio(pAd)) {
			return;
		}
		fo = fm._fl.value;
		st = fm._st.value;
		stP = fm._stP.value;
		
		//caso o estilo não exista cria novo com index negativo -2,-3....
		if (stP==-1) {
			var es = new estilo(st,'');
			addVirtual(fo,es);
			stP = es.pos;
			fm._stP.value = es.pos;
		}
		//lert(fo+' '+stP+'=='+fls[fo][stP].get(pAd));
		if (!vazio(fls[fo][stP].get(pAd))) {
			return;
		}
		fls[fo][stP].put(pAd,'');
		
		//alerta('sit='+o.form._sIt.value);
		win.location = gravador+'?_it='+fm._it.value
			+'&_sIt='+cmpUrl(fm._sIt.value)
			+'&_refresh=1'
		;
	}
	//*********************************
	//abre jan p/target e submit
	function grava(o,ev) {
		if (ev.ctrlKey) {
			return;
		}
		/*var w = new winDep(top,'');
		w.w = 200;w.h = 200;
		w.nome = '_cssGrava';
		w.abre();
		*/
		if (o.form._stP.value==-1) {
			alert('EMPTY ERROR?');
			return;
		}
		o.form.submit();
	}
	//*********************************
	//preenche o input com o select
	function ajuda(o) {
		var tg = o.tagName.toLowerCase();
		if (tg=='select') {
			var n = o.name.substring(1);
			o.form[n].value = o.value;
			this.muda(o.form[n]);
			return;
		}
		this.mAjuda.fecha();
		//lert(o.innerHTML);
		var w = new winDep(top,site+'?op='+o.innerHTML
			+'&copId='+copId+'&versao='+versao
			+'&copIdPhp='+copIdPhp+'&versaoPhp='+versaoPhp
		);
		w.abre();
	}
	//*********************************
	//volta valor original
	function volta(o,win) {
		var no = o.name.substring(7);
		var f = o.form._fl.value;
		var stP = o.form._stP.value;
		var es = fls[f][stP];
		if (es.volta(no,o.form[no])) {
			this.muda(o,win);
		}
	}
	//*********************************
	//altera prop estilo cfrme alt usuário
	function muda(o,win,ev) {
		/*if (vazio(o.tagName)) {
			objNav(o);
			if (!o.ctrlKey && oM && oM.aberto) {
				oM.fecha();
			}
			return;
		}
		*/
		var tg = o.tagName.toLowerCase();
		if (tg=='span') {
			//abre menu
			var name = o.getAttribute('name'),nameP='';
			if (name.substring(0,1)=='_') {
				nameP = substrAtAt(name,'_','_');
				name = substrAt(substrAt(name,'_'),'_');
			}
			var op = pr[name];
			if (typeof(op)=='string') {
				op = pr[op];
			}
			if (op[0][0]=='prg') {
				var vv=palavraA(op[0][1],' ');
				//lert(nameP+' '+vv[nameP]);
				op = pr[vv[nameP]];
			}
			var or = new Array();
			if (!vazio(op[0][1])) {
				//força opcao vazia
				or[or.length] = '';
			}
			for (var i=0;i<op.length;i++) {
				or[or.length] = op[i][1];
			}
			// menu(ops,o,onc,win,ev) {
			menu(or,o,'muda',win,ev);
			return;
		}
		
		//lert(o+' '+tg);
		var fm,v,no;
		if (tg!='p') {
			no = o.name;
			fm = o.form;
			v = o.value;
		} else {
			no = o.getAttribute('name');
			var id = o.getAttribute('obj').substring(1);
			fm = browse.getId(id,win.document);
			//lert('id='+id+"="+fm);
			v = (tg=='p'?o.innerHTML:o.value);
			oM.fecha();
			o = fm[no];
		}
		v = (v=='&nbsp;'?'':v);
		
		if (no.substring(0,1)=='_') {
			//muda sub-campo...
			no = no.substring(1);
			var p = 1*leftAt(no,'_');
			no = substrAt(no,'_');
			o = fm[no];
			o.value = setParN(o.value,p,v);
		} else {
			o.value = v;
		}
		
		//atualiza estilo
		var f = o.form._fl.value;
		var vs = trimm(o.value);
		var st = o.form._st.value;
		var stP = o.form._stP.value;
		//var ch = f+'@'+st;
		//var est = this.prop(ch);
		var est = fls[f][stP];
		var va = est.get(o.name);
		//atualiza
		est.put(o.name,o.value);
		//lert(tg+'='+o.tagName+' no='+no);
		o.form['_volta_'+no].className = est.voltaEstilo(no);
		//deleta e reinsere
		//objA(fl[f]);
		var aa = st+' { '+est.tex()+' }';
		//alerta(fl[f].cssText);
		var alvo = locSt(f,st);
		if (vazio(alvo)) {
			//alerta('estilo vazio: f='+f+' st='+st);
			if (browse.ie) {
				fl[f].addRule(st, est.tex());
			} else {
				fl[f].insertRule(aa,browse.cssRules(fl[f]).length);
			}
			//win.location = gravador+'?_it='+o.form._it.value;
		} else {
			//<link rel="alternate stylesheet" type="text/css" href="styles/stylessand.css" title="Sand">
			alvo.cssText = est.tex();
		}
		//alerta(st);
		return;
	}
	//*********************************
	//input GRAFICO se existe
	function inputG(v,id) {
		//lert(v[0]);
		var o = pr[v[0]];
		if (typeof(o)=='string') {
			o = pr[o];
		}
		var r = '',ee;
		//alerta(o[0][1]);
		var v1 = palavraA(o[0][1],' ');
		var v2 = palavraA(v[1]+'      ',' ');
		for (var i=0;i<v1.length;i++) {
			var n = '_'+i+'_'+v[0];
			if (v1[i].substring(0,1)=='(') {
				try {
					ee = eval(trimm(v1[i],') (')+'(new Array(n,v2[i]))');
				} catch (e) {
					ee = ' ?'+v1[i]+'='+e+'? ';
				}
			} else if (v1[i]=='-') {
				//ignora
				ee = '';
			} else {
				ee = editI(Array(v1[i],v2[i]),n,id);
			}
			r += ee;
		}
		return r;
	}
	//*********************************
	//input 1 prop
	function editI(v,nome,id) {
		//lert(v[0]);
		ne = vazio(nome);
		var oc = ' onchange=janLocObj("oCSS").muda(this,window);>';
		var r = '';
		if (vazio(v[0])) {
			return r;
		}
		vr = '"'+v[1]+'"';
		if (v[1].indexOf('"')!=-1) {
			vr="'"+v[1]+"'";
		}
		r = '<input onblur=valProp(this); type=text class=propInp name="'
			+(ne?v[0]:nome)+'" value='+vr
			+' size='+(vazio(v[1])?15:Math.min(Math.floor(v[1].length*1.25)+5,30))
			+(v[0]=='='?' disabled ':'')
			+oc;
		//tem ajuda ou +
		var r1='';
		var o = pr[v[0]];
		if (typeof(o)=='string') {
			o = pr[o];
		}
		var sos = false;
		if (o!=null && o[0][0]!='prg') {
			sos = o[0][1].indexOf('(')==-1 && o[0][1]!='';
			if (sos && !ne) {
				r1 = ''
					+' <span class=atMenu id=S'+id
					+' name='+(ne?v[0]:nome) 
					+' onclick=janLocObj("oCSS").muda(this,window,event);>'
					+'&nbsp;&nbsp;&nbsp;</span>'
					//+'<select class=propInp'
					//+' name='+(ne?v[0]:nome)+oc+'<option>'
				;
			} else  {
				r1 = ''
					+' <span class=atMenu id=S'+id
					+' name='+(ne?v[0]:nome) 
					+' onclick=janLocObj("oCSS").muda(this,window,event);>'
					+'&nbsp;&nbsp;&nbsp;</span>'
					//+'<select class=propAju'
					//+' name=_'+(ne?v[0]:nome)+troca(oc,'.muda(','.ajuda(')
				;
			}
			//adiciona op vazia se não existe..
			/*if (!vazio(o[0][1])) {
				r1 += '<option value="">';
			}
			for (var i=0;i<o.length;i++) {
				r1 += '<option value="'+o[i][1]
					+'" '+(o[i][1]==v[1]?'selected':'')+'>'+o[i][1];
			}
			r1 += '</select>';
			*/
		}
		var ri = '<input alt="! important" title="! important" type=checkbox '
					+'onclick=janLocObj("oCSS").important(this,"'+v[0]+'",window); '
					+(v[1].toLowerCase().indexOf('important')!=-1?'checked':'')+'>'
		;
		if (o!=null && ne && o[0][0]=='prg') {
			//r = troca(r,'=text ','=hidden ')+inputG(v);
			r = troca(inputG(v,id),'=propInp','=propInp1'+(browse.ie?'IE':''))
				+' '+ri+' '+r
			;
		} else if (sos && !ne) {
			r = r1;
		} else if (ne || (o!=null && o[0][1]=='')) {
			//r += r1;
			r = r1+' '+ri+' '+r;
		}
		return r;
	}
	//*********************************
	// edit todos os props do estilo
	//function editE(o,ch) {
	function editE(es,id) {
		var r = '',prs=',';
		var v = es.v;
		//lert(es.v);
		for (var i=0;i<v.length;i++) {
			r += '<tr class=tabE><td class=propRot>'+v[i][0]
				+' <input type=button class="'+es.voltaEstilo(v[i][0])+'"'
					+' onClick=janLocObj("oCSS").volta(this,window);'
					+' alt="Undo" title="Undo"'
					+' value="" name=_volta_'+v[i][0]+'>'
				+'<td class=propInp>'
				+editI(v[i],null,id)
				//+'<input alt="! important" type=checkbox '
				//	+'onclick=janLocObj("oCSS").important(this,"'+v[i][0]+'",window); '
				//	+(v[i][1].toLowerCase().indexOf('important')!=-1?'checked':'')+'>'
			;
		}
		return r;
	}
	//*********************************
	// formulário edição 1 estilo nas folhas e variantes
	function edit1(st1,it,sIt) {
		var r = '';
		for (var f=0;f<fl.length;f++) {
			if (fln[f][2]) {
			var v = locSts(f,st1);
			for (var i=0;i<v.length;i++) {
			var es = v[i];
			//alerta(es);
			var st = es.nome;
			//return;
			//var s = locSt(f,st);
			var id = 'form_'+f+'_'+i+troca(troca(st1,'.','_'),' ','_');
			r += '' //'st1='+st1+' it='+it+' sIt='+sIt+' id='+id
				+'<form id='+id+' action='+gravador+' method=post>' // target=_cssGrava>'
				+'<table class=tabCl><tr class=tabE>'
				+'<td class=tabE colspan=2><font class=tabETit>'
				+st+'</font>'
				+(st.indexOf(':')==-1
					?' <span class=atMenu id=S'+id
						+' onclick=janLocObj("oCSS").addEst(this,window,event);>'
						+'ADD</span>'
						+' <span class=atMenu id=S'+id
						+' onclick=janLocObj("oCSS").addEst(this,window,event);>'
						+'...</span>'
					:''
					)
			+'<input type=hidden name=_fl value='+f+'>'
			+'<input type=hidden name=_fln value="'+fln[f][0]+'">'
			+'<input type=hidden name=_st value="'+st+'">'
			+'<input type=hidden name=_stP value="'+es.pos+'">'
			+'<input type=hidden name=_it value="'+it+'">'
			+'<input type=hidden name=_sIt value="'+sIt+'">'
			+'<input type=hidden name=_refresh value=1>'
			;
			r += editE(es,id); //f+'@'+st);
			r += '<tr class=tabE><td colspan=2 class=propAddG>'
			+propAdd(id)
			+'<tr class=tabE><td class=estGrava colspan=2>'
			+'<input class=estGrava type=button '
			+(fln[f][3]?' disabled=true ':'')
			+'onClick=janLocObj("oCSS").grava(this,event);'
			+' value="write '+fln[f][0]+'">'
			+'</table></form>'
			;
		}
		}
		}
		return r;
	}
	//*********************************
	// monta html edit classes
	function edit(it,sIt,doc) {
		//alerta('ini ed'+doc);
		var d = ob[it];
		var cl = sIt;
		var tp = 'Class';
		var sep = '.';
		if (cl.substring(0,1)=='#') {
			tp = 'Id';
			sep = '';
		} else if (ob[it].tagName==cl) {
			tp = 'Tag';
		}
		//var sep = (cl.substring(0,1)=='#'?'':'.');
		var r = '<table width="100%" height="100%" align="center">'
		+'<tr><td align="center" valign="middle">'
		+'<table id=tabR class=tabE>'
		+'<tr class=tabE>'
		+'<th class=tabE><h2>'
		+tp+': '+cl+'</h2>'
		+'<tr><td>'
		+(tp=='Tag'
		?''
		:edit1(d.tagName+sep+cl,it,sIt)
			+edit1(sep+cl,it,sIt)
		)
		+edit1(d.tagName,it,sIt)
		+'</table>'
		+'</table>'
		+'<div id=addPropDIV>DIV ADD</div>'
		;
		//doc.write(r);
		var d = browse.getId('corpo',doc);
		//objA(d);
		d.innerHTML = r;
  		//alerta('fim ed'+r);
	}
	//*********************************
	function cmpUrl(v) {
		return troca(v,'#','%23');
	}
	//*********************************
	// abre janela edit classes
	function editA(it,sIt) {
		var w = new winDep(top,gravador+'?_it='+it+'&_sIt='+cmpUrl(sIt));
		w.centrada = false;w.cascata = true;
		w.frame = true;
		//w.debug = true;
		w.scr = 'yes';
		w.abre();
	}
	//*********************************
	//grifa area da tag selecionada...
	function sel(p,a) {
		//click ou timeout?
		if (vazio(a)) {
			if (this.selNv && this.selNv!=0) {
				return;
			}
			this.selNv = 7;
			this.selMem = new Array(
				ob[p].style.opacity
				,ob[p].style.MozOpacity
				,ob[p].style.filter
				,'0.4','0.4','alpha(opacity=40)'
				,'1.0','1.0','alpha(opacity=100)'
			);
		}
		
		//inverte cor
		obCorS = !obCorS;
		var v = (this.selNv==0?0:(obCorS?3:6));
		ob[p].style.opacity = this.selMem[v];
		ob[p].style.MozOpacity = this.selMem[v+1];
		ob[p].style.filter = this.selMem[v+2];
		
		//repete?
		if (this.selNv>0) {
			setTimeout('top.oCSS.sel('+p+',1);',300);
			this.selNv--;
		}
	}
	//*********************************
	function editFolha(i,co) {
		var p = fln[i][0]+(co?'&_co=1':'');
		//alerta(p);
		var w = new winDep(top,gravador+'?_folha='+p);
		w.centrada = false;w.cascata = true;
		w.w=700;//w.h=700;
		w.frame = true;
		w.scr = 'yes';
		w.abre();
	}
	//*********************************
	//localiza folha dentro de folha @import
	function locFolha(folha,cod) {
		var p = 1*leftAt(cod,'.');
		var r = null;
		if (browse.ie) {
			r = folha.imports[p];
		} else {
			for (var i=0;i<folha.cssRules.length;i++) {
				//alerta(p+'=res='+folha.cssRules[i]);
				//top.opener.debJ(folha.cssRules[i]);
				if ((''+folha.cssRules[i]).indexOf('CSSImportRule')!=-1) {
					if (p==0) {
						r = folha.cssRules[i].styleSheet;
						break;
					}
					p--;
				}
			}
		}
		if (r==null) {
			alert('folha não localizada...? folha='+folha+' cod='+cod);
		}
		if (cod.indexOf('.')!=-1) {
			r = locFolha(r,substrAt(cod,'.'));
		}
		return r;
	}
	//*********************************
	//navega na folha
	function navFolha(i) {
		objNav(fl[i]);
	}
	//*********************************
	//navega no objeto
	function navObj(i) {
		objNav(ob[i]);
	}
	//*********************************
	//lista estilos atingidos p/alterar
	function lista() {
		if (false && !browse.ie) {
			alert('Navegador incompatível...,\nUse MS IExplorer....');
			window.close();
			return;
		}
		
		//verifica cookie seleção para edição 
		var fs = cookieGet(top.strCookie);
		if (fs==null) fs = repl('S',top.nFls.length);
		for (var i=0;i<top.nFls.length;i++) {
			top.nFls[i][2] = (fs.substring(i,i+1)=='S');
		}
	
		//tem @media
		//procura objetos do browser das folhas
		for (var i=0;i<top.nFls.length;i++) {
			top.nFls[i][3] = false;
			for (var x=0;x<top.vFls[i].length;x++) {
				if (equals(top.vFls[i][x].ch.toLowerCase(),'@media')) {
					alert('folha INVALIDA\n'+top.nFls[i][0]+'\n\npossui \n'+top.vFls[i][x].ch
						+'\n\nsomente LEITURA...'
						+'\n\ncompativel apenas com: '
						+'\n    7.2 Specifying media-dependent style sheets.'
						+'\n    http://www.w3.org/TR/CSS2/media.html'
					);
					//marca folha como contendo @media
					top.nFls[i][3] = true;
					break;
				}
			}
		}
		//lert('fim @media');
		
		var od = top.opener.jsCSSEditorD[0]; //elemento target
		//objNav(od);
		var st = top.opener.jsCSSEditorD[1]; //folhas style
		var r='<div id=mAjuda>'
			+'<a href=# onclick=janLocObj("oCSS").ajuda(this,event); class=menu>About</a>'
			+'<a href=# onclick=janLocObj("oCSS").ajuda(this,event); class=menu>Update</a>'
			+'<a href=# onclick=janLocObj("oCSS").ajuda(this,event); class=menu>Help</a>'
			+'</div>'
			+'<table width="100%" height="100%" align="center">'
			+'<tr><td align="center" valign="middle">'
			+'<table id=tabR class=tabL>'
			+'<tr class=tabL><th class=tabL colspan=3>'
			+'<div class=ajuda onclick=janLocObj("oCSS").mAjuda.abre(this,0,event);>Help</div>'
			+'<h1 class=tabL>jsCSSEditor '+versao+'</h1>'
		;
		//+'Ordem: Inverso da Hierarquia';
	
		//procura objetos do browser das folhas
		for (var i=0;i<top.nFls.length;i++) {
			//fln[i] = substrAt(substrAt(st[i].href,'//'),'/');
			//alert(top.nFls[i]);
			var fi = st[1*leftAt(top.nFls[i][1],'.')];
			if (top.nFls[i][1].indexOf('.')==-1) {
				fl[i] = fi;
			} else {
				fl[i] = locFolha(fi,substrAt(top.nFls[i][1],'.'));
				if (vazio(fl[i])) {
					alert('folha vazia?: '+top.nFls[i]);
				}
			}
			fln[i] = top.nFls[i]; //absoluteUrl(st[i].href,top.opener.location);
			//lert(fln[i]);
		}
		
		//monta pilha dos objetos browser do contexto
		var i=0;
		while (od!=null) {
			ob[i++] = od;
			try {
				od = od.parentNode;
				if (vazio(od.tagName)) {
					break;
				}
			} catch (e) {
			}
		}

		//monta entrada de dados...
		var r1;
		for (var i=0;i<ob.length;i++) {
			od = ob[i];
			obCor[i] = new Array(
				(false && vazio(od.style.color)?'white':od.style.color)
				,(false && vazio(od.style.backgroundColor)?'black':od.style.backgroundColor)
			);
			try {
				r1 = '<tr class=tabL>'
					+'<td class=tabL><input type=button value='+(ob.length-i-1)
					+' onclick=top.oCSS.sel('+i+'); class=selObj>'
					+'<img src=nav.gif align=center onClick=top.oCSS.navObj('+i+');>'
					+'<a onClick=top.oCSS.dscCSS('+i+');>dscCSS</a>'
					+'<td class=tabL>'
				;
				if (typeof(od.tagName)=='undefined') {
				} else {
					r += r1
						+'<a class=tabL href="javascript:top.oCSS.editA('
						+i+',\''+od.tagName+'\');">'+od.tagName+'</a>'
					;
					r += '<td class=tabL>';
					v = palavraA(trimm(od.className+(od.id?' #'+od.id:'')),' ');
					if (v.length==1 && v[0].length==0) {
						r += '-';
					} else {
						for (x=0;x<v.length;x++) {
							if (trimm(v[x])!='') {
								r += (x==0?'':'<br>')
									+'<a class=tabL href="javascript:top.oCSS.editA('
									+i+',\''+v[x]+'\');">'+v[x]+'</a>\n'
								;
							}
						}
					}
				}
			} catch (e) {
				r += '<tr class=erro><td class=erro>Error<td class=erro>'+e;
			}
		}
		
		//opções para as FOLHAS
		this.flss = new Array();
		r += '<tr><td class=folha colspan=3><table class=folha border=1>'
			+'<tr><th>enable/edit<th>url<th>&nbsp;<th>&nbsp;'
		;
		for (var i=0;i<fl.length;i++) {
			this.flss[i] = fl[i];
			r += '<tr><td class=folha>'
				+'<input '+(fl[i].disabled?'':'checked')
					+' onclick=top.oCSS.folhaSel('+i+',0); type=checkbox>'
				+' / '
					+'<input '+(top.nFls[i][2]?'checked':'')
					+' onclick=top.oCSS.folhaSel('+i+',1); type=checkbox>'
					+'<td class=folha>'
					+'<a title="'+fl[i].href+'" onclick=top.oCSS.navFolha('+i+');>'
				+fln[i][0]+'</a>'
				+'<td class=folha><input name=Edit type=button value=Edit '
					+' onclick=top.oCSS.editFolha('+i+');>'
				+'<td class=folha><input name=Ed type=button value=Ed '
					+' onclick=top.oCSS.editFolha('+i+',1);>'
			;
		}
		r += '</table>';
		//;
		//this.pal = new paletaCores('top.oCSS.pal');
		//document.write(''+r+'<tr><td colspan=3>'+this.pal.monta()+'</table>');
		document.write(r+'<tr><td></table></table>');
		//lert(browse.getId('mAjuda'));
		this.mAjuda = new menuPopUp('mAjuda',browse.getId('mAjuda'));
	}
	//*********************************
	//fora do objeto - cria janela lista
	function janPrin(t,e) {
		if (!e) {
			//plugin wordpress
			gravador = jsCSSEditor_gravador;
			e = t;
		}
		//debJ('e.ctrlKey='+e.ctrlKey+'e.shiftKey='+e.shiftKey);
		if (!e.ctrlKey && !e.shiftKey) {
			return;
		}
		if (!browse.ie) {
			try {
				e.stopPropagation();
			} catch (e) {
			}
		}
		//objNav(e);
		//lert('e='+e);
		//return;
		jsCSSEditorD[0] = targetEvent(e);
		//objNav(jsCSSEditorD[0]);
		//lert(1);
		try {
			doc = e.target.ownerDocument;
		} catch (e) {
			//ie
			//lert('ie='+erro(e));
			doc = jsCSSEditorD[0].document;
		}
		jsCSSEditorD[1] = doc.styleSheets;
		//bjNav(top);
		//objNav(doc.styleSheets);
		var fs = '';
		for (var i=0;i<doc.styleSheets.length;i++) {
			//fs += ','+substrAt(substrAt(document.styleSheets[i].href,'//'),'/');
			try {
				//ocorre ERRO com estilos criados pelo GMap...
				//ebJ(i+' css at '+doc.styleSheets[i].href+(doc.styleSheets[i].href?' sim':' nao'));
				if (doc.styleSheets[i].href) {// && right(doc.styleSheets[i].href,4).toLowerCase()=='.css') {
					//ebJ('xx='+escape(absoluteUrl(doc.styleSheets[i].href)));
					fs += ','+i+'~'+escape(absoluteUrl(doc.styleSheets[i].href));
					//lert(document.styleSheets[i].href);
				} else {
					//fs +=',~~'+i;
				}
			} catch (e) {
				alert(doc.styleSheets[i].href+' '+erro(e));
			}
			//objNav(document.styleSheets[i]);
		}
		if (fs.length==0) {
			alert('no css style sheet');
			return;
		} else {
			fs = fs.substring(1);
		}
		var w = new winDep(top,gravador+'?_fls='+fs
			+'&_loc='+escape(window.location));
		w.tipo = 3;
		//w.frame = true;
		//w.debug = true;
		w.centrada = false;
		w.abre();
	}
	//*********************************
	//options add estilo
	function opAddEst() {
		var v = palavraA(opsAddEst,',');
		var r = '<option>';
		for (var i=0;i<v.length;i++) {
			r += '<option value="'+v[i]+'">'+v[i];
		}
		return r;
	}
	//*********************************
	//seta/retorna cores personaliz
	function coresP(cr) {
		if (vazio(cr)) {
			if (cor.length==0) {
				cores();
			}
			return cor;
		}
		for (var i=0;i<cor.length;i++) {
			if (cor[i]==cr) {
				return null;
			}
		}
		cor[cor.length] = cr;
		cor.sort();
		return null;
	}
	//*********************************
	//procura por cores nas folhas
	function cores() {
		var nc=0,nc1=0;
		var vp = janLocObj("vFls");
		for (var f=0;f<vp.length;f++) {
			var ov = vp[f];
			for (var prop in ov) {
				nc++;
				var e = ov[prop]; //new estilo(f+'@'+prop);
				for (var x=0;!vazio(e) && x<e.v.length;x++) {
					nc1++;
					if (e.v[x][1].indexOf('#')!=-1) {
						var c = '#'+substrAtAt(e.v[x][1]+' ','#',' ');
						coresP(c);
					}
				}
			}
		}
		//alerta(vp.length+'proc cores...'+nc+' '+nc1);		
	}
	//*********************************
	//localiza estilos na folha
	function locSts(fo,st,pth) {
		var s = st.toLowerCase();
		var r = new Array(),t=',';
		var vp = fls[fo];
		var achou = false;
		for (var prop in vp) {
			var es = vp[prop];
			if (es!=null) {
				var esn = es.nome.toLowerCase();
				var v = palavraA(esn,',');
				for (var i=0;i<v.length;i++) {
					var e = trimm(v[i]);
					var s1 = leftAt(e,':');
					var s2 = leftAt(e,' ');
					//alerta(e+' '+s1+' '+s2);
					if ((s1==s || s2==s || s==e)  && t.indexOf(','+e+',')==-1) {
						if (s==e) {
							achou = true;
						}
						r[r.length] = es;
						//alerta(o[i].selectorText);
						//t += prop+',';
					}
				}
				
				//com caminho pth?
				if (!vazio(pth) && esn.indexOf(' ')!=-1 && trimm(substrRat(esn,' '))==s) {
					//lert(s+' '+esn+' ='+substrRat(esn,' ')+'=');
					var v = palavraA(esn,' ');
					var e = true;
					for (var i=0;i<v.length-1;i++) {
						var e1 = pth.indexOf(' '+v[i]+' ');
						if (e1==-1) {
							e = false;
							break;
						}
						pth = pth.substring(e1+v[i].length+1);
					}
					if (e) {
						r[r.length] = es;
					}
				}
			}
		}
		if (!achou) {
			var es=new estilo(st,'');
			r[r.length] = es;
		}
		//alerta(st+' = '+r);
		return r;
	}
	//*********************************
	//deleta estilo na folha
	function delSt(fo,st) {
		var s = st.toLowerCase();
		var o = browse.cssRules(fl[fo]);
		for (var i=0;i<o.length;i++) {
			if (o[i].selectorText.toLowerCase()==s) {
				try {
					fl[fo].deleteRule(i);
				} catch (e) {
					alert('del rule ie');
				}
				break;
			}
		}
	}
	//*********************************
	//localiza estilo na folha
	function locSt(fo,st) {
		var r = null;
		var s = st.toLowerCase();
		var o = browse.cssRules(fl[fo]);
		for (var i=0;i<o.length;i++) {
			try {
				if (o[i].selectorText.toLowerCase()==s) {
					return o[i].style;
				}
			} catch(e) {
				//objNav(o);
			}
		}
		return r;
	}
	//prop possíveis
	//opções baseadas no projeto cssed http://cssed.sourceforge.net
	// por Iago Rubio
	var pr = new Array();
		pr["azimuth"] = Array(
		Array("string","(angle)"),
		Array("fixed-string","inherit"),
		Array("fixed-string","left-side"),
		Array("fixed-string","far-left"),
		Array("fixed-string","left"),
		Array("fixed-string","center-left"),
		Array("fixed-string","center-right"),
		Array("fixed-string","right"),
		Array("fixed-string","far-right"),
		Array("fixed-string","right-side"),
		Array("fixed-string","behind"),
		Array("fixed-string","leftwards"),
		Array("fixed-string","rightwards")
		);
		pr["background"] = Array(
		Array("prg","(color)")
		);
		pr["background-attachment"] = Array(
		Array("string",""),
		Array("fixed-string","scroll"),
		Array("fixed-string","fixed")
		);
		pr["background-color"] = Array(
		Array("prg","(color)")
		);
		pr["background-image"] = Array(
		Array("string","(url)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["background-position"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","top"),
		Array("fixed-string","center"),
		Array("fixed-string","bottom"),
		Array("fixed-string","left"),
		Array("fixed-string","center"),
		Array("fixed-string","right"),
		Array("fixed-string","inherit")
		);
		pr["background-repeat"] = Array(
		Array("fixed-string","repeat"),
		Array("fixed-string","repeat-x"),
		Array("fixed-string","repeat-y"),
		Array("fixed-string","no-repeat"),
		Array("fixed-string","inherit")
		);
		pr["_dim"] = Array(
		Array("string","  0px")
		,Array("string","  1px")
		,Array("string","  2px")
		,Array("string","  3px")
		,Array("string","  4px")
		,Array("string","  5px")
		,Array("string","  6px")
		,Array("string","  7px")
		,Array("string","  8px")
		,Array("string","  9px")
		,Array("string"," 10px")
		,Array("string"," 15px")
		,Array("string"," 20px")
		,Array("string"," 50px")
		,Array("string","100px")
		,Array("string","150px")
		);
		pr["border"] = Array(
		Array("prg","_dim border-style (color)"),
		Array("string","(color)"),
		Array("string","(percentage-length)"),
		Array("fixed-string","inherit")
		);
		pr["border-collapse"] = Array(
		Array("fixed-string","collapse"),
		Array("fixed-string","separate"),
		Array("fixed-string","inherit")
		);
		pr["border-spacing"] = Array(
		Array("string","(length)"),
		Array("fixed-string","inherit")
		);
		pr["border-style"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","hidden"),
		Array("fixed-string","dotted"),
		Array("fixed-string","dashed"),
		Array("fixed-string","solid"),
		Array("fixed-string","double"),
		Array("fixed-string","groove"),
		Array("fixed-string","ridge"),
		Array("fixed-string","inset"),
		Array("fixed-string","outset"),
		Array("fixed-string","inherit"),
		Array("string","(border-style)")
		);
		pr["border-top"] = 'border';
		pr["border-right"] = 'border';
		pr["border-bottom"] = 'border';
		pr["border-left"] = 'border';

		pr["border-color"] = Array(
		Array("prg","(color)")
		);
		pr["border-top-color"] = Array(
		Array("prg","(color)")
		);
		pr["border-right-color"] = Array(
		Array("prg","(color)")
		);
		pr["border-bottom-color"] = Array(
		Array("prg","(color)")
		);
		pr["border-left-color"] = Array(
		Array("prg","(color)")
		);
		pr["border-top-style"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","hidden"),
		Array("fixed-string","dotted"),
		Array("fixed-string","dashed"),
		Array("fixed-string","solid"),
		Array("fixed-string","double"),
		Array("fixed-string","groove"),
		Array("fixed-string","ridge"),
		Array("fixed-string","inset"),
		Array("fixed-string","outset"),
		Array("fixed-string","inherit"),
		Array("string","(border-style)")
		);
		pr["border-right-style"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","hidden"),
		Array("fixed-string","dotted"),
		Array("fixed-string","dashed"),
		Array("fixed-string","solid"),
		Array("fixed-string","double"),
		Array("fixed-string","groove"),
		Array("fixed-string","ridge"),
		Array("fixed-string","inset"),
		Array("fixed-string","outset"),
		Array("fixed-string","inherit"),
		Array("string","(border-style)")
		);
		pr["border-bottom-style"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","hidden"),
		Array("fixed-string","dotted"),
		Array("fixed-string","dashed"),
		Array("fixed-string","solid"),
		Array("fixed-string","double"),
		Array("fixed-string","groove"),
		Array("fixed-string","ridge"),
		Array("fixed-string","inset"),
		Array("fixed-string","outset"),
		Array("fixed-string","inherit"),
		Array("string","(border-style)")
		);
		pr["border-left-style"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","hidden"),
		Array("fixed-string","dotted"),
		Array("fixed-string","dashed"),
		Array("fixed-string","solid"),
		Array("fixed-string","double"),
		Array("fixed-string","groove"),
		Array("fixed-string","ridge"),
		Array("fixed-string","inset"),
		Array("fixed-string","outset"),
		Array("fixed-string","inherit"),
		Array("string","(border-style)")
		);
		pr["border-top-width"] = Array(
		Array("string","(border-width-single)"),
		Array("fixed-string","thin"),
		Array("fixed-string","medium"),
		Array("fixed-string","thick"),
		Array("fixed-string","inherit")
		);
		pr["border-right-width"] = Array(
		Array("string","(border-width-single)"),
		Array("fixed-string","thin"),
		Array("fixed-string","medium"),
		Array("fixed-string","thick"),
		Array("fixed-string","inherit")
		);
		pr["border-bottom-width"] = Array(
		Array("string","(border-width-single)"),
		Array("fixed-string","thin"),
		Array("fixed-string","medium"),
		Array("fixed-string","thick"),
		Array("fixed-string","inherit")
		);
		pr["border-left-width"] = Array(
		Array("string","(border-width-single)"),
		Array("fixed-string","thin"),
		Array("fixed-string","medium"),
		Array("fixed-string","thick"),
		Array("fixed-string","inherit")
		);
		pr["border-width"] = '_dim';
		
		pr["opacity"] = Array(
		Array("fixed-string",""),
		Array("fixed-string","0.8"),
		Array("fixed-string","0.6"),
		Array("fixed-string","0.4"),
		Array("fixed-string","0.2")
		);
		pr["bottom"] = '_dim';
		pr["caption-side"] = Array(
		Array("fixed-string","top"),
		Array("fixed-string","bottom"),
		Array("fixed-string","left"),
		Array("fixed-string","right"),
		Array("fixed-string","inherit")
		);
		pr["clear"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","bottom"),
		Array("fixed-string","left"),
		Array("fixed-string","right"),
		Array("fixed-string","both"),
		Array("fixed-string","inherit")
		);
		pr["clip"] = Array(
		Array("string","(shape)"), 
		Array("fixed-string","auto"),
		Array("fixed-string","inherit")
		);
		pr["color"] = Array(
		Array("prg","(color)"),
		Array("fixed-string","inherit")
		);
		pr["content"] = Array(
		Array("string","(string)"),
		Array("string","(url)"),
		Array("string","(counter)"),
		Array("string","(attr)"),
		Array("fixed-string","open-quote"),
		Array("fixed-string","close-quote"),
		Array("fixed-string","no-open-quote"),
		Array("fixed-string","no-close-quote"),
		Array("fixed-string","inherit")
		);
		pr["counter-increment"] = Array(
		Array("string","(increment-reset)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["counter-reset"] = Array(
		Array("string","(increment-reset)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["cue"] = Array(
		Array("string","(url)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["cue-before"] = Array(
		Array("string","(url)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["cue-after"] = Array(
		Array("string","(url)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["cursor"] = Array(
		Array("string","(url)"),
		Array("fixed-string","auto"),
		Array("fixed-string","crosshair"),
		Array("fixed-string","default"),
		Array("fixed-string","pointer"),
		Array("fixed-string","move"),
		Array("fixed-string","e-resize"),
		Array("fixed-string","ne-resize"),
		Array("fixed-string","nw-resize"),
		Array("fixed-string","n-resize"),
		Array("fixed-string","se-resize"),
		Array("fixed-string","sw-resize"),
		Array("fixed-string","s-resize"),
		Array("fixed-string","w-resize"),
		Array("fixed-string","text"),
		Array("fixed-string","wait"),
		Array("fixed-string","help"),
		Array("fixed-string","inherit")
		);
		pr["direction"] = Array(
		Array("fixed-string","ltr"),
		Array("fixed-string","rtl"),
		Array("fixed-string","inherit")
		);
		pr["display"] = Array(
		Array("fixed-string","inline"),
		Array("fixed-string","block"),
		Array("fixed-string","list-item"),
		Array("fixed-string","run-in"),
		Array("fixed-string","compact"),
		Array("fixed-string","marker"),
		Array("fixed-string","table"),
		Array("fixed-string","inline-table"),
		Array("fixed-string","table-row-group "),
		Array("fixed-string","table-header-group"),
		Array("fixed-string","table-footer-group"),
		Array("fixed-string","table-row"),
		Array("fixed-string","table-column-group"),
		Array("fixed-string","table-column"),
		Array("fixed-string","table-cell"),
		Array("fixed-string","table-caption"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["elevation"] = Array(
		Array("string","(angle)"),
		Array("fixed-string","below"),
		Array("fixed-string","above"),
		Array("fixed-string","higher"),
		Array("fixed-string","lower"),
		Array("fixed-string","level"),
		Array("fixed-string","inherit")
		);
		pr["empty-cells"] = Array(
		Array("fixed-string","show"),
		Array("fixed-string","hide"),
		Array("fixed-string","inherit")
		);
		pr["float"] = Array(
		Array("fixed-string","left"),
		Array("fixed-string","right"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["font"] = Array(
		Array("string","(font)"),
		Array("fixed-string","caption"),
		Array("fixed-string","icon "),
		Array("fixed-string","menu"),
		Array("fixed-string","message-box"),
		Array("fixed-string","small-caption"),
		Array("fixed-string","status-bar"),
		Array("fixed-string","inherit")
		);
		pr["font-family"] = Array(
		//Array("string","&nbsp;"),
		Array("fixed-string","inherit"),
		Array("fixed-string",'Verdana, Arial'),
		Array("fixed-string",'Tahoma, Verdana, Arial'),
		Array("fixed-string",'arial, verdana, sans-serif'),
		Array("fixed-string",'"Trebuchet MS", "Bitstream Vera Sans", verdana, sans-serif'),
		Array("fixed-string",'verdana, sans-serif'),
		Array("fixed-string",'Arial, Helvetica, sans-serif'),
		Array("fixed-string",'Verdana, Arial, Helvetica, sans-serif'),
		Array("fixed-string",'"Courier New", Courier, monospace'),
		Array("fixed-string",'Courier, monospace'),
		Array("fixed-string",'serif'),
		Array("fixed-string",'Georgia'),
		Array("fixed-string",'Impact'),
		Array("fixed-string",'Courier New'),
		Array("fixed-string",'Verdana'),
		Array("fixed-string",'Times New Roman'),
		Array("fixed-string",'Courier'),
		Array("fixed-string",'Trebuchet MS'),
		Array("fixed-string",'Arial'),
		Array("fixed-string",'Charcoal'),
		Array("fixed-string",'Chicago'),
		Array("fixed-string",'Comic Sans MS'),
		Array("fixed-string",'Geneva'),
		Array("fixed-string",'Helvetica'),
		Array("fixed-string",'Monaco'),
		Array("fixed-string",'Monotype.com'),
		Array("fixed-string",'Palatino'),
		Array("fixed-string",'Avant Garde'),
		Array("fixed-string",'Arial Black'),
		Array("fixed-string",'Times')
		);
		pr["font-size"] = Array(
		Array("string","(%,pt,px,em)"),
		Array("string","140%"),
		Array("string","120%"),
		Array("string","110%"),
		Array("string"," 90%"),
		Array("string"," 80%"),
		Array("string"," 75%"),
		Array("string"," 60%"),
		Array("string"," 65%"),
		Array("string"," 55%"),
		Array("string"," 50%"),
		Array("string"," 40%"),
		Array("string",""),
		Array("fixed-string","inherit")
		);
		pr["font-size-adjust"] = Array(
		Array("string","(integer)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["font-stretch"] = Array(
		Array("fixed-string","normal"),
		Array("fixed-string","wider"),
		Array("fixed-string","ultra-condensed"),
		Array("fixed-string","extra-condensed"),
		Array("fixed-string","condensed"),
		Array("fixed-string","semi-condensed"),
		Array("fixed-string","semi-expanded"),
		Array("fixed-string","expanded"),
		Array("fixed-string","extra-expanded"),
		Array("fixed-string","ultra-expanded"),
		Array("fixed-string","inherit")
		);
		pr["font-style"] = Array(
		Array("fixed-string","normal"),
		Array("fixed-string","italic"),
		Array("fixed-string","oblique"),
		Array("fixed-string","inherit")
		);
		pr["font-variant"] = Array(
		Array("fixed-string","normal"),
		Array("fixed-string","small-caps"),
		Array("fixed-string","inherit")
		);
		pr["font-weight"] = Array(
		Array("fixed-string",""),
		Array("fixed-string","normal"),
		Array("fixed-string","bold"),
		Array("fixed-string","bolder"),
		Array("fixed-string","lighter"),
		Array("fixed-string","inherit")
		);
		pr["height"] = '_dim';
		pr["left"] = '_dim';
		pr["letter-spacing"] = Array(
		Array("fixed-string","1px")
		,Array("fixed-string","2px")
		,Array("fixed-string","3px")
		,Array("fixed-string","4px")
		);
		pr["line-height"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","normal"),
		Array("fixed-string","inherit")
		);
		pr["list-style"] = Array(
		Array("string","(list-style)"),
		Array("fixed-string","inherit")
		);
		pr["list-style-image"] = Array(
		Array("string","(url)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["list-style-position"] = Array(
		Array("fixed-string","inside"),
		Array("fixed-string","outside"),
		Array("fixed-string","inherit")
		);
		pr["list-style-type"] = Array(
		Array("fixed-string",""),
		Array("fixed-string","disc"),
		Array("fixed-string","circle"),
		Array("fixed-string","square"),
		Array("fixed-string","decimal"),
		Array("fixed-string","decimal-leading-zero"),
		Array("fixed-string","lower-roman"),
		Array("fixed-string","upper-roman"),
		Array("fixed-string","lower-greek"),
		Array("fixed-string","lower-alpha"),
		Array("fixed-string","lower-latin"),
		Array("fixed-string","upper-alpha"),
		Array("fixed-string","upper-latin"),
		Array("fixed-string","hebrew"),
		Array("fixed-string","armenian"),
		Array("fixed-string","georgian"),
		Array("fixed-string","cjk-ideographic"),
		Array("fixed-string","hiragana"),
		Array("fixed-string","katakana"),
		Array("fixed-string","hiragana-iroha"),
		Array("fixed-string","katakana-iroha"),
		Array("fixed-string","inherit")
		);
		pr["margin"] = Array(
		Array("prg","_dim _dim _dim _dim")
		);
		pr["margin-top"] = Array(
		Array("prg","_dim")
		);
		pr["margin-right"] = 'margin-top';
		pr["margin-bottom"] = 'margin-top';
		pr["margin-left"] = 'margin-top';
		pr["marker-offset"] = Array(
		Array("string","(length)"),
		Array("fixed-string","auto"),
		Array("fixed-string","inherit")
		);
		pr["marks"] = Array(
		Array("fixed-string","crop"),
		Array("fixed-string","cross"),
		Array("fixed-string","auto"),
		Array("fixed-string","inherit")
		);
		pr["max-height"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["max-width"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["min-height"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","inherit")
		);
		pr["min-width"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","inherit")
		);
		pr["orphans"] = Array(
		Array("string","(integer)"),
		Array("fixed-string","inherit")
		);
		pr["outline"] = Array(
		Array("string","(outline)"),
		Array("fixed-string","invert"),
		Array("fixed-string","inherit")
		);
		pr["outline-color"] = Array(
		Array("prg","(color)")
		//Array("string","(color)"),
		//Array("fixed-string","invert"),
		//Array("fixed-string","inherit")
		);
		pr["outline-style"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","hidden"),
		Array("fixed-string","dotted"),
		Array("fixed-string","dashed"),
		Array("fixed-string","solid"),
		Array("fixed-string","double"),
		Array("fixed-string","groove"),
		Array("fixed-string","ridge"),
		Array("fixed-string","inset"),
		Array("fixed-string","outset"),
		Array("fixed-string","inherit")
		);
		pr["outline-width"] = Array(
		Array("string","(border-width)"),
		Array("fixed-string","inherit")
		);
		pr["overflow"] = Array(
		Array("fixed-string","visible"),
		Array("fixed-string","hidden"),
		Array("fixed-string","scroll"),
		Array("fixed-string","auto"),
		Array("fixed-string","inherit")
		);
		pr["padding"] = Array(
		Array("prg","_dim _dim _dim _dim"),
		Array("fixed-string","inherit")
		);
		pr["border-radius"] = Array(
		Array("prg","_dim _dim _dim _dim"),
		Array("fixed-string","inherit")
		);
		pr["border-top-left-radius"] = Array(
		Array("prg","_dim")
		);
		pr["border-top-right-radius"] = Array(
		Array("prg","_dim")
		);
		pr["border-bottom-left-radius"] = Array(
		Array("prg","_dim")
		);
		pr["border-bottom-right-radius"] = Array(
		Array("prg","_dim")
		);
		pr["padding-top"] = Array(
		Array("prg","_dim")
		);
		pr["padding-right"] = 'padding-top';
		pr["padding-bottom"] = 'padding-top';
		pr["padding-left"] = 'padding-top';
		pr["page"] = Array(
		Array("string","(identifier)"),
		Array("fixed-string","auto")
		);
		pr["page-break-after"] = Array(
		Array("fixed-string","auto"),
		Array("fixed-string","always"),
		Array("fixed-string","avoid"),
		Array("fixed-string","left"),
		Array("fixed-string","right"),
		Array("fixed-string","inherit")
		);
		pr["page-break-before"] = Array(
		Array("fixed-string","auto"),
		Array("fixed-string","always"),
		Array("fixed-string","avoid"),
		Array("fixed-string","left"),
		Array("fixed-string","right"),
		Array("fixed-string","inherit")
		);
		pr["page-break-inside"] = Array(
		Array("fixed-string","avoid"),
		Array("fixed-string","auto")
		);
		pr["pause"] = Array(
		Array("string","(pause)"),
		Array("string","(percentage)"),
		Array("fixed-string","inherit")
		);
		pr["pause-after"] = Array(
		Array("string","(pause)"),
		Array("string","(percentage)"),
		Array("fixed-string","inherit")
		);
		pr["pause-before"] = Array(
		Array("string","(pause)"),
		Array("string","(percentage)"),
		Array("fixed-string","inherit")
		);
		pr["pitch"] = Array(
		Array("string","(frequency)"),
		Array("fixed-string","x-low"),
		Array("fixed-string","low"),
		Array("fixed-string","medium"),
		Array("fixed-string","high"),
		Array("fixed-string","x-high"),
		Array("fixed-string","inherit")
		);
		pr["pitch-range"] = Array(
		Array("string","(number)"),
		Array("fixed-string","inherit")
		);
		pr["play-during"] = Array(
		Array("string","(play-during)"),
		Array("fixed-string","auto"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["position"] = Array(
		Array("fixed-string","static"),
		Array("fixed-string","relative"),
		Array("fixed-string","absolute"),
		Array("fixed-string","fixed"),
		Array("fixed-string","inherit")
		);
		pr["quotes"] = Array(
		Array("string","(quotes)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["richness"] = Array(
		Array("string","(number)"),
		Array("fixed-string","inherit")
		);
		pr["right"] = '_dim';
		pr["size"] = Array(
		Array("string","(size-length)"),
		Array("fixed-string","auto"),
		Array("fixed-string","portrait"),
		Array("fixed-string","landscape"),
		Array("fixed-string","inherit")
		);
		pr["speak"] = Array(
		Array("fixed-string","normal"),
		Array("fixed-string","none"),
		Array("fixed-string","spell-out"),
		Array("fixed-string","inherit")
		);
		pr["speak-header"] = Array(
		Array("fixed-string","once"),
		Array("fixed-string","always"),
		Array("fixed-string","inherit")
		);
		pr["speak-numeral"] = Array(
		Array("fixed-string","digits"),
		Array("fixed-string","continuous"),
		Array("fixed-string","inherit")
		);
		pr["speak-punctuation"] = Array(
		Array("fixed-string","code"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["speech-rate"] = Array(
		Array("string","(number)"),
		Array("fixed-string","x-slow"),
		Array("fixed-string","slow"),
		Array("fixed-string","medium"),
		Array("fixed-string","fast"),
		Array("fixed-string","x-fast"),
		Array("fixed-string","faster"),
		Array("fixed-string","slower"),
		Array("fixed-string","inherit")
		);
		pr["stress"] = Array(
		Array("string","(number)"),
		Array("fixed-string","inherit")
		);
		pr["table-layout"] = Array(
		Array("fixed-string","auto"),
		Array("fixed-string","fixed"),
		Array("fixed-string","inherit")
		);
		pr["text-align"] = Array(
		Array("string","(string)"),
		Array("fixed-string","left"),
		Array("fixed-string","right"),
		Array("fixed-string","center"),
		Array("fixed-string","justify"),
		Array("fixed-string","inherit")
		);
		pr["text-decoration"] = Array(
		Array("fixed-string","none"),
		Array("fixed-string","underline"),
		Array("fixed-string","overline"),
		Array("fixed-string","line-through"),
		Array("fixed-string","blink"),
		Array("fixed-string","inherit")
		);
		pr["text-indent"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","inherit")
		);
		pr["text-shadow"] = Array(
		Array("fixed-string","(text-shadow)"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["text-transform"] = Array(
		Array("fixed-string","capitalize"),
		Array("fixed-string","uppercase"),
		Array("fixed-string","lowercase"),
		Array("fixed-string","none"),
		Array("fixed-string","inherit")
		);
		pr["top"] = '_dim';
		pr["unicode-bidi"] = Array(
		Array("fixed-string","normal"),
		Array("fixed-string","embed"),
		Array("fixed-string","bidi-override"),
		Array("fixed-string","inherit")
		);
		pr["vertical-align"] = Array(
		Array("string","(percentage-length)"),
		Array("fixed-string","baseline"),
		Array("fixed-string","sub"),
		Array("fixed-string","super"),
		Array("fixed-string","top"),
		Array("fixed-string","text-top"),
		Array("fixed-string","middle"),
		Array("fixed-string","bottom"),
		Array("fixed-string","text-bottom"),
		Array("fixed-string","inherit")
		);
		pr["visibility"] = Array(
		Array("fixed-string","visible"),
		Array("fixed-string","hidden"),
		Array("fixed-string","collapse"),
		Array("fixed-string","inherit")
		);
		pr["voice-family"] = Array(
		Array("string","(voice-family)"),
		Array("fixed-string","inherit")
		);
		pr["volume"] = Array(
		Array("string","(number)"),
		Array("string","(percentage)"),
		Array("fixed-string","silent"),
		Array("fixed-string","x-soft"),
		Array("fixed-string","soft"),
		Array("fixed-string","medium"),
		Array("fixed-string","loud"),
		Array("fixed-string","x-loud"),
		Array("fixed-string","inherit")
		);
		pr["white-space"] = Array(
		Array("fixed-string","normal"),
		Array("fixed-string","pre"),
		Array("fixed-string","nowrap"),
		Array("fixed-string","inherit")
		);
		pr["widows"] = Array(
		Array("string","(integer)"),
		Array("fixed-string","inherit")
		);
		pr["width"] = '_dim';
		pr["word-spacing"] = 'letter-spacing';
		pr["z-index"] = Array(
		Array("string","(integer)"),
		Array("fixed-string","auto"),
		Array("fixed-string","inherit")
		);
		
		//grupos
		var prG = palavraA(' ALL~ FONT'
		+'~font-family'
		+'~font-style'
		+'~font-variant'
		+'~font-weight'
		+'~font-size'
		+'~font-size-adjust'
		+'~font-stretch'
		+'~font'
		+'~ COLOR'
		+'~color'
		+'~background-color'
		+'~background-image'
		+'~background-repeat'
		+'~background-attachment'
		+'~background-position'
		+'~background'
		+'~ TEXT'
		+'~word-spacing'
		+'~letter-spacing'
		+'~text-decoration'
		+'~vertical-align'
		+'~text-transform'
		+'~text-align'
		+'~text-indent'
		+'~line-height'
		+'~ BOX'
		+'~margin-top'
		+'~margin-right'
		+'~margin-bottom'
		+'~margin-left'
		+'~margin'
		+'~padding-top'
		+'~padding-right'
		+'~padding-bottom'
		+'~padding-left'
		+'~padding'
		+'~height'
		+'~float'
		+'~position'
		+'~clear'
		+'~visibility'
		+'~display'
		+'~top'
		+'~bottom'
		+'~left'
		+'~right'
		+'~width'
		+'~ Border'		
		+'~border-top-color'
		+'~border-right-color'
		+'~border-bottom-color'
		+'~border-left-color'
		+'~border-color'
		+'~border-top-style'
		+'~border-right-style'
		+'~border-bottom-style'
		+'~border-left-style'
		+'~border-style'
		+'~border-top-width'
		+'~border-right-width'
		+'~border-bottom-width'
		+'~border-left-width'
		+'~border-width'
		+'~border-collapse'
		+'~border-color'
		+'~border-style'
		+'~border-spacing'
		+'~border-top'
		+'~border-right'
		+'~border-bottom'
		+'~border-left'
		+'~border'
		+'~border-radius'
		+'~border-top-left-radius'
		+'~border-top-right-radius '
		+'~border-bottom-left-radius'
		+'~border-bottom-right-radius '
		+'~ LIST'
		+'~display'
		+'~white-space'
		+'~list-style-type'
		+'~list-style-image'
		+'~list-style-position'
		+'~list-style'
		+'~ AURAL' 
		+'~volume'
		+'~stress'
		+'~richness'
		+'~azimuth'
		+'~elevation'
		+'~voice-family'
		+'~speak'
		+'~speak-punctuation'
		+'~speak-numeral'
		+'~pitch'
		+'~pitch-range'
		+'~speech-rate'
		+'~play-during'
		+'~pause'
		+'~pause-before'
		+'~pause-after'
		+'~cue'
		+'~cue-before'
		+'~cue-after'
		+'~speak-header'
		,'~');
		//outros
		prG[prG.length] = ' OTHER';
		for (prop in pr) {
			if (prop.charAt(0)!=' ' 
				&& prop.charAt(0)!='_' && ascan(prG,prop)==-1) {
				prG[prG.length] = prop;
			}
		}
		prG[prG.length] = ' ...';
		
		
		//sort
		var prO = new Array();
		for (prop in pr) {
			prO[prO.length] = prop;
		}
		prO.sort();
	//fim prop possíveis
}
//*********************************
//objeto PALETA
//*********************************
function paletaCores(nom) {
	var nome = nom;
	var inc = 64;
	var iinc = 16;
	var pp = new Array(64,128,192,256);
	var tp = pp.length;
	var tl = 16;
	var ucor = 'FFFFFF';
	this.scor = ucor;
	var uR=pp,uG=pp,uB=pp;
	var v = new Array();
	var doc = document;
	//alerta(doc);
	this.sel = sel;
	this.monta = monta;
	this.montaPag = montaPag;
	this.sCor = sCor;
	this.vCor = vCor;
	this.reset = reset;
	this.inc = mInc;
	//*********************************
	function sel(ev) {
		this.scor = ucor;
		if (ev.ctrlKey) return;
		if (vazio(this.selExec)) {
			alert("COR: "+ucor);
			return;
		}
		//alerta(this.selExec+"'"+ucor+"') "+opener);
		eval(this.selExec+"'#"+ucor+"')");
		window.close();
	}
	//*********************************
	function pinta(r,g,b) {
		if (typeof(r)=='undefined') {
			r = pal(ucor.substring(0,2));
			g = pal(ucor.substring(2,4));
			b = pal(ucor.substring(4,6));
		}
		if (typeof(g)=='undefined') {
			g = r;
			b = r;
		}
		for (var i=0;i<r.length;i++){
			for (var j=0;j<g.length;j++) {
				for (var k=0;k<b.length;k++) {
					var p = 'c'+i+''+j+''+k;
					if (r[i]<0 || r[i]>256 ||
						g[j]<0 || g[j]>256 ||
						b[k]<0 || b[k]>256) {
							getId(p).style.background = '#FFFFFF';
							v[p] = '';
						} else {
							var cr = hexRgb(r[i],g[j],b[k]);
							getId(p,this.win).style.background = '#'+cr;
							v[p] = 'c'+cr;
						}
				}
			}
		}
		uR = r;uG = g;uB = b;
		det();
	}
	//*********************************
	function mInc(d) {
		if (d==1) {
			inc = inc==64?inc:inc+iinc;
		} else {
			inc = inc==iinc?inc:inc-iinc;
		}
		pinta();
	}
	//*********************************
	function reset() {
		inc = 64;
		pinta(pp,pp,pp);
	}
	//*********************************
	function montaPag() {
		return '<html>'
			+'<script language="JavaScript" src="/jsCSSEditor.js">'
			+'<script language="JavaScript" src="/fun.js">'
			+'<LINK REL="StyleSheet" HREF="/jsCSSEditor.css">'
			+'<body onclick="jsCSSEditor(this,event);'
			//+'janLocObj([oCSS]).muda(event);'
			+'">'+this.monta()+
			+"</body></html>";
	}
	//*********************************
	function monta() {
		var rt = '<table id=tabR class=pal>'
		+'<tr><td class=palCtrl colspan='+tl+'>'
		+'<input class=palR type=button onClick='
		+nome+'.reset(); value=Reset>'
		+' <input class=palD type=button onClick='
		+nome+'.inc(-1); value="<-inc">'
		+' <input class=palI type=button onClick='
		+nome+'.inc(+1); value="inc->">'
		;
		var nc=0;
		for (i=0;i<tp;i++){
			for (j=0;j<tp;j++) {
				for (k=0;k<tp;k++) {
					if (nc++%tl==0) rt += "<tr>";
					var p = 'c'+i+''+j+''+k;
					var cr = hexRgb(pp[i],pp[j],pp[k]);
					v[p] = 'c'+cr;
					rt += '<td class=pal id='+p+' bgcolor="#'+cr+'"' 
					+ ' onclick='+nome+'.sCor("'+p+'",document);'
					+ ' onmouseover='+nome+'.vCor("'+p+'",document);'
					+ '>&nbsp;&nbsp;&nbsp;&nbsp;'
					;
				}
			}
		}
		//cinza
		for (k=256-8;k>-1;k-=8) {
			if (nc++%tl==0) rt += "<tr>";
			var cr = hexRgb(k,k,k);
			var p = 'z'+k;
			v[p] = 'c'+cr;
			rt += '<td class=pal bgcolor="#'+ cr +'"' 
			+ ' onclick='+nome+'.sCor("'+p+'");'
			+ ' onmouseover='+nome+'.vCor("'+p+'",document);'
			+ '>&nbsp;&nbsp;&nbsp;&nbsp;'
			;
		}
  
		//cores personalizadas
		var c = janLocObj("oCSS").coresP();
		//rt += '<tr><td colspan=10>Cores Personalizadas';
		rt += '<tr><td class=palP colspan='+tl+'><table align=center class=palP>';
		nc=0;
		for (prop in c) {
			var cr = c[prop].substring(1);
			if (nc++%tl==0) rt += "<tr>";
			var p = 'p'+cr;
			v[p] = 'c'+cr;
			rt += '<td class=pal bgcolor="#'+ cr +'"' 
			+ ' onclick='+nome+'.sCor("'+p+'");'
			+ ' onmouseover='+nome+'.vCor("'+p+'",document);'
			+ '>&nbsp;&nbsp;&nbsp;&nbsp;'
		}
		rt += '</table>';
  
		//alerta('c='+this.scor);
		return rt+'<tr>'
		+'<td class=palVer id=cor colspan='+(tl/2)+'>' //+det()
		//+'<td onclick=\'alerta("COLOR: "+'+nome+'.ucor);\' '
		+'<td onclick='+nome+'.sel(event); '
		+'class=palOK id=scor colspan='+(tl/2)
		+' style="background: #'+this.scor+';"'
		+'><input type=button value=OK class=OK>'
		+'<p id=corSel class=palVer></p>'
		+'</table>';
	}
	//*********************************
	function pal(b) {
		var a = hexDec(b);
		a = a==255?256:a;
		var ini = a-(tp-1)/2*inc;
		var fim = a+(tp-1)/2*inc;
		if (ini<0) {
			ini = 0;
		} else if (fim>256) {
			ini -=  (fim-256);
		}
		var r = Array(tp);
		for (var i=0;i<tp;i++) {
			r[i] = ini+i*inc;
		}
		//alerta(b+'='+a+'='+r);
		return r.sort();
	}
	//*********************************
	function sCor(p) {
		ucor = v[p].substring(1);
		this.ucor = ucor;
		var od = getId('scor');
		od.style.background = '#'+ucor;
		od.style.color = '#'+corI(ucor);
		od = getId('corSel');
		od.innerHTML = ucor;
		if (typeof(ucor)=='undefined' || ucor.length!=6) {
			alert('p='+p+'='+ucor);
			return;
		}
		var cori = ucor.substring(0,2)==ucor.substring(2,4)
		&& ucor.substring(2,4)==ucor.substring(4,6);
		if (inc!=16) inc -= 16;
		pinta();
	}
	//*********************************
	function getId(s) {
		return browse.getId(s,doc);
	}
	//*********************************
	function det() {
		var od=getId("cor");
		var r=ucor+' inc='+inc+'<br>R='+uR+'<br>G='+uG+'<br>B='+uB;
		if (objLen(od)!=0) {
			od.style.background="#"+ucor;
			od.style.color="#"+corI(ucor);
			od.innerHTML=ucor; //+' i='+"#"+corI(ucor); //r;
		}
		return r; 
	}
	//*********************************
	function vCor(p,docD) {
		if (!vazio(docD)) {
			doc = docD;
		}
		var cor = v[p].substring(1);
		getId("cor").style.background = '#'+cor;
		getId("cor").style.color="#"+corI(ucor);
		getId("cor").innerHTML = '<font color=#'+corI(cor)+'>'+cor+'</font>';
	}
	//*********************************
	function corI(a) {
		//return a+'FF';
		//alerta(1*hexDec(a.substring(0,2));
		return hexRgb(
		128+hexDec(a.substring(0,2)),
		128+hexDec(a.substring(2,4)),
		128+hexDec(a.substring(4,6))
		);
		return hexRgb(
		128+hexDec(a.substring(0,2)),
		128+hexDec(a.substring(2,4)),
		128+hexDec(a.substring(4,6))
		);
	}
	//*********************************
	function hexDec(a) {
		var t='0123456789ABCDEF';
		return t.indexOf(a.substring(0,1))*16+t.indexOf(a.substring(1,2));
	}
}

//*********************************
// entrada dados gráfica cor
//*********************************
	//**************************//
	function hexRgb(r,g,b) {
		return ''+hex1(r)+''+hex1(g)+''+hex1(b);
	}
	//**************************//
	function hex1(c) {
		if (c==256) return 'FF';
		while (c<0) c += 256;
		while (c>256) c -= 256;
		return ''+hex0(Math.floor(c / 16))+''+hex0(c % 16);
	}
	//**************************//
	function hex0(n) {
		return "0123456789ABCDEF".substring(n,n+1);
	}
	function setParN(sV,p,nV) {
		var v = palavraA(trocaTudo(trimm(sV),'  ',' '),' ');
		v[p] = nV;
		var r = '';
		for (var i=0;i<v.length;i++) {
			if (!vazio(v[i])) {
				r += ' '+v[i];
			}
		}
		return r.substring(1);
	}
	//*********************************
	function selCor2(cor) {
		//alerta('cor '+corNM+' o='+corO);
		corO.style.background = cor;
		//alerta(corO.form[corNM].onchange);
		corO.form[corNM].value = cor;
		janLocObj("oCSS").muda(corO.form[corNM],window);
		janLocObj("oCSS").coresP(cor);
		//corO.form[corNM].onchange();
		//alerta('cor sel: '+cor+' = '+corO.style.background);
	}
	//*********************************
	function selCor(o,nm) {
		corO = o;corNM=nm;
		//alerta(o.style.background);
		var j = new winDep(top,gravador+'?op=pal&ex=opener.selCor2('
		+'&cor='+corToHex(o.style.background).substring(1));
		//j.debug = true;
		j.abre();
	}
	//*********************************
	function color(v) {
		var c = corToHex(v[1]);
		//alerta(v[1]);
		return '<input onClick=selCor(this,"'+v[0]+'"); style="background:'+c
		+';" class=selCor type=button name=cor_'+v[0]+'>'
		+'<input type=hidden name='+v[0]+' value='+v[1]+'>'
		;
	}
	//*********************************
	function valProp(o) {
		if (o.value.indexOf("'")!=-1 && o.value.indexOf('"')!=-1) {
			alert('ERROR: \' and " invalid!');
		}
		if (o.value.indexOf("\\")!=-1) {
			alert('ERROR: \\ invalid!');
		}
	}
	//*********************************
	function corToHex(c) {
		if (c.indexOf('(')!=-1) {
			var v = palavraA(substrAtAt(c,'(',')'),',');
			//alerta(v.length);
			if (v.length>2) {
				return '#'+hexRgb(v[0],v[1],v[2]);
			}
		}
		return c;
	}
//fim entrada cores


/*
	Drag 'n' Drop: JavaScript
	
	function beginDrag(e) { 
			dump("drag start\n"); 
			window.lastX=e.clientX; 
			window.lastY=e.clientY; 
			window.onmousemove=doDrag; 
			window.onmouseup=endDrag; 
	} 
	
	function endDrag(e) { 
			dump("drag end\n"); 
			window.onmousemove=null; 
	}

	http://www.html-world.de/program/xml_3.php#kommentareindtds
*/
