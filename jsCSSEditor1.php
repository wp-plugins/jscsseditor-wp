<?
/*
Copyright (c) 2005 Signey John

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
		mar/2011 
		+comentários...
		+plugin wordpress
		+falta MEDIA http://www.w3.org/TR/CSS2/media.html
			Media Types 	Media Groups
				continuous/paged 	visual/audio/speech/tactile 	grid/bitmap 	interactive/static
			@media screen, 3D {
				P { color: green; }
			}
			@media print {
				body {
					background: none !important;
				}
				#wrapper {
					clear: both !important;
					display: block !important;
					float: none !important;
					position: relative !important;
				}
			}	
		+falta @page
			http://www.w3.org/TR/css3-page/
  */

	$copId = '@copId@';
	$copTo = '@copTo@';
	$versao = "3.0";
	
	
	//gLog('a','ctrl');
	//parametors - nao globais
	$op = param('op');
	$_fln = param('_fln');
	$_fl = param('_fl');
	$_folha = param('_folha');
	$_it = param('_it');
	$_sIt = param('_sIt');
	$refresh = param('_refresh');
	$refresh = isset($refresh);

	echo '<html><head><title>jsCSSEditor</title>'
		.'<script language="JavaScript" src="jsCSSEditor.js"></script>'
		.'<script language="JavaScript" src="funcoes.js"></script>'
		.'<script language="JavaScript" src="funcoes1.js"></script>'
		.'<LINK REL="StyleSheet" HREF="jsCSSEditor.css">'
		.'</head>'
		.'<body id=corpo '.($refresh?'':'onLoad=resize("tabR")')
			." onload=evento('load') onfocus=evento('focus')"
			." onresize=evento('resize'); onblur=evento('focusOut');"
			." onunload=evento('close');"
			.' onclick="jsCSSEditor(this,event);'
			//.'janLocObj(\'oCSS\').muda(event);'
			.'">'
		.'<script>var copIdPhp="'.$copId.'";'
		.'var versaoPhp="'.$versao.'";'
		.'var copToPhp="'.$copTo.'";'
		.'</script>'
	;

   //FOLHA edit TEXTO
	if (isset($_folha)) {
		//echo $_folha;
		$f = new css($_folha,'?');
		$folha = param('folha');
		if (isset($folha)) {
			$f->gravaTex($folha);
			//$f = new css($_folha);
			//alert($_folha.' was saved...');
			script(
				'if (confirm("'.$_folha.' was saved...\nREFRESH ["+top.opener.top.opener.document.title+"]?")) {'
				.' top.opener.top.opener.location = ""+top.opener.top.opener.location;'
				.'}'
				.'top.opener.top.close();'
			);
		} else {
			$f->edit();
		}
		echo '</body></html>';
		exit;
	}
  
	//PALETA janela
	if (isset($op)) {
		echo '<script>'
			."document.title = 'Paleta - '+document.title;"
		;
		if ($op=='pal') {
			$ex = param('ex');
			$cor = param('cor');
			echo "var pal = new paletaCores('pal');"
				."pal.selExec ='$ex';"
				."pal.scor = '$cor';"
				."document.write(pal.monta());"
			;
		}
		echo '</script></body></html>';
		exit;
	}
 
	//GRAVA um estilo altera folha
	if (isset($_fl)) {
		script('window.onload=0;');
		$g = new css($_fln,'?');
		$tProp = 0;
		$pos = param("_stP");
		$ng = $g->grava();
		echo 
			($ng!=-1?'<h1>'.$g->aq.' Recorded!<br>'.param("_st").' ('.param("_stP")
				.')<br><font color=red>'
				.'defs: '.$ng.' props: '.$tProp.'</font></h1>'
			.'<script>'
			.($pos<-1
				?"var c = janLocObj('oCSS');c.novo($_fl,$pos,".(count($g->v)-1).");"
					//."c.refresh(top.opener);"
				:''
			)
			.'setTimeout("fimGrava()",1000);'
			.'function fimGrava() {'
			//.' window.close();'
			.' window.location="?_it='
				.param('_it').'&_sIt='.urlencode(param('_sIt')).'&_refresh=1";'
			.'}'
			:'')
			.'</script></body></html>'
		;
		exit;
	}
 
	//INÍCIO - lista de classes a editar
	if (!isset($_it)) {
		//1 - ler todas as folhas e procurar por @include
		//2 - 
		echo '<script>'
			."var fl;"
			."top.vFls=new Array();"
			."top.nFls=new Array();"
		;
		//echo('<hr>fls='.param('_fls'));
		//echo('<hr>loc='.param('_loc'));
		//exit;
		$v = palavraA(param('_fls'),',');
		$strCookie = '';
		for ($i=0;$i<count($v);$i++) {
			//$c = new css($v[$i],''.$i);
			$v1 = palavraA($v[$i],'~');
			$c = new css($v1[1],$v1[0]);
			$c->js();
		}
		echo "var strCookie = 'c_".md5($strCookie)."';"
			."top.oCSS=new jsCSSEditor();top.oCSS.lista();"
			."</script>"
			.'</body></html>';
		exit;
	}

	//EDIT janela 1 classe
	echo '<script>janLocObj("oCSS").edit('.$_it.',"'.$_sIt.'",document);'
		.'top.document.title = "Class Edit - jsCSSEditor"'
		.'</script></body></html>'
	;

	//*********************************************
	//CLASSE folha de estilo
	//*********************************************
	class css {
		var $v = Array();
		var $vO= Array();
		//*********************************************
		function txt($co=false) {
			$tx='';
			//@import
			for ($i=0;$i<count($this->import);$i++) {
				$tx .= '@import url('.$this->import[$i].");".lf().lf();
			}
			
			//definicoes
			$this->ng=0;
			for ($i=0;$i<count($this->v);$i++) {
				$es = $this->vO[$this->v[$i]];
				$pr = $es->grava();
				if ($pr!='') {
					$this->ng++;
					if ($co) {
						$tx .= troca($pr,lf(),"").lf();
					} else {
						$tx .= $pr.lf().lf();
					}
				}
			}
			return $tx;
		}
		//*********************************************
		function edit() {
			$co = param('_co');
			$co = isset($co);
			echo '<form method=POST>'
				.'<table id=tabR width=100%><tr><td><h2>'.$this->aqa
				.' <input type=button onclick=(event.ctrlKey?0:this.form.submit()); value=Save>'
				.'</h2>'
				.'<tr><td class=editFolha>'
					.'<input type=hidden name=_refresh value=1>'
					.'<input type=hidden name=_folha value="'.$this->aqa.'">'
					.'<textarea class=editFolha WRAP=off rows=37 name=folha>'
			;
			echo $this->txt($co);
			echo '</textarea>'
				.'<tr><td><input type=button onclick=(event.ctrlKey?0:this.form.submit()); value=Save>'
				//.'<br><br><br>&nbsp;'
				.'</table></form>'
			;
		}
		//*********************************************
		function put($es,$pos=-1,$merge=true) {
			if (is_string($es)) {
				$es = new cssCl($es);
			}
			if ($pos==-1) {
				$pos = count($this->v);
			}
			$ch = $pos.'}'.$es->nome;
			if (!$this->vO[$ch]) {
				$this->v[] = $ch;
				$this->vO[$ch] = $es;
				return;
			}
			if (!$merge) {
				$this->vO[$ch] = $es;
				return;
			}
			$this->vO[$ch]->merge($es);
		}
		//*********************************************
		function js() {
			global $strCookie;
			$strCookie .= $this->aqa.lf();
			//tem subfolha?
			for ($i=0;$i<count($this->import);$i++) {
				$fl = new css($this->import[$i],$this->pos.'.'.$i);
				$fl->js();
			}
			echo "\n\n//nova FOLHA\n".'fl=top.nFls.length;'
				."\n// url folha, posicao, ???, @media\n"
				.'top.nFls[fl] = new Array("'.$this->aqa.'","'.$this->pos.'",true);'
				.'top.vFls[fl] = new Array();'
			;
			for ($i=0;$i<count($this->v);$i++) {
				echo lf()."top.vFls[fl][$i] = ".$this->vO[$this->v[$i]]->js($i);
			}
		}
		//*********************************************
		function gravaTex($tx) {
			global $versao;
  
			//grava
			$f = fopen($this->aq,'a+');
			if (!$f) {
				echo "ERRO gravação em $this->aq";
				script(
					'alert("jsCSSEditor, ERROR open(WRITE) '
					.$this->aq.'...");'
				);
				exit;
			}
			fclose($f);

			//backup
			$arqtmp = $this->aq;
			if (!file_exists($this->aq.'-bak')) {
				script(
					'alert("BACKUP: '.$this->aq.' -> '.$this->aq.'-bak...");'
				);
				rename($this->aq,$this->aq.'-bak');
			} else {
				//falta verificar choque gravação - eqto
				//está gravando outro pode ler incompleto e gravar besteira
				$arqtmp = md5($_st.$_fl.ip().nav()).'.css';
				//temporário no mesmo dir...
				if (strpos(' '.$this->aq,'/')>0) {
					$arqtmp = leftRat($this->aq,'/').'/'.$arqtmp;
				}
				if (!rename($this->aq,$arqtmp)) {
					script(
						'alert("error, rename for write");'
					);
					return;
				}
			}

			//re-abre
			$f = fopen($arqtmp,'w');
			//fwrite($f,"/* jsCSSEditor $versao */".lf().lf());
			fwrite($f,$tx.lf().lf());
			fclose($f);
   
			//renomeia
			if (!rename($arqtmp,$this->aq)) {
				script(
					'alert("ERROR, rename '.$arqtmp.' to '.$this->aq.'");'
				);
			}
		}
		//*********************************************
		function grava() {
			global $versao;
			$_st = param('_st');
			$_stP = param('_stP'); //posicao na folha
			$_fl = param('_fl');
			echo '<h3>estilo <font color=red>'.$_st.'</font></h3>';
			
			$ch = $_stP.'}'.$_st;
			if ($_stP<-1) {
				//inclusão de novo estilo
				$_stP = count($this->v);
			} else if (!$this->vO[$ch]) {
				$er = "fail write: ch='$ch' no arq $this->aqa";
				echo $er;
				print_r($this->vO);
				alert($er);
				return -1;
			}

			//monta estilo novo/atualizado
			$nova = new cssCl($_st.' {  }');
			while (list($key, $value) = each ($_POST)) {
				if (left($key,1)!='_' && trimm($value)!='') {
					if (strpos(' '.$value,"\\")>0) {
						//alert($key.','.$value);
						$value = troca($value,"\\","");
					}
					$nova->set($key,$value); 
				}
			}
			$this->put($nova,$_stP,false);
   
			$tx = $this->txt();
			$this->gravaTex($tx);
			
			return $this->ng;
		}
		//*********************************************
		function css($_fln,$pos) {
			if (strpos($_fln,'?')!==false) {
				$_fln = substr($_fln,0,strpos($_fln,'?'));
			}
			$this->aqa = $_fln;
			//$this->aq = '..'.$_fln;
			//substr(dirname(__FILE__),0,strlen($_SERVER["DOCUMENT_ROOT"]))
			$this->aq = $_SERVER["DOCUMENT_ROOT"].$_fln;
			$this->pos = $pos;
			//echo '<hr>'.$this->aq;

			//echo '<table border=1>';
			if (!file_exists($this->aq)) {
				if (file_exists($_fln)) {
					alert("$this->aq = $_fln");
					$this->aq = $_fln;
				} else {
					echo "alert('ERROR file $this->aq ou $_fln not exits');";
					return;
				}
			}
			$f = fopen($this->aq,'r');
			if (!$f) {
				echo "ERRO lendo em $this->aq";
				script(
					'alert("jsCSSEditor, ERROR open(ro) '
					.$this->aq.'...");'
				);
				exit;
			}
			$l = '';
			$this->v = array();
			$this->import = array();
			$this->vO = array();
			//carrega do arquivo
			while (!feof ($f)) {
				$b = trimm(fgets($f, 400));
				if ($b=='') {
					$l .= "\n";
				} else if (substr($b,0,7)=='@import') {
					if (count($this->v)==0) {
						$im = trimm(substrAt($b,' '),' "\';');
						if (equals($im,'url(')) {
							$im = trimm(substr($im,4),' "\');');
						} 
						$this->import[] = absoluteUrl($im,$this->aqa);
					} else {
						echo "alert('ERROR:\\nline $b \\nin\\n $this->aq');";
					}
					//@import url(layout.css); 
				// else if (substr($b,0,1)=='/' || substr($b,0,1)=='<') 
					//$this->v[count($this->v)] = $b;
				} else {
					$l .= $b."\n";
					if (right($b,1)=='}') {
						$this->put($l);
						$l = '';
					}
				}
			}
			//echo '</table>';

			fclose ($f);
		}
	}
	//*********************************************
	//CLASSE estilo
	//*********************************************
	class cssCl {
		//*********************************************
		function merge($es) {
			while (list($key, $value) = each ($es)) {
				if (trimm($value)!='') {
					$this->set($key,$value);
				}
			}
		}
		//*********************************************
		function espande() {
			$vr = array();
			while (list($key, $value) = each ($this->v)) {
				if ($key=='-moz-opacity' || $key=='opacity' 
					|| ($key=='filter' && equals($value,'Alpha(opacity=')) ) {
					if (equals($value,'Alpha(opacity=')) {
						$value = substrAtAt($value,'=',')')/100;
					}
					$vr['opacity']=$value;
					$vr['-moz-opacity'] = $value;
					$vr['filter'] = 'Alpha(opacity='.(100*$value).')';
				} else if ($key=='cursor' 
						&& ($value=='pointer' || $value=='hand')) {
					//manter cursor compativel com IE
					$vr[$key] = 'pointer';
					$vr[$key.' '] = 'hand';
				} else {
					$vr[$key] = $value;
				}
			}
			$this->v = $vr;
		}
		//*********************************************
		function set($key,$value) {
			if ($key=='/*') {
				$key .= '_'.($this->ncom++);
				$this->v[$key]  = $value;
				return;
			}
			//tem comentario no valor?
			if (($i=strpos($value,'/*'))!==false) {
				$com = trimm(substr($value,$i));
				$this->vc[$key] = $com;
			}
			//tira ;
			$value = leftAt($value,';');
			
			$value = trimm($value);
			$key = trimm($key);
			if ($key=='-moz-opacity' || $key=='opacity'
				|| ($key=='filter' && equals($value,'Alpha(opacity='))) {
				if (equals($value,'Alpha(opacity=')) {
					$value = substrAtAt($value,'=',')')/100;
				}
				$this->v['opacity']=$value;
			} else if ($key=='cursor' 
					&& ($value=='pointer' || $value=='hand')) {
				$this->v[$key] = 'pointer';
			} else {  
				$this->v[$key] = $value;
			}
		}
		//*********************************************
		function js($pos) { 
			$r = '';
			$np = 0;
			while (list($key, $value) = each ($this->v)) {
				if (trimm($key)=='' || trimm($value)=='') {
				} else if (equals($key,'/*')) {
					//comentario...
				} else {
					$r .= ' '.troca($key,"\n",'\n').': '.troca($value,"\n",'\n').';';
					$np++;
				}
			}
			if (false && $np==0) { //manda vazio tb
				return '';
			} else {
				$r = troca($r,"'","\\'");
				//return $nm."['$this->nome'] ='_pos:$pos;$r';";
				$n = troca($this->nome,"\n",'\n');
				return "new estilo('$n','{pos:$pos;$r');"
					//."alert('ok');"
				;
			}
		}
		//*********************************************
		function grava() {
			$vr = array();
			//manter compatibilidade
			$this->espande();
			$np = 0;
			$r = '';
			for ($i=0;$i<count($this->coment);$i++) {
				$r .= '/*'.lf().' '.troca($this->coment[$i],"\n","\n ").lf().'*/'.lf();
			}
			$r .= $this->nome." {".lf();
			while (list($key, $value) = each ($this->v)) {
				if (trimm($key)=='' || trimm($value)=='') {
				} else if ($key=='=') {
				} else if ($key=='==') {
					$r = leftAt($r,' {').','.$value.' {'.substrAt($r,'{');
				} else if (equals($key,'/*')) {
					$r .= ' /* '.troca($value,"\n","\n ").' */'.lf();
				} else {
					$r .= ' '.trimm($key).': '.$value.";"
						.($this->vc[key]?' '.$this->vc[key]:'')
						.lf()
					;
					$np++;
				}
			}
			//if ($np==0) { //retorna mesmo vazio para manter a ordem 
			//	return '';
			//}
			global $tProp;
			$tProp += $np;
			return $r.'}';
		}
		//*********************************************
		function cssCl($l) {
			$this->ncom = 0; //coment junto as prop
			$this->vc = array(); //coment junto as prop
			$this->coment = array();
			$n = trimm(leftAt($l,'{'));
			while (equals($n,'/*')) {
				$this->coment[] = trimm(leftAt(substr($n,2),'*/'));
				$n = trimm(substrAt($n,'*/'));
			}
			$this->nome = trimm($n);
			$n = palavraA(strtolower($this->nome),'.');
			//ordem de gravação - REVER, manter ordem original
			if (count($n)>1) {
				$n1 = palavraA($n[1],':');
				if (count($n1)>1) {
					$this->ordem = $n1[0].'.'.$n[0].':'.$n1[1];
				} else {
					$this->ordem = $n[1].'.'.$n[0];
				}
			} else {
				$this->ordem = '.'.$n[0];
			}
			$v = palavraA(trimm(substrAtAt($l,'{','}')),"\n");
			$this->v = Array();
			for ($i=0;$i<count($v);$i++) {
				$n = trimm($v[$i]);
				//aceita coment multiplas linhas
				if (equals($n,'/*')) {
					while (strpos($n,'*/')===false) {
						$n .= "\n".$v[++$i];
					}
					//armazena comentario
					$this->set('/*',leftAt(substr($n,2),'*/'));
					$n = substrAt($n,'*/');
				}
				if (strpos($n,':')) {
					//se for na linha da prop o comentário tem q finalizar na mesma linha
					$this->set(leftAt($n,':'),substrAt($n,':'));
				} 
			}
		}
		//*********************************************
		function cssClAnt($l) {
			$n = trimm(leftAt($l,'{'));
			$this->nome = trimm($n);
			$n = palavraA(strtolower($this->nome),'.');
			//ordem de gravação - REVER, manter ordem original
			if (count($n)>1) {
				$n1 = palavraA($n[1],':');
				if (count($n1)>1) {
					$this->ordem = $n1[0].'.'.$n[0].':'.$n1[1];
				} else {
					$this->ordem = $n[1].'.'.$n[0];
				}
			} else {
				$this->ordem = '.'.$n[0];
			}
			$v = palavraA(trimm(substrAtAt($l,'{','}')),';');
			$this->v = Array();
			for ($i=0;$i<count($v);$i++) {
				if (strpos($v[$i],':')) {
					$this->set(leftAt($v[$i],':'),substrAt($v[$i],':'));
				}
			}
		}		
	}

