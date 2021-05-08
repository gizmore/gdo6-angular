<?php
namespace GDO\Angular;

use GDO\Core\GDO_Module;
use GDO\DB\GDT_Checkbox;
use GDO\Javascript\Module_Javascript;

/**
 * AngularJS Includes.
 * @author gizmore
 * @version 6.10
 * @since 5.00
 */
final class Module_Angular extends GDO_Module
{
	public $module_priority = 15;
	
	public function onLoadLanguage() { return $this->loadLanguage('lang/angular'); }
	
	public function getConfig()
	{
	    return [
	        GDT_Checkbox::make('include_scripts')->initial('1'),
	    ];
	}
	public function cfgIncludeScripts() { return $this->getConfigValue('include_scripts'); }
	
	public function onIncludeScripts()
	{
	    // Can be disabled so it only gets included via Material module.
	    if ($this->cfgIncludeScripts())
	    {
	        $this->onIncludeAngularScripts();
	    }
	}
	
	public function onIncludeAngularScripts()
	{
		$min = Module_Javascript::instance()->jsMinAppend();
		
		# Angular
		$this->addBowerJavascript("angular/angular$min.js");
		# Slider
		$this->addBowerJavascript("angularjs-slider/dist/rzslider$min.js");
		$this->addBowerCSS("angularjs-slider/dist/rzslider$min.css");
		# Flow
		$this->addBowerJavascript("ng-flow/dist/ng-flow$min.js");
		# UI
		$this->addBowerJavascript("angular-dragdrop/src/angular-dragdrop$min.js");
		$this->addBowerJavascript("angular-sanitize/angular-sanitize$min.js");
		$this->addBowerJavascript("angular-ui-router/release/angular-ui-router$min.js");
		$this->addBowerJavascript("angular-jk-rating-stars/dist/jk-rating-stars$min.js");
		$this->addBowerCSS("angular-jk-rating-stars/dist/jk-rating-stars$min.css");
		# GDO
		$this->onIncludeGDOScripts();
	}
	
	private function onIncludeGDOScripts()
	{
		$this->addJavascript('js/gwf-module.js');

		$this->addJavascript('js/gdo-config-srvc.js');
		$this->addJavascript('js/gdo-type-srvc.js');
		
		$this->addJavascript('js/gwf-exception-srvc.js');
		$this->addJavascript('js/gwf-form-ctrl.js');
		$this->addJavascript('js/gwf-list-ctrl.js');
		$this->addJavascript('js/gwf-loading-srvc.js');
		$this->addJavascript('js/gwf-request-srvc.js');
		$this->addJavascript('js/gwf-sort-ctrl.js');
		$this->addJavascript('js/gwf-table-ctrl.js');
		$this->addJavascript('js/gwf-tree.js');
		$this->addJavascript('js/gwf-upload-ctrl.js');
		$this->addJavascript('js/ng-crsrup.js');
		$this->addJavascript('js/ng-enter.js');
		$this->addJavascript('js/ng-html.js');
	}
}
