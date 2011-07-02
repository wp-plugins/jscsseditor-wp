/*
Copyright (c) 2002/2011 Signey John

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

//***********************************************
	//monta tabela estilo banco de dados  
	function bdTabela(Nome) {
		var nome = Nome;
		var ur = 0; //registro atual
		//vetor de nome de campos
		var campos = Array();
		//vetor campos index posi��o
		var camposN = Array();
		var valores = Array();
		//o q colocar em campo indefinido
		var Nulo = '';
		//*********************************************
		// retorna txt 1a linha nome campos e o reguistros
		this.getTxt = function() {
			var l='reg';
			for(var i=0;i<camposN.length;i++) {
				l += '\t'+camposN[i];
			}
			var r = l+'\n';
			for(var rn in valores) {
				var rg = valores[rn];
				l = ''+rn;
				for(var i=0;i<camposN.length;i++) {
					l += '\t'+(typeof(rg[i])=='undefined'?Nulo:rg[i]);
				}
				r += l+'\t@\n';
			}
			return r;
		}
		//*********************************************
		// GET valor de um campo pelo nome
		this.get = function(Nome,Valor) {
			if (typeof(campos[Nome])=='undefined') {
				return Valor;
			}
			var pc = campos[Nome];
			if ( typeof(Valor)!='undefined' && typeof(valores[ur][pc])=='undefined' ) {
				return Valor;
			}
			return valores[ur][pc];
		}
		//*********************************************
		// seta valor de um campo pelo nome
		this.set = function(Nome,Valor,add) {
			if (typeof(campos[Nome])=='undefined') {
				debJ('novo campo '+Nome+' pos='+camposN.length);
				campos[Nome] = camposN.length;
				camposN[camposN.length] = Nome;
			}
			var pc = campos[Nome];
			//debJ(Nome+' rg='+ur+' pc='+pc+' valor='+Valor);
			if ( add && !nulo(valores[ur][pc]) ) {
				valores[ur][pc] += ' '+trimm(Valor);
			} else {
				valores[ur][pc] = trimm(Valor);
			}
		}
		//*********************************************
		this.addReg = function(cod) {
			if (typeof(cod)=='undefined') {
				//registro auto numerado
				ur++;
			} else {
				ur = cod;
			}
			//debJ('bd add Reg  ur='+ur+' '+erro());
			valores[ur] = Array();
		}
	}
	//***********************************************
	//entrada de dados html
	function campoHtml(nomec,valorc,win) {
		var nome = nomec;
		var valor = valorc;
		var oIf = null,oIfD,oIfDoc;
		var oTx = null;
		var oCm = null;
		//var formato = 'grafico';
		//var htm = false;
		var win = nulo(win)?window:win;
		var parent = win;
		//lert(parent);
		var doc = win.document;
		var vContext;
		
		//modos
		var modo,modoA=false;
		this.modos = new Array(
			new Array('Grafico','html','g')
			,new Array('Texto','','t')
			,new Array('Html','chtml','t')
		);
		
		//m�todos externos
		this.mostra = mostra;
		this.carrega = carrega;
		this.limpa = limpa;
		this.html = htmlC;
		this.setHtml = setHtml;
		this.cmd = cmd;
		this.sel = sel;
		this.loop = loop;
		this.tag = tag;
		this.clas = clas;
		this.format = format;
		this.arquivo = arquivo;
		this.get = get;
		this.getVal = getVal;
		this.setModo = setModo;
		this.init = init;
		this.mostraFerramentas = true;
		
		//posui entrada alternativa txt?
		//this.txt = false;
		//var formatoTxt = false;
		var mPop,obContext;
		var oDiv = '';
		
		var este = this;
		var eu = this;
		var dialogoAberto = false;
		var cmdAnt;
		//****************************************************
		//abre dialogo
		function dialog(ev,ht) {
			var ed = 'editor_dialogo';
			var c = browse.getId(ed);
			//se n�o existe div dialogo cria
			if (vazio(c)) {
				c = document.createElement('DIV');
				c.id = ed;
				c.className = c.id;
				c.style.cssText = 'z-index:500;';
				document.body.appendChild(c);
			}
			//se 2 � string, preenche
			if (vazio(ev) || typeof(ht)=='string') {
				if (dialogoAberto) {
					c.innerHTML = '';
					c.style.cssText = '';
					browse.esconde(c);
					dialogoAberto = false;
					return;
				}
				//se ht for vazio, so fecha e retorna
				if (vazio(ev)) {
					return;
				}
				c.innerHTML = ht;
			}
			//mostra dialogo
			var x = 'position:absolute;';
			browse.mostra(c);
			var o = targetEvent(ev);
			x += 'top:'+(browse.getAbsY(o)+browse.getTY(o))+'px;';
			x += 'left:'+browse.getAbsX(o)+'px;';
			c.style.cssText = x;
			dialogoAberto = true;
		}
		//***********************************************
		this.paleta = function (ev) {
			//controle eventos
			if (!vazio(ev)) {
				var cor = targetEvent(ev);
				if (ev.type=='mouseover') {
					var o = getParentByTagName(cor,'table');
					o = getElementsByClassName(o,'exemplo')[0];
					o.style.cssText = cor.style.cssText;
					return;
				} else if (ev.type=='click') {
					dialog();
					//lert(cor.style.cssText);
					cmd(null,substrAtAt(cor.style.cssText,':',';'));
					return;
				}
				objNav(ev);
				return;
			}
			//monta html paleta
			var v = palavraA('Red~IndianRed@205@92@92~LightCoral@240@128@128~Salmon@250@128@114~DarkSalmon@233@150@122~LightSalmon@255@160@122~Crimson@220@20@60~Red@255@0@0~FireBrick@178@34@34~DarkRed@139@0@0~Pink~Pink@255@192@203~LightPink@255@182@193~HotPink@255@105@180~DeepPink@255@20@147~MediumVioletRed@199@21@133~PaleVioletRed@219@112@147~Orange~LightSalmon@255@160@122~Coral@255@127@80~Tomato@255@99@71~OrangeRed@255@69@0~DarkOrange@255@140@0~Orange@255@165@0~Yellow~Gold@255@215@0~Yellow@255@255@0~LightYellow@255@255@224~LemonChiffon@255@250@205~LightGoldenrodYellow@250@250@210~PapayaWhip@255@239@213~Moccasin@255@228@181~PeachPuff@255@218@185~PaleGoldenrod@238@232@170~Khaki@240@230@140~DarkKhaki@189@183@107~Purple~Lavender@230@230@250~Thistle@216@191@216~Plum@221@160@221~Violet@238@130@238~Orchid@218@112@214~Fuchsia@255@0@255~Magenta@255@0@255~MediumOrchid@186@85@211~MediumPurple@147@112@219~Amethyst@153@102@204~BlueViolet@138@43@226~DarkViolet@148@0@211~DarkOrchid@153@50@204~DarkMagenta@139@0@139~Purple@128@0@128~Indigo@75@0@130~SlateBlue@106@90@205~DarkSlateBlue@72@61@139~MediumSlateBlue@123@104@238~Green~GreenYellow@173@255@47~Chartreuse@127@255@0~LawnGreen@124@252@0~Lime@0@255@0~LimeGreen@50@205@50~PaleGreen@152@251@152~LightGreen@144@238@144~MediumSpringGreen@0@250@154~SpringGreen@0@255@127~MediumSeaGreen@60@179@113~SeaGreen@46@139@87~ForestGreen@34@139@34~Green@0@128@0~DarkGreen@0@100@0~YellowGreen@154@205@50~OliveDrab@107@142@35~Olive@128@128@0~DarkOliveGreen@85@107@47~MediumAquamarine@102@205@170~DarkSeaGreen@143@188@143~LightSeaGreen@32@178@170~DarkCyan@0@139@139~Teal@0@128@128~Blue/Cyan~Aqua@0@255@255~Cyan@0@255@255~LightCyan@224@255@255~PaleTurquoise@175@238@238~Aquamarine@127@255@212~Turquoise@64@224@208~MediumTurquoise@72@209@204~DarkTurquoise@0@206@209~CadetBlue@95@158@160~SteelBlue@70@130@180~LightSteelBlue@176@196@222~PowderBlue@176@224@230~LightBlue@173@216@230~SkyBlue@135@206@235~LightSkyBlue@135@206@250~DeepSkyBlue@0@191@255~DodgerBlue@30@144@255~CornflowerBlue@100@149@237~MediumSlateBlue@123@104@238~RoyalBlue@65@105@225~Blue@0@0@255~MediumBlue@0@0@205~DarkBlue@0@0@139~Navy@0@0@128~MidnightBlue@25@25@112~Brown~Cornsilk@255@248@220~BlanchedAlmond@255@235@205~Bisque@255@228@196~NavajoWhite@255@222@173~Wheat@245@222@179~BurlyWood@222@184@135~Tan@210@180@140~RosyBrown@188@143@143~SandyBrown@244@164@96~Goldenrod@218@165@32~DarkGoldenrod@184@134@11~Peru@205@133@63~Chocolate@210@105@30~SaddleBrown@139@69@19~Sienna@160@82@45~Brown@165@42@42~Maroon@128@0@0~White~White@255@255@255~Snow@255@250@250~Honeydew@240@255@240~MintCream@245@255@250~Azure@240@255@255~AliceBlue@240@248@255~GhostWhite@248@248@255~WhiteSmoke@245@245@245~Seashell@255@245@238~Beige@245@245@220~OldLace@253@245@230~FloralWhite@255@250@240~Ivory@255@255@240~AntiqueWhite@250@235@215~Linen@250@240@230~LavenderBlush@255@240@245~MistyRose@255@228@225~Gray~Gainsboro@220@220@220~LightGrey@211@211@211~Silver@192@192@192~DarkGray@169@169@169~Gray@128@128@128~DimGray@105@105@105~LightSlateGray@119@136@153~SlateGray@112@128@144~DarkSlateGray@47@79@79~Black@0@0@0','~','@');
			var r = '<table class="paletaCores"><tr><td class="exemplo">&nbsp;<tr><td>';
			var g = '?';
			for (var i=0;i<v.length;i++) {
				var l = v[i];
				if (l.length==1) {
					//r += '<tr><td>';//+l[0]+'<td>';
					g = l[0];
				} else {
					var c = l[1]+','+l[2]+','+l[3];
					r += '<div title="'+l[0]+' '+c+'"'
						+' style="background-color:rgb('+c+');"'
						+' onmouseover="'+nome+'.paleta(event);"'
						+' onclick="'+nome+'.paleta(event);"'
						+'>&nbsp;</div>'
					;
				}
			}
			return r+'</table>';
		}
		//***********************************************
		function setHtml(sHtml) {
			oIf.contentWindow.document.body.innerHTML = sHtml;
		}
		//***********************************************
		function init() {
			//objNav(window);
			oDiv = browse.getId(nome+'Div');
			if (vazio(oDiv)) {
				alert('campoHtml.init(): '+nome+'Div id n�o enconrado...');
				return;
			}
			oDiv.className += ' editorHtml';
			
			//add barra ferramentas
			oIfD = doc.createElement('div');
			oIfD.className = 'divFerram'; 
			oDiv.appendChild(oIfD);
			eu.oIfD = oIfD;
			
			//add iframe
			oIf = doc.createElement('iframe');
			//oIf.src = leftAt(''+window.location,'?');
			oIf.src = 'javascript:{}';
			oIf.className = 'cHtml';
			oIf.style.cssText = 'z-index:-500;';
			oDiv.appendChild(oIf);
			oIfDoc = oIf.contentWindow.document;
			if (oIfDoc.open) {
				oIfDoc.open();
				oIfDoc.close();
			}		
			
			//add textarea
			oTx = doc.createElement('textarea');
			oTx.className = 'cHtml';
			oDiv.appendChild(oTx);
			
			eu.mostra();
		}
		//***********************************************
		//popup limpa
		function arquivo(o,ev) {
			//lert(o.innerHTML+' '+pos);
			if (mPop && mPop.aberto) {
				mPop.fecha();
				return;
			}
			mPop = new menuPopUp(nome+'Pop','titulo ?');
			browse.getId(nome+'Pop').innerHTML = ''
				+'<p onclick="javascript:'+nome+'.limpa();"'
					+'>Apagar Tudo</p>'
				+'<p onclick="javascript:'+nome+'.html();"'
					+'>'+(!htm?'Ver c�digo HTML':'Visualiza��o Normal')+'</p>'
			;
			mPop.abre(o,null,ev);
		}
		//***********************************************
		//popup Formato
		function format(o,ev) {
			if (mPop && mPop.aberto) {
				mPop.fecha();
				return;
			}
			mPop = new menuPopUp(nome+'Ferram','titulo ?');
			mPop.abre(o,null,ev);
		}
		//***********************************************
		function clas(o,pos,ev) {
			if (typeof(pos)=='string') {
				mPop.fecha();
				vContext[o][2].className = pos;
				obContext = null;
				return;
			}
		
			if (mPop && mPop.aberto) {
				mPop.fecha();
				return;
			}
			
			//monta lista estilos cfrme tag.
			var st = oIf.contentWindow.document.styleSheets, r=new Array();
			for (var i=0;i<st.length;i++) {
				//objNav(st[i]);
				for (var x=0;x<st[i].cssRules.length;x++) {
					var s = st[i].cssRules[x];
					var v = palavraA(trocaTudo(
						troca(s.selectorText,',',' '),'  ',' '),' ');
					for (var y=0;y<v.length;y++) {
						var t = leftAt(v[i],'.').toLowerCase();
						if (v[i].indexOf('.')==-1) {
						} else if (true && t!='' && t!=vContext[pos][0].toLowerCase()) {
						} else {
							t = substrAt(v[i],'.')+' '+t;
							if (ascan(r,t)==-1) {
								r[r.length] = t;
							}
						}
					}
				}
			}
			r.sort(function(a,b){return fSort(a.toLowerCase(),b.toLowerCase())});
			var rs = '<table><tr><td>'
				+'<p onclick='+nome+'.clas('+pos+',"");>(vazio)</p>'
			;
			for (var i=0;i<r.length;i++) {
				if ((i+1)%Math.floor((r.length+1)/2+0.99999)==0) {
					rs += '<td>';
				}
				rs += '<p onclick='+nome+'.clas('
					+pos+',"'+leftAt(r[i],' ')+'");>'+r[i]+'</p>'
				;
			}
			rs += '</table>';
			
			mPop = new menuPopUp(nome+'Pop','titulo ?');
			browse.getId(nome+'Pop').innerHTML = rs;
			mPop.abre(o,null,ev);
		}
		//***********************************************
		function tag(o,pos,ev) {
			if (typeof(pos)=='string') {
				mPop.fecha();
				//lert('mudou para: '+pos);
				oIf.contentWindow.document.execCommand('formatblock', false, pos);
				obContext = null;
				return;
			}
			//lert(o.innerHTML+' '+pos);
			if (mPop && mPop.aberto) {
				mPop.fecha();
				return;
			}
			mPop = new menuPopUp(nome+'Pop','titulo ?');
			browse.getId(nome+'Pop').innerHTML = ''
				+'<p onclick='+nome+'.tag(this,"p");>Par�grafo</p>'
				+'<p onclick='+nome+'.tag(this,"h1");>T�tulo 1</p>'
				+'<p onclick='+nome+'.tag(this,"h2");>T�tulo 2</p>'
				+'<p onclick='+nome+'.tag(this,"h3");>T�tulo 3</p>'
				+'<p onclick='+nome+'.tag(this,"div");>Divis�o</p>'
				+'<p onclick='+nome+'.tag(this,"li");>Lista</p>'
				+'<p onclick='+nome+'.tag(this,"li");>Lista Numerada</p>'
			;
			mPop.abre(o,null,ev);
		}
		//***********************************************
		function loop() {
			if (context()) {
				var va = browse.getId(''+nome+'Estilo');
				if (vazio(va)) {
					return;
				}
				va = va.innerHTML;
				var vn = '';
				var pos=0;
				for (var i=0;i<vContext.length;i++) {
					vn = '<span onclick='+nome
							+'.tag(this,'+pos+',event); class=cHtmlTag>'
							+vContext[i][0]+'</span>.'
						+'<span class=cHtmlClass onclick='
							+nome+'.clas(this,'+pos+',event);>'
							+vContext[i][1]+'</span>'
						+' '+vn
					;
					pos++;
				}
				if (va!=vn) {
					browse.getId(''+nome+'Estilo').innerHTML = vn;
				} else {
					//lert('igual e obj #');
				}
			}
			setTimeout(''+nome+'.loop()',1500);
		}
		//***********************************************
		function context() {
			try {
				if (modo[2]!='g') return false;
				var sel;
				if (browse.ie) {
					return false;
					if (oIf.contentWindow.document.selection.type!="None") {
						sel = oIf.contentWindow.document.selection; 
						//.createRange();
						objNav(sel);
						alert('context tt');
					}
				} else {
					sel = oIf.contentWindow.getSelection();
				}
				if (vazio(sel)) {
					//prov�vel modo txt
					return false;
				}
				var o = sel.focusNode;
				//.parentNode;
				if (obContext!=null && obContext==o) {
					return false;
				}
				obContext = o;
				vContext = new Array();
				while (!vazio(o) && (!o.tagName || o.tagName.toLowerCase()!='html')) {
					if (!vazio(o.tagName)) {
						vContext[vContext.length] = new Array(
							o.tagName
							,(vazio(o.className)?'?':o.className)
							,o
						)
					}
					o = o.parentNode;
				}
			} catch (e) {
				alert('ERRO contex(): '+e.description);
			}
			return true;
		}
		//***********************************************
		function sel(ob) {
			var sel = oIf.contentWindow.getSelection();
			//lert(sel.focusNode.parentNode.tagName);
			//objNav(sel);
      //var range = sel.getRangeAt(0);
			//lert(range);

			var pos = ob.selectedIndex;
			if (pos!=0) {
				var tag=ob.options[pos].value;
				var cmd = ob.getAttribute('id');
				//tag = 'h1 class="teste"';
				//lert(tag+' '+cmd);
				oIf.contentWindow.document.execCommand(cmd, false, tag);
			}
			oIf.contentWindow.focus();
		}
		//***********************************************
		function cmd(ev,Par) {
			var o = targetEvent(ev);
			var c,par;
			if (ev==null) {
				c = cmdAnt;
				par = Par;
			} else {
				c = leftAt(substrRat(o.src,'/'),'.');//RAT .substring(1);
				cmdAnt = c;
			}
			//pedir parametro
			if (ev==null) {
				//N�O pedir parametro
				//lert('setar '+c+' par='+par);
			} else if (c=='createlink') {
				p = 'http://www.sf.net';
				alert('xx35235='+c+'='+p);
			} else if (c=='forecolor') {
				dialog(ev,this.paleta());
				//lert(c+'='+p);
			}
			try {
				oIf.contentWindow.document.execCommand(c, false, par);
			} catch (e) {
				objNav(oIf.contentWindow.document);
				alert('ERRO em cmd='+c+"\n"+e+"\n\n"+erro(e)+'\n\nolf='+oIf.contentWindow.document);
			}
			oIf.contentWindow.focus();
		}
		//***********************************************
		function ferramentas() {
			if (!eval(nome+'.mostraFerramentas')) {
				return '';
			}
			/*lert('bb1');
				"cut=Recortar"
				,"copy=Copiar"
				,"paste=Colar"
			*/
			var op = new Array(
				"undo=Desfaz"
				,"redo=Refaz"
				,"bold=Negrito"
				,"italic=It�lico"
				,"underline=Sublinhado"
				,"forecolor=Cor da Fonte"
				,"hilitecolor=Cor do Fundo"
				,"justifyleft=Alinha a Esquerda"
				,"justifycenter=Alinha no Centro"
				,"justifyright=Alinha a Direita"
				,"insertorderedlist=Numerar" 
				,"insertunorderedlist=T�picos" 
				,"outdent=Aumenta margem Esquerda"
				,"indent=Diminui margem Esquerda"
				,"createlink=Cria Link" 
				,"createimage=Insere Imagem" 
				,"createtable=Insere Tabela"
			);
			var r = '<table class=cHtmlFerram id='+nome+'Ferram><tr>';
			//modos
			r += '<td><select onchange='+nome+'.setModo(this);>';
			for (var i=0;i<este.modos.length;i++) {
				r += '<option '+(modo[1]==este.modos[i][1]?'selected':'')+' value='+i+'>'+este.modos[i][0];
			}
			r += '</select></td>';
			if (modo[2]!='g') {
				return r;
			}
			//ferramentas
			for (var i=0;i<op.length;i++) {
				r += '<td><img src="/imagens/edit/'+leftAt(op[i],'=')+'.gif"'
					+' alt="'+substrAt(op[i],'=')+'"'
					+' title="'+substrAt(op[i],'=')+'"'
					+' onclick="'+nome+'.cmd(event);"'
					+'></td>'
				;
			}
			r += ''
				+(false?
					+'<tr><td>'
					+'<table class=cHtmlEstilo><tr>'
						+'<td class=cHtmlPrin>'
						+'<span onclick="javascript:'+nome+'.arquivo(this,event);"'
								+' title="Arquivo" alt="Arquivo">+</span>'
						+'<span onclick="javascript:'+nome+'.format(this,event);"'
							+' title="Formatar" alt="Formatar">Formatar</span>'
						+'</span>'
						+'<td  id='
							+nome+'Estilo><h1>Estilo</h1>'
						+'</table>'
					:'')
				+'</table>'
			;
			return r; 
			//+op.length;
		}
		//***********************************************
		function htmlC() {
			mPop.fecha();
			var v = oIf.contentWindow.document.body.innerHTML;
			if (htm) {
				v =  troca(troca(v,'&lt;','<'),'&gt;','>');
				htm = false;
			} else {
				v = html(v);
				htm = true;
			}
			oIf.contentWindow.document.body.innerHTML = v;
		}
		//***********************************************
		function limpa() {
			mPop.fecha();
			oIf.contentWindow.document.body.innerHTML = '';
		}
		//***********************************************
		//testa se txt
		function txt(ht) {
			if (trimm(ht)=='' || trimm(ht)=='<pre></pre>') {
				return '';
			}
			if (ht.indexOf('<')==-1) {
				return '<pre>'+troca(ht,'&nbsp;',' ')+'</pre>';
			}
			var a = delTag(troca(troca(ht,'\r',''),'\n',' '),'<br','>','\r\n');
			//lert(a);
			if (a.indexOf('<')==-1 && a.indexOf('&nbsp;&nbsp;&nbsp;&nbsp')!=-1) {
				a = '<pre>'+troca(a,'&nbsp;',' ')+'</pre>';
				//lert(a);
				return a;
			}
			return ht;
		}
		//***********************************************
		//deleta tags
		function delTag(ht,ini,fim,tr) {
			if (typeof(tr)=='undefined') {
				tr = '';
			}
			var ht1 = ht.toLowerCase();
			var p,nv=0;
			//lert('loop fim='+fim+' para inicio='+ini+'\n'+ht);
			while ((p=ht1.indexOf(ini))!=-1) {
				if (nv++>1000) {
					alert('loop fim='+fim+' para inicio='+ini);
					return ht;
				}
				var p1 = ht1.indexOf(fim,p+ini.length);
				if (p1 == -1) {
					alert('n�o achei fim='+fim+' para inicio='+ini);
					return ht;
				}
				ht = ht.substring(0,p)+tr+ht.substring(p1+fim.length);
				ht1 = ht.toLowerCase();
			}
			return ht;
		}
		//***********************************************
		//retorna o valor
		function getVal() {
			return get();
		}
		//***********************************************
		//retorna o valor
		function get() {
			var ht;
			if (modo[2]=='t') {
				ht = oTx.value;
			} else {
				ht = oIf.contentWindow.document.body.innerHTML;
				ht = delTag(ht,'<head','</head>');
				ht = delTag(ht,'<title','</title>');
				ht = delTag(ht,'<script','</script>');
				ht = delTag(ht,'<style','</style>');
				ht = delTag(ht,'<meta','>');
				ht = delTag(ht,'<base','>');
				ht = delTag(ht,'<link','>');
				ht = delTag(ht,'_base_href="','"');
				ht = delTag(ht,'<body','>');
				ht = delTag(ht,'</body','>');
				ht = delTag(ht,'<html','>');
				ht = delTag(ht,'</html','>');
				ht = troca(ht,"\t",' ');
				ht = troca(ht,"\r",'');
				ht = trimm(ht);
				ht = txt(ht);
			}
			return (vazio(modo[1])?'':'{'+modo[1]+'}')+ht;
		}
		//***********************************************
		//pega do iframe e coloca no campo hidden
		function carrega() {
			ht = get();
			//lert('carrega'+oCm.name+'   =='+ht);
			if (oCm) {
				oCm.value = ht;
			} else {
				alert('n�o achei o campo pra preencher...');
			}
		}
		//***********************************************
		function setModo(Modo,vlr) {
			//ebJ('type modo='+typeof(Modo)+' '+Modo+' vlr='+vlr);
			//ebJ('setModo angt='+this.txt+' novo='+Modo+' vlr='+vlr);
			var va = nulo(vlr)?get():vlr;

			if (typeof(Modo)=='object' && Modo.tagName ) {
				if (modo[2]=='g' && '-chtml-'.indexOf(+'-'+this.modos[Modo.value][1]+'-')==-1) {
					if (!confirm('perder formatacao?')) {
						return false;
					}
				}
				modo = this.modos[Modo.value];
				//lert(modo);
				//return;
			} else {
				var m = '?';
				for (var i=0;i<este.modos.length;i++) {
					if (este.modos[i][1]==Modo) {
						m = Modo;
						modo = este.modos[i];
						break;
					}
				}
				if (m=='?') {
					alert('Setar modo "'+Modo+'" � inv�lido...');
					return;
				}
			}
		
			modoA = modo;
		
			//formato = modo;
			//formatoTxt = modo!='grafico';
			if (modo[2]=='g') {
				browse.esconde(oTx);
				if (vlr) {
					oIf.contentWindow.document.body.innerHTML = este.valCSS+vlr;
				} if (modoA[1]=='' && (modo[1]=='html' || modo[1]=='chtml')) {
					oIf.contentWindow.document.body.innerHTML = este.valCSS+
						'<p>'+troca(troca(va,'\r',''),'\n','</p>\n<p>')+'</p>'
					;
				} else if (modoA[1]=='chtml' && modo[1]=='html') {
					oIf.contentWindow.document.body.innerHTML = este.valCSS+oTx.value;
				}
				browse.mostra(oIf);
			} else {
				browse.esconde(oIf);
				if (modo[1]=='' && (modoA[1]=='chtml' || modoA[1]=='html')) {
					oTx.value = htmlTxt(oIf.contentWindow.document.body);
				} else if (modoA[1]=='html' && modo[1]=='chtml') {
					oTx.value = delTag(
						delTag(oIf.contentWindow.document.body.innerHTML,'<link','>')
						,'<base','>'
					);
				} else if (modoA[1]=='' && modo[1]=='chtml') {
					oTx.value = '<p>'+troca(troca(va,'\r',''),'\n','</p>\n<p>')+'</p>';
				} else if (false && vazio(oTx.value) 
					&& !vazio(oIfDoc.body.innerHTML)
					&& confirm('Copiar do HTML?')) {
					oTx.value = oIfDoc.body.innerHTML;
				}
				browse.mostra(oTx);
			}
			oIfD.innerHTML = ferramentas();
			//lert(oIfD.innerHTML);
			return;
		}
		//***********************************************
		//retorna valor e seta edit�vel o iframe
		function mostra() {
			//define o modo conforme o valor
			var modosPrim = new Array();
			modo = false;
			if (equals(valor,'{')) {
				var m = equals(valor,'{')?substrAtAt(valor,'{','}'):'';
				for (var i=0;i<este.modos.length;i++) {
					//lert(este.modos[i][2]);
					modosPrim[este.modos[i][2]] = este.modos[i][1];
					if (este.modos[i][1]==m) {
						valor = substrAt(valor,'}');
						modo = este.modos[i];
					}
				}
				if (!modo) {
					alert('n�o achei modo='+m+' para '+valor);
					modo = este.modos[0];

				}
			} else {
				modo = este.modos[0];
			}
			//ebJ('modo sel='+modo);
		
			//procura o CAMPO escondido no FORM...
			oCm = browse.getId(nome+'InH');
			if (vazio(oCm)) {
				try {
					oCm = document.__formul['_'+nome+'_'];
				} catch (e) {
					//lert('n�o encontrei cmp '+'_'+nome+'_');
				}
			}
			
			//tornar edit�vel
			try {
				oIf.contentWindow.document.designMode = 'on';
			} catch (e) {
				if (confirm('ERRO tornando edit�vel...\n\nTentar novamente em 2 segundos? ')) {
					//ebJ('e='+e);
					setTimeout(nome+'.mostra();',2000);
					return;
				}
				alert('cancelado...');
				return;
			}
			
			try {
				oIf.contentWindow.document.execCommand("useCSS", false, true);
			} catch (e) {
				//bjNav(e);
				if (!browse.ie) {
					debJ('err useCSS='+erro(e));
				}
			}
			
			//poe body e stylesets
			if (true || modo[2]=='g') {
				//lert('poe body e stylesets');
				var bs = leftRat(leftRat(''+win.location,'?')+'?','/');
				//carrega os CSS
				var cs = '';
				var st = win.document.styleSheets;
				for (var i=0;i<st.length;i++) {
					//objNav(st[i]);
					if (right(st[i].href,4).toLowerCase()=='.css') {
						cs += '<LINK REL="StyleSheet" HREF="'
							+st[i].href+'">';
					}
				}
				//lert(st.length+' = '+cs+' l='+win.document.location);
				este.valCSS = '<BASE href="'+bs+'/">'+cs;
			}
			
			//troca modos p/compatib firefox3 entrar em edicao
			if (modo[2]=='g') { 
				//oIfDoc.open();
				var modoK = modo,vv=valor;
				setModo('',valor);
				modo = modoK,valor=vv;
				//alert('editor html experimental...');
			}
			setModo(modo[1],valor);
			//setTimeout(setModo,1000);
			
			//vigia
			loop();

			if (typeof(fD)=='object') {
				debJ('setando evento form var javascript');
				fD.onSubmit[fD.onSubmit.length] = ''+nome+'.carrega();';
			}
			
			//resize("tabPag");

			return;
		}
	}
	//*******************************
	// fim campoHTML
	//*******************************