//*************************************************************
//LIB
//*************************************************************
	//*********************************************
	function arrayIns($a,$pos,$novo) {
		$r = Array();
		for ($i=0;$i<=$pos;$i++) {
			$r[$i] = $a[$i];
		}
		$r[$pos+1] = $novo;
		for ($i=$pos+1;$i<count($a);$i++) {
			$r[$i+1] = $a[$i];
		}
		return $r;
	}
	//*********************************************
	function getcookie($n) {
		return $_COOKIE[$n];
	}
	//*********************************************
	function srv($nome) {
		return $_SERVER[$nome];
	}
	//*********************************************
	function ss($nome,$valor) {
		$_SESSION[$nome] = $valor;
	}
	//*********************************************
	function s($nome) {
		return $_SESSION[$nome];
	}
	//*********************************************
	function java($n) {
		return troca($n,"'","\\'");
	}
	//*********************************************
	function alert($n) {
		script("alert('".java($n)."');");
	}
	//*********************************************
	function script($n) {
		echo '<script>'.$n.'</script>';
	}
	//*********************************************
	function obj($n,$o=null) {
		if ($o==null) {
			$o = $n;
			$n = 'sem nome';
		}
		$t = gettype($o);
		if (!isset($o)) {
			echo "$n Vazio...";
		} else if ($t=='array' || $t=='object') {
			echo '<table border=1>';
			echo '<tr><th colspan=2>'.$n.' ('.$t.')';
			reset ($o);
			while (list($key, $value) = each ($o)) {
				echo '<tr><td>'.$key.'<td>';
				obj('',$value);
			}
			echo '</table>';
			return;
		}
		if ($t=='boolean') {
			$o = ($o?'true':'false');
		}
		echo "$n $o ($t)";
	}



