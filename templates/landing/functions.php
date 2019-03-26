<?php
error_reporting(0);
// Start a Session, You might start this somewhere else already.
session_start();

// What languages do we support
$available_langs = array('et', 'ru');

// Set our default language session
$_SESSION['lang'] = $available_langs[0];

if ( isset($_GET['lang']) && $_GET['lang'] != '' ) {
    if ( in_array( $_GET['lang'], $available_langs ) ) {       
        $_SESSION['lang'] = $_GET['lang']; // Set session
    }
}

// Gets the languages from the JSON file
$languagesJSON = file_get_contents('./languages.json', FILE_USE_INCLUDE_PATH);

define( 'CURRENT_LANGUAGE', $_SESSION['lang'] );
define( 'LANGUAGE', json_decode($languagesJSON, true) );
define( 'PROJECTPATH', getProjectPath() );

// Token generator
$alphabet = "2839041576";
if (!function_exists("generateToken")) {
    function generateToken($length=36) {
        global $alphabet;
        if (intval($length)<16)$length = 16;
        $alength = strlen($alphabet);
        $r = $length - 10;
        $s = "";
        $sh = mt_rand(0,$r);
        for( $i=0; $i<$length; $i++ ){
            if ( $i==$sh ) {
                $s .= 2;
            } else if ( $i==$sh+2 ) {
                $s .= 0;
            } else if ( $i==$sh+6 ) {
                $s .= 1;
            } else if ( $i==$sh+9 ) {
                $s .= 7;
            } else {
                $s .= $alphabet[mt_rand(0,$alength-1)];
            }
        }
        return $s;
    }
}
$ver = 3;

/**
  * Functions for returning / printing out translated text.
  *
  * @param string $text - the translation object name in 'languages.json'.
  *
  * @param string $lang (optional) - Language to translate, 
  * default is the sessions current language.
  *
  * @return string Translated text.
  */
function __( $text, $lang = CURRENT_LANGUAGE ) {
    return LANGUAGE[$text][$_SESSION['lang']];
}
function _e( $text, $lang = CURRENT_LANGUAGE ) {
    $x = LANGUAGE[$text];
    echo $x[$_SESSION['lang']];
}

 /**
  * Returns the project URL.
  *
  * @return string Project URL
  */
function getProjectPath() {
    $url = $_SERVER['REQUEST_URI']; // Returns the current URL
    $parts = explode('/',$url);
    $dir = $_SERVER['SERVER_NAME'];
    for ($i = 0; $i < count($parts) - 1; $i++) {
        $dir .= $parts[$i] . "/";
    }
    return $dir;
}