//****************************************************
function daClasse(ob,nomeClasse) {
	if (ob && ob.className && nomeClasse) {
		return (' '+ob.className+' ').indexOf(' '+trimm(nomeClasse)+' ')!=-1;
	}
	return false;
}
//****************************************************
function objClone(ob,doc) {
	var tn = ob.tagName;
	if (typeof(tn)!='string') {
		return;
	}
	var r = doc.createElement(ob.tagName);
	//atributos
	for (var i=0;ob.attributes && i<ob.attributes.length;i++) {
		try {
			var n = ob.attributes.item(i).nodeName;
			var v = ob.getAttribute(n); //trimm
			r.setAttribute(n,v);
			/*if (n=='href') {
				//lert('href='+v);
				lert('='+r.attributes.item(i).textContent+'-');
			}
			*/
		} catch (e) {
			//lert(n+' '+i+' '+erro(e));
		}
	}
	//filhos
	if (ob.childNodes.length==0) {
		r.innerHTML = ob.innerHTML;
	} else {
		for (var i=0;i<ob.childNodes.length;i++) {
			try {
				var o = objClone(ob.childNodes.item(i),doc);
				if (o) {
					r.appendChild(o);
				} else if (ob.innerHTML) {
					r.innerHTML = ob.innerHTML;
					break;
				}
			} catch (e) {}
		}
	}
	return r;
}
//***********************************************
function objLimpa(o) {
	while (o.childNodes.length!=0) {
		o.removeChild(o.firstChild);
	}
}
//*******************************//
function format(v,d) {
	var v1='',v2='',i,vr='';

	v = ''+v;
	i = v.indexOf('.');
	if (i<0) {
		v1 = v;
	} else {
		v1 = v.substring(0,i);
		v2 = v.substring(i+1,999);
	}

	v1 = '000000000000000000'.substring(0,18-v1.length)+v1;
	vr = v1.substring(0,3);
	for (i=3;i<18;i+=3) {
		vr += '.'+v1.substring(i,i+3);
	}

	while (vr.length>1 && '0.'.indexOf(vr.substring(0,1))>-1) 
		vr = vr.substring(1,vr.length);

		return vr+((d==0)?'':','+(v2+'0000000').substring(0,d))
}
//****************************************************
function tabela(Doc,dest,classe) {
	var doc = Doc;
	var t = doc.createElement('table');
	this.tab = t;
	if (typeof(classe)=='string') {
		t.className = classe;
	} else {
		t.border = '1';
	}
	if (dest) {
		dest.appendChild(t);
	}
	//lert('add on dest='+dest);
	var ur;
	var v = new Array();
	this.addRow = addRow;
	this.addCol = addCol;
	//****************************************************
	this.get = function() {
		return t;
	}
	//****************************************************
	function addCol(tx) {
		var c = doc.createElement('td');
		if (tx.tagName) {
			c.appendChild(tx);
		} else {
			c.innerHTML = tx;
		}
		if (!ur) {
			ur = addRow();
		}
		ur.appendChild(c);
		return c;
	}
	//****************************************************
	function addRow(p1,p2,p3,p4,p5,p6,p7,p8) {
		ur = doc.createElement('tr');
		if (typeof(p1)!='undefined') addCol(p1);
		if (typeof(p2)!='undefined') addCol(p2);
		if (typeof(p3)!='undefined') addCol(p3);
		if (typeof(p4)!='undefined') addCol(p4);
		if (typeof(p5)!='undefined') addCol(p5);
		if (typeof(p6)!='undefined') addCol(p6);
		if (typeof(p7)!='undefined') addCol(p7);
		if (typeof(p8)!='undefined') addCol(p8);
		t.appendChild(ur);
		return ur;
	}
}

