<?php
/*
Plugin Name: jsCSSEditor: WYSIWYG/Context CSS Editor
Plugin URI: http://3wsistemas.com.br/jsCSSEditor/
Description: Plugin Cascading Stylesheet (CSS) editor (WYSIWYG/Context).  [<a href="options-general.php?page=jsCSSEditor.php">no Settings</a>]
Version: 1.0
Author: Signey
Author URI: http://3wsistemas.com.br/
*/
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

//echo '<h1>ok</h1>';

//inicia variáveis
//global $dr;
$jsCSSEditor_par = array(
	'name' => 'jsCSSEditor'
	,'version' => '1.0'
	,'php' => __FILE__
	,'dr' => dirname(__FILE__)
	,'dru' => substr(dirname(__FILE__),strlen($_SERVER["DOCUMENT_ROOT"]))
	,'url' => $_SERVER['REQUEST_URI']
);


if (!function_exists('add_filter')) {
	include jsCSSEditor('dr').'/jsCSSEditor1.php';
	exit;
	echo 'dr='.jsCSSEditor('dr');
	echo '<br>scr='.jsCSSEditor('scr');
	if (strpos(jsCSSEditor('url'),'.php')!==false && strpos(jsCSSEditor('php'),jsCSSEditor('url'))!==false) {
		echo jsCSSEditor('url').' editar...';
		exit;
	}
	echo 'não pode ser chamada diretamente...';
	exit;
}

//*****************************************
add_filter('wp_head', 'jsCSSEditor_head');
function jsCSSEditor_head() {
	if (jsCSSEditor_permissao()) {
		echo '<script type="text/javascript" src="'.jsCSSEditor('dru').'/jsCSSEditor.js?ver='.jsCSSEditor('version').'"></script>'."\n"
			. '<script type="text/javascript" src="'.jsCSSEditor('dru').'/funcoes.js?ver='.jsCSSEditor('version').'"></script>'."\n"
			. '<script type="text/javascript" src="'.jsCSSEditor('dru').'/funcoes1.js?ver='.jsCSSEditor('version').'"></script>'."\n"
			.'<script>'
			.'var jsCSSEditor_gravador = "'.jsCSSEditor('dru').'/jsCSSEditor.php";'
			.'window.addEventListener("click",jsCSSEditor,false);'
			.'</script>'
			."\n"
		;
	}
}
//*****************************************
// retorna se está logado e tem permissão design
function jsCSSEditor_permissao() {
	return is_user_logged_in();
}
//*****************************************
// retorna variavel do plugin
function jsCSSEditor($n) {
	global $jsCSSEditor_par;
	return $jsCSSEditor_par[$n];
}



/*
init
the_content
the_title
get_the_excerpt
the_excerpt
wp_head
admin_head
admin_print_scripts-
admin_menu
plugin_action_links
*/
?>
