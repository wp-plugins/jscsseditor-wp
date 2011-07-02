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
	//**************************//
	function addEvento(elem,eve,fun,bool) {
		if (typeof elem.addEventListener != 'undefined' ) {
			elem.addEventListener(eve, fun, bool);
		} else if (typeof elem.attachEvent != 'undefined' ) {
			elem.attachEvent('on'+eve, fun);
		}
	}

	//**************************//
	function dataSql(a) {
		//getDay = dia semana.
		var d = vazio(a)?new Date():a;
		return takeYear(d)+'-'+strZero(d.getMonth()+1,2)
		+'-'+strZero(d.getDate(),2)+' '
		+strZero(d.getHours(),2)+':'
		+strZero(d.getMinutes(),2)+':'+strZero(d.getSeconds(),2);
	}
	//**************************//
	function takeYear(theDate) {
		x = theDate.getYear();
		var y = x % 100;
		y += (y < 38) ? 2000 : 1900;
		return y;
	}
	//**************************//
	function strZero(nr,t) {
		return right('0000000000'+nr,t);
	}
	//************************************
	/* preciso armazenar objetos ligados a tags 
		até onde eu sei não podem ser armazenados 
		nas tags, então vamos de vetor
		q armazena {objJs,tag} e setda cod em JS
		e o atributo codTag em tag
	*/
	var _objTag = new Array();
	function objTag(ob,tg) {
		var c = ms();
		_objTag[c] = new Array(ob,tg);
		ob.cod = c;
		tg.setAttribute('codTag',c);
	}
	//************************************
	//executa scripts do objeto
	// para usar com ajax
	function scripts(ob) {
		var v = ob.getElementsByTagName('script');
		for (var i=0;i<v.length;i++) {
			debJ('eval js: '+v[i].textContent);
			with (document) {
				eval(v[i].textContent);
			}
		}
	}


	//**************************//
	function ms() {
		return (new Date()).getTime();
	}
	//********************
	//retira da url o host menos www
	function host(url) {
		tx = ''+url;
		var p = tx.indexOf('://');
		if (p!=-1) {
			tx = tx.substring(p+3);
		}
		if (tx.substring(0,4)=='www.') {
			tx = tx.substring(4);
		}
		p = tx.indexOf('/');
		if (p!=-1) {
			tx = tx.substring(0,p);
		}
		return trimm(''+tx);
	}
	//*********************************
	function domRemove(ob) {
		ob.parentNode.removeChild(ob);
	}
	//*********************************
	function carregaObj(url,id,id1) {
		//lert('url='+url);
		if (!url || !id) {
			alert('faltou url='+url+' id='+id);
		}
		var x = new carregaUrl();
		x.carregaObj(url,id,id1);
	}
	//*********************************
	function carregaUrl() {
		var eu = this;
		this.url = '';
		this.abre = abre;
		this.carregaObj = carregaObj;
		this.js = js;
		var vHead = new Array();
		var xmlhttp=false;
		this.debug = false;
		xmlhttp = false;
		if (!browse.ie) {// && typeof(XMLHttpRequest)!='undefined') {
			try {
					xmlhttp = new XMLHttpRequest();
			} catch (e) {
					xmlhttp=false;
			}
		} else  { //if (!xmlhttp && window.createRequest) {
			try {
					var b=true?"Microsoft.XMLHTTP":"Msxml2.XMLHTTP";
					xmlhttp = new ActiveXObject(b);
					//lert("criou request ms IE ="+xmlhttp);
			} catch (e) {
					xmlhttp=false;
			}
		}
		if (!xmlhttp) {
			alert('erro criando obj httpREQ');
		}
		this.httpReq = xmlhttp;
		//*********************************
		function deb(s,ob) {
			if (!eu.debug) {
				return;
			}
			if (ob) {
				objNav(ob);
			}
			alert(s);
		}
		//*********************************
		//executa os javaScript do obj
		function js(obj,tx) {
			var t = obj.getElementsByTagName('script');
			deb('vai js '+t.length+' '+tx);
			//ie ignora script em ajax...
			if (t.length==0 && tx.indexOf('<script>')!=-1) {
				var t = ''+tx;
				while (t.indexOf('<script>')!=-1) {
					var e = substrAtAt(t,'<script>','</script>');
					deb('vai js IE... '+e);
					eval(e);
					t = substrAt(t,'</script>');
				}
			}
			for (var i=0;i<t.length;i++) {
				try {
					eval(t[i].innerHTML);
				} catch (e) {
					alert('ajax erro: '+e+'\n em javaScript:\n '+troca(t[i].innerHTML,';',';\n'));
				}
			}
		}
		//*********************************
		function carregaObj(url,id,id1) {
			this.idObj = id;
			this.idObj1 = id1;
			this.abre(url);
		}
		
		//*********************************
		function abre(url,funcRet) {
			deb(this.debug+' url='+url);
			this.funcRet = funcRet;
			this.url = url;
			this.method = 'GET';
			this.dados = null;
			if (this.form) {
				//url vazio
				this.url = vazio(this.url)?this.form.action:this.url;
				//lert(this.url+' a='+this.form.action);
			
				//monta string
				var t1 = '';
				for (var i=0;i<this.form.elements.length;i++) {
					var o = this.form.elements.item(i);
					var v = troca(escape(trimm(o.value)),'+','%2B');
					if (o.type=='checkbox') {
						v = o.checked?'on':'';
					}
					t1 += '&'+o.name+'='+v;
				}
				t1 = t1.substring(1); //+'&lixo=1';
				
				//GET ou POST
				if (this.form.method && this.form.method.toLowerCase()=='post') {
					this.method = 'post';
					this.dados = t1;
				} else {
					this.url += this.url.indexOf('?')==-1?'?'+t1:'&'+t1;
				}
				if (this.debug) {
					alert('ajax: m='+this.method+'\n url='+this.url+'\n'+troca(''+this.dados,'&','\n'));
				}
			}
			
			//monta PEDIDO
			//lert('a='+this.method+','+this.url+' '+url);
			this.httpReq.open(this.method,this.url,true);
			this.httpReq.onreadystatechange=recebe;
			this.httpReq.setRequestHeader('encoding','ISO-8859-1'); 
			if (this.method=='post') {
				this.httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				this.httpReq.setRequestHeader('Content-length', this.dados.length );
			}
			if (browse.ie) {
				try {
					this.httpReq.setRequestHeader('Cookie', document.cookie);
				} catch (e) {
				}
				//lert(document.cookie);
			}
			
			//cab
			for (var ci=0;ci<vHead.length;ci++) {
				this.httpReq.setRequestHeader(vHead[ci][0],vHead[ci][1]);
				alert(this.method+' set head='+vHead[ci][0]+' == '+vHead[ci][1]);
			}

			//guarda EU
			eu = this;
			
			//envia PEDIDO
			this.httpReq.send(this.dados);
			return true;
		}
		//*********************************
		this.addHead = function(ch,v) {
			vHead[vHead.length] = new Array(ch,v);
		}
		//*********************************
		function recebe() {
			//ebJ(eu);
			var funcRet = eu.funcRet;
			var hR =  eu.httpReq;
			var fR = funcRet;
			var oId = eu.idObj; //coloca objeto num id
			var id1 = eu.idObj1; //pega os dados de outro id
			var th = eu;			
			var XX = hR.readyState;
			//eb('ajax recebe'+eu+' '+XX);
			if (XX==4) {
					XR = hR.responseText;
					//joga resultado em ID?
					if (oId) { //sim
						var oDest = (typeof(oId)=='object'?oId:browse.getId(oId));
						//pega result dentro de ID?
						//lert('oid='+oId+' '+oDest);
						if (vazio(id1)) { //nao
							// id destino é FUNC
							if (equals(oId,'&')) { //sim
								var id = substrAt(oId,'~');
								eval(leftAt(oId.substring(1),'~')+'(id,hR.responseText);');
							} else {
								//eb(' XX ajax recebe dest '+oDest+' '+hR.responseText);
								oDest.innerHTML = (hR.responseText);
								th.js(oDest,hR.responseText);
							}
						} else { //pega result dentro de ID
							var o = document.createElement("div");
							oDest.innerHTML = hR.responseText;
							var o1 = browse.getId(id1,o);
							oDest.innerHTML = o1.innerHTML;
							th.js(oDest,hR.responseText);
						}
					} else if (funcRet) { //chama funcao ou addChild
						//lert('oid='+oId+' '+funcRet);
						if (typeof(funcRet)=='function') {
							funcRet(XX,th,XR);
						} else if (typeof(funcRet)=='object') {
							funcRet.innerHTML = XR;
						} else if (funcRet.indexOf('()')!=-1) {
							eval(troca(funcRet,'()','(XR)'));
						} else {
							eval(funcRet+'('+XX+',th,XR)');
						}
					}
			} else {
				//ebJ('xx='+XX);
			}
		}
	}

	//*********************************
	function valMail(o) {
		//objNav(o);
		var em = o.value;
		em = tiraAcentos(em);
		if (em.indexOf('<')!=-1) {
			em = substrAt(em,'<');
		}
		if (em.indexOf('>')!=-1) {
			em = leftAt(em,'>');
		}
		while (em.indexOf('"')!=-1) {
			em = substrAt(em,'"');
		}
		em = trimm(troca(em,' ',''));
		if (em!=o.value) {
			o.value = em;
			//lert(em);
		}
		var v1 = palavraA(em,'@');
		if (em.length<8 || v1.length!=2 || v1[0].length<1 || v1[1].length<4 ) {
			return false;
		}
		
		//tem ponto?
		if (v1[1].indexOf('.')==-1) return false;
		
		if (!valEmailP(v1[0]) || !valEmailP(v1[1])) {
			return false;
		}
		return true;
	}
	//*******************************
	function getEmail(Texto) {
		var v = palavraA(trocaTudo(trocaChars(''+Texto,'<>,;:',' '),'  ',' '),' ');
		//ebJ('v='+v);
		var r = '';
		for (var i=0;i<v.length;i++) {
			if ( v[i].indexOf('@')!=-1 && valEmailP(v[i]) ) {
				r += ' '+trimm(v[i]);
			}
		}
		return r.substring(1);
	}
	//*******************************
	function valEmailP(s) {
		var i = s.length;
		return !('-@_.'.indexOf(s.substring(0,1))!=-1 || '-@_.'.indexOf(s.substring(i-1,i))!=-1);
	}
	//**************************//
	function capitalize(s) {
		var tb = '~de~e~do~em~dos~rs~no~na~da~das~';
		var a,v = palavraA(s,' '),r='';
		for (var i=0;i<v.length;i++) {
			if (!vazio(v[i])) {
				r +=( '(-'.indexOf(v[i].substring(0,1))!=-1
					?v[i].toUpperCase()
					:(tb.indexOf('~'+v[i].toLowerCase()+'~')==-1
							?v[i].substring(0,1).toUpperCase()+v[i].substring(1).toLowerCase()
							:v[i].toLowerCase())
				)+' ';
			}
		}
		return trimm(r);
	}
	//**************************//
	function tiraAcentos(s) {
		var acentos  = "áéíóúüàâêôãõñçÁÉÍÓÚÜÀÂÊÔÃÕÑÇ";
		var acentost = "aeiouuaaeoaoncAEIOUUAAEOAONC";
		var p;
		for (var i=0;i<s.length;i++) {
			if ((p=acentos.indexOf(s.substring(i,i+1)))!=-1) {
				s = s.substring(0,i)+acentost.substring(p,p+1)+s.substring(i+1);
			}
		}
		return s;
	}
	//***********************************************
	function fSort(a,b) {
		return (a>b?1:(a<b?-1:0));
	}