//****************************************************
function estat(Nome) {
	var nome = Nome;
	var v = new Array();
	this.inc = inc;
	this.inc1 = inc1;
	this.toHtml = toHtml;
	this.getMatriz = getMatriz;
	//****************************************************
	function getMatriz() {
		var v1 = new Array(),i=0;
		for(var prop in v) {
			v1[i++] = new Array(prop,v[prop]);
		}
		return v1;
	}
	//****************************************************
	function toHtml() {
		var v1 = getMatriz();
		v1.sort(function(a,b){return fSort(b[1],a[1])});
		var r = '<table border=1>';
		for(var i=0;i<v1.length;i++) {
			r += '<tr><td>'+v1[i][0]+'<td>'+format(v1[i][1],0);
		}
		return r+'</table>';
	}
	//****************************************************
	function inc1(ch) {
		inc(ch,1);
	}
	//****************************************************
	function inc(ch,vl) {
		if (!v[ch]) {
			v[ch]=vl;
		} else {
			v[ch]+=vl;
		}
	}
}
//***********************************************
function htmlTxt(obj) {
	var nl='\n',r = '';
	var t = obj.tagName?obj.tagName.toLowerCase():'?';
	if (obj.childNodes.length==0) { //''+obj=='[object Text]')
		//nodeValue:
		if (browse.ie) {
			r = trimm(obj.innerText?obj.innerText:obj.nodeValue);
		} else {
			r = trimm(obj.textContent);
		}
	} else {
		if (obj.childNodes && obj.childNodes.length>0) {
			for (var i=0;i<obj.childNodes.length;i++) {
				r += htmlTxt(obj.childNodes.item(i));
			}
		}
	}
	if (t=='br' || t=='hr' || (obj.tagName && !vazio(r) && '~p~tr~li~ul~'.indexOf(t)!=-1) ) {
		r += '\n';
	}
	/*if (debA%500==0) {
		//objNav(obj);
		lert('t='+t+' r='+r+' o='+obj.childNodes.length+'='+typeof(obj)+'='+obj);
	}
	debA++;
	*/
	//lert(typeof(obj)+' '+obj);
	return r;
}