//*************************************************************
function troca($a,$b,$c) {
	return str_replace($b,$c,$a);
}
function LerArq($arq) {
	$s = new Server();
	return $s->Txt_Ler($arq);
}

function iif($a,$b,$c) {
	if ($a) return $b;
	return $c;
}
function typeof($a) {
/*
"integer"
"double"
"string"
"array"
"object"
"unknown type"
*/
	return gettype($a);
}

function palavraA($a,$b) {
	return explode($b,$a);
}
function palavrav($a,$b) {
	return explode($b,$a);
}
function instr($a,$b) {
	//echo "<hr>$a=$b";
	$x = strpos($b,$a);
	if (typeof($x)=='boolean') return -1;
	return $x;
}
function leftAt($a,$b) {
	return left($a,strpos($a.$b,$b));
}
function substrAt($a,$b) {
	return substr($a,strpos($a.$b,$b)+strlen($b));
}
function rat($a,$b) {
	for ($i=strlen($a)-strlen($b);$i>-1;$i--) {
		if (substr($a,$i,strlen($b))==$b) {
			return $i;
		}
	}
	return -1;
}
function substrRat($a,$b) {
	$i = rat($a,$b);
	if ($i==-1) {
		return $a;
	} else {
		return substr($a,$i+1);
	}
}
function leftRat($a,$b) {
	$i = rat($a,$b);
	if ($i==-1) {
		return $a;
	} else {
		return substr($a,0,$i);
	}
}
function substrAtAt($a,$b,$c) {
	$i = strpos($a,$b) + strlen($b);
	$f = strpos($a,$c,$i);
	if (!$i==false & !$f==false) {
		$f -= $i;
		return substr($a,$i,$f);
	}
	return '';
}
function left($a,$b) {
	return substr($a,0,$b);
}
function alltrim($a) {
	return trim(ltrim($a));
}
function right($a,$b) {
	return substr($a,strlen($a)-$b);
}
function trimm($a,$x = "") {
	if ($x=="") $x = chr(32).chr(13).chr(10).chr(9);
	$i = 0;
	while (strpos($x,substr($a,$i,1))!==false) $i++;
	if ($i!=0) $a = substr($a,$i);

	$i = strlen($a)-1;
	while (strpos($x,substr($a,$i,1))!==false) $i--;
	if ($i!=(strlen($a)-1)) $a = substr($a,0,$i+1);
	return $a;
}
function d($t) {
	global $debug;

	//html
	if ($debug==1) {
		echo '<br><font color=green>#='.$t.'</font><br>';
	}

}
function erro($t) {
	global $debug;

	//html
	echo '<br><font color=red>ERRO='.$t.'</font><br>';

}
function ascan($v,$d) {
	$t = count($v);
	if (gettype($v[0])=='array') {
		for ($i=0;$i<$t;$i++) {
			if ($d==$v[$i][0]) return $i;
		}
	} else {
		for ($i=0;$i<$t;$i++) {
			if ($d==$v[$i]) return $i;
		}
	}
	return -1;

}
function mostraasc($st) {
	$r = strlen($st).'=';
	for ($i=0;$i<strlen($st);$i++) {
		$r .= ord(substr($st,$i,1)).',';
	}
	return $r;
}
//number_format(float number, int decimals, string dec_point, string thousands_sep);
function formatint($v) {
	return number_format($v,0,',','.');
}
function formatdec($v,$d) {
	return number_format($v,$d,',','.');
}