//*******************************//
//funções cookie
	//********************
	function cookieGet(nome) {
		var co = document.cookie+';';
		var i = co.indexOf(nome+'=');
		var f = co.indexOf(';',i+nome.length+1);
		if (i==-1 || f<=i) {
			return null;
		} else {
			return unescape(co.substring(i+nome.length+1,f));
		}
	}
	//********************
	function cookiePut(nome,vlr,venceDias,domi) {
		if (venceDias!=0 && vazio(venceDias)) {
			venceDias = 120;
		}
		var v = new Date();
		v.setTime(v.getTime() + 1000*60*60*24*venceDias);
		v = v.toGMTString();
		if (venceDias<0) {
			v = "Thu, 01-Jan-1970 00:00:01 GMT";
		}
		dc = nome + '=' + vlr
			+(venceDias==0?'' : ';expires=' + v)+';path=/'
			+(domi?';domain='+domi:'')
		;
		//debJ('dc1='+dc);
		document.cookie = dc;
	}


//******************************
// objeto Pedido
// retorna parametros conforme 
// location e permite reatribuir
// com fins de montar novo location
//******************************
function pedido(doc) {
	this.atalho = atalho;
	this.remove = remove;
	this.get = get;
	this.put = put;
	this.param = get;
	this.paramPut = put;
	this.set = put;
	this.paramToForm = paramToForm;
	this.refresh = refresh;
	this.getV = getV;
	this.url = ''; //host
	var url = ''; //parametros
 
	//lert(typeof(doc));
	if (typeof(doc)=='undefined') {
		doc = window;
	}
	try {
		if (typeof(doc)=='string') {
			var url = doc;
			this.doc = window;
		} else {
			this.doc = doc;
			var url=''+doc.location;
		}
	} catch (e) {
		var url = '';
		//alertErro(e);
	}
	var param = new Array();
	this.url = url; 
	var p = url.indexOf('?');
	if (p!=-1) {
		this.url = url.substring(0,p);
		url = url.substring(p+1);
	} else if (url.indexOf('://')<10 && url.indexOf('://')!=-1) {
		//nao tem ? e tem http
		this.url = url;
		url = '';
	} else {
		url = url.substring(p+1);
	}
	var v = new Array();
	v = palavraA(url,'&');
	var c;
	for (var i=0;i<v.length;i++) {
		c = palavraA(v[i]+'=','=');
		var np = c[0];
		if (vazio(np)) {
			//ignora
		} else if (!param[np] || vazio(param[np])) {
			param[np] = unescape(troca(c[1],'+',' '));
		} else {
			if (typeof(param[np])=='string') {
				param[np] = new Array(param[np]);
			}
			param[np][param[np].length] = unescape(troca(c[1],'+',' '));
			//lert(param[np]);
		}
	}
	//lert('v='+v);
	//ultimo parametro tem # atalho interno <a name=>
	if (c && param[c[0]] && param[c[0]].indexOf('#')!=-1) {
		param[c[0]] = leftRat(param[c[0]],'#');
	}
	//******************************
	function getV() {
		return param;
	}
	//******************************
	function paramToForm(frm,duplica) {
		for(var prop in param) {
			if (param[prop]!=null) {
				if (duplica || !frm[prop]) {
					frm.appendChild(input(prop,param[prop]));
				} else {
					frm[prop].value = param[prop];
				}
			}
		}
	}
	//******************************
	function atalho() {
		var r = '';
		for(var prop in param) {
			if (param[prop]==null) {
			} else if (typeof(param[prop])!='object') {
				r += '&'+prop+'='+escape(param[prop]);
			} else {
				for(var p in param[prop]) {
					r += '&'+prop+'='+escape(param[prop][p]);
				}
			}
		}
		//lert(troca(r,'&','\n')+' pg='+param['pg']);
		return this.url+(r.length==0?'':'?'+r.substring(1));
	}
	//******************************
	function remove(ch) {
		param[ch] = null;
	}
	//******************************
	function get(a,b) {
		var r = param[a];
		if (vazio(r) && !nulo(b)) {
			return b;
		}
		return r;
	}
	//******************************
	function refresh() {
		this.put('segs',ms());
		doc.location = this.atalho();
	}
	//******************************
	function put(a,b) {
		//lert('set a='+a+' b='+b);
		param[a] = b;
	}
}



	//***********************************************************
	function estiloAddDel(ob,estilo,ligar1) {
		return classAddDel(ob,estilo,ligar1);
	}
	//***********************************************************
	function classAddDel(ob,estilo,ligar1) {
		var d = ' '+ob.className+' ';
		var ligar = ligar1;
		if (nulo(ligar)) {
			//se não informou, inverte sit atual
			ligar = d.indexOf(' '+estilo+' ')==-1;
		}
		var r = ligar;
		if (ligar && d.indexOf(' '+estilo+' ')==-1) {
			d += estilo;
			r = true;
		} else if (!ligar && d.indexOf(' '+estilo+' ')!=-1) {
			d = troca(d,' '+estilo+' ',' ');
			//ebJ('deslig');
			r = false;
		}
		//ebJ(ob.name+' '+ligar1+' = '+ligar+' cl='+ob.className+' cln='+d+' ret='+r);
		d = trimm(d);
		if (ob.className!=d) {
			ob.className = d;
		}
		return r;
	}
	//**************************//
	function repl(str,nv) {
		var r = '';
		for (var i=0;i<nv;i++) {
			r += str;
		}
		return r;
	}
	//**********************
	function trocaTudo(g,a,b) {
		while (g.indexOf(a)!=-1) {
			g = troca(g,a,b);
		}
		return g;
	}
	//**********************
	function trocaChars(g,a,b) {
		for (var i=0;i<a.length;i++) {
			g = troca(g,a.substring(i,i+1),b);
		}
		return g;
	}
	//**********************
	function troca(g,a,b) {
		var i=0,p,ta,tb;
  
		ta = a.length;
		tb = b.length;
		
		try {
  
			while ( (p = g.indexOf(a,i)) > -1 )  {
				g = g.substring(0,p)+b+g.substring(p+ta);
				//,g.length
				i = p - ta + tb + 1;
			}
		} catch (e) {
			alert(erro(e));
		}
  
		return g;
	}

	//****************************************************
	//retorna 1o atributo de parente com nome obj
	function o(obj) {
		return getParentAttr(obj,'obj');
	}
	//****************************************************
	//retorna o filho n do objeto
	function p(ob,n) {
		var r;
		try {
			r = ob.childNodes.item(n);
		} catch (e) {
		}
		return r;
	}
	//***************************************************
	// retorna o parent que possui o attributo setado
	function getParentAttr(o,nomeAtr) {
		//obj é evento?
		if (o && o.target && o.type) {
			o = targetEvent(o);
		}
		var oa = o;
		while (o) {
			if (o.getAttribute && o.getAttribute(nomeAtr) && o.getAttribute(nomeAtr)!=null ) {
				return o.getAttribute(nomeAtr);
			} else if (o[nomeAtr]) {
				return o[nomeAtr];
			}
			o = o.parentNode;
		}
		return o;
	}

	//**************************//
	function html(a) {
		return troca(troca(a,'<','&lt;'),'>','&gt;');
	}
	//**************************//
	function objLen(o){
		var i=0;
		try {
			for(var prop in o) {
				i++;
			}
		} catch (e) {
			//lert(erro(e));
		}
		return i;
	}
	//**************************//
	function equals(strLonga,strCurta) {
		if (vazio(strCurta) || vazio(strLonga)) return false;
		if (strCurta.length>strLonga.length) return false;
		return (strLonga.substring(0,strCurta.length)==strCurta);
	}
	//**************************//
	function palavraA(tx,a,b) {
		var p=0,pn,t=a.length,pi=0,r = new Array();
		while ((pn=tx.indexOf(a,p))!=-1) {
			r[pi++] = tx.substring(p,pn);
			p = pn + t;
		}
		r[pi++] = tx.substring(p); //,g.length()

		//lert(b);
		if (nulo(b)) {
			return r;
		}
		for (var i=0;i<r.length;i++) {
			//lert(b.length+' '+r[i]);
			r[i] = palavraA(''+r[i],b);
			//lert(r[i].length);
		}
		return r;
	}
	//**************************//
	function leftAt(s,s1) {
		var p = s.indexOf(s1);
		if (p==-1) {
			return s;
		}
		return s.substring(0,p);
	}
	//*****************************************
	function substrRat(g,a) {
		var i = g.lastIndexOf(a);
		if (i<0) return g;
		return g.substring(i+1);
	}
	//*****************************************
	function leftRat(g,a) {
		var i = g.lastIndexOf(a);
		if (i<0) return g;
		return g.substring(0,i);
	}
	//*****************************************
	function substrAtAt(g,a,b) {
		return leftAt(substrAt(g,a),b);
	}
	//*****************************************
	function substrAt(g,a) {
		var i = g.indexOf(a);
		if (i<0) return g;
		return g.substring(i+a.length);
	}

	//**************************************
	function trimm(a,b) {
		var i,t;
		if (typeof(a)=='undefined') {
			return '';
		}
		if (typeof(b)=='undefined') {
			b = ' \n\r\t';
		}
		if (typeof(a)!='string') {
			//debJ(erro('trimm não string: '+a));
			return '';
		}
		//retira do inicio
		t = a.length-1;
		if (t<0) return a;
		i = 0;
		while (i<t & b.indexOf(a.substring(i,i+1))>-1) i++;
		if (i!=0) a = a.substring(i,t+1);
		//retira do fim
		t = a.length;
		if (t<1) return a;
		i = t-1;
		while (i>-1 && b.indexOf(a.substring(i,i+1))>-1) i--;
		if (i!=t-1) a = a.substring(0,i+1);
		return a;
	}
	//**************************//
	function right(s,t) {
		return s.substring(s.length-t,s.length);
	}

	//*********************************
	function targetEvent(ev) {
		var v = Array('target','srcElement','originalTarget','currentTarget',
		'explicitOriginalTarget','relatedTarget');
		//localiza obj destino
		for (var i=0;i<v.length;i++) {
			try {
				var o = ev[v[i]];
				if (o!=null) {
					return o;
				}
			} catch (e) {
			}
		}
		return null;
	}


	//***************************************************
	//
	function getElementsByClassName(doc,val) {
		if (!val) {
			val = doc;
			doc = document;
		}
		return getElementsByAttr(doc
			,'class'+(browse.ie?'Name':'')
			,function(x){return (' '+x+' ').indexOf(' '+val+' ')!=-1;}
		);	
	}
	//***************************************************
	//
	function getElementsByAttr(obj,nome,val,arr) {
		if (nulo(arr)) {
			arr = new Array();
		}
		try {
			var v = obj.getAttribute(nome);
		} catch (e) {
		}
		if ( typeof(val)=='function' ? val(v)  : v && (nulo(val) || v==val) ) {
			//ebJ('achei...: '+obj.tagName+' '+v);
			arr[arr.length] = obj;
		}
		if (obj.childNodes && obj.childNodes.length>0) {
			for (var i=0;i<obj.childNodes.length;i++) {
				getElementsByAttr(obj.childNodes.item(i),nome,val,arr);
			}
		}
		return arr;
	}
	//***************************************************
	//
	function getParentByTagName(o,nome) {
		nome = nome.toUpperCase();
		//while ((o=o.parentNode) && o.tagName.toUpperCase()!=nome);
		while (o) {
			if (o.tagName && o.tagName.toUpperCase()==nome) {
				return o;
			}
			o = o.parentNode;
		}
		return o;
	}
	//*******************************//
	function vazio(a) {
		try {
			//if ((a==null || isNaN(a) || typeof(a)=='undefined')) {
			if ((a==null || typeof(a)=='undefined')) {
				return true;
			} else if (typeof(a)=='object') {
				return objLen(a)==0;
			} else {
				return (typeof(a)=='string' && trimm(a)=='');
			}
		} catch (e) {
			//lert('erro testando vazio(): '+erro(e)+' obj='+a);
			//objNav(e);
			return true;
		}
	}
	//*******************************//
	function nulo(a) {
		return ( typeof(a)=='undefined' || a==null );
	}

	//*******************************//
	function erro(e) {
		//objNav(e);
		//http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Error
		if (typeof(e)=='string' || typeof(e)=='undefined') {
			//return (e+' (string)');
			e = new Error(''+e);
		}
		return 'Erro='
			+e.name
			+(browse.ie?' ('+e.number+')':'')
			+' '+e.message
			+' '+(browse.ie?' '+e.description:'')
			+(!browse.ie?(''+e.stack).replace('\n','\n\n'):'')
		;
		//return 'erro='+troca(''+e.stack,'@','\n');
	}

	//*********************************
	var _debJ = 0;
	//*********************************
	//texto e opcionalmente nome monitor
	function debJ(str,mon) {
		var jan = browse.getId('debJ');
		if (vazio(jan)) {
			var jan = document.createElement('div');
			jan.className = 'debJ';
			jan.id = 'debJ';
			jan.innerHTML = '<div  class="debJMon"></div>';
			document.body.appendChild(jan);
		}
		if (!mon) {
			jan.innerHTML = ((''+str).indexOf('<')!=-2?'<p>'+(_debJ++)+' '+troca(html(str),'\n','<br>')+'</p>':str) 
				+'<hr>'+ jan.innerHTML;
			return;
		}
		//procura por monitor dentro da janela
		var monG = getElementsByClassName(jan,'debJMon')[0];
		var mon1 = getElementsByClassName(monG,'debJMon_Item'+mon)[0];
		// lert(mon+' g='+monG+' 1='+mon1);
		if (!mon1) {
			var mon1 = document.createElement('div');
			mon1.className = 'debJMon_Item debJMon_Item'+mon;
			mon1.title = mon;
			monG.appendChild(mon1);
		}
		mon1.innerHTML = str;
	}