//***********************************************
//retorna uma table no formato MATRIZ
// nroCol = filtra so linhas com >= nro col
function getTabela(obj,nroCol) {
	if (typeof(obj)=='string') {
		var aa = document.createElement('div');
		aa.innerHTML = obj;
		obj = aa;
	}
	var r = new Array();
	var v = obj.getElementsByTagName('tr');
	for (var l=0;l<v.length;l++) {
		var v1 = v[l].getElementsByTagName('td');
		if (!nroCol || v1.length>=nroCol) {
			var l1 = r.length;
			r[l1] = new Array();
			for (var c=0;c<v1.length;c++) {
				r[l1][c] = htmlTxt(v1[c]);
			}
		}
	}
	return r;
}

//**************************//
// menu POPUP
//**************************//
var menuPopUpAberto = false;
//**************************//
function menuPopUp(nome,tit,vOp,ops,est) {
	var oM = null;
	if (typeof(tit)=='object') {
		this.obj = tit;
		this.obj.setAttribute('disp',1);
		oM = tit;
		tit='';
	}
	this.aberto = false;
	if (''+ops=='undefined') {
		ops = '';
	}
	this.evento = true;
	this.posEsq = 0;
	this.incX = 0;
	this.incY = 0;
	this.ops = ops;
	this.nome = nome;
	this.tit = tit;
	this.fecha = menuPopUp_fecha;
	this.abre = menuPopUp_abre;
	this.click = menuPopUp_click;
	this.click1 = menuPopUp_click1;
	this.vat = new Array;
	if (typeof(est)=='undefined') {
		est = 'menPop';
	}
	if (""+vOp=="undefined") {
		return;
	}
	//cria divis�o conforme array
	document.write(
	'<DIV ID="'+this.nome+'" class='+est
	+' STYLE="POSITION: absolute; VISIBILITY: hidden; TOP: 0px; LEFT: 0px;">'
	+'<table class='+est+'>');
	var i = 'onclick='+this.nome+'.fecha(event);>';
	if (ops.indexOf('/nnova')==-1) {
		document.write('<tr><td class='+est+'Tit '+i+this.tit
		+'<td class='+est+'Fecha '+i
		+'x');
	} else {
		document.write('<tr><td class='+est+'Tit '+i+this.tit);
	}
	for (var i=0;i<vOp.length;i++) {
		var op = vOp[i];
		var ps,url;
		if ((ps=op.indexOf("~~"))!=-1) {
			this.vat[i] = op.substring(ps+2);
			url = substrAt(op,'~~');
			op = op.substring(0,ps);
		} else {
			this.vat[i] = op;
		}
		if (op=='-') {
			document.write('<tr><td class='+est+'Sp>');
		} else {
			var oc = ' onClick=javascript:'+this.nome+'.click('+i;
			document.write('<tr><td class='+est+oc+',false,event)>'
				+'&nbsp;<a href="'
					+(!vazio(url) && url.indexOf('{cod}')==-1
						?url
						:'javascript:'+this.nome+'.click('+i+',false,event);'
					)+'" class='+est+'>'+op+'</a>'
				+(ops.indexOf('/nnova')==-1?
				'<td class='+est+'N '+oc+',true,event)>'
				+'<a class='+est+'N>+</a>'
				:'')
			);
		}
	}
	document.write('</table></DIV>');
	//**************************//
	function menuPopUp_click(pos,nova,event) {
		if (event.ctrlKey) return;
		this.fecha();
		//lert('pos='+pos+' param='+this.param+" nova="+nova);
		var a = this.vat[pos],i;
		//lert('1='+a);
		if ((i=a.indexOf("{cod}"))!=-1) {
			a = a.substring(a,i)+this.param+a.substring(i+5);
		} else if (a.substring(0,11)=='javascript:') {
			//lert("eval="+a);
			eval(a);
			return;
		} else {
			a += this.param;
		}
		this.click1(a,nova);
	}
	//**************************//
	function menuPopUp_click1(a,nova) {
		//lert(a);
		if (nova) {
			window.open(a,"_blank");
		} else {
			window.location = a;
		}
	}
	//**************************//
	function menuPopUp_fecha(ev) {
		//objNav(ev);
		//lert(0);
		//ebJ(trace());
		if (typeof(ev)!='undefined' && ev.ctrlKey) {
			return;
		}
		menuPopUpAberto = false;
		this.aberto = false;
		browse.esconde(oM,false);
	}
	//**************************//
	function menuPopUp_abre(ob,pr,ev) {
		if (this.aberto) {
			this.fecha();
			return;
		}
		if (typeof(pr)=='object') {
			ev = pr;
			pr = '';
		}
		if (vazio(oM)) {
			oM = browse.getId(this.nome);
		}
		menuPopUpAberto = true;
		this.aberto = true;
		this.param = pr;
		//var o = browse.getId(this.nome);
		//objNav(o);
		var tx = browse.getTX(ob);
		var x,y;
		x = browse.getAbsX(ob)+((tx==-1)?30:tx);
		if (this.posEsq!=0) {
			x -= browse.getTX(oM)+tx-30;
		}
		y = browse.getAbsY(ob)+browse.getTY(ob);
		
		//abaixo - campo de listar poss�veis conte�dos
		if (this.abaixo) {
			x = browse.getAbsX(ob);
			//browse.setTX(oM,browse.getTX(ob));
			//y = browse.getAbsY(ob);
			this.incX = 0;
			this.incY = 0;
			//lert('x='+x+' y='+y);
		}
		
		//tem evento
		if (!vazio(ev) && this.evento) {
			var xx = browse.eventoX(ev);
			if (xx!=-1) x = xx;
			xx = browse.eventoY(ev);
			if (xx!=-1) y = xx;
		}
		
		if (this.centrado) {
			//lert(browse.getTX(ob));
			x -= browse.getTX(oM)/2+browse.getTX(ob)/2;
		}
		if (this.acima) {
			y -= browse.getTY(oM);
		}
		if (this.esquerda) {
			browse.mostra(oM,false);
			//lert('esq='+browse.getTX(oM)+' '+browse.getTX(ob));
			//objNav(oM);
			x -= browse.getTX(oM)+(this.esquerda==2?browse.getTX(ob):0);
			//return;
		}
		if (this.posE) {
			x -= this.posE + browse.getTX(oM);
		}
		if (this.posS) {
			y -= this.posS + browse.getTY(oM);
		}
		//lert(oM);
		//lert('x='+x+' y='+y);
		browse.setX(oM,x+this.incX);
		browse.setY(oM,y+this.incY);
		browse.mostra(oM,false);
	}
}



	//*******************************//
	function resize(sObj,minX,minY) {
		//lert('resize='+sObj);
		if (nulo(sObj)) {
			var ob = window.document.body;
			//objNav(ob);
		} else {
			var ob = browse.getId(sObj);
		}
		var tX=ob.offsetWidth;
		var tY=ob.offsetHeight; 
		if (vazio(minX)) {
			tX += 80;
			tY += 80+(browse.ie?0:0)
		}
		
		//limita ao tam janela raiz...
		var jr = janRaiz();
		//objNav(jr);
		var mX = browse.tamWinX(jr);
		tX = tX>mX?mX:tX;
		var mY = browse.tamWinY(jr);
		//lert(mY);
		tY = tY>mY?mY:tY;
		
		//tam minimo linux: 423 x 208 e win 419x264
		if (vazio(minX)) minX = 420;
		if (vazio(minY)) minY = 210;
		//lert('x='+tX+' '+minX+' y='+tY+' '+minY+' '+jr.location);
		if (tX<minX) tX = minX;
		if (tY<minY) tY = minY;
		
		try {
			//lert('semOK x='+tX+' y='+tY);
			top.resizeTo(tX,tY);
		} catch (e) {
			alert('ERRO: resize win='+e);
		}
	}


	//*******************************
	function ascan(arr,vlr) {
		for (prop in arr) {
			if (arr[prop]==vlr) {
				return prop;
			}
		}
		return -1;
	}
	

	//*********************************
	function janRaiz() {
		if (vazio(top.opener)) {
			return top;
		}
		return top.opener.janRaiz();
	}
	//*********************************
	function janLocObj(nome) {
		var x;
		try {
			x = eval(nome);
		} catch (e) {
		}
		if (typeof(x)!='undefined') {
			return x;
		}
		if (vazio(top.opener)) {
			return null;
		}
		return top.opener.janLocObj(nome);
	}


