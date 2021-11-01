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
		$this->addBowerJS("angular/angular$min.js");
		# Slider
		$this->addBowerJS("angularjs-slider/dist/rzslider$min.js");
		$this->addBowerCSS("angularjs-slider/dist/rzslider$min.css");
		# Flow
		$this->addBowerJS("ng-flow/dist/ng-flow$min.js");
		# UI
		$this->addBowerJS("angular-dragdrop/src/angular-dragdrop$min.js");
		$this->addBowerJS("angular-sanitize/angular-sanitize$min.js");
		$this->addBowerJS("angular-ui-router/release/angular-ui-router$min.js");
		$this->addBowerJS("angular-jk-rating-stars/dist/jk-rating-stars$min.js");
		$this->addBowerCSS("angular-jk-rating-stars/dist/jk-rating-stars$min.css");
		# GDO
		$this->onIncludeGDOScripts();
	}
	
	private function onIncludeGDOScripts()
	{
		$this->addJS('js/gwf-module.js');

		$this->addJS('js/gdo-config-srvc.js');
		$this->addJS('js/gdo-type-srvc.js');
		
		$this->addJS('js/gwf-exception-srvc.js');
		$this->addJS('js/gwf-form-ctrl.js');
		$this->addJS('js/gwf-list-ctrl.js');
		$this->addJS('js/gwf-loading-srvc.js');
		$this->addJS('js/gwf-request-srvc.js');
		$this->addJS('js/gwf-sort-ctrl.js');
		$this->addJS('js/gwf-table-ctrl.js');
		$this->addJS('js/gwf-tree.js');
		$this->addJS('js/gwf-upload-ctrl.js');
		$this->addJS('js/ng-crsrup.js');
		$this->addJS('js/ng-enter.js');
		$this->addJS('js/ng-html.js');
	}
}