function rnd($x,$y) {
	static $i=7;

	srand((double)microtime()*51134*$i*8157);
	$i = rand($x,$y);
	return $i;

}

//*************************************************************
// OBJETO Data
//*************************************************************
class Data {
	var $segs;
 
	//mktime(int hour, int minute, int second, int month, int day, int year, int [is_dst]);
	function nSem() {
		$d = date('D',$this->segs);
		$p = strpos($this->tbDI,$d);
		return substr($this->tbDP,$p,3);
  
		for ($i=0;$i<10;$i++) {
			echo ''.date('D',$this->segs);
			$this->segs += 24*60*60*1000;
		}
	}
	function nMes() {
		$d = date('D',$this->segs);
		$p = strpos($this->tbMI,$d);
		return substr($this->tbMP,$p,$p+3);
	}
	function strLocalS() {
		return $this->nSem().', '.$this->dtL;
	}
	function strLocal() {
		return $this->dtL;
	}
	function strSql() {
		return $this->dt;
	}
	function Data($s) {
		$this->tbDI = 'ThuWedTueMonSunSatFri';
		$this->tbDP = 'QuiQuaTerSegDomSabSex';
		$this->tbMI = 'JanFebMarAprMayJunJulAugSepOctNovDec';
		$this->tbMP = 'JanFevMarAbrMaiJunJulAgoSetOutNovDec';
		if (instr(',',$s)>-1) {
			$this->gmt($s);
		} elseif ($s!='') {
			$s1 = palavrav($s,' ');
			$s2 = palavrav($s1[1],':');
			$s1 = palavrav($s1[0],'-');
			$this->segs = mktime($s2[0],$s2[1],$s2[2],$s1[1],$s1[2],$s1[0]);
		} else {
			$this->segs = time();
		}
		$this->dt = date("Y-m-d H:i:s",$this->segs);
		$this->dtL = date("d/m/Y H:i",$this->segs);
	}
	function gmt($v) {
		//0    1 2   3    4        5
		//Mon, 7 Aug 2000 19:41:04 -0400
		$v = palavrav($v,' ');
		$m = instr($v[2],$this->tbMI)/3+1;
		$v[4] = palavrav($v[4],':');
		//h m s mes dia ano
		$this->segs = mktime($v[4][0],$v[4][1],$v[4][2],$m,$v[1],$v[3]);
	}
	function Segs($data) {
		return $this->segs - $data->segs;
	}
}