//*******************************//
//controle de eventos
var acoesEvento = new Array(); 
regAcaoEvento('load','aAtalhos()');
var parente,objPai;
var obj_obj;
//imagePopUp.load();


//*******************************//
// janelas dependentes
//*******************************//
var wDep = new Array,wTip = new Array,wUrl = new Array,imprPdfTM;

//*******************************//
//*******************************//
//*******************************//
// CONTROLE DE JANELAS POPUP..
// TIPOS DE JANELA: 
// 0 - FECHA S� SE FECHAR A PRINCIPAL
// 1 - FECHA SE O FOCO VOLTAR A PRINCIPAL
// 2 - OBRIGA O FOCO NA SECUNDARIA (DI�LOGO);
// 3 - TOTALMENTE INDEPENDENTE
//*******************************//
//*******************************//
//*******************************//
	function objParente() {
		return obj_obj;
	}
 
	//*******************************//
	function regAcaoEvento(acao,funct) {
		if (!acoesEvento[acao] || vazio(acoesEvento[acao])) {
			acoesEvento[acao] = new Array();
		}
		acoesEvento[acao][acoesEvento[acao].length] = funct;
	}
	//*******************************//
	function evento(s,ev) {
		//op��o em js
		//if (window.addEventListener) window.addEventListener("load",func,false);
		//else if (window.attachEvent) window.attachEvent("onload",func);   
		//for (var f = 0; (formnode = document.getElementsByTagName('form').item(f)); f++) {
		//executa acoes registradas
		//lert(s+' '+ev);
		if (acoesEvento[s] && !vazio(acoesEvento[s])) {
			for (prop in acoesEvento[s]) {
				//lert(acoesEvento[s][prop]);
				var x = acoesEvento[s][prop];
				if (x.indexOf('(')==-1) {
					x += '()';
				}
				eval(x);
			}
		}
  
		if (s=='resize') {
		}
		if (s=='load') {
			//lert('l='+opener);
			if (objLen(opener)!=0) {
				parente = opener;
				objPai = opener.objParente();
			}
			//objLen(opener);
			if (!vazio(objPai) && !vazio(objPai.onLoad)) {
				eval(objPai.onLoad);
			}
		}
		if (s=='close') {
			if (!vazio(objPai) && objPai.pulaClose) {
				objPai.pulaClose = false;
				return;
			}
			//fecha todas as janelas dependentes
			for (i=0;i<wDep.length;i++) {
				if (wDep[i]!=0) {
					wDep[i].close();
					wDep[i] = 0;
				}
			}
			//informa a superior
			if (parente && !vazio(objPai)) {
				//lert('informa sup');
				parente.dRegistraWin(objPai.janPos);
			}
		}
		if (s=='focus') {
			//fecha janelas tipo 1 
			for (var i=0;i<wDep.length;i++) {
				if (wDep[i]!=0 && wTip[i]==1) {
					wDep[i].close();
					wDep[i] = 0;
				} else if (wDep[i]!=0 && wTip[i]==2) {
					try {
						wDep[i].focus();
					} catch(e) {
						//lert('Erro: '+e);
					}
				}
			}
		}
		if (s=='focusOut') {
			if (!vazio(objPai) && objPai.tipo==2) {
				//window.focus();
				//lert("tipo janela=1");
				//fecha somente se o foco volta para a m�e...
				//parente.dRegistraWin(janPos);
				//window.close();
			}
		}
	}
	//*******************************//
	function dRegistraWin(i) {
		if (typeof(i)=='string') {
			i = substrAt(i,'//');
			i = '/'+substrAt(i,'/');
			for (var i1=0;i1<wDep.length;i1++) {
				if (wDep[i1]!=0 && wUrl[i1]==i) {
					//lert('achei: '+wUrl[i1]);
					dRegistraWin(i1);
					return;
				}
			}
			alert('n�o achei: '+i+'\nem\n'+wUrl);
		} else if (wDep[i]!=0) {
			wDep[i].close();
			wDep[i] = 0;
		}
	}
	//*******************************//
	function registraWin(obj) {
		for (i=0;i<wDep.length;i++) {
			if (wDep[i]==0) {
				break;
			}
		}
		obj.janPos = i;
		wDep[i] = obj.obj;
		wTip[i] = obj.tipo;
		wUrl[i] = obj.url;
		obj_obj = obj;
	}
	//*******************************//
	function alertErro(e) {
		alert(erro(e));
	}
	//*******************************//
	function trace(a) {
		return troca(erro(new Error('trace '+a)),'\n\n','<hr>');
	}
	//*******************************//
	function centra(ob,noOb) {
		var xy = centraCoo(ob,noOb);
		//lert(xy);
		if (xy && xy.length>1) {
			if (vazio(ob)) {
				ob = top;
			}
			ob.moveTo(xy[0],xy[1]);
		}
	}
	//*******************************//
	function centraCoo(ob,noOb) {
		//if (!cli.centra) return;
		if (typeof(ob)=='undefined') {
			ob = top;
			noOb = janRaiz();
		} else if (typeof(noOb)=='undefined') {
			noOb = ob;
			ob = top;
		}
		if (browse.ie) {
			try {
				var pX = noOb.screenLeft+noOb.document.body.offsetWidth/2
				-ob.document.body.offsetWidth/2;
				var pY = noOb.screenTop+noOb.document.body.offsetHeight/2
				-ob.document.body.offsetHeight/2;
				return new Array(pX,pY);
			} catch (e) {
				alert('erro='+e);
			}
		} else {
			var pX = noOb.screenX+noOb.outerWidth/2-ob.outerWidth/2;
			var pY = noOb.screenY+noOb.outerHeight/2-ob.outerHeight/2;
			return new Array(pX,pY);
		}
		return new Array();
	}
 
	//*******************************
	function centraDiv(dv,win) {
		if (vazio(win)) {
			win = window;
		}
		var pX,pY;
		if (browse.ie) {
			pX = win.screenLeft+win.document.body.offsetWidth/2
				-browse.getTX(dv)/2;
			pY = win.screenTop+win.document.body.offsetHeight/2
				-browse.getTY(dv)/2;
		} else {
			//pX = win.screenX+win.outerWidth/2-browse.getTX(dv)/2;
			pX = win.outerWidth/2-browse.getTX(dv)/2;
			//pY = win.screenY+win.outerHeight/2-browse.getTY(dv)/2;
			pY = win.outerHeight/2-browse.getTY(dv)/2;
		}
		dv.style.position = 'fixed';
		dv.style.top = pY+'px';
		dv.style.left = pX+'px';
		//browse.setX(dv,pX);
		//browse.setY(dv,pY);
		//dv.offsetTop = pY;
		//dv.offsetLeft = pX;
		//objNav(dv);
		//lert(pX+'-'+pY+' pa='+dv.style.left+','+dv.style.top);
	}


	//*******************************//
	function existeWin(url) {
		for (var i=0;i<wDep.length;i++) {
			if (wDep[i]!=0 && wUrl[i]==url) {
				try {
					wDep[i].document.write('');
					//lert('vai focar..');
					wDep[i].focus();
				} catch(e) {
					//lert('e='+e);
					wDep[i]=0;
					return false;
				}
				return true;
			}
		}
		return false;
	}

	//**************************//
	function absoluteUrl(url,base) {
		if (vazio(base)) {
			base = window.location;
		}
		base=''+base;
		url=''+url;
		if (equals(url,'/')) {
			return url;
		}
		if (equals(url,'http://') || equals(url,'https://')) {
			return '/'+substrAt(substrAt(url,'//'),'/');
		}
		if (equals(base,'http://') || equals(base,'https://')) {
			base = '/'+substrAt(substrAt(base,'//'),'/');
		}
		if (base.indexOf('?')!=-1) {
			base = leftAt(base,'?');
		}
		base = leftRat(base,'/');
		url = trocaTudo(base+'/'+url,'//','/');
		url = troca(url,'/./','/');
		/*while (url.indexOf('..')==-1) {
		}
		*/
		return url;
	}

	//********************************
	//********************************
	function winDep(jan,url) {
		this.debug=false;
		this.jan = jan;
		this.url = url;
		this.tipo = 0;
		this.cascata = false;
		this.nome = '_blank';
		this.obj = null;
		this.pulaClose = false;
		this.janPos = -1;
		this.frame=false;
		this.centrada = true;
		this.scr = 'yes';
		this.stat = 'yes';
		//scroll
  
		this.w = 400;
		this.h = 400;
  
		this.abre = winDep_abre;
		this.centra = winDep_centra;
		this.on = winDep_on;
		this.fCascata = fCascata;
		this.html = html;
		//********************************
		function html(txH) {
			this.obj.innerHTML = txH;
		}
		//********************************
		function winDep_on(s) {
			if (this.frame) {
				//lert('n�o sei gravar em frame...');
				var d = browse.getId('frm',this.obj.document);
				//objNav(d);
				d.contentWindow.document.write(s);
			} else {
				this.obj.document.write(s);
			}
		}
		//********************************
		function winDep_centra() {
			if (browse.ie) {
				this.pX = this.jan.screenLeft+this.jan.document.body.offsetWidth/2
				-this.w/2;
				this.pY = this.jan.screenTop+this.jan.document.body.offsetHeight/2
				-this.h/2;
			} else {
				this.pX = this.jan.screenX+this.jan.outerWidth/2-this.w/2;
				this.pY = this.jan.screenY+this.jan.outerHeight/2-this.h/2;
			}
		}
		//********************************
		function fCascata() {
			if (browse.ie) {
				this.pX = this.jan.screenLeft+20;
				this.pY = this.jan.screenTop+30;
			} else {
				this.pX = this.jan.screenX+20;
				this.pY = this.jan.screenY+30;
			}
		}
		//********************************
		function winDep_abre() {
			if (existeWin(this.url)) {
				//lert('url existe='+url);
				return false;
			}
			if (this.centrada) {
				this.centra();
			}
			if (this.cascata) {
				this.fCascata();
			}
			//lert('x='+this.pX+' y='+this.pY);
			var d=(this.debug?"yes":"no");
			var t='width='+this.w+',height='+this.h
			+(this.pX?',screenX='+this.pX+',screenY='+this.pY:'')
			+',resizable=yes,scrollbars='+this.scr+','
			+'toolbar='+d+',menubar='+d+',status='+this.stat;
			//+'toolbar='+d+',menubar='+d+',status='+d;
			//ebJ(t);
			if (this.frame) {
				//lert('a');
				this.obj = window.open('about:blank',this.nome,t);
			} else {
				this.obj = window.open(this.url,this.nome,t);
			}
			//lert('ab');
			try {
				this.obj.focus();
				if (this.tipo!=3) {
					registraWin(this);
				}
				if (this.frame) {
					this.obj.document.write(
					'<html><frameset rows=100% border=1 framespacing=1 frameborder=0>'
					+'<frame id=frm src="'+this.url+'"></frameset>'
					+'</html>'
					);
				}
			} catch(e) {
			}
			return true;
		}
	}
//fim CTRLE JAN DEPENDENTES