//funcoes DEBUG
	//**************************//
	function objNav(ob,jan) {
		if (typeof(jan)!='undefined') {
			//this.filtro = o;
			this.o = ob;
			this.jan = jan;
			//metodos
			this.mostra = mostra;
			this.filtrar = filtrar;
			this.pula = pula;
			this.mItem = mItem;
			this.item = item;
			//this.mostra();
		} else {
			init(ob);
		}
		//**************************//
		function mItem(prop,z) {
			var r='';
			var t = typeof(z);
			if (t=='function' && (''+z).length>40) {
				z = ''+z;
				z = z.substring(0,40)+'...(+'+z.length+')';
			}
			if (!this.tp[t]) {
				this.tp[t] = 0;
			}
			this.tp[t]++;
			if (!this.filtro || t==this.filtro) {
				r += '<tr><td><font size=2 color=darkgreen><b>'+t+'</b></font> '
				+'<a href=javascript:este.pula("'+prop+'");>'+prop+'</a>: '
				+'<font size=2>'+(t=='string' || t=='function'?html(''+z):z)
				;
			}
			if (t=='function' && ''+prop=='item') {
				//lert('item...');
				r += this.item();
			}
			return r;
		}
		//**************************//
		function item() {
			//lert('item');
			var r = '';
			for (var i=0;i<this.o.length;i++) {
				r += this.mItem('item_'+i+'',this.o.item(i));
			}
			return r;
		}
		//**************************//
		function pula(o) {
			var ds;
			if (o.substring(0,5)=='item_') {
				ds = this.o.item(1*o.substring(6));
			} else {
				ds = this.o[o];
			}
			objNav(ds);
		}
		//**************************//
		function init(o) {
			if (vazio(o)) {
				this.tit = 'objeto VAZIO...';
			} else {
				this.tit = (o.name?' '+o.name:'')
					+(o.tagName?' '+o.tagName:'')
					+' '+o
				;
			}
			var r = '<html><head><title>'
				+this.tit+' - objNav </title></head>'
			+'<script language="JavaScript" '
			+'src="/js/funcoes.js"></script>'
			+'<body><table border=1><tr><td>'
			+'<font size=3>Objeto: <font color=red>'+o
			+'<tr><td id=dad>'
			+'</table>'
			+'<scr'+''+'ipt>var este1;'
			+' function objNavInit() {'
			//+'  lert("teste o"+este);'
			+'  este.mostra();'
			//+'  este=new objNav();'
			//+'  //lert(objNav);'
			+' }'
			+' setTimeout("objNavInit();",1000);'
			+'</scr'+''+'ipt>'
			+'</body>'
			+'</html>'
			;
			//lert('objnav: ');
			//lert(objNav);
			//objA(window.document.objNav);
			var w = window.open('about:blank','_blank',
				'width=600,height=700,resizable=yes,scrollbars=yes,status=1'
			);
			//lert(window);
			try {
				w.document.write(r);
				//w.objNav = objNav;
				//objNavAlvo = o;
				//var zzz;
				w.este = new objNav(o,w);
			} catch (e) {
				alertErro(e);
			}
		}
		//**************************//
		function filtrar(f) {
			if (typeof(f)!='string') {
				alert('filtro por chave');
				return;
			}
			this.filtro = f;
			this.mostra();
		}
		//**************************//
		function mostra() {
			this.tp = new Array;
			var o = this.o;
			var filtro = this.filtro;
			var i=0,z;
			var r = '';
			for(var prop in o) {
				try {
					z = o[prop];
					//z = objNavR(prop);
					//z = eval('este.o.'+prop);
				} catch (e) {
					z = '?erro:'+e;
					//objA(o);
					//alertErro(e);
					//break;
				}
				r += this.mItem(prop,z);
				i++;
				if (i>200) break;
			}
			//mostra totais por tipo
			var r1 = '<tr><td colspan=2><b>'+i
			+' (limite 200) </b>';
			r1 += '(<b><a href=javascript:este.filtrar("");>'
			+'Todos</a></b>='+i+') ';
			for(var prop in this.tp) {
				var z = this.tp[prop];
				r1 += '(<b><a href=javascript:este.filtrar("'+prop+'");>'
				+prop+'</a></b>='+z+') ';
			}
			r1 += '<br><b>Chave</b>: '
			+'<input size=10 onChange=este.filtrar(this)>';
			r = '<table border=1>'+r1+r+'</table>FIM...';
			//var w = window.open('about:blank','_blank',
			// 'width=400,height=700,resizable=yes,scrollbars=yes,status=0'
			//);
			//w.document.write(r);
			var ds=browse.getId('dad',this.jan.document);
			ds.innerHTML = r;
   
			return r;
		}
	}
	//**************************//
	function objA(o,filtro) {
		var r = '';
		var i=0,tp=new Array(),z;
		for(var prop in o) {
			try {
				z = o[prop];
			} catch (e) {
				z = '?erro:'+e;
			}
			var t = typeof(z);
			if (!tp[t]) tp[t] = 0;
			tp[t]++;
			if (!filtro || t==filtro) {
				r += ''+t.substring(0,2)+': '
				+prop+' = '+z+'\n';
			}
			i++;
			if (i>200) break;
		}
		return r;
	}
	//**************************//
	function obj(o,filtro) {
		var r = '<html><body><table border=1>';
		var i=0,tp=new Array(),z;
  
		for(var prop in o) {
			try {
				z = o[prop];
			} catch (e) {
				z = '?erro:'+e;
			}
			var t = typeof(z);
			if (!tp[t]) tp[t] = 0;
			tp[t]++;
			if (!filtro || t==filtro) {
				r += '<tr><td>'+t.substring(0,2)+': '
				+prop+'<td>'+(t=='string'?html(''+z):z);
			}
			i++;
			if (i>200) break;
		}
		r += "<tr><td>Total (limite 200)<td>"+i
		+'<tr><td><b>Tipos:</b><td>';
		for(var prop in tp) {
			var z = tp[prop];
			r += '(<b>'+prop+'</b>='+z+') ';
		}
		r += '</table>';
		var w = window.open('about:blank','_blank',
		'width=400,height=700,resizable=yes,scrollbars=yes,status=0'
		);
		w.document.write(r+'</body></html>');
  
		return r;
	}