//******************************
function gLog($msg,$lg) {
	if (!isset($lg)) {
		$lg = 'log.txt';
	} else {
		if (strpos($lg,'.')==false) {
			$lg = 'log'.$lg.'.txt';
		}
	}
	$f = fopen($lg,"a+");
	if ($f) {
		fwrite($f,date("Y-m-d H:i:s",time()).
			"\t".ip()."\t$msg\t$".nav()."\t".ref()."\n");
		fclose($f);
	} else {
		//echo "ERRO GRAVANDO LOG<br>";
	}  
}
	//**********************
	function param($n) {
		return $_REQUEST[$n];
	}
	//**********************
	function paramPost($n) {
		return $_POST[$n];
	}
	//**********************
	function paramGet($n) {
		return $_GET[$n];
	}
	//******************************
	function ip() {
		return $_SERVER["REMOTE_ADDR"];
	}
	//******************************
	function nav() {
		return $_SERVER["HTTP_USER_AGENT"];
	}
	//******************************
	function ref() {
		return $_SERVER["HTTP_REFERER"];
	}
	//**************************//
	function trocaTudo($s,$s1,$s2) {
		while (($t=troca($s,$s1,$s2))!=$s) $s=$t;
		return $s;
	}
	//******************************
	function equals($a,$b) {
		//echo substr($a,0,strlen($b)).'=='.$b;
		return substr($a,0,strlen($b))==$b;
	}
	//**************************//
	function lf() {
		return "\r\n";
	}
	//**************************//
	function absoluteUrl($url,$base) {
		if (equals($url,'/')) {
			return $url;
		}
		if (equals($url,'http://') || equals($url,'https://')) {
			return '/'.substrAt(substrAt($url,'//'),'/');
		}
		if (equals($base,'http://') || equals($base,'https://')) {
			$base = '/'.substrAt(substrAt($base,'//'),'/');
		}
		if (strpos($base,'?')) {
			$base = leftAt($base,'?');
		}
		$base = leftRat($base,'/');
		$url = trocaTudo($base.'/'.$url,'//','/');
		$url = troca($url,'/./','/');
		while (strpos($url,'/../')!==false) {
			$url = leftAt(leftAt($url,'/../'),'/').'/'.substrAt($url,'/../');
		}
		return $url;
	}	
?>
