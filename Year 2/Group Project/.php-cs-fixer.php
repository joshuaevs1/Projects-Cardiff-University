<?php

$finder = PhpCsFixer\Finder::create()
    ->exclude('api')
    ->exclude('vendor')
    ->exclude('static')
    ->in(__DIR__)
;

$config = new PhpCsFixer\Config();
return $config->setRules([
    '@PhpCsFixer' => true,
]);