//fim func DEBUG

//**************************//
//**************************//
var browse = new mznsie();
//**************************//
//**************************//
function mznsie() {
	this.NS6 = false;
	this.NS4 = false;
	this.IE4 = false;
	//lert(navigator.appName+'\n'+navigator.appVersion);
	if (document.getElementById && !document.all) {
		this.NS6 = true;
		this.nav = "NS6";
	} else {
		if (document.layers) {
			this.NS4 = true;
			this.nav = "NS4";
		} else {
			if (document.all) {
				this.IE4 = true;
				this.nav = "IE4";
				this.IE6 = navigator.appVersion.indexOf('MSIE 6')!=-1
					|| navigator.appVersion.indexOf('MSIE 5')!=-1
				;
			}
		}
	}
	this.ie = this.IE4;
	this.ie6 = document.documentElement &&
		( document.documentElement.clientWidth 
		|| document.documentElement.clientHeight)
	;
	//this.moz = this.IE6
	this.moz = navigator.userAgent.toLowerCase().indexOf("gecko")!=-1;
	this.fir = navigator.userAgent.toLowerCase().indexOf("firefox")!=-1
		|| navigator.userAgent.toLowerCase().indexOf("icewea")!=-1
	;
	this.win = navigator.userAgent.toLowerCase().indexOf("windows")!=-1;
	this.lin = navigator.userAgent.toLowerCase().indexOf("linux")!=-1;
 
	var x = new Array("getId","mostra","esconde","getAbsX","getAbsY"
	,"setX","setY","getX","getY","getTX","getTY","getDocFrame"
	,"visivel","eventoX","eventoY","tamWinX","tamWinY","cssRules","setTX","setTY");
	for (var i=0;i<x.length;i++) {
		this[x[i]] = eval('obj_'+x[i]+this.nav);
	}
	//lert("obj criado"+this);
	//lert("obj criado"+this.getId);
 
	//**************************//
	//campos uso geral
	//**************************//
	this.MostraEsconde = obj_MostraEsconde;

	//**************************
	this.aceitaFoco = function(o) {
		try {
			var t = o.tagName.toLowerCase();
			if (t=='input' || t=='textarea' || t=='select') {
				return true;
			}
		} catch (e) {
		}
		return false;
	}
	//**************************
	function obj_tamWinYNS6(o) {
		if (vazio(o)) {
			o = window;
		}
		return o.outerHeight;
	}
	function obj_tamWinYIE4(o) {
		if (vazio(o)) {
			//lert('peg atual win');
			o = window;
		}
		if (this.ie6) {
			var r = o.document.documentElement.clientHeight;
			//lert('ie6='+this.ie6+' tam='+r+' '+);
			return r;
		} else {
			return o.screen.availHeight;
		}
	}
 
	function obj_MostraEsconde(id) {
		var o = this.getId(id);
		if (this.visivel(o)) {
			this.esconde(o);
		} else {
			this.mostra(o);
		}
	}
	//**************************//
	function obj_cssRulesNS6(o) {
		return o.cssRules;
	}
	function obj_cssRulesIE4(o) {
		return o.rules;
	}
	//**************************//
	function obj_tamWinXNS6(o) {
		if (vazio(o)) {
			o = window;
		}
		return o.outerWidth;
	}
	function obj_tamWinXIE4(o) {
		if (vazio(o)) {
			o = window;
		}
		//lert(this.IE6==true+' '+document.documentElement.clientWidth);
		if (document.body.clientWidth) {
			return o.document.body.clientWidth;
		} else if (this.ie6) {
			return o.document.documentElement.clientWidth;
		} else {
			return o.screen.availWidth;
		}
		//return o.document.body.offsetWidth;
	}
	//**************************//
	function obj_eventoYNS6(o) {
		return o.layerY;
		//client retoran a pos sem scroll?
		return o.clientY;
	}
	function obj_eventoYNS4(o) {
		return o.y;
	}
	function obj_eventoYIE4(o) {
		//return o.clientY;
		//lert('a');
		var e = targetEvent(o);
		return o.offsetY+browse.getAbsY(e);
		return -1;
	}
	//**************************//
	function obj_eventoXNS6(o) {
		//lert(o.offsetWidth);
		return o.clientX;
		return o.layerX;
	}
	function obj_eventoXNS4(o) {
		return o.x;
	}
	function obj_eventoXIE4(o) {
		//lert(o.offsetWidth);
		//return o.clientX+o.offsetX;
		//return o.screenX+o.offsetX;
		return o.clientX;
		return -1;
	}
	//**************************//
	function obj_getTXNS6(o) {
		//lert(o.offsetWidth);
		return o.offsetWidth;
	}
	function obj_getTXNS4(o) {
		return -1;
	}
	function obj_getTXIE4(o) {
		//lert(o.offsetWidth);
		return o.offsetWidth;
	}
	//**************************//
	function obj_setTXNS6(o,v) {
		o.style.width = v;
	}
	function obj_setTXNS4(o,v) {
		return -1;
	}
	function obj_setTXIE4(o,v) {
		o.style.width = v;
	}
	//**************************//
	function obj_setTYNS6(o,v) {
		o.style.height = v;
	}
	function obj_setTYNS4(o,v) {
		return -1;
	}
	function obj_setTYIE4(o,v) {
		o.style.height = v;
	}
	//**************************//
	function obj_getTYNS6(o) {
		return o.offsetHeight;
	}
	function obj_getTYNS4(o) {
		return -1;
	}
	function obj_getTYIE4(o) {
		return o.offsetHeight;
	}
	//**************************//
	function obj_getIdNS6(id,ob) {
		if (typeof(ob)=='undefined') ob = document;
		if (!ob.getElementById) {
			return getId(ob,id);
		}
		return ob.getElementById(id);
	}
	function obj_getIdNS4(id) {
		var r = document.layers[id];
		return r;
	}
	function obj_getIdIE4(id,ob) {
		if (typeof(ob)=='undefined') ob = document;
		return ob.all[id];
	}
 
	//**************************//
	function obj_getXNS6(o) {
		return o.style.left;
	}
	function obj_getXNS4(o) {
		return o.x;
	}
	function obj_getXIE4(o) {
		return o.style.pixelLeft;
	}
	//**************************//
	function obj_getYNS6(o) {
		return o.style.top;
	}
	function obj_getYNS4(o) {
		return o.y;
	}
	function obj_getYIE4(o) {
		return o.style.pixelTop;
	}
	//**************************//
	function obj_setXNS6(o,p) {
		o.style.left = p+'px';
	}
	function obj_setXNS4(o,p) {
		o.x = p;
	}
	function obj_setXIE4(o,p) {
		try {
			o.style.pixelLeft = p;
		} catch (e) {
			objNav(o);
		}
		//+'px';
	}
	//**************************//
	function obj_setYNS6(o,p) {
		o.style.top = p+'px';
	}
	function obj_setYNS4(o,p) {
		o.y = p;
	}
	function obj_setYIE4(o,p) {
		o.style.pixelTop = p; 
		//+'px';
	}
	//**************************//
	function obj_visivelNS6(o) {
		return o.style.visibility == "visible";
	}
	function obj_visivelNS4(o) {
		return o.visibility == "show";
	}
	function obj_visivelIE4(o) {
		return o.style.visibility == "visible";
	}
	//**************************//
	function obj_mostraNS6(o,b) {
		if (typeof(o)=='string') o = browse.getId(o);
		if (o.getAttribute('disp')) {
			o.style.display = 'block';
		} else {
			o.style.visibility = "visible";
			if (''+b=='undefined') o.style.display = '';
		}
	}
	function obj_mostraNS4(o) {
		if (typeof(o)=='string') o = browse.getId(o);
		o.visibility = "show";
	}
	function obj_mostraIE4(o,b) {
		if (typeof(o)=='string') o = browse.getId(o);
		o.style.visibility = "visible";
		if (''+b=='undefined') o.style.display = '';
	}
	//**************************//
	function obj_escondeNS6(o,b) {
		if (typeof(o)=='string') o = browse.getId(o);
		if (!o || !o.getAttribute) {
			alert(erro('obj_escondeNS6'));
			return;
		}
		if (o.getAttribute('disp')) {
			o.style.display = 'none';
		} else {
			o.style.visibility = "hidden";
			if (''+b=='undefined') o.style.display = 'none';
		}
	}
	function obj_escondeNS4(o,b) {
		if (typeof(o)=='string') o = browse.getId(o);
		o.visibility = "hide";
	}
	function obj_escondeIE4(o,b) {
		if (typeof(o)=='string') o = browse.getId(o);
		try {
			o.style.visibility = "hidden";
		} catch (e) {
		}
		try {
			if (''+b=='undefined') o.style.display = 'none';
		} catch (e) {
		}
	}
	//**************************//
	function obj_getAbsXNS6(o) {
		var a=o.offsetParent;
		if ((""+a).substring(0,4)=="[obj") {
			// & (""+a).indexOf("HTMLBodyElement")==-1) 
			//rr += "* "+a;
			return o.offsetLeft + obj_getAbsXNS6(a);
		} else {
			return o.offsetLeft;
		}
	}
	function obj_getAbsXNS4(o) {
		return o.x;
	}
	function obj_getAbsXIE4(o) {
		var a=o.offsetParent;
		if ((""+a).substring(0,4)=="[obj") {
			return o.offsetLeft + obj_getAbsXIE4(a);
		} else {
			return o.offsetLeft;
		}
	}
	//**************************//
	function obj_getDocFrameNS6(o) {
		return o.contentDocument;
	}
	//**************************//
	function obj_getDocFrameNS4(o) {
		alert("nao sei getDocFrameNS4");
		return o.contentDocument;
	}
	//**************************//
	function obj_getDocFrameIE4(o) {
		//lert("nao sei getDocFrameIE4"+obj(o.ownerDocument));
		return o.ownerDocument;
	}
	//**************************//
	function obj_getAbsYNS6(o) {
		var a=o.offsetParent;
		if ((""+a).substring(0,4)=="[obj") {
			return o.offsetTop + obj_getAbsYNS6(a);
		} else {
			return o.offsetTop;
		}
	}
	function obj_getAbsYNS4(o) {
		return o.y;
	}
	function obj_getAbsYIE4(o) {
		return obj_getAbsYNS6(o);
	}
}
